/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, SiteSettings, Vacancy, CandidateApplication, ClientInquiry, ProjectItem, NewsArticle, GalleryItem } from './types';
import {
  getStoredSettings,
  getStoredVacancies,
  getStoredApplications,
  getStoredInquiries,
  getStoredProjects,
  getStoredNews,
  getStoredGallery
} from './data/initialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { GalleryPage } from './pages/GalleryPage';
import { CareerPage } from './pages/CareerPage';
import { AboutPage } from './pages/AboutPage';
import { NewsPage } from './pages/NewsPage';
import { ContactsPage } from './pages/ContactsPage';
import { AdminPage } from './pages/AdminPage';
import { CabinetPage } from './pages/CabinetPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { LoginModal } from './components/LoginModal';
import { Custom3DCursor } from './components/Custom3DCursor';
import { WorkspaceHub } from './components/WorkspaceHub';
import { onUserAuthStateChanged, logoutUser } from './lib/firebase';
import type { User } from 'firebase/auth';

export default function App() {
  // Primary language: EN by default (Section 5)
  const [currentLang, setCurrentLang] = useState<Language>('en');
  // Active navigation page
  const [activePage, setActivePage] = useState<string>('home');

  // Secret Admin Authentication & Modal State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('smarteura_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState<boolean>(false);

  // Authenticated User & Personal Cabinet state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onUserAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Application data states loaded from persistent storage
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings);
  const [vacancies, setVacancies] = useState<Vacancy[]>(getStoredVacancies);
  const [applications, setApplications] = useState<CandidateApplication[]>(getStoredApplications);
  const [inquiries, setInquiries] = useState<ClientInquiry[]>(getStoredInquiries);
  const [projects, setProjects] = useState<ProjectItem[]>(getStoredProjects);
  const [gallery, setGallery] = useState<GalleryItem[]>(getStoredGallery);
  const [news, setNews] = useState<NewsArticle[]>(getStoredNews);

  // Sync route on mount from hash if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['services', 'projects', 'gallery', 'career', 'about', 'news', 'contacts', 'cabinet'].includes(hash)) {
        if (hash === 'cabinet' && !currentUser) {
          setShowLoginModal(true);
        }
        setActivePage(hash);
      } else if (hash === 'workspace') {
        setShowWorkspaceModal(true);
      } else if (hash === 'admin') {
        const authed = sessionStorage.getItem('smarteura_admin_auth') === 'true';
        if (authed) {
          setActivePage('admin');
        } else {
          setActivePage('home');
          window.location.hash = '';
          setShowAdminLoginModal(true);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  // Update hash when page changes
  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    try {
      sessionStorage.setItem('smarteura_admin_auth', 'true');
    } catch {}
    setIsAdminAuthenticated(true);
    setShowAdminLoginModal(false);
    handleNavigate('admin');
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('smarteura_admin_auth');
    } catch {}
    setIsAdminAuthenticated(false);
    handleNavigate('home');
  };

  const handleRefreshData = () => {
    setSettings(getStoredSettings());
    setVacancies(getStoredVacancies());
    setApplications(getStoredApplications());
    setInquiries(getStoredInquiries());
    setProjects(getStoredProjects());
    setGallery(getStoredGallery());
    setNews(getStoredNews());
  };

  return (
    <div id="smarteura-root" className="min-h-screen flex flex-col bg-[#F8F9F6] text-[#193E33] antialiased selection:bg-[#123F32] selection:text-white relative">
      {/* Interactive 3D Cursor & Touch Ripple System in #123F32 */}
      <Custom3DCursor />

      {/* Global Header with active Google Login and User Cabinet */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        onOpenWorkspace={() => setShowWorkspaceModal(true)}
        user={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={async () => {
          await logoutUser();
          setCurrentUser(null);
          handleNavigate('home');
        }}
      />

      {/* Google Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        lang={currentLang}
        onSuccess={(user) => {
          setCurrentUser(user);
          handleNavigate('cabinet');
        }}
      />

      {/* Secret Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Google Workspace (Drive & Gmail) Modal */}
      {showWorkspaceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <WorkspaceHub onClose={() => setShowWorkspaceModal(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area with 3D Page Transition */}
      <main id="main-content" className="flex-1 perspective-container overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{
              opacity: 0,
              rotateX: 4,
              scale: 0.98,
              y: 20,
              filter: 'blur(3px)'
            }}
            animate={{
              opacity: 1,
              rotateX: 0,
              scale: 1,
              y: 0,
              filter: 'blur(0px)'
            }}
            exit={{
              opacity: 0,
              rotateX: -4,
              scale: 0.98,
              y: -18,
              filter: 'blur(3px)'
            }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: '50% 0%'
            }}
            className="w-full"
          >
            {activePage === 'home' && (
              <HomePage
                lang={currentLang}
                onNavigate={handleNavigate}
                onOpenCvModal={() => handleNavigate('career')}
              />
            )}

            {activePage === 'services' && (
              <ServicesPage
                lang={currentLang}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'projects' && (
              <ProjectsPage
                lang={currentLang}
                projects={projects}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'gallery' && (
              <GalleryPage
                lang={currentLang}
                gallery={gallery}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'career' && (
              <CareerPage
                lang={currentLang}
                vacancies={vacancies}
                onRefreshData={handleRefreshData}
              />
            )}

            {activePage === 'about' && (
              <AboutPage
                lang={currentLang}
                settings={settings}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'news' && (
              <NewsPage
                lang={currentLang}
                news={news}
              />
            )}

            {activePage === 'contacts' && (
              <ContactsPage
                lang={currentLang}
                settings={settings}
                onRefreshData={handleRefreshData}
              />
            )}

            {activePage === 'cabinet' && (
              currentUser ? (
                <CabinetPage
                  user={currentUser}
                  lang={currentLang}
                  inquiries={inquiries}
                  applications={applications}
                  onRefreshData={handleRefreshData}
                  onNavigate={handleNavigate}
                  onLogout={async () => {
                    await logoutUser();
                    setCurrentUser(null);
                    handleNavigate('home');
                  }}
                />
              ) : (
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                  <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#D5DED6] shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#123F32] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                      SE
                    </div>
                    <h2 className="text-xl font-bold text-[#193E33] mb-2">Şəxsi Kabinetə Giriş</h2>
                    <p className="text-xs text-[#586B62] mb-6 leading-relaxed">
                      Smarteura müştəri və tərəfdaş portalındakı müraciətlərinizi idarə etmək üçün Google hesabınız ilə daxil olun.
                    </p>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="w-full py-3 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                    >
                      Google ilə Daxil Ol
                    </button>
                  </div>
                </div>
              )
            )}

            {activePage === 'admin' && (
              <AdminPage
                settings={settings}
                vacancies={vacancies}
                applications={applications}
                inquiries={inquiries}
                projects={projects}
                news={news}
                onUpdateSettings={setSettings}
                onUpdateVacancies={setVacancies}
                onUpdateProjects={setProjects}
                onUpdateNews={setNews}
                onRefreshData={handleRefreshData}
                isAuthenticated={isAdminAuthenticated}
                onLoginSuccess={handleAdminLoginSuccess}
                onLogout={handleAdminLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
        settings={settings}
      />
    </div>
  );
}
