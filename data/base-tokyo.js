// ============================================================
//  data.js — כל המידע של הטיול במקום אחד
//  
//  לעריכה: שנו, הוסיפו או מחקו רובעים, ימים וחוויות
//  האפליקציה תתעדכן אוטומטית
// ============================================================


// ----------------------------------------------------------
//  קטגוריות חוויה — צבעים וסימונים
// ----------------------------------------------------------
const EXPERIENCE_TYPES = {
  culture:  { label: 'תרבות ומקדשים', color: '#8e44ad' },
  food:     { label: 'אוכל ושתייה',   color: '#d35400' },
  shopping: { label: 'קניות',         color: '#2980b9' },
  street:   { label: 'רחוב ואווירה',  color: '#27ae60' },
  art:      { label: 'אמנות ועיצוב',  color: '#c0392b' },
  nature:   { label: 'טבע ושלווה',    color: '#16a085' },
  fun:      { label: 'בידור ומשחקים', color: '#e67e22' },
  history:  { label: 'היסטוריה',      color: '#7f8c8d' },
  onsen:    { label: 'מעיינות חמים',  color: '#e67e22' },
  spiritual:{ label: 'רוחניות',       color: '#6c3483' },
};


// ----------------------------------------------------------
//  רובעים — הוסיפו או ערכו כרצונכם
//  
//  שדות:
//    id          — מזהה ייחודי (אנגלית, ללא רווחים)
//    name        — שם בעברית
//    romaji      — שם באנגלית
//    priority    — 'high' | 'medium' | 'low'
//    position    — { x, y } במפה הסכמתית (0-100%)
//    timeNeeded  — זמן מומלץ
//    bestTime    — מתי הכי טוב להגיע
//    unique      — תיאור קצר של הייחוד
//    experiences — רשימת קטגוריות (מתוך EXPERIENCE_TYPES)
//    streets     — רחובות מרכזיים { name, desc }
//    activities  — פעילויות { name, desc, duration }
// ----------------------------------------------------------
const DISTRICTS = [

  // =================== עדיפות גבוהה ===================

  {
    id: 'shibuya',
    name: 'שיבויה',
    romaji: 'Shibuya',
    priority: 'high',
    position: { x: 37, y: 57 },
    timeNeeded: '3-4 שעות',
    bestTime: 'אחר הצהריים עד לילה',
    unique: 'אנרגיה עירונית בלתי פוסקת. הצומת המפורסם בעולם, קניונים ענקיים ותרבות רחוב צעירה.',
    experiences: ['street', 'shopping', 'fun'],
    streets: [
      { name: 'Shibuya Crossing', desc: 'הצומת המפורסם — לעמוד כאן בשעת שיא' },
      { name: 'Center-gai', desc: 'רחוב הקניות המרכזי, סואן ומלא חיים' },
      { name: 'Dogenzaka', desc: 'מסעדות, בארים, חיי לילה' },
      { name: 'Spain-zaka', desc: 'מדרגות ציוריות עם חנויות קטנות' },
    ],
    activities: [
      { name: 'Shibuya Sky', desc: 'תצפית פנורמית 360 מעל הצומת', duration: '60 דקות' },
      { name: 'פסל האצ\'יקו', desc: 'נקודת מפגש אייקונית ליד התחנה', duration: '10 דקות' },
      { name: 'Shibuya 109', desc: 'קניון אופנה יפנית צעירה', duration: '45 דקות' },
      { name: 'Mega Don Quijote', desc: 'חנות הכל — מזכרות, חטיפים, גאדג\'טים', duration: '30 דקות' },
    ],
  },

  {
    id: 'shinjuku',
    name: 'שינג\'וקו',
    romaji: 'Shinjuku',
    priority: 'high',
    position: { x: 32, y: 38 },
    timeNeeded: '4-5 שעות',
    bestTime: 'בוקר לגן + ערב לגולדן גאי',
    unique: 'שני פנים — גורדי שחקים ועסקים ביום, סמטאות בארים זעירים וטירוף בלילה.',
    experiences: ['food', 'street', 'nature'],
    streets: [
      { name: 'Kabukicho', desc: 'רובע הבידור — שלטי ניאון ואנרגיה' },
      { name: 'Golden Gai', desc: '6 סמטאות צרות עם 200+ בארים של 6 מושבים' },
      { name: 'Omoide Yokocho', desc: 'סמטת הזיכרונות — יאקיטורי על האש' },
      { name: 'Shinjuku-dori', desc: 'ציר קניות ראשי' },
    ],
    activities: [
      { name: 'Tokyo Metropolitan Gov.', desc: 'תצפית חינם מקומה 45 — מזרח ומערב', duration: '30 דקות' },
      { name: 'Shinjuku Gyoen', desc: 'גן יפני, גן צרפתי וגן אנגלי במקום אחד', duration: '90 דקות' },
      { name: 'Golden Gai בערב', desc: 'לבחור בר קטן ולשבת עם המקומיים', duration: '90 דקות' },
      { name: 'Omoide Yokocho', desc: 'יאקיטורי ובירה על הדוכנים', duration: '60 דקות' },
    ],
  },

  {
    id: 'asakusa',
    name: 'אסאקוסה',
    romaji: 'Asakusa',
    priority: 'high',
    position: { x: 65, y: 25 },
    timeNeeded: '3-4 שעות',
    bestTime: 'בוקר מוקדם (פחות עמוס)',
    unique: 'טוקיו המסורתית. מקדש סנסו-ג\'י, שער הרעם, רחוב דוכנים עתיק ונוף לסקיי טרי.',
    experiences: ['culture', 'food', 'shopping'],
    streets: [
      { name: 'Nakamise-dori', desc: 'רחוב הדוכנים מהשער למקדש — 250 מטר של חטיפים ומזכרות' },
      { name: 'Kaminarimon', desc: 'שער הרעם — הפנס האדום הענק' },
      { name: 'Dempoin-dori', desc: 'סמטה מסורתית מקבילה, שקטה יותר' },
      { name: 'Sumida River Walk', desc: 'טיילת הנהר לכיוון סקיי טרי' },
    ],
    activities: [
      { name: 'מקדש סנסו-ג\'י', desc: 'המקדש הבודהיסטי העתיק ביותר בטוקיו', duration: '45 דקות' },
      { name: 'חטיפים בנקמיסה', desc: 'מלח-שלג, דנגו, מלוביאקי, סנבאי', duration: '30 דקות' },
      { name: 'שייט על נהר סומידה', desc: 'מאסאקוסה לאודאיבה או חמריקיו', duration: '40 דקות' },
      { name: 'קימונו להשכרה', desc: 'ללבוש קימונו ולצלם ברחוב', duration: '120 דקות' },
    ],
  },

  {
    id: 'harajuku',
    name: 'הראג\'וקו',
    romaji: 'Harajuku',
    priority: 'high',
    position: { x: 34, y: 47 },
    timeNeeded: '3-4 שעות',
    bestTime: 'בוקר למאיג\'י + צהריים לטקשיטה',
    unique: 'ניגודים מטריפים — רחוב טקשיטה הצבעוני, אומוטסנדו האלגנטי, ומקדש מאיג\'י השקט ביער.',
    experiences: ['shopping', 'culture', 'street', 'art'],
    streets: [
      { name: 'Takeshita-dori', desc: 'רחוב האופנה הצעירה — קרפים צבעוניים וקוספליי' },
      { name: 'Omotesando', desc: 'השאנז אליזה של טוקיו — אדריכלות ומותגים' },
      { name: 'Cat Street', desc: 'חנויות וינטג\', עיצוב ובוטיקים עצמאיים' },
      { name: 'Ura-Harajuku', desc: 'הסמטאות האחוריות — אופנה מקומית' },
    ],
    activities: [
      { name: 'מקדש מאיג\'י', desc: 'שלווה ביער — שער טוריי ענק, שביל יער', duration: '60 דקות' },
      { name: 'קרפ צבעוני', desc: 'בטקשיטה דורי — חובה', duration: '15 דקות' },
      { name: 'Omotesando Hills', desc: 'בניין טדאו אנדו — אדריכלות + קניות', duration: '45 דקות' },
      { name: 'צפייה באופנת רחוב', desc: 'בעיקר בסופ"ש — הסגנונות הכי מטורפים', duration: '—' },
    ],
  },

  {
    id: 'akihabara',
    name: 'אקיהברה',
    romaji: 'Akihabara',
    priority: 'high',
    position: { x: 59, y: 38 },
    timeNeeded: '2-3 שעות',
    bestTime: 'צהריים עד ערב (בשבת הרחוב נסגר לתנועה)',
    unique: 'עיר האלקטרוניקה, האנימה והגיימינג. שלטי ניאון, חנויות רב-קומתיות ותרבות אוטאקו. עם מתבגרים — חובה.',
    experiences: ['shopping', 'fun', 'street'],
    streets: [
      { name: 'Chuo-dori', desc: 'הציר המרכזי — נסגר לתנועה בשבתות' },
      { name: 'Kanda Myojin', desc: 'מקדש שינטו עתיק בלב האזור הדיגיטלי' },
      { name: 'Manseibashi', desc: 'תחנת רכבת ישנה שהפכה לקניון מעוצב' },
    ],
    activities: [
      { name: 'Yodobashi Camera', desc: 'חנות אלקטרוניקה ענקית — כל מה שאפשר לדמיין', duration: '60 דקות' },
      { name: 'חנויות מנגה ואנימה', desc: 'Animate, Mandarake — קומות של אנימה', duration: '45 דקות' },
      { name: 'ארקייד גיימינג', desc: 'SEGA, Taito — משחקים יפניים קלאסיים', duration: '45 דקות' },
      { name: 'גאצ\'אפון', desc: 'מכונות צעצועים יפניות — ממכר', duration: '20 דקות' },
    ],
  },

  // =================== עדיפות בינונית ===================

  {
    id: 'ginza',
    name: 'גינזה',
    romaji: 'Ginza',
    priority: 'medium',
    position: { x: 59, y: 56 },
    timeNeeded: '2-3 שעות',
    bestTime: 'אחר הצהריים (בסופ"ש הרחוב הראשי נסגר לתנועה)',
    unique: 'האזור היוקרתי של טוקיו. בוטיקים, גלריות, מסעדות שף ואדריכלות מודרנית מרהיבה.',
    experiences: ['shopping', 'food', 'art'],
    streets: [
      { name: 'Chuo-dori', desc: 'ציר הקניות — נסגר לתנועה בסופ"ש' },
      { name: 'Harumi-dori', desc: 'חוצה את גינזה — מסעדות ובוטיקים' },
      { name: 'Namiki-dori', desc: 'בוטיקים שקטים ואלגנטיים' },
    ],
    activities: [
      { name: 'Ginza Six', desc: 'קניון עם גג ירוק ואמנות', duration: '60 דקות' },
      { name: 'שוק צוקיג\'י החיצוני', desc: 'אוכל ים ודוכנים — 10 דקות ברגל', duration: '90 דקות' },
      { name: 'Kabuki-za', desc: 'תיאטרון קבוקי — אפשר לקנות כרטיס למערכה אחת', duration: '60 דקות' },
      { name: 'סושי ברמה', desc: 'סושי קאונטר — חוויה יפנית קלאסית', duration: '60 דקות' },
    ],
  },

  {
    id: 'ueno',
    name: 'אואנו',
    romaji: 'Ueno',
    priority: 'medium',
    position: { x: 57, y: 28 },
    timeNeeded: '3-4 שעות',
    bestTime: 'בוקר (המוזיאונים פתוחים מ-9:30)',
    unique: 'פארק עצום עם מוזיאונים, גן חיות, מקדשים ושוק רחוב סואן. גם תחנת שינקנסן לצפון יפן.',
    experiences: ['culture', 'food', 'nature'],
    streets: [
      { name: 'Ameyoko', desc: 'שוק רחוב מתחת למסילה — אוכל, בגדים, מוצרי ים' },
      { name: 'Ueno Park', desc: 'הפארק המרכזי — מוזיאונים, מקדשים, אגם' },
      { name: 'Shinobazu-dori', desc: 'ציר ראשי ליד הפארק' },
    ],
    activities: [
      { name: 'Tokyo National Museum', desc: 'האוסף הגדול ביותר של אמנות יפנית בעולם', duration: '120 דקות' },
      { name: 'שוק אמיוקו', desc: 'אוכל רחוב, פירות ים, קניות זולות', duration: '60 דקות' },
      { name: 'גן חיות אואנו', desc: 'הגן הוותיק ביותר ביפן', duration: '90 דקות' },
      { name: 'אגם שינובזו', desc: 'שיט בסירות פדלים + מקדש באמצע האגם', duration: '30 דקות' },
    ],
  },

  {
    id: 'roppongi',
    name: 'רופונגי',
    romaji: 'Roppongi',
    priority: 'medium',
    position: { x: 48, y: 62 },
    timeNeeded: '2-3 שעות',
    bestTime: 'אחר הצהריים (אמנות) או ערב (תצפית)',
    unique: 'מוזיאוני אמנות ברמה עולמית, מגדלי זכוכית ונוף פנורמי. תרבות גבוהה ובידור.',
    experiences: ['art', 'street'],
    streets: [
      { name: 'Roppongi-dori', desc: 'הציר הראשי — מגדלים וגלריות' },
      { name: 'Keyakizaka-dori', desc: 'רחוב האלונים — כמו אירופה' },
      { name: 'Azabu-juban', desc: 'שכונה שקטה בסמוך — אוכל ואווירה' },
    ],
    activities: [
      { name: 'Mori Art Museum', desc: 'אמנות עכשווית + תצפית מקומה 52', duration: '90 דקות' },
      { name: '21_21 Design Sight', desc: 'מוזיאון עיצוב של טדאו אנדו', duration: '60 דקות' },
      { name: 'Tokyo Midtown', desc: 'קניות, אוכל, גן יפני', duration: '60 דקות' },
      { name: 'Tokyo Tower בלילה', desc: 'תצפית קלאסית — מואר בכתום', duration: '45 דקות' },
    ],
  },

  {
    id: 'odaiba',
    name: 'אודאיבה',
    romaji: 'Odaiba',
    priority: 'medium',
    position: { x: 73, y: 74 },
    timeNeeded: '4-5 שעות',
    bestTime: 'כל היום — teamLab דורש הזמנה מראש',
    unique: 'אי מלאכותי במפרץ טוקיו. מוזיאון מדע, גנדאם ענק, קניונים ו-teamLab. מעולה עם מתבגרים.',
    experiences: ['fun', 'art', 'nature'],
    streets: [
      { name: 'Seaside Park', desc: 'טיילת חוף עם נוף למפרץ' },
      { name: 'Palette Town', desc: 'אזור בידור — גלגל ענק וקניונים' },
      { name: 'Rainbow Bridge', desc: 'גשר מואר — נוף מדהים בלילה' },
    ],
    activities: [
      { name: 'teamLab Borderless', desc: 'חוויה דיגיטלית סוחפת — להזמין מראש!', duration: '120 דקות' },
      { name: 'Unicorn Gundam', desc: 'פסל ענק מתני — מופע אור בערב', duration: '20 דקות' },
      { name: 'Miraikan', desc: 'מוזיאון מדע וטכנולוגיה — רובוט אסימו', duration: '90 דקות' },
      { name: 'Oedo Onsen', desc: 'אונסן ציבורי בסגנון תקופת אדו', duration: '120 דקות' },
    ],
  },

  // =================== עדיפות נמוכה ===================

  {
    id: 'shimokitazawa',
    name: 'שימוקיטזאווה',
    romaji: 'Shimokitazawa',
    priority: 'low',
    position: { x: 28, y: 60 },
    timeNeeded: '2-3 שעות',
    bestTime: 'אחר הצהריים',
    unique: 'שכונת הבוהמה. וינטג\', קפה עצמאי, תיאטרונים קטנים ומוזיקה חיה. 3 דקות משיבויה.',
    experiences: ['shopping', 'food', 'street'],
    streets: [
      { name: 'Shimokita Ekiue', desc: 'קומפלקס חדש על גג התחנה' },
      { name: 'Bonus Track', desc: 'רחוב חנויות חדש — עיצוב ואוכל' },
      { name: 'סמטאות דרום', desc: 'וינטג\', קפה, אווירה' },
    ],
    activities: [
      { name: 'שופינג וינטג\'', desc: 'עשרות חנויות יד שנייה ייחודיות', duration: '60 דקות' },
      { name: 'קפה Third Wave', desc: 'בתי קפה של קלייה עצמאית', duration: '30 דקות' },
      { name: 'תיאטרון הונדה', desc: 'הופעות קטנות אלטרנטיביות', duration: '60 דקות' },
      { name: 'סתם להסתובב', desc: 'האווירה היא העניין', duration: '—' },
    ],
  },

  {
    id: 'yanaka',
    name: 'יאנאקה',
    romaji: 'Yanaka',
    priority: 'low',
    position: { x: 60, y: 20 },
    timeNeeded: '2-3 שעות',
    bestTime: 'אחר הצהריים (שקיעה ברחוב הדוכנים)',
    unique: 'טוקיו הישנה ששרדה את ההפצצות. בתי עץ, מקדשים שקטים, חתולים בכל פינה.',
    experiences: ['culture', 'food', 'street'],
    streets: [
      { name: 'Yanaka Ginza', desc: 'רחוב דוכנים קסום — מושלם לשקיעה' },
      { name: 'Yanaka Cemetery', desc: 'בית קברות היסטורי מוקף עצי דובדבן' },
      { name: 'Nezu Shrine', desc: 'מקדש עם גינת אזליאות' },
    ],
    activities: [
      { name: 'שקיעה ביאנאקה גינזה', desc: 'השמש שוקעת בקצה הרחוב — קסום', duration: '30 דקות' },
      { name: 'לחפש חתולים', desc: 'סמל השכונה — הם בכל מקום', duration: '—' },
      { name: 'SCAI the Bathhouse', desc: 'גלריה לאמנות עכשווית בבית מרחץ עתיק', duration: '30 דקות' },
      { name: 'חטיפים מסורתיים', desc: 'דנגו, סנבאי, מנג\'ו — מהדוכנים', duration: '20 דקות' },
    ],
  },

  {
    id: 'nakameguro',
    name: 'נקמגורו',
    romaji: 'Nakameguro',
    priority: 'low',
    position: { x: 42, y: 66 },
    timeNeeded: '2 שעות',
    bestTime: 'אחר הצהריים עד ערב',
    unique: 'תעלת מגורו מוקפת עצי דובדבן, קפה של מקומיים, חנויות עיצוב. המקום ה"מגניב בשקט" של טוקיו.',
    experiences: ['food', 'art', 'street'],
    streets: [
      { name: 'Meguro River', desc: 'התעלה — עצי דובדבן ובתי קפה' },
      { name: 'Nakameguro Koukashita', desc: 'חנויות ומסעדות מתחת למסילה' },
      { name: 'Yutenji-dori', desc: 'רחוב עיצוב וגלריות' },
    ],
    activities: [
      { name: 'הליכה לאורך התעלה', desc: 'טיול רגוע ליד המים', duration: '30 דקות' },
      { name: 'Starbucks Reserve', desc: 'סניף הדגל של סטארבקס ביפן — אדריכלות', duration: '30 דקות' },
      { name: 'חנויות עיצוב וקרמיקה', desc: 'בוטיקים יפניים יפהפיים', duration: '45 דקות' },
      { name: 'יאקיטורי בערב', desc: 'בארים קטנים ליד התעלה', duration: '60 דקות' },
    ],
  },

];


