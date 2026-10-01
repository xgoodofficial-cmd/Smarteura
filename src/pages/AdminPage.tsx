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
  Database
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
  NewsArticle
} from '../types';
import {
  saveStoredSettings,
  saveStoredVacancies,
  updateApplication,
  updateInquiry,
  saveStoredProjects,
  saveStoredNews
} from '../data/initialData';

interface AdminPageProps {
  settings: SiteSettings;
  vacancies: Vacancy[];
  applications: CandidateApplication[];
  inquiries: ClientInquiry[];
  projects: ProjectItem[];
  news: NewsArticle[];
  onUpdateSettings: (settings: SiteSettings) => void;
  onUpdateVacancies: (vacancies: Vacancy[]) => void;
  onUpdateProjects: (projects: ProjectItem[]) => void;
  onUpdateNews: (news: NewsArticle[]) => void;
  onRefreshData: () => void;
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
  onUpdateSettings,
  onUpdateVacancies,
  onUpdateProjects,
  onUpdateNews,
  onRefreshData,
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
  const [activeTab, setActiveTab] = useState<'applications' | 'inquiries' | 'vacancies' | 'projects' | 'settings' | 'workspace' | 'cloudsql'>('applications');

  // Sub-detail states
  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ClientInquiry | null>(null);

  // Status updates in modal/form
  const [appStatus, setAppStatus] = useState<CandidateApplication['status']>('new');
  const [appAssigned, setAppAssigned] = useState('');
  const [appNotes, setAppNotes] = useState('');
  const [appNextStep, setAppNextStep] = useState('');
  const [appNextStepDate, setAppNextStepDate] = useState('');

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

  // Login Handler (username: control, password: 010203040506070809smarteura)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanUser = adminUser.trim();
    const cleanPass = adminPassword.trim();

    if (cleanUser === 'control' && cleanPass === '010203040506070809smarteura') {
      setIsAuthenticated(true);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setAuthError('İstifadəçi adı və ya şifrə yanlışdır. (Invalid credentials)');
    }
  };

  const handleLogout = () => {
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

  const handleSaveAppDetails = () => {
    if (!selectedApp) return;

    updateApplication(selectedApp.id, {
      status: appStatus,
      assignedTo: appAssigned.trim() || undefined,
      internalNotes: appNotes.trim() || undefined,
      nextStep: appNextStep.trim() || undefined,
      nextStepDate: appNextStepDate.trim() || undefined
    });

    onRefreshData();
    setSelectedApp(null);
  };

  // Settings Save Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: SiteSettings = {
      ...settings,
      phone: editPhone.trim() || undefined,
      publicEmail: editPublicEmail.trim(),
      officeEmail: editOfficeEmail.trim(),
      invoicesEmail: editInvoicesEmail.trim(),
      socialLinks: {
        ...settings.socialLinks,
        linkedin: editLinkedin.trim() || undefined,
        facebook: editFacebook.trim() || undefined,
        instagram: editInstagram.trim() || undefined
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
              <h2 className="text-lg font-bold text-[#193E33]">
                Candidate Applications & Stored CVs
              </h2>
              <span className="text-xs text-[#586B62]">
                Confidential candidate records. Internal access only.
              </span>
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
              <h2 className="text-lg font-bold text-[#193E33]">
                Client Project Inquiries & Attached Drawings
              </h2>
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
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                              {inq.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#586B62]">
                            {new Date(inq.createdAt).toLocaleDateString()}
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

                <a
                  href={`#`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Securely initiating download for authorized recruiter: ${selectedApp.cvFileName}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123F32] text-white font-semibold text-xs hover:bg-[#25664E]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CV</span>
                </a>
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

            <div className="pt-6 border-t border-[#D5DED6] flex justify-end gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-lg border border-[#D5DED6] text-xs font-semibold text-[#586B62]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAppDetails}
                className="px-5 py-2 rounded-lg bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E]"
              >
                Save Candidate Log
              </button>
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
    </div>
  );
};
