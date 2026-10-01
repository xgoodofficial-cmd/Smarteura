import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle2,
  Upload,
  FileCheck,
  X,
  Shield,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Language, Vacancy, CandidateApplication } from '../types';
import { translations } from '../data/translations';
import { saveApplication } from '../data/initialData';
import { db, getCachedAccessToken } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { uploadFileToDrive } from '../lib/workspace';

interface CareerPageProps {
  lang: Language;
  vacancies: Vacancy[];
  onRefreshData?: () => void;
}

export const CareerPage: React.FC<CareerPageProps> = ({
  lang,
  vacancies,
  onRefreshData
}) => {
  const t = translations[lang].career;

  const [tradeFilter, setTradeFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  // Application modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [activeTab, setActiveTab] = useState<'quick_upload' | 'structured'>('quick_upload');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCity, setCountryCity] = useState('');
  const [trade, setTrade] = useState('');
  const [targetPosition, setTargetPosition] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | undefined>(undefined);
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState('');
  const [preferredCountries, setPreferredCountries] = useState('');
  const [earliestStartDate, setEarliestStartDate] = useState('');
  const [hasWorkPermit, setHasWorkPermit] = useState<boolean>(true);
  const [workPermitCountry, setWorkPermitCountry] = useState('EU');
  const [certificates, setCertificates] = useState('');
  const [notes, setNotes] = useState('');
  const [futureConsent, setFutureConsent] = useState(true);

  // File state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceId: string;
    fullName: string;
    date: string;
  } | null>(null);

  // Filter active vacancies
  const activeVacancies = vacancies.filter((v) => v.status === 'active');

  const filteredVacancies = activeVacancies.filter((v) => {
    const matchTrade =
      tradeFilter === 'all' ||
      v.category === tradeFilter ||
      (tradeFilter === 'pipefitter' && (v.category === 'piping' || (v.category as string) === 'pipefitter' || JSON.stringify(v.title).toLowerCase().includes('pipefitter'))) ||
      (tradeFilter === 'piping' && (v.category === 'piping' || (v.category as string) === 'pipefitter'));
    const matchCountry = countryFilter === 'all' || v.country.toLowerCase() === countryFilter.toLowerCase();
    return matchTrade && matchCountry;
  });

  const availableCountries = Array.from(new Set(activeVacancies.map((v) => v.country)));

  // File handling with strict 10MB limit and format validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedExtensions.includes(fileExt)) {
      setFileError('Only PDF, DOC, or DOCX files are permitted.');
      return;
    }

    // 10 MB max: 10 * 1024 * 1024 bytes
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError('File exceeds 10 MB limit. Please upload a smaller file.');
      return;
    }

    setCvFile(file);
  };

  const handleOpenApplication = (vacancy: Vacancy | null) => {
    setSelectedVacancy(vacancy);
    if (vacancy) {
      setTrade(vacancy.category);
      setTargetPosition(vacancy.title[lang] || vacancy.title.en);
    } else {
      setTrade('');
      setTargetPosition('');
    }
    setSubmissionSuccess(null);
    setFileError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVacancy(null);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill all mandatory contact fields (Full Name, Email, Phone).');
      return;
    }

    if (activeTab === 'quick_upload' && !cvFile) {
      setFileError('Please attach your CV document (PDF, DOC, DOCX up to 10 MB).');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(20);

    // Simulate reliable secure progress
    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(progressTimer);
      setUploadProgress(100);

      // Generate verifiable Unique Reference ID
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const referenceId = `SM-CV-${new Date().getFullYear()}-${randomPart}`;

      const newApp: CandidateApplication = {
        id: `app-${Date.now()}`,
        referenceId,
        type: activeTab === 'quick_upload' ? 'cv_upload' : 'structured_form',
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        countryOfResidence: countryCity.trim(),
        city: '',
        trade: trade || 'General',
        targetPosition: targetPosition || (selectedVacancy ? selectedVacancy.title[lang] : 'General Inquiry'),
        experienceYears: experienceYears,
        skills: skills ? skills.split(',').map((s) => s.trim()) : [],
        languages,
        preferredCountries: preferredCountries ? preferredCountries.split(',').map((c) => c.trim()) : [],
        earliestStartDate,
        hasWorkPermit,
        workPermitCountry: hasWorkPermit ? workPermitCountry : undefined,
        certificates,
        additionalNotes: notes,
        cvFileName: cvFile ? cvFile.name : undefined,
        cvFileSize: cvFile ? `${(cvFile.size / (1024 * 1024)).toFixed(2)} MB` : undefined,
        cvFileType: cvFile ? cvFile.type : undefined,
        futureConsent,
        appliedVacancyId: selectedVacancy ? selectedVacancy.id : undefined,
        appliedVacancyTitle: selectedVacancy ? selectedVacancy.title[lang] : undefined,
        createdAt: new Date().toISOString(),
        status: 'new',
        history: [
          {
            timestamp: new Date().toISOString(),
            actor: 'System',
            action: 'Application received via portal'
          }
        ]
      };

      saveApplication(newApp);

      // Async sync to Firebase Firestore
      try {
        setDoc(doc(db, 'candidate_applications', newApp.id), newApp).catch((err) => {
          console.warn('Firestore candidate sync note:', err);
        });
      } catch (err) {
        console.warn('Firestore write warning:', err);
      }

      // If authorized with Google Drive, upload CV automatically
      const driveToken = getCachedAccessToken();
      if (driveToken && cvFile) {
        uploadFileToDrive(driveToken, cvFile).catch((err) => {
          console.warn('Drive automatic CV sync note:', err);
        });
      }

      if (onRefreshData) onRefreshData();

      setIsSubmitting(false);
      setSubmissionSuccess({
        referenceId,
        fullName: fullName.trim(),
        date: new Date().toLocaleDateString()
      });

      // Clear form inputs
      setFullName('');
      setEmail('');
      setPhone('');
      setCvFile(null);
    }, 800);
  };

  return (
    <div id="career-page-container" className="py-12 md:py-20 bg-[#F8F9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#123F32]">
              Join Smarteura
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#193E33] mt-2 mb-4">
              {t.title}
            </h1>
            <p className="text-base sm:text-lg text-[#586B62] leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <button
              onClick={() => handleOpenApplication(null)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>{t.sendGeneralCv}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#D5DED6] p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#193E33]">
            <Filter className="w-4 h-4 text-[#123F32]" />
            <span>Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Trade Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#586B62]">{t.filterTrade}:</span>
              <select
                value={tradeFilter}
                onChange={(e) => setTradeFilter(e.target.value)}
                className="bg-[#F8F9F6] border border-[#D5DED6] rounded-lg px-3 py-1.5 text-xs text-[#193E33] font-medium focus:outline-hidden focus:border-[#123F32]"
              >
                <option value="all">{t.allTrades}</option>
                <option value="welding">Welding</option>
                <option value="piping">Industrial Piping</option>
                <option value="pipefitter">Pipefitter</option>
                <option value="assembly">Mechanical Assembly</option>
                <option value="installation">Equipment Installation</option>
              </select>
            </div>

            {/* Country Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#586B62]">{t.filterCountry}:</span>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-[#F8F9F6] border border-[#D5DED6] rounded-lg px-3 py-1.5 text-xs text-[#193E33] font-medium focus:outline-hidden focus:border-[#123F32]"
              >
                <option value="all">{t.allCountries}</option>
                {availableCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vacancies List */}
        {filteredVacancies.length > 0 ? (
          <div className="space-y-6 mb-16">
            {filteredVacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                id={`vacancy-item-${vacancy.id}`}
                className="bg-white rounded-2xl border border-[#D5DED6] p-6 sm:p-8 shadow-xs hover:border-[#123F32] transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#D5DED6]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#EAF0E9] text-[#123F32] text-xs font-semibold uppercase tracking-wider">
                        {vacancy.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-[#F8F9F6] border border-[#D5DED6] text-[#586B62] text-xs font-medium">
                        {vacancy.type}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#193E33]">
                      {vacancy.title[lang] || vacancy.title.en}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#586B62] mt-2">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#96B5A1]" />
                        <span>{vacancy.city}, {vacancy.country}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#96B5A1]" />
                        <span>Mobilization: {vacancy.startDate}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenApplication(vacancy)}
                      className="px-5 py-2.5 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {t.applyNow}
                    </button>
                  </div>
                </div>

                {/* Description & Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs text-[#586B62]">
                  <div>
                    <h3 className="font-semibold text-[#193E33] mb-2 uppercase tracking-wider text-[11px]">
                      Requirements & Profile:
                    </h3>
                    <ul className="space-y-1.5">
                      {(vacancy.requirements[lang] || vacancy.requirements.en).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#123F32] mt-1.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#123F32] mb-2 uppercase tracking-wider text-[11px]">
                      Package & Logistics:
                    </h3>
                    <ul className="space-y-1.5">
                      {(vacancy.benefits[lang] || vacancy.benefits.en).map((ben, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#123F32] mt-0.5 shrink-0" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#D5DED6] p-10 text-center max-w-xl mx-auto mb-16">
            <Briefcase className="w-10 h-10 text-[#96B5A1] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#193E33] mb-2">
              {t.noVacancies}
            </h3>
            <p className="text-xs sm:text-sm text-[#586B62] mb-6">
              {t.noVacanciesSub}
            </p>
            <button
              onClick={() => handleOpenApplication(null)}
              className="px-5 py-2.5 rounded-xl bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E]"
            >
              {t.sendGeneralCv}
            </button>
          </div>
        )}

        {/* Section 12 Privacy & GDPR Protection Banner */}
        <div className="p-6 rounded-2xl bg-white border border-[#D5DED6] text-xs text-[#586B62] flex items-start gap-4">
          <Shield className="w-5 h-5 text-[#123F32] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-[#193E33] block">Candidate Data Security & Privacy:</strong>
            <p className="leading-relaxed">
              {t.confidentialNotice} Passports, identity card photos, and bank credentials are never requested during initial candidate evaluation. To request deletion of your records, contact us at privacy@smarteura.eu or info@smarteura.eu.
            </p>
          </div>
        </div>
      </div>

      {/* Application Modal (Section 12: Dual Mode - Quick CV or Structured Form) */}
      {isModalOpen && (
        <div
          id="application-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            id="application-modal"
            className="bg-white rounded-2xl border border-[#D5DED6] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl relative"
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-lg text-[#586B62] hover:text-[#193E33] hover:bg-[#F8F9F6]"
            >
              <X className="w-5 h-5" />
            </button>

            {submissionSuccess ? (
              /* Success Screen (Section 18) */
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[#EAF0E9] text-[#123F32] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[#193E33] mb-2">
                  {t.successTicket}
                </h2>
                <p className="text-sm text-[#586B62] max-w-md mx-auto mb-6">
                  {t.successMessage}
                </p>

                <div className="p-4 rounded-xl bg-[#F8F9F6] border border-[#D5DED6] max-w-xs mx-auto mb-6 text-left">
                  <span className="text-[10px] uppercase font-bold text-[#586B62] tracking-wider block">
                    Unique Application Reference ID:
                  </span>
                  <strong className="text-lg font-mono font-bold text-[#123F32] block">
                    {submissionSuccess.referenceId}
                  </strong>
                  <span className="text-[11px] text-[#586B62] block mt-1">
                    Candidate: {submissionSuccess.fullName}
                  </span>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E]"
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Application Form */
              <div>
                <div className="mb-6 pr-8">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#123F32]">
                    {selectedVacancy ? 'Job Application' : 'General Candidate Application'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#193E33] mt-1">
                    {selectedVacancy ? (selectedVacancy.title[lang] || selectedVacancy.title.en) : 'Submit Your CV / Resume'}
                  </h2>
                </div>

                {/* Tabs: Quick Upload vs Structured Form */}
                <div className="flex border-b border-[#D5DED6] mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('quick_upload')}
                    className={`pb-3 px-4 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                      activeTab === 'quick_upload'
                        ? 'border-[#123F32] text-[#123F32]'
                        : 'border-transparent text-[#586B62] hover:text-[#193E33]'
                    }`}
                  >
                    {t.uploadTab}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('structured')}
                    className={`pb-3 px-4 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                      activeTab === 'structured'
                        ? 'border-[#123F32] text-[#123F32]'
                        : 'border-transparent text-[#586B62] hover:text-[#193E33]'
                    }`}
                  >
                    {t.formTab}
                  </button>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  {/* Basic Mandatory Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#193E33] mb-1">
                        {t.fullName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#193E33] mb-1">
                        {t.email} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="candidate@example.com"
                        className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#193E33] mb-1">
                        {t.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+370 600 00000"
                        className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#193E33] mb-1">
                        {t.countryCity}
                      </label>
                      <input
                        type="text"
                        value={countryCity}
                        onChange={(e) => setCountryCity(e.target.value)}
                        placeholder="Vilnius, Lithuania"
                        className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                      />
                    </div>
                  </div>

                  {/* Tab 1: Quick CV Upload (Section 12 Requirements) */}
                  {activeTab === 'quick_upload' && (
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-[#193E33] mb-1">
                        {t.uploadTitle} *
                      </label>
                      <div className="border-2 border-dashed border-[#D5DED6] rounded-xl p-5 text-center bg-[#F8F9F6]">
                        {cvFile ? (
                          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#D5DED6]">
                            <div className="flex items-center gap-2 text-left">
                              <FileCheck className="w-5 h-5 text-[#123F32]" />
                              <div>
                                <span className="block text-xs font-bold text-[#193E33] truncate max-w-xs">
                                  {cvFile.name}
                                </span>
                                <span className="text-[10px] text-[#586B62]">
                                  {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCvFile(null)}
                              className="text-xs text-red-600 hover:underline cursor-pointer"
                            >
                              {t.removeFile}
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 text-[#96B5A1] mx-auto mb-2" />
                            <p className="text-xs text-[#193E33] font-medium mb-1">
                              {t.uploadFormats}
                            </p>
                            <label className="inline-block mt-2 px-4 py-2 rounded-lg bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold cursor-pointer">
                              <span>{t.selectFile}</span>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                        {fileError && (
                          <p className="text-xs text-red-600 mt-2 font-medium">{fileError}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Detailed Structured Form */}
                  {activeTab === 'structured' && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.trade}
                          </label>
                          <input
                            type="text"
                            value={trade}
                            onChange={(e) => setTrade(e.target.value)}
                            placeholder="e.g. TIG Welder / Pipefitter"
                            className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.experienceYears}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={experienceYears || ''}
                            onChange={(e) => setExperienceYears(e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="e.g. 5"
                            className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#193E33] mb-1">
                          {t.skills}
                        </label>
                        <input
                          type="text"
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          placeholder="e.g. Stainless steel, isometric reading, laser alignment"
                          className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.languages}
                          </label>
                          <input
                            type="text"
                            value={languages}
                            onChange={(e) => setLanguages(e.target.value)}
                            placeholder="e.g. English (B1), Lithuanian (Native)"
                            className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.earliestStartDate}
                          </label>
                          <input
                            type="text"
                            value={earliestStartDate}
                            onChange={(e) => setEarliestStartDate(e.target.value)}
                            placeholder="Immediate / Next month"
                            className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#193E33] mb-1">
                          {t.workPermit}
                        </label>
                        <div className="flex items-center gap-4 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="workPermit"
                              checked={hasWorkPermit}
                              onChange={() => setHasWorkPermit(true)}
                              className="accent-[#123F32]"
                            />
                            <span>{t.workPermitYes}</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="workPermit"
                              checked={!hasWorkPermit}
                              onChange={() => setHasWorkPermit(false)}
                              className="accent-[#123F32]"
                            />
                            <span>{t.workPermitNo}</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#193E33] mb-1">
                          {t.certificates}
                        </label>
                        <input
                          type="text"
                          value={certificates}
                          onChange={(e) => setCertificates(e.target.value)}
                          placeholder="ISO 9606, VCA/SCC, Flange certificate"
                          className="w-full px-3.5 py-2 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Future openings voluntary consent (Section 12) */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-[#586B62] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={futureConsent}
                        onChange={(e) => setFutureConsent(e.target.checked)}
                        className="mt-0.5 accent-[#123F32]"
                      />
                      <span>{t.futureConsent}</span>
                    </label>
                  </div>

                  {/* Progress indicator during upload */}
                  {isSubmitting && (
                    <div className="pt-2">
                      <div className="w-full bg-[#EAF0E9] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#123F32] h-2 transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#586B62] block mt-1">
                        {t.uploading} ({uploadProgress}%)
                      </span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-[#D5DED6] flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 rounded-lg border border-[#D5DED6] text-xs font-semibold text-[#586B62] hover:bg-[#F8F9F6]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 rounded-lg bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {t.submitApplication}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
