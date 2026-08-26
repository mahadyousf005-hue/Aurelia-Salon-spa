-- Aurelia Salon & Spa
-- Run this file in Supabase Dashboard > SQL Editor.
-- The Express API should use the service-role key server-side only.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'staff', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('customer', 'staff', 'admin'));

create table if not exists public.salon_state (
  id boolean primary key default true check (id),
  users jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  promotions jsonb not null default '[]'::jsonb,
  staff jsonb not null default '[]'::jsonb,
  customers jsonb not null default '[]'::jsonb,
  appointments jsonb not null default '[]'::jsonb,
  availability jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id text primary key,
  name text not null,
  email text not null unique,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'staff', 'admin')),
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  name text not null,
  category text not null,
  price numeric(12, 2) not null check (price >= 0),
  duration integer not null check (duration > 0),
  description text not null default '',
  image text,
  rating numeric(3, 2) not null default 5,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id text primary key,
  title text not null,
  description text not null default '',
  discount text not null,
  discount_type text check (discount_type in ('percentage', 'flat')),
  discount_value numeric(12, 2),
  code text unique,
  start_date date,
  end_date date,
  category text,
  badge text,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists public.staff (
  id text primary key,
  user_id text unique references public.users(id) on delete set null,
  name text not null,
  email text not null unique,
  phone text,
  specialization text,
  experience text,
  rating numeric(3, 2) not null default 5,
  status text not null default 'Active',
  services jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id text primary key,
  user_id text unique references public.users(id) on delete set null,
  name text not null,
  email text not null unique,
  phone text,
  total_visits integer not null default 0,
  last_visit date,
  role text not null default 'customer' check (role = 'customer'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  staff_id text not null references public.staff(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  break_start time,
  break_end time,
  unique (staff_id, day_of_week)
);

create table if not exists public.appointments (
  id text primary key,
  booking_id text not null unique,
  customer_id text references public.customers(id) on delete set null,
  staff_id text references public.staff(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  mobile_number text not null,
  email text,
  service_name text not null,
  services jsonb not null default '[]'::jsonb,
  staff_name text,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  duration integer not null check (duration > 0),
  total_duration integer not null check (total_duration > 0),
  total_price numeric(12, 2) not null check (total_price >= 0),
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_method text not null default 'pay_at_salon',
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  transaction_reference text,
  payment_screenshot text,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists appointments_date_idx on public.appointments (appointment_date, staff_id, start_time);
create index if not exists appointments_customer_idx on public.appointments (customer_id, email);
create index if not exists services_status_idx on public.services (status);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at before update on public.users
for each row execute function public.set_updated_at();
drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at before update on public.services
for each row execute function public.set_updated_at();
drop trigger if exists staff_updated_at on public.staff;
create trigger staff_updated_at before update on public.staff
for each row execute function public.set_updated_at();
drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at before update on public.customers
for each row execute function public.set_updated_at();

-- API access is server-side. Keep RLS enabled and expose no tables directly to the browser.
alter table public.users enable row level security;
alter table public.services enable row level security;
alter table public.promotions enable row level security;
alter table public.staff enable row level security;
alter table public.customers enable row level security;
alter table public.availability enable row level security;
alter table public.appointments enable row level security;
alter table public.salon_state enable row level security;
alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id and role in ('customer', 'staff'));

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data->>'role', 'customer');
  profile_name text := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  profile_phone text := new.raw_user_meta_data->>'phone';
begin
  if requested_role not in ('customer', 'staff') then
    requested_role := 'customer';
  end if;

  insert into public.users (id, name, email, phone, role, password_hash)
  values (new.id::text, profile_name, lower(new.email), profile_phone, requested_role, 'managed-by-supabase-auth')
  on conflict (id) do update set name = excluded.name, phone = excluded.phone, role = excluded.role;

  insert into public.profiles (id, full_name, email, phone, role)
  values (new.id, profile_name, lower(new.email), profile_phone, requested_role)
  on conflict (id) do update set full_name = excluded.full_name, phone = excluded.phone, role = excluded.role;

  if requested_role = 'customer' then
    insert into public.customers (id, user_id, name, email, phone, total_visits, role)
    values (new.id::text, new.id::text, profile_name, lower(new.email), profile_phone, 0, 'customer')
    on conflict (id) do update set name = excluded.name, phone = excluded.phone;
  else
    insert into public.staff (id, user_id, name, email, phone, specialization, experience, rating, status, services)
    values (new.id::text, new.id::text, profile_name, lower(new.email), profile_phone, 'Staff Member', 'New', 5, 'Active', '[]'::jsonb)
    on conflict (id) do update set name = excluded.name, phone = excluded.phone;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- No demo accounts are seeded. Create admin accounts manually in Supabase Auth.
