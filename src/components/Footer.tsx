import React from 'react';
import { Mail, Phone, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import { SmarteuraLogo } from './SmarteuraLogo';

interface FooterProps {
  currentLang: Language;
  onNavigate: (page: string) => void;
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onNavigate, settings }) => {
  const t = translations[currentLang];

  return (
    <footer id="main-footer" className="bg-[#193E33] text-[#EAF0E9] border-t border-[#123F32] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#25664E]/40">
          {/* Brand Column */}
          <div className="space-y-4">
            <button
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 text-left focus:outline-hidden group"
              aria-label="SMARTEURA Home"
            >
              <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                <SmarteuraLogo variant="white" className="w-10 h-10" />
              </div>
              <div>
                <span className="font-sans text-2xl font-extrabold tracking-tight text-white block leading-tight">
                  SMARTEURA
                </span>
                <span className="text-xs uppercase tracking-wider text-[#96B5A1] font-semibold block">
                  {settings.brandSlogan}
                </span>
              </div>
            </button>

            <p className="text-xs text-[#D5DED6] leading-relaxed max-w-sm">
              Certified industrial piping, orbital welding, and mechanical installation teams serving European infrastructure and industrial sectors.
            </p>

            <div className="inline-block px-3 py-1.5 rounded-md bg-[#123F32] border border-[#25664E] text-[11px] font-semibold tracking-wide text-[#96B5A1]">
              {t.footer.established}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#96B5A1] font-bold">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-[#D5DED6]"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('projects');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-[#D5DED6]"
                >
                  {t.nav.projects}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('gallery');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-[#D5DED6]"
                >
                  {t.nav.gallery}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('career');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-[#D5DED6]"
                >
                  {t.nav.career}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-[#D5DED6]"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('news');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-[#D5DED6]"
                >
                  {t.nav.news}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('contacts');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-[#D5DED6]"
                >
                  {t.nav.contacts}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Emails & Conditional Phone */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#96B5A1] font-bold">
              {t.footer.contacts}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={`mailto:${settings.publicEmail}`}
                  className="flex items-center gap-2 text-[#D5DED6] hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#96B5A1] shrink-0" />
                  <span>{settings.publicEmail}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.officeEmail}`}
                  className="flex items-center gap-2 text-[#D5DED6] hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#96B5A1] shrink-0" />
                  <span>{settings.officeEmail}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.invoicesEmail}`}
                  className="flex items-center gap-2 text-[#D5DED6] hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#96B5A1] shrink-0" />
                  <span>{settings.invoicesEmail}</span>
                </a>
              </li>

              {/* Conditional Phone (Section 21) - Only visible if phone is not empty */}
              {settings.phone && settings.phone.trim().length > 0 && (
                <li id="footer-phone-container" className="pt-1">
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 text-white font-medium hover:text-[#96B5A1] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#96B5A1] shrink-0" />
                    <span>{settings.phone}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social Channels */}
          <div className="space-y-4">
            {/* Social channels (Section 22) - only rendered if link exists */}
            <div>
              <span className="block text-[11px] text-[#96B5A1] font-semibold uppercase tracking-wider mb-2">
                {t.footer.social}
              </span>
              <div className="flex items-center gap-2.5">
                {/* WhatsApp Icon */}
                <a
                  href="https://wa.me/37066257387"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp +37066257387"
                  title="WhatsApp: +37066257387"
                  className="p-2 rounded-md bg-[#123F32] hover:bg-[#25664E] text-[#D5DED6] hover:text-[#25D366] transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>

                {settings.socialLinks.linkedin && (
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Smarteura on LinkedIn"
                    className="p-2 rounded-md bg-[#123F32] hover:bg-[#25664E] text-[#D5DED6] hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {(settings.socialLinks.facebook || 'https://www.facebook.com/smarteura') && (
                  <a
                    href={settings.socialLinks.facebook || 'https://www.facebook.com/smarteura'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Smarteura on Facebook"
                    className="p-2 rounded-md bg-[#123F32] hover:bg-[#25664E] text-[#D5DED6] hover:text-white transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Smarteura on Instagram"
                    className="p-2 rounded-md bg-[#123F32] hover:bg-[#25664E] text-[#D5DED6] hover:text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks.youtube && (
                  <a
                    href={settings.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Smarteura on YouTube"
                    className="p-2 rounded-md bg-[#123F32] hover:bg-[#25664E] text-[#D5DED6] hover:text-white transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar strictly following Section 14: © UAB Smarteura (without 2026) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#96B5A1]">
          <p id="footer-copyright">
            {settings.brandName} · {translations[currentLang].hero.slogan} · {translations[currentLang].footer.rights}
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-[#D5DED6]/70">
              Lithuania · France · Netherlands · Germany
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
