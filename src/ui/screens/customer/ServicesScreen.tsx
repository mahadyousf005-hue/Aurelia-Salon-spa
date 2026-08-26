import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Plus,
  Trash2,
  AlertTriangle,
  Scissors,
  CheckCircle2,
  Tag,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { SalonService } from '../../../types';
import { apiRequest } from '../../../data/api';
import { LoadingView } from '../../components/LoadingView';
import { EmptyState } from '../../components/EmptyState';
import { CustomerBottomNav, RoleBottomNav } from '../../components/BottomNav';

const PRESET_IMAGES: Record<string, string> = {
  Hair: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
  Facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  Makeup: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  Nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
  Spa: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
  Waxing: 'https://images.unsplash.com/photo-1512290900672-1f02e71d3df8?auto=format&fit=crop&w=800&q=80',
  Other: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
};

export const ServicesScreen: React.FC = () => {
  const { navigate, screenParams, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(screenParams.category || 'All');

  // Modals & Actions state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<SalonService | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Service Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hair',
    price: 2500,
    duration: 45,
    description: '',
    image: '',
    status: 'Active',
    rating: 5.0
  });

  const categories = ['All', 'Hair', 'Makeup', 'Facial', 'Nails', 'Spa', 'Waxing', 'Other'];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (screenParams.category) {
      setSelectedCategory(screenParams.category);
    }
  }, [screenParams.category]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/services');
      setServices(data.services || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getNormalizedCategory = (service: SalonService): string => {
    const raw = (service.category || '').toLowerCase();
    if (raw.includes('hair')) return 'Hair';
    if (raw.includes('facial')) return 'Facial';
    if (raw.includes('makeup')) return 'Makeup';
    if (raw.includes('nail') || raw.includes('manicure') || raw.includes('pedicure')) return 'Nails';
    if (raw.includes('spa') || raw.includes('massage')) return 'Spa';
    if (raw.includes('wax')) return 'Waxing';
    return 'Other';
  };

  // Add Service Handler
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.duration) {
      alert('Please fill in service name, price, and duration.');
      return;
    }

    try {
      setSubmitting(true);
      const chosenImage = formData.image.trim() || PRESET_IMAGES[formData.category] || PRESET_IMAGES.Hair;

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        duration: Number(formData.duration),
        description: formData.description.trim() || `Indulgent luxury ${formData.name} crafted for radiant results.`,
        image: chosenImage,
        rating: Number(formData.rating) || 5.0,
        status: formData.status
      };

      const res = await apiRequest('/services', 'POST', payload);
      if (res && res.service) {
        setServices((prev) => [res.service, ...prev]);
      } else {
        await loadServices();
      }

      showToast(`✨ Service "${formData.name}" added successfully!`);
      setIsAddModalOpen(false);
      // Reset form
      setFormData({
        name: '',
        category: 'Hair',
        price: 2500,
        duration: 45,
        description: '',
        image: '',
        status: 'Active',
        rating: 5.0
      });
    } catch (err: any) {
      alert(err.message || 'Failed to add service.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Service Handler
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      setSubmitting(true);
      const serviceId = serviceToDelete.id || serviceToDelete._id;
      await apiRequest(`/services/${serviceId}`, 'DELETE');

      setServices((prev) => prev.filter((s) => (s.id || s._id) !== serviceId));
      showToast(`🗑️ "${serviceToDelete.name}" removed from catalog.`);
      setServiceToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Could not delete service.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Service Status
  const handleToggleStatus = async (service: SalonService) => {
    const newStatus = service.status === 'Active' ? 'Inactive' : 'Active';
    const serviceId = service.id || service._id;

    try {
      await apiRequest(`/services/${serviceId}`, 'PUT', { status: newStatus });
      setServices((prev) =>
        prev.map((s) =>
          (s.id || s._id) === serviceId ? { ...s, status: newStatus } : s
        )
      );
      showToast(`Status updated: ${service.name} is now ${newStatus}`);
    } catch (err: any) {
      alert(err.message || 'Could not update service status.');
    }
  };

  const filteredServices = services.filter((service) => {
    const normCat = getNormalizedCategory(service);
    const matchesCategory = selectedCategory === 'All' || normCat.toLowerCase() === selectedCategory.toLowerCase();
    if (!matchesCategory) return false;

    if (!searchText.trim()) return true;
    const query = searchText.toLowerCase().trim();
    return (
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      normCat.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading our signature services..." fullScreen />
        {user?.role === 'customer' ? <CustomerBottomNav active="Services" /> : <RoleBottomNav role={user?.role || 'admin'} active="Services" />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#241611] text-[#F8F3EC] border border-[#C9A66B] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in text-sm font-medium">
          <Sparkles size={18} className="text-[#C9A66B] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 pt-4">
        
        {/* Header & Controls */}
        <div className="mb-4">
          
          {/* Search Input */}
          <div className="relative mb-4 max-w-xl mx-auto">
            <div className="h-12 bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl flex items-center px-4 shadow-[0px_4px_14px_rgba(58,36,28,0.06)] focus-within:border-[#C9A66B] focus-within:ring-1 focus-within:ring-[#C9A66B]/30 transition-all">
              <Search size={18} className="text-[#6B4A3A] mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search services (hair, facial, massage...)"
                className="w-full h-full bg-transparent text-sm text-[#2E211C] placeholder-[#9A8C83] focus:outline-none"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText('')}
                  className="p-1 text-[#796A61] hover:text-[#241611]"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
                {isAdmin ? 'ADMIN CATALOG MANAGEMENT' : 'BEAUTY & WELLNESS'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
                Salon Services Catalog
              </h1>
              <p className="text-xs text-[#796A61] mt-0.5 leading-relaxed">
                {isAdmin
                  ? 'Add new services, configure pricing, duration and manage live salon catalog.'
                  : 'Discover treatments meticulously crafted around your wellbeing.'}
              </p>
            </div>

            {/* Add Service Button (For Admin & Quick Catalog management) */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="self-start sm:self-auto flex items-center gap-2 bg-[#C9A66B] hover:bg-[#b89557] text-[#FFFDFC] px-4 py-2.5 rounded-xl font-montserrat text-xs uppercase tracking-wider font-bold shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Service</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#3A241C] text-[#FFFDFC] shadow-sm'
                    : 'bg-[#FFFDFC] border border-[#E6D9CC] text-[#6B4A3A] hover:border-[#C9A66B]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Count Label */}
        <div className="flex items-center justify-between text-xs font-bold text-[#796A61] mb-3 px-1">
          <span>
            {filteredServices.length} {filteredServices.length === 1 ? 'service available' : 'services available'}
          </span>
          {isAdmin && (
            <span className="text-[11px] text-[#C9A66B] font-semibold">
              Admin Mode: Add & Delete Enabled
            </span>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredServices.map((service) => {
            const serviceId = service.id || service._id;
            const isServiceActive = service.status !== 'Inactive';

            return (
              <div
                key={serviceId}
                className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl overflow-hidden shadow-[0px_6px_20px_rgba(58,36,28,0.06)] hover:border-[#C9A66B] transition-all flex flex-col justify-between group"
              >
                <div className="h-44 sm:h-48 bg-[#EFE5D8] overflow-hidden relative">
                  <img
                    src={service.image || PRESET_IMAGES.Hair}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#241611]/85 backdrop-blur-xs text-[#E4D1AD] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {getNormalizedCategory(service)}
                  </div>
                  
                  {/* Status pill with click-to-toggle for admin */}
                  <button
                    type="button"
                    onClick={() => isAdmin && handleToggleStatus(service)}
                    title={isAdmin ? "Click to toggle Active/Inactive" : undefined}
                    className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                      isServiceActive
                        ? 'bg-[#F1F6F0] text-[#58745A]'
                        : 'bg-[#FEF2F2] text-[#DC2626]'
                    } ${isAdmin ? 'cursor-pointer hover:scale-105' : ''}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isServiceActive ? 'bg-[#58745A]' : 'bg-[#DC2626]'}`} />
                    <span>{service.status || 'Active'}</span>
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-bold text-base text-[#241611] font-serif-luxury">
                        {service.name}
                      </h3>
                    </div>

                    <p className="text-xs text-[#796A61] leading-relaxed line-clamp-2 mb-4">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#E6D9CC] mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F8F3EC] flex items-center justify-center text-[#C9A66B]">
                          <Clock size={15} />
                        </div>
                        <div>
                          <span className="text-[8px] font-extrabold text-[#796A61] uppercase tracking-wider block">
                            DURATION
                          </span>
                          <span className="text-xs font-bold text-[#241611]">
                            {service.duration} min
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[8px] font-extrabold text-[#796A61] uppercase tracking-wider block">
                          PRICE
                        </span>
                        <span className="text-sm font-extrabold text-[#6B4A3A]">
                          Rs {service.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-xs font-bold text-[#796A61]">
                        <Star size={13} className="fill-[#C9A66B] text-[#C9A66B]" />
                        <span>{service.rating || 4.9}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Delete Service button for Admin */}
                        <button
                          type="button"
                          onClick={() => setServiceToDelete(service)}
                          className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all cursor-pointer"
                          title="Delete service"
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate('BookAppointment', { service })}
                          className="px-3.5 py-2 bg-[#3A241C] hover:bg-[#241611] text-[#FFFDFC] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Book</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <EmptyState
            icon={<Sparkles size={24} />}
            title="No Services Found"
            text="Try adjusting your search criteria or explore other categories."
            actionText="View All Services"
            onAction={() => {
              setSelectedCategory('All');
              setSearchText('');
            }}
          />
        )}

      </div>

      {/* ========================================================================= */}
      {/* 1. ADD NEW SERVICE MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#241611]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-scale-in my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E6D9CC] pb-4 mb-5">
              <div>
                <span className="text-[10px] font-montserrat font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block">
                  NEW TREATMENT
                </span>
                <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#241611]">
                  Add Salon Service
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F8F3EC] flex items-center justify-center text-[#796A61] hover:text-[#241611] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-4">
              {/* Service Name */}
              <div>
                <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Keratin Glow Smooth Therapy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                  >
                    <option value="Hair">Hair</option>
                    <option value="Facial">Facial</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Nails">Nails</option>
                    <option value="Spa">Spa & Massage</option>
                    <option value="Waxing">Waxing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                  >
                    <option value="Active">Active (Available for Booking)</option>
                    <option value="Inactive">Inactive / Hidden</option>
                  </select>
                </div>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                    Price (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#796A61]">
                      Rs
                    </span>
                    <input
                      type="number"
                      required
                      min="100"
                      step="50"
                      placeholder="2500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                    Duration (Minutes) *
                  </label>
                  <div className="relative">
                    <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#796A61]" />
                    <input
                      type="number"
                      required
                      min="15"
                      max="360"
                      step="15"
                      placeholder="45"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 45 })}
                      className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Image URL or Preset */}
              <div>
                <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                  Image URL (Optional - leave blank for curated preset)
                </label>
                <div className="relative">
                  <ImageIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#796A61]" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the treatment ritual, benefits, and special products used..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl p-3 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6D9CC]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#796A61] hover:text-[#241611] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#C9A66B] hover:bg-[#b89557] text-[#FFFDFC] px-6 py-2.5 rounded-xl font-montserrat text-xs uppercase tracking-wider font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DELETE SERVICE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 bg-[#241611]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-in text-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-100">
              <AlertTriangle size={26} />
            </div>

            <h3 className="font-serif-luxury font-bold text-xl text-[#241611] mb-1.5">
              Remove Service?
            </h3>

            <p className="text-xs text-[#796A61] leading-relaxed mb-6">
              Are you sure you want to remove <strong className="text-[#241611]">{serviceToDelete.name}</strong> from the salon catalog? This service will no longer be available for customer bookings.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setServiceToDelete(null)}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#796A61] bg-[#F8F3EC] hover:text-[#241611] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteService}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-montserrat text-xs uppercase tracking-wider font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>{submitting ? 'Removing...' : 'Yes, Delete Service'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'customer' ? (
        <CustomerBottomNav active="Services" />
      ) : (
        <RoleBottomNav role={user?.role || 'admin'} active="Services" />
      )}
    </div>
  );
};
