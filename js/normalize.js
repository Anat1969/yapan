// ============================================================
//  normalize.js — בניית BASE מהמקורות הגולמיים
//  ממפה את מסלול ההוקאידו החדש + נתוני טוקיו הישנים
//  אל מבנה הפריט האחיד (17 שדות + people + meta) ואובייקטי יום.
//
//  פלט: App.normalize.build() → { meta, days{}, dayOrder[], items{} }
// ============================================================
window.App = window.App || {};
App.normalize = (function () {

  const PEOPLE = ['ענת', 'עילאי', 'נתן', 'לוטם'];

  // ----- עזרי id -----
  function slug(s) {
    return String(s || '').trim().toLowerCase()
      .replace(/[^a-z0-9֐-׿]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // ----- גזירת people מטקסט forWho -----
  function derivePeople(text) {
    const t = String(text || '');
    if (!t.trim()) return ['כולם'];
    const found = PEOPLE.filter(p => t.indexOf(p) !== -1);
    if (t.indexOf('כולם') !== -1) return ['כולם'];
    return found.length ? found : ['כולם'];
  }

  // פיזור קל סביב מרכז (למיקומים משוערים, כדי שלא יחפפו)
  function jitter(center, i) {
    const r = 0.012; // ~1.3 ק"מ
    const ang = (i * 47) % 360 * Math.PI / 180;
    return { lat: center.lat + r * Math.sin(ang), lng: center.lng + r * Math.cos(ang) };
  }

  // ----- חיפוש קואורדינטות -----
  function lookupCoords(id, address, fallback) {
    if (fallback && fallback.lat) return { lat: fallback.lat, lng: fallback.lng };
    if (App.coords && App.coords[id]) return App.coords[id];
    if (address && App.coords && App.coords[slug(address)]) return App.coords[slug(address)];
    return null;
  }

  // ----- פריט ריק עם 17 השדות -----
  function makeItem(over) {
    return Object.assign({
      id: '', nameHe: '', nameEn: '', type: 'note',
      city: '', district: '', date: '', dayId: '',
      recommendedTime: '', duration: '', priority: 'medium',
      coordinates: null, shortDescription: '', reasonToVisit: '',
      externalLink: '', status: 'proposed', userNotes: '',
      people: ['כולם'], meta: {},
    }, over || {});
  }

  // ============================================================
  //  הוקאידו — 9 ימים, ברכב שכור
  // ============================================================
  function buildHokkaido(out) {
    const raw = App.raw && App.raw.hokkaido;
    if (!raw) return;

    // עוגני קואורדינטות לפי סדר הופעה בכל יום (התאמה ידנית לעוגנים הידועים)
    // מפתח: "day-timelineIndex" → coords id
    const coordMap = {
      '1-0': 'hok-mmb', '1-3': 'hok-furepe',
      '2-0': 'hok-five-lakes', '2-3': 'hok-kamuiwakka',
      '3-0': 'hok-shiretoko-pass', '3-1': 'hok-rausu', '3-3': 'hok-mashu', '3-4': 'hok-kawayu',
      '4-0': 'hok-kussharo-sunayu', '4-3': 'hok-akan-kotan', '4-4': 'hok-akan-lake',
      '5-0': 'hok-meakan', '5-1': 'hok-onneto',
      '6-2': 'hok-kurodake', '6-3': 'hok-ginga-falls',
      '7-1': 'hok-blue-pond', '7-2': 'hok-biei', '7-3': 'hok-farm-tomita',
      '8-2': 'hok-lake-hill-farm', '8-3': 'hok-usu-ropeway', '8-4': 'hok-toya',
      '9-0': 'hok-toya', '9-1': 'hok-cts', '9-2': 'hok-cts',
    };

    (raw.days || []).forEach((d, di) => {
      const dayId = 'hok-d' + d.day;
      const itemOrder = [];

      // אובייקט מלון (לינה) → פריט מסוג hotel
      let sleepRef = '';
      if (d.sleep && d.sleep.hotel && d.sleep.hotel !== '—' && d.sleep.place !== '—') {
        const hid = dayId + '-sleep';
        sleepRef = hid;
        const lodge = (raw.lodging || []).find(l => d.sleep.place && d.sleep.place.indexOf(l.place.split(' ')[0]) !== -1);
        const hotelName = d.sleep.hotel || d.sleep.place;
        // מיקום מלון: מיקום מדויק של המלון → עוגן ידוע → מרכז יום (fallback אחרון)
        let hcoord = (App.hotelCoords && App.hotelCoords[dayId])
          || lookupCoords(coordMap[d.day + '-9'] || '', d.sleep.address);
        if (!hcoord && App.dayCenter && App.dayCenter[dayId]) hcoord = App.dayCenter[dayId];
        // אזור: שם הלינה (החלק העברי לפני המקף)
        const area = (d.sleep.place || '').split('—')[0].trim();
        out.items[hid] = makeItem({
          id: hid, nameHe: d.sleep.place, nameEn: d.sleep.hotel,
          type: 'hotel', city: 'הוקאידו', district: area, dayId, status: 'selected',
          shortDescription: lodge ? (lodge.type + (lodge.rec ? ' · ' + lodge.rec : '')) : '',
          coordinates: hcoord,
          externalLink: bookingUrl(hotelName),
          meta: {
            address: d.sleep.address || '', sourceType: 'sleep',
            bookingUrl: bookingUrl(hotelName),
            mapsUrl: mapsUrl(hotelName, d.sleep.address),
            recommended: lodge ? lodge.rec : '',
          },
          people: ['כולם'],
        });
      }

      // פריטי timeline
      (d.timeline || []).forEach((t, ti) => {
        const id = dayId + '-t' + ti;
        const key = d.day + '-' + ti;
        // 1. קואורדינטה מדויקת לתחנה  2. עוגן ידוע  3. מרכז יום משוער
        let coord = (App.dayCoords && App.dayCoords[key]) || lookupCoords(coordMap[key], t.address);
        let approx = false;
        if (!coord) {
          const c = App.dayCenter && App.dayCenter[dayId];
          if (c) { coord = jitter(c, ti); approx = true; }
        }
        out.items[id] = makeItem({
          id,
          nameHe: t.name, nameEn: t.nameEn || '',
          type: normalizeType(t.type),
          city: 'הוקאידו', dayId,
          recommendedTime: t.time || '', duration: t.duration || '',
          priority: derivePriorityFromForWho(t.forWho),
          coordinates: coord,
          shortDescription: t.desc || '',
          status: 'alternative', // כל היעדים כחלופה עד אישור המשפחה
          people: derivePeople(t.forWho),
          meta: {
            forWhoRaw: t.forWho || '', address: t.address || '',
            sourceType: 'timeline', rawType: t.type, approxLocation: approx,
            seq: ti,
          },
        });
        itemOrder.push(id);
      });

      // פריטי sports (חוויות הרשמה מראש) — פעילויות נלוות, לא תחנות במסלול.
      // מקבלים מיקום משוער כדי להופיע על המפה, אך לא נכנסים ל-itemOrder.
      const dc = App.dayCenter && App.dayCenter[dayId];
      (d.sports || []).forEach((s, si) => {
        const id = dayId + '-sport' + si;
        out.items[id] = makeItem({
          id, nameHe: s.name, nameEn: s.nameEn || '',
          type: 'sport', city: 'הוקאידו', dayId,
          priority: 'low', status: 'proposed',
          shortDescription: s.desc || '',
          externalLink: extractUrl(s.book),
          coordinates: dc ? jitter(dc, 20 + si) : null,
          people: derivePeople(s.forWho),
          meta: { forWhoRaw: s.forWho || '', book: s.book || '', sourceType: 'sport',
            approxLocation: !!dc },
        });
        // לא נדחף ל-itemOrder — מופיע במקומות/מפה כאופציה, לא כתחנת לוח זמנים
      });

      out.days[dayId] = {
        id: dayId, index: d.day, city: 'הוקאידו', cityEn: 'Hokkaido',
        date: '', title: d.title, subtitle: d.subtitle || '',
        story: d.story || '', area: d.area || '',
        drive: d.drive || null, wakeUp: d.wakeUp || '',
        sleepRef, notes: '', tips: d.tips || [],
        itemOrder,
        meta: { food: d.food || null, shopping: d.shopping || null },
      };
      out.dayOrder.push(dayId);
    });

    out.meta.hokkaido = {
      title: raw.title, subtitle: raw.subtitle, season: raw.season,
      entry: raw.entry, exit: raw.exit, transport: raw.transport,
      carRental: raw.carRental, lodging: raw.lodging || [],
    };
  }

  // נגזרת עדיפות מ-forWho: "חובה" → high, "אופציונלי"/"אם" → low, אחרת medium
  function derivePriorityFromForWho(forWho) {
    const t = String(forWho || '');
    if (/חובה/.test(t)) return 'high';
    if (/אופציונל|אם רוצ|אם יש|אם אוהב|אם מעוניין|מי שרוצה|מי שצריך/.test(t)) return 'low';
    return 'medium';
  }

  function normalizeType(t) {
    const valid = ['drive','station','transit','logistics','hotel','restaurant','food',
      'attraction','district','view','hike','swim','water','onsen','culture','walk',
      'sport','shopping','rest','nature','note',
      'architecture','temple','market','workshop'];
    return valid.indexOf(t) !== -1 ? t : 'attraction';
  }

  function extractUrl(s) {
    const m = String(s || '').match(/([a-z0-9.-]+\.[a-z]{2,}(?:\/\S*)?)/i);
    return m ? ('https://' + m[1].replace(/^https?:\/\//, '')) : '';
  }

  // קישור חיפוש Booking לפי שם מלון + פילטרים (תאריכים, 2 מבוגרים + 2 בני נוער, דירוג 9, ביטול חינם, תקציב בינוני)
  // checkinISO/checkoutISO בפורמט YYYY-MM-DD (אופציונלי)
  function bookingUrl(name, opts) {
    if (!name) return '';
    opts = opts || {};
    const p = new URLSearchParams();
    p.set('ss', name + ' Japan');
    if (opts.checkin) p.set('checkin', opts.checkin);
    if (opts.checkout) p.set('checkout', opts.checkout);
    p.set('group_adults', '2');           // 2 מבוגרים
    p.set('group_children', '2');         // 2 בני נוער
    p.set('age', '18'); p.append('age', '15');
    p.set('no_rooms', '1');
    // פילטרים: דירוג 9+ (review_score=90), ביטול חינם (fc=2), תקציב בינוני (pri=2,3)
    p.set('nflt', 'review_score%3D90%3Bfc%3D2%3Bpri%3D2%3Bpri%3D3');
    return 'https://www.booking.com/searchresults.html?' + p.toString();
  }
  // קישור Google Maps לפי שם + כתובת
  function mapsUrl(name, address) {
    const q = [name, address].filter(Boolean).join(', ');
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q + ' Japan');
  }

  // ============================================================
  //  טוקיו — 7 ימים (8-14 מהמסלול הישן) + רובעים + מלונות
  // ============================================================
  function buildTokyo(out) {
    const tk = App.raw && App.raw.tokyo;
    if (!tk) return;

    const coords = tk.DISTRICT_COORDS || {};
    const expColor = tk.EXPERIENCE_TYPES || {};
    out.meta.experienceTypes = expColor;
    out.meta.tokyoCenter = tk.TOKYO_CENTER || { lat: 35.6762, lng: 139.6503 };

    // רובעים → district items (מאגר מקומות, לא משויכים ליום ספציפי כברירת מחדל)
    (tk.DISTRICTS || []).forEach(d => {
      const id = 'tok-dist-' + d.id;
      out.items[id] = makeItem({
        id, nameHe: d.name, nameEn: d.romaji,
        type: 'district', city: 'טוקיו', district: d.name,
        recommendedTime: d.timeNeeded || '', priority: d.priority || 'medium',
        coordinates: coords[d.id] || null,
        shortDescription: d.unique || '',
        status: 'proposed',
        people: ['כולם'],
        meta: {
          bestTime: d.bestTime || '', experiences: d.experiences || [],
          streets: d.streets || [], activities: d.activities || [],
          sourceType: 'district', distId: d.id,
        },
      });
    });

    // ימי טוקיו 8-14 → ימים 10-16 (אחרי 9 ימי הוקאידו)
    const tokyoDays = (tk.DAY_PLANS || []).filter(p => p.cityEn !== 'Hokkaido');
    tokyoDays.forEach((p, pi) => {
      const dayId = 'tok-d' + p.day;
      const itemOrder = [];

      (p.schedule || []).forEach((s, si) => {
        const id = dayId + '-s' + si;
        out.items[id] = makeItem({
          id, nameHe: s.label, nameEn: '',
          type: mapTokyoScheduleType(s.type),
          city: 'טוקיו', dayId,
          recommendedTime: s.time || '', duration: s.duration || '',
          priority: 'medium',
          coordinates: (s.lat && s.lng) ? { lat: s.lat, lng: s.lng } : null,
          shortDescription: s.note || '',
          // יעדים (place/choice) כחלופה עד אישור; מעבר/לוגיסטיקה נשארים
          status: (s.type === 'transit' || s.type === 'walk' || s.type === 'start' || s.type === 'end') ? 'selected' : 'alternative',
          people: ['כולם'],
          meta: {
            transport: s.transport || '', station: s.station || '',
            dist: s.dist || '', sourceType: 'schedule', rawType: s.type,
          },
        });
        itemOrder.push(id);
      });

      out.days[dayId] = {
        id: dayId, index: 9 + (pi + 1), city: 'טוקיו', cityEn: 'Tokyo',
        date: '', title: p.title, subtitle: p.subtitle || '',
        story: '', area: p.subtitle || '',
        drive: null, wakeUp: '', sleepRef: '',
        notes: p.notes || '', tips: [],
        itemOrder,
        meta: { walkingRoute: p.walkingRoute || '', districtIds: p.districtIds || [] },
      };
      out.dayOrder.push(dayId);
    });

    // מלונות טוקיו (afterDay >= 7)
    (tk.HOTELS || []).filter(h => h.cityEn !== 'Hokkaido').forEach((h, hi) => {
      const id = 'tok-hotel-' + hi;
      const dayId = 'tok-d' + (h.afterDay + 1);
      out.items[id] = makeItem({
        id, nameHe: h.nameHe, nameEn: h.name,
        type: 'hotel', city: 'טוקיו', district: h.area || '',
        dayId: out.days[dayId] ? dayId : '',
        priority: 'medium', status: 'selected',
        coordinates: (h.lat && h.lng) ? { lat: h.lat, lng: h.lng } : null,
        shortDescription: (h.type || '') + (h.note ? ' · ' + h.note : ''),
        externalLink: h.url || '',
        people: ['כולם'],
        meta: { area: h.area || '', nearestStation: h.nearestStation || '', sourceType: 'hotel',
          bookingUrl: h.url || bookingUrl(h.name), mapsUrl: mapsUrl(h.name, h.area + ' Tokyo') },
      });
      if (out.days[dayId] && !out.days[dayId].sleepRef) out.days[dayId].sleepRef = id;
    });

    // JAPAN_LOCATIONS → מאגר רעיונות עתידיים
    (tk.JAPAN_LOCATIONS || []).forEach(loc => {
      const id = 'idea-' + loc.id;
      out.items[id] = makeItem({
        id, nameHe: loc.name, nameEn: loc.romaji,
        type: 'attraction', city: loc.region || 'יפן',
        recommendedTime: loc.timeNeeded || '', priority: 'low',
        coordinates: (loc.lat && loc.lng) ? { lat: loc.lat, lng: loc.lng } : null,
        shortDescription: loc.unique || '',
        status: 'proposed', dayId: '',
        people: ['כולם'],
        meta: { bestTime: loc.bestTime || '', experiences: loc.experiences || [],
          highlights: loc.highlights || [], region: loc.region || '', sourceType: 'idea' },
      });
    });
  }

  function mapTokyoScheduleType(t) {
    if (t === 'start' || t === 'end') return 'logistics';
    if (t === 'transit' || t === 'walk') return 'transit';
    if (t === 'place' || t === 'choice') return 'attraction';
    return 'attraction';
  }

  // ============================================================
  //  קנסאי — 9 ימים (אוסקה/קיוטו/קאנאזאווה), מ-App.raw.kansai
  //  כל תחנה עם lat/lng + cost. שדות עשירים: whyThisPlace,
  //  familyBalance, layers, localGem, skip, transportTip.
  // ============================================================
  function buildKansai(out) {
    const raw = App.raw && App.raw.kansai;
    if (!raw) { return; }

    (raw.days || []).forEach(d => {
      const dayId = 'kan-d' + d.day;
      const itemOrder = [];

      // לינה → פריט hotel
      let sleepRef = '';
      if (d.sleep && d.sleep.hotel) {
        const hid = dayId + '-sleep';
        sleepRef = hid;
        const area = (d.sleep.place || '').split('—')[0].trim();
        out.items[hid] = makeItem({
          id: hid, nameHe: d.sleep.place, nameEn: d.sleep.placeEn || d.sleep.hotel,
          type: 'hotel', city: 'קנסאי', district: area, dayId, status: 'selected',
          shortDescription: d.sleep.hotel,
          coordinates: (d.sleep.lat && d.sleep.lng) ? { lat: d.sleep.lat, lng: d.sleep.lng } : null,
          externalLink: d.sleep.bookingUrl || bookingUrl(d.sleep.hotel),
          people: ['כולם'],
          meta: {
            address: d.sleep.address || '', sourceType: 'sleep',
            bookingUrl: d.sleep.bookingUrl || bookingUrl(d.sleep.hotel),
            mapsUrl: mapsUrl(d.sleep.hotel, d.sleep.address),
            cost: Number(d.sleep.cost) || 0, qty: 1,
            checkIn: d.sleep.checkIn || '', checkOut: d.sleep.checkOut || '',
            luggageNote: d.sleep.luggageNote || '',
          },
        });
      }

      // תחנות timeline
      (d.timeline || []).forEach((t, ti) => {
        const id = dayId + '-t' + ti;
        out.items[id] = makeItem({
          id, nameHe: t.name, nameEn: t.nameEn || '',
          type: normalizeType(t.type), city: 'קנסאי', dayId,
          recommendedTime: t.time || '', duration: t.duration || '',
          priority: derivePriorityFromForWho(t.forWho),
          coordinates: (t.lat && t.lng) ? { lat: t.lat, lng: t.lng } : null,
          shortDescription: t.desc || '',
          reasonToVisit: t.whyThisPlace || '',
          status: 'alternative', // כל היעדים כחלופה עד אישור המשפחה
          people: derivePeople(t.forWho),
          meta: {
            forWhoRaw: t.forWho || '', address: t.address || '',
            sourceType: 'timeline', rawType: t.type, seq: ti,
            whyThisPlace: t.whyThisPlace || '',
            cost: Number(t.cost) || 0, qty: 1,
          },
        });
        itemOrder.push(id);
      });

      // localGem → פריט פנינה נסתרת (אופציונלי)
      if (d.localGem && d.localGem.name) {
        const gid = dayId + '-gem';
        out.items[gid] = makeItem({
          id: gid, nameHe: d.localGem.name, nameEn: d.localGem.nameEn || '',
          type: 'nature', city: 'קנסאי', dayId, status: 'proposed',
          priority: 'low',
          shortDescription: d.localGem.desc || '',
          reasonToVisit: d.localGem.why || '',
          people: ['כולם'],
          meta: { sourceType: 'localGem', isGem: true, why: d.localGem.why || '' },
        });
      }

      // sports → פריטי ספורט (לא ב-itemOrder)
      (d.sports || []).forEach((s, si) => {
        const id = dayId + '-sport' + si;
        out.items[id] = makeItem({
          id, nameHe: s.name, nameEn: s.nameEn || '',
          type: 'sport', city: 'קנסאי', dayId, priority: 'low', status: 'proposed',
          shortDescription: s.desc || '', externalLink: extractUrl(s.book),
          people: derivePeople(s.forWho),
          meta: { forWhoRaw: s.forWho || '', book: s.book || '', sourceType: 'sport',
            cost: Number(s.cost) || 0, qty: 1 },
        });
      });

      out.days[dayId] = {
        id: dayId, index: d.day, city: 'קנסאי', cityEn: 'Kansai',
        date: '', title: d.title, subtitle: d.subtitle || '',
        story: d.story || '', area: d.area || '',
        drive: (d.drive && d.drive.km) ? d.drive : null, wakeUp: d.wakeUp || '',
        sleepRef, notes: '', tips: d.tips || [],
        itemOrder,
        meta: {
          food: d.food || null, shopping: d.shopping || null,
          familyBalance: d.familyBalance || null, layers: d.layers || null,
          experiencePhase: d.experiencePhase || '', isRestDay: !!d.isRestDay,
          localGem: d.localGem || null, skip: d.skip || '', transportTip: d.transportTip || '',
        },
      };
      out.dayOrder.push(dayId);
    });

    out.meta.kansai = {
      title: raw.title, subtitle: raw.subtitle, season: raw.season,
      entry: raw.entry, exit: raw.exit, transport: raw.transport, lodging: raw.lodging || [],
    };
  }

  // ============================================================
  //  ימי טיסה בינלאומית — הלוך (ישראל→KIX) וחזור (טוקיו→ישראל)
  // ============================================================
  function buildFlightOut(out) {
    const dayId = 'fly-out';
    const tid = dayId + '-t0';
    out.items[tid] = makeItem({
      id: tid, nameHe: 'טיסה: ישראל → אוסקה (KIX)', nameEn: 'Flight TLV → KIX',
      type: 'logistics', city: 'טיסה', dayId, status: 'selected',
      recommendedTime: '', shortDescription: 'טיסה בינלאומית מתל אביב לנמל התעופה קנסאי. כ-13–15 שעות (עם/בלי קונקשן).',
      people: ['כולם'], meta: { sourceType: 'flight' },
    });
    out.days[dayId] = {
      id: dayId, index: 0, city: 'טיסה', cityEn: 'Flight',
      date: '', title: 'יום טיסה — ישראל ליפן', subtitle: 'תל אביב → אוסקה',
      story: 'יציאה לדרך. טיסה ארוכה מזרחה — מומלץ לישון בטיסה כדי להגיע מסונכרנים לשעון יפן.',
      area: 'TLV → KIX', drive: null, wakeUp: '', sleepRef: '',
      notes: '', tips: ['לשתות הרבה מים', 'להזיז את השעון לזמן יפן מיד בעלייה למטוס'],
      itemOrder: [tid], meta: { isFlight: true },
    };
    out.dayOrder.push(dayId);
  }
  function buildFlightBack(out) {
    const dayId = 'fly-back';
    const tid = dayId + '-t0';
    out.items[tid] = makeItem({
      id: tid, nameHe: 'טיסה: טוקיו → ישראל', nameEn: 'Flight HND/NRT → TLV',
      type: 'logistics', city: 'טיסה', dayId, status: 'selected',
      shortDescription: 'טיסת חזרה מטוקיו לתל אביב.',
      people: ['כולם'], meta: { sourceType: 'flight' },
    });
    out.days[dayId] = {
      id: dayId, index: 0, city: 'טיסה', cityEn: 'Flight',
      date: '', title: 'יום טיסה — חזרה לישראל', subtitle: 'טוקיו → תל אביב',
      story: 'סוף הטיול. טיסה חזרה הביתה עם המזוודות מלאות וזיכרונות.',
      area: 'HND/NRT → TLV', drive: null, wakeUp: '', sleepRef: '',
      notes: '', tips: ['להגיע לשדה 3 שעות לפני', 'לשמור מקום במזוודה לקניות אחרונות'],
      itemOrder: [tid], meta: { isFlight: true },
    };
    out.dayOrder.push(dayId);
  }

  // ============================================================
  //  עלויות — רשומות ריקות למילוי עצמי (₪0 בהתחלה)
  //  מלונות נגזרים אוטומטית מפריטי ה-hotel הקיימים (ב-renderCosts).
  // ============================================================
  const FAMILY = ['נתן', 'ענת', 'עילאי', 'לוטם'];
  function buildCosts(out) {
    const mk = (id, nameHe, costCat, over) => {
      out.items[id] = makeItem(Object.assign({
        id, nameHe, type: 'cost', city: '', status: 'proposed',
        people: ['כולם'],
        meta: { cost: 0, qty: 1, costCat, costSource: 'manual' },
      }, over || {}));
    };

    // טיסות — כרטיס לכל בן משפחה
    FAMILY.forEach((p, i) => {
      mk('cost-flight-' + i, 'טיסה — ' + p, 'flights', {
        people: [p], meta: { cost: 0, qty: 1, costCat: 'flights', costSource: 'manual' },
      });
    });
    // רכב שכור
    mk('cost-car-1', 'רכב שכור — מיניוואן (9 ימים)', 'car', {
      meta: { cost: 0, qty: 1, costCat: 'car', costSource: 'manual',
        note: 'Toyota Noah · איסוף MMB · החזרה CTS' },
    });
    // רכבות
    mk('cost-train-1', 'רכבות (Shinkansen / JR)', 'trains');
    // תחבורה ציבורית
    mk('cost-transit-1', 'תחבורה ציבורית (מטרו/אוטובוס)', 'transport');
    // אחר
    mk('cost-other-1', 'שונות (כניסות, אטרקציות)', 'other');
  }

  // ============================================================
  //  חישוב תאריכים — מ-22/7/2025, רציף לכל הימים
  // ============================================================
  const TRIP_START = new Date(2026, 6, 23); // 23 ביולי 2026 — יום הטיסה מישראל
  const DOW_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  function assignDates(out) {
    out.dayOrder.forEach((id, i) => {
      const dt = new Date(TRIP_START);
      dt.setDate(dt.getDate() + i);
      const d = out.days[id];
      d.index = i + 1;
      d.date = dt.getDate() + '/' + (dt.getMonth() + 1);
      d.dateFull = dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
      d.dow = DOW_HE[dt.getDay()];
      // העתק לפריטים השייכים ליום
      (d.itemOrder || []).forEach(iid => { if (out.items[iid]) out.items[iid].date = d.date; });

      // עדכון קישור Booking למלון עם תאריכים אמיתיים (צ'ק-אין=היום, צ'ק-אאוט=מחר)
      if (d.sleepRef && out.items[d.sleepRef]) {
        const hotel = out.items[d.sleepRef];
        hotel.date = d.date;
        const next = new Date(dt); next.setDate(next.getDate() + 1);
        const checkin = d.dateFull;
        const checkout = next.getFullYear() + '-' + pad(next.getMonth() + 1) + '-' + pad(next.getDate());
        const hotelName = hotel.nameEn || hotel.shortDescription || hotel.nameHe;
        // קישור ספציפי למלון (עם שמו) + קישור חיפוש מגוון בעיר
        const specificUrl = bookingUrl(hotelName, { checkin, checkout });
        const areaName = hotel.district || hotel.city || '';
        const areaUrl = bookingUrl(areaName, { checkin, checkout });
        hotel.externalLink = specificUrl;
        hotel.meta = hotel.meta || {};
        hotel.meta.bookingUrl = specificUrl;       // המלון הספציפי
        hotel.meta.bookingAreaUrl = areaUrl;       // חיפוש מגוון בעיר/אזור
        hotel.meta.checkinDate = checkin;
        hotel.meta.checkoutDate = checkout;
      }
    });
    out.meta.tripStart = '2026-07-23';
    out.meta.tripDays = out.dayOrder.length;
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // ============================================================
  //  BUILD
  // ============================================================
  function build() {
    const out = { meta: {}, days: {}, dayOrder: [], items: {} };
    buildFlightOut(out);  // יום 1 — טיסה ישראל→KIX
    buildKansai(out);     // ימים 2-10 — קנסאי (9)
    buildHokkaido(out);   // ימים 11-19 — הוקאידו (9)
    buildTokyo(out);      // ימים 20-26 — טוקיו (7)
    buildFlightBack(out); // יום 27 — טיסה טוקיו→ישראל
    buildCosts(out);      // רשומות עלות
    assignDates(out);
    return out;
  }

  return { build, PEOPLE, FAMILY, derivePeople, makeItem };
})();
