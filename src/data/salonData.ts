import { SalonService, Promotion, StaffMember, Customer, Appointment, AvailabilitySlot } from '../types';

export const INITIAL_SERVICES: SalonService[] = [
  {
    id: "srv-1",
    _id: "srv-1",
    name: "Signature Haircut & Style",
    category: "Hair",
    price: 1200,
    duration: 45,
    description: "Personalized precision haircut with luxury botanical shampoo, restorative scalp massage, and custom blowout styling.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    status: "Active"
  },
  {
    id: "srv-2",
    _id: "srv-2",
    name: "Radiance Glow Facial",
    category: "Facial",
    price: 2000,
    duration: 60,
    description: "Deep ultrasonic cleansing, lymphatic drainage massage, organic botanical steam, and brightening vitamin C gold mask.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    rating: 4.95,
    status: "Active"
  },
  {
    id: "srv-3",
    _id: "srv-3",
    name: "Full Body Swedish Massage",
    category: "Spa",
    price: 2500,
    duration: 75,
    description: "Therapeutic full body massage utilizing warm essential oils to alleviate tension, stimulate circulation, and soothe sore muscles.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    rating: 4.98,
    status: "Active"
  },
  {
    id: "srv-4",
    _id: "srv-4",
    name: "Deluxe Gel Manicure",
    category: "Nails",
    price: 1500,
    duration: 50,
    description: "Complete cuticle therapy, exfoliating hand scrub, hydrating mask, and long-lasting glossy chip-resistant gel polish.",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    rating: 4.88,
    status: "Active"
  },
  {
    id: "srv-5",
    _id: "srv-5",
    name: "Royal Bridal Makeup & Styling",
    category: "Makeup",
    price: 8000,
    duration: 120,
    description: "High-definition luxury bridal artistry, airbrush contouring, custom lash extensions, and intricate hair jewel setting.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    status: "Active"
  },
  {
    id: "srv-6",
    _id: "srv-6",
    name: "Signature Aurelia Spa Day",
    category: "Spa",
    price: 4500,
    duration: 150,
    description: "The ultimate rejuvenation ritual combining aromatherapy steam, full body scrub, tension-relief massage, and express facial.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    rating: 4.97,
    status: "Active"
  },
  {
    id: "srv-7",
    _id: "srv-7",
    name: "Keratin Smooth Rebonding",
    category: "Hair",
    price: 6500,
    duration: 180,
    description: "Intensive keratin protein infusion that eliminates frizz, restores molecular shine, and delivers silky straight locks for months.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    rating: 4.92,
    status: "Active"
  },
  {
    id: "srv-8",
    _id: "srv-8",
    name: "Balayage & Multi-Tone Highlights",
    category: "Hair",
    price: 4800,
    duration: 120,
    description: "Hand-painted dimensional highlights with bespoke gloss toner and bond-building Olaplex conditioning treatment.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
    rating: 4.89,
    status: "Active"
  },
  {
    id: "srv-9",
    _id: "srv-9",
    name: "Hydrating Rose Gold Pedicure",
    category: "Nails",
    price: 1800,
    duration: 55,
    description: "Rose petal milk soak, botanical sea-salt scrub, callused heel therapy, reflexology foot massage, and gel enamel finish.",
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80",
    rating: 4.91,
    status: "Active"
  },
  {
    id: "srv-10",
    _id: "srv-10",
    name: "Anti-Aging Collagen Facial",
    category: "Facial",
    price: 2800,
    duration: 70,
    description: "Micro-current facial contouring, peptide peptide booster serum, gold collagen biocellulose sheet, and SPF hydration lock.",
    image: "https://images.unsplash.com/photo-1512290900672-1f5be1c6d3df?auto=format&fit=crop&w=800&q=80",
    rating: 4.94,
    status: "Active"
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: "promo-1",
    _id: "promo-1",
    title: "Summer Glow Facial Special",
    description: "Experience our signature radiance facial with an exclusive seasonal discount. Includes complimentary hand massage.",
    discount: "30% OFF",
    discount_type: "percentage",
    discount_value: 30,
    code: "GLOW30",
    start_date: "2026-08-01",
    end_date: "2026-09-15",
    category: "Facial",
    badge: "LIMITED OFFER",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "promo-2",
    _id: "promo-2",
    title: "Bridal Suite Experience",
    description: "Complete bridal party styling, luxury makeup, and complimentary champagne prep session.",
    discount: "Rs 1,500 OFF",
    discount_type: "flat",
    discount_value: 1500,
    code: "ROYALBRIDE",
    start_date: "2026-08-10",
    end_date: "2026-10-31",
    category: "Makeup",
    badge: "VIP SPECIAL",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "promo-3",
    _id: "promo-3",
    title: "Aurelia Couple's Rejuvenation",
    description: "Simultaneous 75-minute hot stone Swedish massage with organic aromatherapy oils.",
    discount: "25% OFF",
    discount_type: "percentage",
    discount_value: 25,
    code: "WELLNESS25",
    start_date: "2026-08-15",
    end_date: "2026-09-30",
    category: "Spa",
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: "staff-1",
    _id: "staff-1",
    name: "Sara Khan",
    email: "sara.khan@aurelia.local",
    phone: "+92 314 9512707",
    specialization: "Master Hair Stylist & Colorist",
    status: "Active",
    rating: 4.96,
    experience: "8 years",
    services: [
      { _id: "srv-1", name: "Signature Haircut & Style", duration: 45, price: 1200 },
      { _id: "srv-7", name: "Keratin Smooth Rebonding", duration: 180, price: 6500 },
      { _id: "srv-8", name: "Balayage & Multi-Tone Highlights", duration: 120, price: 4800 }
    ]
  },
  {
    id: "staff-2",
    _id: "staff-2",
    name: "Amina Al-Mansoor",
    email: "amina@aurelia.local",
    phone: "+92 321 8891024",
    specialization: "Senior Aesthetician & Skin Specialist",
    status: "Active",
    rating: 4.98,
    experience: "6 years",
    services: [
      { _id: "srv-2", name: "Radiance Glow Facial", duration: 60, price: 2000 },
      { _id: "srv-10", name: "Anti-Aging Collagen Facial", duration: 70, price: 2800 }
    ]
  },
  {
    id: "staff-3",
    _id: "staff-3",
    name: "Elena Rossi",
    email: "elena@aurelia.local",
    phone: "+92 300 4451992",
    specialization: "Holistic Spa Therapist & Masseuse",
    status: "Active",
    rating: 4.95,
    experience: "7 years",
    services: [
      { _id: "srv-3", name: "Full Body Swedish Massage", duration: 75, price: 2500 },
      { _id: "srv-6", name: "Signature Aurelia Spa Day", duration: 150, price: 4500 }
    ]
  },
  {
    id: "staff-4",
    _id: "staff-4",
    name: "Zoya Malik",
    email: "zoya@aurelia.local",
    phone: "+92 333 7120491",
    specialization: "Celebrity Makeup Artist",
    status: "Active",
    rating: 5.0,
    experience: "9 years",
    services: [
      { _id: "srv-5", name: "Royal Bridal Makeup & Styling", duration: 120, price: 8000 }
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    _id: "cust-1",
    user_id: "u-cust-1",
    name: "Fatima Noor",
    email: "fatima.noor@gmail.com",
    phone: "+92 302 5551234",
    total_visits: 12,
    last_visit: "2026-08-20",
    role: "customer"
  },
  {
    id: "cust-2",
    _id: "cust-2",
    user_id: "u-cust-2",
    name: "Mariam Tariq",
    email: "mariam.tariq@yahoo.com",
    phone: "+92 312 9984711",
    total_visits: 6,
    last_visit: "2026-08-18",
    role: "customer"
  },
  {
    id: "cust-3",
    _id: "cust-3",
    user_id: "u-cust-3",
    name: "Ayesha Bilal",
    email: "ayesha.b@outlook.com",
    phone: "+92 345 6678129",
    total_visits: 4,
    last_visit: "2026-08-10",
    role: "customer"
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-101",
    _id: "apt-101",
    booking_id: "AUR-8921",
    customer_name: "Fatima Noor",
    customer_phone: "+92 302 5551234",
    mobile_number: "+92 302 5551234",
    email: "fatima.noor@gmail.com",
    service_name: "Signature Haircut & Style",
    services: [
      { id: "srv-1", name: "Signature Haircut & Style", price: 1200, duration: 45 }
    ],
    staff_id: "staff-1",
    staff_name: "Sara Khan",
    appointment_date: "2026-08-25",
    start_time: "11:00",
    end_time: "11:45",
    duration: 45,
    total_duration: 45,
    total_price: 1200,
    total_amount: 1200,
    status: "confirmed",
    payment_method: "pay_at_salon",
    payment_status: "pending",
    notes: "Prefers layered cut with soft curls",
    created_at: "2026-08-23T10:00:00Z"
  },
  {
    id: "apt-102",
    _id: "apt-102",
    booking_id: "AUR-8922",
    customer_name: "Mariam Tariq",
    customer_phone: "+92 312 9984711",
    mobile_number: "+92 312 9984711",
    email: "mariam.tariq@yahoo.com",
    service_name: "Radiance Glow Facial",
    services: [
      { id: "srv-2", name: "Radiance Glow Facial", price: 2000, duration: 60 }
    ],
    staff_id: "staff-2",
    staff_name: "Amina Al-Mansoor",
    appointment_date: "2026-08-25",
    start_time: "14:00",
    end_time: "15:00",
    duration: 60,
    total_duration: 60,
    total_price: 2000,
    total_amount: 2000,
    status: "pending",
    payment_method: "online_payment",
    payment_status: "verification_pending",
    transaction_reference: "JC-992817462",
    notes: "Sensitive skin, use fragrance-free cleanser",
    created_at: "2026-08-24T08:30:00Z"
  },
  {
    id: "apt-103",
    _id: "apt-103",
    booking_id: "AUR-8919",
    customer_name: "Ayesha Bilal",
    customer_phone: "+92 345 6678129",
    mobile_number: "+92 345 6678129",
    email: "ayesha.b@outlook.com",
    service_name: "Deluxe Gel Manicure",
    services: [
      { id: "srv-4", name: "Deluxe Gel Manicure", price: 1500, duration: 50 }
    ],
    staff_id: "staff-1",
    staff_name: "Sara Khan",
    appointment_date: "2026-08-24",
    start_time: "16:30",
    end_time: "17:20",
    duration: 50,
    total_duration: 50,
    total_price: 1500,
    total_amount: 1500,
    status: "completed",
    payment_method: "cash",
    payment_status: "paid",
    notes: "Nude pink shade requested",
    created_at: "2026-08-22T14:10:00Z"
  }
];

export const INITIAL_AVAILABILITY: Record<string, AvailabilitySlot[]> = {
  "staff-1": [
    { day_of_week: 1, start_time: "09:00", end_time: "18:00", break_start: "13:00", break_end: "14:00" },
    { day_of_week: 2, start_time: "09:00", end_time: "18:00", break_start: "13:00", break_end: "14:00" },
    { day_of_week: 3, start_time: "09:00", end_time: "18:00", break_start: "13:00", break_end: "14:00" },
    { day_of_week: 4, start_time: "09:00", end_time: "18:00", break_start: "13:00", break_end: "14:00" },
    { day_of_week: 5, start_time: "09:00", end_time: "18:00", break_start: "13:00", break_end: "14:00" },
    { day_of_week: 6, start_time: "10:00", end_time: "19:00", break_start: "14:00", break_end: "15:00" }
  ],
  "staff-2": [
    { day_of_week: 1, start_time: "10:00", end_time: "19:00", break_start: "14:00", break_end: "15:00" },
    { day_of_week: 2, start_time: "10:00", end_time: "19:00", break_start: "14:00", break_end: "15:00" },
    { day_of_week: 3, start_time: "10:00", end_time: "19:00", break_start: "14:00", break_end: "15:00" },
    { day_of_week: 4, start_time: "10:00", end_time: "19:00", break_start: "14:00", break_end: "15:00" },
    { day_of_week: 6, start_time: "10:00", end_time: "19:00", break_start: "14:00", break_end: "15:00" }
  ]
};

export const SALON_HERO_IMAGE = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80";
export const SALON_SPA_IMAGE = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80";
