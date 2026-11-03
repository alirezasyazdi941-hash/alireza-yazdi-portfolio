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
    en: { enter: "Open the phone", hint: "Tap an app to open it", about: "About", github: "GitHub", mail: "Email", openFull: "Open full page", close: "Close", loading: "Loading…", projects: "Projects", live: "Live demo", tech: "Built with", interests: "Research interests", contact: "Contact", scroll: "Explore" },
    fa: { enter: "باز کردن گوشی", hint: "برای باز کردن یک اپ روی آن بزنید", about: "درباره", github: "گیت‌هاب", mail: "ایمیل", openFull: "باز کردن تمام‌صفحه", close: "بستن", loading: "در حال بارگذاری…", projects: "پروژه‌ها", live: "دموی زنده", tech: "ساخته‌شده با", interests: "علایق پژوهشی", contact: "ارتباط", scroll: "کاوش" }
  },
  apps: [
    { id: "alireza-path", path: "apps/alireza-path/index.html", glyph: "path", hue: [215, 175],
      name: { en: "Alireza Path", fa: "راه علیرضا" },
      desc: {
        en: "Personal academic-path planner: PhD admissions pages, research libraries, labs, conferences, a skills checklist, calendar and notes. Offline-capable PWA; data never leaves the device.",
        fa: "برنامه‌ریز مسیر علمی شخصی: صفحات پذیرش دکتری، کتابخانه‌ها، آزمایشگاه‌ها، کنفرانس‌ها، چک‌لیست مهارت، تقویم و یادداشت. PWA آفلاین؛ داده‌ها روی همین دستگاه می‌مانند."
      },
      tech: ["Vanilla JS", "PWA", "localStorage"] },
    { id: "docscan-iran", path: "apps/docscan-iran/index.html", glyph: "scan", hue: [160, 190],
      name: { en: "DocScan Iran", fa: "اسکنر مدارک ایران" },
      desc: {
        en: "Client-side document scanner for university portals: perspective correction, shadow removal and precise file-size control, running entirely in the browser with OpenCV.js.",
        fa: "اسکنر مدارک برای سامانه‌های دانشگاهی: تصحیح پرسپکتیو، حذف سایه و کنترل دقیق حجم فایل؛ کاملاً داخل مرورگر با OpenCV.js."
      },
      tech: ["React", "OpenCV.js", "PWA"] },
    { id: "storyframe", path: "apps/storyframe/index.html", glyph: "film", hue: [20, 340],
      name: { en: "StoryFrame", fa: "استوری‌فریم" },
      desc: {
        en: "Story-to-storyboard studio: turns paragraphs into timed scenes with images, previews them on canvas and exports a slideshow video with optional music and text-to-speech. Fully offline.",
        fa: "استودیوی تبدیل داستان به استوری‌بورد: هر پاراگراف یک صحنه با تصویر و زمان‌بندی، پیش‌نمایش روی بوم و خروجی ویدئو با موسیقی و خواندن متن. کاملاً آفلاین."
      },
      tech: ["Vanilla JS", "Canvas", "MediaRecorder"] },
    { id: "research-os", path: "apps/research-os/index.html", glyph: "atom", hue: [265, 215],
      name: { en: "Research OS", fa: "سامانه پژوهش" },
      desc: {
        en: "Bilingual research workspace: literature discovery, gap analysis, comparison matrix, experiment lab, knowledge graph, writing studio and publication-readiness checklist, with a built-in local analysis engine.",
        fa: "فضای کار پژوهشی دوزبانه: کشف منابع، تحلیل شکاف پژوهشی، ماتریس مقایسه، آزمایشگاه آزمایش، گراف دانش، استودیوی نگارش و چک‌لیست آمادگی انتشار؛ با موتور تحلیل محلی."
      },
      tech: ["Angular 21", "TypeScript", "Signals"] },
    { id: "void-cinema", path: "apps/void-cinema/index.html", glyph: "reel", hue: [350, 300],
      name: { en: "Void Cinema", fa: "ولد سینما" },
      desc: {
        en: "Cinema post-production and film studio workspace, delivered as an installable Angular PWA.",
        fa: "فضای کار پس‌تولید و استودیوی فیلم، به‌صورت PWA قابل نصب با Angular."
      },
      tech: ["Angular", "PWA", "Service Worker"] },
    { id: "webgl-studio", path: "apps/webgl-studio/index.html", glyph: "cube", hue: [190, 230],
      name: { en: "WebGL Studio", fa: "استودیوی WebGL" },
      desc: {
        en: "Builder for interactive scroll-driven WebGL sites (Lenis, GSAP, three.js) targeting GitHub Pages.",
        fa: "سازنده‌ی سایت‌های تعاملی اسکرول‌محور با WebGL (Lenis، GSAP، three.js) برای GitHub Pages."
      },
      tech: ["Angular", "Lenis", "GSAP", "three.js"] },
    { id: "uni-command", path: "apps/uni-command/index.html", glyph: "cap", hue: [45, 15],
      name: { en: "Uni Command", fa: "فرماندهی دانشگاهی" },
      desc: {
        en: "Academic-journey command center for planning university applications. The AI advisor needs a backend and is inactive on this static demo.",
        fa: "مرکز فرماندهی مسیر دانشگاهی برای برنامه‌ریزی اپلای. مشاور هوشمند به سرور نیاز دارد و در این دموی ایستا غیرفعال است."
      },
      tech: ["Angular", "TypeScript", "Tailwind"] },
    { id: "ai-lab", path: "apps/ai-lab/index.html", glyph: "atom", hue: [150, 250],
      name: { en: "AI Lab", fa: "آزمایشگاه هوش مصنوعی" },
      desc: {
        en: "Browser-only text and image generation via Pollinations and Hugging Face. Every result is stored in IndexedDB under a SHA-256 key of the request, so repeats are instant and offline.",
        fa: "تولید متن و تصویر فقط در مرورگر با Pollinations و Hugging Face. هر نتیجه با کلید SHA-256 درخواست در IndexedDB ذخیره می‌شود، پس تکرار آن آنی و آفلاین است."
      },
      tech: ["IndexedDB", "SHA-256", "Hugging Face", "Pollinations"] }
  ]
};
