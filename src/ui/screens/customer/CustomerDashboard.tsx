import React, { useEffect, useState } from 'react';
import { Sparkles, Scissors, Droplets, Tag, Camera, Flower, Calendar, Clock, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { MenuButton } from '../../components/MenuButton';
import { SALON_SPA_IMAGE } from '../../../data/salonData';
import { SalonService } from '../../../types';
import { apiRequest } from '../../../data/api';
import { CustomerBottomNav } from '../../components/BottomNav';

export const CustomerDashboard: React.FC = () => {
  const { user, navigate } = useAuth();
  const [popularServices, setPopularServices] = useState<SalonService[]>([]);

  const categories = [
    { label: 'Hair', category: 'Hair', icon: <Scissors size={18} /> },
    { label: 'Facial', category: 'Facial', icon: <Sparkles size={18} /> },
    { label: 'Massage', category: 'Spa', icon: <Droplets size={18} /> },
    { label: 'Nails', category: 'Nails', icon: <Tag size={18} /> },
    { label: 'Makeup', category: 'Makeup', icon: <Camera size={18} /> },
    { label: 'Spa', category: 'Spa', icon: <Flower size={18} /> }
  ];

  useEffect(() => {
    apiRequest<{ services: SalonService[] }>('/services')
      .then(({ services }) => setPopularServices(services.filter(service => service.status !== 'Inactive').slice(0, 6)))
      .catch(error => console.error('Could not load dashboard services:', error));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        
        {/* Welcome Greeting Row */}
        <div className="flex items-center justify-between mt-2 mb-5">
          <div>
            <span className="text-xs text-[#796A61] font-semibold block">
              Good day, {user?.name ? user.name.split(' ')[0] : 'Guest'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
              Your beauty moment
            </h1>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#EFE5D8] flex items-center justify-center text-[#C9A66B] shadow-xs">
            <Sparkles size={20} />
          </div>
        </div>

        {/* Promo Hero Banner */}
        <div
          onClick={() => navigate('Promotions')}
          className="relative h-40 sm:h-48 rounded-2xl overflow-hidden mb-6 cursor-pointer shadow-[0px_8px_24px_rgba(58,36,28,0.15)] group transition-transform active:scale-[0.99]"
        >
          <img
            src={SALON_SPA_IMAGE}
            alt="Summer Glow Promo"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#241611]/90 via-[#241611]/60 to-transparent" />
          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-center text-white">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#E4D1AD] uppercase mb-1">
              LIMITED OFFER
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold leading-tight mb-1 text-white">
              Summer glow, 30% off facials
            </h2>
            <span className="text-xs font-semibold text-[#E4D1AD] flex items-center gap-1">
              Use code <span className="font-mono bg-[#C9A66B]/30 px-1.5 py-0.5 rounded text-white font-bold">GLOW30</span>
            </span>
          </div>
        </div>

        {/* Services Categories */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-serif-luxury font-bold text-[#241611]">
            Services
          </h2>
          <button
            type="button"
            onClick={() => navigate('Services')}
            className="text-xs font-bold text-[#C9A66B] hover:text-[#3A241C] transition-colors"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-6">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigate('Services', { category: cat.category })}
              className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs transition-all duration-200 hover:border-[#C9A66B] hover:shadow-sm active:scale-95 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EC] flex items-center justify-center text-[#6B4A3A] mb-1.5 group-hover:text-[#C9A66B] group-hover:bg-[#EFE5D8] transition-colors">
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-[#3A241C]">
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Popular Services Grid */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-serif-luxury font-bold text-[#241611]">
            Popular Services
          </h2>
          <button
            type="button"
            onClick={() => navigate('Services')}
            className="text-xs font-bold text-[#C9A66B] hover:text-[#3A241C] transition-colors"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {popularServices.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate('BookAppointment', { service })}
              className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#C9A66B] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-28 sm:h-36 bg-[#EFE5D8] overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-[#241611]/80 backdrop-blur-xs text-[#E4D1AD] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {service.category}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#241611] line-clamp-1 group-hover:text-[#3A241C]">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-[#796A61]">
                    <Clock size={12} className="text-[#C9A66B]" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E6D9CC]/60">
                  <div className="flex items-center gap-0.5 text-xs font-bold text-[#241611]">
                    <Star size={12} className="fill-[#C9A66B] text-[#C9A66B]" />
                    <span>{service.rating}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-[#6B4A3A]">
                    Rs {service.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Menu Actions */}
        <div className="space-y-2 mb-4">
          <MenuButton
            icon={<Sparkles size={20} />}
            title="View Services"
            subtitle="Explore our comprehensive treatments"
            onClick={() => navigate('Services')}
          />
          <MenuButton
            icon={<Calendar size={20} />}
            title="Book Appointment"
            subtitle="Schedule your customized salon or spa visit"
            featured={true}
            onClick={() => navigate('BookAppointment')}
          />
          <MenuButton
            icon={<Clock size={20} />}
            title="My Appointments"
            subtitle="Review your reservations & live appointment status"
            onClick={() => navigate('MyAppointments')}
          />
          <MenuButton
            icon={<Tag size={20} />}
            title="Promotions & Packages"
            subtitle="Discover limited seasonal packages & privileges"
            onClick={() => navigate('Promotions')}
          />
        </div>

      </div>

      <CustomerBottomNav active="Home" />
    </div>
  );
};
