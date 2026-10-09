import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { signInWithGoogle } from '../lib/firebase';
import type { User } from 'firebase/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSuccess: (user: User) => void;
}

const MODAL_I18N: Record<string, {
  title: string;
  subtitle: string;
  googleBtn: string;
  loading: string;
  securityNotice: string;
  benefitsTitle: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  close: string;
  errorGeneric: string;
}> = {
  az: {
    title: 'Şəxsi Kabinetə Giriş',
    subtitle: 'Google hesabınız ilə sürətli və təhlükəsiz daxil olun.',
    googleBtn: 'Google ilə Daxil Ol',
    loading: 'Google ilə əlaqə qurulur...',
    securityNotice: 'Google Identity & Firebase ilə 256-bit SSL şifrələnmə ilə qorunur',
    benefitsTitle: 'Şəxsi Kabinetin üstünlükləri:',
    benefit1: 'Göndərilmiş layihə və qiymət sorğularının canlı izlənməsi',
    benefit2: 'Karyera və CV müraciətlərinin statusu',
    benefit3: 'Şəxsi məlumatların və əlaqə detallarının idarə edilməsi',
    close: 'Bağla',
    errorGeneric: 'Daxil olarkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.'
  },
  en: {
    title: 'Customer & Partner Portal',
    subtitle: 'Sign in quickly and securely with your Google account.',
    googleBtn: 'Sign in with Google',
    loading: 'Connecting to Google...',
    securityNotice: 'Protected by Google Identity & Firebase with 256-bit SSL encryption',
    benefitsTitle: 'Personal Cabinet Features:',
    benefit1: 'Real-time tracking of submitted project inquiries & RFQs',
    benefit2: 'Direct visibility on candidate CV applications',
    benefit3: 'Centralized profile and cooperation management',
    close: 'Close',
    errorGeneric: 'An error occurred during sign-in. Please try again.'
  },
  lt: {
    title: 'Prisijungimas prie Paskyros',
    subtitle: 'Prisijunkite greitai ir saugiai naudodami „Google“ paskyrą.',
    googleBtn: 'Prisijungti su Google',
    loading: 'Jungiamasi prie „Google“...',
    securityNotice: 'Apsaugota „Google Identity“ ir „Firebase“ 256 bitų šifravimu',
    benefitsTitle: 'Asmeninio kabineto galimybės:',
    benefit1: 'Pateiktų projektų užklausų stebėjimas realiuoju laiku',
    benefit2: 'Kandidatų CV paraiškų statuso peržiūra',
    benefit3: 'Asmeninių duomenų ir kontaktų valdymas',
    close: 'Uždaryti',
    errorGeneric: 'Prisijungiant įvyko klaida. Bandykite dar kartą.'
  },
  fr: {
    title: 'Espace Client & Partenaire',
    subtitle: 'Connectez-vous rapidement et en toute sécurité avec Google.',
    googleBtn: 'Se connecter avec Google',
    loading: 'Connexion à Google en cours...',
    securityNotice: 'Sécurisé par Google Identity & Firebase avec cryptage 256-bit SSL',
    benefitsTitle: 'Fonctionnalités de votre espace personnel :',
    benefit1: 'Suivi en temps réel des demandes de projets et devis',
    benefit2: 'Consultation du statut de vos candidatures et CV',
    benefit3: 'Gestion simplifiée de vos coordonnées et projets',
    close: 'Fermer',
    errorGeneric: 'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
  },
  nl: {
    title: 'Inloggen op Klantportaal',
    subtitle: 'Meld u snel en veilig aan met uw Google-account.',
    googleBtn: 'Inloggen met Google',
    loading: 'Verbinding maken met Google...',
    securityNotice: 'Beveiligd door Google Identity & Firebase met 256-bit SSL-versleuteling',
    benefitsTitle: 'Voordelen van het Klantportaal:',
    benefit1: 'Live opvolging van projectaanvragen en offertes',
    benefit2: 'Overzicht van ingediende sollicitaties en cv’s',
    benefit3: 'Beheer van uw contact- en profielgegevens',
    close: 'Sluiten',
    errorGeneric: 'Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.'
  },
  tr: {
    title: 'Kişisel Panele Giriş',
    subtitle: 'Google hesabınızla hızlı ve güvenli şekilde giriş yapın.',
    googleBtn: 'Google ile Giriş Yap',
    loading: 'Google ile bağlantı kuruluyor...',
    securityNotice: 'Google Identity & Firebase ile 256-bit SSL şifreleme güvencesi',
    benefitsTitle: 'Kişisel Panel Avantajları:',
    benefit1: 'Gönderilen proje ve teklif taleplerini anlık takip',
    benefit2: 'Kariyer ve CV başvurularının durum bilgisi',
    benefit3: 'İletişim ve kurumsal bilgilerin yönetimi',
    close: 'Kapat',
    errorGeneric: 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
  }
};

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = MODAL_I18N[lang] || MODAL_I18N.en;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const user = await signInWithGoogle();
      onSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage(null);
      } else if (err?.code === 'auth/cancelled-popup-request') {
        setErrorMessage(null);
      } else {
        setErrorMessage(err?.message || t.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#D5DED6] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Decorative Top Banner */}
        <div className="bg-[#123F32] px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              SMARTEURA PORTAL
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            id="modal-btn-google-login"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 font-semibold text-sm shadow-sm hover:shadow transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 text-[#123F32] animate-spin" />
                <span>{t.loading}</span>
              </>
            ) : (
              <>
                {/* Official Google G Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.86c2.26-2.09 3.68-5.17 3.68-9.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.37 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.98-3.1z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.98 3.1c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                <span>{t.googleBtn}</span>
                <ArrowRight className="w-4 h-4 ml-auto text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          {/* Benefits Box */}
          <div className="mt-6 pt-5 border-t border-[#EAEFEA] space-y-2.5">
            <span className="text-xs font-semibold text-[#193E33] block">
              {t.benefitsTitle}
            </span>
            <ul className="space-y-2 text-xs text-[#586B62]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t.benefit1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t.benefit2}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t.benefit3}</span>
              </li>
            </ul>
          </div>

          {/* Security Badge */}
          <div className="mt-5 p-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] flex items-center justify-center gap-2 text-[11px] text-[#586B62]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#123F32]" />
            <span>{t.securityNotice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
