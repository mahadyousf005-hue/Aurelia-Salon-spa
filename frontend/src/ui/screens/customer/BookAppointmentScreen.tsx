import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  Building2,
  Banknote,
  CheckCircle2,
  UploadCloud,
  X,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { SalonService, TimeSlot, Appointment } from '../../../types';
import { apiRequest } from '../../../data/api';
import { PrimaryGoldButton } from '../../components/PrimaryGoldButton';
import { CustomerBottomNav } from '../../components/BottomNav';

export const BookAppointmentScreen: React.FC = () => {
  const { user, screenParams, navigate } = useAuth();

  const [services, setServices] = useState<SalonService[]>([]);
  const [selectedServices, setSelectedServices] = useState<SalonService[]>([]);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  // Default to tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().slice(0, 10);

  const [date, setDate] = useState(defaultDate);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [startTime, setStartTime] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'pay_at_salon' | 'cash' | 'online_payment'>('pay_at_salon');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Appointment | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (date) {
      loadTimeSlots(date);
    }
  }, [date, selectedServices]);

  const loadServices = async () => {
    try {
      const data = await apiRequest('/services');
      const all: SalonService[] = data.services || [];
      setServices(all);

      if (screenParams.service) {
        setSelectedServices([screenParams.service]);
      } else if (all.length > 0) {
        setSelectedServices([all[0]]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadTimeSlots = async (selectedDate: string) => {
    try {
      setBookingError(null);
      const serviceIds = selectedServices.map((s) => s.id || s._id).join(',');
      const data = await apiRequest(`/appointments/availability?date=${selectedDate}&service_ids=${encodeURIComponent(serviceIds)}`);
      setSlots(data.slots || []);
      // If previous startTime is not available, reset it
      if (startTime && !data.slots?.some((s: TimeSlot) => s.startTime === startTime && s.available)) {
        setStartTime('');
      }
    } catch (err: any) {
      setSlots([]);
      setBookingError(err.message || 'Could not fetch time slots.');
    }
  };

  const toggleService = (svc: SalonService) => {
    const svcId = svc.id || svc._id;
    if (selectedServices.some((s) => (s.id || s._id) === svcId)) {
      if (selectedServices.length === 1) {
        return; // Keep at least one selected
      }
      setSelectedServices(selectedServices.filter((s) => (s.id || s._id) !== svcId));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + Number(s.duration || 0), 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPaymentScreenshot(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBook = async () => {
    if (selectedServices.length === 0) {
      setBookingError('Please choose at least one salon service.');
      return;
    }
    if (!customerName.trim() || !mobileNumber.trim() || !date || !startTime) {
      setBookingError('Please enter your full name, mobile number, date and time slot.');
      return;
    }
    if (paymentMethod === 'online_payment' && !paymentReference.trim()) {
      setBookingError('Please enter your transaction ID for verification.');
      return;
    }

    try {
      setLoading(true);
      setBookingError(null);

      const slotObj = slots.find((s) => s.startTime === startTime);

      const payload = {
        service_ids: selectedServices.map((s) => s.id || s._id),
        customer_name: customerName.trim(),
        mobile_number: mobileNumber.trim(),
        email: email.trim() || undefined,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'online_payment' ? 'verification_pending' : 'pending',
        transaction_reference: paymentMethod === 'online_payment' ? paymentReference.trim() : null,
        payment_screenshot: paymentScreenshot || null,
        appointment_date: date,
        start_time: startTime,
        end_time: slotObj?.endTime || '12:00',
        notes: notes.trim()
      };

      const res = await apiRequest('/appointments', 'POST', payload);
      setConfirmation(res.appointment);
    } catch (err: any) {
      setBookingError(err.message || 'Unable to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        
        {/* Header */}
        <div className="mb-5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
            RESERVATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
            Book Appointment
          </h1>
          <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
            Choose a time that works beautifully for you.
          </p>
        </div>

        {/* Confirmation State */}
        {confirmation && (
          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl p-6 mb-6 shadow-md text-center">
            <div className="w-14 h-14 rounded-full bg-[#F1F6F0] text-[#58745A] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-serif-luxury text-xl font-bold text-[#241611] mb-2">
              Appointment Booked Successfully!
            </h2>
            <p className="text-xs text-[#796A61] mb-4">
              Booking Ref: <span className="font-mono font-bold text-[#3A241C]">#{confirmation.booking_id || confirmation.id}</span>
            </p>

            <div className="bg-[#F8F3EC] rounded-2xl p-4 text-left space-y-2 text-xs mb-5 border border-[#E4D1AD]/50">
              <div className="flex justify-between">
                <span className="text-[#796A61]">Services:</span>
                <span className="font-bold text-[#241611] text-right max-w-[60%]">
                  {confirmation.service_name || selectedServices.map(s => s.name).join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#796A61]">Date & Time:</span>
                <span className="font-bold text-[#241611]">{confirmation.appointment_date} at {confirmation.start_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#796A61]">Duration:</span>
                <span className="font-bold text-[#241611]">{confirmation.total_duration || totalDuration} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#796A61]">Total Amount:</span>
                <span className="font-bold text-[#6B4A3A]">Rs {(confirmation.total_price || totalPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#796A61]">Payment Status:</span>
                <span className="font-bold text-[#58745A] capitalize">{confirmation.payment_status?.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <PrimaryGoldButton
                title="VIEW MY APPOINTMENTS"
                onClick={() => navigate('MyAppointments')}
                variant="chocolate"
              />
              <button
                type="button"
                onClick={() => navigate('Home')}
                className="w-full h-12 border border-[#3A241C] text-[#3A241C] rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-[#3A241C]/5 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Booking Form Card */}
        {!confirmation && (
          <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl p-5 sm:p-7 shadow-[0px_8px_30px_rgba(58,36,28,0.06)]">
            
            {bookingError && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#FFF5F3] border border-[#E2C7C2] text-[#A45145] text-xs flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Select Services */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#2E211C] mb-2 tracking-wide">
                Select Treatments
              </label>
              <div className="flex flex-wrap gap-2">
                {services.map((svc) => {
                  const svcId = svc.id || svc._id;
                  const isSelected = selectedServices.some((s) => (s.id || s._id) === svcId);
                  return (
                    <button
                      key={svcId}
                      type="button"
                      onClick={() => toggleService(svc)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#3A241C] text-[#FFFDFC] shadow-sm'
                          : 'bg-[#F8F3EC] text-[#6B4A3A] border border-[#E6D9CC] hover:border-[#C9A66B]'
                      }`}
                    >
                      <span>{svc.name}</span>
                      <span className="ml-1.5 opacity-80">· Rs {svc.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-[#2E211C] mb-1.5">
                  Customer Name *
                </label>
                <div className="h-12 flex items-center bg-[#FCF9F5] border border-[#E6D9CC] rounded-2xl px-3.5 focus-within:border-[#C9A66B]">
                  <User size={17} className="text-[#C9A66B] mr-2.5 flex-shrink-0" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-transparent text-xs text-[#2E211C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E211C] mb-1.5">
                  Mobile Number *
                </label>
                <div className="h-12 flex items-center bg-[#FCF9F5] border border-[#E6D9CC] rounded-2xl px-3.5 focus-within:border-[#C9A66B]">
                  <Phone size={17} className="text-[#C9A66B] mr-2.5 flex-shrink-0" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full bg-transparent text-xs text-[#2E211C] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-[#2E211C] mb-1.5">
                Email (Optional)
              </label>
              <div className="h-12 flex items-center bg-[#FCF9F5] border border-[#E6D9CC] rounded-2xl px-3.5 focus-within:border-[#C9A66B]">
                <Mail size={17} className="text-[#C9A66B] mr-2.5 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-xs text-[#2E211C] focus:outline-none"
                />
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-[#2E211C] mb-1.5">
                Date (YYYY-MM-DD) *
              </label>
              <div className="h-12 flex items-center bg-[#FCF9F5] border border-[#E6D9CC] rounded-2xl px-3.5 focus-within:border-[#C9A66B]">
                <Calendar size={17} className="text-[#C9A66B] mr-2.5 flex-shrink-0" />
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#2E211C] focus:outline-none"
                />
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#2E211C]">
                  Select Time Slot *
                </label>
                {startTime && (
                  <span className="text-xs font-bold text-[#58745A]">
                    Selected: {startTime}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {slots.map((slot) => {
                  const isSelected = startTime === slot.startTime;
                  return (
                    <button
                      key={slot.startTime}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setStartTime(slot.startTime)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                        isSelected
                          ? 'bg-[#3A241C] text-[#FFFDFC] shadow-sm'
                          : slot.available
                          ? 'bg-[#F8F3EC] text-[#3A241C] border border-[#E4D1AD] hover:border-[#C9A66B]'
                          : 'bg-[#F8F3EC]/40 text-[#A89A91] border border-[#E6D9CC]/50 opacity-40 cursor-not-allowed line-through'
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  );
                })}
              </div>
              {slots.length === 0 && (
                <p className="text-xs text-[#796A61] mt-2 italic">
                  Choose a date to view available time slots.
                </p>
              )}
            </div>

            {/* Billing Summary Box */}
            <div className="bg-[#F8F3EC] rounded-2xl p-4 mb-6 border border-[#E4D1AD]">
              <h3 className="font-serif-luxury font-bold text-sm text-[#241611] mb-2.5 flex items-center gap-1.5">
                <FileText size={16} className="text-[#C9A66B]" />
                <span>Billing Summary</span>
              </h3>
              <div className="space-y-1.5 text-xs text-[#796A61] border-b border-[#E6D9CC] pb-3 mb-3">
                {selectedServices.map((svc) => (
                  <div key={svc.id || svc._id} className="flex justify-between">
                    <span>• {svc.name}</span>
                    <span className="font-semibold text-[#2E211C]">Rs {svc.price.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1">
                  <span>Estimated Duration:</span>
                  <span className="font-semibold text-[#2E211C]">{totalDuration} min</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm font-extrabold text-[#241611]">
                <span>Total Amount:</span>
                <span className="text-base text-[#6B4A3A]">Rs {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#2E211C] mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pay_at_salon', label: 'Pay at Salon', icon: <Building2 size={16} /> },
                  { id: 'cash', label: 'Cash', icon: <Banknote size={16} /> },
                  { id: 'online_payment', label: 'Online Pay', icon: <CreditCard size={16} /> }
                ].map((opt) => {
                  const isActive = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#3A241C] border-[#3A241C] text-[#FFFDFC] shadow-sm'
                          : 'bg-[#F8F3EC] border-[#E6D9CC] text-[#6B4A3A] hover:border-[#C9A66B]'
                      }`}
                    >
                      {opt.icon}
                      <span className="text-[11px]">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Online Payment Details Container */}
            {paymentMethod === 'online_payment' && (
              <div className="bg-[#FCF9F5] border border-[#C9A66B] rounded-2xl p-4 mb-6 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E6D9CC] pb-2">
                  <h4 className="font-bold text-xs text-[#3A241C]">
                    Online Payment Instructions
                  </h4>
                  <span className="text-xs font-extrabold text-[#6B4A3A]">
                    Rs {totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FFFDFC] p-3 rounded-xl border border-[#E6D9CC]">
                  <div>
                    <span className="font-extrabold text-[#C9A66B] block">JazzCash</span>
                    <span className="text-[#2E211C] font-medium block">Title: Kiran</span>
                    <span className="font-mono font-bold text-[#241611] block">03149512707</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-[#C9A66B] block">EasyPaisa</span>
                    <span className="text-[#2E211C] font-medium block">Title: Kiran</span>
                    <span className="font-mono font-bold text-[#241611] block">03149512707</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2E211C] mb-1">
                    Transaction ID / Reference Number *
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Enter Transaction ID (e.g. JC-892109)"
                    className="w-full h-11 bg-[#FFFDFC] border border-[#E6D9CC] rounded-xl px-3 text-xs text-[#2E211C] focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-xs font-bold text-[#2E211C] mb-1">
                    Payment Screenshot (Optional)
                  </label>
                  
                  {paymentScreenshot ? (
                    <div className="relative rounded-xl overflow-hidden border border-[#E6D9CC] bg-[#FFFDFC] p-2 flex items-center justify-between">
                      <img src={paymentScreenshot} alt="Proof" className="h-16 w-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setPaymentScreenshot('')}
                        className="px-3 py-1.5 bg-[#FFF5F3] text-[#A45145] text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-[#FFEAE6]"
                      >
                        <X size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  ) : (
                    <label className="h-20 border-2 border-dashed border-[#E4D1AD] rounded-xl bg-[#FFFDFC] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C9A66B] transition-colors p-2">
                      <UploadCloud size={20} className="text-[#C9A66B] mb-1" />
                      <span className="text-xs font-bold text-[#6B4A3A]">
                        Upload Payment Receipt / Screenshot
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#2E211C] mb-1.5">
                Special Requests / Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, preferences, stylist requests..."
                rows={3}
                className="w-full bg-[#FCF9F5] border border-[#E6D9CC] rounded-2xl p-3 text-xs text-[#2E211C] focus:outline-none focus:border-[#C9A66B]"
              />
            </div>

            {/* Submit Action */}
            <PrimaryGoldButton
              title={paymentMethod === 'online_payment' ? 'I HAVE MADE PAYMENT' : 'CONFIRM & BOOK APPOINTMENT'}
              onClick={handleBook}
              loading={loading}
              variant="chocolate"
            />
          </div>
        )}

      </div>

      <CustomerBottomNav active="Book" />
    </div>
  );
};
