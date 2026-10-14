import { CandidateApplication, ClientInquiry, GeneralContactMessage } from '../types';
import { getCachedAccessToken } from './firebase';
import { sendGmailEmail } from './workspace';

export const TARGET_OFFICE_EMAIL = 'office@smarteura.eu';

interface SendResult {
  success: boolean;
  channel: 'formsubmit' | 'gmail' | 'fallback';
  message: string;
}

/**
 * Dispatch automated email notification for Candidate CV Applications to office@smarteura.eu
 */
export async function notifyOfficeNewCandidateApplication(
  app: CandidateApplication
): Promise<SendResult> {
  const subject = `[SMARTEURA CV] Yeni Karyera Müraciəti: ${app.fullName} - ${app.targetPosition || app.trade} (${app.referenceId})`;

  const emailBodyText = `
========================================
SMARTEURA PORTAL - YENİ CV MÜRACİƏTİ
========================================
Referans Nömrəsi: ${app.referenceId}
Tarix: ${new Date(app.createdAt).toLocaleString()}

NAMİZƏD MƏLUMATLARI:
- Ad, Soyad: ${app.fullName}
- Email: ${app.email}
- Telefon: ${app.phone}
- Yaşadığı Ölkə / Şəhər: ${app.countryOfResidence || 'Qeyd edilməyib'} ${app.city || ''}
- İxtisas / Peşə: ${app.trade || 'Ümumi'}
- Hədəf Vəzifə: ${app.targetPosition || 'Qeyd edilməyib'}
- Təcrübə (İl): ${app.experienceYears !== undefined ? `${app.experienceYears} il` : 'Qeyd edilməyib'}
- Bildiyi Dillər: ${app.languages || 'Qeyd edilməyib'}
- İş İcazəsi (Work Permit): ${app.hasWorkPermit ? `Var (${app.workPermitCountry || 'EU'})` : 'Yoxdur'}
- Başlamağa hazır olduğu tarix: ${app.earliestStartDate || 'Dərhal'}
- Bacarıqlar: ${app.skills && app.skills.length > 0 ? app.skills.join(', ') : 'Qeyd edilməyib'}
- Sertifikatlar: ${app.certificates || 'Qeyd edilməyib'}
- Əlavə Qeydlər: ${app.additionalNotes || 'Yoxdur'}

ƏLAVƏ EDİLMİŞ CV:
- Fayl adı: ${app.cvFileName || 'Form doldurulub (fayl əlavə edilməyib)'}
- Fayl həcmi: ${app.cvFileSize || '-'}

Bu müraciət avtomatik olaraq Smarteura rəsmi portalı (smarteura.eu) üzərindən qəbul edilmişdir.
  `.trim();

  // Try Workspace Gmail API first if token exists
  const token = getCachedAccessToken();
  if (token) {
    try {
      await sendGmailEmail(token, {
        to: TARGET_OFFICE_EMAIL,
        subject,
        bodyText: emailBodyText
      });
      return { success: true, channel: 'gmail', message: `Email office@smarteura.eu ünvanına Workspace vasitəsilə göndərildi.` };
    } catch (e) {
      console.warn('Workspace Gmail send fallback to HTTP service:', e);
    }
  }

  // Fallback to FormSubmit HTTP automated delivery to office@smarteura.eu
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_OFFICE_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: app.email,
        _template: 'table',
        _captcha: 'false',
        'Referans Nömrəsi': app.referenceId,
        'Namizəd Adı': app.fullName,
        'Email': app.email,
        'Telefon': app.phone,
        'Ölkə / Şəhər': `${app.countryOfResidence} ${app.city}`.trim(),
        'İxtisas / Vəzifə': `${app.trade} - ${app.targetPosition}`,
        'Təcrübə': app.experienceYears ? `${app.experienceYears} il` : 'Qeyd edilməyib',
        'Dillər': app.languages || '-',
        'İş İcazəsi': app.hasWorkPermit ? 'Var (EU)' : 'Yoxdur',
        'CV Fayl Adı': app.cvFileName || 'Yoxdur',
        'Qeydlər': app.additionalNotes || '-',
        'Tarix': new Date().toLocaleString()
      })
    });

    if (res.ok) {
      return { success: true, channel: 'formsubmit', message: `Müraciət office@smarteura.eu ünvanına çatdırıldı.` };
    }
  } catch (err) {
    console.warn('HTTP notification send error:', err);
  }

  return { success: false, channel: 'fallback', message: 'Avtomatik bildiriş növbəyə alındı.' };
}

/**
 * Dispatch automated email notification for B2B Client Inquiries to office@smarteura.eu
 */
