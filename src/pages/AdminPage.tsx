import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Lock,
  UserCheck,
  Building2,
  Briefcase,
  FileText,
  Settings,
  Plus,
  Save,
  CheckCircle2,
  AlertTriangle,
  Download,
  Clock,
  LogOut,
  Layers,
  Phone,
  Mail,
  Share2,
  HardDrive,
  Database,
  RefreshCw,
  Trash2,
  Eye,
  Cloud,
  Image,
  Upload,
  ExternalLink,
  Sparkles,
  Send
} from 'lucide-react';
import { WorkspaceHub } from '../components/WorkspaceHub';
import { CloudDbHub } from '../components/CloudDbHub';
import {
  Language,
  SiteSettings,
  Vacancy,
  CandidateApplication,
  ClientInquiry,
  ProjectItem,
  NewsArticle,
  GalleryItem
} from '../types';
import {
  saveStoredSettings,
  saveStoredVacancies,
  updateApplication,
  updateInquiry,
  saveStoredProjects,
  saveStoredNews,
  saveStoredGallery,
  getStoredGallery
} from '../data/initialData';
import {
  verifyAdminCredentials,
  createAdminSession,
  clearAdminSession,
  isAuthorizedAdminEmail,
  sanitizeSingleLine,
  sanitizeUrl
} from '../lib/security';
import {
  auth,
  fetchCloudCandidateApplications,
  fetchCloudClientInquiries,
  updateCloudCandidateApplication,
  updateCloudClientInquiry,
  deleteCloudCandidateApplication,
  deleteCloudClientInquiry,
  signInWithGoogle,
  fetchCloudGallery,
  saveCloudGalleryItem,
  deleteCloudGalleryItem
} from '../lib/firebase';
import {
  notifyOfficeNewCandidateApplication,
  notifyOfficeNewClientInquiry,
  TARGET_OFFICE_EMAIL
} from '../lib/emailNotification';

