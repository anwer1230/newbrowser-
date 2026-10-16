# Chromium Clone Browser & Video Studio (Stage 1, 2 & 3)

متصفح متقدم وتطبيق ويب تقدمي (PWA) متكامل مستوحى من Chromium مع ميزات تسجيل الفيديو، التنزيلات الموحدة، وخزنة كلمات المرور المشفرة.

---

## 🌟 الميزات الرئيسية (المراحل 1 و 2 و 3)

1. **إشعار التثبيت الفعلي (PWA Real App Install):**
   - تثبيت التطبيق مباشرة على سطح المكتب (Windows / Mac / Linux) أو الهواتف الذكية (Android / iOS).
   - يعمل بكامل الشاشة وبدون إطار المتصفح كأي تطبيق أصيل.
   - كاش أوفلاين وسرعة تشغيل فائقة عبر Service Worker.

2. **لوحة التنزيلات الموحّدة (Unified Downloads Panel):**
   - إدارة تنزيلات MP4 و HLS (m3u8) و MSE.
   - عرض السرعة الحية، الحجم، وشريط التقدم.
   - إمكانية الإيقاف المؤقت (Pause)، الاستئناف (Resume)، الإلغاء (Cancel)، والحذف (Delete).

3. **خزنة كلمات المرور المشفّرة (AES-256-GCM Vault):**
   - حماية الحسابات بتشفير عسكري AES-GCM 256-bit واشتقاق مفاتيح PBKDF2 (SHA-256).
   - قفل وفتح بكلمة مرور رئيسية أو مفتاح النظام.
   - الملء التلقائي ونسخ البيانات بضغطة واحدة.

4. **مدير إضافات Chrome (Unpacked Extensions):**
   - دعم تثبيت الإضافات المفكوكة عبر `manifest.json`.
   - إضافات مسبقة: AdBlock Pro Ultra، Dark Reader، Video Speed & MSE Sniffer.

5. **المزامنة السحابية (WebDAV Cloud Sync):**
   - مزامنة قاعدة البيانات وسجل المشاهدة مع Nextcloud / ownCloud / WebDAV.
   - ميزات الرفع (Push) والجلب (Pull) واختبار الاتصال.

6. **مكتبة الفيديوهات ومشغل الأوفلاين:**
   - قسم "متابعة المشاهدة" للاستئناف التلقائي من آخر ثانية.
   - تشغيل محلي بدون إنترنت عبر `cache://local/`.

7. **شبكة WireGuard VPN:**
   - إدارة أنفاق WireGuard مع مفتاح قطع الإنترنت (Kill Switch) واستيراد ملفات `.conf`.

---

## 🚀 إعدادات النشر على Render (Render Deployment Guide)

### الطريقة الأولى: كـ Static Site (الأفضل والأسرع ومجاني 100%)

1. اذهب إلى [dashboard.render.com](https://dashboard.render.com).
2. اضغط **New +** ثم اختر **Static Site**.
3. اربط مستودع GitHub: `https://github.com/anwer1230/newbrowser-`.
4. أدخل الإعدادات التالية:
   - **Name:** `chromium-clone-browser`
   - **Branch:** `main` (أو `master`)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. في قسم **Redirects/Rewrites**:
   - اضغط **Add Rewrite**.
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`
6. اضغط **Create Static Site**.

---

### الطريقة الثانية: عبر Blueprint تلقائياً (`render.yaml`)

- التطبيق يحتوي بالفعل على ملف `render.yaml`.
- عند اختيار **New +** -> **Blueprint** واختيار المستودع، سيقوم Render بقراءة الإعدادات وبناء الموقع تلقائياً.

---

## 💻 التشغيل المحلي كبرنامج سطح مكتب Electron

```bash
# 1. تثبيت الحزم
npm install

# 2. بناء better-sqlite3 لـ Electron
npx electron-rebuild -f -w better-sqlite3

# 3. تشغيل المتصفح
npm start
```
