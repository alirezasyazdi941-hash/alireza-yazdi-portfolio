# GHAHAR — Vanilla Hybrid PWA

نسخه مستقل HTML5/CSS3/Vanilla JavaScript از رابط قهار، با پشتیبانی PWA و ذخیره‌سازی محلی.

## اجرا
این پروژه را روی یک هاست استاتیک یا لوکال‌سرور اجرا کنید. برای مثال:
`python3 -m http.server 8080`
سپس `http://localhost:8080` را باز کنید. Service Worker و نصب PWA روی `file://` کار نمی‌کنند.

## اتصال موتور ترجمه
از تنظیمات برنامه، آدرس یک endpoint امن HTTPS را وارد کنید. درخواست POST با این ساختار ارسال می‌شود:
```json
{"text":"Hello","sourceLang":"auto","targetLang":"fa","tone":"daily"}
```
پاسخ قابل قبول:
```json
{"success":true,"data":{"primaryTranslation":"سلام"}}
```
یا:
```json
{"translation":"سلام"}
```
این پروژه عمداً API Key را در مرورگر نگه نمی‌دارد. endpoint باید در سرور شما کلید Gemini یا ارائه‌دهنده دیگر را نگه دارد و CORS را برای دامنه برنامه تنظیم کند.

## آفلاین و iPhone
- پوسته برنامه، CSS و JavaScript توسط Service Worker کش می‌شوند.
- تاریخچه، علاقه‌مندی‌ها و یادآورها در LocalStorage همین مرورگر ذخیره می‌شوند.
- ترجمه هوشمند در حالت آفلاین در دسترس نیست؛ برای ترجمه واقعی باید مدل ترجمه محلی جداگانه به پروژه اضافه شود.
- در iPhone با Safari باز کنید: Share → Add to Home Screen.
- برای نصب و Service Worker باید HTTPS یا localhost استفاده شود.

## ساختار
- `index.html`: ساختار رابط
- `css/app.css`: طراحی Obsidian Ice / Neon Cyan
- `js/app.js`: منطق برنامه و API adapter
- `data/*.json`: پیکربندی‌های مستقل
- `manifest.json`, `sw.js`: قابلیت PWA و کش آفلاین

## نکته امنیتی
از قرار دادن کلید خصوصی Gemini در `app.js` یا تنظیمات مرورگر خودداری کنید. از backend/serverless function امن استفاده کنید.
