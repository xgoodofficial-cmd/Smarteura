import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Wrench, Layers, Cog, Gauge, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { HomeWorkersClients } from '../components/HomeWorkersClients';

interface HomePageProps {
  lang: Language;
  onNavigate: (page: string) => void;
  onOpenCvModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ lang, onNavigate, onOpenCvModal }) => {
  const t = translations[lang];

  return (
    <div id="home-page-container">
      {/* Hero Section */}
      <section
        id="hero-section"
        className="relative bg-[#FFFFFF] border-b border-[#D5DED6] pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF0E9] border border-[#D5DED6] text-xs font-bold uppercase tracking-wider text-[#123F32]">
                <Shield className="w-3.5 h-3.5 text-[#123F32]" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#193E33] leading-[1.12]">
                {t.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-[#586B62] leading-relaxed max-w-2xl">
                {t.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  id="hero-cta-discuss"
                  onClick={() => onNavigate('contacts')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-cta-services"
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F8F9F6] hover:bg-[#EAF0E9] text-[#193E33] border border-[#D5DED6] text-sm font-semibold transition-colors cursor-pointer"
                >
                  <span>{t.hero.ctaSecondary}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#586B62]" />
                </button>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-6 border-t border-[#D5DED6] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-[#586B62]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#123F32] shrink-0" />
                  <span>ISO 9606 Certified Welds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#123F32] shrink-0" />
                  <span>Pan-European Mobility</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#123F32] shrink-0" />
                  <span>Verified Industrial Teams</span>
                </div>
              </div>
            </div>

            {/* Right Industrial Graphic Representation */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-[#D5DED6] bg-[#F8F9F6] p-6 sm:p-8 shadow-xs overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D5DED6]">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#123F32] font-bold">
                      SMARTEURA TECHNICAL MATRIX
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-sm bg-[#EAF0E9] text-[#193E33] font-semibold">
                      EU Standard
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white border border-[#D5DED6]">
                      <span className="text-[10px] text-[#586B62] uppercase tracking-wider block">Discipline</span>
                      <strong className="text-[#193E33] text-sm block mt-0.5">Industrial Piping</strong>
                      <span className="text-[11px] text-[#586B62]">EN & ISO Compliant</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-[#D5DED6]">
                      <span className="text-[10px] text-[#586B62] uppercase tracking-wider block">Qualification</span>
                      <strong className="text-[#193E33] text-sm block mt-0.5">TIG & Orbital</strong>
                      <span className="text-[11px] text-[#586B62]">Pressure Vessel Ready</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-[#D5DED6]">
                      <span className="text-[10px] text-[#586B62] uppercase tracking-wider block">Operations</span>
                      <strong className="text-[#193E33] text-sm block mt-0.5">Mechanical Line</strong>
                      <span className="text-[11px] text-[#586B62]">Laser Alignment</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-[#D5DED6]">
                      <span className="text-[10px] text-[#586B62] uppercase tracking-wider block">Hub</span>
                      <strong className="text-[#193E33] text-sm block mt-0.5">Lithuania</strong>
                      <span className="text-[11px] text-[#586B62]">Est. 2022</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#123F32] text-white">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold">Core Target Territories</span>
                      <span className="text-[#96B5A1]">4 Markets</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2 text-xs font-medium">
                      <span className="px-2.5 py-1 rounded-md bg-[#25664E] text-[#EAF0E9]">Lithuania (HQ)</span>
                      <span className="px-2.5 py-1 rounded-md bg-[#25664E] text-[#EAF0E9]">France</span>
                      <span className="px-2.5 py-1 rounded-md bg-[#25664E] text-[#EAF0E9]">Netherlands</span>
                      <span className="px-2.5 py-1 rounded-md bg-[#25664E] text-[#EAF0E9]">Germany</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Services Overview Section */}
      <section id="home-services-section" className="py-16 md:py-24 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#123F32]">
                Disciplines & Capabilities
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#193E33] mt-2">
                {t.services.title}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#123F32] hover:text-[#25664E]"
            >
              <span>View all capabilities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <div
              id="service-card-piping"
              className="bg-[#F8F9F6] rounded-xl border border-[#D5DED6] p-6 hover:border-[#123F32] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#D5DED6] flex items-center justify-center text-[#123F32] mb-5">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#193E33] mb-2">
                  {t.services.mainPiping}
                </h3>
                <p className="text-xs sm:text-sm text-[#586B62] leading-relaxed">
                  {t.services.mainPipingDesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D5DED6] text-xs font-semibold text-[#123F32]">
                EN / ISO Standards
              </div>
            </div>

            {/* Service 2 */}
            <div
              id="service-card-welding"
              className="bg-[#F8F9F6] rounded-xl border border-[#D5DED6] p-6 hover:border-[#123F32] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#D5DED6] flex items-center justify-center text-[#123F32] mb-5">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#193E33] mb-2">
                  {t.services.mainWelding}
                </h3>
                <p className="text-xs sm:text-sm text-[#586B62] leading-relaxed">
                  {t.services.mainWeldingDesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D5DED6] text-xs font-semibold text-[#123F32]">
                ISO 9606 Qualified
              </div>
            </div>

            {/* Service 3 */}
            <div
              id="service-card-assembly"
              className="bg-[#F8F9F6] rounded-xl border border-[#D5DED6] p-6 hover:border-[#123F32] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#D5DED6] flex items-center justify-center text-[#123F32] mb-5">
                  <Cog className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#193E33] mb-2">
                  {t.services.mainAssembly}
                </h3>
                <p className="text-xs sm:text-sm text-[#586B62] leading-relaxed">
                  {t.services.mainAssemblyDesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D5DED6] text-xs font-semibold text-[#123F32]">
                Precision Alignment
              </div>
            </div>

            {/* Service 4 */}
            <div
              id="service-card-installation"
              className="bg-[#F8F9F6] rounded-xl border border-[#D5DED6] p-6 hover:border-[#123F32] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#D5DED6] flex items-center justify-center text-[#123F32] mb-5">
                  <Gauge className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#193E33] mb-2">
                  {t.services.mainInstallation}
                </h3>
                <p className="text-xs sm:text-sm text-[#586B62] leading-relaxed">
                  {t.services.mainInstallationDesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D5DED6] text-xs font-semibold text-[#123F32]">
                Turnkey Positioning
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Blocks for Workers and Clients (Section 8) */}
      <HomeWorkersClients
        lang={lang}
        onNavigate={onNavigate}
        onOpenCvModal={onOpenCvModal}
      />
    </div>
  );
};
