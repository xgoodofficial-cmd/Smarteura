export type Language = 'en' | 'lt' | 'fr' | 'nl' | 'tr';

export interface GalleryItem {
  id: string;
  title: Record<Language, string>;
  category: 'piping' | 'welding' | 'assembly' | 'installation' | 'shipyard';
  location: string;
  year: string;
  description: Record<Language, string>;
  imageUrl: string;
  tags: string[];
}

export interface Vacancy {
  id: string;
  title: Record<Language, string>;
  country: string;
  city: string;
  category: 'welding' | 'piping' | 'pipefitter' | 'assembly' | 'installation';
  type: string; // e.g., 'Full-time'
  description: Record<Language, string>;
  requirements: Record<Language, string[]>;
  benefits: Record<Language, string[]>;
  startDate: string;
  salary?: string;
  accommodationDetails?: Record<Language, string>;
  status: 'active' | 'draft' | 'closed';
  createdAt: string;
}

export interface CandidateApplication {
  id: string;
  referenceId: string;
  type: 'cv_upload' | 'structured_form';
  fullName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
  city: string;
  trade: string;
  targetPosition: string;
  experienceYears?: number;
  skills?: string[];
  languages?: string;
  preferredCountries?: string[];
  earliestStartDate?: string;
  hasWorkPermit?: boolean;
  workPermitCountry?: string;
  certificates?: string;
  additionalNotes?: string;
  cvFileName?: string;
  cvFileSize?: string;
  cvFileType?: string;
  futureConsent: boolean;
  appliedVacancyId?: string;
  appliedVacancyTitle?: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'contacted' | 'interview_scheduled' | 'archived';
  assignedTo?: string;
  internalNotes?: string;
  nextStep?: string;
  nextStepDate?: string;
  history: {
    timestamp: string;
    actor: string;
    action: string;
  }[];
}

export interface ClientInquiry {
  id: string;
  referenceId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  projectCountry: string;
  requiredSpecialists: string[];
  estimatedTimeline: string;
  message: string;
  files: {
    name: string;
    size: string;
    type: string;
  }[];
  createdAt: string;
  status: 'new' | 'analyzing' | 'in_contact' | 'proposal_sent' | 'archived';
  assignedTo?: string;
  internalNotes?: string;
  nextStep?: string;
  nextStepDate?: string;
  history: {
    timestamp: string;
    actor: string;
    action: string;
  }[];
}

export interface GeneralContactMessage {
  id: string;
  referenceId: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'resolved';
}

export interface ProjectItem {
  id: string;
  title: Record<Language, string>;
  country: string;
  city: string;
  serviceType: string;
  description: Record<Language, string>;
  imageUrl?: string;
  status: 'published' | 'draft' | 'hidden';
  year: string;
}

export interface NewsArticle {
  id: string;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  content: Record<Language, string>;
  imageUrl?: string;
  publishedAt: string;
  status: 'published' | 'draft' | 'hidden';
  tags: string[];
}

export interface SiteSettings {
  brandName: string;
  brandSlogan: string;
  establishedDate: string; // '2022-03-31T00:00:00+03:00'
  establishedYear: number;
  publicEmail: string;
  officeEmail: string;
  invoicesEmail: string;
  phone?: string; // empty by default until confirmed
  registrationCountry: string;
  registrationAddress?: string; // empty unless confirmed
  companyCode?: string;
  vatNumber?: string;
  socialLinks: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  presentationPdfs: Record<Language, { available: boolean; fileName?: string; url?: string }>;
}
