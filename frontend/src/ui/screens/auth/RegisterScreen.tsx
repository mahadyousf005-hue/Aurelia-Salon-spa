import React, { useState } from 'react';
import { User, Mail, Phone, Flower, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { AureliaLogo } from '../../components/AureliaLogo';
import { AuthTextField } from '../../components/AuthTextField';
import { PasswordField } from '../../components/PasswordField';
import { PrimaryGoldButton } from '../../components/PrimaryGoldButton';
import { SALON_SPA_IMAGE } from '../../../data/salonData';

export const RegisterScreen: React.FC = () => {
  const { register, navigate, screenParams } = useAuth();
  const [role, setRole] = useState<'customer' | 'staff'>(screenParams.role === 'staff' ? 'staff' : 'customer');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.info('[SIGNUP] CREATE ACCOUNT BUTTON CLICKED', { role, hasName: Boolean(name.trim()), hasEmail: Boolean(email.trim()), hasPhone: Boolean(phone.trim()), passwordLength: password.length });
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Full Name, Email and Password are required.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await register(name, email, phone, password, role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3EC] flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-5xl bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl overflow-hidden shadow-[0px_16px_50px_rgba(58,36,28,0.12)] flex flex-col md:flex-row">
        
        {/* Left Side Editorial Image */}
        <div className="hidden md:flex md:w-1/2 relative min-h-[660px] bg-[#241611] overflow-hidden">
          <img
            src={SALON_SPA_IMAGE}
            alt="Aurelia Spa Ritual"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241611] via-[#241611]/60 to-transparent" />
          
          <div className="absolute inset-0 p-10 flex flex-col justify-end text-[#FFFDFC]">
            <div className="inline-flex items-center gap-2 border border-[#C9A66B] px-3.5 py-1.5 rounded-full mb-5 bg-[#241611]/40 backdrop-blur-xs w-max">
              <Flower size={15} className="text-[#C9A66B]" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#FFFDFC] uppercase">
                AURELIA SALON & SPA
              </span>
            </div>

            <h2 className="font-serif-luxury text-3xl lg:text-4xl font-bold leading-tight mb-3 text-[#FFFDFC]">
              Begin your <br /> self-care ritual.
            </h2>

            <p className="text-[#EFE5D8] text-xs lg:text-sm leading-relaxed max-w-sm">
              Create your account and discover a world of beauty, relaxation and personal care.
            </p>

            <div className="h-[1px] w-14 bg-[#C9A66B] my-6" />

            <span className="text-[10px] font-bold tracking-[0.25em] text-[#E4D1AD] uppercase">
              BEAUTY • WELLNESS • CARE
            </span>
          </div>
        </div>

        {/* Right Side Register Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => navigate('Login')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B4A3A] hover:text-[#3A241C] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </button>
          </div>

          <AureliaLogo size="md" className="mb-3" />

          <div className="mb-4 text-center">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
              JOIN US
            </span>
            <h1 className="text-2xl font-serif-luxury font-bold text-[#241611]">
              Create Account
            </h1>
            <p className="text-xs text-[#796A61] mt-1">
              Start your premium salon experience with us.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#FFF5F3] border border-[#E2C7C2] text-[#A45145] text-xs flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-1">
            <label className="block text-xs font-bold text-[#3A241C]">
              Account Type
              <select value={role} onChange={(event) => setRole(event.target.value as 'customer' | 'staff')} className="mt-1 w-full h-12 rounded-xl border border-[#E6D9CC] bg-[#FFFDFC] px-3 text-sm text-[#3A241C]">
                <option value="customer">Customer</option>
                <option value="staff">Staff Member</option>
              </select>
            </label>

            <AuthTextField
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              icon={<User size={19} />}
              required
            />

            <AuthTextField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              icon={<Mail size={19} />}
              type="email"
              required
            />

            <AuthTextField
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="03XX XXXXXXX"
              icon={<Phone size={19} />}
              type="tel"
            />

            <PasswordField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              required
            />

            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              required
            />

            <div className="pt-2">
              <PrimaryGoldButton
                title="CREATE ACCOUNT"
                onClick={handleRegister}
                loading={loading}
                variant="chocolate"
              />
            </div>
          </form>

          <div className="mt-5 text-center text-xs text-[#796A61]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('Login')}
              className="font-bold text-[#6B4A3A] hover:underline cursor-pointer ml-1"
            >
              Sign in
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