export async function notifyOfficeNewClientInquiry(
  inq: ClientInquiry
): Promise<SendResult> {
  const subject = `[SMARTEURA B2B] Yeni Müştəri Sorğusu: ${inq.companyName} (${inq.contactPerson}) - Ref: ${inq.referenceId}`;

  const emailBodyText = `
========================================
SMARTEURA PORTAL - YENİ MÜŞTƏRİ SORĞUSU (RFQ)
========================================
Referans Nömrəsi: ${inq.referenceId}
Tarix: ${new Date(inq.createdAt).toLocaleString()}

MÜŞTƏRİ VƏ ŞİRKƏT DETALLARI:
- Şirkət Adı: ${inq.companyName}
- Əlaqəli Şəxs: ${inq.contactPerson}
- Email: ${inq.email}
- Telefon: ${inq.phone || 'Qeyd edilməyib'}
- Layihə Ölkəsi: ${inq.projectCountry}
- Tələb Olunan Mütəxəssislər: ${inq.requiredSpecialists.join(', ') || 'Qeyd edilməyib'}
- Təxmini Müddət: ${inq.estimatedTimeline || 'Qeyd edilməyib'}

LAYİHƏ TƏSVİRİ VƏ MESAJ:
${inq.message}

QOŞULMUŞ FAYLLAR:
${inq.files && inq.files.length > 0
  ? inq.files.map(f => `- ${f.name} (${f.size})`).join('\n')
  : 'Fayl əlavə edilməyib.'}

Bu sorğu avtomatik olaraq Smarteura rəsmi portalı (smarteura.eu) üzərindən daxil olmuşdur.
  `.trim();

  // Try Workspace Gmail API first if token exists
  const token = getCachedAccessToken();
  if (token) {
    try {
      await sendGmailEmail(token, {
        to: TARGET_OFFICE_EMAIL,
        subject,
        bodyText: emailBodyText
      });
      return { success: true, channel: 'gmail', message: `Email office@smarteura.eu ünvanına Workspace vasitəsilə göndərildi.` };
    } catch (e) {
      console.warn('Workspace Gmail send fallback to HTTP service:', e);
    }
  }

  // Fallback to FormSubmit HTTP automated delivery to office@smarteura.eu
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_OFFICE_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: inq.email,
        _template: 'table',
        _captcha: 'false',
        'Referans Nömrəsi': inq.referenceId,
        'Şirkət Adı': inq.companyName,
        'Əlaqəli Şəxs': inq.contactPerson,
        'Email': inq.email,
        'Telefon': inq.phone || 'Qeyd edilməyib',
        'Layihə Ölkəsi': inq.projectCountry,
        'Tələb Olunan İxtisaslar': inq.requiredSpecialists.join(', '),
        'Müddət': inq.estimatedTimeline || '-',
        'Mesaj / Texniki Tələb': inq.message,
        'Fayllar': inq.files.map(f => f.name).join(', ') || 'Yoxdur',
        'Tarix': new Date().toLocaleString()
      })
    });

    if (res.ok) {
      return { success: true, channel: 'formsubmit', message: `Sorğu office@smarteura.eu ünvanına çatdırıldı.` };
    }
  } catch (err) {
    console.warn('HTTP notification send error:', err);
  }

  return { success: false, channel: 'fallback', message: 'Avtomatik bildiriş növbəyə alındı.' };
}

/**
 * Dispatch automated email notification for General Contact Messages to office@smarteura.eu
 */
export async function notifyOfficeNewContactMessage(
  msg: GeneralContactMessage
): Promise<SendResult> {
  const subject = `[SMARTEURA PORTAL] Yeni Əlaqə Mesajı: ${msg.name} - Ref: ${msg.referenceId}`;

  const emailBodyText = `
========================================
SMARTEURA PORTAL - ƏLAQƏ MESAJI
========================================
Referans Nömrəsi: ${msg.referenceId}
Tarix: ${new Date(msg.createdAt).toLocaleString()}

GÖNDƏRƏN:
- Ad, Soyad: ${msg.name}
- Şirkət: ${msg.company || 'Qeyd edilməyib'}
- Email: ${msg.email}
- Telefon: ${msg.phone || 'Qeyd edilməyib'}

MESAJ:
${msg.message}
  `.trim();

  const token = getCachedAccessToken();
  if (token) {
    try {
      await sendGmailEmail(token, {
        to: TARGET_OFFICE_EMAIL,
        subject,
        bodyText: emailBodyText
      });
      return { success: true, channel: 'gmail', message: `Email office@smarteura.eu ünvanına Workspace vasitəsilə göndərildi.` };
    } catch (e) {
      console.warn('Workspace Gmail send fallback:', e);
    }
  }

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_OFFICE_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: msg.email,
        _template: 'table',
        _captcha: 'false',
        'Referans Nömrəsi': msg.referenceId,
        'Göndərən': msg.name,
        'Şirkət': msg.company || 'Qeyd edilməyib',
        'Email': msg.email,
        'Telefon': msg.phone || 'Qeyd edilməyib',
        'Mesaj': msg.message,
        'Tarix': new Date().toLocaleString()
      })
    });

    if (res.ok) {
      return { success: true, channel: 'formsubmit', message: `Mesaj office@smarteura.eu ünvanına çatdırıldı.` };
    }
  } catch (err) {
    console.warn('HTTP notification send error:', err);
  }

  return { success: false, channel: 'fallback', message: 'Bildiriş növbəyə alındı.' };
}
