import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, AlertTriangle, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { SmarteuraLogo } from './SmarteuraLogo';

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

  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Focus username input when modal opens & reset state
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError(null);
      setShowPassword(false);
      setIsSubmitting(false);

      const timer = setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // Required credentials:
    // username - control
    // password - 010203040506070809smarteura
    if (cleanUser === 'control' && cleanPass === '010203040506070809smarteura') {
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 300);
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setError('İstifadəçi adı və ya şifrə yanlışdır. (Invalid username or password)');
      }, 250);
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
            <span>Admin İdarəetmə Paneli</span>
          </div>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 sm:p-7 bg-[#F8F9F6]">
          {error && (
            <div
              id="admin-modal-error"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-start gap-2.5 animate-in shake duration-200"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

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
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=""
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DED6] text-sm text-[#193E33] placeholder-[#8A9B92] focus:outline-hidden focus:border-[#123F32] focus:ring-2 focus:ring-[#123F32]/10 transition-all font-mono"
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full pl-3.5 pr-11 py-2.5 rounded-xl bg-white border border-[#D5DED6] text-sm text-[#193E33] placeholder-[#8A9B92] focus:outline-hidden focus:border-[#123F32] focus:ring-2 focus:ring-[#123F32]/10 transition-all font-mono"
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
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#123F32] hover:bg-[#25664E] active:bg-[#0D2D24] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Yoxlanılır...</span>
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
