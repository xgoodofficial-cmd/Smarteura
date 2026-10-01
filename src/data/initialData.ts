import { Vacancy, NewsArticle, SiteSettings, CandidateApplication, ClientInquiry, GeneralContactMessage, ProjectItem, GalleryItem } from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'SMARTEURA',
  brandSlogan: 'Smarter European Industry',
  establishedDate: '2022-03-31T00:00:00+03:00', // Europe/Vilnius
  establishedYear: 2022,
  publicEmail: 'info@smarteura.eu',
  officeEmail: 'office@smarteura.eu',
  invoicesEmail: 'invoices@smarteura.eu',
  registrationCountry: 'Lithuania',
  phone: '+37066257387',
  registrationAddress: '', // Kept honest until officially confirmed
  companyCode: '',
  vatNumber: '',
  socialLinks: {
    linkedin: 'https://www.linkedin.com/company/smarteura',
    facebook: 'https://www.facebook.com/smarteura'
  },
  presentationPdfs: {
    en: { available: true, fileName: 'SMARTEURA_Company_Presentation_EN.pdf' },
    lt: { available: true, fileName: 'SMARTEURA_Imones_Pristatymas_LT.pdf' },
    fr: { available: true, fileName: 'SMARTEURA_Presentation_FR.pdf' },
    nl: { available: true, fileName: 'SMARTEURA_Bedrijfspresentatie_NL.pdf' },
    tr: { available: true, fileName: 'SMARTEURA_Sirket_Sunumu_TR.pdf' }
  }
};

