import React, { useState } from 'react';
import { Mail, Sparkles, UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { AureliaLogo } from '../../components/AureliaLogo';
import { AuthTextField } from '../../components/AuthTextField';
import { PasswordField } from '../../components/PasswordField';
import { PrimaryGoldButton } from '../../components/PrimaryGoldButton';
import { AuthActionModal } from '../../components/AuthActionModal';
import { SALON_HERO_IMAGE } from '../../../data/salonData';

export const LoginScreen: React.FC = () => {
  const { login, navigate, screenParams, selectedRole, setSelectedRole } = useAuth();
  const role = screenParams.role || selectedRole;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoginModalOpen(true);
  };

  const confirmLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Email and password are required.');
      setIsLoginModalOpen(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await login(email, password, role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
      setIsLoginModalOpen(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotMsg("Password recovery instructions will be sent to your registered email if configured.");
    setTimeout(() => setForgotMsg(null), 6000);
  };

  return (
    <div className="min-h-screen bg-[#F8F3EC] flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-5xl bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl overflow-hidden shadow-[0px_16px_50px_rgba(58,36,28,0.12)] flex flex-col md:flex-row">
        
        {/* Left Side: Luxury Image & Editorial Banner for Desktop/Tablet */}
        <div className="hidden md:flex md:w-1/2 relative min-h-[620px] bg-[#241611] overflow-hidden">
          <img
            src={SALON_HERO_IMAGE}
            alt="Aurelia Salon Ambiance"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241611] via-[#241611]/60 to-transparent" />
          
          <div className="absolute inset-0 p-10 flex flex-col justify-end text-[#FFFDFC]">
            <div className="inline-flex items-center gap-2 border border-[#C9A66B] px-3.5 py-1.5 rounded-full mb-5 bg-[#241611]/40 backdrop-blur-xs w-max">
              <Sparkles size={15} className="text-[#C9A66B]" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#FFFDFC] uppercase">
                PREMIUM EXPERIENCE
              </span>
            </div>

            <h2 className="font-serif-luxury text-3xl lg:text-4xl font-bold leading-tight mb-3 text-[#FFFDFC]">
              Your moment of <br /> relaxation.
            </h2>

            <p className="text-[#EFE5D8] text-xs lg:text-sm leading-relaxed max-w-sm">
              Beauty, wellness and self-care brought together in one luxurious experience.
            </p>

            <div className="h-[1px] w-14 bg-[#C9A66B] my-6" />

            <span className="text-[10px] font-bold tracking-[0.25em] text-[#E4D1AD] uppercase">
              BEAUTY • WELLNESS • CARE
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Mobile Image Banner */}
          <div className="block md:hidden relative h-36 rounded-2xl overflow-hidden mb-6 bg-[#241611]">
            <img
              src={SALON_HERO_IMAGE}
              alt="Aurelia Salon"
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241611]/80 to-transparent flex items-end p-4">
              <span className="text-white font-serif-luxury text-lg font-bold">
                Aurelia Salon & Spa
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                setSelectedRole(null);
                navigate('RoleSelection');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B4A3A] hover:text-[#3A241C] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Change Role</span>
            </button>
            
          </div>

          <AureliaLogo size="md" className="mb-4" />

          <div className="mb-5 text-center">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
              WELCOME BACK
            </span>
            <h1 className="text-2xl font-serif-luxury font-bold text-[#241611]">
              Welcome Back
            </h1>
            <p className="text-xs text-[#796A61] mt-1">
              Sign in to continue your beautiful journey.
            </p>


          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#FFF5F3] border border-[#E2C7C2] text-[#A45145] text-xs flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {screenParams.signupMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#F1F6F0] border border-[#58745A]/30 text-[#58745A] text-xs">
              {screenParams.signupMessage}
            </div>
          )}

          {forgotMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#F4EDE6] border border-[#C9A66B] text-[#3A241C] text-xs">
              {forgotMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-1">
            <AuthTextField
              label="Email / Phone / Username"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com or 03XX..."
              icon={<Mail size={19} />}
              type="text"
              required
            />

            <PasswordField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              required
            />

            <div className="flex justify-end pt-1 pb-4">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-bold text-[#6B4A3A] hover:text-[#3A241C] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <PrimaryGoldButton
              title="SIGN IN"
              onClick={handleLogin}
              loading={loading}
              variant="chocolate"
            />
          </form>

          <div className="flex items-center my-4">
            <div className="flex-1 h-[1px] bg-[#E6D9CC]" />
            <span className="px-3 text-[10px] font-bold text-[#A89A91] tracking-wider uppercase">
              OR
            </span>
            <div className="flex-1 h-[1px] bg-[#E6D9CC]" />
          </div>

          {role === 'admin' ? (
            <div className="mt-5 p-3 rounded-xl bg-[#F4EDE6] border border-[#C9A66B] text-[#3A241C] text-xs text-center">
              Administrator accounts are created securely by the salon owner. Please sign in with your admin credentials.
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('Register', { role: role || 'customer' })}
                className="w-full h-[52px] border border-[#3A241C] rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-[#3A241C] tracking-wider uppercase hover:bg-[#3A241C]/5 transition-colors cursor-pointer"
              >
                <UserPlus size={17} />
                <span>CREATE AN ACCOUNT</span>
              </button>

              <div className="mt-5 text-center text-xs text-[#796A61]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('Register', { role: role || 'customer' })}
                  className="font-bold text-[#6B4A3A] hover:underline cursor-pointer ml-1"
                >
                  Create one
                </button>
              </div>
            </>
          )}
        </div>

      </div>

      <AuthActionModal action="login" isOpen={isLoginModalOpen} loading={loading} onClose={() => setIsLoginModalOpen(false)} onConfirm={confirmLogin} />
    </div>
  );
};
