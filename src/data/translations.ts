import { Language } from '../types';

export interface TranslationDictionary {
  nav: {
    services: string;
    projects: string;
    gallery: string;
    career: string;
    about: string;
    news: string;
    contacts: string;
    discussProject: string;
    adminPanel: string;
  };
  hero: {
    slogan: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badge: string;
  };
  liveCounter: {
    title: string;
    subtitle: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    establishedText: string;
  };
  services: {
    title: string;
    subtitle: string;
    mainPiping: string;
    mainPipingDesc: string;
    mainWelding: string;
    mainWeldingDesc: string;
    mainAssembly: string;
    mainAssemblyDesc: string;
    mainInstallation: string;
    mainInstallationDesc: string;
    additionalTitle: string;
    additionalPiping: string;
    additionalPipingDesc: string;
    additionalStructures: string;
    additionalStructuresDesc: string;
    additionalMarine: string;
    additionalMarineDesc: string;
    honestNotice: string;
  };
  workersClients: {
    workersTitle: string;
    workersText: string;
    workersBtnVacancies: string;
    workersBtnCv: string;
    clientsTitle: string;
    clientsText: string;
    clientsBtnDiscuss: string;
  };
  projects: {
    title: string;
    subtitle: string;
    noProjectsNotice: string;
    statusInPrep: string;
    filterAll: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterPiping: string;
    filterWelding: string;
    filterAssembly: string;
    filterInstallation: string;
    filterShipyard: string;
    viewPhoto: string;
    closeModal: string;
    projectLocation: string;
    yearCompleted: string;
  };
  career: {
    title: string;
    subtitle: string;
    openVacancies: string;
    filterTrade: string;
    filterCountry: string;
    allTrades: string;
    allCountries: string;
    applyNow: string;
    details: string;
    noVacancies: string;
    noVacanciesSub: string;
    sendGeneralCv: string;
    formTab: string;
    uploadTab: string;
    uploadTitle: string;
    uploadDesc: string;
    uploadFormats: string;
    fullName: string;
    email: string;
    phone: string;
    countryCity: string;
    trade: string;
    targetPosition: string;
    experienceYears: string;
    skills: string;
    languages: string;
    preferredCountries: string;
    earliestStartDate: string;
    workPermit: string;
    workPermitYes: string;
    workPermitNo: string;
    certificates: string;
    notes: string;
    futureConsent: string;
    submitApplication: string;
    uploading: string;
    successTicket: string;
    successMessage: string;
    confidentialNotice: string;
    selectFile: string;
    changeFile: string;
    removeFile: string;
  };
  contacts: {
    title: string;
    subtitle: string;
    generalTitle: string;
    generalSubtitle: string;
    clientTitle: string;
    clientSubtitle: string;
    name: string;
    company: string;
    email: string;
    phoneOptional: string;
    message: string;
    contactPerson: string;
    projectCountry: string;
    specialistsNeeded: string;
    timeline: string;
    uploadDrawings: string;
    uploadDrawingsHint: string;
    submitGeneral: string;
    submitClient: string;
    publicEmails: string;
    emailInquiries: string;
    emailOffice: string;
    emailInvoices: string;
    phoneNotice: string;
    successHeading: string;
    successSubheading: string;
    referenceNumber: string;
  };
  about: {
    title: string;
    subtitle: string;
    historyTitle: string;
    historyText: string;
    marketsTitle: string;
    marketsText: string;
    downloadPresentation: string;
    presentationDesc: string;
    noPresentationNotice: string;
    factsTitle: string;
  };
  news: {
    title: string;
    subtitle: string;
    readMore: string;
    backToNews: string;
    noNews: string;
  };
  footer: {
    established: string;
    rights: string;
    quickLinks: string;
    contacts: string;
    social: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      services: 'Services',
      projects: 'Projects',
      gallery: 'Gallery',
      career: 'Career',
      about: 'About us',
      news: 'News',
      contacts: 'Contacts',
      discussProject: 'Discuss your project',
      adminPanel: 'Management'
    },
    hero: {
      slogan: 'Smarter European Industry',
      title: 'Precision Industrial Assembly & Welding Across Europe',
      subtitle: 'Supporting major European industrial, piping, and mechanical projects with certified, dependable teams from Lithuania to across the continent.',
      ctaPrimary: 'Discuss your project',
      ctaSecondary: 'Explore Services',
      badge: 'Established in Lithuania · 2022'
    },
    liveCounter: {
      title: 'Growing together',
      subtitle: 'Continuous active presence and team readiness since founding in Lithuania',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      establishedText: 'Established in Lithuania · 2022'
    },
    services: {
      title: 'Industrial & Mechanical Services',
      subtitle: 'High-standard execution by certified European teams in demanding industrial environments.',
      mainPiping: 'Industrial Piping',
      mainPipingDesc: 'Fabrication, fitting, and alignment of industrial piping networks complying with EN and ISO standards.',
      mainWelding: 'Welding',
      mainWeldingDesc: 'TIG, MIG/MAG, and MMA welding carried out by verified specialists for pressure and structural applications.',
      mainAssembly: 'Mechanical Assembly',
      mainAssemblyDesc: 'Precision installation and alignment of structural modules, heavy components, and mechanical lines.',
      mainInstallation: 'Industrial Equipment Installation',
      mainInstallationDesc: 'Turnkey positioning, leveling, and mechanical hook-up of industrial machinery and processing units.',
      additionalTitle: 'Additional Capabilities',
      additionalPiping: 'Process Piping for Food, Pharma & Chemical',
      additionalPipingDesc: 'Hygienic and high-purity stainless steel process pipe systems with stringent weld quality inspection.',
      additionalStructures: 'Metal Structures Assembly',
      additionalStructuresDesc: 'Erection of structural steel frameworks, industrial catwalks, platforms, and pipe racks.',
      additionalMarine: 'Shipbuilding & Marine Assembly',
      additionalMarineDesc: 'Hull fitting, deck piping, and marine mechanical repairs on international dockyard projects.',
      honestNotice: 'Specific project scope, technical specifications, and contracting terms are defined individually per customer project agreement.'
    },
    workersClients: {
      workersTitle: 'Build your next chapter with Smarteura.',
      workersText: 'Bring your skills to industrial projects across Europe. Explore opportunities in welding, pipe fitting and mechanical installation, or send us your CV for future openings. Pay, travel, accommodation and development opportunities are detailed in each vacancy.',
      workersBtnVacancies: 'View vacancies',
      workersBtnCv: 'Send your CV',
      clientsTitle: 'The right team for your next project.',
      clientsText: 'Planning a shipbuilding or industrial project? Smarteura provides skilled welders, pipefitters and mechanical assemblers to support your work. Tell us your requirements, location and schedule so we can discuss the right team for your project.',
      clientsBtnDiscuss: 'Discuss your project'
    },
    projects: {
      title: 'Project Portfolio',
      subtitle: 'Verified industrial project references across our core European markets.',
      noProjectsNotice: 'Confirmed project case studies are currently being curated for publication. In accordance with Smarteura standards, only company-verified technical details are displayed.',
      statusInPrep: 'Documentation in preparation',
      filterAll: 'All Disciplines'
    },
    gallery: {
      title: 'Industrial & Site Gallery',
      subtitle: 'Visual proof of certified piping, orbital welding, and mechanical installation across European worksites.',
      filterAll: 'All Works',
      filterPiping: 'Process Piping',
      filterWelding: 'Certified Welding',
      filterAssembly: 'Mechanical Assembly',
      filterInstallation: 'Equipment Installation',
      filterShipyard: 'Shipyard & Maritime',
      viewPhoto: 'View Details',
      closeModal: 'Close',
      projectLocation: 'Location',
      yearCompleted: 'Period'
    },
    career: {
      title: 'Careers & Opportunities',
      subtitle: 'Join certified industrial teams on dynamic European sites with transparent terms.',
      openVacancies: 'Open Vacancies',
      filterTrade: 'Filter by Trade',
      filterCountry: 'Filter by Country',
      allTrades: 'All Trades',
      allCountries: 'All Countries',
      applyNow: 'Apply for this position',
      details: 'View Details',
      noVacancies: 'No open vacancies currently listed',
      noVacanciesSub: 'You are welcome to submit your CV directly. We review applications for upcoming European mobilizations.',
      sendGeneralCv: 'Submit General Application',
      formTab: 'Fill structured application form',
      uploadTab: 'Upload ready CV file (Quick)',
      uploadTitle: 'Upload Your Resume / CV',
      uploadDesc: 'Quickly submit your resume. PDF, DOC, or DOCX formats accepted up to 10 MB.',
      uploadFormats: 'Accepted files: PDF, DOC, DOCX (Max: 10 MB)',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      countryCity: 'Country & City of Residence',
      trade: 'Primary Trade / Specialty',
      targetPosition: 'Desired Position',
      experienceYears: 'Years of Experience',
      skills: 'Technical Skills & Qualifications',
      languages: 'Languages & Proficiency',
      preferredCountries: 'Preferred Work Countries',
      earliestStartDate: 'Earliest Available Start Date',
      workPermit: 'EU Work Permit / Citizenship Status',
      workPermitYes: 'Valid EU Work Permit / EU Citizen',
      workPermitNo: 'Requires Work Visa Sponsorship',
      certificates: 'Certificates (e.g. ISO 9606, VCA, SCC)',
      notes: 'Additional Notes or Availability',
      futureConsent: 'I consent to Smarteura retaining my application for future job openings.',
      submitApplication: 'Submit Application',
      uploading: 'Uploading securely...',
      successTicket: 'Application Received',
      successMessage: 'Thank you for your application. Your submission has been securely recorded.',
      confidentialNotice: 'Confidentiality note: CVs and personal data are stored in protected storage accessible solely to authorized Smarteura recruitment personnel.',
      selectFile: 'Select CV File',
      changeFile: 'Change File',
      removeFile: 'Remove'
    },
    contacts: {
      title: 'Get in Touch',
      subtitle: 'Reach our team for project inquiries, collaboration, or administrative contact.',
      generalTitle: 'General Contact Form',
      generalSubtitle: 'For general inquiries and partnership messages.',
      clientTitle: 'Client Project Inquiry',
      clientSubtitle: 'Discuss specific project scope, team requirements, and project timeline.',
      name: 'Your Name',
      company: 'Company Name',
      email: 'Email Address',
      phoneOptional: 'Phone (Optional)',
      message: 'Message / Project Description',
      contactPerson: 'Contact Person',
      projectCountry: 'Project Country / Location',
      specialistsNeeded: 'Required Specialists (e.g., TIG Welders, Pipefitters)',
      timeline: 'Expected Schedule & Timeline',
      uploadDrawings: 'Attach Technical Drawings or Specifications (Multiple)',
      uploadDrawingsHint: 'PDF, DWG, DXF, ZIP, DOCX up to 10 MB each. Stored securely.',
      submitGeneral: 'Send General Message',
      submitClient: 'Submit Project Inquiry',
      publicEmails: 'Official Corporate Emails',
      emailInquiries: 'General inquiries & clients',
      emailOffice: 'Administrative office',
      emailInvoices: 'Invoices & accounting',
      phoneNotice: 'Official direct telephone lines will be displayed once designated.',
      successHeading: 'Inquiry Successfully Submitted',
      successSubheading: 'Your inquiry has been logged in our secure system.',
      referenceNumber: 'Reference ID'
    },
    about: {
      title: 'About SMARTEURA',
      subtitle: 'Smarter European Industry — established in Lithuania, serving European industrial sectors.',
      historyTitle: 'Corporate Background',
      historyText: 'UAB Smarteura was legally incorporated in Lithuania on March 31, 2022. Built on engineering rigor and craftsmanship, we support industrial piping, welding, and mechanical projects across Europe.',
      marketsTitle: 'Key European Markets',
      marketsText: 'Our teams mobilize across Lithuania, France, the Netherlands, and Germany, providing responsive staffing and technical support.',
      downloadPresentation: 'Download Company Presentation (PDF)',
      presentationDesc: 'Download our comprehensive overview covering services, capabilities, and industrial standards.',
      noPresentationNotice: 'The company presentation PDF in this language is currently being finalized.',
      factsTitle: 'Verified Facts'
    },
    news: {
      title: 'News & Updates',
      subtitle: 'Verified announcements and technical updates from Smarteura.',
      readMore: 'Read Announcement',
      backToNews: 'Back to all updates',
      noNews: 'No news announcements published at this time.'
    },
    footer: {
      established: 'Established in Lithuania · 2022',
      rights: '© UAB Smarteura',
      quickLinks: 'Quick Links',
      contacts: 'Contact Channels',
      social: 'Connect With Us'
    }
  },

  lt: {
    nav: {
      services: 'Paslaugos',
      projects: 'Projektai',
      gallery: 'Galerija',
      career: 'Karjera',
      about: 'Apie mus',
      news: 'Naujienos',
      contacts: 'Kontaktai',
      discussProject: 'Aptarkite savo projektą',
      adminPanel: 'Valdymas'
    },
    hero: {
      slogan: 'Smarter European Industry',
      title: 'Pramoninis surinkimas ir suvirinimas visoje Europoje',
      subtitle: 'Palaikome stambius Europos pramonės, vamzdynų ir mechanikos projektus su patikimomis, sertifikuotomis komandomis iš Lietuvos.',
      ctaPrimary: 'Aptarkite savo projektą',
      ctaSecondary: 'Mūsų paslaugos',
      badge: 'Lietuvoje įkurta · 2022'
    },
    liveCounter: {
      title: 'Augame kartu',
      subtitle: 'Nuolatinis aktyvus dalyvavimas ir komandos pasirengimas nuo įkūrimo Lietuvoje',
      days: 'Dienos',
      hours: 'Valandos',
      minutes: 'Minutės',
      seconds: 'Sekundės',
      establishedText: 'Lietuvoje įkurta · 2022'
    },
    services: {
      title: 'Pramoninės ir mechaninės paslaugos',
      subtitle: 'Aukščiausius standartus atitinkantis kvalifikuotų Europos komandų darbas reikliose pramonės aplinkose.',
      mainPiping: 'Pramoninių vamzdynų montavimas',
      mainPipingDesc: 'Pramoninių vamzdynų tinklų gamyba, montavimas ir suderinimas pagal EN ir ISO standartus.',
      mainWelding: 'Suvirinimo darbai',
      mainWeldingDesc: 'TIG, MIG/MAG ir MMA suvirinimas, atliekamas patvirtintų specialistų slėginėms ir konstrukcinėms sistemoms.',
      mainAssembly: 'Mechaninis surinkimas',
      mainAssemblyDesc: 'Tvirtų konstrukcinių modulių, sunkiosios įrangos ir gamybinių linijų surinkimas ir montavimas.',
      mainInstallation: 'Pramoninės įrangos montavimas',
      mainInstallationDesc: 'Gamybos įrenginių, agregatų ir technologinių linijų pozicionavimas, lygiavimas ir mechaninis prijungimas.',
      additionalTitle: 'Papildomos veiklos kryptys',
      additionalPiping: 'Procesiniai vamzdynai maisto, chemijos ir farmacijos pramonei',
      additionalPipingDesc: 'Higieniniai nerūdijančio plieno procesiniai vamzdynai su griežta suvirinimo siūlių kontrole.',
      additionalStructures: 'Metalo konstrukcijų surinkimas ir montavimas',
      additionalStructuresDesc: 'Pramoninių plieno konstrukcijų, estakadų, aptarnavimo aikštelių ir vamzdžių stovų montavimas.',
      additionalMarine: 'Glaudus darbas laivų statyboje ir remonte',
      additionalMarineDesc: 'Korpusų surinkimas, denio vamzdynai ir mechaniniai darbai tarptautinėse laivų statyklose.',
      honestNotice: 'Konkretus darbų mastas, techninės specifikacijos ir sąlygos derinamos individualiai kiekvienam projektui.'
    },
    workersClients: {
      workersTitle: 'Build your next chapter with Smarteura.',
      workersText: 'Prisijunkite prie pramoninių projektų visoje Europoje. Išnaudokite savo suvirinimo, vamzdynų montavimo ir mechaninio surinkimo įgūdžius arba atsiųskite CV būsimiems projektams. Užmokestis, kelionės, apgyvendinimas ir tobulėjimo galimybės nurodytos kiekviename skelbime.',
      workersBtnVacancies: 'Peržiūrėti vakansijas',
      workersBtnCv: 'Atsiųsti CV',
      clientsTitle: 'The right team for your next project.',
      clientsText: 'Planuojate laivų statybos ar pramoninį projektą? Smarteura suteikia kvalifikuotus suvirintojus, vamzdynų montuotojus ir mechaninio surinkimo specialistus jūsų darbams. Nurodykite reikalavimus, vietą ir tvarkaraštį, kad galėtume aptarti tinkamą komandą.',
      clientsBtnDiscuss: 'Aptarkite savo projektą'
    },
    projects: {
      title: 'Projektų apžvalga',
      subtitle: 'Patvirtinti pramoninių projektų pavyzdžiai pagrindinėse Europos rinkose.',
      noProjectsNotice: 'Patvirtinta projektų medžiaga šiuo metu ruošiama publikavimui. Pagal Smarteura standartus skelbiami tik oficialiai patvirtinti techniniai duomenys.',
      statusInPrep: 'Dokumentacija ruošiama',
      filterAll: 'Visos sritys'
    },
    gallery: {
      title: 'Darbų ir objektų galerija',
      subtitle: 'Sertifikuoto pramoninių vamzdynų montavimo, orbitalinio suvirinimo ir mechaninio surinkimo fotofiksacija Europos objektuose.',
      filterAll: 'Visi darbai',
      filterPiping: 'Procesiniai vamzdynai',
      filterWelding: 'Aukšto lygio suvirinimas',
      filterAssembly: 'Mechaninis surinkimas',
      filterInstallation: 'Įrangos montavimas',
      filterShipyard: 'Laivų statyba ir remontas',
      viewPhoto: 'Peržiūrėti',
      closeModal: 'Uždaryti',
      projectLocation: 'Vieta',
      yearCompleted: 'Laikotarpis'
    },
    career: {
      title: 'Karjera ir galimybės',
      subtitle: 'Prisijunkite prie sertifikuotų komandų Europos pramonės projektuose su aiškiomis sąlygomis.',
      openVacancies: 'Atviros darbo vietos',
      filterTrade: 'Filtruoti pagal profesiją',
      filterCountry: 'Filtruoti pagal šalį',
      allTrades: 'Visos profesijos',
      allCountries: 'Visos šalys',
      applyNow: 'Kandidatuoti',
      details: 'Išsamiau',
      noVacancies: 'Šiuo metu atvirų vakansijų nėra',
      noVacanciesSub: 'Kviečiame pateikti savo CV bendrajai atrankai būsimiems Europos projektams.',
      sendGeneralCv: 'Siųsti bendrą CV',
      formTab: 'Pildyti anketą svetainėje',
      uploadTab: 'Įkelti paruoštą CV failą (Greita)',
      uploadTitle: 'Įkelkite savo gyvenimo aprašymą (CV)',
      uploadDesc: 'Greitas CV pateikimas. Priimami PDF, DOC arba DOCX formatai iki 10 MB.',
      uploadFormats: 'Priimami failai: PDF, DOC, DOCX (Maks. 10 MB)',
      fullName: 'Vardas ir pavardė',
      email: 'El. paštas',
      phone: 'Telefono numeris',
      countryCity: 'Gyvenamoji šalis ir miestas',
      trade: 'Pagrindinė profesija',
      targetPosition: 'Pageidaujama pareigybė',
      experienceYears: 'Patirtis (metais)',
      skills: 'Techniniai įgūdžiai',
      languages: 'Kalbos ir lygiai',
      preferredCountries: 'Pageidaujamos darbo šalys',
      earliestStartDate: 'Anksčiausia pradžios data',
      workPermit: 'ES darbo leidimas / pilietybė',
      workPermitYes: 'Galiojantis ES leidimas / ES pilietis',
      workPermitNo: 'Reikalinga darbo viza',
      certificates: 'Sertifikatai (pvz. ISO 9606, VCA, SCC)',
      notes: 'Papildomi komentarai',
      futureConsent: 'Sutinku, kad Smarteura išsaugotų mano duomenis būsimoms atrankoms.',
      submitApplication: 'Pateikti kandidatūrą',
      uploading: 'Saugiai įkeliama...',
      successTicket: 'Kandidatūra gauta',
      successMessage: 'Dėkojame! Jūsų kandidatūra saugiai užregistruota sistemoje.',
      confidentialNotice: 'Privatumo garantas: CV ir asmens duomenys saugomi apsaugotoje sistemoje, prieinamoje tik įgaliotam personalui.',
      selectFile: 'Pasirinkti CV failą',
      changeFile: 'Pakeisti failą',
      removeFile: 'Pašalinti'
    },
    contacts: {
      title: 'Susisiekite su mumis',
      subtitle: 'Kreipkitės dėl projektų, bendradarbiavimo ar administracinių klausimų.',
      generalTitle: 'Bendra susisiekimo forma',
      generalSubtitle: 'Bendriems klausimams ir partnerystės užklausoms.',
      clientTitle: 'Kliento projekto užklausa',
      clientSubtitle: 'Projektų apimčių, komandos poreikių ir terminų aptarimui.',
      name: 'Jūsų vardas',
      company: 'Įmonės pavadinimas',
      email: 'El. pašto adresas',
      phoneOptional: 'Telefonas (neprivaloma)',
      message: 'Žinutė / projekto aprašymas',
      contactPerson: 'Kontaktinis asmuo',
      projectCountry: 'Projekto šalis / vieta',
      specialistsNeeded: 'Reikalingi specialistai (pvz., TIG suvirintojai, montuotojai)',
      timeline: 'Numatytas grafikas ir terminai',
      uploadDrawings: 'Pridėti brėžinius ar technines specifikacijas (keli failai)',
      uploadDrawingsHint: 'PDF, DWG, DXF, ZIP, DOCX iki 10 MB kiekvienas.',
      submitGeneral: 'Siųsti žinutę',
      submitClient: 'Pateikti projekto užklausą',
      publicEmails: 'Oficialūs el. pašto adresai',
      emailInquiries: 'Bendrieji klausimai ir klientai',
      emailOffice: 'Administracinis biuras',
      emailInvoices: 'Sąskaitos ir buhalterija',
      phoneNotice: 'Oficialus telefono numeris bus paskelbtas po patvirtinimo.',
      successHeading: 'Užklausa sėkmingai pateikta',
      successSubheading: 'Jūsų kreipimasis užregistruotas saugioje sistemoje.',
      referenceNumber: 'Unikalus numeris'
    },
    about: {
      title: 'Apie SMARTEURA',
      subtitle: 'Smarter European Industry — įkurta Lietuvoje, dirbanti Europos pramonei.',
      historyTitle: 'Įmonės kilmė',
      historyText: 'UAB Smarteura įregistruota Lietuvoje 2022 m. kovo 31 d. Grįsdami veiklą inžineriniu tikslumu ir meistriškumu, įgyvendiname pramoninių vamzdynų, suvirinimo ir mechaninio montavimo darbus.',
      marketsTitle: 'Pagrindinės Europos rinkos',
      marketsText: 'Mūsų komandos dirba Lietuvoje, Prancūzijoje, Nyderlanduose ir Vokietijoje, užtikrindamos operatyvų techninį palaikymą.',
      downloadPresentation: 'Atsisiųsti įmonės pristatymą (PDF)',
      presentationDesc: 'Atsisiųskite išsamią medžiagą apie paslaugas, pajėgumus ir standartus.',
      noPresentationNotice: 'Įmonės pristatymas šia kalba šiuo metu rengiamas.',
      factsTitle: 'Patvirtinti faktai'
    },
    news: {
      title: 'Naujienos ir pranešimai',
      subtitle: 'Patvirtinti Smarteura pranešimai ir techninės naujienos.',
      readMore: 'Skaityti pranešimą',
      backToNews: 'Atgal į naujienas',
      noNews: 'Šiuo metu naujų pranešimų nėra.'
    },
    footer: {
      established: 'Lietuvoje įkurta · 2022',
      rights: '© UAB Smarteura',
      quickLinks: 'Nuorodos',
      contacts: 'Kontaktai',
      social: 'Socialiniai tinklai'
    }
  },

  fr: {
    nav: {
      services: 'Services',
      projects: 'Projets',
      gallery: 'Galerie',
      career: 'Carrière',
      about: 'À propos',
      news: 'Actualités',
      contacts: 'Contacts',
      discussProject: 'Discuter de votre projet',
      adminPanel: 'Gestion'
    },
    hero: {
      slogan: 'Smarter European Industry',
      title: 'Montage industriel et soudage de précision à travers l’Europe',
      subtitle: 'Soutien aux grands projets industriels, de tuyauterie et mécaniques avec des équipes fiables et certifiées depuis la Lituanie.',
      ctaPrimary: 'Discuter de votre projet',
      ctaSecondary: 'Explorer nos services',
      badge: 'Établi en Lituanie · 2022'
    },
    liveCounter: {
      title: 'Grandir ensemble',
      subtitle: 'Présence active continue et mobilisation d’équipes depuis la création en Lituanie',
      days: 'Jours',
      hours: 'Heures',
      minutes: 'Minutes',
      seconds: 'Secondes',
      establishedText: 'Établi en Lituanie · 2022'
    },
    services: {
      title: 'Services industriels et mécaniques',
      subtitle: 'Exécution selon les normes les plus strictes par des équipes européennes qualifiées.',
      mainPiping: 'Tuyauterie industrielle',
      mainPipingDesc: 'Fabrication, préfabrication et pose de réseaux de tuyauteries conformes aux normes EN et ISO.',
      mainWelding: 'Soudage',
      mainWeldingDesc: 'Soudage TIG, MIG/MAG et ARC (MMA) qualifié pour tuyauteries sous pression et structures.',
      mainAssembly: 'Montage mécanique',
      mainAssemblyDesc: 'Assemblage précis, alignement et fixation d’équipements lourds et de lignes de fabrication.',
      mainInstallation: 'Installation d’équipements industriels',
      mainInstallationDesc: 'Positionnement, nivellement et raccordement mécanique complet de machines industrielles.',
      additionalTitle: 'Compétences complémentaires',
      additionalPiping: 'Tuyauterie de procédés (Agroalimentaire, Chimie, Pharma)',
      additionalPipingDesc: 'Réseaux de tuyauteries hygiéniques en inox haute pureté avec contrôle rigoureux des soudures.',
      additionalStructures: 'Assemblage de structures métalliques',
      additionalStructuresDesc: 'Montage de charpentes métalliques industrielles, passerelles, plateformes et racks.',
      additionalMarine: 'Construction navale et réparation maritime',
      additionalMarineDesc: 'Montage de coque, tuyauterie de pont et interventions mécaniques sur chantiers navals.',
      honestNotice: 'Les étendues de travail précises et les conditions contractuelles sont convenues au cas par cas.'
    },
    workersClients: {
      workersTitle: 'Build your next chapter with Smarteura.',
      workersText: 'Mettez vos compétences au service de projets industriels à travers l’Europe. Découvrez nos opportunités en soudage, tuyauterie et montage mécanique, ou envoyez votre CV pour de futurs postes. Rémunération, déplacements, hébergement et perspectives sont précisés dans chaque offre.',
      workersBtnVacancies: 'Voir les offres',
      workersBtnCv: 'Envoyer votre CV',
      clientsTitle: 'The right team for your next project.',
      clientsText: 'Vous préparez un projet naval ou industriel ? Smarteura met à disposition des soudeurs, tuyauteurs et mécaniciens qualifiés pour soutenir vos chantiers. Faites-nous part de vos besoins, de la localisation et du calendrier pour convenir de l’équipe adaptée.',
      clientsBtnDiscuss: 'Discuter de votre projet'
    },
    projects: {
      title: 'Portfolio de projets',
      subtitle: 'Références industrielles vérifiées sur nos principaux marchés européens.',
      noProjectsNotice: 'Les dossiers techniques de projets sont en cours de documentation. Seules les données confirmées par l’entreprise sont publiées.',
      statusInPrep: 'Documentation en préparation',
      filterAll: 'Toutes disciplines'
    },
    gallery: {
      title: 'Galerie de chantiers et réalisations',
      subtitle: 'Aperçu en images de nos travaux de tuyauterie industrielle, soudage certifié et montage mécanique à travers l’Europe.',
      filterAll: 'Tous les travaux',
      filterPiping: 'Tuyauterie industrielle',
      filterWelding: 'Soudage qualifié',
      filterAssembly: 'Assemblage mécanique',
      filterInstallation: 'Installation d’équipements',
      filterShipyard: 'Chantier naval & Maritime',
      viewPhoto: 'Consulter',
      closeModal: 'Fermer',
      projectLocation: 'Localisation',
      yearCompleted: 'Période'
    },
    career: {
      title: 'Carrière et opportunités',
      subtitle: 'Rejoignez des équipes industrielles certifiées sur des chantiers européens avec des conditions claires.',
      openVacancies: 'Postes ouverts',
      filterTrade: 'Filtrer par métier',
      filterCountry: 'Filtrer par pays',
      allTrades: 'Tous les métiers',
      allCountries: 'Tous les pays',
      applyNow: 'Postuler',
      details: 'Voir détails',
      noVacancies: 'Aucune offre ouverte pour le moment',
      noVacanciesSub: 'Vous pouvez nous transmettre votre CV pour nos prochains chantiers en Europe.',
      sendGeneralCv: 'Candidature spontanée',
      formTab: 'Remplir le formulaire détaillé',
      uploadTab: 'Téléverser un CV (Rapide)',
      uploadTitle: 'Déposez votre CV',
      uploadDesc: 'Transmission rapide de votre CV. Formats PDF, DOC ou DOCX acceptés jusqu’à 10 Mo.',
      uploadFormats: 'Formats acceptés : PDF, DOC, DOCX (Max : 10 Mo)',
      fullName: 'Nom et prénom',
      email: 'Adresse e-mail',
      phone: 'Numéro de téléphone',
      countryCity: 'Pays et ville de résidence',
      trade: 'Métier principal',
      targetPosition: 'Poste souhaité',
      experienceYears: 'Années d’expérience',
      skills: 'Compétences et qualifications',
      languages: 'Langues parlées',
      preferredCountries: 'Pays souhaités',
      earliestStartDate: 'Date de disponibilité',
      workPermit: 'Permis de travail UE / Citoyenneté',
      workPermitYes: 'Permis de travail UE valide / Citoyen UE',
      workPermitNo: 'Nécessite un visa de travail',
      certificates: 'Certificats (ex. ISO 9606, VCA, SCC)',
      notes: 'Remarques complémentaires',
      futureConsent: 'J’accepte que Smarteura conserve ma candidature pour de futures opportunités.',
      submitApplication: 'Envoyer ma candidature',
      uploading: 'Téléversement sécurisé...',
      successTicket: 'Candidature reçue',
      successMessage: 'Merci ! Votre dossier a été enregistré de façon sécurisée.',
      confidentialNotice: 'Confidentialité : vos documents sont conservés dans un espace protégé accessible uniquement aux recruteurs autorisés.',
      selectFile: 'Sélectionner le fichier CV',
      changeFile: 'Changer le fichier',
      removeFile: 'Supprimer'
    },
    contacts: {
      title: 'Contactez-nous',
      subtitle: 'Pour vos projets industriels, partenariats ou questions administratives.',
      generalTitle: 'Formulaire de contact général',
      generalSubtitle: 'Pour toute demande d’information ou collaboration générale.',
      clientTitle: 'Demande de projet client',
      clientSubtitle: 'Spécifiez les compétences recherchées, le planning et les documents techniques.',
      name: 'Votre nom',
      company: 'Société',
      email: 'Adresse e-mail',
      phoneOptional: 'Téléphone (optionnel)',
      message: 'Message / Description du besoin',
      contactPerson: 'Personne de contact',
      projectCountry: 'Pays / localisation du chantier',
      specialistsNeeded: 'Profils requis (ex. Tuyauteurs, Soudeurs TIG)',
      timeline: 'Calendrier et durée prévus',
      uploadDrawings: 'Joindre plans techniques ou cahier des charges (Multiples)',
      uploadDrawingsHint: 'PDF, DWG, DXF, ZIP, DOCX jusqu’à 10 Mo chacun.',
      submitGeneral: 'Envoyer le message',
      submitClient: 'Transmettre la demande de projet',
      publicEmails: 'Adresses électroniques officielles',
      emailInquiries: 'Renseignements généraux et clients',
      emailOffice: 'Secrétariat et administration',
      emailInvoices: 'Facturation et comptabilité',
      phoneNotice: 'Le numéro officiel sera affiché dès sa confirmation finale.',
      successHeading: 'Demande transmise avec succès',
      successSubheading: 'Votre demande est enregistrée dans notre système.',
      referenceNumber: 'Numéro de référence'
    },
    about: {
      title: 'À propos de SMARTEURA',
      subtitle: 'Smarter European Industry — fondée en Lituanie, au service de l’industrie européenne.',
      historyTitle: 'Historique de la société',
      historyText: 'UAB Smarteura a été immatriculée en Lituanie le 31 mars 2022. Axée sur la précision technique et la qualité de réalisation, notre société intervient sur des chantiers de tuyauterie, soudage et montage mécanique.',
      marketsTitle: 'Marchés européens clés',
      marketsText: 'Nos équipes interviennent en Lituanie, en France, aux Pays-Bas et en Allemagne avec une grande réactivité.',
      downloadPresentation: 'Télécharger la présentation d’entreprise (PDF)',
      presentationDesc: 'Consultez notre brochure sur nos prestations, méthodes et standards industriels.',
      noPresentationNotice: 'La présentation PDF dans cette langue est en cours d’actualisation.',
      factsTitle: 'Informations certifiées'
    },
    news: {
      title: 'Actualités et informations',
      subtitle: 'Communiqués et informations techniques de Smarteura.',
      readMore: 'Lire le communiqué',
      backToNews: 'Retour aux actualités',
      noNews: 'Aucune actualité publiée pour le moment.'
    },
    footer: {
      established: 'Établi en Lituanie · 2022',
      rights: '© UAB Smarteura',
      quickLinks: 'Navigation',
      contacts: 'Canaux de contact',
      social: 'Réseaux sociaux'
    }
  },

  nl: {
    nav: {
      services: 'Diensten',
      projects: 'Projecten',
      gallery: 'Galerij',
      career: 'Carrière',
      about: 'Over ons',
      news: 'Nieuws',
      contacts: 'Contact',
      discussProject: 'Bespreek uw project',
      adminPanel: 'Beheer'
    },
    hero: {
      slogan: 'Smarter European Industry',
      title: 'Industriële leidingbouw en lastechniek in heel Europa',
      subtitle: 'Ondersteuning van toonaangevende industriële, piping- en montagewerken met betrouwbare, gecertificeerde teams vanuit Litouwen.',
      ctaPrimary: 'Bespreek uw project',
      ctaSecondary: 'Bekijk onze diensten',
      badge: 'Opgericht in Litouwen · 2022'
    },
    liveCounter: {
      title: 'Samen groeien',
      subtitle: 'Continue actieve inzetbaarheid en teamparaatheid sinds de oprichting in Litouwen',
      days: 'Dagen',
      hours: 'Uren',
      minutes: 'Minuten',
      seconds: 'Seconden',
      establishedText: 'Opgericht in Litouwen · 2022'
    },
    services: {
      title: 'Industriële en mechanische diensten',
      subtitle: 'Vakkundige uitvoering volgens strenge Europese industrienormen.',
      mainPiping: 'Industriële leidingbouw',
      mainPipingDesc: 'Fabricage, prefabricage en montage van leidingnetwerken conform EN- en ISO-normen.',
      mainWelding: 'Lastechniek',
      mainWeldingDesc: 'Gecertificeerd TIG-, MIG/MAG- en BMBE-lassen voor druk- en constructietoepassingen.',
      mainAssembly: 'Mechanische montage',
      mainAssemblyDesc: 'Nauwkeurige opbouw, uitlijning en montage van zware modules en productielijnen.',
      mainInstallation: 'Installatie van industriële apparatuur',
      mainInstallationDesc: 'Plaatsing, nivellering en mechanische aansluiting van procesinstallaties en machines.',
      additionalTitle: 'Aanvullende expertises',
      additionalPiping: 'Procesleidingen voor voedings-, chemische en farmaceutische industrie',
      additionalPipingDesc: 'Hygiënische RVS procesleidingsystemen met strenge lasnaadinspecties.',
      additionalStructures: 'Montage van staalconstructies',
      additionalStructuresDesc: 'Bouw van industriële staalconstructies, bordessen, leidingbruggen en ondersteuningen.',
      additionalMarine: 'Scheepsbouw en maritieme montage',
      additionalMarineDesc: 'Rompsectiemontage, dekpiping en scheepswerfreparaties op internationale werven.',
      honestNotice: 'Specifieke projectvolumes en voorwaarden worden per projectovereenkomst overeengekomen.'
    },
    workersClients: {
      workersTitle: 'Build your next chapter with Smarteura.',
      workersText: 'Zet uw vaardigheden in op industriële projecten in heel Europa. Ontdek mogelijkheden in lassen, pijpfitten en mechanische installatie, of stuur uw cv voor toekomstige vacatures. Vergoeding, reis, accommodatie en ontwikkelingskansen staan per vacature vermeld.',
      workersBtnVacancies: 'Bekijk vacatures',
      workersBtnCv: 'Stuur uw CV',
      clientsTitle: 'The right team for your next project.',
      clientsText: 'Plant u een scheepsbouw- of industrieel project? Smarteura levert bekwame lassers, pijpfitters en monteurs om uw werk te versterken. Deel uw wensen, locatie en planning zodat we het juiste team voor uw project kunnen bespreken.',
      clientsBtnDiscuss: 'Bespreek uw project'
    },
    projects: {
      title: 'Projectoverzicht',
      subtitle: 'Geverifieerde industriële projectreferenties in onze Europese kernmarkten.',
      noProjectsNotice: 'Projectdocumentatie wordt zorgvuldig voorbereid voor publicatie. Conform de Smarteura-standaard worden alleen bevestigde technische gegevens gedeeld.',
      statusInPrep: 'Documentatie in voorbereiding',
      filterAll: 'Alle disciplines'
    },
    gallery: {
      title: 'Industriële & Project Galerij',
      subtitle: 'Foto-impressie van gecertificeerde pijpleidingen, orbitaallassen en mechanische montage op Europese projectlocaties.',
      filterAll: 'Alle werken',
      filterPiping: 'Industriële leidingen',
      filterWelding: 'Gecertificeerd lassen',
      filterAssembly: 'Mechanische montage',
      filterInstallation: 'Machine-installatie',
      filterShipyard: 'Scheepsbouw & Maritiem',
      viewPhoto: 'Bekijken',
      closeModal: 'Sluiten',
      projectLocation: 'Locatie',
      yearCompleted: 'Periode'
    },
    career: {
      title: 'Carrière & Mogelijkheden',
      subtitle: 'Werk mee in gecertificeerde teams op Europese projecten onder heldere voorwaarden.',
      openVacancies: 'Openstaande vacatures',
      filterTrade: 'Filter op vakgebied',
      filterCountry: 'Filter op land',
      allTrades: 'Alle vakgebieden',
      allCountries: 'Alle landen',
      applyNow: 'Solliciteren',
      details: 'Bekijk details',
      noVacancies: 'Momenteel geen openstaande vacatures',
      noVacanciesSub: 'U kunt uw cv insturen voor onze toekomstige projecten in Europa.',
      sendGeneralCv: 'Open sollicitatie versturen',
      formTab: 'Gedetailleerd formulier invullen',
      uploadTab: 'CV-bestand uploaden (Snel)',
      uploadTitle: 'Upload uw CV',
      uploadDesc: 'Direct uw cv insturen. PDF, DOC of DOCX tot 10 MB worden geaccepteerd.',
      uploadFormats: 'Geaccepteerde formaten: PDF, DOC, DOCX (Max: 10 MB)',
      fullName: 'Volledige naam',
      email: 'E-mailadres',
      phone: 'Telefoonnummer',
      countryCity: 'Woonland en woonplaats',
      trade: 'Primair vakgebied',
      targetPosition: 'Gewenste functie',
      experienceYears: 'Jaren ervaring',
      skills: 'Technische vaardigheden',
      languages: 'Talenkennis',
      preferredCountries: 'Voorkeurslanden',
      earliestStartDate: 'Vroegst mogelijke startdatum',
      workPermit: 'EU-werkvergunning / Burgerscap',
      workPermitYes: 'Geldige EU-vergunning / EU-burger',
      workPermitNo: 'Werkvisum vereist',
      certificates: 'Certificaten (bijv. ISO 9606, VCA, SCC)',
      notes: 'Aanvullende opmerkingen',
      futureConsent: 'Ik geef toestemming om mijn gegevens te bewaren voor toekomstige vacatures.',
      submitApplication: 'Sollicitatie versturen',
      uploading: 'Veilig uploaden...',
      successTicket: 'Sollicitatie ontvangen',
      successMessage: 'Bedankt! Uw sollicitatie is veilig vastgelegd in ons systeem.',
      confidentialNotice: 'Vertrouwelijkheid: uw documenten worden bewaard in een beveiligde omgeving die enkel toegankelijk is voor geautoriseerd personeel.',
      selectFile: 'Selecteer CV-bestand',
      changeFile: 'Wijzig bestand',
      removeFile: 'Verwijderen'
    },
    contacts: {
      title: 'Neem contact op',
      subtitle: 'Voor projectaanvragen, samenwerking of administratieve contacten.',
      generalTitle: 'Algemeen contactformulier',
      generalSubtitle: 'Voor algemene vragen en partnerschappen.',
      clientTitle: 'Projectaanvraag opdrachtgevers',
      clientSubtitle: 'Bespreek specifieke projecteisen, teamsamenstelling en planning.',
      name: 'Uw naam',
      company: 'Bedrijfsnaam',
      email: 'E-mailadres',
      phoneOptional: 'Telefoon (optioneel)',
      message: 'Bericht / projectomschrijving',
      contactPerson: 'Contactpersoon',
      projectCountry: 'Projectlocatie / land',
      specialistsNeeded: 'Benodigde specialisten (bijv. TIG-lassers, fitters)',
      timeline: 'Verwachte planning en doorlooptijd',
      uploadDrawings: 'Technische tekeningen of bestek toevoegen (meerdere)',
      uploadDrawingsHint: 'PDF, DWG, DXF, ZIP, DOCX tot maximaal 10 MB per bestand.',
      submitGeneral: 'Verstuur bericht',
      submitClient: 'Projectaanvraag indienen',
      publicEmails: 'Officiële e-mailadressen',
      emailInquiries: 'Algemene vragen & opdrachtgevers',
      emailOffice: 'Administratiekantoor',
      emailInvoices: 'Facturen en boekhouding',
      phoneNotice: 'Het officiële telefoonnummer wordt na definitieve verificatie gepubliceerd.',
      successHeading: 'Aanvraag succesvol verzonden',
      successSubheading: 'Uw aanvraag is veilig geregistreerd in ons systeem.',
      referenceNumber: 'Referentienummer'
    },
    about: {
      title: 'Over SMARTEURA',
      subtitle: 'Smarter European Industry — opgericht in Litouwen, actief voor de Europese industrie.',
      historyTitle: 'Achtergrond van de onderneming',
      historyText: 'UAB Smarteura is opgericht in Litouwen op 31 maart 2022. Met een sterke focus op technische precisie en vakmanschap realiseren we industriële leiding-, las- en montagewerken.',
      marketsTitle: 'Belangrijkste Europese markten',
      marketsText: 'Onze teams zijn actief in Litouwen, Frankrijk, Nederland en Duitsland met snelle mobilisatie en technische slagkracht.',
      downloadPresentation: 'Bedrijfspresentatie downloaden (PDF)',
      presentationDesc: 'Bekijk ons complete overzicht van diensten, capaciteiten en kwaliteitsnormen.',
      noPresentationNotice: 'De bedrijfspresentatie in deze taal wordt momenteel geactualiseerd.',
      factsTitle: 'Geverifieerde feiten'
    },
    news: {
      title: 'Nieuws & Berichten',
      subtitle: 'Officiële mededelingen en technische updates van Smarteura.',
      readMore: 'Lees bericht',
      backToNews: 'Terug naar overzicht',
      noNews: 'Momenteel zijn er geen openbare nieuwsberichten.'
    },
    footer: {
      established: 'Opgericht in Litouwen · 2022',
      rights: '© UAB Smarteura',
      quickLinks: 'Navigatie',
      contacts: 'Contactkanalen',
      social: 'Sociale media'
    }
  },

  tr: {
    nav: {
      services: 'Hizmetler',
      projects: 'Projeler',
      gallery: 'Galeri',
      career: 'Kariyer',
      about: 'Hakkımızda',
      news: 'Haberler',
      contacts: 'İletişim',
      discussProject: 'Projenizi Konuşalım',
      adminPanel: 'Yönetim'
    },
    hero: {
      slogan: 'Smarter European Industry',
      title: 'Avrupa Genelinde Hassas Endüstriyel Montaj ve Kaynak',
      subtitle: 'Litvanya merkezli sertifikalı ve güvenilir saha ekiplerimizle Avrupa kıtası genelinde endüstriyel borulama, kaynak ve mekanik montaj projelerini hayata geçiriyoruz.',
      ctaPrimary: 'Projenizi Konuşalım',
      ctaSecondary: 'Hizmetleri Keşfedin',
      badge: 'Litvanya\'da Kuruldu · 2022'
    },
    liveCounter: {
      title: 'Birlikte Büyüyoruz',
      subtitle: 'Litvanya\'da kurulduğumuz günden bu yana kesintisiz ekip hazır oluşu ve saha varlığı',
      days: 'Gün',
      hours: 'Saat',
      minutes: 'Dakika',
      seconds: 'Saniye',
      establishedText: 'Litvanya\'da Kuruldu · 2022'
    },
    services: {
      title: 'Endüstriyel ve Mekanik Hizmetler',
      subtitle: 'Zorlu endüstriyel ortamlarda sertifikalı Avrupa ekipleri tarafından yüksek standartlı uygulama.',
      mainPiping: 'Endüstriyel Borulama',
      mainPipingDesc: 'İzometrik çizimlerden paslanmaz çelik, karbon çeliği ve alaşımlı boru hatlarının montajı ve orbital kaynağı.',
      mainWelding: 'Sertifikalı Kaynak',
      mainWeldingDesc: 'Yüksek basınçlı ve kritik altyapı projeleri için ISO 9606-1 onaylı TIG, MIG/MAG ve elektrot kaynak ekipleri.',
      mainAssembly: 'Mekanik Montaj',
      mainAssemblyDesc: 'Endüstriyel makinelerin, pompa istasyonlarının, dişli kutularının ve üretim hatlarının hassas kurulumu.',
      mainInstallation: 'Anahtar Teslim Kurulum',
      mainInstallationDesc: 'Avrupa standartlarında komple fabrika yerleşimi, lazer hizalama, tork kontrolü ve devreye alma desteği.',
      additionalTitle: 'Ek Uzmanlık Alanlarımız',
      additionalPiping: 'Proses ve Hijyenik Hatlar',
      additionalPipingDesc: 'Gıda, ilaç ve kimya tesisleri için saf su, buhar ve kimyasal transfer borulaması.',
      additionalStructures: 'Ağır Çelik Konstrüksiyon',
      additionalStructuresDesc: 'Boru köprüleri, platformlar ve endüstriyel destek iskeletlerinin montajı.',
      additionalMarine: 'Tersane ve Denizcilik Tesisatı',
      additionalMarineDesc: 'Gemi makine dairesi borulaması, balast suyu arıtma sistemleri ve deniz üstü yapılar.',
      honestNotice: 'Hizmetlerimiz doğrudan kendi kalifiye ekiplerimiz tarafından yürütülmektedir; taşeronluk veya aracılık yapılmaz.'
    },
    workersClients: {
      workersTitle: 'Geleceğinizi Smarteura ile İnşa Edin',
      workersText: 'Avrupa\'nın prestijli projelerinde rekabetçi ücretler, konforlu konaklama ve resmi sözleşmelerle çalışın. TIG kaynakçıları, boru montajcıları ve mekanik montaj ustaları arıyoruz.',
      workersBtnVacancies: 'Açık Pozisyonlar',
      workersBtnCv: 'Hemen CV Gönder',
      clientsTitle: 'Projeniz İçin Doğru Saha Ekibi',
      clientsText: 'Kritik projeleriniz için sertifikalı, iş güvenliği eğitimli ve anında sahaya intikal edebilen Litvanya merkezli uzman ekipler sağlıyoruz.',
      clientsBtnDiscuss: 'Ekip Talebi Oluştur'
    },
    projects: {
      title: 'Referans Projelerimiz',
      subtitle: 'Avrupa çapında başarıyla tamamlanan ve devam eden endüstriyel borulama ve mekanik montaj operasyonlarımız.',
      noProjectsNotice: 'Yayınlanmış proje verisi bulunamadı. Teknik detaylar onay sürecindedir.',
      statusInPrep: 'Devam Eden Saha Çalışması',
      filterAll: 'Tüm Projeler'
    },
    gallery: {
      title: 'Saha & Operasyon Galerisi',
      subtitle: 'Avrupa genelindeki şantiyelerimizden sertifikalı borulama, orbital kaynak ve mekanik montaj fotoğrafları.',
      filterAll: 'Tümü',
      filterPiping: 'Borulama Hatları',
      filterWelding: 'Hassas Kaynak',
      filterAssembly: 'Mekanik Montaj',
      filterInstallation: 'Ekipman Kurulumu',
      filterShipyard: 'Tersane & Denizcilik',
      viewPhoto: 'Detayları İncele',
      closeModal: 'Kapat',
      projectLocation: 'Konum',
      yearCompleted: 'Dönem'
    },
    career: {
      title: 'Kariyer & Açık Pozisyonlar',
      subtitle: 'Avrupa genelindeki endüstriyel projelerimizde yerinizi alın. Şeffaf koşullar, resmi sözleşmeler ve düzenli rotasyonlar.',
      openVacancies: 'Açık Pozisyonlar',
      filterTrade: 'Uzmanlık Alanı',
      filterCountry: 'Ülke',
      allTrades: 'Tüm Alanlar',
      allCountries: 'Tüm Ülkeler',
      applyNow: 'Başvuru Yap',
      details: 'Ayrıntılar',
      noVacancies: 'Şu anda bu filtreye uygun açık ilan bulunmamaktadır.',
      noVacanciesSub: 'Gelecekteki projeler için genel CV havuzumuza başvurabilirsiniz.',
      sendGeneralCv: 'Genel CV Gönder',
      formTab: 'Hızlı Başvuru Formu',
      uploadTab: 'Doğrudan CV Yükle',
      uploadTitle: 'Özgeçmişinizi (CV) Yükleyin',
      uploadDesc: 'PDF, DOC veya DOCX formatında güncel CV\'nizi yükleyin. İK ekibimiz en kısa sürede sizinle iletişime geçecektir.',
      uploadFormats: 'Desteklenen formatlar: PDF, DOC, DOCX (Maks. 10MB)',
      fullName: 'Ad ve Soyad',
      email: 'E-posta Adresi',
      phone: 'Telefon Numarası (WhatsApp dahil)',
      countryCity: 'İkamet Ettiğiniz Ülke ve Şehir',
      trade: 'Ana Meslek / Uzmanlık',
      targetPosition: 'Hedeflenen Pozisyon',
      experienceYears: 'Deneyim Süresi (Yıl)',
      skills: 'Kullandığınız Yöntemler & Beceriler (Örn: TIG, 141, 111, İzometri)',
      languages: 'Yabancı Diller (İngilizce, Almanca, Rusça vb.)',
      preferredCountries: 'Çalışmak İstediğiniz Ülkeler',
      earliestStartDate: 'En Erken İşe Başlama Tarihi',
      workPermit: 'Avrupa Birliği Çalışma İzniniz / Pasaportunuz Var mı?',
      workPermitYes: 'Evet, AB vatandaşıyım veya geçerli çalışma iznim var',
      workPermitNo: 'Hayır, vize desteği gerekiyor',
      certificates: 'Mevcut Sertifikalar (ISO 9606, VCA/SCC vb.)',
      notes: 'Eklemek İstediğiniz Notlar',
      futureConsent: 'Gelecekteki uygun projeler için bilgilerimin veritabanında saklanmasını onaylıyorum',
      submitApplication: 'Başvuruyu Gönder',
      uploading: 'Gönderiliyor...',
      successTicket: 'Başvurunuz Başarıyla Alındı!',
      successMessage: 'Başvuru referans kodunuz kaydedilmiştir. Uzmanlarımız niteliklerinizi inceledikten sonra sizinle iletişime geçecektir.',
      confidentialNotice: 'Tüm verileriniz Avrupa GDPR ve gizlilik standartlarına uygun olarak korunur.',
      selectFile: 'Dosya Seç',
      changeFile: 'Dosyayı Değiştir',
      removeFile: 'Kaldır'
    },
    contacts: {
      title: 'İletişim & Talep',
      subtitle: 'Projeniz veya iş birliği fırsatları için Litvanya merkezimiz veya saha koordinatörlerimizle iletişime geçin.',
      generalTitle: 'Genel İletişim',
      generalSubtitle: 'Sorularınız veya iş birliği talepleriniz için bize yazın.',
      clientTitle: 'Endüstriyel Ekip Talebi',
      clientSubtitle: 'Projenize özel kaynakçı, boru montajcısı ve mekanik montaj ekibi teklifi alın.',
      name: 'Adınız Soyadınız',
      company: 'Şirket Adı',
      email: 'Kurumsal E-posta',
      phoneOptional: 'Telefon Numarası',
      message: 'Mesajınız veya Proje Özeti',
      contactPerson: 'Yetkili Kişi',
      projectCountry: 'Proje Ülkesi / Lokasyonu',
      specialistsNeeded: 'İhtiyaç Duyulan Uzman Profilleri',
      timeline: 'Planlanan Başlangıç ve Süre',
      uploadDrawings: 'Teknik Çizim / Şartname Ekle (İsteğe bağlı)',
      uploadDrawingsHint: 'PDF, DWG, ZIP formatları (Maks. 25MB)',
      submitGeneral: 'Mesajı Gönder',
      submitClient: 'Ekip Talebini İlet',
      publicEmails: 'Resmi E-posta Kanalları',
      emailInquiries: 'Proje Talepleri & Teklifler',
      emailOffice: 'Genel Yönetim & Ofis',
      emailInvoices: 'Muhasebe & Faturalandırma',
      phoneNotice: 'Telefon santralimiz resmi tahsis sürecindedir; acil talepler için lütfen doğrudan kurumsal e-posta ile iletişime geçiniz.',
      successHeading: 'Talebiniz Alındı',
      successSubheading: 'Talebiniz teknik koordinatörümüze iletilmiştir. 24 saat içinde dönüş sağlanacaktır.',
      referenceNumber: 'Talep Kayıt No'
    },
    about: {
      title: 'SMARTEURA Hakkında',
      subtitle: 'Smarter European Industry — Litvanya merkezli, tüm Avrupa sanayisine hizmet veren güvenilir çözüm ortağı.',
      historyTitle: 'Şirket Hikayemiz',
      historyText: 'UAB Smarteura, 31 Mart 2022 tarihinde Litvanya\'da kurulmuştur. Yüksek mühendislik disiplini ve sertifikalı iş gücü anlayışıyla endüstriyel borulama, orbital kaynak ve mekanik montaj projelerinde güçlü bir operasyonel varlık göstermektedir.',
      marketsTitle: 'Faaliyet Gösterdiğimiz Başlıca Pazarlar',
      marketsText: 'Ekiplerimiz Litvanya, Fransa, Hollanda ve Almanya başta olmak üzere Avrupa genelinde hızlı mobilizasyon ve yüksek teknik yeterlilikle görev yapmaktadır.',
      downloadPresentation: 'Şirket Sunumunu İndir (PDF)',
      presentationDesc: 'Hizmetlerimiz, teknik yeterliliklerimiz ve kalite standartlarımız hakkında detaylı bilgi edinin.',
      noPresentationNotice: 'Bu dildeki şirket sunumu güncellenmektedir.',
      factsTitle: 'Doğrulanmış Kurumsal Bilgiler'
    },
    news: {
      title: 'Haberler & Teknik Bülten',
      subtitle: 'Smarteura\'dan resmi duyurular, saha gelişmeleri ve Avrupa sanayi standartları bülteni.',
      readMore: 'Haberi Oku',
      backToNews: 'Haberlere Geri Dön',
      noNews: 'Şu anda yayınlanmış yeni bir duyuru bulunmamaktadır.'
    },
    footer: {
      established: 'Litvanya\'da Kuruldu · 2022',
      rights: '© UAB Smarteura',
      quickLinks: 'Hızlı Erişim',
      contacts: 'İletişim',
      social: 'Sosyal Medya'
    }
  }
};
