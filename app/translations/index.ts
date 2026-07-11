export const en = {
  "app.name": "CityWallet",

  "sidebar.mainMenu": "MAIN MENU",
  "sidebar.city": "My City",
  "sidebar.insights": "AI Insights",
  "sidebar.expenses": "Expenses",
  "sidebar.leaderboard": "Leaderboard",
  "sidebar.challenge": "Weekly Monster",
  "sidebar.profile": "Profile",
  "sidebar.settings": "Settings",

  "settings.eyebrow": "APPLICATION PREFERENCES",
  "settings.title": "Settings",
  "settings.description":
    "Customize your language and CityWallet experience.",

  "settings.language.title": "Application language",
  "settings.language.description":
    "Choose the language you want to use across CityWallet.",

  "settings.language.arabic": "Arabic",
  "settings.language.english": "English",

  "settings.language.arabicDescription":
    "Use CityWallet in Arabic with a right-to-left layout.",

  "settings.language.englishDescription":
    "Use CityWallet in English with a left-to-right layout.",

  "settings.current": "Current language",
  "settings.selected": "Selected",
  "settings.saved": "Language preference saved",

  "settings.preview.title": "Language preview",
  "settings.preview.description":
    "This preview changes immediately when you select a language.",

  "settings.preview.balance": "Available balance",
  "settings.preview.expense": "Add Expense",
  "settings.preview.message":
    "Your financial city is stable and your budget is under control.",

  "settings.backend.title": "Backend ready",
  "settings.backend.description":
    "The selected language is currently stored in the browser. Later, it can be saved in the user's account through the backend.",

  "settings.backend.field": "Suggested backend field",

  "common.sar": "SAR",
} as const;

export type TranslationKey = keyof typeof en;

export const ar: Record<TranslationKey, string> = {
  "app.name": "فين سيتي",

  "sidebar.mainMenu": "القائمة الرئيسية",
  "sidebar.city": "مدينتي",
  "sidebar.insights": "التحليلات الذكية",
  "sidebar.expenses": "المصروفات",
  "sidebar.leaderboard": "لوحة المتصدرين",
  "sidebar.challenge": "تحدي الأسبوع",
  "sidebar.profile": "الملف الشخصي",
  "sidebar.settings": "الإعدادات",

  "settings.eyebrow": "تفضيلات التطبيق",
  "settings.title": "الإعدادات",
  "settings.description":
    "خصص اللغة وتجربة استخدام فين سيتي.",

  "settings.language.title": "لغة التطبيق",
  "settings.language.description":
    "اختر اللغة التي تريد استخدامها في جميع صفحات فين سيتي.",

  "settings.language.arabic": "العربية",
  "settings.language.english": "الإنجليزية",

  "settings.language.arabicDescription":
    "استخدم فين سيتي باللغة العربية وبتصميم من اليمين إلى اليسار.",

  "settings.language.englishDescription":
    "استخدم فين سيتي باللغة الإنجليزية وبتصميم من اليسار إلى اليمين.",

  "settings.current": "اللغة الحالية",
  "settings.selected": "تم الاختيار",
  "settings.saved": "تم حفظ تفضيل اللغة",

  "settings.preview.title": "معاينة اللغة",
  "settings.preview.description":
    "تتغير هذه المعاينة مباشرة عند اختيار اللغة.",

  "settings.preview.balance": "الرصيد المتاح",
  "settings.preview.expense": "إضافة مصروف",
  "settings.preview.message":
    "مدينتك المالية مستقرة وميزانيتك تحت السيطرة.",

  "settings.backend.title": "جاهز للربط بالخلفية",
  "settings.backend.description":
    "يتم حاليًا حفظ اللغة المختارة في المتصفح، ويمكن لاحقًا حفظها في حساب المستخدم عن طريق الخادم.",

  "settings.backend.field": "الحقل المقترح في الخادم",

  "common.sar": "ر.س",
};

export const translations = {
  en,
  ar,
};

export type Language = keyof typeof translations;