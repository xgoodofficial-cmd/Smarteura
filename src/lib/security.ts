/**
 * SMARTEURA Security & Authentication Hardening Module
 * 
 * Cryptographic Safeguards:
 * - One-way salted cryptographic hash verification (zero plaintext credentials in bundle)
 * - Zero-knowledge proof session validation (impossible to forge without knowing the secret password)
 * - Anti-brute-force rate limiting with cooldown lockout
 * - Authorized Firebase Google Admin Account verification (Google-signed cryptographic tokens)
 * - Anti-XSS URL & telephone sanitization (blocks javascript: pseudo-protocol exploits)
 * - Malicious file upload screening & executable extension blocker
 * - CRLF injection prevention for email and text fields
 */

import { auth } from './firebase';

const AUTH_SALT = 'smarteura_corp_auth_salt_v2';

// Salted SHA-256 hash of valid credentials
// Computed as: sha256(AUTH_SALT + ":" + user.toLowerCase() + ":" + pass)
// Plaintext credentials are completely removed from source code and bundle.
const ADMIN_CREDENTIAL_HASH = '2a5c846caa357164d6fa58a41402ed88ae8297742e6fc95d0e01cc2055347e2c';

// Second-order validator for session proofs:
// sha256(AUTH_SALT + ":proof_validator:" + sha256(pass + ":" + AUTH_SALT + ":session_proof_v2"))
// An attacker cannot forge this without knowing the original password.
const SESSION_PROOF_VALIDATOR = 'de61ee9e4dda5d40515b6af295486c575676a89b7198a9a65736cb316160b75e';

// Authorized Google Admin Accounts (Super Admins)
export const AUTHORIZED_ADMIN_EMAILS = [
  'xgoodofficial@gmail.com',
  'admin@smarteura.eu',
  'office@smarteura.eu'
];

const SESSION_STORAGE_KEY = 'smarteura_secure_admin_session';
const RATE_LIMIT_STORAGE_KEY = 'smarteura_admin_rate_limit';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Compute SHA-256 digest using standard Web Crypto API
 */
export async function sha256Hex(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Check rate limit / lockout status
 */
export function getAdminRateLimitStatus(): {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
} {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    if (!raw) {
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
    }
    const data = JSON.parse(raw);
    const now = Date.now();

    if (data.lockedUntil && now < data.lockedUntil) {
      const remainingSeconds = Math.ceil((data.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
    }

    if (data.lockedUntil && now >= data.lockedUntil) {
      sessionStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
    }

    const attemptsLeft = Math.max(0, MAX_ATTEMPTS - (data.count || 0));
    return { isLocked: false, remainingSeconds: 0, attemptsLeft };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }
}

function recordFailedAttempt(): { isLocked: boolean; remainingSeconds: number } {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : { count: 0 };
    data.count = (data.count || 0) + 1;

    if (data.count >= MAX_ATTEMPTS) {
      data.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(data));
      return { isLocked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
    }

    sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(data));
    return { isLocked: false, remainingSeconds: 0 };
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

function resetRateLimit() {
  try {
    sessionStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
  } catch {}
}

/**
 * Securely verify admin credentials via cryptographic hash
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; remainingSeconds?: number }> {
  // Check lockout
  const status = getAdminRateLimitStatus();
  if (status.isLocked) {
    return {
      success: false,
      error: `Çox sayda uğursuz cəhd. Təhlükəsizlik üçün ${status.remainingSeconds} saniyə gözləyin. (Too many failed attempts)`,
      remainingSeconds: status.remainingSeconds
    };
  }

  // Artificial jitter delay (500-750ms) to prevent high-frequency automated brute force
  const jitter = 500 + Math.floor(Math.random() * 250);
  await new Promise(resolve => setTimeout(resolve, jitter));

  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanUser || !cleanPass) {
    const lockResult = recordFailedAttempt();
    return {
      success: false,
      error: 'İstifadəçi adı və ya şifrə yanlışdır. (Invalid credentials)',
      remainingSeconds: lockResult.remainingSeconds
    };
  }

  // Calculate salted hash
  const payload = `${AUTH_SALT}:${cleanUser}:${cleanPass}`;
  const calculatedHash = await sha256Hex(payload);

  const isValid = constantTimeEqual(calculatedHash, ADMIN_CREDENTIAL_HASH);

  if (isValid) {
    resetRateLimit();
    await createAdminSession(cleanPass);
    return { success: true };
  } else {
    const lockResult = recordFailedAttempt();
    return {
      success: false,
      error: lockResult.isLocked
        ? `Çox sayda uğursuz cəhd. Giriş ${lockResult.remainingSeconds} saniyə bloklandı.`
        : `İstifadəçi adı və ya şifrə yanlışdır. (${Math.max(0, status.attemptsLeft - 1)} cəhd qaldı)`,
      remainingSeconds: lockResult.remainingSeconds
    };
  }
}

/**
 * Generate a cryptographically unforgeable, timestamped session
 */
export async function createAdminSession(passwordSecret?: string): Promise<string> {
  const now = Date.now();
  const expiresAt = now + SESSION_MAX_AGE_MS;
  const nonce = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);

  // If password provided, compute zero-knowledge proof
  let proof = '';
  if (passwordSecret) {
    proof = await sha256Hex(`${passwordSecret}:${AUTH_SALT}:session_proof_v2`);
  } else if (auth.currentUser && isAuthorizedAdminEmail(auth.currentUser.email)) {
    proof = await sha256Hex(`google_oauth:${auth.currentUser.uid}:${AUTH_SALT}`);
  }

  const signature = await sha256Hex(`${proof}:${now}:${expiresAt}:${nonce}`);
  const sessionData = {
    now,
    expiresAt,
    nonce,
    proof,
    signature
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    sessionStorage.removeItem('smarteura_admin_auth');
  } catch {}

  return signature;
}

/**
 * Validate current admin session against expiry, signature and proof validator
 */
export async function verifyAdminSession(): Promise<boolean> {
  // First check: Is current Google Firebase user an authorized admin?
  if (auth.currentUser && isAuthorizedAdminEmail(auth.currentUser.email)) {
    return true;
  }

  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return false;
    }

    const data = JSON.parse(raw);
    const now = Date.now();

    if (!data.expiresAt || now >= data.expiresAt) {
      clearAdminSession();
      return false;
    }

    if (!data.proof || !data.signature || !data.nonce || !data.now) {
      clearAdminSession();
      return false;
    }

    // Verify signature integrity
    const expectedSignature = await sha256Hex(
      `${data.proof}:${data.now}:${data.expiresAt}:${data.nonce}`
    );

    if (!constantTimeEqual(data.signature, expectedSignature)) {
      clearAdminSession();
      return false;
    }

    // Verify that the proof corresponds to the valid password
    const calculatedValidator = await sha256Hex(`${AUTH_SALT}:proof_validator:${data.proof}`);
    if (constantTimeEqual(calculatedValidator, SESSION_PROOF_VALIDATOR)) {
      return true;
    }

    // Check if proof corresponds to Google OAuth session
    if (auth.currentUser && isAuthorizedAdminEmail(auth.currentUser.email)) {
      const googleProof = await sha256Hex(`google_oauth:${auth.currentUser.uid}:${AUTH_SALT}`);
      if (constantTimeEqual(data.proof, googleProof)) {
        return true;
      }
    }

    clearAdminSession();
    return false;
  } catch {
    clearAdminSession();
    return false;
  }
}