export const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: 'vac-01',
    title: {
      en: 'TIG / Orbital Welder (Process Piping)',
      lt: 'TIG / Orbitalinis suvirintojas (Procesiniai vamzdynai)',
      fr: 'Soudeur TIG / Orbital (Tuyauterie de procédés)',
      nl: 'TIG / Orbitaallasser (Procesleidingen)',
      tr: 'TIG / Orbital Kaynakçı (Proses Borulama)'
    },
    country: 'Netherlands',
    city: 'Rotterdam Area',
    category: 'welding',
    type: 'Full-time / Project mobilization',
    description: {
      en: 'Precision welding of stainless steel and carbon steel process piping for energy and processing facilities. ISO 9606-1 certification required.',
      lt: 'Nerūdijančio ir anglinio plieno procesinių vamzdynų suvirinimas pramoniniuose objektuose. Būtinas galiojantis ISO 9606-1 sertifikatas.',
      fr: 'Soudage de précision de tuyauteries inox et acier carbone pour installations énergétiques et industrielles. Certificat ISO 9606-1 requis.',
      nl: 'Nauwkeurig lassen van RVS en koolstofstaal procesleidingen voor industriële installaties. ISO 9606-1 certificering vereist.',
      tr: 'Enerji ve proses tesisleri için paslanmaz ve karbon çeliği boru hatlarının hassas kaynağı. ISO 9606-1 sertifikası gereklidir.'
    },
    requirements: {
      en: ['Minimum 3 years certified welding experience', 'Valid ISO 9606-1 certification (FM1/FM5)', 'Ability to read isometric drawings', 'VCA / SCC safety passport preferred'],
      lt: ['Ne mažiau 3 metų sertifikuoto suvirintojo darbo patirtis', 'Galiojantis ISO 9606-1 sertifikatas', 'Izometrinių brėžinių skaitymas', 'VCA / SCC saugos sertifikatas (privalumas)'],
      fr: ['Au moins 3 ans d’expérience en soudage certifié', 'Certificat valide ISO 9606-1', 'Lecture de plans isométriques', 'Passeport sécurité VCA / SCC apprécié'],
      nl: ['Minimaal 3 jaar gecertificeerde laservaring', 'Geldig ISO 9606-1 certificaat', 'Kunnen lezen van isometrische tekeningen', 'VCA / SCC veiligheidspaspoort gewenst'],
      tr: ['En az 3 yıl sertifikalı kaynak tecrübesi', 'Geçerli ISO 9606-1 sertifikası (FM1/FM5)', 'İzometrik proje okuma yeteneği', 'VCA / SCC iş güvenliği pasaportu tercih sebebidir']
    },
    benefits: {
      en: ['Competitive European hourly rate', 'Organized travel and fully covered single-room accommodation', 'Premium PPE and work clothing supplied', 'Consistent European project pipeline'],
      lt: ['Konkurencingas europinis valandinis atlyginimas', 'Organizuotos kelionės ir apmokėtas apgyvendinimas', 'Aukščiausios kokybės darbo drabužiai ir AAP', 'Ilgalaikiai projektai Europoje'],
      fr: ['Rémunération européenne attractive', 'Trajets organisés et hébergement individuel pris en charge', 'Équipements de protection fournis', 'Continuité de missions en Europe'],
      nl: ['Concurrerend Europees uurtarief', 'Georganiseerd vervoer en verzorgde eenpersoonsaccommodatie', 'Kwalitatieve PBMs en werkkleding', 'Vervolgprojecten in heel Europa'],
      tr: ['Rekabetçi Avrupa saatlik ücreti', 'Organize ulaşım ve tek kişilik konaklama masrafları', 'Yüksek kaliteli iş kıyafeti ve KKD desteği', 'Kesintisiz Avrupa proje sürekliliği']
    },
    startDate: 'Flexible / Mobilizing every 2 weeks',
    status: 'active',
    createdAt: '2026-03-01'
  },
  {
    id: 'vac-02',
    title: {
      en: 'Industrial Pipefitter / Isometric Fitter',
      lt: 'Pramoninių vamzdynų montuotojas (Izometrija)',
      fr: 'Tuyauteur industriel / Tuyauteur isométrique',
      nl: 'Pijpfitter / Isometrisch monteur',
      tr: 'Endüstriyel Boru Montajcısı / İzometri Ustası'
    },
    country: 'Germany',
    city: 'North Rhine-Westphalia',
    category: 'piping',
    type: 'Full-time / Rotation basis',
    description: {
      en: 'Assembly, cold bending, tacking, and positioning of industrial piping systems from technical isometrics and P&ID diagrams.',
      lt: 'Pramoninių vamzdynų surinkimas, lenkimas, prikabinimas ir montavimas pagal izometrinius brėžinius bei technologines schemas.',
      fr: 'Préfabrication, pointage, cintrage et assemblage de tuyauteries industrielles d’après plans isométriques et schémas PID.',
      nl: 'Samenstellen, hechten en monteren van industriële leidingsystemen op basis van isometrische tekeningen en P&ID schema’s.',
      tr: 'Teknik izometrik çizimler ve P&ID diyagramlarına göre endüstriyel boru sistemlerinin soğuk bükümü, punta ve montajı.'
    },
    requirements: {
      en: ['4+ years of industrial pipefitting experience', 'Flawless isometric drawing comprehension', 'English or German working communication', 'Safety-first mindset on industrial plants'],
      lt: ['4+ metų patirtis vamzdynų montavimo srityje', 'Puikus izometrinių brėžinių skaitymas', 'Anglų arba vokiečių kalbos pagrindai', 'Griežtas saugos reikalavimų laikymasis'],
      fr: ['4+ ans d’expérience en tuyauterie industrielle', 'Maîtrise complète de la lecture de plans isométriques', 'Anglais ou allemand technique', 'Respect rigoureux des règles de sécurité'],
      nl: ['4+ jaar ervaring als industrieel pijpfitter', 'Uitstekend ruimtelijk en isometrisch inzicht', 'Basis Engels of Duits', 'Strikte naleving van veiligheidsnormen'],
      tr: ['4+ yıl endüstriyel boru montajı tecrübesi', 'Kusursuz izometrik çizim okuma bilgisi', 'İngilizce veya Almanca mesleki iletişim', 'Endüstriyel tesislerde güvenlik odaklı çalışma disiplini']
    },
    benefits: {
      en: ['Rotational work schedule with paid return flights', 'Modern tools and calibrated alignment instruments', 'Guaranteed working hours per week', 'Professional career advancement'],
      lt: ['Rotacinis darbo grafikas su apmokėtomis kelionėmis', 'Šiuolaikiški darbo įrankiai ir lygiavimo įranga', 'Garantuotos savaitinės darbo valandos', 'Kvalifikacijos kėlimo galimybės'],
      fr: ['Rythme de rotation avec billets aller-retour pris en charge', 'Outillage moderne et instruments d’alignement', 'Volume horaire hebdomadaire garanti', 'Perspectives d’évolution'],
      nl: ['Rotatieschema met vergoede reiskosten', 'Modern gereedschap en meetapparatuur', 'Gegarandeerd urenpakket per week', 'Doorgroeimogelijkheden'],
      tr: ['Gidiş-dönüş uçak biletli rotasyonlu çalışma planı', 'Modern el aletleri ve kalibre ölçüm cihazları', 'Haftalık garantili çalışma saati', 'Mesleki gelişim ve kariyer fırsatı']
    },
    startDate: 'Immediate / Next rotation',
    status: 'active',
    createdAt: '2026-03-05'
  },
  {
    id: 'vac-03',
    title: {
      en: 'Mechanical Installation Assembler',
      lt: 'Mechaninės įrangos montuotojas',
      fr: 'Monteur mécanicien d’équipements industriels',
      nl: 'Monteur industriële mechanica',
      tr: 'Mekanik Montaj ve Ekipman Kurulum Ustası'
    },
    country: 'France',
    city: 'Normandy / Hauts-de-France',
    category: 'assembly',
    type: 'Full-time project',
    description: {
      en: 'Mechanical erection, laser alignment, torqueing, and commissioning support for industrial machinery, pumps, gearboxes, and conveyor lines.',
      lt: 'Mechaninis montavimas, lazerinis lygiavimas, dinamometrinis veržimas ir paleidimo-derinimo palaikymas pramoniniams agregatams, siurbliams ir linijoms.',
      fr: 'Montage mécanique, lignage laser, serrage au couple et assistance aux essais pour machines industrielles, pompes et convoyeurs.',
      nl: 'Mechanische opbouw, laseruitlijning, aanhaalkoppel-controle en inbedrijfstellingsondersteuning voor machines, pompen en transportlijnen.',
      tr: 'Endüstriyel makineler, pompalar, redüktörler ve konveyör hatlarının mekanik montajı, lazer hizalaması ve devreye alma desteği.'
    },
    requirements: {
      en: ['Technical vocational education in mechanics', 'Experience with shaft alignment and industrial drive systems', 'Valid safety passport', 'Valid driver’s license (B)'],
      lt: ['Mechaniko arba šaltkalvio išsilavinimas', 'Patirtis lygiavimo ir pramoninių pavarų montavimo srityje', 'Saugos sertifikatas', 'Vairuotojo pažymėjimas (B kat.)'],
      fr: ['Formation technique en mécanique industrielle', 'Expérience en lignage d’arbres et réducteurs', 'Passeport sécurité à jour', 'Permis B'],
      nl: ['MBO Werktuigbouwkunde of gelijkwaardig', 'Ervaring met asuitlijning en aandrijvingen', 'Veiligheidscertificaat', 'Rijbewijs B'],
      tr: ['Mekanik alanında mesleki teknik eğitim', 'Şaft hizalama ve endüstriyel tahrik sistemlerinde tecrübe', 'Geçerli iş güvenliği sertifikası', 'Geçerli B sınıfı sürücü belgesi']
    },
    benefits: {
      en: ['Direct European contract', 'Private housing near site', 'Paid travel allowance', 'Comprehensive insurance coverage'],
      lt: ['Tiesioginis europinis kontraktas', 'Atskiras būstas šalia objekto', 'Kompensuojamos kelionės išlaidos', 'Pilnas sveikatos draudimas'],
      fr: ['Contrat européen direct', 'Logement de qualité à proximité du chantier', 'Indemnités de déplacement', 'Couverture d’assurance complète'],
      nl: ['Direct Europees contract', 'Prettige huisvesting nabij projectlocatie', 'Reiskostenvergoeding', 'Uitstekende verzekeringsdekking'],
      tr: ['Doğrudan Avrupa resmi iş sözleşmesi', 'Şantiye yakınında konforlu konaklama', 'Yol ve seyahat harcırahı desteği', 'Kapsamlı sağlık ve iş sigortası']
    },
    startDate: 'Scheduled for next month',
    status: 'active',
    createdAt: '2026-03-10'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-01',
    title: {
      en: 'European Industrial Mobilization Protocols for 2026',
      lt: 'Europos pramoninės mobilizacijos protokolai 2026 m.',
      fr: 'Protocoles de mobilisation industrielle européenne pour 2026',
      nl: 'Europese industriële mobilisatieprotocollen voor 2026',
      tr: '2026 Avrupa Endüstriyel Mobilizasyon ve Güvenlik Protokolleri'
    },
    excerpt: {
      en: 'Smarteura reinforces compliance, certified safety guidelines, and rapid-dispatch logistics across our active European industrial worksites.',
      lt: 'Smarteura stiprina saugos standartų atitiktį, sertifikavimą ir operatyvią brigadų logistiką Europos pramonės objektuose.',
      fr: 'Smarteura renforce ses normes de conformité, de sécurité certifiée et de logistique de déploiement sur ses chantiers européens.',
      nl: 'Smarteura versterkt naleving van veiligheidsnormen, certificeringen en snelle inzetlogistiek op Europese projectlocaties.',
      tr: 'Smarteura, aktif Avrupa endüstriyel şantiyelerimizde yasal uyumluluk, sertifikalı güvenlik standartları ve hızlı lojistik intikalini güçlendiriyor.'
    },
    content: {
      en: 'As part of our commitment to engineering discipline and safety, Smarteura has updated our standardized European mobilization playbook. This ensures all welders, fitters, and mechanical teams arrive on-site with verified certifications (ISO 9606, VCA/SCC), calibrated tooling, and pre-cleared documentation.',
      lt: 'Siekdama užtikrinti aukščiausią inžinerinę drausmę ir saugą, Smarteura atnaujino Europos mobilizacijos gaires. Tai garantuoja, kad visi suvirintojai, montuotojai ir mechanikai į objektus atvyksta su patvirtintais sertifikatais (ISO 9606, VCA/SCC) bei kalibruotais įrankiais.',
      fr: 'Dans le cadre de son engagement pour la rigueur technique et la sécurité, Smarteura actualise ses protocoles de déploiement en Europe. Chaque soudeur, tuyauteur et mécanicien est mobilisé avec des qualifications vérifiées (ISO 9606, VCA/SCC) et un équipement contrôlé.',
      nl: 'In het kader van onze toewijding aan technische discipline en veiligheid heeft Smarteura haar Europese inzetprotocollen geactualiseerd. Dit waarborgt dat lassers, fitters en monteurs met getoetste certificaten (ISO 9606, VCA/SCC) en goedgekeurd materieel arriveren.',
      tr: 'Mühendislik disiplini ve iş güvenliğine olan bağlılığımızın bir parçası olarak Smarteura, standartlaştırılmış Avrupa mobilizasyon kılavuzunu güncelledi. Bu sayede tüm kaynakçılarımız, boru montajcılarımız ve mekanik teknisyenlerimiz şantiyelere onaylı sertifikalar (ISO 9606, VCA/SCC), kalibre edilmiş takım çantaları ve tam yasal belgelerle intikal etmektedir.'
    },
    publishedAt: '2026-09-01',
    status: 'published',
    tags: ['Safety', 'Mobilization', 'Standards']
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-01',
    category: 'welding',
    location: 'Rotterdam, Netherlands',
    year: '2025',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80',
    title: {
      en: 'Orbital & TIG Cleanroom Piping Welds',
      lt: 'Orbitalinis ir TIG procesinių vamzdynų suvirinimas',
      fr: 'Soudage orbital et TIG de tuyauteries de haute pureté',
      nl: 'Orbitaal- en TIG-lassen van procesleidingen',
      tr: 'Orbital ve TIG Yüksek Saflıkta Proses Boru Kaynağı'
    },
    description: {
      en: 'Certified TIG welding on high-purity stainless steel 316L pipelines for industrial processing under 100% radiographic inspection.',
      lt: 'Sertifikuotas TIG suvirinimas nerūdijančio plieno 316L vamzdynuose su 100% radiografine (RT) siūlių patikra.',
      fr: 'Soudage TIG certifié sur tuyauteries inox 316L avec contrôle radiographique 100% conforme aux normes EN ISO.',
      nl: 'Gecertificeerd TIG-lassen op RVS 316L leidingen met 100% radiografische controle volgens EN ISO.',
      tr: 'Endüstriyel proses tesisleri için 316L paslanmaz çelik hatlarda %100 röntgen (RT) kontrollü sertifikalı TIG kaynak uygulaması.'
    },
    tags: ['TIG / 141', 'ISO 9606-1', 'Stainless 316L', 'NDT / X-Ray']
  }
];