// ----------------------------------------------------------
//  תכנון ימים — ערכו את הימים, הרובעים והערות
//  
//  districtIds — רשימת מזהי רובעים (לפי סדר ביקור)
//  notes       — טיפים ספציפיים ליום
// ----------------------------------------------------------
const DAY_PLANS = [

  // =================== הוקאידו — ימים 1-7 ===================

  {
    day: 1,
    city: 'הוקאידו',
    cityEn: 'Hokkaido',
    title: 'נחיתה, תרבות אינו, גיהינום געש',
    subtitle: 'נמל צ\'יטוסה → שיראאוי → נובוריבצו',
    districtIds: [],
    notes: 'להגיע בוקר — להספיק את מוזיאון האינו לפני הצהריים. הוקאידו ¥5 ימי JR Pass — לקנות בנמל.',
    walkingRoute: 'צ\'יטוסה → שיראאוי (40 דק\' רכבת) → נובוריבצו (30 דק\' רכבת)',
    schedule: [
      { time: '09:00', type: 'start',   label: 'נמל צ\'יטוסה — נחיתה',       lat: 42.7751, lng: 141.6924, note: 'לקנות JR Hokkaido Rail Pass לנמל', station: 'New Chitose Airport' },
      { time: '09:30', type: 'transit', label: '→ שיראאוי',                  transport: '🚃 JR Chitose Line', station: 'New Chitose → Shiraoi', dist: '40 דק\'', lat: 42.5618, lng: 141.3586 },
      { time: '10:15', type: 'place',   label: 'אופופוי — מוזיאון האינו',    lat: 42.5618, lng: 141.3586, duration: '2.5 שעות', note: '¥1,200. תרבות האינו, ריקודים, כפר משוחזר' },
      { time: '13:00', type: 'transit', label: '→ נובוריבצו',                transport: '🚃 JR Muroran Line', station: 'Shiraoi → Noboribetsu', dist: '30 דק\'', lat: 42.4136, lng: 141.1029 },
      { time: '13:45', type: 'place',   label: 'צהריים בנובוריבצו',          lat: 42.4136, lng: 141.1029, duration: '45 דק\'', note: 'ראמן מקומי בתחנה' },
      { time: '14:45', type: 'place',   label: 'עמק הגיהינום — ג\'יגוקודאני', lat: 42.3992, lng: 141.0945, duration: '60 דק\'', note: 'כניסה חינם. מכתש געשי פעיל, אדים, ריח גופרית' },
      { time: '18:00', type: 'end',     label: 'ריוקאן + אונסן — לינה',      lat: 42.4101, lng: 141.0956, note: 'מ-¥8,000 לאדם כולל ארוחות. 9 סוגי מי מינרלים', station: 'Noboribetsu' },
    ],
  },

  {
    day: 2,
    city: 'הוקאידו',
    cityEn: 'Hokkaido',
    title: 'אגם געשי ונסיעה לסאפורו',
    subtitle: 'נובוריבצו → אגם טויה → סאפורו',
    districtIds: [],
    notes: 'אגם טויה בבוקר — אוטובוס. הגעה לסאפורו בערב. ערב חופשי ברובע סוסוקינו.',
    walkingRoute: 'נובוריבצו → אגם טויה (60 דק\' אוטובוס) → סאפורו (JR 1:40 שעות)',
    schedule: [
      { time: '08:30', type: 'start',   label: 'יציאה מהריוקאן',             lat: 42.4101, lng: 141.0956, note: 'ארוחת בוקר כלולה' },
      { time: '09:30', type: 'place',   label: 'אגם טויה — חוף וכניסה',     lat: 42.5982, lng: 140.8377, duration: '90 דק\'', note: 'טיול רגלי חינם לאורך החוף. שייט ¥1,500 אופציונלי' },
      { time: '11:10', type: 'place',   label: 'הר אוסו — רכבל',             lat: 42.5334, lng: 140.8454, duration: '60 דק\'', note: '¥1,800 הלוך-חזור. תצפית על הקלדרה' },
      { time: '12:20', type: 'place',   label: 'שואה-שינזאן — הר צעיר',     lat: 42.5417, lng: 140.8580, duration: '45 דק\'', note: 'הר שנוצר ב-1943 — עדיין פולט אדים. גן דובים ¥850' },
      { time: '14:30', type: 'transit', label: '→ סאפורו',                   transport: '🚃 JR Muroran → JR Hakodate', station: 'Toyoura → Sapporo', dist: '1:40 שעות', lat: 43.0618, lng: 141.3545 },
      { time: '16:30', type: 'place',   label: 'הגעה לסאפורו — הכנה',       lat: 43.0618, lng: 141.3545, duration: '60 דק\'', note: 'צ\'ק-אין מלון ביזנס. מ-¥5,000 לחדר' },
      { time: '18:00', type: 'end',     label: 'סוסוקינו — ערב אוכל',        lat: 43.0554, lng: 141.3567, duration: '120 דק\'', note: 'ראמן מיסו מקומי / ג\'ינגיסקאן (כבש צלוי)', station: 'Susukino (N-09)' },
    ],
  },

  {
    day: 3,
    city: 'הוקאידו',
    cityEn: 'Hokkaido',
    title: 'סאפורו — שוק, גנים, בירה',
    subtitle: 'יום מלא בסאפורו',
    districtIds: [],
    notes: 'כרטיס יומי לסאבוויי סאפורו ¥830 — לא כלול ב-JR Pass. לקנות בכניסה.',
    walkingRoute: 'ניג\'ו → אודורי (10 דק\') → מוזיאון הבירה (15 דק\' רכבת) → כפר ההיסטוריה → מקדש',
    schedule: [
      { time: '08:00', type: 'start',   label: 'שוק ניג\'ו — ארוחת בוקר',   lat: 43.0641, lng: 141.3574, duration: '60 דק\'', note: '¥1,500 קערת סשימי טרי. דגי ים ישר מהנמל' },
      { time: '09:15', type: 'walk',    label: '→ פארק אודורי',              transport: '🚶 הליכה 10 דק\'', dist: '800מ', lat: 43.0617, lng: 141.3533 },
      { time: '09:30', type: 'place',   label: 'פארק אודורי',                lat: 43.0617, lng: 141.3533, duration: '45 דק\'', note: '1.5 ק"מ ירוק בלב העיר. מגדל הטלוויזיה ¥1,000 לתצפית' },
      { time: '11:00', type: 'transit', label: '→ מוזיאון הבירה',            transport: '🚃 Toho Line', station: 'Odori → Higashi-Kuyakusho', dist: '15 דק\'', lat: 43.0650, lng: 141.3984 },
      { time: '11:20', type: 'place',   label: 'מוזיאון בירה סאפורו',       lat: 43.0650, lng: 141.3984, duration: '75 דק\'', note: 'סיור חינם. בניין לבנים 1890. טעימות ¥500' },
      { time: '13:15', type: 'transit', label: '→ כפר ההיסטוריה',           transport: '🚃 JR + אוטובוס', station: 'Sapporo → Historical Village', dist: '35 דק\'', lat: 43.0226, lng: 141.4699 },
      { time: '14:00', type: 'place',   label: 'כפר ההיסטוריה',             lat: 43.0226, lng: 141.4699, duration: '2 שעות', note: '52 מבנים היסטוריים משוחזרים ¥800' },
      { time: '16:30', type: 'place',   label: 'מקדש הוקאידו + הר מארויאמה', lat: 43.0555, lng: 141.2988, duration: '75 דק\'', note: 'חינם. שינטו ביער, טיפוס קל לפסגה 225מ\'' },
      { time: '19:00', type: 'end',     label: 'ארוחת ערב — סוסוקינו',      lat: 43.0554, lng: 141.3567, note: 'ג\'ינגיסקאן / ראמן', station: 'Susukino (N-09)' },
    ],
  },

  {
    day: 4,
    city: 'הוקאידו',
    cityEn: 'Hokkaido',
    title: 'אוטארו — תעלות, זכוכית, ויסקי',
    subtitle: 'טיול יום מסאפורו (35 דק\' ברכבת)',
    districtIds: [],
    notes: 'נסיעה בבוקר — להספיק את ניקה ויסקי לפני 15:30. חזרה לסאפורו לערב.',
    walkingRoute: 'תחנת אוטארו → תעלה (10 דק\') → מוזיאון תיבות → יואיצ\'י (25 דק\' רכבת)',
    schedule: [
      { time: '09:00', type: 'start',   label: 'סאפורו → אוטארו',           transport: '🚃 JR Hakodate Line', station: 'Sapporo → Otaru', dist: '35 דק\'', lat: 43.1907, lng: 140.9946 },
      { time: '09:40', type: 'place',   label: 'תעלת אוטארו',                lat: 43.1985, lng: 140.9978, duration: '60 דק\'', note: 'מחסני אבן היסטוריים, גלריות, בתי קפה. חינם' },
      { time: '11:00', type: 'place',   label: 'מוזיאון תיבות הנגינה',       lat: 43.1921, lng: 141.0006, duration: '60 דק\'', note: 'מוזיאון חינם. סדנת יצירה ¥1,500' },
      { time: '12:15', type: 'place',   label: 'רחוב הסושי — צהריים',        lat: 43.1932, lng: 141.0021, duration: '60 דק\'', note: 'אוני, איקורה, אמאאבי מ-¥2,000' },
      { time: '13:30', type: 'transit', label: '→ יואיצ\'י — ניקה ויסקי',   transport: '🚃 JR Hakodate Line', station: 'Otaru → Yoichi', dist: '25 דק\'', lat: 43.2016, lng: 140.7790 },
      { time: '14:00', type: 'place',   label: 'מזקקת ניקה ויסקי',           lat: 43.2016, lng: 140.7790, duration: '90 דק\'', note: 'סיור חינם + טעימות. מבנים סקוטיים מ-1934' },
      { time: '16:30', type: 'transit', label: '→ חזרה לסאפורו',             transport: '🚃 JR Hakodate Line', station: 'Yoichi → Sapporo', dist: '60 דק\'', lat: 43.0618, lng: 141.3545 },
      { time: '18:00', type: 'end',     label: 'לינה — סאפורו (לילה 3)',     lat: 43.0618, lng: 141.3545, note: 'מלון ביזנס', station: 'Sapporo (various)' },
    ],
  },

  {
    day: 5,
    city: 'הוקאידו',
    cityEn: 'Hokkaido',
    title: 'פוראנו — שדות לבנדר ובריכה כחולה',
    subtitle: 'סאפורו → פוראנו → ביאיי',
    districtIds: [],
    notes: 'לצאת בבוקר מוקדם — ביאיי בצהריים + אופניים. הבריכה הכחולה יפה בבוקר מוקדם או ביום מעונן.',
    walkingRoute: 'סאפורו → פוראנו (2 שעות) → ביאיי (אוטובוס) → פארם טומיטה',
    schedule: [
      { time: '07:30', type: 'start',   label: 'סאפורו → פוראנו',           transport: '🚃 JR Furano Line', station: 'Sapporo → Furano', dist: '2 שעות', lat: 43.3541, lng: 142.3831 },
      { time: '09:40', type: 'place',   label: 'פארם טומיטה — שדות לבנדר',  lat: 43.3377, lng: 142.4264, duration: '90 דק\'', note: 'כניסה חינם. גלידת לבנדר ¥300. יולי = שיא' },
      { time: '11:30', type: 'transit', label: '→ ביאיי',                   transport: '🚃 JR Furano Line', station: 'Furano → Biei', dist: '40 דק\'', lat: 43.5938, lng: 142.4641 },
      { time: '12:30', type: 'place',   label: 'ביאיי — השכרת אופניים',     lat: 43.5938, lng: 142.4641, duration: '30 דק\'', note: '¥1,000 ליום. הדרך הכי טובה לסייר' },
      { time: '13:00', type: 'place',   label: 'גבעות הטלאים',               lat: 43.5972, lng: 142.4421, duration: '90 דק\'', note: 'חלקות חקלאיות בצבעים. עצי הקנוח המפורסמים' },
      { time: '15:00', type: 'place',   label: 'הבריכה הכחולה',              lat: 43.5942, lng: 142.5077, duration: '45 דק\'', note: 'בריכה טורקיז ממינרלים וולקניים. כניסה חינם' },
      { time: '16:30', type: 'place',   label: 'מפעל גבינות פוראנו',         lat: 43.3541, lng: 142.3831, duration: '45 דק\'', note: 'סדנת חמאה ¥880. גלידת חלב טרי' },
      { time: '19:00', type: 'end',     label: 'לינה — פוראנו (פנסיון)',     lat: 43.3541, lng: 142.3831, note: 'מינשוקו מ-¥5,000 כולל ארוחות', station: 'Furano Station' },
    ],
  },

  {
    day: 6,
    city: 'הוקאידו',
    cityEn: 'Hokkaido',
    title: 'אסאהיקאווה — גן חיות, סאקה, ראמן',
    subtitle: 'פוראנו → אסאהיקאווה',
    districtIds: [],
    notes: 'גן החיות אסאהיאמה — הכי פופולרי ביפן. להגיע בפתיחה (9:30) לפני ההמונים.',
    walkingRoute: 'פוראנו → אסאהיקאווה (1 שעה) → גן חיות → מוזיאון → מזקקת סאקה',
    schedule: [
      { time: '08:30', type: 'start',   label: 'פוראנו → אסאהיקאווה',       transport: '🚃 JR Furano Line', station: 'Furano → Asahikawa', dist: '1 שעה', lat: 43.7709, lng: 142.3652 },
      { time: '09:40', type: 'place',   label: 'גן החיות אסאהיאמה',          lat: 43.7709, lng: 142.4756, duration: '2.5 שעות', note: '¥1,000. פינגווינים, דובים קוטביים, גשר אורנגוטן' },
      { time: '12:30', type: 'place',   label: 'כפר הראמן — צהריים',         lat: 43.7652, lng: 142.3628, duration: '60 דק\'', note: '8 מסעדות, סגנון אסאהיקאווה: שומן על פני המרק. ¥800' },
      { time: '14:00', type: 'place',   label: 'מוזיאון אמנות הוקאידו',      lat: 43.7652, lng: 142.3505, duration: '60 דק\'', note: '¥510. אמנות מודרנית, השראת הצפון' },
      { time: '15:30', type: 'place',   label: 'מוזיאון מזקקת אוטוקויאמה',   lat: 43.7854, lng: 142.3672, duration: '60 דק\'', note: 'סיור חינם + טעימות סאקה. מי שלג של דאיסצוזאן' },
      { time: '19:00', type: 'end',     label: 'לינה — אסאהיקאווה',          lat: 43.7709, lng: 142.3652, note: 'מלון ביזנס מ-¥4,500', station: 'Asahikawa Station' },
    ],
  },

  {
    day: 7,
    city: 'הוקאידו',
    cityEn: 'Hokkaido',
    title: 'חזרה לטוקיו — המראה',
    subtitle: 'אסאהיקאווה → סאפורו → נמל צ\'יטוסה → טוקיו',
    districtIds: [],
    notes: 'טיסה פנים ארצית סאפורו-טוקיו — ANA/JAL. להזמין מראש מ-¥8,000 . להגיע 3 שעות לפני.',
    walkingRoute: 'אסאהיקאווה → סאפורו (1:25 שעות) → צ\'יטוסה (37 דק\') → טוקיו (1:30 שעות)',
    schedule: [
      { time: '08:00', type: 'start',   label: 'אסאהיקאווה → סאפורו',       transport: '🚃 Limited Express Kamui', station: 'Asahikawa → Sapporo', dist: '1:25 שעות', lat: 43.0618, lng: 141.3545 },
      { time: '09:30', type: 'place',   label: 'תחנת סאפורו — קניות',       lat: 43.0688, lng: 141.3508, duration: '90 דק\'', note: 'Royce שוקולד, LeTAO עוגת גבינה, שירוי קויביטו' },
      { time: '11:15', type: 'transit', label: '→ נמל צ\'יטוסה',             transport: '🚃 JR Airport Line', station: 'Sapporo → New Chitose Airport', dist: '37 דק\'', lat: 42.7751, lng: 141.6924 },
      { time: '12:00', type: 'place',   label: 'נמל צ\'יטוסה — ייצוג',       lat: 42.7751, lng: 141.6924, duration: '90 דק\'', note: 'קומת ראמן, חנות רויס\' שקופה, אזור אונסן ¥1,500' },
      { time: '14:00', type: 'transit', label: '✈ טיסה לטוקיו',              transport: '✈ ANA / JAL', station: 'New Chitose → Tokyo Haneda', dist: '1:30 שעות', lat: 35.5494, lng: 139.7798 },
      { time: '16:00', type: 'end',     label: 'הנדה, טוקיו — הגעה!',        lat: 35.5494, lng: 139.7798, note: 'הנדה → אסאקוסה: Keikyu Line 35 דק\'. ¥650', station: 'Haneda Airport' },
    ],
  },

  // =================== טוקיו — ימים 8-14 ===================

  {
    day: 8,
    city: 'טוקיו',
    cityEn: 'Tokyo',
    title: 'מסורת ומקדשים',
    subtitle: 'צפון-מזרח טוקיו',
    districtIds: ['asakusa', 'ueno', 'yanaka'],
    notes: 'להתחיל מוקדם באסאקוסה (8:00) לפני ההמונים. הליכה לאואנו דרך קאפאבאשי. שקיעה ביאנאקה.',
    walkingRoute: 'אסאקוסה → קאפאבאשי (20 דק\') → אואנו (15 דק\') → יאנאקה (10 דק\')',
    // תוכנית יומית מפורטת עם עצירות, תחבורה, זמנים ומרחקים
    schedule: [
      { time: '08:00', type: 'start',      label: 'מלון — אסאקוסה',       station: 'Asakusa (A-18)',       lat: 35.7133, lng: 139.7966, note: 'יציאה מהמלון' },
      { time: '08:10', type: 'walk',       label: '→ מקדש סנסו-ג\'י',     transport: '🚶 הליכה 5 דק\'',    dist: '400מ', lat: 35.7148, lng: 139.7967 },
      { time: '08:15', type: 'place',      label: 'מקדש סנסו-ג\'י',       duration: '45 דק\'',             lat: 35.7148, lng: 139.7967, note: 'כניסה חינם. שקט בבוקר מוקדם' },
      { time: '09:00', type: 'walk',       label: '→ נקמיסה-דורי',        transport: '🚶 הליכה 2 דק\'',    dist: '150מ', lat: 35.7119, lng: 139.7960 },
      { time: '09:10', type: 'place',      label: 'נקמיסה-דורי — חטיפים', duration: '30 דק\'',             lat: 35.7119, lng: 139.7960, note: 'דנגו, מלת-שלג, סנבאי' },
      { time: '09:45', type: 'transit',    label: '→ אואנו',              transport: '🚶 הליכה 25 דק\'',   dist: '1.8ק"מ', lat: 35.7141, lng: 139.7774, note: 'דרך קאפאבאשי (כלי בישול)' },
      { time: '10:15', type: 'place',      label: 'אואנו — שוק אמיוקו',   duration: '60 דק\'',             lat: 35.7089, lng: 139.7745, note: 'פירות ים, אוכל רחוב, קניות' },
      { time: '11:30', type: 'place',      label: 'Tokyo National Museum', duration: '90 דק\'',             lat: 35.7189, lng: 139.7765, note: '¥1000 — האוסף הגדול ביפן' },
      { time: '13:15', type: 'walk',       label: '→ יאנאקה',             transport: '🚶 הליכה 10 דק\'',   dist: '700מ', lat: 35.7270, lng: 139.7659 },
      { time: '13:30', type: 'place',      label: 'יאנאקה — צהריים',      duration: '45 דק\'',             lat: 35.7270, lng: 139.7659, note: 'מסעדות יפניות מסורתיות בסמטאות' },
      { time: '15:00', type: 'place',      label: 'יאנאקה גינזה — שקיעה', duration: '60 דק\'',             lat: 35.7262, lng: 139.7643, note: 'לחכות לשקיעה בסוף הרחוב' },
      { time: '17:00', type: 'transit',    label: '← חזרה למלון',         transport: '🚃 Ginza Line',       station: 'Nippori → Asakusa', dist: '10 דק\'' },
    ],
  },

  {
    day: 9,
    city: 'טוקיו',
    cityEn: 'Tokyo',
    title: 'אנרגיה עירונית',
    subtitle: 'מערב טוקיו',
    districtIds: ['harajuku', 'shibuya', 'shimokitazawa'],
    notes: 'בוקר במקדש מאיג\'י (שקט). צהריים בטקשיטה + אומוטסנדו. ערב בשיבויה. שימוקיטזאווה אם נשאר כוח.',
    walkingRoute: 'מאיג\'י → טקשיטה (5 דק\') → אומוטסנדו (10 דק\') → שיבויה (15 דק\')',
    schedule: [
      { time: '09:00', type: 'transit',    label: '→ הראג\'וקו',           transport: '🚃 Ginza Line → JR Yamanote', station: 'Asakusa → Harajuku', dist: '35 דק\'' },
      { time: '09:40', type: 'place',      label: 'מקדש מאיג\'י',          duration: '60 דק\'',             lat: 35.6763, lng: 139.6993, note: 'יש כניסה חינם — שקט ביער' },
      { time: '10:45', type: 'walk',       label: '→ טקשיטה-דורי',        transport: '🚶 הליכה 5 דק\'',    dist: '350מ', lat: 35.6702, lng: 139.7026 },
      { time: '10:50', type: 'place',      label: 'טקשיטה-דורי',          duration: '60 דק\'',             lat: 35.6702, lng: 139.7026, note: 'קרפ צבעוני + חנויות אופנה' },
      { time: '12:00', type: 'walk',       label: '→ אומוטסנדו',          transport: '🚶 הליכה 10 דק\'',   dist: '700מ', lat: 35.6654, lng: 139.7076 },
      { time: '12:15', type: 'place',      label: 'אומוטסנדו — צהריים',   duration: '75 דק\'',             lat: 35.6654, lng: 139.7076, note: 'מסעדות, קפה, אדריכלות' },
      { time: '13:45', type: 'walk',       label: '→ שיבויה',             transport: '🚶 הליכה 15 דק\'',   dist: '1.1ק"מ', lat: 35.6580, lng: 139.7016 },
      { time: '14:00', type: 'place',      label: 'Shibuya Sky — תצפית',  duration: '60 דק\'',             lat: 35.6580, lng: 139.7016, note: '¥2000 — נוף 360° מעל הצומת' },
      { time: '15:30', type: 'place',      label: 'שיבויה קרוסינג',       duration: '30 דק\'',             lat: 35.6595, lng: 139.7004, note: 'לעמוד בשעת שיא — מרהיב' },
      { time: '16:30', type: 'transit',    label: '→ שימוקיטזאווה',       transport: '🚃 Keio Inokashira Line', station: 'Shibuya → Shimokitazawa', dist: '5 דק\'' },
      { time: '17:00', type: 'place',      label: 'שימוקיטזאווה — ערב',   duration: '120 דק\'',            lat: 35.6613, lng: 139.6685, note: 'וינטג\', קפה, תיאטרון קטן' },
    ],
  },

  {
    day: 10,
    city: 'טוקיו',
    cityEn: 'Tokyo',
    title: 'טכנולוגיה ומשחקים',
    subtitle: 'מרכז-מזרח',
    districtIds: ['akihabara', 'ginza'],
    notes: 'בוקר באקיהברה — אלקטרוניקה וגיימינג. אחה"צ לגינזה — שוק צוקיג\'י (נסגר מוקדם) + קניות.',
    walkingRoute: 'אקיהברה → גינזה (15 דק\' ברכבת)',
    schedule: [
      { time: '09:30', type: 'transit',    label: '→ אקיהברה',            transport: '🚃 Ginza Line → Hibiya Line', station: 'Asakusa → Akihabara', dist: '15 דק\'' },
      { time: '09:50', type: 'place',      label: 'Yodobashi Camera',      duration: '60 דק\'',             lat: 35.7023, lng: 139.7745, note: 'אלקטרוניקה, Free Tax לתיירים' },
      { time: '11:00', type: 'place',      label: 'Animate — אנימה',       duration: '45 דק\'',             lat: 35.7015, lng: 139.7733, note: 'מנגה, פיגורינים, קוספליי' },
      { time: '11:50', type: 'place',      label: 'ארקייד SEGA',           duration: '45 דק\'',             lat: 35.7018, lng: 139.7740, note: 'גיימינג, UFO catchers' },
      { time: '13:00', type: 'transit',    label: '→ גינזה / צוקיג\'י',   transport: '🚃 Hibiya Line',      station: 'Akihabara → Tsukijishijo', dist: '15 דק\'' },
      { time: '13:20', type: 'place',      label: 'שוק צוקיג\'י החיצוני', duration: '60 דק\'',             lat: 35.6654, lng: 139.7707, note: 'אוכל ים, סושי טרי — לבוא רעבים!' },
      { time: '14:30', type: 'walk',       label: '→ גינזה',              transport: '🚶 הליכה 10 דק\'',   dist: '750מ', lat: 35.6717, lng: 139.7649 },
      { time: '14:45', type: 'place',      label: 'Ginza Six',             duration: '60 דק\'',             lat: 35.6717, lng: 139.7649, note: 'גג ירוק פתוח, אמנות, קניות' },
      { time: '16:00', type: 'place',      label: 'Kabuki-za',             duration: '60 דק\'',             lat: 35.6695, lng: 139.7659, note: 'כרטיס מערכה אחת — ¥1500' },
    ],
  },

  {
    day: 11,
    city: 'טוקיו',
    cityEn: 'Tokyo',
    title: 'אמנות ועיצוב',
    subtitle: 'דרום טוקיו',
    districtIds: ['roppongi', 'nakameguro'],
    notes: 'בוקר ב-21_21 Design Sight. צהריים ב-Mori Art Museum + תצפית. אחה"צ הליכה לנקמגורו לאורך התעלה.',
    walkingRoute: 'רופונגי → נקמגורו (20 דק\' ברכבת או 40 דק\' ברגל)',
    schedule: [
      { time: '10:00', type: 'transit',    label: '→ רופונגי',            transport: '🚃 Hibiya Line',      station: 'Asakusa → Roppongi', dist: '25 דק\'' },
      { time: '10:30', type: 'place',      label: '21_21 Design Sight',    duration: '60 דק\'',             lat: 35.6643, lng: 139.7278, note: '¥1200 — עיצוב יפני עכשווי' },
      { time: '11:45', type: 'walk',       label: '→ Mori Art Museum',     transport: '🚶 הליכה 8 דק\'',    dist: '600מ', lat: 35.6628, lng: 139.7315 },
      { time: '12:00', type: 'place',      label: 'Mori Art Museum',       duration: '90 דק\'',             lat: 35.6628, lng: 139.7315, note: '¥1800 כולל תצפית מקומה 52' },
      { time: '13:45', type: 'place',      label: 'Tokyo City View',       duration: '30 דק\'',             lat: 35.6607, lng: 139.7300, note: 'תצפית פנורמית — ביום בהיר רואים פוג\'י' },
      { time: '14:30', type: 'place',      label: 'Tokyo Midtown',         duration: '60 דק\'',             lat: 35.6665, lng: 139.7310, note: 'קניות, אוכל, גן יפני קטן' },
      { time: '16:00', type: 'transit',    label: '→ נקמגורו',            transport: '🚃 Hibiya Line → Tokyu Toyoko', station: 'Roppongi → Nakameguro', dist: '15 דק\'' },
      { time: '16:20', type: 'place',      label: 'תעלת מגורו',           duration: '45 דק\'',             lat: 35.6442, lng: 139.6988, note: 'הליכה לאורך המים — מקסים בשקיעה' },
      { time: '17:30', type: 'place',      label: 'יאקיטורי ליד התעלה',   duration: '90 דק\'',             lat: 35.6440, lng: 139.6975, note: 'בארים קטנים מתחת הגשר' },
    ],
  },

  {
    day: 12,
    city: 'טוקיו',
    cityEn: 'Tokyo',
    title: 'חיי לילה וסמטאות',
    subtitle: 'שינג\'וקו',
    districtIds: ['shinjuku'],
    notes: 'בוקר ב-Shinjuku Gyoen. צהריים חופשי. ערב: Omoide Yokocho לאוכל → Golden Gai לשתייה → Kabukicho לאווירה.',
    walkingRoute: 'הכל ברגל — הכל באזור התחנה',
    schedule: [
      { time: '09:30', type: 'transit',    label: '→ שינג\'וקו',          transport: '🚃 Toei Asakusa Line → JR', station: 'Asakusa → Shinjuku', dist: '30 דק\'' },
      { time: '10:00', type: 'place',      label: 'Shinjuku Gyoen',        duration: '90 דק\'',             lat: 35.6852, lng: 139.7100, note: '¥500 — גן לאומי, שלושה סגנונות' },
      { time: '12:00', type: 'place',      label: 'Tokyo Metropolitan Gov.', duration: '30 דק\'',           lat: 35.6896, lng: 139.6922, note: 'תצפית חינם מקומה 45' },
      { time: '13:00', type: 'place',      label: 'Omoide Yokocho — צהריים', duration: '60 דק\'',           lat: 35.6936, lng: 139.7004, note: 'יאקיטורי ובירה על הדוכנים' },
      { time: '14:30', type: 'walk',       label: '→ קאבוקיצ\'ו',         transport: '🚶 הליכה 5 דק\'',    dist: '400מ', lat: 35.6965, lng: 139.7036 },
      { time: '15:00', type: 'place',      label: 'Kabukicho',             duration: '60 דק\'',             lat: 35.6965, lng: 139.7036, note: 'רובע הבידור — ניאון בעיצומו' },
      { time: '19:00', type: 'place',      label: 'Golden Gai',            duration: '120 דק\'',            lat: 35.6940, lng: 139.7033, note: '200+ בארים זעירים — לבחור אחד ולשבת' },
    ],
  },

  {
    day: 13,
    city: 'טוקיו',
    cityEn: 'Tokyo',
    title: 'מפרץ טוקיו',
    subtitle: 'אודאיבה',
    districtIds: ['odaiba'],
    notes: 'יום שלם — teamLab (להזמין מראש!), Miraikan, גנדאם. רכבת Yurikamome מ-Shimbashi — הנסיעה עצמה חוויה.',
    walkingRoute: 'הכל באודאיבה — הליכה בין האטרקציות',
    schedule: [
      { time: '09:00', type: 'transit',    label: '→ שימבאשי',            transport: '🚃 Ginza Line',       station: 'Asakusa → Shimbashi', dist: '15 דק\'' },
      { time: '09:15', type: 'transit',    label: '→ אודאיבה',            transport: '🚃 Yurikamome (מעל המים!)', station: 'Shimbashi → Odaiba-Kaihinkoen', dist: '20 דק\'' },
      { time: '09:40', type: 'place',      label: 'teamLab Borderless',    duration: '120 דק\'',            lat: 35.6252, lng: 139.7756, note: '¥3200 — חובה להזמין מראש באתר' },
      { time: '12:00', type: 'place',      label: 'Unicorn Gundam',        duration: '20 דק\'',             lat: 35.6262, lng: 139.7803, note: 'פסל ענק 20מ\' — מופע ב-17:00 ו-20:00' },
      { time: '12:30', type: 'place',      label: 'Diver City — צהריים',  duration: '60 דק\'',             lat: 35.6248, lng: 139.7793, note: 'קניון עם מסעדות יפניות' },
      { time: '14:00', type: 'place',      label: 'Miraikan',              duration: '90 דק\'',             lat: 35.6198, lng: 139.7758, note: '¥630 — מדע, רובוט אסימו, חלל' },
      { time: '16:00', type: 'place',      label: 'Odaiba Beach — שקיעה', duration: '45 דק\'',             lat: 35.6274, lng: 139.7748, note: 'נוף לגשר הקשת וטוקיו טאואר' },
      { time: '17:30', type: 'transit',    label: '← חזרה',               transport: '🚃 Yurikamome → Rinkai Line', station: 'Odaiba → Osaki → Shinjuku', dist: '35 דק\'' },
    ],
  },

  {
    day: 14,
    city: 'טוקיו',
    cityEn: 'Tokyo',
    title: 'יום חופשי / גמישות',
    subtitle: 'חזרה למועדפים',
    districtIds: [],
    notes: 'יום לחזור למקומות שאהבתם, קניות אחרונות, או טיול יום מטוקיו (קאמאקורה / ניקו / האקונה).',
    walkingRoute: 'לפי בחירה',
    schedule: [
      { time: '09:00', type: 'choice',     label: 'אפשרות א\' — קאמאקורה',  transport: '🚃 JR Yokosuka Line', station: 'Shinjuku → Kamakura', dist: '60 דק\'', lat: 35.3197, lng: 139.5467, note: 'בודהא ענק, חוף ים, מקדשים' },
      { time: '09:00', type: 'choice',     label: 'אפשרות ב\' — ניקו',       transport: '🚃 Tobu Nikko Line', station: 'Asakusa → Nikko', dist: '120 דק\'', lat: 36.7198, lng: 139.6983, note: 'מקדשים ביער — יוצאים מוקדם!' },
      { time: '09:00', type: 'choice',     label: 'אפשרות ג\' — האקונה',     transport: '🚃 Odakyu Romancecar', station: 'Shinjuku → Hakone', dist: '85 דק\'', lat: 35.2321, lng: 139.1069, note: 'אגם, הר פוג\'י, אונסן' },
      { time: '17:00', type: 'place',      label: 'אחרון! קניות מזכרות',    duration: '90 דק\'',             lat: 35.7023, lng: 139.7745, note: 'Don Quijote / Akihabara לדברים אחרונים' },
    ],
  },

];