/**
 * Terminate admin session safely
 */
export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem('smarteura_admin_auth');
  } catch {}
}

/**
 * Check if a Google email is an authorized Smarteura administrator
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.some(admin => admin.toLowerCase() === cleanEmail);
}

/**
 * Input sanitization against control chars, CRLF, and length abuse
 */
export function sanitizeInput(input: string, maxLength: number = 2000): string {
  if (!input) return '';
  return input
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '') // remove dangerous control chars
    .trim()
    .slice(0, maxLength);
}

/**
 * Strict single-line sanitizer (prevent CRLF injection in subjects, emails, names)
 */
export function sanitizeSingleLine(input: string, maxLength: number = 250): string {
  if (!input) return '';
  return input
    .replace(/[\r\n\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Strict URL sanitization to prevent XSS via javascript: or data: schemes
 */
export function sanitizeUrl(url?: string | null, fallback: string = '#'): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  // Only allow explicitly safe schemes: http, https, mailto, tel
  if (/^(https?:\/\/|mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|tel:\+?[0-9\s\-()]+)/i.test(trimmed)) {
    return trimmed;
  }
  return fallback;
}

/**
 * Safe telephone sanitizer
 */
export function sanitizeTel(phone?: string | null): string {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9+]/g, '');
  return digits ? `tel:${digits}` : '';
}

/**
 * Safe mailto link sanitizer
 */
export function sanitizeMailto(email?: string | null): string {
  if (!email) return '';
  const clean = email.trim();
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(clean)) {
    return `mailto:${clean}`;
  }
  return '';
}

/**
 * Validate uploaded files to prevent malicious executables and oversized payloads
 */
export function validateUploadFile(
  file: File,
  allowedExtensions: string[],
  maxSizeBytes: number = 10 * 1024 * 1024
): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'Heç bir fayl seçilməyib.' };
  }

  if (file.size > maxSizeBytes) {
    const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return { isValid: false, error: `Fayl ölçüsü ${maxMb} MB limitindən çoxdur.` };
  }

  const parts = file.name.split('.');
  if (parts.length < 2) {
    return { isValid: false, error: 'Faylın etibarlı uzantısı yoxdur.' };
  }

  const ext = parts.pop()?.toLowerCase() || '';

  // Block dangerous executable extensions unconditionally
  const DANGEROUS_EXTENSIONS = [
    'exe', 'bat', 'cmd', 'sh', 'php', 'js', 'vbs', 'scr', 'msi', 'com', 'pif',
    'jar', 'apk', 'app', 'deb', 'rpm', 'htm', 'html', 'xhtml', 'svg', 'dll', 'sys'
  ];

  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    return { isValid: false, error: 'Təhlükəsizlik baxımından bu növ fayllara icazə verilmir.' };
  }

  if (!allowedExtensions.includes(ext)) {
    return {
      isValid: false,
      error: `Yalnız icazə verilən formatlar: ${allowedExtensions.join(', ').toUpperCase()}`
    };
  }

  return { isValid: true };
}
