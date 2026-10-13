# Public GitHub Publishing & Zero-Data-Leakage Cloud Architecture

A comprehensive strategy and technical implementation plan to safely host and deploy the Smart Eura platform via a public GitHub repository without exposing candidate CVs, client inquiries, or internal operational databases.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed to protect all proprietary records and applicant privacy before publishing the repository publicly.

- **Confirmed Decision 1 (Deployment Model)**: Only the compiled static build output (`docs` / `dist`) or a dedicated deployment pipeline will serve the public web frontend, preventing exposure of raw uncompiled development files or sensitive local assets.
- **Confirmed Decision 2 (Database Isolation)**: Zero applicant CVs or client inquiries will ever reside in git or client-side bundles. All real applications and client requests reside exclusively in Google Cloud Firestore protected by strict Role-Based Access Control (`isAdmin` security rules).
- **Recommended Default (Public Web Client Keys)**: Firebase Web Client Config (`apiKey`, `projectId`) remains safe for public client-side deployment because authorization is enforced strictly server-side by Firestore rules, requiring authenticated admin identity (`xgoodofficial@gmail.com`) for all read, list, and modification operations.

---

## 1. Overview & Core Concept

- **What It Does**: Enables Smart Eura to publish its website repository to a public GitHub account (for GitHub Pages hosting, transparency, or open showcase) while guaranteeing enterprise-grade data isolation. No sensitive applicant resumes, contact inquiries, or administrative data will ever be visible in the public repository, git history, or client bundles.
- **Target Audience / Persona**:
  - **Public Visitors & Clients**: Access the high-performance multilingual portal (FR, LT, NL, TR, EN), view vacancies, and submit inquiries or job applications securely.
  - **Company Leadership & Recruiters**: Log in securely via Google Workspace / Firebase Auth (`xgoodofficial@gmail.com`) to manage vacancies, review incoming candidate dossiers, and download applicant CVs without exposing records publicly.
  - **Open-Source Auditors**: Inspect the clean public repository without finding any private candidate records, plaintext passwords, or administrative tokens.
- **Key Value**: 100% compliance with European GDPR privacy requirements and total protection of customer inquiries, even when the underlying website codebase is hosted in a public GitHub repository.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Public Candidate Submission Flow**: Candidates view European vacancies, fill in application details, and attach their CV. The payload streams directly to Firestore's `candidate_applications` collection via write-only rules. No CV or personal data is cached to public repos or disk.
  2. **Public Client Inquiry Flow**: Industrial clients submit workforce requests via interactive forms. The submission is validated and written directly to Firestore's `client_inquiries` collection.
  3. **Protected Admin Management Flow**: Administrators access the portal, authenticate using their authorized Google Account (`xgoodofficial@gmail.com`), and unlock real-time Firestore synchronization for candidate review and CRM inquiries. Unauthorized public visitors attempting to query the collections receive an immediate permission denial.
  4. **Public Build Verification Flow**: The GitHub repository contains only clean source code, sample templates, and compiled distribution assets; no proprietary operational records exist in the git tree.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Refined Swiss-industrial corporate aesthetic, high trust, precision engineering typography, and emerald-toned confidence.
  - *Color Palette & Tokens*: Forest Deep (`#123F32`), Alpine Sage (`#586B62`), Crisp Snow Canvas (`#F8F9F6`), and Slate Neutral borders.
  - *Interactive Feedback*: Non-blocking toast notifications for CV uploads and inquiry submissions; zero disruptive browser alerts; fluid animated state transitions with feedback on every network action.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Cloud Firestore RBAC vs. Local Storage Fallbacks**
  - *Chosen Approach*: Candidate applications and client inquiries are decoupled entirely from hardcoded repository data and client `localStorage`. Real submissions stream directly to Firestore.
  - *Why*: In a public GitHub repository, any hardcoded mock data that resembles real individuals risks GDPR violations or privacy leaks. Firestore guarantees that only authenticated recruiters can read the data.
  - *Alternatives Considered*: Bundling JSON files in the repo was rejected as it directly exposes database records to anyone viewing the public GitHub repository.

- **Decision 2: Public Client Config vs. Private Service Account Credentials**
  - *Chosen Approach*: Maintain only the public Firebase Web Client initialization parameters in the repo, while completely excluding and `.gitignore`-ing any Google Cloud Service Account JSON keys or private administrative credentials.
  - *Why*: Client-side Firebase configs (`apiKey`, `appId`, `projectId`) are public identifiers by design in all web apps. Real security is governed by server-side Firestore security rules that verify the caller's cryptographic JWT token.
  - *Alternatives Considered*: Storing server-side admin keys in client environment variables was rejected as a severe vulnerability.

