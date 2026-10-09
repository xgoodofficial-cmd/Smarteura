import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Building,
  Calendar,
  ShieldCheck,
  FileText,
  Briefcase,
  LogOut,
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Save,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { Language, ClientInquiry, CandidateApplication } from '../types';
import { getUserProfile, updateUserProfileData, logoutUser } from '../lib/firebase';
import { saveInquiry, getStoredInquiries } from '../data/initialData';

interface CabinetPageProps {
  user: User;
  lang: Language;
  inquiries: ClientInquiry[];
  applications: CandidateApplication[];
  onRefreshData: () => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const CABINET_I18N: Record<string, {
  title: string;
  subtitle: string;
  verifiedBadge: string;
  logoutBtn: string;
  overviewTab: string;
  inquiriesTab: string;
  applicationsTab: string;
  profileTab: string;
  myStatsTitle: string;
  totalInquiries: string;
  totalApplications: string;
  accountSecurity: string;
  lastActive: string;
  newInquiryBtn: string;
  noInquiriesTitle: string;
  noInquiriesDesc: string;
  createFirstInquiry: string;
  noAppsTitle: string;
  noAppsDesc: string;
  exploreVacancies: string;
  profileTitle: string;
  profileDesc: string;
  phoneLabel: string;
  companyLabel: string;
  notesLabel: string;
  saveChangesBtn: string;
  savedSuccess: string;
  inquiryModalTitle: string;
  inquiryModalDesc: string;
  projectName: string;
  country: string;
  message: string;
  sendInquiryBtn: string;
  cancelBtn: string;
  statusNew: string;
  statusAnalyzing: string;
  statusProposalSent: string;
  statusUnderReview: string;
  quickContactTitle: string;
  quickContactDesc: string;
}> = {
  az: {
    title: 'Şəxsi Kabinet',
    subtitle: 'Smarteura müştəri və tərəfdaş portalında fəaliyyətiniz və müraciətləriniz',
    verifiedBadge: 'Google ilə Təsdiqlənmiş Hesab',
    logoutBtn: 'Çıxış',
    overviewTab: 'İcmal & Statistika',
    inquiriesTab: 'Mənim Sorğularım',
    applicationsTab: 'Karyera Müraciətlərim',
    profileTab: 'Profil & Tənzimləmələr',
    myStatsTitle: 'Hesab Göstəriciləri',
    totalInquiries: 'Göndərilmiş Layihə Sorğuları',
    totalApplications: 'Vakansiya / CV Müraciətləri',
    accountSecurity: 'Təhlükəsizlik Statusu',
    lastActive: 'Son Giriş',
    newInquiryBtn: 'Yeni Layihə Sorğusu Göndər',
    noInquiriesTitle: 'Hələlik heç bir layihə sorğunuz yoxdur',
    noInquiriesDesc: 'Sənaye boru montajı, qaynaq və ya quraşdırma layihəniz üçün birbaşa kabinetinizdən müraciət edin.',
    createFirstInquiry: 'İlk Sorğunuzu Yaradın',
    noAppsTitle: 'Vakansiya müraciətiniz tapılmadı',
    noAppsDesc: 'Avropada sənaye layihələrimizdə iştirak etmək üçün açıq vakansiyalarımıza baxa bilərsiniz.',
    exploreVacancies: 'Açıq Vakansiyalara Bax',
    profileTitle: 'Şəxsi və Əlaqə Məlumatları',
    profileDesc: 'Smarteura mühəndisləri ilə koordinasiya üçün əlavə əlaqə məlumatlarınızı qeyd edin.',
    phoneLabel: 'Əlaqə Telefonu',
    companyLabel: 'Şirkət / Təşkilat Adı',
    notesLabel: 'Əlavə Qeydlər və ya Xüsusi Tələblər',
    saveChangesBtn: 'Məlumatları Yadda Saxla',
    savedSuccess: 'Məlumatlar uğurla yeniləndi!',
    inquiryModalTitle: 'Yeni Layihə Sorğusu Təqdim Edin',
    inquiryModalDesc: 'Mühəndis heyətimiz 24 saat ərzində sizinlə əlaqə saxlayacaq.',
    projectName: 'Layihə / Xidmət Növü',
    country: 'Layihənin Həyata Keçiriləcəyi Ölkə',
    message: 'Layihə haqqında qısa məlumat və texniki tələblər',
    sendInquiryBtn: 'Sorğunu Göndər',
    cancelBtn: 'Ləğv et',
    statusNew: 'Yeni müraciət',
    statusAnalyzing: 'Analiz edilir',
    statusProposalSent: 'Təklif göndərildi',
    statusUnderReview: 'Baxılır',
    quickContactTitle: 'Birbaşa Mühəndis Dəstəyi',
    quickContactDesc: 'Təcili sənaye layihələriniz üçün mühəndis koordinatorumuz ilə birbaşa əlaqə saxlayın.'
  },
  en: {
    title: 'Personal Dashboard',
    subtitle: 'Manage your industrial requests, inquiries, and applications with Smarteura',
    verifiedBadge: 'Verified Google Account',
    logoutBtn: 'Sign Out',
    overviewTab: 'Overview & Metrics',
    inquiriesTab: 'My Project Inquiries',
    applicationsTab: 'Career Applications',
    profileTab: 'Profile & Settings',
    myStatsTitle: 'Account Metrics',
    totalInquiries: 'Submitted Project Inquiries',
    totalApplications: 'Job / CV Submissions',
    accountSecurity: 'Security Level',
    lastActive: 'Current Session',
    newInquiryBtn: 'Submit New Inquiry',
    noInquiriesTitle: 'No project inquiries found yet',
    noInquiriesDesc: 'Request industrial piping, welding, or mechanical assembly services directly from your dashboard.',
    createFirstInquiry: 'Create Your First Request',
    noAppsTitle: 'No career applications found',
    noAppsDesc: 'Explore our open vacancies across European industrial sites and apply with your CV.',
    exploreVacancies: 'View Open Vacancies',
    profileTitle: 'Profile & Contact Details',
    profileDesc: 'Provide company details and phone numbers for faster coordination with our engineering team.',
    phoneLabel: 'Phone Number',
    companyLabel: 'Company / Organization',
    notesLabel: 'Additional Notes & Technical Preferences',
    saveChangesBtn: 'Save Changes',
    savedSuccess: 'Profile updated successfully!',
    inquiryModalTitle: 'Submit Project Inquiry',
    inquiryModalDesc: 'Our engineering specialists will review and respond within 24 business hours.',
    projectName: 'Service / Project Scope',
    country: 'Project Country',
    message: 'Technical requirements and brief',
    sendInquiryBtn: 'Send Inquiry',
    cancelBtn: 'Cancel',
    statusNew: 'New submission',
    statusAnalyzing: 'Under analysis',
    statusProposalSent: 'Proposal sent',
    statusUnderReview: 'In review',
    quickContactTitle: 'Engineering Hotline',
    quickContactDesc: 'Need immediate industrial staffing or piping installation? Talk directly with our team.'
  },
  lt: {
    title: 'Asmeninis Kabinetas',
    subtitle: 'Jūsų pramoninių užklausų ir paraiškų valdymas „Smarteura“ sistemoje',
    verifiedBadge: 'Patvirtinta „Google“ paskyra',
    logoutBtn: 'Atsijungti',
    overviewTab: 'Apžvalga',
    inquiriesTab: 'Mano Užklausos',
    applicationsTab: 'Kandidato Paraiškos',
    profileTab: 'Profilis ir Nustatymai',
    myStatsTitle: 'Paskyros Rodikliai',
    totalInquiries: 'Pateiktos Projektų Užklausos',
    totalApplications: 'Kandidato CV Paraiškos',
    accountSecurity: 'Saugumo Lygis',
    lastActive: 'Sesija',
    newInquiryBtn: 'Nauja Projekto Užklausa',
    noInquiriesTitle: 'Projektų užklausų dar nėra',
    noInquiriesDesc: 'Užsakykite pramoninių vamzdynų montavimo, suvirinimo ar surinkimo paslaugas tiesiogiai.',
    createFirstInquiry: 'Pateikti Užklausą',
    noAppsTitle: 'Darbo paraiškų nerasta',
    noAppsDesc: 'Peržiūrėkite atviras darbo pozicijas Europos pramonės projektuose.',
    exploreVacancies: 'Atviros Pozicijos',
    profileTitle: 'Asmeninė ir Kontaktinė Informacija',
    profileDesc: 'Nurodykite papildomus kontaktus greitesniam inžinierių susisiekimui.',
    phoneLabel: 'Telefono Numeris',
    companyLabel: 'Įmonė / Organizacija',
    notesLabel: 'Pastabos ir Techniniai Reikalavimai',
    saveChangesBtn: 'Išsaugoti Pakeitimus',
    savedSuccess: 'Profilis sėkmingai atnaujintas!',
    inquiryModalTitle: 'Nauja Projekto Užklausa',
    inquiryModalDesc: 'Mūsų komanda susisieks su jumis per 24 valandas.',
    projectName: 'Paslaugos / Projekto Tipas',
    country: 'Šalis',
    message: 'Techninė užduotis ir aprašymas',
    sendInquiryBtn: 'Siųsti Užklausą',
    cancelBtn: 'Atšaukti',
    statusNew: 'Nauja',
    statusAnalyzing: 'Analizuojama',
    statusProposalSent: 'Pasiūlymas išsiųstas',
    statusUnderReview: 'Peržiūrima',
    quickContactTitle: 'Tiesioginis Inžinierių Ryšys',
    quickContactDesc: 'Skubiam projektų koordinavimui susisiekite su mūsų vadovais.'
  },
  fr: {
    title: 'Espace Personnel',
    subtitle: 'Gérez vos demandes de projets industriels et candidatures Smarteura',
    verifiedBadge: 'Compte Google Vérifié',
    logoutBtn: 'Déconnexion',
    overviewTab: 'Vue d’ensemble',
    inquiriesTab: 'Mes Demandes de Devis',
    applicationsTab: 'Mes Candidatures',
    profileTab: 'Profil & Coordonnées',
    myStatsTitle: 'Indicateurs du Compte',
    totalInquiries: 'Demandes de projets transmises',
    totalApplications: 'Candidatures & CV soumis',
    accountSecurity: 'Niveau de Sécurité',
    lastActive: 'Session Actuelle',
    newInquiryBtn: 'Nouvelle Demande de Projet',
    noInquiriesTitle: 'Aucune demande enregistrée',
    noInquiriesDesc: 'Demandez nos services de tuyauterie industrielle, soudage ou montage directement depuis votre espace.',
    createFirstInquiry: 'Créer une Demande',
    noAppsTitle: 'Aucune candidature trouvée',
    noAppsDesc: 'Consultez nos opportunités d’emploi dans les chantiers industriels en Europe.',
    exploreVacancies: 'Voir les Postes Ouverts',
    profileTitle: 'Informations de Contact',
    profileDesc: 'Renseignez votre numéro et entreprise pour un suivi optimal avec nos ingénieurs.',
    phoneLabel: 'Numéro de Téléphone',
    companyLabel: 'Entreprise / Société',
    notesLabel: 'Notes et Spécifications Techniques',
    saveChangesBtn: 'Enregistrer les Modifications',
    savedSuccess: 'Profil mis à jour avec succès !',
    inquiryModalTitle: 'Transmettre un Projet',
    inquiryModalDesc: 'Nos coordinateurs techniques vous répondront sous 24 heures.',
    projectName: 'Type de Projet / Prestation',
    country: 'Pays du Projet',
    message: 'Description et exigences techniques',
    sendInquiryBtn: 'Envoyer la Demande',
    cancelBtn: 'Annuler',
    statusNew: 'Nouvelle',
    statusAnalyzing: 'En analyse',
    statusProposalSent: 'Proposition envoyée',
    statusUnderReview: 'En cours',
    quickContactTitle: 'Assistance Ingénierie',
    quickContactDesc: 'Besoin de personnel qualifié pour vos chantiers ? Contactez nos experts.'
  },
  nl: {
    title: 'Persoonlijk Dashboard',
    subtitle: 'Beheer uw industriële projectaanvragen en sollicitaties bij Smarteura',
    verifiedBadge: 'Geverifieerd Google Account',
    logoutBtn: 'Uitloggen',
    overviewTab: 'Overzicht',
    inquiriesTab: 'Mijn Projectaanvragen',
    applicationsTab: 'Mijn Sollicitaties',
    profileTab: 'Profiel & Gegevens',
    myStatsTitle: 'Accountstatistieken',
    totalInquiries: 'Ingediende Projectaanvragen',
    totalApplications: 'Ingediende Sollicitaties',
    accountSecurity: 'Beveiligingsniveau',
    lastActive: 'Huidige Sessie',
    newInquiryBtn: 'Nieuwe Aanvraag Indienen',
    noInquiriesTitle: 'Nog geen projectaanvragen',
    noInquiriesDesc: 'Vraag industriële leidingbouw, lassen of mechanische montage direct aan vanuit uw dashboard.',
    createFirstInquiry: 'Dien een Aanvraag In',
    noAppsTitle: 'Geen sollicitaties gevonden',
    noAppsDesc: 'Bekijk onze openstaande vacatures op Europese industriële projecten.',
    exploreVacancies: 'Bekijk Vacatures',
    profileTitle: 'Profiel en Contactgegevens',
    profileDesc: 'Vul uw telefoonnummer en bedrijfsnaam in voor snellere technische afstemming.',
    phoneLabel: 'Telefoonnummer',
    companyLabel: 'Bedrijf / Organisatie',
    notesLabel: 'Aanvullende Technische Notities',
    saveChangesBtn: 'Wijzigingen Opslaan',
    savedSuccess: 'Profiel succesvol bijgewerkt!',
    inquiryModalTitle: 'Projectaanvraag Indienen',
    inquiryModalDesc: 'Ons technisch team neemt binnen 24 uur contact met u op.',
    projectName: 'Type Dienst / Project',
    country: 'Land van Uitvoering',
    message: 'Technische omschrijving en vereisten',
    sendInquiryBtn: 'Aanvraag Versturen',
    cancelBtn: 'Annuleren',
    statusNew: 'Nieuw',
    statusAnalyzing: 'In analyse',
    statusProposalSent: 'Offerte verzonden',
    statusUnderReview: 'In behandeling',
    quickContactTitle: 'Direct Technisch Contact',
    quickContactDesc: 'Dringend vakmensen nodig voor industriële montage? Neem direct contact op.'
  },
  tr: {
    title: 'Kişisel Panel',
    subtitle: 'Smarteura müşteri portalında taleplerinizi ve başvurularınızı yönetin',
    verifiedBadge: 'Doğrulanmış Google Hesabı',
    logoutBtn: 'Çıkış Yap',
    overviewTab: 'Genel Bakış',
    inquiriesTab: 'Proje Taleplerim',
    applicationsTab: 'Kariyer Başvurularım',
    profileTab: 'Profil ve Ayarlar',
    myStatsTitle: 'Hesap İstatistikleri',
    totalInquiries: 'Gönderilen Proje Talepleri',
    totalApplications: 'İş ve CV Başvuruları',
    accountSecurity: 'Güvenlik Seviyesi',
    lastActive: 'Aktif Oturum',
    newInquiryBtn: 'Yeni Proje Talebi Gönder',
    noInquiriesTitle: 'Henüz proje talebiniz bulunmuyor',
    noInquiriesDesc: 'Endüstriyel boru montajı, kaynak ve mekanik montaj hizmetleri için hemen talep oluşturun.',
    createFirstInquiry: 'İlk Talebinizi Oluşturun',
    noAppsTitle: 'Kayıtlı kariyer başvurusu yok',
    noAppsDesc: 'Avrupa’daki endüstriyel projelerimizdeki açık pozisyonları inceleyin ve başvurun.',
    exploreVacancies: 'Açık Pozisyonları İncele',
    profileTitle: 'Profil ve İletişim Bilgileri',
    profileDesc: 'Mühendislerimizin sizinle hızlı iletişime geçmesi için ek bilgilerinizi kaydedin.',
    phoneLabel: 'Telefon Numarası',
    companyLabel: 'Şirket / Kurum Adı',
    notesLabel: 'Ek Notlar ve Teknik Talepler',
    saveChangesBtn: 'Değişiklikleri Kaydet',
    savedSuccess: 'Profil başarıyla güncellendi!',
    inquiryModalTitle: 'Yeni Proje Talebi Oluştur',
    inquiryModalDesc: 'Mühendislerimiz 24 saat içerisinde talebinizi değerlendirecektir.',
    projectName: 'Hizmet / Proje Kapsamı',
    country: 'Proje Ülkesi',
    message: 'Teknik detaylar ve proje özeti',
    sendInquiryBtn: 'Talebi Gönder',
    cancelBtn: 'İptal',
    statusNew: 'Yeni Talep',
    statusAnalyzing: 'İnceleniyor',
    statusProposalSent: 'Teklif Gönderildi',
    statusUnderReview: 'Değerlendirmede',
    quickContactTitle: 'Doğrudan Mühendislik Desteği',
    quickContactDesc: 'Acil endüstriyel montaj ve borulama projeleri için uzmanlarımızla iletişime geçin.'
  }
};

export const CabinetPage: React.FC<CabinetPageProps> = ({
  user,
  lang,
  inquiries,
  applications,
  onRefreshData,
  onNavigate,
  onLogout
}) => {
  const t = CABINET_I18N[lang] || CABINET_I18N.en;
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'applications' | 'profile'>('overview');

  // Profile extra state
  const [phone, setPhone] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // New inquiry modal inside cabinet
  const [showNewInquiryModal, setShowNewInquiryModal] = useState<boolean>(false);
  const [newInquiryProject, setNewInquiryProject] = useState<string>('Industrial Piping Installation');
  const [newInquiryCountry, setNewInquiryCountry] = useState<string>('Lithuania');
  const [newInquiryMessage, setNewInquiryMessage] = useState<string>('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState<boolean>(false);
  const [inquirySuccessAlert, setInquirySuccessAlert] = useState<boolean>(false);

  // Load existing profile from Firestore
  useEffect(() => {
    let isMounted = true;
    getUserProfile(user.uid).then((data) => {
      if (data && isMounted) {
        if (data.phone) setPhone(data.phone);
        if (data.company) setCompany(data.company);
        if (data.notes) setNotes(data.notes);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user.uid]);

  // Filter inquiries belonging to this user's email
  const userInquiries = inquiries.filter((inq) =>
    inq.email?.toLowerCase().trim() === user.email?.toLowerCase().trim()
  );

  // Filter career applications belonging to this user's email
  const userApplications = applications.filter((app) =>
    app.email?.toLowerCase().trim() === user.email?.toLowerCase().trim()
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      setProfileSuccessMsg(null);
      await updateUserProfileData(user.uid, {
        phone,
        company,
        notes,
        displayName: user.displayName || ''
      });
      setProfileSuccessMsg(t.savedSuccess);
      setTimeout(() => setProfileSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSubmitNewInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiryMessage.trim()) return;

    setIsSubmittingInquiry(true);
    const newInquiry: ClientInquiry = {
      id: `inq-cabinet-${Date.now()}`,
      referenceId: `SE-CAB-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: company || user.displayName || 'Client',
      contactPerson: user.displayName || 'Authorized User',
      email: user.email || '',
      phone: phone || '',
      projectCountry: newInquiryCountry,
      requiredSpecialists: [newInquiryProject],
      estimatedTimeline: 'Immediate / As per schedule',
      message: newInquiryMessage,
      files: [],
      createdAt: new Date().toISOString(),
      status: 'new',
      history: [
        {
          timestamp: new Date().toISOString(),
          actor: user.displayName || user.email || 'User',
          action: 'Inquiry created via Personal Cabinet'
        }
      ]
    };

    saveInquiry(newInquiry);
    onRefreshData();

    setIsSubmittingInquiry(false);
    setShowNewInquiryModal(false);
    setNewInquiryMessage('');
    setInquirySuccessAlert(true);
    setTimeout(() => setInquirySuccessAlert(false), 4000);
    setActiveTab('inquiries');
  };

  return (
    <div id="cabinet-page-container" className="min-h-screen bg-[#F8F9F6] pb-24 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* User Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#D5DED6] relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/50 via-[#EAF0E9]/30 to-transparent rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar with status dot */}
              <div className="relative">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-3 ring-[#123F32]/10 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#123F32] text-white flex items-center justify-center text-2xl font-bold uppercase shadow-sm">
                    {user.displayName ? user.displayName.charAt(0) : user.email?.charAt(0) || 'U'}
                  </div>
                )}
                <span
                  title="Online"
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#193E33]">
                    {user.displayName || 'Smarteura User'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.verifiedBadge}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#586B62] flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-[#123F32]" />
                  <span>{user.email}</span>
                </p>
                <p className="text-[11px] text-[#586B62]/80 mt-1 font-mono">
                  ID: <span className="text-[#193E33]">{user.uid.slice(0, 14)}...</span>
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowNewInquiryModal(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.newInquiryBtn}</span>
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                title={t.logoutBtn}
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logoutBtn}</span>
              </button>
            </div>
          </div>

          {/* Toast Alert for Inquiry Submission */}
          {inquirySuccessAlert && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Layihə sorğunuz qeydə alındı! Mühəndis heyətimiz 24 saat ərzində sizinlə əlaqə saxlayacaq.</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#D5DED6] mb-8 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#123F32] text-white shadow-xs'
                : 'text-[#586B62] hover:text-[#193E33] hover:bg-[#EAF0E9]'
            }`}
          >
            {t.overviewTab}
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inquiries'
                ? 'bg-[#123F32] text-white shadow-xs'
                : 'text-[#586B62] hover:text-[#193E33] hover:bg-[#EAF0E9]'
            }`}
          >
            <span>{t.inquiriesTab}</span>
            {userInquiries.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'inquiries' ? 'bg-white text-[#123F32]' : 'bg-[#123F32] text-white'
              }`}>
                {userInquiries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'applications'
                ? 'bg-[#123F32] text-white shadow-xs'
                : 'text-[#586B62] hover:text-[#193E33] hover:bg-[#EAF0E9]'
            }`}
          >
            <span>{t.applicationsTab}</span>
            {userApplications.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'applications' ? 'bg-white text-[#123F32]' : 'bg-[#123F32] text-white'
              }`}>
                {userApplications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#123F32] text-white shadow-xs'
                : 'text-[#586B62] hover:text-[#193E33] hover:bg-[#EAF0E9]'
            }`}
          >
            {t.profileTab}
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl p-6 border border-[#D5DED6] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#123F32] shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-[#193E33] block">
                    {userInquiries.length}
                  </span>
                  <span className="text-xs text-[#586B62] font-medium">
                    {t.totalInquiries}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#D5DED6] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-[#193E33] block">
                    {userApplications.length}
                  </span>
                  <span className="text-xs text-[#586B62] font-medium">
                    {t.totalApplications}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#D5DED6] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-emerald-700 block flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>OAuth 2.0 SSL</span>
                  </span>
                  <span className="text-xs text-[#586B62] font-medium">
                    {t.accountSecurity}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Contact Banner */}
            <div className="bg-gradient-to-r from-[#123F32] to-[#193E33] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Smarteura Industrial Network</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">
                  {t.quickContactTitle}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 leading-relaxed">
                  {t.quickContactDesc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowNewInquiryModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white text-[#123F32] hover:bg-emerald-50 text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  {t.newInquiryBtn}
                </button>
                <button
                  onClick={() => onNavigate('contacts')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors border border-white/20 cursor-pointer"
                >
                  Əlaqə Səhifəsi
                </button>
              </div>
            </div>

            {/* Recent Inquiries Snapshot */}
            <div className="bg-white rounded-2xl p-6 border border-[#D5DED6] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#193E33]">
                  {t.inquiriesTab}
                </h3>
                {userInquiries.length > 0 && (
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs font-semibold text-[#123F32] hover:underline flex items-center gap-1"
                  >
                    <span>Hamısına bax</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {userInquiries.length === 0 ? (
                <div className="text-center py-10 px-4 border border-dashed border-[#D5DED6] rounded-xl bg-[#F8F9F6]">
                  <FileText className="w-10 h-10 text-[#586B62]/40 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#193E33]">{t.noInquiriesTitle}</p>
                  <p className="text-xs text-[#586B62] mt-1 max-w-md mx-auto">{t.noInquiriesDesc}</p>
                  <button
                    onClick={() => setShowNewInquiryModal(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E] transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{t.createFirstInquiry}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userInquiries.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-[#D5DED6] bg-[#F8F9F6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-[#123F32]">
                            {item.referenceId}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {item.status === 'new' ? t.statusNew : item.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#193E33]">
                          {item.requiredSpecialists?.join(', ') || 'Industrial Inquiry'} • {item.projectCountry}
                        </p>
                        <p className="text-xs text-[#586B62] line-clamp-1 mt-0.5">
                          {item.message}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-[#586B62] shrink-0">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: My Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#193E33]">{t.inquiriesTab}</h2>
                <p className="text-xs text-[#586B62]">Smarteura komandasına göndərdiyiniz layihə tələbləri və sorğular</p>
              </div>
              <button
                onClick={() => setShowNewInquiryModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.newInquiryBtn}</span>
              </button>
            </div>

            {userInquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#D5DED6] shadow-xs">
                <FileText className="w-12 h-12 text-[#586B62]/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#193E33]">{t.noInquiriesTitle}</h3>
                <p className="text-xs text-[#586B62] mt-1 max-w-md mx-auto">{t.noInquiriesDesc}</p>
                <button
                  onClick={() => setShowNewInquiryModal(true)}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E] transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.createFirstInquiry}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userInquiries.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 border border-[#D5DED6] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs font-bold text-[#123F32] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {item.referenceId}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          {item.status === 'new' ? t.statusNew : item.status}
                        </span>
                        <span className="text-xs text-[#586B62] font-mono">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#193E33]">
                        {item.requiredSpecialists?.join(', ') || 'Industrial Inquiry'} ({item.projectCountry})
                      </h4>
                      <p className="text-xs sm:text-sm text-[#586B62] mt-1 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Mühəndis baxışında</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#193E33]">{t.applicationsTab}</h2>
                <p className="text-xs text-[#586B62]">Smarteura vakansiyalarına təqdim etdiyiniz müraciətlər</p>
              </div>
              <button
                onClick={() => onNavigate('career')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>{t.exploreVacancies}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {userApplications.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#D5DED6] shadow-xs">
                <Briefcase className="w-12 h-12 text-[#586B62]/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#193E33]">{t.noAppsTitle}</h3>
                <p className="text-xs text-[#586B62] mt-1 max-w-md mx-auto">{t.noAppsDesc}</p>
                <button
                  onClick={() => onNavigate('career')}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E] transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{t.exploreVacancies}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl p-6 border border-[#D5DED6] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs font-bold text-[#123F32] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {app.referenceId}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {app.status}
                        </span>
                        <span className="text-xs text-[#586B62] font-mono">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#193E33]">
                        {app.targetPosition || app.trade}
                      </h4>
                      <p className="text-xs text-[#586B62] mt-1">
                        Şəhər: {app.city}, {app.countryOfResidence} • Təcrübə: {app.experienceYears ? `${app.experienceYears} il` : 'Qeyd olunub'}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sistemdə Qeydiyyatdadır</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile & Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D5DED6] shadow-xs animate-in fade-in duration-200">
            <h2 className="text-lg font-bold text-[#193E33]">{t.profileTitle}</h2>
            <p className="text-xs text-[#586B62] mb-6">{t.profileDesc}</p>

            {profileSuccessMsg && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-[#193E33] mb-1.5">
                  Ad və Soyad
                </label>
                <input
                  type="text"
                  disabled
                  value={user.displayName || ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5DED6] bg-neutral-100 text-neutral-600 text-sm cursor-not-allowed"
                />
                <span className="text-[11px] text-[#586B62] mt-1 block">
                  Google hesabınızdan avtomatik gətirilir.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#193E33] mb-1.5">
                  Google Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5DED6] bg-neutral-100 text-neutral-600 text-sm cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#193E33] mb-1.5">
                  {t.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#586B62] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="+370 600 00000 / +994 50 000 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5DED6] bg-[#F8F9F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#123F32]/20 focus:border-[#123F32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#193E33] mb-1.5">
                  {t.companyLabel}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#586B62] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Şirkət və ya Layihə Müəssisəsi"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5DED6] bg-[#F8F9F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#123F32]/20 focus:border-[#123F32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#193E33] mb-1.5">
                  {t.notesLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder="Xüsusi mühəndislik tələbləri və ya layihə maraqları..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5DED6] bg-[#F8F9F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#123F32]/20 focus:border-[#123F32]"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Saxlanılır...' : t.saveChangesBtn}</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* New Project Inquiry Modal */}
      {showNewInquiryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowNewInquiryModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D5DED6] p-6 sm:p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#193E33]">{t.inquiryModalTitle}</h3>
                <p className="text-xs text-[#586B62]">{t.inquiryModalDesc}</p>
              </div>
              <button
                onClick={() => setShowNewInquiryModal(false)}
                className="p-1 rounded-lg text-[#586B62] hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewInquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#193E33] mb-1">
                  {t.projectName}
                </label>
                <select
                  value={newInquiryProject}
                  onChange={(e) => setNewInquiryProject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DED6] bg-[#F8F9F6] text-sm focus:outline-none focus:border-[#123F32]"
                >
                  <option value="Industrial Process Piping Installation">Industrial Process Piping Installation (Boru Montajı)</option>
                  <option value="Certified TIG / Orbital Welding">Certified TIG / Orbital Welding (Sertifikatlı Qaynaq)</option>
                  <option value="Mechanical Equipment & Skid Assembly">Mechanical Equipment & Skid Assembly (Avadanlıq Quraşdırma)</option>
                  <option value="Shipbuilding & Marine Fabrication">Shipbuilding & Marine Fabrication (Gəmiqayırma)</option>
                  <option value="Complete Turnkey Industrial Workforce">Turnkey Industrial Workforce (Kompleks Mühəndis Heyəti)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#193E33] mb-1">
                  {t.country}
                </label>
                <select
                  value={newInquiryCountry}
                  onChange={(e) => setNewInquiryCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DED6] bg-[#F8F9F6] text-sm focus:outline-none focus:border-[#123F32]"
                >
                  <option value="Lithuania">Lithuania (Litva)</option>
                  <option value="France">France (Fransa)</option>
                  <option value="Netherlands">Netherlands (Niderland)</option>
                  <option value="Germany">Germany (Almaniya)</option>
                  <option value="Belgium">Belgium (Belçika)</option>
                  <option value="Finland">Finland (Finlandiya)</option>
                  <option value="Sweden">Sweden (İsveç)</option>
                  <option value="Other Europe">Digər Avropa Ölkəsi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#193E33] mb-1">
                  {t.message}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Layihənizin miqyası, diametr və material növləri (məs. 316L, karbon polad), tələb olunan işçi sayı və müddət..."
                  value={newInquiryMessage}
                  onChange={(e) => setNewInquiryMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DED6] bg-[#F8F9F6] text-sm focus:outline-none focus:border-[#123F32]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewInquiryModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D5DED6] text-xs font-semibold text-[#586B62] hover:bg-neutral-50 cursor-pointer"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInquiry}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingInquiry ? 'Göndərilir...' : t.sendInquiryBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
