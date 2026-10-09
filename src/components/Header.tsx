import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Globe, ArrowUpRight, HardDrive, LogIn, User as UserIcon, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import type { User } from 'firebase/auth';
import { Language } from '../types';
import { translations } from '../data/translations';
import { SmarteuraLogo } from './SmarteuraLogo';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenAdminLogin?: () => void;
  onOpenWorkspace?: () => void;
  user?: User | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'lt', label: 'LT', flag: '🇱🇹' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'nl', label: 'NL', flag: '🇳🇱' },
  { code: 'tr', label: 'TR', flag: '🇹🇷' }
];

const LOGIN_I18N: Record<string, { login: string; cabinet: string; logout: string; verified: string }> = {
  en: { login: 'Login', cabinet: 'Dashboard', logout: 'Sign Out', verified: 'Verified' },
  lt: { login: 'Prisijungti', cabinet: 'Kabinetas', logout: 'Atsijungti', verified: 'Patvirtinta' },
  fr: { login: 'Connexion', cabinet: 'Mon Espace', logout: 'Déconnexion', verified: 'Vérifié' },
  nl: { login: 'Inloggen', cabinet: 'Mijn Kabinet', logout: 'Uitloggen', verified: 'Geverifieerd' },
  tr: { login: 'Giriş Yap', cabinet: 'Kişisel Panel', logout: 'Çıkış Yap', verified: 'Onaylı' },
  az: { login: 'Daxil ol', cabinet: 'Şəxsi Kabinet', logout: 'Çıxış', verified: 'Təsdiqlənmiş' }
};

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activePage,
  onNavigate,
  onOpenAdminLogin,
  onOpenWorkspace,
  user,
  onOpenLogin,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const t = translations[currentLang].nav;
  const loginI18n = LOGIN_I18N[currentLang] || LOGIN_I18N.en;

  const handleLoginClick = () => {
    if (user) {
      onNavigate('cabinet');
    } else if (onOpenLogin) {
      onOpenLogin();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoClickCountRef = useRef<number>(0);

  const navItems = [
    { id: 'services', label: t.services },
    { id: 'projects', label: t.projects },
    { id: 'gallery', label: t.gallery },
    { id: 'career', label: t.career },
    { id: 'about', label: t.about },
    { id: 'news', label: t.news },
    { id: 'contacts', label: t.contacts }
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (logoClickTimeoutRef.current) {
      clearTimeout(logoClickTimeoutRef.current);
    }

    logoClickCountRef.current += 1;

    // Check if 6 clicks reached
    if (logoClickCountRef.current >= 6) {
      e.preventDefault();
      e.stopPropagation();
      logoClickCountRef.current = 0;
      if (onOpenAdminLogin) {
        onOpenAdminLogin();
      }
      return;
    }

    // Reset after 3.5 seconds of inactivity
    logoClickTimeoutRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 3500);

    // Regular navigation to home
    handleNavClick('home');
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#D5DED6] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name (Clicking 6 times triggers secret Admin Login) */}
          <button
            id="brand-logo-btn"
            onClick={handleLogoClick}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden select-none"
            aria-label="SMARTEURA Home"
          >
            <div className="shrink-0 transition-transform duration-200 group-hover:scale-105 active:scale-95">
              <SmarteuraLogo className="w-10 h-10 sm:w-11 sm:h-11" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-xl sm:text-2xl text-[#123F32] font-sans leading-tight">
                SMARTEURA
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#586B62] group-hover:text-[#123F32] transition-colors">
                Smarter European Industry
              </span>
            </div>
          </button>

          {/* Desktop Nav Items in strict order */}
          <nav
            id="desktop-navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#123F32] font-semibold bg-[#EAF0E9]'
                      : 'text-[#193E33] hover:text-[#123F32] hover:bg-[#F8F9F6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="language-switcher-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5DED6] bg-[#F8F9F6] text-xs font-semibold text-[#193E33] hover:bg-[#EAF0E9] transition-colors cursor-pointer"
                aria-expanded={langDropdownOpen}
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#586B62]" />
                <span className="uppercase">{currentLang}</span>
              </button>

              {langDropdownOpen && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-[#D5DED6] py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      id={`lang-select-${l.code}`}
                      onClick={() => {
                        onLanguageChange(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left cursor-pointer transition-colors ${
                        currentLang === l.code
                          ? 'bg-[#EAF0E9] text-[#123F32] font-bold'
                          : 'text-[#193E33] hover:bg-[#F8F9F6]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {currentLang === l.code && <span className="w-1.5 h-1.5 rounded-full bg-[#123F32]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile or Login Button */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="header-btn-workspace"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activePage === 'cabinet'
                      ? 'border-[#123F32] bg-[#123F32] text-white shadow-xs'
                      : 'border-[#D5DED6] bg-[#F8F9F6] text-[#123F32] hover:bg-[#EAF0E9] hover:border-[#123F32]'
                  }`}
                  aria-label={loginI18n.cabinet}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-[#123F32]/20"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                  <span>{user.displayName?.split(' ')[0] || loginI18n.cabinet}</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white shadow-xl border border-[#D5DED6] py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3.5 py-2 border-b border-[#EAF0E9]">
                      <p className="text-xs font-bold text-[#193E33] truncate">
                        {user.displayName || 'Smarteura User'}
                      </p>
                      <p className="text-[11px] text-[#586B62] truncate font-mono">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('cabinet');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#193E33] hover:bg-[#EAF0E9] transition-colors text-left cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#123F32]" />
                      <span>{loginI18n.cabinet}</span>
                    </button>

                    {onLogout && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors text-left cursor-pointer border-t border-[#EAF0E9]"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-600" />
                        <span>{loginI18n.logout}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-btn-workspace"
                onClick={handleLoginClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#D5DED6] bg-[#F8F9F6] text-[#123F32] hover:bg-[#EAF0E9] hover:border-[#123F32] text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs"
                title={loginI18n.login}
                aria-label={loginI18n.login}
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                <span>{loginI18n.login}</span>
              </button>
            )}

            {/* CTA Discuss Project */}
            <button
              id="header-cta-discuss"
              onClick={() => handleNavClick('contacts')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E] transition-colors shadow-xs cursor-pointer"
            >
              <span>{t.discussProject}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile language button quick toggle */}
            <button
              id="mobile-lang-quick"
              onClick={() => {
                const nextIdx = (LANGUAGES.findIndex((l) => l.code === currentLang) + 1) % LANGUAGES.length;
                onLanguageChange(LANGUAGES[nextIdx].code);
              }}
              className="px-2.5 py-1.5 rounded-md border border-[#D5DED6] text-xs font-bold text-[#123F32] uppercase bg-[#F8F9F6]"
            >
              {currentLang}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#193E33] hover:bg-[#F8F9F6] border border-[#D5DED6]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden bg-white border-b border-[#D5DED6] px-4 pt-2 pb-6 space-y-2 shadow-md animate-in slide-in-from-top-2 duration-150"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                activePage === item.id
                  ? 'bg-[#EAF0E9] text-[#123F32] font-bold'
                  : 'text-[#193E33] hover:bg-[#F8F9F6]'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#D5DED6] flex flex-col gap-2">
            {/* Mobile User or Login */}
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-xl bg-[#F8F9F6] border border-[#D5DED6] flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#123F32]/20"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#123F32] text-white flex items-center justify-center font-bold">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#193E33] truncate">
                      {user.displayName || 'Smarteura User'}
                    </p>
                    <p className="text-xs text-[#586B62] truncate font-mono">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  id="mobile-btn-workspace"
                  onClick={() => {
                    onNavigate('cabinet');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#123F32] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{loginI18n.cabinet}</span>
                </button>

                {onLogout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{loginI18n.logout}</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                id="mobile-btn-workspace"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLoginClick();
                }}
                className="w-full py-2.5 rounded-lg border border-[#D5DED6] bg-[#F8F9F6] text-[#123F32] hover:bg-[#EAF0E9] text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <LogIn className="w-4 h-4 text-emerald-700" />
                <span>{loginI18n.login}</span>
              </button>
            )}

            <button
              id="mobile-cta-discuss"
              onClick={() => handleNavClick('contacts')}
              className="w-full py-2.5 rounded-lg bg-[#123F32] text-white text-sm font-semibold text-center hover:bg-[#25664E]"
            >
              {t.discussProject}
            </button>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#586B62] font-medium">Select language:</span>
              <div className="flex items-center gap-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-md uppercase font-semibold ${
                      currentLang === l.code
                        ? 'bg-[#123F32] text-white'
                        : 'bg-[#F8F9F6] text-[#193E33] border border-[#D5DED6]'
                    }`}
                  >
                    {l.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
