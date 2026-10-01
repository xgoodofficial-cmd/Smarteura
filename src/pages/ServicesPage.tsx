import React from 'react';
import { Layers, Wrench, Cog, Gauge, Anchor, Box, ShieldAlert, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface ServicesPageProps {
  lang: Language;
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ lang, onNavigate }) => {
  const t = translations[lang].services;

  const mainServices = [
    {
      id: 'piping',
      icon: Layers,
      title: t.mainPiping,
      desc: t.mainPipingDesc,
      scope: ['Carbon & Stainless Steel Spools', 'Hydraulic & Pneumatic Lines', 'Isometric Prefabrication', 'Pressure Testing & Flange Tightening']
    },
    {
      id: 'welding',
      icon: Wrench,
      title: t.mainWelding,
      desc: t.mainWeldingDesc,
      scope: ['TIG (141) High-Purity Welding', 'MIG / MAG (135/136) Structural', 'MMA (111) Stick Welding', 'ISO 9606 Certification Records']
    },
    {
      id: 'assembly',
      icon: Cog,
      title: t.mainAssembly,
      desc: t.mainAssemblyDesc,
      scope: ['Heavy Machinery Alignment', 'Conveyor & Gearbox Erection', 'Laser Shaft Measurement', 'Torque-Controlled Fastening']
    },
    {
      id: 'installation',
      icon: Gauge,
      title: t.mainInstallation,
      desc: t.mainInstallationDesc,
      scope: ['Pumping Stations & Skids', 'Industrial Boilers & Exchangers', 'Vibration Damping Systems', 'Commissioning Mechanical Support']
    }
  ];

  const additionalCapabilities = [
    {
      id: 'process-piping',
      icon: Layers,
      title: t.additionalPiping,
      desc: t.additionalPipingDesc
    },
    {
      id: 'metal-structures',
      icon: Box,
      title: t.additionalStructures,
      desc: t.additionalStructuresDesc
    },
    {
      id: 'marine-assembly',
      icon: Anchor,
      title: t.additionalMarine,
      desc: t.additionalMarineDesc
    }
  ];

  return (
    <div id="services-page-container" className="py-12 md:py-20 bg-[#F8F9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#123F32]">
            Core Disciplines
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#193E33] mt-2 mb-4">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-[#586B62] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 4 Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {mainServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                id={`detailed-service-${srv.id}`}
                className="bg-white rounded-2xl border border-[#D5DED6] p-8 shadow-xs flex flex-col justify-between hover:border-[#123F32] transition-colors"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EAF0E9] text-[#123F32] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-[#193E33] mb-3">
                    {srv.title}
                  </h2>
                  <p className="text-sm text-[#586B62] leading-relaxed mb-6">
                    {srv.desc}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-[#D5DED6]">
                    <span className="text-[11px] font-semibold text-[#123F32] uppercase tracking-wider block">
                      Execution Scope:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#586B62]">
                      {srv.scope.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#123F32]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onNavigate('contacts')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#123F32] hover:text-[#25664E] cursor-pointer"
                  >
                    <span>Request staffing & quotes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Capabilities Section */}
        <div className="bg-white rounded-2xl border border-[#D5DED6] p-8 sm:p-10 mb-12">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl font-bold text-[#193E33]">
              {t.additionalTitle}
            </h2>
            <p className="text-sm text-[#586B62] mt-1">
              Complementary technical focus areas deployed on specialized sites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalCapabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.id}
                  className="p-5 rounded-xl bg-[#F8F9F6] border border-[#D5DED6]"
                >
                  <Icon className="w-6 h-6 text-[#123F32] mb-3" />
                  <h3 className="text-base font-bold text-[#193E33] mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-[#586B62] leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Honest Commercial Notice (Section 3 Requirement) */}
        <div className="p-6 rounded-2xl bg-[#EAF0E9] border border-[#D5DED6] flex items-start gap-4 text-xs sm:text-sm text-[#193E33]">
          <ShieldAlert className="w-5 h-5 text-[#123F32] shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-1">Commercial Integrity Notice:</strong>
            <p className="text-[#586B62] leading-relaxed">
              {t.honestNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
