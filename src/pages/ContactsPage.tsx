import React, { useState } from 'react';
import {
  Mail,
  Building2,
  Phone,
  FileText,
  Upload,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  X,
  FileCheck
} from 'lucide-react';
import { Language, SiteSettings, ClientInquiry, GeneralContactMessage } from '../types';
import { translations } from '../data/translations';
import { saveInquiry, saveContactMessage } from '../data/initialData';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ContactsPageProps {
  lang: Language;
  settings: SiteSettings;
  onRefreshData?: () => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({
  lang,
  settings,
  onRefreshData
}) => {
  const t = translations[lang].contacts;
  const [formMode, setFormMode] = useState<'client' | 'general'>('client');

  // General Form State
  const [genName, setGenName] = useState('');
  const [genCompany, setGenCompany] = useState('');
  const [genEmail, setGenEmail] = useState('');
  const [genPhone, setGenPhone] = useState('');
  const [genMessage, setGenMessage] = useState('');
  const [isSubmittingGen, setIsSubmittingGen] = useState(false);
  const [genSuccessRef, setGenSuccessRef] = useState<string | null>(null);

  // Client Inquiry Form State
  const [clientCompany, setClientCompany] = useState('');
  const [clientContactPerson, setClientContactPerson] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCountry, setClientCountry] = useState('');
  const [clientSpecialists, setClientSpecialists] = useState('');
  const [clientTimeline, setClientTimeline] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [clientFiles, setClientFiles] = useState<File[]>([]);
  const [clientFileError, setClientFileError] = useState<string | null>(null);
  const [isSubmittingClient, setIsSubmittingClient] = useState(false);
  const [clientSuccessRef, setClientSuccessRef] = useState<string | null>(null);

  // Multi-file handler (Section 23)
  const handleClientFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientFileError(null);
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB per file

    for (const f of filesArray) {
      if (f.size > MAX_SIZE) {
        setClientFileError(`File "${f.name}" exceeds the 10 MB limit.`);
        return;
      }
    }

    setClientFiles((prev) => [...prev, ...filesArray]);
  };

  const removeClientFile = (idx: number) => {
    setClientFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit General Message
  const handleSubmitGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genName.trim() || !genEmail.trim() || !genMessage.trim()) {
      alert('Please fill the mandatory fields (Name, Email, Message).');
      return;
    }

    setIsSubmittingGen(true);

    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const referenceId = `SM-MSG-${new Date().getFullYear()}-${randomNum}`;

      const newMsg: GeneralContactMessage = {
        id: `msg-${Date.now()}`,
        referenceId,
        name: genName.trim(),
        company: genCompany.trim() || undefined,
        email: genEmail.trim(),
        phone: genPhone.trim() || undefined,
        message: genMessage.trim(),
        createdAt: new Date().toISOString(),
        status: 'new'
      };

      saveContactMessage(newMsg);
      if (onRefreshData) onRefreshData();

      setIsSubmittingGen(false);
      setGenSuccessRef(referenceId);

      // Reset form
      setGenName('');
      setGenCompany('');
      setGenEmail('');
      setGenPhone('');
      setGenMessage('');
    }, 500);
  };

  // Submit Client Project Inquiry
  const handleSubmitClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompany.trim() || !clientContactPerson.trim() || !clientEmail.trim() || !clientCountry.trim()) {
      alert('Please provide Company name, Contact person, Email, and Project Country.');
      return;
    }

    setIsSubmittingClient(true);

    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const referenceId = `SM-INQ-${new Date().getFullYear()}-${randomNum}`;

      const newInquiry: ClientInquiry = {
        id: `inq-${Date.now()}`,
        referenceId,
        companyName: clientCompany.trim(),
        contactPerson: clientContactPerson.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim() || undefined,
        projectCountry: clientCountry.trim(),
        requiredSpecialists: clientSpecialists ? clientSpecialists.split(',').map((s) => s.trim()) : [],
        estimatedTimeline: clientTimeline.trim(),
        message: clientMessage.trim(),
        files: clientFiles.map((f) => ({
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
          type: f.type || 'document'
        })),
        createdAt: new Date().toISOString(),
        status: 'new',
        history: [
          {
            timestamp: new Date().toISOString(),
            actor: 'Client Portal',
            action: 'Project inquiry registered'
          }
        ]
      };

      saveInquiry(newInquiry);

      // Async sync to Firebase Firestore
      try {
        setDoc(doc(db, 'client_inquiries', newInquiry.id), newInquiry).catch((err) => {
          console.warn('Firestore inquiry sync note:', err);
        });
      } catch (err) {
        console.warn('Firestore write warning:', err);
      }

      if (onRefreshData) onRefreshData();

      setIsSubmittingClient(false);
      setClientSuccessRef(referenceId);

      // Reset form
      setClientCompany('');
      setClientContactPerson('');
      setClientEmail('');
      setClientPhone('');
      setClientCountry('');
      setClientSpecialists('');
      setClientTimeline('');
      setClientMessage('');
      setClientFiles([]);
    }, 700);
  };

  return (
    <div id="contacts-page-container" className="py-12 md:py-20 bg-[#F8F9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#123F32]">
            Communication & Inquiries
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#193E33] mt-2 mb-4">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-[#586B62] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Verified Channels */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-[#D5DED6] p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-bold text-[#193E33] mb-4 pb-3 border-b border-[#D5DED6]">
                {t.publicEmails}
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#586B62] font-semibold block">
                    {t.emailInquiries}
                  </span>
                  <a
                    href={`mailto:${settings.publicEmail}`}
                    className="inline-flex items-center gap-2 font-mono font-bold text-sm text-[#123F32] hover:underline mt-0.5"
                  >
                    <Mail className="w-4 h-4 text-[#96B5A1]" />
                    <span>{settings.publicEmail}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#586B62] font-semibold block">
                    {t.emailOffice}
                  </span>
                  <a
                    href={`mailto:${settings.officeEmail}`}
                    className="inline-flex items-center gap-2 font-mono font-bold text-sm text-[#123F32] hover:underline mt-0.5"
                  >
                    <Mail className="w-4 h-4 text-[#96B5A1]" />
                    <span>{settings.officeEmail}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#586B62] font-semibold block">
                    {t.emailInvoices}
                  </span>
                  <a
                    href={`mailto:${settings.invoicesEmail}`}
                    className="inline-flex items-center gap-2 font-mono font-bold text-sm text-[#123F32] hover:underline mt-0.5"
                  >
                    <Mail className="w-4 h-4 text-[#96B5A1]" />
                    <span>{settings.invoicesEmail}</span>
                  </a>
                </div>

                {/* Section 21: Phone only if set */}
                {settings.phone && settings.phone.trim().length > 0 ? (
                  <div className="pt-2 border-t border-[#D5DED6]">
                    <span className="text-[11px] uppercase tracking-wider text-[#586B62] font-semibold block">
                      Direct Telephone
                    </span>
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 font-mono font-bold text-sm text-[#123F32] hover:underline mt-0.5"
                    >
                      <Phone className="w-4 h-4 text-[#96B5A1]" />
                      <span>{settings.phone}</span>
                    </a>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#D5DED6] text-[11px] text-[#586B62] italic">
                    {t.phoneNotice}
                  </div>
                )}
              </div>
            </div>

            {/* Corporate Hub Info */}
            <div className="bg-[#EAF0E9] rounded-2xl border border-[#D5DED6] p-6 text-xs text-[#193E33]">
              <div className="flex items-center gap-2 font-bold mb-2 text-[#123F32]">
                <Building2 className="w-4 h-4" />
                <span>UAB Smarteura</span>
              </div>
              <p className="text-[#586B62] leading-relaxed mb-3">
                Registered in the Republic of Lithuania on March 31, 2022. Serving industrial projects across the European Union.
              </p>
              <div className="text-[11px] font-semibold text-[#123F32]">
                Established in Lithuania · 2022
              </div>
            </div>
          </div>

          {/* Right: Dual Interactive Form Tabs */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-[#D5DED6] p-6 sm:p-10 shadow-xs">
              {/* Form Switcher */}
              <div className="flex border-b border-[#D5DED6] mb-8">
                <button
                  type="button"
                  onClick={() => setFormMode('client')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
                    formMode === 'client'
                      ? 'border-[#123F32] text-[#123F32]'
                      : 'border-transparent text-[#586B62] hover:text-[#193E33]'
                  }`}
                >
                  {t.clientTitle}
                </button>

                <button
                  type="button"
                  onClick={() => setFormMode('general')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
                    formMode === 'general'
                      ? 'border-[#123F32] text-[#123F32]'
                      : 'border-transparent text-[#586B62] hover:text-[#193E33]'
                  }`}
                >
                  {t.generalTitle}
                </button>
              </div>

              {/* Mode 1: Client Project Inquiry (Section 11 & 23) */}
              {formMode === 'client' && (
                <div>
                  {clientSuccessRef ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 rounded-full bg-[#EAF0E9] text-[#123F32] flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#193E33] mb-2">
                        {t.successHeading}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#586B62] max-w-md mx-auto mb-6">
                        {t.successSubheading}
                      </p>

                      <div className="p-4 rounded-xl bg-[#F8F9F6] border border-[#D5DED6] max-w-xs mx-auto mb-6 text-left">
                        <span className="text-[10px] uppercase font-bold text-[#586B62] tracking-wider block">
                          {t.referenceNumber}:
                        </span>
                        <strong className="text-lg font-mono font-bold text-[#123F32] block">
                          {clientSuccessRef}
                        </strong>
                        <span className="text-[11px] text-[#586B62] block mt-1">
                          Log status: Received & Stored
                        </span>
                      </div>

                      <button
                        onClick={() => setClientSuccessRef(null)}
                        className="px-5 py-2 rounded-xl bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E]"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitClient} className="space-y-4">
                      <p className="text-xs text-[#586B62] mb-4">
                        {t.clientSubtitle}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.company} *
                          </label>
                          <input
                            type="text"
                            required
                            value={clientCompany}
                            onChange={(e) => setClientCompany(e.target.value)}
                            placeholder="Industrial Client BV / GmbH / SAS"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.contactPerson} *
                          </label>
                          <input
                            type="text"
                            required
                            value={clientContactPerson}
                            onChange={(e) => setClientContactPerson(e.target.value)}
                            placeholder="Project Manager Name"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.email} *
                          </label>
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="pm@company.com"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.phoneOptional}
                          </label>
                          <input
                            type="tel"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="+49 ..."
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.projectCountry} *
                          </label>
                          <input
                            type="text"
                            required
                            value={clientCountry}
                            onChange={(e) => setClientCountry(e.target.value)}
                            placeholder="e.g. France / Netherlands / Germany"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.timeline}
                          </label>
                          <input
                            type="text"
                            value={clientTimeline}
                            onChange={(e) => setClientTimeline(e.target.value)}
                            placeholder="e.g. 3 months starting Q3"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#193E33] mb-1">
                          {t.specialistsNeeded}
                        </label>
                        <input
                          type="text"
                          value={clientSpecialists}
                          onChange={(e) => setClientSpecialists(e.target.value)}
                          placeholder="e.g. 4x TIG Welders (ISO 9606-1), 2x Pipefitters"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#193E33] mb-1">
                          {t.message}
                        </label>
                        <textarea
                          rows={4}
                          value={clientMessage}
                          onChange={(e) => setClientMessage(e.target.value)}
                          placeholder="Detailed specifications, scope of piping, welding requirements or site conditions..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                        />
                      </div>

                      {/* Section 23: Technical Document & Drawing Uploads */}
                      <div className="pt-2">
                        <label className="block text-xs font-semibold text-[#193E33] mb-1">
                          {t.uploadDrawings}
                        </label>
                        <span className="block text-[11px] text-[#586B62] mb-2">
                          {t.uploadDrawingsHint}
                        </span>

                        <div className="border border-dashed border-[#D5DED6] rounded-xl p-4 bg-[#F8F9F6]">
                          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#D5DED6] text-xs font-semibold text-[#193E33] hover:bg-[#EAF0E9] cursor-pointer">
                            <Upload className="w-3.5 h-3.5 text-[#123F32]" />
                            <span>Add Drawing / Specification File</span>
                            <input
                              type="file"
                              multiple
                              onChange={handleClientFiles}
                              className="hidden"
                            />
                          </label>

                          {clientFileError && (
                            <p className="text-xs text-red-600 mt-2 font-medium">{clientFileError}</p>
                          )}

                          {clientFiles.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {clientFiles.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 rounded-md bg-white border border-[#D5DED6] text-xs"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <FileCheck className="w-4 h-4 text-[#123F32] shrink-0" />
                                    <span className="font-medium truncate text-[#193E33]">{file.name}</span>
                                    <span className="text-[10px] text-[#586B62]">
                                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeClientFile(idx)}
                                    className="text-[#586B62] hover:text-red-600 p-1"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmittingClient}
                          className="px-6 py-3 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmittingClient ? 'Registering Inquiry...' : t.submitClient}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Mode 2: General Contact Form (Section 10) */}
              {formMode === 'general' && (
                <div>
                  {genSuccessRef ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 rounded-full bg-[#EAF0E9] text-[#123F32] flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#193E33] mb-2">
                        {t.successHeading}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#586B62] max-w-md mx-auto mb-6">
                        {t.successSubheading}
                      </p>

                      <div className="p-4 rounded-xl bg-[#F8F9F6] border border-[#D5DED6] max-w-xs mx-auto mb-6 text-left">
                        <span className="text-[10px] uppercase font-bold text-[#586B62] tracking-wider block">
                          {t.referenceNumber}:
                        </span>
                        <strong className="text-lg font-mono font-bold text-[#123F32] block">
                          {genSuccessRef}
                        </strong>
                      </div>

                      <button
                        onClick={() => setGenSuccessRef(null)}
                        className="px-5 py-2 rounded-xl bg-[#123F32] text-white text-xs font-semibold hover:bg-[#25664E]"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitGeneral} className="space-y-4">
                      <p className="text-xs text-[#586B62] mb-4">
                        {t.generalSubtitle}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.name} *
                          </label>
                          <input
                            type="text"
                            required
                            value={genName}
                            onChange={(e) => setGenName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.company}
                          </label>
                          <input
                            type="text"
                            value={genCompany}
                            onChange={(e) => setGenCompany(e.target.value)}
                            placeholder="Company or Organization"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.email} *
                          </label>
                          <input
                            type="email"
                            required
                            value={genEmail}
                            onChange={(e) => setGenEmail(e.target.value)}
                            placeholder="your.email@domain.com"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#193E33] mb-1">
                            {t.phoneOptional}
                          </label>
                          <input
                            type="tel"
                            value={genPhone}
                            onChange={(e) => setGenPhone(e.target.value)}
                            placeholder="+370 ..."
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#193E33] mb-1">
                          {t.message} *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={genMessage}
                          onChange={(e) => setGenMessage(e.target.value)}
                          placeholder="Your message, collaboration proposition, or administrative inquiry..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#D5DED6] text-xs text-[#193E33] focus:outline-hidden focus:border-[#123F32]"
                        />
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmittingGen}
                          className="px-6 py-3 rounded-xl bg-[#123F32] hover:bg-[#25664E] text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmittingGen ? 'Sending...' : t.submitGeneral}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
