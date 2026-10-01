import React from 'react';
import { ShieldCheck, MapPin, Building, Calendar } from 'lucide-react';
import { Language, SiteSettings } from '../types';
import { translations } from '../data/translations';

interface AboutPageProps {
  lang: Language;
  settings: SiteSettings;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang, settings }) => {
  const t = translations[lang].about;

  return (
    <div id="about-page-container" className="py-12 md:py-20 bg-[#F8F9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#123F32]">
            Corporate Profile
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#193E33] mt-2 mb-4">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-[#586B62] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Corporate Facts Grid (Section 2 & 14) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl border border-[#D5DED6] p-6 shadow-xs">
            <Building className="w-6 h-6 text-[#123F32] mb-3" />
            <span className="text-xs text-[#586B62] uppercase tracking-wider block font-semibold">
              Legal Name
            </span>
            <strong className="text-lg font-bold text-[#193E33] block mt-1">
              UAB Smarteura
            </strong>
            <span className="text-xs text-[#586B62] mt-1 block">
              Corporate entity in Lithuania
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5DED6] p-6 shadow-xs">
            <Calendar className="w-6 h-6 text-[#123F32] mb-3" />
            <span className="text-xs text-[#586B62] uppercase tracking-wider block font-semibold">
              Date of Incorporation
            </span>
            <strong className="text-lg font-bold text-[#193E33] block mt-1">
              March 2022
            </strong>
            <span className="text-xs text-[#586B62] mt-1 block">
              Established in Lithuania · 2022
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5DED6] p-6 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#123F32] mb-3" />
            <span className="text-xs text-[#586B62] uppercase tracking-wider block font-semibold">
              Brand Slogan
            </span>
            <strong className="text-lg font-bold text-[#193E33] block mt-1">
              {settings.brandSlogan}
            </strong>
            <span className="text-xs text-[#586B62] mt-1 block">
              Registered corporate mark
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5DED6] p-6 shadow-xs">
            <MapPin className="w-6 h-6 text-[#123F32] mb-3" />
            <span className="text-xs text-[#586B62] uppercase tracking-wider block font-semibold">
              Target Markets
            </span>
            <strong className="text-base font-bold text-[#193E33] block mt-1">
              LT, FR, NL, DE
            </strong>
            <span className="text-xs text-[#586B62] mt-1 block">
              Lithuania, France, Netherlands, Germany
            </span>
          </div>
        </div>

        {/* Narrative & Market Reach */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl border border-[#D5DED6] p-8 sm:p-10 shadow-xs space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#193E33] mb-3">
                {t.historyTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#586B62] leading-relaxed">
                {t.historyText}
              </p>
            </div>

            <div className="pt-4 border-t border-[#D5DED6]">
              <h3 className="text-lg font-bold text-[#193E33] mb-2">
                {t.marketsTitle}
              </h3>
              <p className="text-sm text-[#586B62] leading-relaxed">
                {t.marketsText}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
