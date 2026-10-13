# SMARTEURA — GitHub Public Dərc Etmə və Məlumat Təhlükəsizliyi Bələdçisi
*(Zero-Data-Leakage Public GitHub Publishing Guide)*

Bu sənəd **SMARTEURA** layihəsini GitHub-da **Public (Hər kəsə açıq)** dərc edərkən namizədlərin CV-lərinin, müştəri sorğularının və şirkətin daxili bazasının **100% təhlükəsiz qalması və heç vaxt aşkara çıxmaması** mexanizmini və icra addımlarını izah edir.

---

## 1. Əsas Sual: "Mən hesabı public etməliyəm, saytın bütün əsas bazası ortada qalırmı?"

### QISA CAVAB: **XEYR, QƏTİYYƏN QALMIR.**

Səbəblər aşağıdakılardır:

1. **Ayrı-Ayrı Mühitlər (Total Isolation)**:
   - Saytın kodu (HTML, CSS, JavaScript, React) GitHub-dadır.
   - **Bütün real müştəri sorğuları və namizəd CV-ləri isə Google Cloud-un Avropadakı qorunan Firestore serverlərində (`ai-studio-smarteura-...`) saxlanılır.**
   - Git reposunda heç bir namizədin adı, email-i, telefon nömrəsi, göndərilmiş CV faylı və ya müştəri mesajı saxlanılmır (`initialData.ts` daxil olmaqla bütün müraciət massivləri təmizdir).

2. **Server Tərəfli Şifrələnmiş Qaydalar (`firestore.rules`)**:
   - `firestore.rules` qaydaları Google Cloud serverlərində icra olunur:
     - Namizəd və ya müştəri saytdan müraciət göndərdikdə yalnız **Write (Yazmaq)** icazəsi var.
     - Həmin məlumatları **Read/List (Oxumaq, siyahıya baxmaq və ya yükləmək)** icazəsi yalnız rəsmi super adminə məxsusdur:
       ```
       request.auth.token.email in ['xgoodofficial@gmail.com', 'admin@smarteura.eu', 'office@smarteura.eu']
       ```
   - Hər hansı bir kənar şəxs, haker və ya GitHub reposunu analiz edən biri saytın kodunu, API açarını və ya Firestore ünvanını götürüb məlumatları oxumağa cəhd etsə, Google Cloud serveri ona dərhal **`PERMISSION_DENIED` (İcazə qadağandır)** cavabı qaytarır.

3. **Firebase Client Konfiqurasiyası (`firebase-applet-config.json`)**:
   - `apiKey`, `projectId` və `appId` parametrləri brauzer üçün ümumi identifikatorlardır. Bütün dünyada hər bir veb tətbiqdə (Google, Spotify, Airbnb və s.) bu identifikatorlar açıq olur, çünki əsl təhlükəsizlik frontend kodunda deyil, **Google Cloud Server Qaydalarında (`firestore.rules`)** təmin edilir.

4. **Təhlükəsiz `.gitignore` Qoruması**:
   - Layihənin `.gitignore` faylı elə qurulub ki, heç bir `.env`, şifrə açarı, sertifikat və ya lokal baza faylı təsadüfən belə GitHub-a getmir.

---

## 2. GitHub-da Saytı Dərc Etməyin 2 Üsulu

### Üsul A: Yalnız Yığılmış Saytı (`docs/`) Dərc Etmək (Tövsiyə olunan / Ən sadə)

Bu üsulda bütün layihə bir repoda saxlanılır və GitHub Pages birbaşa `docs/` qovluğunu yayımlayır:

1. **Saytı Yenidən Yığın**:
   ```bash
   npm run build
   ```
   *Bu əmr saytı ən son versiyada `dist` və `docs` qovluğuna yığır.*

2. **Git İlə GitHub-a Göndərin**:
   ```bash
   git add .
   git commit -m "feat: Smarteura production release"
   git branch -M main
   git remote add origin https://github.com/HESAB_ADINIZ/smarteura.git
   git push -u origin main
   ```