// Helper Storage Keys
const STORAGE_KEYS = {
  SETTINGS: 'smarteura_settings',
  VACANCIES: 'smarteura_vacancies',
  APPLICATIONS: 'smarteura_applications',
  INQUIRIES: 'smarteura_inquiries',
  CONTACT_MESSAGES: 'smarteura_contact_messages',
  PROJECTS: 'smarteura_projects',
  GALLERY: 'smarteura_gallery',
  NEWS: 'smarteura_news',
  ADMIN_SESSION: 'smarteura_admin_session'
};

export const getStoredSettings = (): SiteSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      const parsed: SiteSettings = JSON.parse(raw);
      if (!parsed.phone || parsed.phone.trim().length === 0) {
        parsed.phone = '+37066257387';
      }
      if (!parsed.socialLinks) {
        parsed.socialLinks = { ...INITIAL_SETTINGS.socialLinks };
      } else if (!parsed.socialLinks.facebook) {
        parsed.socialLinks.facebook = 'https://www.facebook.com/smarteura';
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load settings from storage', e);
  }
  return INITIAL_SETTINGS;
};

export const saveStoredSettings = (settings: SiteSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const getStoredVacancies = (): Vacancy[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VACANCIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load vacancies from storage', e);
  }
  return INITIAL_VACANCIES;
};

