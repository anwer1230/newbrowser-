export interface DiscoverArticle {
  id: string;
  title: string;
  snippet: string;
  source: string;
  sourceIcon?: string;
  category: 'all' | 'cinema' | 'tech' | 'world' | 'science';
  categoryLabel: string;
  timeAgo: string;
  imageUrl: string;
  readTime: string;
  url: string;
  views: string;
  hasVideo?: boolean;
}

const POOL_OF_STORIES: Omit<DiscoverArticle, 'id' | 'timeAgo' | 'views'>[] = [
  {
    title: 'أفضل 10 أفلام كلاسيكية من حقبة السبعينات متوفرة الآن بالترجمة العربية الكاملة',
    snippet: 'قائمة استكشافية متكاملة لروائع السينما المستقلة والدرامية من السبعينات مع توفر ملفات الترجمة وروابط المشاهدة المباشرة بدقة عالية.',
    source: 'سينما العرب وإضاءات',
    category: 'cinema',
    categoryLabel: 'سينما وأفلام',
    readTime: '4 دقائق',
    url: 'https://ar.wikipedia.org/wiki/سينما_السبعينات',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=700&auto=format&fit=crop&q=80',
    hasVideo: true,
  },
  {
    title: 'متصفح Chromium الجديد يدمج محرك ذكاء اصطناعي واعتراض بثوث MSE و HLS تلقائياً',
    snippet: 'قفزة نوعية في تقنيات تصفح الويب الحديثة: تسجيل البث المباشر بدقة 4K وحفظه محلياً مع تشفير الخزنة بتقنية AES-256-GCM.',
    source: 'عالم التقنية وChromium Hub',
    category: 'tech',
    categoryLabel: 'تكنولوجيا وذكاء اصطناعي',
    readTime: '3 دقائق',
    url: 'https://chromium.googlesource.com/chromium/src',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&auto=format&fit=crop&q=80',
    hasVideo: true,
  },
  {
    title: 'روبرت دي نيرو وزاك إيفرون في الكوميديا الشهيرة Dirty Grandpa وكيف حقق انتشاراً عالمياً',
    snippet: 'نظرة نقدية على مسيرة دي نيرو الكوميدية والرحلة البرية التي أسرت شباك التذاكر، مع تفاصيل الترجمة العربية الرسمية.',
    source: 'جريدة الفن العالمي',
    category: 'cinema',
    categoryLabel: 'سينما وأفلام',
    readTime: '5 دقائق',
    url: 'https://www.imdb.com/title/tt1860213/',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=700&auto=format&fit=crop&q=80',
    hasVideo: true,
  },
  {
    title: 'السينما الفرنسية والجوائز الكبرى: من Éperdument إلى روائع ماريون كوتيار الفائزة بالأوسكار',
    snippet: 'استعراض لأبرز الأعمال الفرنسية الدرامية التي حصدت جوائز مهرجانات كان وبرلين وكيف تطورت الترجمات العربية لها.',
    source: 'مهرجانات السينما الدولية',
    category: 'cinema',
    categoryLabel: 'سينما وأفلام',
    readTime: '6 دقائق',
    url: 'https://www.google.com/search?q=السينما+الفرنسية+المترجمة',
    imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=700&auto=format&fit=crop&q=80',
    hasVideo: false,
  },
  {
    title: 'تطور شبكات VPN وبروتوكول WireGuard: لماذا أصبح الأسرع في حماية خصوصية المستخدمين؟',
    snippet: 'تحليل هندسي لأداء WireGuard وسرعة الاتصال وميزة Kill-Switch التي تمنع تسريب البيانات عند انقطاع الاتصال.',
    source: 'أمن المعلومات والمصادر المفتوحة',
    category: 'tech',
    categoryLabel: 'تكنولوجيا وأمان',
    readTime: '4 دقائق',
    url: 'https://www.wireguard.com',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&auto=format&fit=crop&q=80',
    hasVideo: false,
  },
  {
    title: 'كيف نالت هالي بيري جائزة الأوسكار التاريخية في رائعة Monster\'s Ball؟',
    snippet: 'الفيلم الدرامي الاستثنائي الذي دخل التاريخ السينمائي من أوسع أبوابه، تحليل المشاهد الدرامية وسر الترجمة العربية المتقنة.',
    source: 'أرشيف هوليوود الذهبي',
    category: 'cinema',
    categoryLabel: 'سينما وأفلام',
    readTime: '7 دقائق',
    url: 'https://www.imdb.com/title/tt0285742/',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=700&auto=format&fit=crop&q=80',
    hasVideo: true,
  },
  {
    title: 'أسرار استكشاف الفضاء ومستجدات التلسكوبات الفضائية في رصد مجرات الكون البعيدة',
    snippet: 'صور وبيانات جديدة تكشف أسرار المادة المظلمة وتكوّن النجوم في بواكير نشأة الكون، مع شروحات علمية مصورة.',
    source: 'ناسا للعلوم والاستكشاف',
    category: 'science',
    categoryLabel: 'علوم وفضاء',
    readTime: '5 دقائق',
    url: 'https://www.nasa.gov',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=80',
    hasVideo: false,
  },
  {
    title: 'تقنيات الـ HLS والبث المباشر المتكيف (m3u8): كيف تعمل خوارزميات تقسيم الفيديو والدمج بـ FFmpeg',
    snippet: 'دليل تقني شامل لفهم كيفية تنزيل شرائح البث التكيفي ودمج الصوت والصورة تلقائياً بدون فقدان الجودة.',
    source: 'مهندسو الميديا والشبكات',
    category: 'tech',
    categoryLabel: 'تكنولوجيا وبرمجة',
    readTime: '6 دقائق',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=700&auto=format&fit=crop&q=80',
    hasVideo: true,
  },
  {
    title: 'المخرج جوزيبي تورناتوري وتحفته الخالدة "صانع النجوم" (The Star Maker)',
    snippet: 'قصة الفيلم الإيطالي المرشح للأوسكار الذي صور ببراعة شغف السينما وبراءة الناس في صقلية ما بعد الحرب.',
    source: 'تاريخ السينما العالمية',
    category: 'cinema',
    categoryLabel: 'سينما وأفلام',
    readTime: '4 دقائق',
    url: 'https://www.imdb.com/title/tt0114808/',
    imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=700&auto=format&fit=crop&q=80',
    hasVideo: false,
  },
  {
    title: 'تحديثات الويب 2026: تطبيقات الويب التقدمية PWA تتفوق على التطبيقات الأصلية في الأداء والسرعة',
    snippet: 'دعم المعالجة بالخلفية، والتخزين المؤقت المشفر، والتثبيت الفوري بنقرة واحدة بدون الحاجة لمتجر التطبيقات.',
    source: 'مؤتمرات مطوري الويب',
    category: 'tech',
    categoryLabel: 'تكنولوجيا وذكاء اصطناعي',
    readTime: '3 دقائق',
    url: 'https://web.dev/progressive-web-apps/',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&auto=format&fit=crop&q=80',
    hasVideo: false,
  },
];

export function getDynamicDiscoverArticles(category: string = 'all', seedModifier: number = 0): DiscoverArticle[] {
  // Generate dynamic, fresh timestamps and views based on current time
  const timeUnits = ['منذ 6 دقائق', 'منذ 18 دقيقة', 'منذ 42 دقيقة', 'منذ ساعة', 'منذ ساعتين', 'منذ 3 ساعات', 'منذ 5 ساعات'];
  
  // Filter or take items
  let pool = POOL_OF_STORIES;
  if (category !== 'all') {
    pool = pool.filter(item => item.category === category || category === 'all');
  }

  // Shuffle pool dynamically using seedModifier
  const shuffled = [...pool].sort(() => 0.5 - Math.random());

  return shuffled.map((item, index) => {
    const timeIndex = (index + seedModifier) % timeUnits.length;
    const viewsCount = Math.floor(12000 + Math.random() * 85000).toLocaleString('ar-EG');
    return {
      ...item,
      id: `art_${item.category}_${index}_${seedModifier}`,
      timeAgo: timeUnits[timeIndex],
      views: `${viewsCount} مشاهدة`,
    };
  });
}
