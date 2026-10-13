import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, AlertTriangle, ArrowRight, Eye, EyeOff, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { SmarteuraLogo } from './SmarteuraLogo';
import {
  verifyAdminCredentials,
  getAdminRateLimitStatus,
  isAuthorizedAdminEmail,
  createAdminSession
} from '../lib/security';
import { auth, signInWithGoogle } from '../lib/firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const currentUser = auth.currentUser;
  const isGoogleAdmin = isAuthorizedAdminEmail(currentUser?.email);

  // Check rate limit on open and run cooldown timer
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError(null);
      setShowPassword(false);
      setIsSubmitting(false);

      const status = getAdminRateLimitStatus();
      if (status.isLocked) {
        setLockoutRemaining(status.remainingSeconds);
      } else {
        setLockoutRemaining(0);
        const timer = setTimeout(() => {
          usernameInputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await verifyAdminCredentials(username, password);

      if (result.success) {
        setIsSubmitting(false);
        onSuccess();
      } else {
        setIsSubmitting(false);
        setError(result.error || 'İstifadəçi adı və ya şifrə yanlışdır.');
        if (result.remainingSeconds && result.remainingSeconds > 0) {
          setLockoutRemaining(result.remainingSeconds);
        }
      }
    } catch {
      setIsSubmitting(false);
      setError('Təhlükəsizlik yoxlanışı zamanı xəta baş verdi. Yenidən cəhd edin.');
    }
  };

  const handleGoogleAdminLogin = async () => {
    if (!isGoogleAdmin) return;
    setIsSubmitting(true);
    try {
      await createAdminSession();
      setIsSubmitting(false);
      onSuccess();
    } catch {
      setIsSubmitting(false);
      setError('Google Admin sessiyası yaradıla bilmədi.');
    }
  };

  const handleSignInWithGoogleAdmin = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (isAuthorizedAdminEmail(user.email)) {
        await createAdminSession();
        setIsSubmitting(false);
        onSuccess();
      } else {
        setIsSubmitting(false);
        setError(`Səlahiyyətsiz hesab: ${user.email}. Yalnız rəsmi super admin (xgoodofficial@gmail.com) daxil ola bilər.`);
      }
    } catch (e: any) {
      setIsSubmitting(false);
      setError('Google ilə daxil olarkən xəta baş verdi.');
    }
  };

  return (
    <div
      id="admin-login-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#123F32]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        id="admin-login-modal-box"
        className="w-full max-w-md bg-white rounded-2xl border border-[#D5DED6] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        {/* Modal Header */}
        <div className="relative bg-[#123F32] text-white p-6 sm:p-7 flex flex-col items-center text-center">
          <button
            id="admin-login-modal-close-btn"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Bağla"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3 shadow-inner">
            <SmarteuraLogo variant="white" className="w-9 h-9" />
          </div>

          <h2 id="admin-modal-title" className="text-xl font-bold font-mono tracking-tight text-white">
            SMARTEURA
          </h2>
          <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-[#194E3E] border border-white/15 text-[11px] font-medium text-[#D5DED6]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#849C8F]" />
            <span>Admin İdarəetmə Paneli (Təhlükəsiz Giriş)</span>
          </div>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 sm:p-7 bg-[#F8F9F6]">
          {/* Quick Google Admin Authorized Login Option */}
          {isGoogleAdmin ? (
            <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#193E33]">
              <div className="flex items-center gap-2 mb-2 font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Google Admin Hesabı Aktivdir</span>
              </div>
              <p className="text-[11px] text-[#586B62] mb-3">
                {currentUser?.email} ünvanı rəsmi idarəçi kimi tanındı.
              </p>
              <button
                type="button"
                onClick={handleGoogleAdminLogin}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Google İlə Birbaşa Admin Panelə Keç</span>
              </button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D5DED6]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono text-[#586B62] bg-emerald-50 px-2">
                  və ya şifrə ilə daxil olun
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-5 p-4 rounded-xl bg-white border border-[#D5DED6] text-xs text-[#193E33] shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5 font-semibold text-[#193E33]">
                <ShieldCheck className="w-4 h-4 text-[#123F32]" />
                <span>Google Cloud Admin Girişi</span>
              </div>
              <p className="text-[11px] text-[#586B62] mb-3">
                Səlahiyyətli admin hesabı (xgoodofficial@gmail.com) ilə təhlükəsiz Google girişi edin.
              </p>
              <button
                type="button"
                onClick={handleSignInWithGoogleAdmin}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Google İlə Daxil Ol (Admin)</span>
              </button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D5DED6]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono text-[#586B62] bg-white px-2">
                  və ya istifadəçi adı və şifrə ilə
                </div>
              </div>
            </div>
          )}

          {lockoutRemaining > 0 ? (
            <div
              id="admin-modal-lockout"
              className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800 flex items-start gap-3 animate-in fade-in"
            >
              <Clock className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Təhlükəsizlik Kilidi Aktivdir</p>
                <p className="text-[#586B62] text-[11px] leading-relaxed">
                  Çox sayda uğursuz cəhd edildiyi üçün sistem qorunma rejiminə keçib. Gözləmə müddəti:{' '}
                  <span className="font-mono font-bold text-amber-900">{lockoutRemaining} saniyə</span>.
                </p>
              </div>
            </div>
          ) : error ? (
            <div
              id="admin-modal-error"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-start gap-2.5 animate-in shake duration-200"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-modal-username"
                className="block text-xs font-semibold text-[#193E33] mb-1.5 uppercase tracking-wider"
              >
                İstifadəçi adı (Username)
              </label>
              <input
                id="admin-modal-username"
                ref={usernameInputRef}
                type="text"
                required
                disabled={lockoutRemaining > 0 || isSubmitting}
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=""
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DED6] text-sm text-[#193E33] placeholder-[#8A9B92] focus:outline-hidden focus:border-[#123F32] focus:ring-2 focus:ring-[#123F32]/10 transition-all font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="admin-modal-password"
                className="block text-xs font-semibold text-[#193E33] mb-1.5 uppercase tracking-wider"
              >
                Şifrə (Password)
              </label>
              <div className="relative">
                <input
                  id="admin-modal-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={lockoutRemaining > 0 || isSubmitting}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full pl-3.5 pr-11 py-2.5 rounded-xl bg-white border border-[#D5DED6] text-sm text-[#193E33] placeholder-[#8A9B92] focus:outline-hidden focus:border-[#123F32] focus:ring-2 focus:ring-[#123F32]/10 transition-all font-mono disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#586B62] hover:text-[#123F32] transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Şifrəni gizlə' : 'Şifrəni göstər'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                id="admin-modal-submit-btn"
                type="submit"
                disabled={isSubmitting || lockoutRemaining > 0}
                className="w-full py-3 rounded-xl bg-[#123F32] hover:bg-[#25664E] active:bg-[#0D2D24] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Kriptoqrafik Yoxlama...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Daxil ol</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