// ----------------------------------------------------------
//  ערי יפן — מחוץ לטוקיו
//
//  position — קואורדינטות גיאוגרפיות אמיתיות { lat, lng }
//  image    — URL לתמונה (השאירו '' לפלייסהולדר)
// ----------------------------------------------------------
const JAPAN_LOCATIONS = [

  {
    id: 'kyoto',
    name: 'קיוטו',
    romaji: 'Kyoto',
    region: 'קאנסאי',
    lat: 35.0116,
    lng: 135.7681,
    timeNeeded: '2-3 ימים',
    bestTime: 'אביב (פריחת דובדבן) / סתיו (עלים אדומים)',
    unique: 'בירת יפן למשך אלף שנה. מקדשים, גייישות, גנים זן וארכיטקטורה עתיקה.',
    image: '',
    experiences: ['culture', 'food', 'nature'],
    highlights: [
      { name: 'מקדש קינקאקו-ג\'י', desc: 'מקדש הזהב — אחד הסמלים של יפן', duration: '60 דקות' },
      { name: 'גיאון', desc: 'רובע הגייישות — לטייל בערב', duration: '90 דקות' },
      { name: 'פושימי אינארי', desc: '10,000 שערי טוריי אדומים על ההר', duration: '2-3 שעות' },
      { name: 'ארשייאמה', desc: 'יער הבמבוק וטיול בסירות על הנהר', duration: '3 שעות' },
      { name: 'מקדש קיומיזו-דרה', desc: 'מקדש עץ על הר עם נוף לעיר', duration: '75 דקות' },
    ],
  },

  {
    id: 'osaka',
    name: 'אוסקה',
    romaji: 'Osaka',
    region: 'קאנסאי',
    lat: 34.6937,
    lng: 135.5023,
    timeNeeded: '1-2 ימים',
    bestTime: 'כל השנה — אוכל ובידור 24 שעות',
    unique: 'בירת האוכל של יפן. מטבח רחוב, חיי לילה, טירה היסטורית ופארק שעשועים.',
    image: '',
    experiences: ['food', 'street', 'fun'],
    highlights: [
      { name: 'דוטונבורי', desc: 'לב ההנאות — שלטי ניאון ואוכל רחוב', duration: '2-3 שעות' },
      { name: 'טירת אוסקה', desc: 'טירה מהמאה ה-16 עם מוזיאון וגן', duration: '90 דקות' },
      { name: 'קורואמון איצ\'יבה', desc: 'שוק ה"מטבח של אוסקה"', duration: '60 דקות' },
      { name: 'Universal Studios Japan', desc: 'פארק שעשועים עם עולם הארי פוטר', duration: 'יום שלם' },
      { name: 'שינסאיבאשי', desc: 'קניות, בוטיקים ורחוב מקורה', duration: '90 דקות' },
    ],
  },

  {
    id: 'hokkaido',
    name: 'הוקאידו',
    romaji: 'Hokkaido',
    region: 'צפון יפן',
    lat: 43.0618,
    lng: 141.3545,
    timeNeeded: '3-5 ימים',
    bestTime: 'חורף (שלג) / קיץ (פרחים ופארקים)',
    unique: 'האי הצפוני — טבע פראי, שלג זכר, מעיינות חמים ואוכל ים מהטוב ביפן.',
    image: '',
    experiences: ['nature', 'food', 'culture'],
    highlights: [
      { name: 'סאפורו פסטיבל השלג', desc: 'פסלי שלג ענקיים — פברואר', duration: 'יום שלם' },
      { name: 'נוסוון', desc: 'שדות לבנדר — מרהיב בקיץ (יולי)', duration: 'יום שלם' },
      { name: 'פארק לאומי דאיסצוזן', desc: 'הר הגעש הגבוה ביפן', duration: '2 ימים' },
      { name: 'האקודאטה', desc: 'עיר נמל עתיקה — נוף מההר בלילה', duration: 'יום שלם' },
      { name: 'אונסן בשלג', desc: 'מעיינות חמים — חוויה יפנית קסומה', duration: '2-3 שעות' },
    ],
  },

  {
    id: 'fukuoka',
    name: 'פוקואוקה',
    romaji: 'Fukuoka',
    region: 'קיושו',
    lat: 33.5904,
    lng: 130.4017,
    timeNeeded: '1-2 ימים',
    bestTime: 'כל השנה',
    unique: 'שער קיושו. ידועה ברמן המקומי, דוכני יאטאי על הנהר וחיי לילה.',
    image: '',
    experiences: ['food', 'street', 'culture'],
    highlights: [
      { name: 'יאטאי (דוכני לילה)', desc: 'דוכני רמן ואוכל ים ליד הנהר', duration: '90 דקות' },
      { name: 'הקאטה הישנה', desc: 'שכונת גייישות ורחובות עתיקים', duration: '60 דקות' },
      { name: 'אוהורי פארק', desc: 'פארק עם אגם בלב העיר', duration: '45 דקות' },
      { name: 'מקדש דאזאיפו', desc: 'מקדש שינטו מפורסם', duration: '60 דקות' },
      { name: 'טנג\'ין', desc: 'הרחוב המסחרי הראשי של קיושו', duration: '90 דקות' },
    ],
  },

  {
    id: 'hiroshima',
    name: 'הירושימה',
    romaji: 'Hiroshima',
    region: 'חוגוקו',
    lat: 34.3853,
    lng: 132.4553,
    timeNeeded: '1-2 ימים',
    bestTime: 'כל השנה — אביב יפה במיוחד',
    unique: 'עיר השלום. מוזיאון ההפצצה האטומית, כיפת גנבאקו, ואי מיאג\'ימה עם שער הטוריי בים.',
    image: '',
    experiences: ['culture', 'nature', 'food'],
    highlights: [
      { name: 'פארק השלום', desc: 'אנדרטאות וכיפת גנבאקו', duration: '60 דקות' },
      { name: 'מוזיאון השלום', desc: 'תיעוד מרגש ומחשבותי — חובה', duration: '90 דקות' },
      { name: 'איי מיאג\'ימה', desc: 'שער טוריי בים, עדרי אייל, הר מיסן', duration: 'יום שלם' },
      { name: 'אוקונומיאקי הירושימה', desc: 'הגרסה המקומית של הפנקייק הסבוך', duration: '45 דקות' },
      { name: 'גן שוקקיאן', desc: 'גן יפני מסורתי מהמאה ה-17', duration: '45 דקות' },
    ],
  },

  {
    id: 'hakone',
    name: 'האקונה',
    romaji: 'Hakone',
    region: 'קאנטו',
    lat: 35.2321,
    lng: 139.1069,
    timeNeeded: 'יום אחד או לילה',
    bestTime: 'כל עונה — יום בהיר לתצפית על פוג\'י',
    unique: 'עיירת נופש בתוך לוע הר געש עתיק — מעיינות חמים, אגם ומוזיאון פסלים פתוח.',
    image: '',
    experiences: ['nature', 'onsen', 'art'],
    highlights: [
      { name: 'אגם אשי', desc: 'אגם בתוך לוע הר געש, שייט עם נוף להר פוג\'י', duration: '60 דקות' },
      { name: 'מקדש האקונה', desc: 'שער הכניסה הכתום ניצב בתוך מי האגם', duration: '45 דקות' },
      { name: 'אזור האדמה הפעילה', desc: 'בוץ מבעבע, אדמה פולטת עשן מפעילות געשית', duration: '30 דקות' },
      { name: 'המוזיאון הפתוח', desc: 'פסלים מודרניים מרחבי העולם בגן רחב', duration: '2 שעות' },
    ],
  },

  {
    id: 'nara',
    name: 'נארה',
    romaji: 'Nara',
    region: 'קאנסאי',
    lat: 34.6851,
    lng: 135.8049,
    timeNeeded: 'חצי יום - יום',
    bestTime: 'כל עונה',
    unique: 'בירת יפן הראשונה (מאה 8) — מבנה העץ הגדול בעולם, איילים מסתובבים בחופשיות בפארק.',
    image: '',
    experiences: ['culture', 'history', 'nature'],
    highlights: [
      { name: 'מקדש טודאי-ג\'י', desc: 'מבנה העץ הגדול בעולם, פסל בודהא ענק בגובה 16 מטר', duration: '60 דקות' },
      { name: 'מקדש קאסוגה', desc: 'מקדש שינטו מקושט באלפי מנורות מאבן ומברונזה', duration: '45 דקות' },
      { name: 'פארק נארה', desc: 'פארק גדול שבו איילים משוטטים בחופשיות', duration: '60 דקות' },
    ],
  },

  {
    id: 'nikko',
    name: 'ניקו',
    romaji: 'Nikko',
    region: 'קאנטו',
    lat: 36.7198,
    lng: 139.6983,
    timeNeeded: 'יום אחד',
    bestTime: 'סתיו (שלכת מרשימה), אביב',
    unique: 'מאוזוליאום מפואר של השוגון שאיחד את יפן — גילופי עץ ייחודיים ביער ארזים עתיק.',
    image: '',
    experiences: ['culture', 'history', 'nature', 'art'],
    highlights: [
      { name: 'מכלול מקדשי טושוגו', desc: 'מאוזוליאום השוגון טוקוגווה — גילופי עץ מרשימים', duration: '3-4 שעות' },
      { name: 'יער הארזים', desc: 'יער עתיק מקיף את המקדשים', duration: '60 דקות' },
      { name: 'גילופי שלוש הקופים', desc: 'הגילוף המפורסם "לא רואה, לא שומע, לא מדבר"', duration: '15 דקות' },
    ],
  },

  {
    id: 'himeji',
    name: 'הימג\'י',
    romaji: 'Himeji',
    region: 'קאנסאי',
    lat: 34.8394,
    lng: 134.6939,
    timeNeeded: 'חצי יום',
    bestTime: 'כל עונה — אביב לפריחת דובדבן בחפיר',
    unique: 'טירת הסמוראים המקורית והיפה ביותר ביפן — שרדה מלחמות והפצצות, עץ מקורי (לא בטון משוחזר).',
    image: '',
    experiences: ['history', 'culture'],
    highlights: [
      { name: 'טירת האנפה', desc: 'נבנתה במאה ה-16, נותרה שלמה — בה צולם "שוגון"', duration: '2-3 שעות' },
      { name: 'הגנים היפניים', desc: 'גנים מסורתיים ליד הטירה', duration: '45 דקות' },
    ],
  },

  {
    id: 'takayama',
    name: 'טקיאמה',
    romaji: 'Takayama',
    region: 'האלפים היפניים',
    lat: 36.1461,
    lng: 137.2521,
    timeNeeded: 'יום - יום וחצי',
    bestTime: 'אביב (פסטיבל אפריל) או סתיו (פסטיבל אוקטובר)',
    unique: 'עיירה עתיקה באלפים היפניים — רחובות ובתי עץ מסורתיים משומרים, שוק איכרים יומי.',
    image: '',
    experiences: ['street', 'food', 'culture', 'history'],
    highlights: [
      { name: 'רחובות סאנמאצ\'י סוג\'י', desc: 'רחובות עתיקים עם בתי עץ, מבשלות סאקה ובתי תה', duration: '2-3 שעות' },
      { name: 'שוק הבוקר', desc: 'איכרי האזור מוכרים תוצרת חקלאית טרייה כל בוקר', duration: '1-2 שעות' },
      { name: 'מוזיאון המרכבות', desc: 'מרכבות ענק יפהפיות מהפסטיבל', duration: '45 דקות' },
    ],
  },

  {
    id: 'shirakawa-go',
    name: 'שירקווה גו',
    romaji: 'Shirakawa-Go',
    region: 'האלפים היפניים',
    lat: 36.2576,
    lng: 136.9065,
    timeNeeded: 'חצי יום',
    bestTime: 'חורף (שלג על הגגות) או קיץ (ירוק)',
    unique: 'כפר מסורתי עם בתי ענק מעץ ומקש — אוצר לאומי, אתר מורשת עולמית של אונסק"ו.',
    image: '',
    experiences: ['culture', 'history', 'nature'],
    highlights: [
      { name: 'בתי הגאסשו-זוקורי', desc: 'בתי ענק מעץ ומקש, כל בית מאכלס חמולה שלמה', duration: '2-3 שעות' },
      { name: 'תצפית מהגבעה', desc: 'נקודת תצפית על הכפר כולו', duration: '30 דקות' },
    ],
  },

  {
    id: 'koyasan',
    name: 'הר קויה',
    romaji: 'Koyasan',
    region: 'קאנסאי',
    lat: 34.2136,
    lng: 135.5849,
    timeNeeded: 'לילה אחד',
    bestTime: 'כל עונה',
    unique: 'מרכז בודהיסטי בלב יער ארזים ענקיים — מוקד עלייה לרגל מהחשובים ביפן.',
    image: '',
    experiences: ['spiritual', 'culture', 'nature'],
    highlights: [
      { name: 'אוקונואין', desc: 'אתר הקבורה הגדול ביפן — שביל ביער ארזים בין אלפי מצבות עתיקות', duration: '2 שעות' },
      { name: 'מקדש כת השינגון', desc: 'המקדש המרכזי של כת השינגון הבודהיסטית', duration: '60 דקות' },
    ],
  },

  {
    id: 'kurashiki',
    name: 'קוראשיקי',
    romaji: 'Kurashiki',
    region: 'חוגוקו',
    lat: 34.5850,
    lng: 133.7715,
    timeNeeded: 'חצי יום',
    bestTime: 'כל עונה',
    unique: 'עיר עתיקה עם תעלות מים וגשרים — מחסני אורז פיאודליים שהפכו למוזיאוני אמנות.',
    image: '',
    experiences: ['art', 'street', 'history'],
    highlights: [
      { name: 'רובע התעלות (ביקאן)', desc: 'תעלות מים, גשרים עתיקים, ערבות — אווירה ציורית', duration: '1-2 שעות' },
      { name: 'מוזיאון אוהרה', desc: 'אוסף אמנות מערבית ויפנית במחסן אורז משוחזר', duration: '1-2 שעות' },
    ],
  },

];

