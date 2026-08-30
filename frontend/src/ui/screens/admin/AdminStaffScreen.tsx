import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Phone,
  Award,
  Star,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  X,
  AlertTriangle,
  Scissors,
  Sparkles,
  ShieldCheck,
  Check,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { StaffMember, SalonService } from '../../../types';
import { apiRequest } from '../../../data/api';
import { LoadingView } from '../../components/LoadingView';
import { RoleBottomNav } from '../../components/BottomNav';

export const AdminStaffScreen: React.FC = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'On Leave'>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Staff Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'Master Hair Stylist & Colorist',
    experience: '5+ Years',
    rating: 5.0,
    status: 'Active',
    selectedServices: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [staffData, servicesData] = await Promise.all([
        apiRequest('/staff'),
        apiRequest('/services').catch(() => ({ services: [] }))
      ]);
      setStaff(staffData.staff || []);
      setServices(servicesData.services || []);
    } catch (e) {
      console.error('Error loading staff:', e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Staff Handler
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please provide staff name and email.');
      return;
    }

    try {
      setSubmitting(true);

      const assignedServices = services
        .filter((s) => formData.selectedServices.includes(s.id || s._id || ''))
        .map((s) => ({ name: s.name, duration: s.duration }));

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || '+92 314 0000000',
        specialization: formData.specialization.trim(),
        experience: formData.experience.trim() || '3+ Years',
        rating: Number(formData.rating) || 5.0,
        status: formData.status,
        services: assignedServices.length > 0 ? assignedServices : [
          { name: 'Signature Haircut & Styling', duration: 45 },
          { name: 'Aura Royal Gold Facial', duration: 60 }
        ]
      };

      const res = await apiRequest('/staff', 'POST', payload);
      if (res && res.staff) {
        setStaff((prev) => [res.staff, ...prev]);
      } else {
        await loadData();
      }

      showToast(`✨ ${formData.name} added to staff team!`);
      setIsAddModalOpen(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: 'Master Hair Stylist & Colorist',
        experience: '5+ Years',
        rating: 5.0,
        status: 'Active',
        selectedServices: []
      });
    } catch (err: any) {
      alert(err.message || 'Could not add staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Staff Handler
  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    try {
      setSubmitting(true);
      const staffId = staffToDelete.id || staffToDelete._id;
      await apiRequest(`/staff/${staffId}`, 'DELETE');

      setStaff((prev) => prev.filter((s) => (s.id || s._id) !== staffId));
      showToast(`🗑️ ${staffToDelete.name} has been removed from staff.`);
      setStaffToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Could not delete staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Staff Status (Active / On Leave)
  const handleToggleStatus = async (person: StaffMember) => {
    const newStatus = person.status === 'Active' ? 'On Leave' : 'Active';
    const staffId = person.id || person._id;

    try {
      await apiRequest(`/staff/${staffId}`, 'PUT', { status: newStatus });
      setStaff((prev) =>
        prev.map((s) =>
          (s.id || s._id) === staffId ? { ...s, status: newStatus } : s
        )
      );
      showToast(`Status updated: ${person.name} is now ${newStatus}`);
    } catch (err: any) {
      alert(err.message || 'Could not update status.');
    }
  };

  // Filtered Staff
  const filteredStaff = staff.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || person.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const activeCount = staff.filter((s) => s.status === 'Active').length;
  const onLeaveCount = staff.filter((s) => s.status === 'On Leave').length;
  const avgRating = staff.length
    ? (staff.reduce((sum, s) => sum + (s.rating || 5.0), 0) / staff.length).toFixed(1)
    : '5.0';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading staff team..." fullScreen />
        <RoleBottomNav role={user?.role || 'admin'} active="Staff" />
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

      <div className="max-w-5xl mx-auto px-4 pt-6">
        {/* Header with Title & Add Staff Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-montserrat font-extrabold tracking-[0.22em] text-[#C9A66B] uppercase block">
                TEAM MANAGEMENT
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EFE5D8] text-[#6B4A3A] font-semibold">
                {staff.length} Specialists
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#241611] mt-0.5">
              Staff & Specialists
            </h1>
            <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
              Manage stylists, assign specializations, schedule shifts, and manage team members.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="self-start sm:self-auto flex items-center gap-2 bg-[#C9A66B] hover:bg-[#b89557] text-[#FFFDFC] px-5 py-2.5 rounded-xl font-montserrat text-xs uppercase tracking-wider font-bold shadow-sm transition-all transform active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Staff</span>
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#796A61] mb-1">
              <span className="text-xs font-medium">Total Staff</span>
              <Users size={16} className="text-[#C9A66B]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#241611]">
              {staff.length}
            </div>
          </div>

          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#796A61] mb-1">
              <span className="text-xs font-medium">Active Now</span>
              <UserCheck size={16} className="text-[#58745A]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#58745A]">
              {activeCount}
            </div>
          </div>

          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#796A61] mb-1">
              <span className="text-xs font-medium">On Leave</span>
              <ShieldCheck size={16} className="text-[#A16207]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#A16207]">
              {onLeaveCount}
            </div>
          </div>

          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#796A61] mb-1">
              <span className="text-xs font-medium">Team Avg Rating</span>
              <Star size={16} className="fill-[#C9A66B] text-[#C9A66B]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#241611]">
              {avgRating} <span className="text-xs font-sans text-[#796A61] font-normal">/ 5.0</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-3 shadow-xs">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#796A61]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff by name, role, email..."
              className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#241611] placeholder-[#796A61]/70 focus:outline-none focus:border-[#C9A66B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#796A61] hover:text-[#241611]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto w-full sm:w-auto overflow-x-auto">
            {(['all', 'Active', 'On Leave'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-montserrat font-semibold uppercase tracking-wider transition-all ${
                  filterStatus === status
                    ? 'bg-[#3A241C] text-[#FFFDFC]'
                    : 'bg-[#F8F3EC] text-[#796A61] hover:text-[#241611]'
                }`}
              >
                {status === 'all' ? 'All Staff' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        {filteredStaff.length === 0 ? (
          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl p-10 text-center max-w-lg mx-auto my-8">
            <div className="w-14 h-14 bg-[#F8F3EC] text-[#C9A66B] rounded-full flex items-center justify-center mx-auto mb-3">
              <Users size={26} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#241611] mb-1">
              No Staff Members Found
            </h3>
            <p className="text-xs text-[#796A61] mb-5">
              {searchQuery
                ? `No staff members matched "${searchQuery}". Try a different keyword.`
                : 'Your salon staff list is currently empty. Click below to add your first stylist.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-[#C9A66B] hover:bg-[#b89557] text-[#FFFDFC] px-5 py-2.5 rounded-xl font-montserrat text-xs uppercase tracking-wider font-bold shadow-sm"
            >
              <Plus size={16} />
              <span>Add First Staff Member</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredStaff.map((person) => {
              const staffId = person.id || person._id || '';
              return (
                <div
                  key={staffId}
                  className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-5 shadow-xs hover:border-[#C9A66B] transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#EFE5D8] flex items-center justify-center text-[#3A241C] font-bold text-lg flex-shrink-0 shadow-inner">
                          {person.name ? person.name.charAt(0).toUpperCase() : 'S'}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-serif font-bold text-base text-[#241611] truncate">
                            {person.name}
                          </h3>
                          <span className="text-xs font-medium text-[#6B4A3A] block truncate">
                            {person.specialization}
                          </span>
                        </div>
                      </div>

                      {/* Status & Quick Toggle */}
                      <button
                        onClick={() => handleToggleStatus(person)}
                        title="Click to toggle status"
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                          person.status === 'Active'
                            ? 'bg-[#F1F6F0] text-[#58745A] hover:bg-[#e4efe2]'
                            : 'bg-[#FEF9C3] text-[#854D0E] hover:bg-[#fef08a]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${person.status === 'Active' ? 'bg-[#58745A]' : 'bg-[#854D0E]'}`} />
                        {person.status || 'Active'}
                      </button>
                    </div>

                    {/* Contact & Experience Details */}
                    <div className="space-y-2 text-xs text-[#796A61] border-t border-[#E6D9CC]/70 pt-3">
                      <p className="flex items-center gap-2">
                        <Mail size={14} className="text-[#C9A66B] flex-shrink-0" />
                        <span className="truncate">{person.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={14} className="text-[#C9A66B] flex-shrink-0" />
                        <span>{person.phone || '+92 314 9512707'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Award size={14} className="text-[#C9A66B] flex-shrink-0" />
                        <span>Experience: {person.experience || '5+ years'}</span>
                      </p>
                    </div>

                    {/* Services Tags */}
                    {person.services && person.services.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#E6D9CC]/50">
                        <span className="text-[10px] font-bold text-[#796A61] uppercase tracking-wider block mb-1.5">
                          Qualified Treatments:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {person.services.slice(0, 3).map((srv, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#F8F3EC] border border-[#E6D9CC] text-[#3A241C] px-2 py-0.5 rounded-lg"
                            >
                              {srv.name}
                            </span>
                          ))}
                          {person.services.length > 3 && (
                            <span className="text-[10px] bg-[#EFE5D8] text-[#6B4A3A] px-1.5 py-0.5 rounded-lg font-bold">
                              +{person.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer with Rating & Delete Button */}
                  <div className="mt-4 pt-3 border-t border-[#E6D9CC] flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#241611] font-bold text-xs">
                      <Star size={14} className="fill-[#C9A66B] text-[#C9A66B]" />
                      <span>{person.rating || 5.0}</span>
                      <span className="text-[11px] font-normal text-[#796A61]">
                        ({person.services?.length || 2} services)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Delete Staff Button */}
                      <button
                        onClick={() => setStaffToDelete(person)}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer"
                        title="Delete staff member"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. ADD NEW STAFF MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#241611]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-scale-in my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E6D9CC] pb-4 mb-5">
              <div>
                <span className="text-[10px] font-montserrat font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block">
                  NEW SPECIALIST
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#241611]">
                  Add Staff Member
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F8F3EC] flex items-center justify-center text-[#796A61] hover:text-[#241611] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Alvi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maya@aurelia.local"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+92 314 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>
              </div>

              {/* Specialization & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                    Specialization
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                  >
                    <option value="Master Hair Stylist & Colorist">Master Hair Stylist & Colorist</option>
                    <option value="Senior Aesthetician & Skin Therapist">Senior Aesthetician & Skin Therapist</option>
                    <option value="Senior Massage Therapist">Senior Massage Therapist</option>
                    <option value="Nail Art & Pedicure Artist">Nail Art & Pedicure Artist</option>
                    <option value="Bridal Couture Makeup Specialist">Bridal Couture Makeup Specialist</option>
                    <option value="Holistic Spa Consultant">Holistic Spa Consultant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5+ Years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>
              </div>

              {/* Rating & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1">
                    Initial Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5.0 })}
                    className="w-full bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#C9A66B]"
                  />
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
                    <option value="Active">Active (Available for booking)</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              {/* Assign Qualified Services */}
              {services.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#3A241C] uppercase tracking-wider mb-1.5">
                    Assign Qualified Treatments:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-[#F8F3EC] rounded-xl border border-[#E6D9CC]">
                    {services.map((srv) => {
                      const srvId = srv.id || srv._id || '';
                      const isChecked = formData.selectedServices.includes(srvId);
                      return (
                        <label
                          key={srvId}
                          className="flex items-center gap-2 text-xs text-[#241611] cursor-pointer hover:text-[#C9A66B] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  selectedServices: [...formData.selectedServices, srvId]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedServices: formData.selectedServices.filter((id) => id !== srvId)
                                });
                              }
                            }}
                            className="rounded text-[#C9A66B] focus:ring-[#C9A66B]"
                          />
                          <span className="truncate">{srv.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  {submitting ? 'Saving...' : 'Add Specialist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DELETE STAFF CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 bg-[#241611]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-in text-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-100">
              <AlertTriangle size={26} />
            </div>

            <h3 className="font-serif font-bold text-xl text-[#241611] mb-1.5">
              Remove Staff Member?
            </h3>

            <p className="text-xs text-[#796A61] leading-relaxed mb-6">
              Are you sure you want to remove <strong className="text-[#241611]">{staffToDelete.name}</strong> ({staffToDelete.specialization}) from the team? This action will remove their profile and schedule from the system.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setStaffToDelete(null)}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#796A61] bg-[#F8F3EC] hover:text-[#241611] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStaff}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-montserrat text-xs uppercase tracking-wider font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>{submitting ? 'Removing...' : 'Yes, Delete Staff'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <RoleBottomNav role={user?.role || 'admin'} active="Staff" />
    </div>
  );
};