- **Decision 3: Automated Clean Build & Git Ignore Hardening**
  - *Chosen Approach*: Configure strict `.gitignore` rules to prevent accidental commits of `.env`, temporary file dumps, uploaded PDFs, or test artifacts, and provide a pre-publish audit check script.
  - *Why*: Prevents accidental human error when pushing local commits to GitHub.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Security Boundary

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PUBLIC GITHUB REPOSITORY                        │
│                                                                        │
│   ┌──────────────────────────┐         ┌───────────────────────────┐   │
│   │  Clean Source Code (src) │         │ Compiled Assets (docs/)   │   │
│   │  - Zero private records  │ ──────> │ - Minified JS & CSS       │   │
│   │  - Clean data schemas    │         │ - GitHub Pages entrypoint │   │
│   │  - Hardened .gitignore   │         │ - No private data baked in│   │
│   └──────────────────────────┘         └───────────────────────────┘   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Deployed to Web
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     USER BROWSER / CLIENT APPLICATION                  │
│                                                                        │
│   ┌─────────────────────────┐           ┌──────────────────────────┐   │
│   │ Candidate & Client Form │           │ Admin Portal & CRM Hub   │   │
│   │ Public Write Requests   │           │ Google Auth Gatekeeper   │   │
│   └────────────┬────────────┘           └────────────┬─────────────┘   │
└────────────────┼─────────────────────────────────────┼─────────────────┘
                 │ Public Submission                   │ Authorized JWT
                 │ (Write Only)                        │ (xgoodofficial)
                 ▼                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      GOOGLE CLOUD / FIRESTORE ENGINE                   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 FIRESTORE SECURITY RULES LAYER                 │   │
│   │  • match /candidate_applications/*                             │   │
│   │      allow create: if isValidPayload()                         │   │
│   │      allow read, list, update, delete: if isAdmin()            │   │
│   │  • match /client_inquiries/*                                   │   │
│   │      allow create: if isValidPayload()                         │   │
│   │      allow read, list, update, delete: if isAdmin()            │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│                                    ▼                                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                    ENCRYPTED CLOUD DATABASE                    │   │
│   │  • candidate_applications  • client_inquiries                  │   │
│   │  • contact_submissions     • secure user accounts              │   │
│   │     (Completely isolated from GitHub, never in repo)           │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Strategy

- **`candidate_applications` Collection**:
  - Fields: `id`, `vacancyId`, `vacancyTitle`, `fullName`, `email`, `phone`, `citizenship`, `experienceYears`, `coverLetter`, `cvFileName`, `cvFileType`, `cvDataUrl` (or storage reference), `submittedAt`, `status`.
  - Permissions: Write-only for anonymous applicants; Read/List/Update restricted exclusively to `xgoodofficial@gmail.com`.
- **`client_inquiries` Collection**:
  - Fields: `id`, `companyName`, `contactPerson`, `email`, `phone`, `country`, `projectScope`, `estimatedPersonnel`, `message`, `submittedAt`, `status`.
  - Permissions: Write-only for anonymous business leads; Read/List/Update restricted exclusively to `isAdmin()`.
- **`contact_submissions` Collection**:
  - Fields: `id`, `fullName`, `email`, `subject`, `message`, `submittedAt`.
  - Permissions: Public create; Admin-only read/manage.
- **Repository Cleanliness Standard**:
  - Zero mock resumes containing real contact details.
  - Zero `.env` files with secret API keys.
  - Production build in `docs/` contains only static code, while all persistent business data remains exclusively in the Firestore cloud database.

### Implementation Milestones & Steps

1. **Step 1: Data Sanitization & Decoupling**
   - Verify and ensure `initialData.ts` contains only public organizational vacancies, structural site settings, and zero personal candidate/inquiry records.
   - Connect the Admin panel to pull active candidate applications and inquiries dynamically from Firestore when an authorized admin logs in, rather than relying on local repository files.
2. **Step 2: Security Rules & Environment Hardening**
   - Verify `firestore.rules` enforces admin-only access (`isAdmin()`) for listing all applications and inquiries.
   - Update `.gitignore` to comprehensively block any credential dumps, sensitive local environment files (`.env*` except `.env.example`), and temporary files.
3. **Step 3: GitHub Deployment Pipeline & Documentation**
   - Provide a step-by-step GitHub publishing checklist and documentation for the user, detailing how to push only clean code and keep `docs/` ready for GitHub Pages without leaking any database contents.
   - Run compilation and production build (`npm run build`) to ensure the generated `docs/` folder is pristine, fast, and completely free of database leaks.