// ----------------------------------------------------------
//  לינה — מלון לכל לילה בין ימי הטיול
//  afterDay — לאחר איזה יום (0 = אחרי יום 1, וכו')
//  lat/lng — לסימון על המפה
// ----------------------------------------------------------
const HOTELS = [
  // =================== מלונות הוקאידו ===================
  {
    afterDay: 0,
    city: 'הוקאידו — נובוריבצו', cityEn: 'Hokkaido',
    name: 'Noboribetsu Grand Hotel',
    nameHe: 'ריוקאן נובוריבצו',
    area: 'נובוריבצו אונסן',
    type: 'ריוקאן עם אונסן',
    note: 'לינה יפנית מסורתית, 9 סוגי מי מינרלים, ארוחות כלולות',
    url: 'https://www.noboribetsu-grand.jp',
    lat: 42.4101, lng: 141.0956,
    nearestStation: 'Noboribetsu Station — 10 דק\' אוטובוס',
    stationLat: 42.4136, stationLng: 141.1029,
  },
  {
    afterDay: 1,
    city: 'הוקאידו — סאפורו', cityEn: 'Hokkaido',
    name: 'Toyoko Inn Sapporo',
    nameHe: 'טויוקו אין סאפורו',
    area: 'סאפורו מרכז',
    type: 'מלון ביזנס',
    note: 'ארוחת בוקר חינם, ניקיון מושלם, ליד התחנה',
    url: 'https://www.toyoko-inn.com',
    lat: 43.0618, lng: 141.3545,
    nearestStation: 'Sapporo Station — 3 דק\' הליכה',
    stationLat: 43.0688, stationLng: 141.3508,
  },
  {
    afterDay: 2,
    city: 'הוקאידו — סאפורו', cityEn: 'Hokkaido',
    name: 'Toyoko Inn Sapporo',
    nameHe: 'טויוקו אין סאפורו',
    area: 'סאפורו מרכז',
    type: 'מלון ביזנס',
    note: 'לילה שני, אותו מלון',
    url: 'https://www.toyoko-inn.com',
    lat: 43.0618, lng: 141.3545,
    nearestStation: 'Sapporo Station — 3 דק\' הליכה',
    stationLat: 43.0688, stationLng: 141.3508,
  },
  {
    afterDay: 3,
    city: 'הוקאידו — סאפורו', cityEn: 'Hokkaido',
    name: 'Toyoko Inn Sapporo',
    nameHe: 'טויוקו אין סאפורו',
    area: 'סאפורו מרכז',
    type: 'מלון ביזנס',
    note: 'לילה שלישי (יום 4 = טיול יום לאוטארו)',
    url: 'https://www.toyoko-inn.com',
    lat: 43.0618, lng: 141.3545,
    nearestStation: 'Sapporo Station — 3 דק\' הליכה',
    stationLat: 43.0688, stationLng: 141.3508,
  },
  {
    afterDay: 4,
    city: 'הוקאידו — פוראנו', cityEn: 'Hokkaido',
    name: 'Furano Natulux Hotel',
    nameHe: 'פנסיון פוראנו',
    area: 'פוראנו',
    type: 'מינשוקו (פנסיון)',
    note: 'ארוחות כלולות, בעלי בית יפניים, אווירה כפרית',
    url: 'https://www.natulux.com',
    lat: 43.3541, lng: 142.3831,
    nearestStation: 'Furano Station — 5 דק\' הליכה',
    stationLat: 43.3541, stationLng: 142.3831,
  },
  {
    afterDay: 5,
    city: 'הוקאידו — אסאהיקאווה', cityEn: 'Hokkaido',
    name: 'Route Inn Asahikawa',
    nameHe: 'רוט אין אסאהיקאווה',
    area: 'אסאהיקאווה מרכז',
    type: 'מלון ביזנס',
    note: 'קרוב לתחנה ולגן החיות. ארוחת בוקר חינם',
    url: 'https://www.route-inn.co.jp',
    lat: 43.7709, lng: 142.3652,
    nearestStation: 'Asahikawa Station — 5 דק\' הליכה',
    stationLat: 43.7709, stationLng: 142.3652,
  },
  // =================== מלונות טוקיו ===================
  {
    afterDay: 7,
    city: 'טוקיו', cityEn: 'Tokyo',
    name: 'Khaosan Tokyo Origami',
    nameHe: 'ח\'אוסן טוקיו אוריגמי',
    area: 'אסאקוסה',
    type: 'הוסטל בוטיק',
    note: 'עיצוב מאוריגמי, לב העיר הישנה, 5 דקות ממקדש סנסו-ג\'י',
    url: 'https://khaosan-tokyo.com',
    lat: 35.7133, lng: 139.7966,
    nearestStation: 'Asakusa (A-18) — 3 דק\' הליכה',
    stationLat: 35.7117, stationLng: 139.7967,
  },
  {
    afterDay: 8,
    city: 'טוקיו', cityEn: 'Tokyo',
    name: 'Bunka Hostel Tokyo',
    nameHe: 'בונקה הוסטל',
    area: 'אסאקוסה',
    type: 'הוסטל תרבותי',
    note: 'בר יפני בלובי, קהל מעורב, רחוב שקט עם אופי מסורתי',
    url: 'https://www.bunkahostel.jp',
    lat: 35.7105, lng: 139.7930,
    nearestStation: 'Tawaramachi (G-18) — 2 דק\' הליכה',
    stationLat: 35.7112, stationLng: 139.7908,
  },
  {
    afterDay: 9,
    city: 'טוקיו', cityEn: 'Tokyo',
    name: 'Book and Bed Tokyo Shinjuku',
    nameHe: 'ספר ומיטה שינג\'וקו',
    area: 'שינג\'וקו',
    type: 'הוסטל ספרים',
    note: 'שנים בתוך מדפי ספרים — חוויה ייחודית, מיקום מושלם לחיי לילה',
    url: 'https://bookandbedtokyo.com',
    lat: 35.6900, lng: 139.7006,
    nearestStation: 'Shinjuku (multiple lines) — 4 דק\' הליכה',
    stationLat: 35.6896, stationLng: 139.6997,
  },
  {
    afterDay: 10,
    city: 'טוקיו', cityEn: 'Tokyo',
    name: 'Wired Hotel Asakusa',
    nameHe: 'וויירד הוטל',
    area: 'אסאקוסה',
    type: 'בוטיק חדיש',
    note: 'עיצוב תעשייתי, גג עם נוף לסקיי טרי, מחירים סבירים',
    url: 'https://wiredhotel.com',
    lat: 35.7127, lng: 139.7954,
    nearestStation: 'Asakusa (A-18) — 5 דק\' הליכה',
    stationLat: 35.7117, stationLng: 139.7967,
  },
  {
    afterDay: 11,
    city: 'טוקיו', cityEn: 'Tokyo',
    name: 'K\'s House Tokyo Oasis',
    nameHe: 'קיי\'ס האוס אואזיס',
    area: 'אואנו',
    type: 'גסטהאוס',
    note: 'אווירה משפחתית, מטבח משותף, פופולרי בקרב תיירים',
    url: 'https://kshouse.jp',
    lat: 35.7150, lng: 139.7774,
    nearestStation: 'Nezu (C-14) — 4 דק\' הליכה',
    stationLat: 35.7200, stationLng: 139.7617,
  },
  {
    afterDay: 12,
    city: 'טוקיו', cityEn: 'Tokyo',
    name: 'The Millennials Shibuya',
    nameHe: 'מילניאלס שיבויה',
    area: 'שיבויה',
    type: 'קפסולה חכמה',
    note: 'כורסאות קפסולה עם iPad, בר שיתופי, בצומת שיבויה',
    url: 'https://the-millennials-shibuya.com',
    lat: 35.6593, lng: 139.7005,
    nearestStation: 'Shibuya (multiple lines) — 2 דק\' הליכה',
    stationLat: 35.6580, stationLng: 139.7016,
  },
];

