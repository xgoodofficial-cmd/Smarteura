import React, { useState } from 'react';
import { Tag, Eye, X, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, GalleryItem } from '../types';
import { translations } from '../data/translations';

interface GalleryPageProps {
  lang: Language;
  gallery: GalleryItem[];
  onNavigate: (page: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ lang, gallery, onNavigate }) => {
  const t = translations[lang].gallery;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: t.filterAll },
    { id: 'piping', label: t.filterPiping },
    { id: 'welding', label: t.filterWelding },
    { id: 'assembly', label: t.filterAssembly },
    { id: 'installation', label: t.filterInstallation },
    { id: 'shipyard', label: t.filterShipyard }
  ];

  const filteredItems = activeCategory === 'all'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  return (
    <div id="gallery-page-container" className="py-12 md:py-20 bg-[#F8F9F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0E9] border border-[#D5DED6] text-xs font-bold uppercase tracking-wider text-[#123F32] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#123F32]" />
            <span>Smarteura Worksites</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#193E33] mb-4">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-[#586B62] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[#D5DED6]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#586B62] mr-2">
            <Filter className="w-3.5 h-3.5 text-[#123F32]" />
            <span className="hidden sm:inline">Filter:</span>
          </div>
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? gallery.length
              : gallery.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-[#123F32] text-white shadow-xs'
                    : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-[#EAF0E9] text-[#123F32]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const title = item.title[lang] || item.title.en;
            const description = item.description[lang] || item.description.en;

            return (
              <div
                key={item.id}
                id={`gallery-card-${item.id}`}
                onClick={() => setSelectedItem(item)}
                className="group bg-white rounded-2xl border border-[#D5DED6] overflow-hidden shadow-xs hover:border-[#123F32] hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image Container with Zoom Badge */}
                <div className="relative aspect-16/10 bg-[#EAF0E9] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#123F32]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-white font-medium bg-[#123F32]/90 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.viewPhoto}</span>
                    </span>
                  </div>

                  {/* Category Pill on top-right */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-[#123F32] shadow-xs">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#193E33] leading-snug group-hover:text-[#123F32] transition-colors mb-2">
                      {title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#586B62] line-clamp-3 leading-relaxed mb-4">
                      {description}
                    </p>
                  </div>

                  {/* Tags footer */}
                  <div className="pt-3 border-t border-[#D5DED6] flex flex-wrap gap-1.5">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-[#F8F9F6] border border-[#D5DED6] text-[#586B62]"
                      >
                        <Tag className="w-2.5 h-2.5 text-[#123F32]" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Discuss Project */}
        <div className="mt-16 bg-white rounded-2xl border border-[#D5DED6] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#123F32] mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#123F32]" />
              <span>Certified Delivery</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#193E33]">
              Need verified teams for your industrial worksite?
            </h3>
            <p className="text-sm text-[#586B62] mt-1 max-w-xl">
              From high-purity orbital welding to heavy machinery mechanical installation, our certified European personnel are ready for mobilization.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contacts')}
            className="shrink-0 px-6 py-3 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
          >
            {translations[lang].nav.discussProject}
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          id="gallery-lightbox-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs transition-opacity"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#D5DED6]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
              aria-label={t.closeModal}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-16/10 bg-[#193E33] max-h-[60vh] overflow-hidden">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title[lang] || selectedItem.title.en}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/95 text-[#123F32] shadow-xs">
                  {selectedItem.category}
                </span>
              </div>
            </div>

            {/* Modal Details */}
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#193E33] mb-3">
                {selectedItem.title[lang] || selectedItem.title.en}
              </h2>

              <p className="text-sm sm:text-base text-[#586B62] leading-relaxed mb-6">
                {selectedItem.description[lang] || selectedItem.description.en}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D5DED6]">
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[#EAF0E9] text-[#123F32]"
                    >
                      <Tag className="w-3 h-3 text-[#123F32]" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedItem(null);
                    onNavigate('contacts');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {translations[lang].nav.discussProject}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
