import React, { useState } from 'react';
import { Newspaper, Calendar, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, NewsArticle } from '../types';
import { translations } from '../data/translations';

interface NewsPageProps {
  lang: Language;
  news: NewsArticle[];
}

export const NewsPage: React.FC<NewsPageProps> = ({ lang, news }) => {
  const t = translations[lang].news;
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Filter published articles
  const publishedArticles = news.filter((n) => n.status === 'published');

  return (
    <div id="news-page-container" className="py-12 md:py-20 bg-[#F8F9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedArticle ? (
          /* Single Article View */
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#D5DED6] p-8 sm:p-12 shadow-xs">
            <button
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#123F32] hover:text-[#25664E] mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backToNews}</span>
            </button>

            <div className="flex items-center gap-4 text-xs text-[#586B62] mb-3 pb-3 border-b border-[#D5DED6]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#96B5A1]" />
                <span>{selectedArticle.publishedAt}</span>
              </span>
              <div className="flex items-center gap-2">
                {selectedArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF0E9] text-[#123F32] text-[10px] font-semibold"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#193E33] mb-6 leading-tight">
              {selectedArticle.title[lang] || selectedArticle.title.en}
            </h1>

            <div className="prose text-sm text-[#586B62] leading-relaxed space-y-4">
              <p className="font-medium text-[#193E33]">
                {selectedArticle.excerpt[lang] || selectedArticle.excerpt.en}
              </p>
              <p>
                {selectedArticle.content[lang] || selectedArticle.content.en}
              </p>
            </div>
          </div>
        ) : (
          /* News Catalog List */
          <div>
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#123F32]">
                Corporate Updates
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#193E33] mt-2 mb-4">
                {t.title}
              </h1>
              <p className="text-base sm:text-lg text-[#586B62] leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            {publishedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publishedArticles.map((item) => (
                  <article
                    key={item.id}
                    id={`news-card-${item.id}`}
                    className="bg-white rounded-2xl border border-[#D5DED6] p-6 shadow-xs hover:border-[#123F32] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#586B62] mb-3 pb-2 border-b border-[#D5DED6]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#96B5A1]" />
                          <span>{item.publishedAt}</span>
                        </span>
                        {item.tags.length > 0 && (
                          <span className="text-[10px] font-semibold text-[#123F32] bg-[#EAF0E9] px-2 py-0.5 rounded-sm">
                            {item.tags[0]}
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-bold text-[#193E33] mb-3 line-clamp-2">
                        {item.title[lang] || item.title.en}
                      </h2>

                      <p className="text-xs text-[#586B62] leading-relaxed line-clamp-3 mb-6">
                        {item.excerpt[lang] || item.excerpt.en}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedArticle(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#123F32] hover:text-[#25664E] pt-4 border-t border-[#D5DED6] cursor-pointer"
                    >
                      <span>{t.readMore}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D5DED6] p-10 text-center max-w-xl mx-auto shadow-xs">
                <Newspaper className="w-10 h-10 text-[#96B5A1] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#193E33] mb-2">
                  {t.noNews}
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