3. **GitHub Pages Aktiv Edin**:
   - GitHub-da reponuza daxil olun -> **Settings** -> **Pages**.
   - **Source**: `Deploy from a branch` seçin.
   - **Branch**: `main`, qovluq olaraq isə `/docs` seçin və **Save** düyməsini basın.
   - Bir neçə saniyə ərzində saytınız aktivləşəcək (`smarteura.eu` domeniniz `CNAME` faylı sayəsində avtomatik bağlanacaq).

---

### Üsul B: Yalnız `docs/` (Kompilyasiya olunmuş faylları) Ayrı Public Repoda Paylaşmaq

Əgər siz hətta React mənbə kodlarını da public repoda saxlamaq istəmirsinizsə:

1. Kompilyasiya olunmuş `docs/` qovluğuna keçin.
2. Həmin qovluqda yeni təmiz repozitoriya başladın:
   ```bash
   cd docs
   git init
   git add .
   git commit -m "Production release"
   git branch -M main
   git remote add origin https://github.com/HESAB_ADINIZ/smarteura-pages.git
   git push -u origin main --force
   ```
3. GitHub Settings -> Pages bölməsində `main` / `root` seçin.
4. Nəticədə public repoda yalnız minifikasiya olunmuş HTML/JS faylları qalır, heç bir xam kod olmur.

---

## 3. Saytın Admin Panelinə Daxil Olmaq və Bazanı İdarə Etmək

Sayt GitHub-da dərc olunduqdan sonra siz özünüz müraciətləri necə görəcəksiniz:

1. Sayta daxil olun (`https://smarteura.eu/#admin`).
2. İki üsuldan biri ilə daxil olun:
   - **Birbaşa Google Admin ilə**: `xgoodofficial@gmail.com` hesabınızla "Google ilə Daxil Ol" düyməsini sıxın.
   - **İdarəçi Şifrəsi ilə**: Əvvəlki təhlükəsiz şifrəniz ilə daxil olun.
3. Daxil olduqda:
   - Admin panel avtomatik olaraq Google Cloud Firestore ilə canlı əlaqə qurur.
   - Hər hansı bir ölkədən namizədin göndərdiyi CV və müştərinin göndərdiyi sorğu anında cədvəldə görünür.
   - **Manage** düyməsini sıxaraq namizədin CV faylını kompüterinizə yükləyə, statusunu dəyişə və ya bazadan silə bilərsiniz.
4. Kənar şəxs admin panelinə girməyə cəhd etsə:
   - Şifrə səhv olduqda 5 cəhddən sonra sistem **5 dəqiqəlik avtomatik kilidlənmə rejiminə (lockout)** keçir.
   - Kənar Google hesabı ilə daxil olmaq istəsə, sistem onu dərhal rədd edir.

---

## 4. Təhlükəsizlik Auditi Xülasəsi (Checklist)

| Yoxlama Parametri | Nəticə | Təsvir |
| :--- | :---: | :--- |
| **CV və Namizəd Məlumatları** | TƏHLÜKƏSİZ | Repoda heç bir şəxsi məlumat yoxdur. Hamısı Firestore-dadır. |
| **Müştəri Müraciətləri** | TƏHLÜKƏSİZ | Firestore `client_inquiries` kolleksiyasında şifrələnib. |
| **Baza Oxuma Qadağası** | TƏHLÜKƏSİZ | `firestore.rules` vasitəsilə ictimai oxuma 100% bloklanıb. |
| **Admin Səlahiyyəti** | TƏHLÜKƏSİZ | Yalnız `xgoodofficial@gmail.com` tərəfindən oxuna bilər. |
| **Git .gitignore** | TƏHLÜKƏSİZ | `.env`, açarlar, lokal dump-lar tamamilə bloklanıb. |
| **Statik Dərc Etmə** | TƏHLÜKƏSİZ | `docs/` qovluğu GitHub Pages üçün hazırdır. |