// קואורדינטות טוקיו לאתחול מפת טוקיו
const TOKYO_CENTER = { lat: 35.6762, lng: 139.6503 };

// קואורדינטות גיאוגרפיות לרובעי טוקיו (להחלפת position x/y ב-Leaflet)
const DISTRICT_COORDS = {
  shibuya:       { lat: 35.6580, lng: 139.7016 },
  shinjuku:      { lat: 35.6938, lng: 139.7034 },
  asakusa:       { lat: 35.7148, lng: 139.7967 },
  harajuku:      { lat: 35.6702, lng: 139.7026 },
  akihabara:     { lat: 35.7023, lng: 139.7745 },
  ginza:         { lat: 35.6717, lng: 139.7649 },
  ueno:          { lat: 35.7141, lng: 139.7774 },
  roppongi:      { lat: 35.6628, lng: 139.7315 },
  odaiba:        { lat: 35.6252, lng: 139.7756 },
  shimokitazawa: { lat: 35.6613, lng: 139.6685 },
  yanaka:        { lat: 35.7270, lng: 139.7659 },
  nakameguro:    { lat: 35.6442, lng: 139.6988 },
};


// ----------------------------------------------------------
//  הגדרות נוספות — ערכו לפי הצורך
// ----------------------------------------------------------
const CONFIG = {
  tripTitle: 'טוקיו — מסלול שבועי',
  travelers: 'משפחה — 2 מבוגרים + 2 מתבגרים',
  currency: '¥',
  
  // עדיפויות — כחול-כהה, גודל + עוצמה לפי חוקיות אחידה
  priorities: {
    high:   { label: 'גבוהה',  color: 'rgba(26,54,93,0.90)', bg: 'rgba(26,54,93,0.09)', textColor: '#1a365d' },
    medium: { label: 'בינונית', color: 'rgba(26,54,93,0.62)', bg: 'rgba(26,54,93,0.06)', textColor: '#2a4a70' },
    low:    { label: 'נמוכה',  color: 'rgba(26,54,93,0.36)', bg: 'rgba(26,54,93,0.04)', textColor: '#4a6580' },
  },
};

// ============================================================
//  עטיפה למרחב App.raw.tokyo — הנתונים הגולמיים לנרמול
// ============================================================
window.App = window.App || {};
App.raw = App.raw || {};
App.raw.tokyo = {
  EXPERIENCE_TYPES,
  DISTRICTS,
  DAY_PLANS,
  JAPAN_LOCATIONS,
  HOTELS,
  TOKYO_CENTER,
  DISTRICT_COORDS,
  CONFIG,
};
