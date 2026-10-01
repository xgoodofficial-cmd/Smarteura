import React from 'react';
import { UserCheck, Building2, ArrowRight, FileText } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HomeWorkersClientsProps {
  lang: Language;
  onNavigate: (page: string) => void;
  onOpenCvModal?: () => void;
}

export const HomeWorkersClients: React.FC<HomeWorkersClientsProps> = ({
  lang,
  onNavigate,
  onOpenCvModal
}) => {
  const t = translations[lang].workersClients;

  return (
    <section id="workers-clients-section" className="py-16 md:py-24 bg-[#F8F9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Grid: Side-by-side on desktop (lg), stacked on mobile/tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Block 1: For Workers */}
          <div
            id="block-for-workers"
            className="flex flex-col justify-between bg-white rounded-2xl border border-[#D5DED6] p-8 sm:p-10 shadow-xs hover:border-[#96B5A1] transition-all"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF0E9] text-[#123F32] text-xs font-bold tracking-wide uppercase mb-6">
                <UserCheck className="w-4 h-4 text-[#123F32]" />
                <span>For Specialists & Tradesmen</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#193E33] mb-4">
                {t.workersTitle}
              </h3>

              <p className="text-sm sm:text-base text-[#586B62] leading-relaxed mb-8">
                {t.workersText}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-[#D5DED6]">
              <button
                id="btn-view-vacancies"
                onClick={() => {
                  onNavigate('career');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>{t.workersBtnVacancies}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-send-cv"
                onClick={() => {
                  if (onOpenCvModal) {
                    onOpenCvModal();
                  } else {
                    onNavigate('career');
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F8F9F6] hover:bg-[#EAF0E9] text-[#193E33] border border-[#D5DED6] text-sm font-semibold transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#123F32]" />
                <span>{t.workersBtnCv}</span>
              </button>
            </div>
          </div>

          {/* Block 2: For Clients */}
          <div
            id="block-for-clients"
            className="flex flex-col justify-between bg-white rounded-2xl border border-[#D5DED6] p-8 sm:p-10 shadow-xs hover:border-[#96B5A1] transition-all"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#123F32] text-white text-xs font-bold tracking-wide uppercase mb-6">
                <Building2 className="w-4 h-4 text-[#96B5A1]" />
                <span>For Industrial Clients</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#193E33] mb-4">
                {t.clientsTitle}
              </h3>

              <p className="text-sm sm:text-base text-[#586B62] leading-relaxed mb-8">
                {t.clientsText}
              </p>
            </div>

            <div className="pt-4 border-t border-[#D5DED6]">
              <button
                id="btn-discuss-project-card"
                onClick={() => {
                  onNavigate('contacts');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>{t.clientsBtnDiscuss}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
