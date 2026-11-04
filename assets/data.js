/* Single source of truth for the portfolio. Edit here; nothing else needs touching. */
window.PORTFOLIO = {
  profile: {
    name: "Alireza Yazdi",
    nameFa: "علیرضا یزدی",
    email: "Alireza_Yazdi@nononick.ir",
    github: "https://github.com/alirezasyazdi941-hash",
    web: "https://nononick.ir",
    role: { en: "MSc student in Artificial Intelligence", fa: "دانشجوی کارشناسی ارشد هوش مصنوعی" },
    affiliation: { en: "Islamic Azad University, Dezful Branch · Iran", fa: "دانشگاه آزاد اسلامی واحد دزفول · ایران" },
    tagline: {
      en: "I build research tools, intelligent systems and interactive web platforms.",
      fa: "ابزارهای پژوهشی، سامانه‌های هوشمند و پلتفرم‌های وب تعاملی می‌سازم."
    },
    interests: {
      en: ["Machine learning", "Intelligent systems & robotics", "Research tooling", "Applied computer vision", "Human–computer interaction"],
      fa: ["یادگیری ماشین", "سامانه‌های هوشمند و رباتیک", "ابزارهای پژوهشی", "بینایی ماشین کاربردی", "تعامل انسان و رایانه"]
    }
  },
  ui: {
    en: { film: "Watch the film", enter: "Open the phone", hint: "Tap an app to open it", about: "About", github: "GitHub", mail: "Email", openFull: "Open full page", close: "Close", loading: "Loading…", projects: "Projects", live: "Live demo", tech: "Built with", interests: "Research interests", contact: "Contact", scroll: "Explore" },
    fa: { film: "تماشای فیلم", enter: "باز کردن گوشی", hint: "برای باز کردن یک اپ روی آن بزنید", about: "درباره", github: "گیت‌هاب", mail: "ایمیل", openFull: "باز کردن تمام‌صفحه", close: "بستن", loading: "در حال بارگذاری…", projects: "پروژه‌ها", live: "دموی زنده", tech: "ساخته‌شده با", interests: "علایق پژوهشی", contact: "ارتباط", scroll: "کاوش" }
  },
  apps: [
    { id: "alireza-path", cat: "research", path: "apps/alireza-path/index.html", glyph: "path", hue: [215, 175],
      name: { en: "Alireza Path", fa: "راه علیرضا" },
      desc: {
        en: "Personal academic-path planner: PhD admissions pages, research libraries, labs, conferences, a skills checklist, calendar and notes. Offline-capable PWA; data never leaves the device.",
        fa: "برنامه‌ریز مسیر علمی شخصی: صفحات پذیرش دکتری، کتابخانه‌ها، آزمایشگاه‌ها، کنفرانس‌ها، چک‌لیست مهارت، تقویم و یادداشت. PWA آفلاین؛ داده‌ها روی همین دستگاه می‌مانند."
      },
      tech: ["Vanilla JS", "PWA", "localStorage"] },
    { id: "docscan-iran", cat: "tools", path: "apps/docscan-iran/index.html", glyph: "scan", hue: [160, 190],
      name: { en: "DocScan Iran", fa: "اسکنر مدارک ایران" },
      desc: {
        en: "Client-side document scanner for university portals: perspective correction, shadow removal and precise file-size control, running entirely in the browser with OpenCV.js.",
        fa: "اسکنر مدارک برای سامانه‌های دانشگاهی: تصحیح پرسپکتیو، حذف سایه و کنترل دقیق حجم فایل؛ کاملاً داخل مرورگر با OpenCV.js."
      },
      tech: ["React", "OpenCV.js", "PWA"] },
    { id: "storyframe", cat: "web", path: "apps/storyframe/index.html", glyph: "film", hue: [20, 340],
      name: { en: "StoryFrame", fa: "استوری‌فریم" },
      desc: {
        en: "Story-to-storyboard studio: turns paragraphs into timed scenes with images, previews them on canvas and exports a slideshow video with optional music and text-to-speech. Fully offline.",
        fa: "استودیوی تبدیل داستان به استوری‌بورد: هر پاراگراف یک صحنه با تصویر و زمان‌بندی، پیش‌نمایش روی بوم و خروجی ویدئو با موسیقی و خواندن متن. کاملاً آفلاین."
      },
      tech: ["Vanilla JS", "Canvas", "MediaRecorder"] },
    { id: "research-os", cat: "research", path: "apps/research-os/index.html", glyph: "atom", hue: [265, 215],
      name: { en: "Research OS", fa: "سامانه پژوهش" },
      desc: {
        en: "Bilingual research workspace: literature discovery, gap analysis, comparison matrix, experiment lab, knowledge graph, writing studio and publication-readiness checklist, with a built-in local analysis engine.",
        fa: "فضای کار پژوهشی دوزبانه: کشف منابع، تحلیل شکاف پژوهشی، ماتریس مقایسه، آزمایشگاه آزمایش، گراف دانش، استودیوی نگارش و چک‌لیست آمادگی انتشار؛ با موتور تحلیل محلی."
      },
      tech: ["Angular 21", "TypeScript", "Signals"] },
    { id: "void-cinema", cat: "web", path: "apps/void-cinema/index.html", glyph: "reel", hue: [350, 300],
      name: { en: "Void Cinema", fa: "ولد سینما" },
      desc: {
        en: "Cinema post-production and film studio workspace, delivered as an installable Angular PWA.",
        fa: "فضای کار پس‌تولید و استودیوی فیلم، به‌صورت PWA قابل نصب با Angular."
      },
      tech: ["Angular", "PWA", "Service Worker"] },
    { id: "webgl-studio", cat: "web", path: "apps/webgl-studio/index.html", glyph: "cube", hue: [190, 230],
      name: { en: "WebGL Studio", fa: "استودیوی WebGL" },
      desc: {
        en: "Builder for interactive scroll-driven WebGL sites (Lenis, GSAP, three.js) targeting GitHub Pages.",
        fa: "سازنده‌ی سایت‌های تعاملی اسکرول‌محور با WebGL (Lenis، GSAP، three.js) برای GitHub Pages."
      },
      tech: ["Angular", "Lenis", "GSAP", "three.js"] },
    { id: "uni-command", cat: "research", path: "apps/uni-command/index.html", glyph: "cap", hue: [45, 15],
      name: { en: "Uni Command", fa: "فرماندهی دانشگاهی" },
      desc: {
        en: "Academic-journey command center for planning university applications. The AI advisor needs a backend and is inactive on this static demo.",
        fa: "مرکز فرماندهی مسیر دانشگاهی برای برنامه‌ریزی اپلای. مشاور هوشمند به سرور نیاز دارد و در این دموی ایستا غیرفعال است."
      },
      tech: ["Angular", "TypeScript", "Tailwind"] },
    { id: "ai-lab", cat: "ai", path: "apps/ai-lab/index.html", glyph: "atom", hue: [150, 250],
      name: { en: "AI Lab", fa: "آزمایشگاه هوش مصنوعی" },
      desc: {
        en: "Browser-only text and image generation via Pollinations and Hugging Face. Every result is stored in IndexedDB under a SHA-256 key of the request, so repeats are instant and offline.",
        fa: "تولید متن و تصویر فقط در مرورگر با Pollinations و Hugging Face. هر نتیجه با کلید SHA-256 درخواست در IndexedDB ذخیره می‌شود، پس تکرار آن آنی و آفلاین است."
      },
      tech: ["IndexedDB", "SHA-256", "Hugging Face", "Pollinations"] },
    { id: "academic-intelligence", cat: "research", path: "apps/academic-intelligence/index.html", glyph: "atom", hue: [230, 190],
      name: { en: "Academic Intelligence", fa: "هوش دانشگاهی" },
      desc: {
        en: "Personal research operating system: literature search through OpenAlex, reading lists and study planning, stored locally in IndexedDB. AI features need your own HTTPS backend and are off in this static demo.",
        fa: "سیستم‌عامل پژوهشی شخصی: جستجوی منابع با OpenAlex، فهرست مطالعه و برنامه‌ریزی، با ذخیره‌ی محلی در IndexedDB. بخش هوش مصنوعی به سرور شخصی نیاز دارد و در این دمو غیرفعال است."
      },
      tech: ["Angular", "OpenAlex", "IndexedDB"] },
    { id: "ali-english-academy", cat: "research", path: "apps/ali-english-academy/index.html", glyph: "cap", hue: [330, 270],
      name: { en: "Ali English Academy", fa: "آکادمی انگلیسی علی" },
      desc: {
        en: "Private English-language academy with a structured curriculum, runs locally as a PWA.",
        fa: "آکادمی خصوصی زبان انگلیسی با برنامه‌ی درسی ساختاریافته که به‌صورت PWA محلی اجرا می‌شود."
      },
      tech: ["Angular", "PWA"] },
    { id: "ghahar", cat: "ai", path: "apps/ghahar/index.html", glyph: "film", hue: [25, 345],
      name: { en: "Ghahar Translator", fa: "قهار، مترجم هوشمند" },
      desc: {
        en: "Offline-first smart translator interface in vanilla JavaScript with self-hosted fonts.",
        fa: "رابط مترجم هوشمند آفلاین‌محور با جاوااسکریپت خالص و فونت‌های محلی."
      },
      tech: ["JavaScript", "PWA", "RTL"] },
    { id: "reality-forge", cat: "web", path: "apps/reality-forge/index.html", glyph: "cube", hue: [185, 265],
      name: { en: "Reality Forge", fa: "کارگاه واقعیت" },
      desc: {
        en: "Browser AR/VR studio: write three.js scenes in a live code editor and preview them instantly. The preview sandbox loads three.js from a CDN.",
        fa: "استودیوی واقعیت افزوده و مجازی در مرورگر: صحنه‌های three.js را در ویرایشگر زنده بنویس و فوراً ببین. پیش‌نمایش، three.js را از CDN می‌گیرد."
      },
      tech: ["Angular", "three.js", "WebXR"] },
    { id: "site-os", cat: "tools", path: "apps/site-os/index.html", glyph: "reel", hue: [205, 160],
      name: { en: "Site OS", fa: "سایت‌ساز موبایل" },
      desc: {
        en: "Mobile-first website builder with editable project files that you can export and restore.",
        fa: "سایت‌ساز موبایل‌محور با فایل پروژه‌ی قابل‌ویرایش که می‌توان خروجی گرفت و بازیابی کرد."
      },
      tech: ["Angular", "TypeScript", "JSZip"] },
    { id: "universal-code-hub", cat: "tools", path: "apps/universal-code-hub/index.html", glyph: "git", hue: [255, 200],
      name: { en: "Universal Code Hub", fa: "مرکز کد جهانی" },
      desc: {
        en: "Move and sync code between projects and GitHub from the browser; data is kept locally in IndexedDB.",
        fa: "انتقال و همگام‌سازی کد بین پروژه‌ها و گیت‌هاب از مرورگر؛ داده‌ها به‌صورت محلی در IndexedDB می‌ماند."
      },
      tech: ["Angular", "IndexedDB", "GitHub API"] }
  ]
};
