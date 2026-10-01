import React, { useState } from 'react';
import { ShieldCheck, MapPin, Calendar, Layers, ArrowUpRight } from 'lucide-react';
import { Language, ProjectItem } from '../types';
import { translations } from '../data/translations';

interface ProjectsPageProps {
  lang: Language;
  projects: ProjectItem[];
  onNavigate: (page: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ lang, projects, onNavigate }) => {
  const t = translations[lang].projects;
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filter only published projects
  const publishedProjects = projects.filter((p) => p.status === 'published');

  const filteredProjects = activeFilter === 'all'
    ? publishedProjects
    : publishedProjects.filter((p) => p.serviceType.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <div id="projects-page-container" className="py-12 md:py-20 bg-[#F8F9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#123F32]">
            Industrial References
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#193E33] mt-2 mb-4">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-[#586B62] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Filter Badges */}
        {publishedProjects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#123F32] text-white'
                  : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setActiveFilter('piping')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === 'piping'
                  ? 'bg-[#123F32] text-white'
                  : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
              }`}
            >
              Piping & Welding
            </button>
            <button
              onClick={() => setActiveFilter('assembly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === 'assembly'
                  ? 'bg-[#123F32] text-white'
                  : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
              }`}
            >
              Mechanical Assembly
            </button>
          </div>
        )}

        {/* Project List or Strict Honest Note */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="bg-white rounded-2xl border border-[#D5DED6] p-8 shadow-xs hover:border-[#123F32] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D5DED6]">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#123F32]">
                      <Layers className="w-3.5 h-3.5 text-[#123F32]" />
                      <span>{project.serviceType}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#586B62] font-mono">
                      <Calendar className="w-3 h-3 text-[#96B5A1]" />
                      <span>{project.year}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#193E33] mb-3">
                    {project.title[lang] || project.title.en}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#586B62] mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#96B5A1]" />
                    <span>{project.city}, {project.country}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#586B62] leading-relaxed">
                    {project.description[lang] || project.description.en}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#D5DED6] flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#123F32] bg-[#EAF0E9] px-2.5 py-1 rounded-md">
                    Verified Execution
                  </span>
                  <button
                    onClick={() => onNavigate('contacts')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#123F32] hover:text-[#25664E] cursor-pointer"
                  >
                    <span>Inquire similar project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#D5DED6] p-10 text-center max-w-2xl mx-auto shadow-xs">
            <ShieldCheck className="w-10 h-10 text-[#123F32] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#193E33] mb-2">
              {t.statusInPrep}
            </h3>
            <p className="text-xs sm:text-sm text-[#586B62] leading-relaxed mb-6">
              {t.noProjectsNotice}
            </p>
            <button
              onClick={() => onNavigate('contacts')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E] transition-colors"
            >
              <span>Contact engineering team</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