export const saveStoredVacancies = (vacancies: Vacancy[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.VACANCIES, JSON.stringify(vacancies));
  } catch (e) {
    console.error('Failed to save vacancies', e);
  }
};

export const getStoredApplications = (): CandidateApplication[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load applications', e);
  }
  return [];
};

export const saveApplication = (app: CandidateApplication) => {
  try {
    const current = getStoredApplications();
    const updated = [app, ...current];
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save application', e);
    return [];
  }
};

export const updateApplication = (id: string, updates: Partial<CandidateApplication>) => {
  try {
    const current = getStoredApplications();
    const updated = current.map((item) => {
      if (item.id === id) {
        const historyEntry = {
          timestamp: new Date().toISOString(),
          actor: 'Admin',
          action: `Updated: ${Object.keys(updates).join(', ')}`
        };
        return {
          ...item,
          ...updates,
          history: [...(item.history || []), historyEntry]
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update application', e);
    return [];
  }
};

export const getStoredInquiries = (): ClientInquiry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load inquiries', e);
  }
  return [];
};

export const saveInquiry = (inq: ClientInquiry) => {
  try {
    const current = getStoredInquiries();
    const updated = [inq, ...current];
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save inquiry', e);
    return [];
  }
};

export const updateInquiry = (id: string, updates: Partial<ClientInquiry>) => {
  try {
    const current = getStoredInquiries();
    const updated = current.map((item) => {
      if (item.id === id) {
        const historyEntry = {
          timestamp: new Date().toISOString(),
          actor: 'Admin',
          action: `Updated: ${Object.keys(updates).join(', ')}`
        };
        return {
          ...item,
          ...updates,
          history: [...(item.history || []), historyEntry]
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update inquiry', e);
    return [];
  }
};

export const getStoredContactMessages = (): GeneralContactMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load contact messages', e);
  }
  return [];
};

export const saveContactMessage = (msg: GeneralContactMessage) => {
  try {
    const current = getStoredContactMessages();
    const updated = [msg, ...current];
    localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save message', e);
    return [];
  }
};

export const getStoredProjects = (): ProjectItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) {
      const parsed: ProjectItem[] = JSON.parse(raw);
      const deletedIds = ['proj-01', 'proj-02'];
      const filtered = parsed.filter((p) => !deletedIds.includes(p.id));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
      return filtered;
    }
  } catch (e) {
    console.error('Failed to load projects', e);
  }
  return INITIAL_PROJECTS;
};

export const saveStoredProjects = (projects: ProjectItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects', e);
  }
};

