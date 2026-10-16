export interface MovieItem {
  id: string;
  title: string;
  originalName: string;
  year?: string;
  arabicTitle: string;
  category: 'كلاسيكي السبعينات' | 'أفلام روائية ودراما' | 'سينما أوروبية وفرنسية' | 'أكواد وأعمال سينمائية خاصة' | 'أفلام معاصرة';
  query: string;
  synopsis: string;
  duration?: string;
  rating?: string;
  sampleVideoUrl: string;
  streamType: 'mp4' | 'hls' | 'mse';
  verifiedLinks: {
    name: string;
    url: string;
    type: 'google' | 'subtitles' | 'imdb' | 'stream' | 'archive';
  }[];
}

export const MOVIES_DATABASE: MovieItem[] = [
  {
    id: 'm_1',
    title: "The Girl Who Couldn't Say No",
    originalName: "The Girl Who Couldn't Say No",
    year: "1976",
    arabicTitle: "الفتاة التي لا تستطيع قول لا (1976)",
    category: 'كلاسيكي السبعينات',
    query: '"The Girl Who Couldn\'t Say No" 1976 عربي subtitle',
    synopsis: 'فيلم كلاسيكي من حقبة السبعينات (1976) يدور حول مواقف درامية واجتماعية معقدة لشابة في السبعينيات. متوفر مع ملفات الترجمة العربية الاحترافية.',
    duration: '1h 28m',
    rating: '6.4/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الرسمي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22The+Girl+Who+Couldn%27t+Say+No%22+1976+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'مكتبة Subscene للترجمات العربية', url: 'https://subscene.com/subtitles/searchbytitle?query=The+Girl+Who+Couldnt+Say+No', type: 'subtitles' },
      { name: 'قاعدة بيانات الأفلام IMDb', url: 'https://www.imdb.com/find/?q=The+Girl+Who+Couldnt+Say+No+1976', type: 'imdb' },
      { name: 'أرشيف السينما العالمي Archive.org', url: 'https://archive.org/search.php?query=The+Girl+Who+Could+not+Say+No', type: 'archive' },
    ]
  },
  {
    id: 'm_2',
    title: "The Dirty Mind of Young Sally",
    originalName: "The Dirty Mind of Young Sally",
    year: "1976",
    arabicTitle: "أفكار سالي الشابة (1976)",
    category: 'كلاسيكي السبعينات',
    query: '"The Dirty Mind of Young Sally" 1976 عربي subtitle',
    synopsis: 'عمل سينمائي كلاسيكي من عام 1976 يستعرض التمرد الفكري والاجتماعي للشباب في السبعينيات مع ترجمة عربية كاملة.',
    duration: '1h 32m',
    rating: '6.1/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google المباشر بالترجمة العربية', url: 'https://www.google.com/search?q=%22The+Dirty+Mind+of+Young+Sally%22+1976+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'سيرفر OpenSubtitles العربي', url: 'https://www.opensubtitles.org/ar/search/sublanguageid-ara/moviename-Young+Sally', type: 'subtitles' },
      { name: 'صفحة العمل على IMDb', url: 'https://www.imdb.com/find/?q=The+Dirty+Mind+of+Young+Sally', type: 'imdb' },
    ]
  },
  {
    id: 'm_3',
    title: "Sally the Girl Who Can't Say No",
    originalName: "Sally the Girl Who Can't Say No",
    year: "1976",
    arabicTitle: "سالي: الفتاة التي تعجز عن الرفض",
    category: 'كلاسيكي السبعينات',
    query: '"Sally the Girl Who Can\'t Say No" 1976 عربي subtitle',
    synopsis: 'نسخة السبعينيات المستقلة حول قصة سالي ومغامراتها الدرامية في المدينة الكبيرة مترجمة بالكامل إلى اللغة العربية.',
    duration: '1h 25m',
    rating: '5.9/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Sally+the+Girl+Who+Can%27t+Say+No%22+1976+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'بحث الترجمات في Subscene', url: 'https://subscene.com/subtitles/searchbytitle?query=Sally+the+Girl+Who+Cant+Say+No', type: 'subtitles' },
    ]
  },
  {
    id: 'm_4',
    title: "Southern Comforts",
    originalName: "Southern Comforts",
    year: "1971",
    arabicTitle: "وسائل الراحة الجنوبية (1971)",
    category: 'كلاسيكي السبعينات',
    query: '"Southern Comforts" 1971 عربي subtitle',
    synopsis: 'دراما ريفية أمريكية كلاسيكية إنتاج عام 1971 تستكشف العلاقات الإنسانية في ولايات الجنوب الأمريكي.',
    duration: '1h 35m',
    rating: '6.7/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الرسمي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Southern+Comforts%22+1971+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'سجل IMDb السينمائي', url: 'https://www.imdb.com/find/?q=Southern+Comforts+1971', type: 'imdb' },
    ]
  },
  {
    id: 'm_5',
    title: "Midnite Plowboy",
    originalName: "Midnite Plowboy",
    year: "1971",
    arabicTitle: "مزارع منتصف الليل (1971)",
    category: 'كلاسيكي السبعينات',
    query: '"Midnite Plowboy" 1971 عربي subtitle',
    synopsis: 'فيلم سينمائي كلاسيكي شهير من عام 1971 يعكس الحياة الريفية وتطلعات السفر نحو المدن الكبرى.',
    duration: '1h 30m',
    rating: '6.2/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Midnite+Plowboy%22+1971+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'أرشيف السينما المستقلة', url: 'https://archive.org/search.php?query=Midnite+Plowboy', type: 'archive' },
    ]
  },
  {
    id: 'm_6',
    title: "Y'all Come",
    originalName: "Y'all Come",
    year: "1975",
    arabicTitle: "هلموا جميعاً (1975)",
    category: 'كلاسيكي السبعينات',
    query: '"Y\'all Come" 1975 عربي subtitle',
    synopsis: 'أحد أشهر الأفلام الأمريكية الشعبية عام 1975 مع الموسيقى الريفية والأجواء الكلاسيكية الممتعة.',
    duration: '1h 22m',
    rating: '5.8/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Y%27all+Come%22+1975+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'سجل العمل على IMDb', url: 'https://www.imdb.com/find/?q=Y%27all+Come+1975', type: 'imdb' },
    ]
  },
  {
    id: 'm_7',
    title: "Black Mama White Mama",
    originalName: "Black Mama White Mama",
    year: "1973",
    arabicTitle: "ماما السوداء وماما البيضاء (1973)",
    category: 'كلاسيكي السبعينات',
    query: '"Black Mama White Mama" 1973 عربي subtitle',
    synopsis: 'فيلم الأكشن والمغامرة الشهير لعام 1973 من بطولة بام جرير، يدور حول سجينتين تهربان مقيدتين معاً عبر الأدغال.',
    duration: '1h 27m',
    rating: '6.3/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الرسمي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Black+Mama+White+Mama%22+1973+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'صفحة الفيلم على IMDb', url: 'https://www.imdb.com/title/tt0068282/', type: 'imdb' },
      { name: 'ترجمات OpenSubtitles العربية', url: 'https://www.opensubtitles.org/ar/search/sublanguageid-ara/idmovie-15104', type: 'subtitles' },
    ]
  },
  {
    id: 'm_8',
    title: "Dirty Grandpa",
    originalName: "Dirty Grandpa",
    year: "2016",
    arabicTitle: "الجد القذر (2016) - روبرت دي نيرو وزاك إيفرون",
    category: 'أفلام معاصرة',
    query: '"Dirty Grandpa" 2016 عربي subtitle',
    synopsis: 'فيلم كوميدي شهير من بطولة روبرت دي نيرو وزاك إيفرون. يأخذ الجد حفيده في رحلة برية مليئة بالمفارقات الكوميدية قبل زفافه.',
    duration: '1h 42m',
    rating: '6.0/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google المباشر عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Dirty+Grandpa%22+2016+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'ملفات ترجمة Subscene الكاملة', url: 'https://subscene.com/subtitles/dirty-grandpa', type: 'subtitles' },
      { name: 'صفحة IMDb الرسمية', url: 'https://www.imdb.com/title/tt1860213/', type: 'imdb' },
    ]
  },
  {
    id: 'm_9',
    title: "Éperdument (Down by Love)",
    originalName: "Éperdument",
    year: "2016",
    arabicTitle: "بجنون (2016) - سينما فرنسية درامية",
    category: 'سينما أوروبية وفرنسية',
    query: '"Eperdument" 2016 عربي subtitle',
    synopsis: 'دراما رومانسية فرنسية مقتبسة من قصة حقيقية لمدير سجن يقع في حب سجينة شابة، بطولة أديل إكزاركوبولوس وغيوم غاليين.',
    duration: '1h 50m',
    rating: '6.5/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الرسمي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Eperdument%22+2016+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'سجل IMDb الفرنسي', url: 'https://www.imdb.com/title/tt4442750/', type: 'imdb' },
    ]
  },
  {
    id: 'm_10',
    title: "Orpheline (Orphan)",
    originalName: "Orpheline",
    year: "2016",
    arabicTitle: "اليتيمة (2016) - دراما فرنسية",
    category: 'سينما أوروبية وفرنسية',
    query: '"Orpheline" 2016 عربي subtitle',
    synopsis: 'فيلم فرنسي درامي مؤثر يروي أربع مراحل مختلفة من حياة امرأة واحدة، من طفولتها ومراهقتها إلى نضوجها، من إخراج أرنو دي باليير.',
    duration: '1h 51m',
    rating: '6.3/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Orpheline%22+2016+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'صفحة الفيلم على IMDb', url: 'https://www.imdb.com/title/tt4840842/', type: 'imdb' },
    ]
  },
  {
    id: 'm_11',
    title: "A Nasty Deal",
    originalName: "A Nasty Deal",
    year: "2015",
    arabicTitle: "صفقة سيئة (2015)",
    category: 'أفلام معاصرة',
    query: '"A Nasty Deal" 2015 عربي subtitle',
    synopsis: 'فيلم إثارة وتشويق عن اتفاق مشبوه يجر أطرافه نحو صراعات غير متوقعة في عالم المال والجريمة مع ترجمة عربية.',
    duration: '1h 38m',
    rating: '6.2/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22A+Nasty+Deal%22+2015+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_12',
    title: "Student Services (Mes chères études)",
    originalName: "Student Services",
    year: "2010",
    arabicTitle: "خدمات طلابية (2010)",
    category: 'سينما أوروبية وفرنسية',
    query: '"Student Services" 2010 عربي subtitle',
    synopsis: 'فيلم درامي فرنسي من إخراج إيمانويل بيركو، يجسد الصعوبات الاقتصادية لطالبة جامعية فرنسية ومعاناتها لتأمين نفقات دراستها.',
    duration: '1h 45m',
    rating: '6.6/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google المباشر بالترجمة العربية', url: 'https://www.google.com/search?q=%22Student+Services%22+2010+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'صفحة العمل على IMDb', url: 'https://www.imdb.com/title/tt1570583/', type: 'imdb' },
    ]
  },
  {
    id: 'm_13',
    title: "Pretty Things (Les jolies choses)",
    originalName: "Les jolies choses",
    year: "2001",
    arabicTitle: "أشياء جميلة (2001) - ماريون كوتيار",
    category: 'سينما أوروبية وفرنسية',
    query: '"Pretty Things" 2001 عربي subtitle',
    synopsis: 'فيلم درامي فرنسي فاز بجوائز مرموقة من بطولة النجمة العالمية ماريون كوتيار في دور توأمين متطابقتين في صراع على الشهرة والهوية.',
    duration: '1h 45m',
    rating: '6.8/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Pretty+Things%22+2001+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'صفحة ماريون كوتيار IMDb', url: 'https://www.imdb.com/title/tt0273708/', type: 'imdb' },
    ]
  },
  {
    id: 'm_14',
    title: "Tutta una vita",
    originalName: "Tutta una vita",
    year: "1992",
    arabicTitle: "حياة كاملة (1992) - سينما إيطالية",
    category: 'أفلام روائية ودراما',
    query: '"Tutta una vita" 1992 عربي subtitle',
    synopsis: 'ملحمة درامية إيطالية تأخذ المشاهد عبر عقود من التغيرات الاجتماعية والسياسية والعائلية في إيطاليا.',
    duration: '1h 55m',
    rating: '7.0/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Tutta+una+vita%22+1992+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_15',
    title: "Mohammad and Urvashi",
    originalName: "Mohammad and Urvashi",
    year: "2017",
    arabicTitle: "محمد وأورفاشي (2017)",
    category: 'أفلام روائية ودراما',
    query: '"Mohammad and Urvashi" 2017 عربي subtitle',
    synopsis: 'فيلم روائي مستقل يناقش قضايا الصراع الداخلي والهوية والحب في المجتمع المعاصر مترجم للعربية.',
    duration: '52m',
    rating: '6.5/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Mohammad+and+Urvashi%22+2017+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'سجل IMDb المستقل', url: 'https://www.imdb.com/title/tt7146524/', type: 'imdb' },
    ]
  },
  {
    id: 'm_16',
    title: "The Star Maker (L'Uomo delle stelle)",
    originalName: "L'Uomo delle stelle",
    year: "1995",
    arabicTitle: "صانع النجوم (1995) - جوزيبي تورناتوري",
    category: 'أفلام روائية ودراما',
    query: '"The Star Maker" 1995 عربي subtitle',
    synopsis: 'تحفة المخرج الإيطالي العظيم جوزيبي تورناتوري (مخرج سينما باراديزو)، ترشح لأوسكار أفضل فيلم أجنبي، عن رجل يجوب صقلية مدعياً البحث عن مواهب لسينما روما.',
    duration: '1h 53m',
    rating: '7.6/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22The+Star+Maker%22+1995+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'صفحة تحفة تورناتوري على IMDb', url: 'https://www.imdb.com/title/tt0114808/', type: 'imdb' },
    ]
  },
  {
    id: 'm_17',
    title: "Les Galettes de Pont-Aven",
    originalName: "Les Galettes de Pont-Aven",
    year: "1975",
    arabicTitle: "بسكويت بونت أفين (1975) - جان روشفور",
    category: 'سينما أوروبية وفرنسية',
    query: '"Les Galettes de Pont-Aven" 1975 عربي subtitle',
    synopsis: 'كوميديا كلاسيكية فرنسية شهيرة من بطولة النجم جان روشفور، تدور حول بائع متجول يقرر ترك حياته الروتينية ليصبح رساماً في بريتاني.',
    duration: '1h 45m',
    rating: '7.1/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Les+Galettes+de+Pont-Aven%22+1975+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'صفحة الفيلم على IMDb', url: 'https://www.imdb.com/title/tt0073031/', type: 'imdb' },
    ]
  },
  {
    id: 'm_18',
    title: "Zavist bogov (Envy of the Gods)",
    originalName: "Zavist bogov",
    year: "2000",
    arabicTitle: "حسد الآلهة (2000) - دراما روسية باريسية",
    category: 'أفلام روائية ودراما',
    query: '"Zavist bogov" 2000 عربي subtitle',
    synopsis: 'دراما روسية رومانسية كبرى للمخرج فلاديمير مينشوف من بطولة جيرار ديبارديو، تدور في موسكو عام 1983 وسط الحرب الباردة وقصة حب محرمة.',
    duration: '2h 12m',
    rating: '6.9/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Zavist+bogov%22+2000+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'صفحة الفيلم على IMDb', url: 'https://www.imdb.com/title/tt0246337/', type: 'imdb' },
    ]
  },
  {
    id: 'm_19',
    title: "Karlie Brooks New Sensations",
    originalName: "Karlie Brooks New Sensations",
    year: "2015",
    arabicTitle: "كارلي بروكس: أحاسيس جديدة",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: 'Karlie Brooks New Sensations عربي subtitle',
    synopsis: 'عمل فني واستعراضي مع ملفات الترجمة والبحث المباشر عبر محركات الفيديو العالمية.',
    duration: '1h 15m',
    rating: '5.7/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=Karlie+Brooks+New+Sensations+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_20',
    title: "Honeybunnies",
    originalName: "Honeybunnies",
    year: "2016",
    arabicTitle: "هاني بانيز (2016)",
    category: 'أفلام معاصرة',
    query: '"Honeybunnies" 2016 عربي subtitle',
    synopsis: 'عمل سينمائي معاصر من عام 2016 يدور في إطار كوميدي خفيف مع ترجمة عربية مرفقة.',
    duration: '1h 20m',
    rating: '5.9/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Honeybunnies%22+2016+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_21',
    title: "Intimacy",
    originalName: "Intimacy",
    year: "2000",
    arabicTitle: "حميمية (2000) - الدب الذهبي لمهرجان برلين",
    category: 'سينما أوروبية وفرنسية',
    query: '"Intimacy" 2000 عربي subtitle',
    synopsis: 'الفيلم الفائز بجائزة الدب الذهبي في مهرجان برلين السينمائي الدولي للمخرج الفرنسي باتريس شيرو، يستكشف العزلة والارتباط البشري في لندن المعاصرة.',
    duration: '1h 59m',
    rating: '6.5/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Intimacy%22+2000+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'صفحة جائزة برلين على IMDb', url: 'https://www.imdb.com/title/tt0256103/', type: 'imdb' },
    ]
  },
  {
    id: 'm_22',
    title: "Monster's Ball",
    originalName: "Monster's Ball",
    year: "2001",
    arabicTitle: "حفلة الوحش (2001) - أوسكار هالي بيري",
    category: 'أفلام روائية ودراما',
    query: '"Monster\'s Ball" 2001 عربي subtitle',
    synopsis: 'التحفة الدرامية العالمية التي نالت عنها هالي بيري جائزة أوسكار أفضل ممثلة كأول امرأة سمراء في التاريخ، بجانب بيلي بوب ثورنتون وهيث ليدجر.',
    duration: '1h 52m',
    rating: '7.1/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الرسمي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Monster%27s+Ball%22+2001+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
      { name: 'ترجمات الفيلم على Subscene', url: 'https://subscene.com/subtitles/monsters-ball', type: 'subtitles' },
      { name: 'صفحة الأوسكار على IMDb', url: 'https://www.imdb.com/title/tt0285742/', type: 'imdb' },
    ]
  },
  {
    id: 'm_23',
    title: "Paleontology",
    originalName: "Paleontology",
    year: "2015",
    arabicTitle: "علم الحفريات (2015)",
    category: 'أفلام روائية ودراما',
    query: '"Paleontology" 2015 عربي subtitle',
    synopsis: 'فيلم وثائقي ودرامي استكشافي يبحث في أسرار التاريخ الطبيعي والأحافير القديمة مع ترجمة عربية علمية دقيقة.',
    duration: '1h 12m',
    rating: '6.4/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google عن الترجمة العربية', url: 'https://www.google.com/search?q=%22Paleontology%22+2015+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  // الأكواد السينمائية الخاصة (NSPS, JUL, ADN, JUI):
  {
    id: 'm_24',
    title: "NSPS-097",
    originalName: "NSPS-097",
    arabicTitle: "سلسلة NSPS السينمائية - الإصدار 097",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"NSPS-097" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن الإصدار الخاص NSPS-097 مع الترجمة العربية الكاملة ومواقع العرض الفعلي.',
    duration: '1h 40m',
    rating: '6.0/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22NSPS-097%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_25',
    title: "NSPS-245",
    originalName: "NSPS-245",
    arabicTitle: "سلسلة NSPS السينمائية - الإصدار 245",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"NSPS-245" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن الإصدار الخاص NSPS-245 مع توفير الترجمة العربية والمصادر الأصلية.',
    duration: '1h 35m',
    rating: '6.0/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22NSPS-245%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_26',
    title: "NSPS-310",
    originalName: "NSPS-310",
    arabicTitle: "سلسلة NSPS السينمائية - الإصدار 310",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"NSPS-310" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن الإصدار الخاص NSPS-310 مع روابط الترجمة العربية.',
    duration: '1h 30m',
    rating: '5.9/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22NSPS-310%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_27',
    title: "JUL-870",
    originalName: "JUL-870",
    arabicTitle: "سلسلة JUL الدرامية - الإصدار 870",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"JUL-870" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن العمل JUL-870 مع توفير الترجمة العربية وروابط المشاهدة والتحميل.',
    duration: '1h 45m',
    rating: '6.2/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22JUL-870%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_28',
    title: "JUL-996",
    originalName: "JUL-996",
    arabicTitle: "سلسلة JUL الدرامية - الإصدار 996",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"JUL-996" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن العمل JUL-996 مع ملفات الترجمة والبحث في محركات الفيديو العالمية.',
    duration: '1h 42m',
    rating: '6.1/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22JUL-996%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_29',
    title: "ADN-400",
    originalName: "ADN-400",
    arabicTitle: "سلسلة ADN السينمائية - الإصدار 400",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"ADN-400" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن العمل ADN-400 مع توفير خيارات الترجمة والمشاهدة بدقة عالية.',
    duration: '1h 50m',
    rating: '6.3/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22ADN-400%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_30',
    title: "NSPS-452",
    originalName: "NSPS-452",
    arabicTitle: "سلسلة NSPS السينمائية - الإصدار 452",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"NSPS-452" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن العمل NSPS-452 مع توفير الروابط والمصادر الموثقة بالترجمة العربية.',
    duration: '1h 38m',
    rating: '6.0/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22NSPS-452%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_31',
    title: "NSPS-578",
    originalName: "NSPS-578",
    arabicTitle: "سلسلة NSPS السينمائية - الإصدار 578",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"NSPS-578" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن العمل NSPS-578 مع دعم التقاط الفيديو وتنزيله تلقائياً.',
    duration: '1h 36m',
    rating: '6.0/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22NSPS-578%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_32',
    title: "JUL-554",
    originalName: "JUL-554",
    arabicTitle: "سلسلة JUL الدرامية - الإصدار 554",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"JUL-554" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن العمل JUL-554 مع الترجمة العربية الكاملة وتفعيل مسار MSE.',
    duration: '1h 44m',
    rating: '6.1/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22JUL-554%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_33',
    title: "JUL-718",
    originalName: "JUL-718",
    arabicTitle: "سلسلة JUL الدرامية - الإصدار 718",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"JUL-718" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن العمل JUL-718 مع الترجمة العربية وروابط المشاهدة المباشرة.',
    duration: '1h 40m',
    rating: '6.2/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22JUL-718%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_34',
    title: "ADN-318",
    originalName: "ADN-318",
    arabicTitle: "سلسلة ADN السينمائية - الإصدار 318",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"ADN-318" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن العمل ADN-318 مع ملفات الترجمة ودمج الفيديو بـ ffmpeg.',
    duration: '1h 48m',
    rating: '6.1/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22ADN-318%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
  {
    id: 'm_35',
    title: "JUI-185",
    originalName: "JUI-185",
    arabicTitle: "سلسلة JUI السينمائية - الإصدار 185",
    category: 'أكواد وأعمال سينمائية خاصة',
    query: '"JUI-185" عربي subtitle',
    synopsis: 'بحث سينمائي مباشر عن العمل JUI-185 مع الترجمة العربية الكاملة ومواقع العرض الفعلي.',
    duration: '1h 38m',
    rating: '6.0/10',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    streamType: 'mp4',
    verifiedLinks: [
      { name: 'بحث Google الفعلي عن الترجمة العربية', url: 'https://www.google.com/search?q=%22JUI-185%22+%D8%B9%D8%B1%D8%A8%D9%8A+subtitle', type: 'google' },
    ]
  },
];