interface AdminPageProps {
  settings: SiteSettings;
  vacancies: Vacancy[];
  applications: CandidateApplication[];
  inquiries: ClientInquiry[];
  projects: ProjectItem[];
  news: NewsArticle[];
  gallery?: GalleryItem[];
  onUpdateSettings: (settings: SiteSettings) => void;
  onUpdateVacancies: (vacancies: Vacancy[]) => void;
  onUpdateProjects: (projects: ProjectItem[]) => void;
  onUpdateNews: (news: NewsArticle[]) => void;
  onUpdateGallery?: (gallery: GalleryItem[]) => void;
  onRefreshData: () => void;
  onSyncCloudApplications?: (apps: CandidateApplication[]) => void;
  onSyncCloudInquiries?: (inqs: ClientInquiry[]) => void;
  isAuthenticated?: boolean;
  onLoginSuccess?: () => void;
  onLogout?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  settings,
  vacancies,
  applications,
  inquiries,
  projects,
  news,
  gallery: propGallery,
  onUpdateSettings,
  onUpdateVacancies,
  onUpdateProjects,
  onUpdateNews,
  onUpdateGallery,
  onRefreshData,
  onSyncCloudApplications,
  onSyncCloudInquiries,
  isAuthenticated: propIsAuthenticated,
  onLoginSuccess,
  onLogout
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(propIsAuthenticated ?? false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (propIsAuthenticated !== undefined) {
      setIsAuthenticated(propIsAuthenticated);
    }
  }, [propIsAuthenticated]);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'applications' | 'inquiries' | 'vacancies' | 'gallery' | 'projects' | 'settings' | 'workspace' | 'cloudsql'>('applications');

  // Gallery Management State
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(propGallery || getStoredGallery);
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState<'piping' | 'welding' | 'assembly' | 'installation' | 'shipyard'>('piping');
  const [newGalLocation, setNewGalLocation] = useState('Rotterdam, Netherlands');
  const [newGalYear, setNewGalYear] = useState('2026');
  const [newGalDesc, setNewGalDesc] = useState('');
  const [newGalImageUrl, setNewGalImageUrl] = useState('');
  const [newGalTags, setNewGalTags] = useState('TIG, Spool, ISO');
  const [galleryFilter, setGalleryFilter] = useState<string>('all');
  const [galleryToast, setGalleryToast] = useState<string | null>(null);

  // Email Forwarding Notice
  const [forwardNotice, setForwardNotice] = useState<string | null>(null);
  const [isForwardingEmail, setIsForwardingEmail] = useState(false);

  useEffect(() => {
    if (propGallery) {
      setGalleryList(propGallery);
    }
  }, [propGallery]);

  // Cloud Firestore Sync State
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [cloudSyncMessage, setCloudSyncMessage] = useState<string | null>(null);
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  const currentUser = auth.currentUser;
  const isGoogleAdmin = isAuthorizedAdminEmail(currentUser?.email);

  // Sub-detail states
  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ClientInquiry | null>(null);
  const [cvDownloadToast, setCvDownloadToast] = useState<string | null>(null);

  // Candidate status updates in modal/form
  const [appStatus, setAppStatus] = useState<CandidateApplication['status']>('new');
  const [appAssigned, setAppAssigned] = useState('');
  const [appNotes, setAppNotes] = useState('');
  const [appNextStep, setAppNextStep] = useState('');
  const [appNextStepDate, setAppNextStepDate] = useState('');

  // Client inquiry status updates in modal/form
  const [inquiryStatus, setInquiryStatus] = useState<ClientInquiry['status']>('new');
  const [inquiryAssigned, setInquiryAssigned] = useState('');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [inquiryNextStep, setInquiryNextStep] = useState('');
  const [inquiryNextStepDate, setInquiryNextStepDate] = useState('');

  // Settings edit form
  const [editPhone, setEditPhone] = useState(settings.phone || '');
  const [editPublicEmail, setEditPublicEmail] = useState(settings.publicEmail);
  const [editOfficeEmail, setEditOfficeEmail] = useState(settings.officeEmail);
  const [editInvoicesEmail, setEditInvoicesEmail] = useState(settings.invoicesEmail);
  const [editLinkedin, setEditLinkedin] = useState(settings.socialLinks.linkedin || '');
  const [editFacebook, setEditFacebook] = useState(settings.socialLinks.facebook || '');
  const [editInstagram, setEditInstagram] = useState(settings.socialLinks.instagram || '');
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  // New Vacancy Form Modal
  const [showAddVacancy, setShowAddVacancy] = useState(false);
  const [newVacTitle, setNewVacTitle] = useState('');
  const [newVacCategory, setNewVacCategory] = useState<'welding' | 'piping' | 'pipefitter' | 'assembly' | 'installation'>('welding');
  const [newVacCountry, setNewVacCountry] = useState('Netherlands');
  const [newVacCity, setNewVacCity] = useState('');
  const [newVacDesc, setNewVacDesc] = useState('');

  // Handle Syncing directly from Google Cloud Firestore
  const handleSyncCloud = async () => {
    setIsSyncingCloud(true);
    setCloudSyncError(null);
    setCloudSyncMessage(null);
    try {
      const [cloudApps, cloudInqs, cloudGals] = await Promise.all([
        fetchCloudCandidateApplications(),
        fetchCloudClientInquiries(),
        fetchCloudGallery()
      ]);
      if (onSyncCloudApplications) onSyncCloudApplications(cloudApps);
      if (onSyncCloudInquiries) onSyncCloudInquiries(cloudInqs);
      if (cloudGals && cloudGals.length > 0) {
        setGalleryList(cloudGals);
        if (onUpdateGallery) onUpdateGallery(cloudGals);
        saveStoredGallery(cloudGals);
      }
      setCloudSyncMessage(`Google Cloud Firestore ilə canlı əlaqə quruldu: ${cloudApps.length} namizəd CV-si, ${cloudInqs.length} müştəri sorğusu və ${cloudGals?.length || 0} qalereya şəkli yeniləndi.`);
      setTimeout(() => setCloudSyncMessage(null), 5000);
    } catch (err: any) {
      if (err?.code === 'permission-denied' || String(err).includes('permission') || String(err).includes('insufficient')) {
        setCloudSyncError('Google Cloud İcazəsi Lazımdır: Namizədlərin və müştərilərin məlumatları Firestore buludunda gizli saxlanılır. Canlı bazanı oxumaq üçün xgoodofficial@gmail.com hesabı ilə daxil olun.');
      } else {
        setCloudSyncError(`Sinxronizasiya xətası: ${err?.message || 'Baza ilə əlaqə qurula bilmədi'}`);
      }
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleGoogleAdminAuth = async () => {
    try {
      setIsSyncingCloud(true);
      setCloudSyncError(null);
      await signInWithGoogle();
      await handleSyncCloud();
    } catch (e: any) {
      setCloudSyncError('Google ilə daxil olarkən xəta baş verdi: ' + (e?.message || ''));
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Auto-sync if google admin is present
  useEffect(() => {
    if (isAuthenticated && isGoogleAdmin) {
      handleSyncCloud();
    }
  }, [isAuthenticated, isGoogleAdmin]);

  // Secure Login Handler using cryptographic hash verification
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const result = await verifyAdminCredentials(adminUser, adminPassword);
      if (result.success) {
        setIsAuthenticated(true);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setAuthError(result.error || 'İstifadəçi adı və ya şifrə yanlışdır. (Invalid credentials)');
      }
    } catch {
      setAuthError('Təhlükəsizlik xətası baş verdi. Yenidən cəhd edin.');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    setAdminUser('');
    setAdminPassword('');
    if (onLogout) {
      onLogout();
    }
  };

  // Open candidate details
  const handleSelectApp = (app: CandidateApplication) => {
    setSelectedApp(app);
    setAppStatus(app.status);
    setAppAssigned(app.assignedTo || '');
    setAppNotes(app.internalNotes || '');
    setAppNextStep(app.nextStep || '');
    setAppNextStepDate(app.nextStepDate || '');
  };

  const handleSaveAppDetails = async () => {
    if (!selectedApp) return;

    const updates = {
      status: appStatus,
      assignedTo: appAssigned.trim() || undefined,
      internalNotes: appNotes.trim() || undefined,
      nextStep: appNextStep.trim() || undefined,
      nextStepDate: appNextStepDate.trim() || undefined
    };

    updateApplication(selectedApp.id, updates);

    try {
      await updateCloudCandidateApplication(selectedApp.id, updates);
    } catch (err) {
      console.warn('Firestore application update note:', err);
    }

    onRefreshData();
    setSelectedApp(null);
  };

  const handleDeleteApp = async (id: string) => {
    if (!window.confirm('Bu namizəd müraciətini bazadan tamamilə silmək istəyirsiniz?')) return;
    try {
      await deleteCloudCandidateApplication(id);
    } catch (err) {
      console.warn('Firestore candidate delete note:', err);
    }
    const updated = applications.filter((a) => a.id !== id);
    if (onSyncCloudApplications) onSyncCloudApplications(updated);
    setSelectedApp(null);
  };

  // Open inquiry details
  const handleSelectInquiry = (inq: ClientInquiry) => {
    setSelectedInquiry(inq);
    setInquiryStatus(inq.status);
    setInquiryAssigned(inq.assignedTo || '');
    setInquiryNotes(inq.internalNotes || '');
    setInquiryNextStep(inq.nextStep || '');
    setInquiryNextStepDate(inq.nextStepDate || '');
  };

  const handleSaveInquiryDetails = async () => {
    if (!selectedInquiry) return;

    const updates = {
      status: inquiryStatus,
      assignedTo: inquiryAssigned.trim() || undefined,
      internalNotes: inquiryNotes.trim() || undefined,
      nextStep: inquiryNextStep.trim() || undefined,
      nextStepDate: inquiryNextStepDate.trim() || undefined
    };

    updateInquiry(selectedInquiry.id, updates);

    try {
      await updateCloudClientInquiry(selectedInquiry.id, updates);
    } catch (err) {
      console.warn('Firestore inquiry update note:', err);
    }

    onRefreshData();
    setSelectedInquiry(null);
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Bu müştəri sorğusunu bazadan tamamilə silmək istəyirsiniz?')) return;
    try {
      await deleteCloudClientInquiry(id);
    } catch (err) {
      console.warn('Firestore inquiry delete note:', err);
    }
    const updated = inquiries.filter((i) => i.id !== id);
    if (onSyncCloudInquiries) onSyncCloudInquiries(updated);
    setSelectedInquiry(null);
  };

  // Settings Save Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPhone = editPhone.trim() ? sanitizeSingleLine(editPhone, 40) : undefined;
    const cleanPublicEmail = sanitizeSingleLine(editPublicEmail, 100);
    const cleanOfficeEmail = sanitizeSingleLine(editOfficeEmail, 100);
    const cleanInvoicesEmail = sanitizeSingleLine(editInvoicesEmail, 100);

    const cleanLinkedin = editLinkedin.trim() && /^https?:\/\//i.test(editLinkedin.trim())
      ? sanitizeUrl(editLinkedin.trim())
      : undefined;
    const cleanFacebook = editFacebook.trim() && /^https?:\/\//i.test(editFacebook.trim())
      ? sanitizeUrl(editFacebook.trim())
      : undefined;
    const cleanInstagram = editInstagram.trim() && /^https?:\/\//i.test(editInstagram.trim())
      ? sanitizeUrl(editInstagram.trim())
      : undefined;

    const updated: SiteSettings = {
      ...settings,
      phone: cleanPhone,
      publicEmail: cleanPublicEmail,
      officeEmail: cleanOfficeEmail,
      invoicesEmail: cleanInvoicesEmail,
      socialLinks: {
        ...settings.socialLinks,
        linkedin: cleanLinkedin,
        facebook: cleanFacebook,
        instagram: cleanInstagram
      }
    };

    saveStoredSettings(updated);
    onUpdateSettings(updated);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  // Add Vacancy Handler
  const handleCreateVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVacTitle.trim() || !newVacCity.trim()) return;

    const newVac: Vacancy = {
      id: `vac-${Date.now()}`,
      title: {
        en: newVacTitle,
        lt: newVacTitle,
        fr: newVacTitle,
        nl: newVacTitle,
        tr: newVacTitle
      },
      category: newVacCategory,
      country: newVacCountry,
      city: newVacCity,
      type: 'Full-time / Project',
      description: {
        en: newVacDesc || 'Mobilization for ongoing European industrial project.',
        lt: newVacDesc || 'Mobilizacija vykdomam Europos pramoniniam projektui.',
        fr: newVacDesc || 'Mobilisation pour projet industriel européen.',
        nl: newVacDesc || 'Inzet op Europees industrieel project.',
        tr: newVacDesc || 'Avrupa endüstriyel projesi için resmi istihdam ve mobilizasyon.'
      },
      requirements: {
        en: ['Relevant industrial certification', 'Minimum 2 years experience'],
        lt: ['Atitinkamas pramoninis sertifikatas', 'Ne mažiau 2 m. patirties'],
        fr: ['Certifications industrielles requises', '2 ans d’expérience'],
        nl: ['Geldige certificering', 'Minimaal 2 jaar ervaring'],
        tr: ['İlgili mesleki sertifika ve yeterlilik belgesi', 'En az 2 yıl saha deneyimi']
      },
      benefits: {
        en: ['Competitive European contract', 'Covered travel and accommodation'],
        lt: ['Europinis kontraktas', 'Apmokėtos kelionės ir gyvenamoji vieta'],
        fr: ['Contrat européen direct', 'Déplacement et hébergement pris en charge'],
        nl: ['Direct contract', 'Reis en verblijf verzorgd'],
        tr: ['Resmi Avrupa iş sözleşmesi', 'Konaklama ve yol harcırahı desteği']
      },
      startDate: 'Immediate',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const updatedList = [newVac, ...vacancies];
    saveStoredVacancies(updatedList);
    onUpdateVacancies(updatedList);
    setShowAddVacancy(false);
    setNewVacTitle('');
    setNewVacCity('');
    setNewVacDesc('');
  };

  const handleToggleVacancyStatus = (id: string, currentStatus: 'active' | 'draft' | 'closed') => {
    const nextStatus = currentStatus === 'active' ? 'closed' : 'active';
    const updated = vacancies.map((v) => (v.id === id ? { ...v, status: nextStatus as 'active' | 'closed' } : v));
    saveStoredVacancies(updated);
    onUpdateVacancies(updated);
  };

  // Gallery Item Handlers
  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitle.trim() || !newGalImageUrl.trim()) {
      alert('Zəhmət olmasa şəkil üçün başlıq və şəkil URL-i daxil edin.');
      return;
    }

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: {
        en: newGalTitle.trim(),
        lt: newGalTitle.trim(),
        fr: newGalTitle.trim(),
        nl: newGalTitle.trim(),
        tr: newGalTitle.trim()
      },
      category: newGalCategory,
      location: newGalLocation.trim() || 'Rotterdam, Netherlands',
      year: newGalYear.trim() || new Date().getFullYear().toString(),
      description: {
        en: newGalDesc.trim() || newGalTitle.trim(),
        lt: newGalDesc.trim() || newGalTitle.trim(),
        fr: newGalDesc.trim() || newGalTitle.trim(),
        nl: newGalDesc.trim() || newGalTitle.trim(),
        tr: newGalDesc.trim() || newGalTitle.trim()
      },
      imageUrl: newGalImageUrl.trim(),
      tags: newGalTags.split(',').map((s) => s.trim()).filter(Boolean)
    };

    const updated = [newItem, ...galleryList];
    setGalleryList(updated);
    saveStoredGallery(updated);
    if (onUpdateGallery) onUpdateGallery(updated);

    try {
      await saveCloudGalleryItem(newItem);
    } catch (err) {
      console.warn('Firestore gallery save note:', err);
    }

    setShowAddGallery(false);
    setNewGalTitle('');
    setNewGalDesc('');
    setNewGalImageUrl('');
    setGalleryToast('Şəkil qalereyaya uğurla əlavə edildi!');
    setTimeout(() => setGalleryToast(null), 4000);
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!window.confirm('Bu şəkli qalereyadan silmək istədiyinizə əminsiniz?')) return;
    const updated = galleryList.filter((item) => item.id !== id);
    setGalleryList(updated);
    saveStoredGallery(updated);
    if (onUpdateGallery) onUpdateGallery(updated);

    try {
      await deleteCloudGalleryItem(id);
    } catch (err) {
      console.warn('Firestore gallery delete note:', err);
    }

    setGalleryToast('Şəkil qalereyadan silindi.');
    setTimeout(() => setGalleryToast(null), 3000);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Şəkil həcmi maksimum 5MB ola bilər.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setNewGalImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleForwardCandidateToOffice = async (app: CandidateApplication) => {
    setIsForwardingEmail(true);
    setForwardNotice(null);
    try {
      const res = await notifyOfficeNewCandidateApplication(app);
      setForwardNotice(`✓ ${app.fullName} CV müraciəti ${TARGET_OFFICE_EMAIL} ünvanına göndərildi (${res.channel}).`);
    } catch (err: any) {
      setForwardNotice(`Xəta: ${err?.message || 'Email göndərilə bilmədi'}`);
    } finally {
      setIsForwardingEmail(false);
      setTimeout(() => setForwardNotice(null), 5000);
    }
  };

  const handleForwardInquiryToOffice = async (inq: ClientInquiry) => {
    setIsForwardingEmail(true);
    setForwardNotice(null);
    try {
      const res = await notifyOfficeNewClientInquiry(inq);
      setForwardNotice(`✓ ${inq.companyName} sorğusu ${TARGET_OFFICE_EMAIL} ünvanına göndərildi (${res.channel}).`);
    } catch (err: any) {
      setForwardNotice(`Xəta: ${err?.message || 'Email göndərilə bilmədi'}`);
    } finally {
      setIsForwardingEmail(false);
      setTimeout(() => setForwardNotice(null), 5000);
    }
  };

  // If NOT authenticated, show 2FA Login Screen (Section 24)
  if (!isAuthenticated) {
    return (
      <div id="admin-login-screen" className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F8F9F6]">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#D5DED6] p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#EAF0E9] text-[#123F32] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#193E33]">
              SMARTEURA Management Portal
            </h1>
            <p className="text-xs text-[#586B62] mt-1">
              Protected corporate access with mandatory two-factor authentication (2FA).
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#193E33] mb-1">
                İstifadəçi adı (Username)
              </label>
              <input
                type="text"
                required
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder=""
                className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs font-mono text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#193E33] mb-1">
                Şifrə (Password)
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder=""
                className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs font-mono text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Daxil ol / Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-container" className="py-8 md:py-12 bg-[#F8F9F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D5DED6]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-xl text-[#123F32]">SMARTEURA</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EAF0E9] text-[#123F32] font-semibold">
                Control Panel
              </span>
            </div>
            <p className="text-xs text-[#586B62] mt-0.5">
              Secure management of incoming applications, client inquiries, vacancies, and portal configurations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshData}
              className="px-3 py-1.5 rounded-lg border border-[#D5DED6] bg-white text-xs font-semibold text-[#193E33] hover:bg-[#EAF0E9]"
            >
              Sync Storage
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#D5DED6] pb-3">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-[#123F32] text-white'
                : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Candidate CVs ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#123F32] text-white'
                : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Client Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vacancies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'vacancies'
                ? 'bg-[#123F32] text-white'
                : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Vacancies ({vacancies.length})</span>
          </button>

          <button
            id="admin-tab-gallery"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#123F32] text-white'
                : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
            }`}
          >
            <Image className="w-4 h-4 text-emerald-500" />
            <span>Qalereya / Gallery ({galleryList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#123F32] text-white'
                : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site Settings & Phone</span>
          </button>

          <button
            id="admin-tab-workspace"
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'workspace'
                ? 'bg-[#123F32] text-white'
                : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
            }`}
          >
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>Google Drive & Gmail</span>
          </button>

          <button
            id="admin-tab-cloudsql"
            onClick={() => setActiveTab('cloudsql')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'cloudsql'
                ? 'bg-[#123F32] text-white'
                : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
            }`}
          >
            <Database className="w-4 h-4 text-amber-600" />
            <span>Firebase & Cloud SQL</span>
          </button>
        </div>

        {/* TAB 1: Candidate Applications / CV Management (Section 12 & 17) */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#193E33]">
                  Candidate Applications & Stored CVs ({applications.length})
                </h2>
                <p className="text-xs text-[#586B62]">
                  Məlumatlar yalnız Firestore bulud bazasında qorunur. GitHub açıq reposunda sıfır sızma təmin olunub.
                </p>
              </div>
            </div>

            {/* Google Cloud Firestore Live Sync & Data Isolation Bar */}
            <div className={`p-4 rounded-2xl border ${
              isGoogleAdmin
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-amber-50/80 border-amber-200'
            } flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs`}>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isGoogleAdmin ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold font-mono tracking-tight text-[#193E33]">
                      GOOGLE CLOUD FIRESTORE BAZASI (EUROPE-WEST2)
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isGoogleAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {isGoogleAdmin ? 'Canlı Sinxronizasiya Aktivdir' : 'Qorunan Giriş Tələb Olunur'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#586B62] mt-0.5">
                    {isGoogleAdmin
                      ? 'Saytın bütün namizəd müraciətləri və CV faylları təhlükəsiz şəkildə Firestore-da saxlanılır. GitHub public kodunda heç bir şəxsi məlumat yoxdur.'
                      : 'Bütün müraciətlər yalnız Firestore-da saxlanılır. Digər cihazlardan daxil olan müraciətləri canlı oxumaq üçün xgoodofficial@gmail.com hesabı ilə Google daxil olun.'}
                  </p>
                  {cloudSyncMessage && (
                    <div className="mt-2 text-[11px] font-medium text-emerald-700 bg-white/80 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                      {cloudSyncMessage}
                    </div>
                  )}
                  {cloudSyncError && (
                    <div className="mt-2 text-[11px] font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 inline-block">
                      {cloudSyncError}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                {isGoogleAdmin ? (
                  <button
                    type="button"
                    onClick={handleSyncCloud}
                    disabled={isSyncingCloud}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                    <span>{isSyncingCloud ? 'Sinxron edilir...' : 'Bulud Bazasını Yenilə'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleAdminAuth}
                    disabled={isSyncingCloud}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{isSyncingCloud ? 'Giriş edilir...' : 'Google İlə Sinxron Et'}</span>
                  </button>
                )}
              </div>
            </div>

            {applications.length > 0 ? (
              <div className="bg-white rounded-2xl border border-[#D5DED6] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F9F6] border-b border-[#D5DED6] text-[#586B62] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Ref ID</th>
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Trade / Position</th>
                        <th className="py-3 px-4">CV File</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D5DED6]">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-[#F8F9F6] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#123F32]">
                            {app.referenceId}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-[#193E33] block">{app.fullName}</span>
                            <span className="text-[11px] text-[#586B62]">{app.email} • {app.phone}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-[#193E33] block">{app.trade}</span>
                            <span className="text-[11px] text-[#586B62]">{app.targetPosition}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            {app.cvFileName ? (
                              <span className="inline-flex items-center gap-1 text-[#123F32] font-semibold bg-[#EAF0E9] px-2 py-0.5 rounded-sm">
                                <FileText className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[120px]">{app.cvFileName}</span>
                              </span>
                            ) : (
                              <span className="text-[#586B62] italic">Form only</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              app.status === 'new'
                                ? 'bg-amber-100 text-amber-800'
                                : app.status === 'reviewed'
                                ? 'bg-blue-100 text-blue-800'
                                : app.status === 'contacted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#586B62]">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleSelectApp(app)}
                              className="px-3 py-1 rounded-md bg-[#123F32] text-white hover:bg-[#25664E] font-medium"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D5DED6] p-12 text-center text-xs text-[#586B62]">
                <UserCheck className="w-8 h-8 text-[#96B5A1] mx-auto mb-2" />
                <span>No candidate applications recorded yet.</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Client Inquiries Management (Section 11 & 17) */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#193E33]">
                  Client Project Inquiries & Attached Drawings ({inquiries.length})
                </h2>
                <p className="text-xs text-[#586B62]">
                  Müştəri sorğuları və texniki çertyojlar Firestore bulud bazasında qorunur.
                </p>
              </div>
            </div>

            {/* Google Cloud Firestore Live Sync & Data Isolation Bar */}
            <div className={`p-4 rounded-2xl border ${
              isGoogleAdmin
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-amber-50/80 border-amber-200'
            } flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs`}>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isGoogleAdmin ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold font-mono tracking-tight text-[#193E33]">
                      GOOGLE CLOUD FIRESTORE BAZASI (EUROPE-WEST2)
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isGoogleAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {isGoogleAdmin ? 'Canlı Sinxronizasiya Aktivdir' : 'Qorunan Giriş Tələb Olunur'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#586B62] mt-0.5">
                    {isGoogleAdmin
                      ? 'Bütün müştəri sorğuları yalnız Google Cloud-da saxlanılır. GitHub public repoda heç bir müştəri məlumatı yoxdur.'
                      : 'Məlumatlar yalnız Firestore-da saxlanılır. Bütün cihazlardan daxil olan müraciətləri oxumaq üçün xgoodofficial@gmail.com hesabı ilə Google daxil olun.'}
                  </p>
                  {cloudSyncMessage && (
                    <div className="mt-2 text-[11px] font-medium text-emerald-700 bg-white/80 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                      {cloudSyncMessage}
                    </div>
                  )}
                  {cloudSyncError && (
                    <div className="mt-2 text-[11px] font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 inline-block">
                      {cloudSyncError}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                {isGoogleAdmin ? (
                  <button
                    type="button"
                    onClick={handleSyncCloud}
                    disabled={isSyncingCloud}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                    <span>{isSyncingCloud ? 'Sinxron edilir...' : 'Bulud Bazasını Yenilə'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleAdminAuth}
                    disabled={isSyncingCloud}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{isSyncingCloud ? 'Giriş edilir...' : 'Google İlə Sinxron Et'}</span>
                  </button>
                )}
              </div>
            </div>

            {inquiries.length > 0 ? (
              <div className="bg-white rounded-2xl border border-[#D5DED6] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F9F6] border-b border-[#D5DED6] text-[#586B62] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Ref ID</th>
                        <th className="py-3 px-4">Company</th>
                        <th className="py-3 px-4">Contact Person</th>
                        <th className="py-3 px-4">Country / Scope</th>
                        <th className="py-3 px-4">Drawings</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D5DED6]">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-[#F8F9F6] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#123F32]">
                            {inq.referenceId}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#193E33]">
                            {inq.companyName}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="block text-[#193E33]">{inq.contactPerson}</span>
                            <span className="text-[11px] text-[#586B62]">{inq.email}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-[#193E33] block">{inq.projectCountry}</span>
                            <span className="text-[11px] text-[#586B62] truncate max-w-xs block">
                              {inq.requiredSpecialists.join(', ') || inq.message}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {inq.files.length > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[#123F32] font-semibold bg-[#EAF0E9] px-2 py-0.5 rounded-sm">
                                <FileText className="w-3.5 h-3.5" />
                                <span>{inq.files.length} file(s)</span>
                              </span>
                            ) : (
                              <span className="text-[#586B62]">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              inq.status === 'new'
                                ? 'bg-amber-100 text-amber-800'
                                : inq.status === 'analyzing'
                                ? 'bg-blue-100 text-blue-800'
                                : inq.status === 'in_contact'
                                ? 'bg-purple-100 text-purple-800'
                                : inq.status === 'proposal_sent'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {inq.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#586B62]">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleSelectInquiry(inq)}
                              className="px-3 py-1 rounded-md bg-[#123F32] text-white hover:bg-[#25664E] font-medium cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D5DED6] p-12 text-center text-xs text-[#586B62]">
                <Building2 className="w-8 h-8 text-[#96B5A1] mx-auto mb-2" />
                <span>No client inquiries recorded yet.</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Vacancies Management (Section 13) */}
        {activeTab === 'vacancies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#193E33]">
                  Vacancies Catalog ({vacancies.length})
                </h2>
                <p className="text-xs text-[#586B62]">
                  Add, draft, publish, or close vacancies on the live portal.
                </p>
              </div>

              <button
                onClick={() => setShowAddVacancy(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Vacancy</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vacancies.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-[#D5DED6] p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D5DED6]">
                      <span className="text-[10px] uppercase font-bold text-[#123F32] bg-[#EAF0E9] px-2 py-0.5 rounded-sm">
                        {v.category}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        v.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#193E33] text-base mb-1">
                      {v.title.en}
                    </h3>
                    <span className="text-xs text-[#586B62] block mb-3">
                      {v.city}, {v.country}
                    </span>

                    <p className="text-xs text-[#586B62] line-clamp-3">
                      {v.description.en}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#D5DED6] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#586B62]">
                      Mobilization: {v.startDate}
                    </span>
                    <button
                      onClick={() => handleToggleVacancyStatus(v.id, v.status)}
                      className="text-xs font-semibold text-[#123F32] hover:underline cursor-pointer"
                    >
                      {v.status === 'active' ? 'Close Position' : 'Reactivate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Gallery Management (Qalereya İdarəetməsi) */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#193E33] flex items-center gap-2">
                  <Image className="w-5 h-5 text-[#123F32]" />
                  <span>Qalereya Şəkilləri ({galleryList.length})</span>
                </h2>
                <p className="text-xs text-[#586B62]">
                  Saytın Qalereya bölməsindəki iş və layihə şəkillərini buradan əlavə edə və ya silə bilərsiniz.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGallery(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Şəkil Əlavə Et</span>
                </button>
              </div>
            </div>

            {galleryToast && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{galleryToast}</span>
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs font-medium text-[#586B62] mr-1">Filter:</span>
              {['all', 'piping', 'welding', 'assembly', 'installation', 'shipyard'].map((cat) => {
                const count = cat === 'all'
                  ? galleryList.length
                  : galleryList.filter((item) => item.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGalleryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      galleryFilter === cat
                        ? 'bg-[#123F32] text-white shadow-2xs'
                        : 'bg-white text-[#193E33] border border-[#D5DED6] hover:bg-[#EAF0E9]'
                    }`}
                  >
                    <span className="capitalize">{cat === 'all' ? 'Hamısı' : cat}</span>
                    <span className="ml-1.5 opacity-70 text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Gallery Grid */}
            {galleryList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryList
                  .filter((item) => galleryFilter === 'all' || item.category === galleryFilter)
                  .map((item) => {
                    const titleStr = typeof item.title === 'string' ? item.title : (item.title?.en || (item.title as any)?.az || 'Worksite Photo');
                    const descStr = typeof item.description === 'string' ? item.description : (item.description?.en || '');

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-[#D5DED6] overflow-hidden shadow-xs hover:border-[#123F32] transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Image Thumbnail */}
                          <div className="relative aspect-16/10 bg-[#EAF0E9] overflow-hidden group">
                            <img
                              src={item.imageUrl}
                              alt={titleStr}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <div className="absolute top-2.5 left-2.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                                {item.category}
                              </span>
                            </div>
                            <div className="absolute top-2.5 right-2.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/90 text-[#123F32] shadow-xs">
                                {item.year || '2026'}
                              </span>
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="p-4">
                            <h3 className="font-bold text-[#193E33] text-sm mb-1 line-clamp-1">
                              {titleStr}
                            </h3>
                            <div className="text-[11px] text-[#586B62] mb-2 flex items-center gap-1.5">
                              <span>📍 {item.location}</span>
                            </div>
                            {descStr && (
                              <p className="text-xs text-[#586B62] line-clamp-2 mb-2 leading-relaxed">
                                {descStr}
                              </p>
                            )}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map((tag, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#EAF0E9] text-[#123F32] font-mono">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-3 bg-[#F8F9F6] border-t border-[#D5DED6] flex items-center justify-between">
                          <a
                            href={item.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#123F32] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Bax</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold cursor-pointer transition-colors"
                            title="Şəkli sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Sil</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D5DED6] p-12 text-center text-xs text-[#586B62]">
                <Image className="w-8 h-8 text-[#96B5A1] mx-auto mb-2" />
                <span>Qalereyada heç bir şəkil yoxdur. "Yeni Şəkil Əlavə Et" düyməsi ilə əlavə edin.</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Site Settings & Telephone (Section 21 & 22) */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-[#D5DED6] p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#193E33] mb-1">
              General Corporate Configuration
            </h2>
            <p className="text-xs text-[#586B62] mb-6">
              Manage verified contact parameters, phone display, and official email addresses.
            </p>

            {settingsSavedNotice && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Settings successfully updated across the website!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* Section 21: Phone number field */}
              <div className="p-4 rounded-xl bg-[#F8F9F6] border border-[#D5DED6]">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-[#123F32]" />
                  <label className="text-xs font-bold text-[#193E33]">
                    Official Company Phone (Section 21)
                  </label>
                </div>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="e.g. +370 600 00000 (leave empty to hide phone on site)"
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#D5DED6] text-xs text-[#193E33]"
                />
                <span className="text-[11px] text-[#586B62] block mt-1.5 leading-relaxed">
                  Strict Rule: If left empty, telephone numbers and call buttons are automatically hidden across all 4 languages.
                </span>
              </div>

              {/* Email Addresses */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#193E33] block">
                  Official Email Routing (Section 4)
                </label>

                <div>
                  <span className="text-[11px] text-[#586B62] block mb-1">Public Inquiries:</span>
                  <input
                    type="email"
                    value={editPublicEmail}
                    onChange={(e) => setEditPublicEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-[#586B62] block mb-1">Office Administration:</span>
                  <input
                    type="email"
                    value={editOfficeEmail}
                    onChange={(e) => setEditOfficeEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-[#586B62] block mb-1">Invoices & Accounting:</span>
                  <input
                    type="email"
                    value={editInvoicesEmail}
                    onChange={(e) => setEditInvoicesEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>
              </div>

              {/* Section 22: Social Links */}
              <div className="space-y-3 pt-3 border-t border-[#D5DED6]">
                <label className="text-xs font-bold text-[#193E33] block">
                  Social Channels (Section 22)
                </label>

                <div>
                  <span className="text-[11px] text-[#586B62] block mb-1">LinkedIn URL:</span>
                  <input
                    type="url"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/company/smarteura"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-[#586B62] block mb-1">Facebook URL:</span>
                  <input
                    type="url"
                    value={editFacebook}
                    onChange={(e) => setEditFacebook(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-[#586B62] block mb-1">Instagram URL:</span>
                  <input
                    type="url"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Portal Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: Google Workspace (Drive & Gmail) Integration */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#193E33]">
                  Google Workspace (Drive & Gmail)
                </h2>
                <p className="text-xs text-[#586B62]">
                  Manage corporate Google Drive candidate documents, stored CVs, and communicate via official Gmail accounts.
                </p>
              </div>
            </div>
            <WorkspaceHub />
          </div>
        )}

        {/* TAB: Cloud Database (Firebase Firestore & Cloud SQL PostgreSQL) */}
        {activeTab === 'cloudsql' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#193E33]">
                  Cloud Database & Storage (europe-west2)
                </h2>
                <p className="text-xs text-[#586B62]">
                  Live status of Firebase Firestore and PostgreSQL Cloud SQL instances.
                </p>
              </div>
            </div>
            <CloudDbHub />
          </div>
        )}
      </div>

      {/* Candidate Internal Details & Action Modal (Section 17) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#D5DED6] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D5DED6]">
              <div>
                <span className="text-xs font-mono font-bold text-[#123F32]">
                  {selectedApp.referenceId}
                </span>
                <h3 className="text-xl font-bold text-[#193E33]">
                  {selectedApp.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-xs font-semibold text-[#586B62] hover:text-[#193E33]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div>
                <span className="text-[#586B62] block">Email:</span>
                <strong className="text-[#193E33]">{selectedApp.email}</strong>
              </div>
              <div>
                <span className="text-[#586B62] block">Phone:</span>
                <strong className="text-[#193E33]">{selectedApp.phone}</strong>
              </div>
              <div>
                <span className="text-[#586B62] block">Target Trade:</span>
                <strong className="text-[#193E33]">{selectedApp.trade} ({selectedApp.targetPosition})</strong>
              </div>
              <div>
                <span className="text-[#586B62] block">Location:</span>
                <strong className="text-[#193E33]">{selectedApp.countryOfResidence || 'Not stated'}</strong>
              </div>
            </div>

            {/* Attached CV File Preview / Download */}
            {selectedApp.cvFileName && (
              <div className="p-3 bg-[#EAF0E9] rounded-xl border border-[#D5DED6] flex items-center justify-between mb-6 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#123F32]" />
                  <div>
                    <span className="font-bold text-[#193E33] block">{selectedApp.cvFileName}</span>
                    <span className="text-[10px] text-[#586B62]">{selectedApp.cvFileSize || 'Document'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cvDownloadToast && (
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium border border-emerald-200">
                      {cvDownloadToast}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedApp.cvDataUrl) {
                        const link = document.createElement('a');
                        link.href = selectedApp.cvDataUrl;
                        link.download = selectedApp.cvFileName || 'candidate-cv.pdf';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setCvDownloadToast(`Yükləndi: ${selectedApp.cvFileName}`);
                      } else {
                        setCvDownloadToast(`Fayl adı qeydə alınıb: ${selectedApp.cvFileName}`);
                      }
                      setTimeout(() => setCvDownloadToast(null), 3500);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123F32] text-white font-semibold text-xs hover:bg-[#25664E] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CV</span>
                  </button>
                </div>
              </div>
            )}

            {/* Section 17 Internal Fields */}
            <div className="space-y-4 pt-4 border-t border-[#D5DED6]">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#123F32]">
                Internal CRM Fields (Confidential)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">Status</label>
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="contacted">Contacted</option>
                    <option value="interview_scheduled">Interview Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">Assigned Recruiter</label>
                  <input
                    type="text"
                    value={appAssigned}
                    onChange={(e) => setAppAssigned(e.target.value)}
                    placeholder="e.g. Elena V."
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193E33] mb-1">Internal Notes</label>
                <textarea
                  rows={3}
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  placeholder="Technical evaluation notes, verified certificates, interview feedback..."
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">Next Step</label>
                  <input
                    type="text"
                    value={appNextStep}
                    onChange={(e) => setAppNextStep(e.target.value)}
                    placeholder="e.g. Request ISO 9606 stamp"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={appNextStepDate}
                    onChange={(e) => setAppNextStepDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>
              </div>
            </div>

            {forwardNotice && (
              <div className="mt-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{forwardNotice}</span>
              </div>
            )}

            <div className="pt-6 border-t border-[#D5DED6] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteApp(selectedApp.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Candidate</span>
                </button>

                <button
                  type="button"
                  disabled={isForwardingEmail}
                  onClick={() => handleForwardCandidateToOffice(selectedApp)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
                  title="Müraciəti office@smarteura.eu ünvanına göndər"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isForwardingEmail ? 'Göndərilir...' : 'office@smarteura.eu ünvanına göndər'}</span>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-lg border border-[#D5DED6] text-xs font-semibold text-[#586B62]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAppDetails}
                  className="px-5 py-2 rounded-lg bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E] cursor-pointer"
                >
                  Save Candidate Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Inquiry Details & Action Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#D5DED6] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D5DED6]">
              <div>
                <span className="text-xs font-mono font-bold text-[#123F32]">
                  {selectedInquiry.referenceId}
                </span>
                <h3 className="text-xl font-bold text-[#193E33]">
                  {selectedInquiry.companyName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-xs font-semibold text-[#586B62] hover:text-[#193E33]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div>
                <span className="text-[#586B62] block">Contact Person:</span>
                <strong className="text-[#193E33]">{selectedInquiry.contactPerson}</strong>
              </div>
              <div>
                <span className="text-[#586B62] block">Email:</span>
                <strong className="text-[#193E33]">{selectedInquiry.email}</strong>
              </div>
              <div>
                <span className="text-[#586B62] block">Phone:</span>
                <strong className="text-[#193E33]">{selectedInquiry.phone || 'Not provided'}</strong>
              </div>
              <div>
                <span className="text-[#586B62] block">Project Country:</span>
                <strong className="text-[#193E33]">{selectedInquiry.projectCountry}</strong>
              </div>
              <div>
                <span className="text-[#586B62] block">Required Specialists:</span>
                <strong className="text-[#193E33]">{selectedInquiry.requiredSpecialists.join(', ') || 'General Scope'}</strong>
              </div>
              <div>
                <span className="text-[#586B62] block">Estimated Timeline:</span>
                <strong className="text-[#193E33]">{selectedInquiry.estimatedTimeline || 'Flexible'}</strong>
              </div>
            </div>

            {/* Client Message */}
            <div className="mb-6 p-4 rounded-xl bg-[#F8F9F6] border border-[#D5DED6] text-xs">
              <span className="text-[11px] font-bold text-[#586B62] uppercase tracking-wider block mb-1">
                Project Scope / Message:
              </span>
              <p className="text-[#193E33] leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message || 'No additional message text.'}
              </p>
            </div>

            {/* Attached Drawings / Files */}
            {selectedInquiry.files && selectedInquiry.files.length > 0 && (
              <div className="mb-6 space-y-2">
                <span className="text-[11px] font-bold text-[#586B62] uppercase tracking-wider block">
                  Attached Technical Drawings & Documents ({selectedInquiry.files.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedInquiry.files.map((file, idx) => (
                    <div key={idx} className="p-3 bg-[#EAF0E9] rounded-xl border border-[#D5DED6] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-[#123F32] shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-[#193E33] block truncate">{file.name}</span>
                          <span className="text-[10px] text-[#586B62]">{file.size}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CRM Fields */}
            <div className="space-y-4 pt-4 border-t border-[#D5DED6]">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#123F32]">
                Internal CRM Fields (Confidential)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">Status</label>
                  <select
                    value={inquiryStatus}
                    onChange={(e) => setInquiryStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  >
                    <option value="new">New</option>
                    <option value="analyzing">Analyzing Requirements</option>
                    <option value="in_contact">In Contact</option>
                    <option value="proposal_sent">Commercial Proposal Sent</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">Assigned Account Manager</label>
                  <input
                    type="text"
                    value={inquiryAssigned}
                    onChange={(e) => setInquiryAssigned(e.target.value)}
                    placeholder="e.g. Rolandas K."
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193E33] mb-1">Internal Notes</label>
                <textarea
                  rows={3}
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  placeholder="Budget discussions, mobilization schedule, weld procedure specifications..."
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">Next Step</label>
                  <input
                    type="text"
                    value={inquiryNextStep}
                    onChange={(e) => setInquiryNextStep(e.target.value)}
                    placeholder="e.g. Dispatch initial brigade estimate"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={inquiryNextStepDate}
                    onChange={(e) => setInquiryNextStepDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>
              </div>
            </div>

            {forwardNotice && (
              <div className="mt-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{forwardNotice}</span>
              </div>
            )}

            <div className="pt-6 border-t border-[#D5DED6] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Inquiry</span>
                </button>

                <button
                  type="button"
                  disabled={isForwardingEmail}
                  onClick={() => handleForwardInquiryToOffice(selectedInquiry)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
                  title="Sorğunu office@smarteura.eu ünvanına göndər"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isForwardingEmail ? 'Göndərilir...' : 'office@smarteura.eu ünvanına göndər'}</span>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 rounded-lg border border-[#D5DED6] text-xs font-semibold text-[#586B62]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveInquiryDetails}
                  className="px-5 py-2 rounded-lg bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E] cursor-pointer"
                >
                  Save Inquiry Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vacancy Modal */}
      {showAddVacancy && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D5DED6] max-w-lg w-full p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-[#193E33] mb-4">
              Add New Industrial Vacancy
            </h3>

            <form onSubmit={handleCreateVacancy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#193E33] mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newVacTitle}
                  onChange={(e) => setNewVacTitle(e.target.value)}
                  placeholder="e.g. ISO 9606 Pipe Welder"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">Category</label>
                  <select
                    value={newVacCategory}
                    onChange={(e) => setNewVacCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  >
                    <option value="welding">Welding</option>
                    <option value="piping">Industrial Piping</option>
                    <option value="pipefitter">Pipefitter</option>
                    <option value="assembly">Mechanical Assembly</option>
                    <option value="installation">Installation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">Country</label>
                  <select
                    value={newVacCountry}
                    onChange={(e) => setNewVacCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  >
                    <option value="Lithuania">Lithuania</option>
                    <option value="France">France</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193E33] mb-1">City / Region</label>
                <input
                  type="text"
                  required
                  value={newVacCity}
                  onChange={(e) => setNewVacCity(e.target.value)}
                  placeholder="e.g. Rotterdam / Hamburg / Normandy"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193E33] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newVacDesc}
                  onChange={(e) => setNewVacDesc(e.target.value)}
                  placeholder="Brief summary of duties..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddVacancy(false)}
                  className="px-4 py-2 rounded-lg border border-[#D5DED6] text-xs font-semibold text-[#586B62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E]"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Gallery Item Modal */}
      {showAddGallery && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#D5DED6] max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D5DED6]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EAF0E9] text-[#123F32] flex items-center justify-center">
                  <Image className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#193E33]">
                  Qalereyaya Yeni Şəkil Əlavə Et
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddGallery(false)}
                className="p-1 rounded-lg text-[#586B62] hover:bg-[#F8F9F6] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGalleryItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#193E33] mb-1">
                  Şəkil Başlığı (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={newGalTitle}
                  onChange={(e) => setNewGalTitle(e.target.value)}
                  placeholder="məs: TIG Boru Qaynağı və Prefabrikasiya"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">
                    Kateqoriya (Category) *
                  </label>
                  <select
                    value={newGalCategory}
                    onChange={(e) => setNewGalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  >
                    <option value="piping">Piping (Vamzdynai / Borulama)</option>
                    <option value="welding">Welding (Suvirinimas / Qaynaq)</option>
                    <option value="assembly">Assembly (Surinkimas / Yığma)</option>
                    <option value="installation">Installation (Montavimas / Quraşdırma)</option>
                    <option value="shipyard">Shipyard (Laivų statyba / Gəmiqayırma)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#193E33] mb-1">
                    İl (Year)
                  </label>
                  <input
                    type="text"
                    value={newGalYear}
                    onChange={(e) => setNewGalYear(e.target.value)}
                    placeholder="2026"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193E33] mb-1">
                  Yerləşmə / Şəhər və Ölkə (Location)
                </label>
                <input
                  type="text"
                  value={newGalLocation}
                  onChange={(e) => setNewGalLocation(e.target.value)}
                  placeholder="məs: Rotterdam, Netherlands / Klaipėda, Lithuania"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                />
              </div>

              {/* Image Input Options */}
              <div className="space-y-2 p-3 bg-[#F8F9F6] rounded-xl border border-[#D5DED6]">
                <label className="block text-xs font-bold text-[#193E33]">
                  Şəkil Mənbəyi (URL və ya Cihazdan Yüklə) *
                </label>

                <div>
                  <input
                    type="url"
                    required
                    value={newGalImageUrl}
                    onChange={(e) => setNewGalImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... və ya şəkil linki"
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#D5DED6] text-xs text-[#193E33]"
                  />
                </div>

                {/* Upload from local device */}
                <div className="flex items-center gap-2 pt-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5DED6] hover:bg-[#EAF0E9] text-xs font-medium text-[#123F32] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Kompüterdən / Telefondan Şəkil Seç</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-[#586B62]">(Maks. 5 MB)</span>
                </div>

                {/* Quick Presets for instant photo fill */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-[#586B62] block mb-1">
                    Sürətli Təklif Olunan Şəkillər (Bir kliklə seçin):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Boru Prefabrikasiyası', url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80' },
                      { label: 'TIG Qaynaq İşi', url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80' },
                      { label: 'Mexaniki Yığma', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80' },
                      { label: 'Sənaye Quraşdırma', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80' },
                      { label: 'Gəmi Təmiri', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewGalImageUrl(preset.url)}
                        className="text-[10px] px-2 py-1 bg-white hover:bg-emerald-50 text-[#123F32] border border-[#D5DED6] rounded-md transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Live Preview */}
                {newGalImageUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-[#D5DED6] bg-black/5 aspect-16/9 max-h-48 relative">
                    <img
                      src={newGalImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).alt = 'Şəkil yüklənə bilmədi (URL yoxlayın)';
                      }}
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] bg-black/60 text-white font-mono">
                      Önizləmə
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193E33] mb-1">
                  Qısa Təsvir (Description)
                </label>
                <textarea
                  rows={2}
                  value={newGalDesc}
                  onChange={(e) => setNewGalDesc(e.target.value)}
                  placeholder="Görülən iş və layihə haqqında qısa məlumat..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193E33] mb-1">
                  Teqlər (Tags, vergüllə ayırın)
                </label>
                <input
                  type="text"
                  value={newGalTags}
                  onChange={(e) => setNewGalTags(e.target.value)}
                  placeholder="TIG, Spool, Isometric, ISO 9606"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                />
              </div>

              <div className="pt-3 border-t border-[#D5DED6] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGallery(false)}
                  className="px-4 py-2 rounded-lg border border-[#D5DED6] text-xs font-semibold text-[#586B62] cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Qalereyaya Əlavə Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