export const getStoredNews = (): NewsArticle[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NEWS);
    if (raw) {
      const parsed: NewsArticle[] = JSON.parse(raw);
      return parsed.map((item) => (item.id === 'news-01' && item.publishedAt === '2026-02-15' ? { ...item, publishedAt: '2026-09-01' } : item));
    }
  } catch (e) {
    console.error('Failed to load news', e);
  }
  return INITIAL_NEWS;
};

export const saveStoredNews = (news: NewsArticle[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  } catch (e) {
    console.error('Failed to save news', e);
  }
};

const GALLERY_UPDATED_IMAGES: Record<string, string> = {
  'gal-01': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80'
};

export const getStoredGallery = (): GalleryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (raw) {
      const parsed: GalleryItem[] = JSON.parse(raw);
      const deletedIds = ['gal-02', 'gal-03', 'gal-04', 'gal-05', 'gal-06', 'gal-07', 'gal-08'];
      const updated = parsed
        .filter((item) => !deletedIds.includes(item.id))
        .map((item) => {
          if (GALLERY_UPDATED_IMAGES[item.id]) {
            return { ...item, imageUrl: GALLERY_UPDATED_IMAGES[item.id] };
          }
          return item;
        });
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));
      return updated;
    }
  } catch (e) {
    console.error('Failed to load gallery', e);
  }
  return INITIAL_GALLERY;
};

export const saveStoredGallery = (gallery: GalleryItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  } catch (e) {
    console.error('Failed to save gallery', e);
  }
};

