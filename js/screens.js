// ============================================================
//  screens.js — 4 מסכי עבודה. כל מסך נגזר מה-store בכל רינדור.
//  תכנון / זמנים / מקומות / סיכום
// ============================================================
window.App = window.App || {};
App.screens = (function () {

  const C = () => App.components;
  const S = () => App.store;

  let panelEl = null;
  let selectedItemId = null;

  function setPanel(el) { panelEl = el; }

  // ----- הפעולה המרכזית: רינדור המסך הפעיל -----
  function renderActive() {
    const st = S().get();
    const screen = st.ui.activeScreen;
    if (screen === 'planning') renderPlanning(st);
    else if (screen === 'times') renderTimes(st);
    else if (screen === 'places') renderPlaces(st);
    else if (screen === 'lodging') renderLodging(st);
    else if (screen === 'costs') renderCosts(st);
    else if (screen === 'summary') renderSummary(st);
    bindPanel();
    syncMapForScreen(st);
  }

  // סינון הסט הפעיל לפי הפילטרים
  function filteredItems(st) {
    return App.filters.apply(S().allItems(), st.ui.filters);
  }

  // ----- מסגרת הסבר לסינון: מה מכסה הבחירה הנוכחית -----
  function filterSummaryBox(st, count, total) {
    const f = st.ui.filters;
    const active = [];
    if (f.city) active.push({ label: 'עיר', val: f.city });
    if (f.people) active.push({ label: 'מי', val: f.people });
    if (f.type) active.push({ label: 'סוג', val: C().TYPE_LABEL[f.type] || f.type });
    if (f.priority) active.push({ label: 'עדיפות', val: C().PRIORITY_LABEL[f.priority] });
    if (f.status) active.push({ label: 'סטטוס', val: C().STATUS_LABEL[f.status] });

    if (!active.length) {
      return '<div class="filter-summary"><span class="fs-icon">▦</span> מוצגים <strong>' + total + '</strong> כל הפריטים · ללא סינון</div>';
    }
    const parts = active.map(a => '<span class="fs-chip">' + a.label + ': <strong>' + C().esc(a.val) + '</strong></span>');
    const conn = active.length > 1 ? ' <span class="fs-and">וגם</span> ' : '';
    return '<div class="filter-summary active">' +
      '<span class="fs-icon">⛯</span> הבחירה מציגה <strong>' + count + '</strong> מתוך ' + total + ' פריטים: ' +
      parts.join(conn) +
      ' <button class="fs-clear" id="btnClearFilters">✕ נקה</button></div>';
  }

  // ----- כותרת מסך עם איקון קווי מונפש -----
  function screenHeader(screen, title, extra) {
    let icon = '';
    if (screen === 'times') icon = clockSvg();
    else if (screen === 'places') icon = globeSvg();
    else if (screen === 'planning') icon = calSvg();
    else if (screen === 'lodging') icon = bedSvg();
    else if (screen === 'costs') icon = coinSvg();
    else if (screen === 'summary') icon = listSvg();
    return '<h2 class="screen-h">' + icon + '<span>' + title + '</span>' + (extra || '') + '</h2>';
  }

  // שעון קווי מונפש (מחוגים מסתובבים)
  function clockSvg() {
    return '<svg class="hicon clock" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<circle cx="12" cy="12" r="9"/>' +
      '<line class="hand-h" x1="12" y1="12" x2="12" y2="7.5" stroke-linecap="round"/>' +
      '<line class="hand-m" x1="12" y1="12" x2="16" y2="12" stroke-linecap="round"/>' +
      '</svg>';
  }
  // כדור ארץ קווי מסתובב
  function globeSvg() {
    return '<svg class="hicon globe" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<circle cx="12" cy="12" r="9"/>' +
      '<ellipse class="g-spin" cx="12" cy="12" rx="4" ry="9"/>' +
      '<line x1="3" y1="12" x2="21" y2="12"/>' +
      '</svg>';
  }
  function calSvg() {
    return '<svg class="hicon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>' +
      '<line x1="8" y1="3" x2="8" y2="6"/><line x1="16" y1="3" x2="16" y2="6"/></svg>';
  }
  function listSvg() {
    return '<svg class="hicon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<line x1="8" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="18" x2="20" y2="18"/>' +
      '<circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>';
  }
  // מטבע קווי מסתובב
  function coinSvg() {
    return '<svg class="hicon coin" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<ellipse class="c-spin" cx="12" cy="12" rx="9" ry="9"/>' +
      '<text x="12" y="16" font-size="9" stroke="none" fill="currentColor" text-anchor="middle">¥</text></svg>';
  }
  // מיטה קווית — נורת ה"זזז" המונפשת מעל
  function bedSvg() {
    return '<svg class="hicon bed" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<path d="M3 18v-6h18v6"/><line x1="3" y1="18" x2="3" y2="21"/><line x1="21" y1="18" x2="21" y2="21"/>' +
      '<path d="M3 12V8h7v4"/><circle cx="6.5" cy="10" r="1"/>' +
      '<text class="zzz" x="14" y="8" font-size="6" stroke="none" fill="currentColor">z</text></svg>';
  }

  // ============================================================
  //  מסך תכנון — רשימת ימים
  // ============================================================
  function renderPlanning(st) {
    let html = screenHeader('planning', 'תכנון המסלול');
    html += '<div class="muted" style="font-size:0.72rem;margin-bottom:10px">' +
      st.dayOrder.length + ' ימים · ' + cityBreakdown(st) + '</div>';

    // לוח שנה — חודשים נגזרים מהתאריכים בפועל (דינמי)
    const dayByDate = {};
    const monthsSet = {};
    st.dayOrder.forEach(id => {
      const d = st.days[id];
      if (d.dateFull) {
        dayByDate[d.dateFull] = d;
        const parts = d.dateFull.split('-'); // YYYY-MM-DD
        monthsSet[parts[0] + '-' + parts[1]] = { year: +parts[0], month: +parts[1] - 1 };
      }
    });
    const months = Object.keys(monthsSet).sort().map(k => monthsSet[k]);
    html += '<div class="cal-wrap">' +
      months.map(m => C().calendar(m.year, m.month, dayByDate, st.ui.activeDayId)).join('') +
    '</div>';
    html += '<div class="cal-key">' +
      '<span class="cal-key-item"><span class="cal-swatch cal-flight"></span>טיסה</span>' +
      '<span class="cal-key-item"><span class="cal-swatch cal-osaka"></span>קנסאי</span>' +
      '<span class="cal-key-item"><span class="cal-swatch cal-hokkaido"></span>הוקאידו</span>' +
      '<span class="cal-key-item"><span class="cal-swatch cal-tokyo"></span>טוקיו</span>' +
    '</div>';

    st.dayOrder.forEach(dayId => {
      const d = st.days[dayId];
      const sleep = d.sleepRef ? st.items[d.sleepRef] : null;
      html += C().dayCard(d, { sleepName: sleep ? sleep.nameHe : '' });
    });
    panelEl.innerHTML = html;
  }

  function cityBreakdown(st) {
    const m = {};
    st.dayOrder.forEach(id => { const c = st.days[id].city; m[c] = (m[c] || 0) + 1; });
    return Object.keys(m).map(c => m[c] + ' ' + c).join(' · ');
  }

  // ============================================================
  //  מסך זמנים — יום נבחר כרצף תחנות
  // ============================================================
  function renderTimes(st) {
    const dayId = st.ui.activeDayId || st.dayOrder[0];
    const d = st.days[dayId];
    if (!d) { panelEl.innerHTML = '<div class="empty-note">אין יום נבחר</div>'; return; }

    const idx = st.dayOrder.indexOf(dayId);
    const prevId = idx > 0 ? st.dayOrder[idx - 1] : null;
    const nextId = idx < st.dayOrder.length - 1 ? st.dayOrder[idx + 1] : null;

    const cityIcon = d.cityEn === 'Hokkaido' ? '🏔' : d.cityEn === 'Osaka' ? '🏯' : '🗼';

    // ניווט בין ימים
    let html = screenHeader('times', 'זמנים — לוח יומי');
    html += '<div class="day-nav">' +
      '<button class="hdr-btn dark" data-goday="' + (prevId || '') + '" ' + (prevId ? '' : 'disabled') + '>← קודם</button>' +
      '<div class="day-nav-mid muted" style="font-size:0.66rem">' + C().esc(d.title) + '</div>' +
      '<button class="hdr-btn dark" data-goday="' + (nextId || '') + '" ' + (nextId ? '' : 'disabled') + '>הבא →</button>' +
    '</div>';

    // כותרת יום גדולה — מספר יום + תאריך + עיר
    html += '<div class="day-hero">' +
      '<div class="day-hero-num">' + d.index + '</div>' +
      '<div class="day-hero-info">' +
        '<div class="day-hero-city">' + cityIcon + ' ' + C().esc(d.city) + '</div>' +
        '<div class="day-hero-date">' + C().esc(d.dow || '') + ' · ' + C().esc(d.date || '') + (d.dateFull ? '/' + d.dateFull.split('-')[0] : '') + '</div>' +
        '<div class="day-hero-title">' + C().esc(d.title) + '</div>' +
      '</div>' +
      (d.drive ? '<div class="day-hero-drive">🚗 ' + C().esc(d.drive.time) + '<br><span>' + C().esc(d.drive.km) + ' ק"מ</span></div>' : '') +
    '</div>';

    // בורר ימים
    html += '<div class="day-strip">';
    st.dayOrder.forEach(id => {
      const dd = st.days[id];
      const ic = dd.cityEn === 'Hokkaido' ? '🏔' : dd.cityEn === 'Osaka' ? '🏯' : '🗼';
      html += '<button class="day-pip' + (id === dayId ? ' active' : '') + '" data-goday="' + id + '">' +
        ic + ' ' + dd.index + '<span class="day-pip-date">' + C().esc(dd.date) + '</span></button>';
    });
    html += '</div>';

    if (d.wakeUp && d.wakeUp !== '—') html += '<div class="banner wake">☀ השכמה: ' + C().esc(d.wakeUp) + '</div>';
    if (d.story) html += '<div class="day-card-story" style="margin-bottom:8px">' + C().esc(d.story) + '</div>';
    if (d.notes) html += '<div class="banner wake">💡 ' + C().esc(d.notes) + '</div>';

    // תחנות
    const items = S().itemsForDay(dayId);
    html += '<div class="card-row" style="margin:6px 0"><button class="opt-btn" id="btnAddStop">➕ הוסף תחנה</button>' +
      '<button class="opt-btn" id="btnZoomDay">🔍 זום למסלול</button></div>';
    if (!items.length) html += '<div class="empty-note">אין תחנות ביום זה</div>';
    items.forEach((i, n) => {
      const meta = i.meta || {};
      const distLine = (meta.dist || meta.transport)
        ? '<span class="drive-badge">' + C().esc([meta.transport, meta.dist].filter(Boolean).join(' · ')) + '</span>' : '';
      const stationLine = meta.station ? '<span class="muted" style="font-size:0.62rem">🚉 ' + C().esc(meta.station) + '</span>' : '';
      html += '<div class="tl-row" data-item="' + i.id + '">' +
        '<div class="tl-time">' + C().esc(i.recommendedTime || '') +
          (i.duration ? '<div class="tl-dur">⏱' + C().esc(i.duration) + '</div>' : '') +
          '<div class="tl-reorder">' +
            (n > 0 ? '<button class="reorder-btn" data-reorder="up" data-day="' + dayId + '" data-idx="' + n + '">↑</button>' : '') +
            (n < items.length - 1 ? '<button class="reorder-btn" data-reorder="down" data-day="' + dayId + '" data-idx="' + n + '">↓</button>' : '') +
          '</div>' +
        '</div>' +
        '<div class="tl-body">' +
          '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">' +
            '<span class="tl-num">' + (n + 1) + '</span>' +
            C().priorityDiamond(i.priority, { sm: true }) +
            '<span class="tl-name place-link" data-focus="' + i.id + '">' + C().esc(i.nameHe) + '</span>' +
          '</div>' +
          (i.shortDescription ? '<div class="card-desc" style="margin:3px 0">' + C().esc(i.shortDescription) + '</div>' : '') +
          '<div class="card-row">' + C().typeBadge(i.type) + C().peopleTags(i.people) + distLine + stationLine +
            (i.coordinates ? '<a class="gmaps-mini" href="' + gmapsItem(i) + '" target="_blank" onclick="event.stopPropagation()">📍 מפות</a>' : '') +
            '<button class="opt-btn detail-trigger" data-detail="' + i.id + '" style="margin-right:auto">✎</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    });

    // לינה עם קישורים
    const sleep = d.sleepRef ? st.items[d.sleepRef] : null;
    if (sleep) {
      const m = sleep.meta || {};
      html += '<div class="sleep-card">' +
        '<div class="sleep-head">🏨 <strong>' + C().esc(sleep.nameHe) + '</strong></div>' +
        (sleep.nameEn ? '<div class="muted" style="font-size:0.68rem;direction:ltr">' + C().esc(sleep.nameEn) + '</div>' : '') +
        (m.recommended ? '<div class="muted" style="font-size:0.68rem">' + C().esc(m.recommended) + '</div>' : '') +
        '<div class="card-row" style="margin-top:6px">' +
          (m.bookingUrl ? '<a class="hotel-link book" href="' + C().esc(m.bookingUrl) + '" target="_blank">🛏 הזמנה</a>' : '') +
          (m.mapsUrl ? '<a class="hotel-link maps" href="' + C().esc(m.mapsUrl) + '" target="_blank">📍 מפות</a>' : '') +
          '<button class="opt-btn detail-trigger" data-detail="' + sleep.id + '">✎ פרטים</button>' +
        '</div>' +
      '</div>';
    }

    // פעילויות אופציונליות (sports) של היום — לא תחנות, אך חשוב להציג
    const daySports = S().allItems().filter(i => i.type === 'sport' && i.dayId === dayId);
    if (daySports.length) {
      html += '<div class="opt-sports"><div class="os-title">🏃 פעילויות אופציונליות (הרשמה מראש)</div>';
      daySports.forEach(s => {
        html += '<div class="os-item" data-item="' + s.id + '">' +
          '<strong>' + C().esc(s.nameHe) + '</strong> ' + C().peopleTags(s.people) +
          (s.shortDescription ? '<div class="muted" style="font-size:0.7rem">' + C().esc(s.shortDescription) + '</div>' : '') +
          (s.meta && s.meta.book ? '<div style="font-size:0.66rem;color:#2980b9">📅 ' + C().esc(s.meta.book) + '</div>' : '') +
          '<button class="opt-btn detail-trigger" data-detail="' + s.id + '" style="font-size:0.62rem;padding:1px 7px">✎ פרטים</button>' +
        '</div>';
      });
      html += '</div>';
    }

    // מידע יומי: 3 ממדים, איזון משפחתי, פנינה, אוכל, קניות, טיפים
    const dm = d.meta || {};
    html += '<div class="info-cards">';

    // 3 הממדים (שכלי/רגשי/פיזי)
    if (dm.layers && (dm.layers.intellectual || dm.layers.emotional || dm.layers.physical)) {
      html += dailyInfoCard('🧭 שלושה ממדים', [
        dm.layers.intellectual ? '<strong>🧠 שכלי:</strong> ' + C().esc(dm.layers.intellectual) : '',
        dm.layers.emotional ? '<strong>💗 רגשי:</strong> ' + C().esc(dm.layers.emotional) : '',
        dm.layers.physical ? '<strong>🏃 פיזי:</strong> ' + C().esc(dm.layers.physical) : '',
      ]);
    }
    // איזון משפחתי
    if (dm.familyBalance) {
      const fb = dm.familyBalance;
      html += dailyInfoCard('👨‍👩‍👧‍👦 לכל אחד מהמשפחה', [
        fb.anat ? '<strong>ענת:</strong> ' + C().esc(fb.anat) : '',
        fb.ilay ? '<strong>עילאי:</strong> ' + C().esc(fb.ilay) : '',
        fb.lotem ? '<strong>לוטם:</strong> ' + C().esc(fb.lotem) : '',
        fb.natan ? '<strong>נתן:</strong> ' + C().esc(fb.natan) : '',
      ]);
    }
    // פנינה נסתרת
    if (dm.localGem && dm.localGem.name) {
      html += dailyInfoCard('💎 פנינה נסתרת', [
        '<strong>' + C().esc(dm.localGem.name) + '</strong>' + (dm.localGem.nameEn ? ' <span class="muted">(' + C().esc(dm.localGem.nameEn) + ')</span>' : ''),
        dm.localGem.desc ? C().esc(dm.localGem.desc) : '',
        dm.localGem.why ? '<em>' + C().esc(dm.localGem.why) + '</em>' : '',
      ]);
    }
    // טיפ תחבורה + מה לדלג
    if (dm.transportTip || dm.skip) {
      html += dailyInfoCard('🚆 תחבורה ומה לדלג', [
        dm.transportTip ? '<strong>תחבורה:</strong> ' + C().esc(dm.transportTip) : '',
        dm.skip ? '<strong>לדלג על:</strong> ' + C().esc(dm.skip) : '',
      ]);
    }
    if (dm.food) {
      html += dailyInfoCard('🍽 אוכל', [
        dm.food.vegetarian ? '<strong>צמחוני:</strong> ' + C().esc(dm.food.vegetarian) : '',
        dm.food.iceCream ? '<strong>גלידה:</strong> ' + C().esc(dm.food.iceCream) : '',
        dm.food.mustTry ? '<strong>חובה לטעום:</strong> ' + C().esc(dm.food.mustTry) : '',
      ]);
    }
    if (dm.shopping) {
      html += dailyInfoCard('🛍 קניות', [
        dm.shopping.what ? '<strong>מה:</strong> ' + C().esc(dm.shopping.what) : '',
        dm.shopping.where ? '<strong>איפה:</strong> ' + C().esc(dm.shopping.where) : '',
      ]);
    }
    if (d.tips && d.tips.length) {
      html += dailyInfoCard('💡 טיפים', d.tips.map(t => '• ' + C().esc(t)));
    }
    html += '</div>';

    panelEl.innerHTML = html;
  }

  // ============================================================
  //  מסך מקומות — רשת כרטיסים (אותו סט מסונן כמו המפה)
  // ============================================================
  function renderPlaces(st) {
    const items = filteredItems(st);
    const placeTypes = ['attraction', 'district', 'hotel', 'view', 'hike', 'onsen',
      'culture', 'nature', 'water', 'swim', 'sport', 'food', 'shopping', 'rest'];
    const places = items.filter(i => placeTypes.includes(i.type));

    const allPlaces = S().allItems().filter(i => placeTypes.includes(i.type));
    let html = screenHeader('places', 'מקומות', '<button class="opt-btn" id="btnAddPlace" style="float:left">➕ הוסף מקום</button>');
    html += filterSummaryBox(st, places.length, allPlaces.length);
    html += '<div class="muted" style="font-size:0.72rem;margin:6px 0">' + places.length + ' מקומות' +
      (countNoLoc(places) ? ' · ' + countNoLoc(places) + ' ללא מיקום' : '') + '</div>';

    if (!places.length) html += '<div class="empty-note">אין מקומות שתואמים לפילטר</div>';
    places.forEach(i => {
      html += C().placeCard(i, { active: i.id === selectedItemId, expandable: true });
    });
    panelEl.innerHTML = html;
  }

  function countNoLoc(items) { return items.filter(i => !i.coordinates).length; }

  // כרטיסיית מידע יומי נפתחת
  function dailyInfoCard(title, lines) {
    const body = lines.filter(Boolean).map(l => '<div class="ce-line">' + l + '</div>').join('');
    if (!body) return '';
    return '<div class="info-card">' +
      '<button class="info-card-head" data-infotoggle>' + title + ' <span class="ic-arrow">▾</span></button>' +
      '<div class="info-card-body">' + body + '</div></div>';
  }

  function gmapsItem(i) {
    const q = [i.nameEn || i.nameHe, i.city, 'Japan'].filter(Boolean).join(', ');
    if (i.coordinates) return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q) + '&center=' + i.coordinates.lat + ',' + i.coordinates.lng;
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }

  // זום למסלול של יום ספציפי בתקריב מסך
  function zoomToDay(dayId) {
    const items = S().itemsForDay(dayId);
    App.map.sync(items);
    App.map.drawRoute(items);
    App.map.fitItems(items);
  }

  // ============================================================
  //  מסך לינה — מלונות ממוספרים לפי יום + הכרעת סטטוס
  // ============================================================
  // אוסף רשומות לינה: לכל יום עם sleepRef → { hotel, day, dayIndex, date }
  function lodgingEntries(st) {
    const seen = {};
    const entries = [];
    st.dayOrder.forEach(dayId => {
      const day = st.days[dayId];
      if (!day.sleepRef) return;
      const hotel = st.items[day.sleepRef];
      if (!hotel || seen[hotel.id]) return;
      seen[hotel.id] = true;
      entries.push({ hotel, day, dayIndex: day.index, date: day.date });
    });
    return entries;
  }

  function renderLodging(st) {
    const entries = lodgingEntries(st);
    let html = screenHeader('lodging', 'לינה');
    html += '<div class="muted" style="font-size:0.72rem;margin-bottom:10px">' +
      entries.length + ' מקומות לינה · מספור לפי יום</div>';

    // ספירת סטטוסים
    const byStatus = { selected: 0, alternative: 0, proposed: 0 };
    entries.forEach(e => { byStatus[e.hotel.status] = (byStatus[e.hotel.status] || 0) + 1; });
    html += '<div class="lodge-stats">' +
      '<span class="status-pill status-selected">סופי: ' + byStatus.selected + '</span>' +
      '<span class="status-pill status-alternative">חלופה: ' + byStatus.alternative + '</span>' +
      '<span class="status-pill status-proposed">לא סופי: ' + byStatus.proposed + '</span>' +
    '</div>';

    if (!entries.length) html += '<div class="empty-note">אין מקומות לינה</div>';
    entries.forEach(e => { html += C().lodgingRow(e.hotel, e.day); });
    panelEl.innerHTML = html;
  }

  // ============================================================
  //  מסך עלויות — תקציב לפי נושא + פירוט + טיפי חיסכון
  // ============================================================
  // אוסף פריטי עלות לפי קטגוריה. מלונות נגזרים מ-type:hotel.
  function costsByCategory(st) {
    const cats = { flights: [], hotels: [], car: [], trains: [], transport: [], other: [] };
    S().allItems().forEach(i => {
      if (i.type === 'hotel') { cats.hotels.push(i); return; }
      if (i.type === 'cost') {
        const c = (i.meta && i.meta.costCat) || 'other';
        (cats[c] || cats.other).push(i);
      }
    });
    return cats;
  }

  function renderCosts(st) {
    const cats = costsByCategory(st);
    const C = C2();
    const order = ['flights', 'hotels', 'car', 'trains', 'transport', 'other'];

    // סה"כ כללי + פילוח לאדם
    let grand = 0;
    const perPerson = { 'נתן': 0, 'ענת': 0, 'עילאי': 0, 'לוטם': 0 };
    order.forEach(cat => cats[cat].forEach(i => {
      const t = C.itemTotal(i);
      grand += t;
      // פילוח: אם משויך לאדם ספציפי → לו; אם כולם → מתחלק ב-4
      const ppl = (i.people || ['כולם']);
      if (ppl.length === 1 && ppl[0] !== 'כולם' && perPerson[ppl[0]] != null) perPerson[ppl[0]] += t;
      else { Object.keys(perPerson).forEach(p => perPerson[p] += t / 4); }
    }));

    let html = screenHeader('costs', 'עלויות הטיול',
      '<button class="opt-btn" id="btnExportCosts" style="float:left">⬇ ייצוא</button>');

    // כרטיס סה"כ
    html += '<div class="cost-grand">' +
      '<div class="cost-grand-label">סה"כ משוער</div>' +
      '<div class="cost-grand-num">' + C.yen(grand) + '</div>' +
      '<div class="cost-grand-per">' +
        Object.keys(perPerson).map(p => '<span>' + p + ': ' + C.yen(Math.round(perPerson[p])) + '</span>').join('') +
      '</div>' +
    '</div>';

    // כרטיס לכל קטגוריה
    order.forEach(cat => {
      const items = cats[cat];
      const meta = C.COST_CATS[cat];
      const total = items.reduce((s, i) => s + C.itemTotal(i), 0);
      html += '<div class="cost-cat" data-cat="' + cat + '">' +
        '<div class="cost-cat-head" data-costtoggle="' + cat + '">' +
          '<span class="cost-cat-title">' + meta.icon + ' ' + meta.label + '</span>' +
          '<span class="cost-cat-count muted">' + items.length + ' רשומות</span>' +
          '<span class="cost-cat-total">' + C.yen(total) + '</span>' +
          '<span class="cost-cat-arrow">▾</span>' +
        '</div>' +
        '<div class="cost-cat-body">' +
          (items.length ? items.map(i => C.costRow(i)).join('') : '<div class="muted" style="font-size:0.74rem;padding:6px">אין רשומות</div>') +
          '<button class="opt-btn" data-addcost="' + cat + '" style="margin-top:6px">➕ הוסף רשומה</button>' +
          C.costTipCard(cat) +
        '</div>' +
      '</div>';
    });

    panelEl.innerHTML = html;
  }
  function C2() { return App.components; }

  // ============================================================
  //  מסך סיכום — שולחן עבודה: קונספט, מספרים, נושאים, פלט/קלט
  // ============================================================
  function tripStats(st) {
    const C = C2();
    let km = 0, attractions = 0, lodgings = 0;
    const cityDays = {};
    st.dayOrder.forEach(id => {
      const d = st.days[id];
      cityDays[d.city] = (cityDays[d.city] || 0) + 1;
      if (d.drive && d.drive.km) km += Number(d.drive.km) || 0;
      if (d.sleepRef) lodgings++;
    });
    const placeTypes = ['attraction', 'view', 'hike', 'onsen', 'culture', 'nature', 'water', 'swim'];
    S().allItems().forEach(i => { if (placeTypes.includes(i.type)) attractions++; });
    let totalCost = 0;
    S().allItems().forEach(i => { if (i.type === 'cost' || i.type === 'hotel') totalCost += C.itemTotal(i); });
    return { days: st.dayOrder.length, km, attractions, lodgings, cityDays, totalCost };
  }

  function renderSummary(st) {
    const C = C2();
    const m = st.meta || {};
    const hk = m.hokkaido || {};
    const stats = tripStats(st);

    let html = screenHeader('summary', 'סיכום הטיול');

    // ----- כלי פלט/קלט (סרגל עליון) -----
    html += '<div class="output-bar">' +
      '<button class="out-btn" id="btnPrint">🖨 הדפסה</button>' +
      '<button class="out-btn" id="btnEmail">📧 מייל</button>' +
      '<button class="out-btn" id="btnExportMd">📄 ייצוא טקסט</button>' +
      '<button class="out-btn" id="btnExportJson">⬇ JSON</button>' +
    '</div>';

    // ----- בלוק 1: קונספט -----
    const concept = m.tripConcept || hk.subtitle || '';
    html += C.summaryBlock('concept', '🎯', 'קונספט הטיול',
      '<div class="concept-text" id="conceptText">' + (concept ? C.esc(concept) : '<span class="muted">לחץ לעריכת תיאור הטיול</span>') + '</div>' +
      '<button class="opt-btn" id="btnEditConcept" style="margin-top:6px">✎ ערוך קונספט</button>' +
      '<div class="concept-meta">' +
        (hk.season ? '<span>🗓 ' + C.esc(hk.season) + '</span>' : '') +
        (hk.entry ? '<span>🛬 ' + C.esc(hk.entry) + '</span>' : '') +
        (hk.exit ? '<span>🛫 ' + C.esc(hk.exit) + '</span>' : '') +
        (hk.transport ? '<span>🚗 ' + C.esc(hk.transport) + '</span>' : '') +
      '</div>', { open: true });

    // ----- בלוק 2: מספרים גדולים -----
    let statHtml = '<div class="stat-grid">' +
      C.statBox(stats.days, 'ימים', '📅') +
      C.statBox(Object.keys(stats.cityDays).length, 'אזורים', '🗾') +
      C.statBox(stats.km.toLocaleString(), 'ק"מ נסיעה', '🛣') +
      C.statBox(stats.lodgings, 'לינות', '🏨') +
      C.statBox(stats.attractions, 'אטרקציות', '📍') +
      C.statBox(C.yen(stats.totalCost), 'עלות', '💴') +
    '</div>';
    html += C.summaryBlock('stats', '📊', 'מספרים', statHtml, { open: true });

    // ----- בלוק 3: אזורים וזמנים -----
    let regHtml = '';
    const cityIcon = { 'אוסקה': '🏯', 'הוקאידו': '🏔', 'טוקיו': '🗼' };
    Object.keys(stats.cityDays).forEach(city => {
      const dayIds = st.dayOrder.filter(id => st.days[id].city === city);
      const first = st.days[dayIds[0]], last = st.days[dayIds[dayIds.length - 1]];
      regHtml += '<div class="region-row">' +
        '<span class="region-ic">' + (cityIcon[city] || '📍') + '</span>' +
        '<span class="region-name">' + C.esc(city) + '</span>' +
        '<span class="region-days">' + stats.cityDays[city] + ' ימים</span>' +
        '<span class="muted">' + C.esc(first.date) + ' – ' + C.esc(last.date) + '</span>' +
      '</div>';
    });
    html += C.summaryBlock('regions', '🗺', 'אזורים וזמנים', regHtml);

    // ----- בלוק 4: לינה -----
    const entries = lodgingEntries(st);
    const lodgeTypes = {};
    entries.forEach(e => { const t = (e.hotel.shortDescription || '').split('·')[0].trim(); if (t) lodgeTypes[t] = (lodgeTypes[t] || 0) + 1; });
    let lodgeHtml = '<div class="lodge-types">' +
      Object.keys(lodgeTypes).map(t => '<span class="lodge-type-chip">' + C.esc(t) + ' ×' + lodgeTypes[t] + '</span>').join('') + '</div>';
    entries.forEach(e => {
      lodgeHtml += '<div class="sum-lodge-row">' +
        '<span class="muted">יום ' + e.dayIndex + ' · ' + C.esc(e.date) + '</span> ' +
        C.esc(e.hotel.nameHe) + ' ' + C.statusPill(e.hotel.status) + '</div>';
    });
    html += C.summaryBlock('lodging', '🏨', 'לינה (' + entries.length + ')', lodgeHtml);

    // ----- בלוק 5: עלויות -----
    const cats = costsByCategory(st);
    let costHtml = '';
    ['flights', 'hotels', 'car', 'trains', 'transport', 'other'].forEach(cat => {
      const t = cats[cat].reduce((s, i) => s + C.itemTotal(i), 0);
      costHtml += '<div class="sum-cost-row"><span>' + C.COST_CATS[cat].icon + ' ' + C.COST_CATS[cat].label + '</span>' +
        '<strong>' + C.yen(t) + '</strong></div>';
    });
    costHtml += '<div class="sum-cost-row total"><span>סה"כ</span><strong>' + C.yen(stats.totalCost) + '</strong></div>';
    html += C.summaryBlock('costs', '💴', 'עלויות', costHtml);

    // ----- בלוק 6: טיפים והמלצות -----
    let tipsHtml = '';
    st.dayOrder.forEach(id => {
      const d = st.days[id];
      (d.tips || []).forEach(t => { tipsHtml += '<div class="tip-line">💡 ' + C.esc(t) + '</div>'; });
    });
    if (!tipsHtml) tipsHtml = '<div class="muted">אין טיפים</div>';
    html += C.summaryBlock('tips', '💡', 'טיפים והמלצות', tipsHtml);

    // ----- בלוק 7: קישורים חיוניים -----
    const links = S().allItems().filter(i => i.externalLink);
    let linksHtml = links.length ? links.map(i => C.linkRow(i)).join('') : '<div class="muted">אין קישורים</div>';
    html += C.summaryBlock('links', '🔗', 'קישורים חיוניים (' + links.length + ')', linksHtml);

    // ----- בלוק 8: גלריה -----
    const gallery = m.gallery || [];
    let galHtml = '<div class="gallery-grid">' +
      gallery.map((g, i) => '<div class="gallery-item"><img src="' + g.src + '" alt=""><button class="gallery-del" data-galdel="' + i + '">✕</button></div>').join('') +
      '<label class="gallery-add">➕<input type="file" accept="image/*" id="galleryInput" hidden></label>' +
    '</div>';
    html += C.summaryBlock('gallery', '🖼', 'גלריית תמונות (' + gallery.length + ')', galHtml);

    // ----- בלוק 9: סיכום ימים מפורט -----
    let daysHtml = '';
    st.dayOrder.forEach(dayId => {
      const d = st.days[dayId];
      const items = S().itemsForDay(dayId);
      // מציג את כל היעדים (נבחר/חלופה/בוצע) — לא רק selected
      const stops = items.filter(i => i.status !== 'cancelled');
      const sleep = d.sleepRef ? st.items[d.sleepRef] : null;
      const ic = cityIcon[d.city] || '📍';
      daysHtml += '<div class="sum-day">' +
        '<div class="sum-day-head">' + ic + ' יום ' + d.index + ' · ' + C.esc(d.date) + ' · ' + C.esc(d.title) + '</div>' +
        (sleep ? '<div class="muted" style="font-size:0.66rem">🏨 ' + C.esc(sleep.nameHe) + '</div>' : '') +
        '<div class="sum-day-stops">' +
          stops.map(i => '<span class="place-link" data-focus="' + i.id + '">' + C.esc(i.nameHe) + '</span>').join('<span class="muted"> · </span>') +
        '</div>' +
      '</div>';
    });
    html += C.summaryBlock('days', '📋', 'מסלול יומי מפורט', daysHtml);

    panelEl.innerHTML = html;
  }

  // בניית טקסט סיכום (Markdown) לייצוא/מייל
  function summaryText(st) {
    const C = C2();
    const m = st.meta || {}, hk = m.hokkaido || {};
    const stats = tripStats(st);
    let t = '# סיכום טיול יפן\n\n';
    t += (m.tripConcept || hk.subtitle || '') + '\n\n';
    t += '## מספרים\n';
    t += '- ימים: ' + stats.days + '\n- אזורים: ' + Object.keys(stats.cityDays).join(', ') + '\n';
    t += '- ק"מ נסיעה: ' + stats.km + '\n- לינות: ' + stats.lodgings + '\n- עלות משוערת: ' + C.yen(stats.totalCost) + '\n\n';
    t += '## מסלול\n';
    st.dayOrder.forEach(id => {
      const d = st.days[id];
      const sleep = d.sleepRef ? st.items[d.sleepRef] : null;
      t += '\n### יום ' + d.index + ' · ' + d.date + ' · ' + d.city + ' — ' + d.title + '\n';
      if (sleep) t += 'לינה: ' + sleep.nameHe + '\n';
      S().itemsForDay(id).filter(i => i.status === 'selected').forEach(i => {
        t += '- ' + (i.recommendedTime ? i.recommendedTime + ' ' : '') + i.nameHe + '\n';
      });
    });
    t += '\n## עלויות\n';
    const cats = costsByCategory(st);
    ['flights', 'hotels', 'car', 'trains', 'transport', 'other'].forEach(cat => {
      const tot = cats[cat].reduce((s, i) => s + C.itemTotal(i), 0);
      t += '- ' + C.COST_CATS[cat].label + ': ' + C.yen(tot) + '\n';
    });
    t += 'סה"כ: ' + C.yen(stats.totalCost) + '\n\n';
    t += '## טיפים\n';
    st.dayOrder.forEach(id => (st.days[id].tips || []).forEach(tip => { t += '- ' + tip + '\n'; }));
    return t;
  }

  // ============================================================
  //  מפה לפי מסך
  // ============================================================
  let _lastScreen = null, _lastDay = null;
  function syncMapForScreen(st) {
    const screen = st.ui.activeScreen;
    App.map.clearRoute();
    if (screen === 'times') {
      const dayId = st.ui.activeDayId || st.dayOrder[0];
      const day = st.days[dayId];
      const items = S().itemsForDay(dayId);
      const hotel = day && day.sleepRef ? st.items[day.sleepRef] : null;
      // סימון תחילה/סוף/לינה/יעדים ממוספרים + קו מסלול
      App.map.syncDayRoute(items, hotel);
      // זום למסלול רק כשמשתנה היום/מסך (לא בכל עריכה קטנה)
      const all = hotel ? items.concat([hotel]) : items;
      if (screen !== _lastScreen || dayId !== _lastDay) App.map.fitItems(all);
      _lastDay = dayId;
    } else if (screen === 'lodging') {
      // רק מלונות, ממוספרים לפי יום
      const entries = lodgingEntries(st);
      App.map.syncLodging(entries);
      if (screen !== _lastScreen) App.map.fitItems(entries.map(e => e.hotel));
    } else if (screen === 'costs') {
      // עלויות אינן גאוגרפיות — מציגים מלונות (העלות העיקרית) על מפת יפן
      const hotels = S().allItems().filter(i => i.type === 'hotel');
      App.map.sync(hotels);
      if (screen !== _lastScreen) App.map.setView('japan');
    } else if (screen === 'summary') {
      // סקירה כללית — כל הפריטים על מפת יפן מלאה
      App.map.sync(S().allItems().filter(i => i.coordinates));
      if (screen !== _lastScreen) App.map.setView('japan');
    } else {
      const items = filteredItems(st);
      App.map.sync(items);
      // בכניסה למסך תכנון/מקומות — התאם לכל הפריטים
      if (screen !== _lastScreen) App.map.fitItems(items);
    }
    _lastScreen = screen;
  }

  // ============================================================
  //  קישור אירועים בפאנל (delegation)
  // ============================================================
  function bindPanel() {
    if (panelEl._bound) return;
    panelEl._bound = true;

    panelEl.addEventListener('click', e => {
      // ניקוי פילטרים
      if (e.target.id === 'btnClearFilters') {
        S().setUi({ filters: { people: null, type: null, priority: null, status: null, city: null } });
        return;
      }
      // כפתור סטטוס לינה (חלופה / לא סופי / סופי)
      const lst = e.target.closest('[data-lodgestatus]');
      if (lst) {
        e.stopPropagation();
        App.edit.setStatus(lst.dataset.item, lst.dataset.lodgestatus);
        return;
      }
      // קיפול/פתיחת קטגוריית עלות
      const costTog = e.target.closest('[data-costtoggle]');
      if (costTog) {
        const body = costTog.nextElementSibling;
        body.classList.toggle('open');
        costTog.querySelector('.cost-cat-arrow').textContent = body.classList.contains('open') ? '▴' : '▾';
        return;
      }
      // הוספת רשומת עלות
      const addCost = e.target.closest('[data-addcost]');
      if (addCost) {
        e.stopPropagation();
        const id = App.edit.addCost(addCost.dataset.addcost);
        App.detail.open(id);
        return;
      }
      // ייצוא עלויות
      if (e.target.id === 'btnExportCosts') { downloadJson(); return; }
      // כרטיסיית מידע יומי (אוכל/קניות/טיפים)
      const infoTog = e.target.closest('[data-infotoggle]');
      if (infoTog) {
        const body = infoTog.nextElementSibling;
        body.classList.toggle('open');
        infoTog.querySelector('.ic-arrow').textContent = body.classList.contains('open') ? '▴' : '▾';
        return;
      }
      // הרחבת כרטיסייה (עוד מידע)
      const expBtn = e.target.closest('[data-expand]');
      if (expBtn) {
        e.stopPropagation();
        const card = expBtn.closest('.card');
        const ex = card.querySelector('.card-expand');
        if (ex) { ex.classList.toggle('open'); expBtn.textContent = ex.classList.contains('open') ? '▴ פחות' : '▾ עוד'; }
        return;
      }
      // כפתור פרטים → מודאל עריכה (לפני data-item)
      const detailBtn = e.target.closest('[data-detail]');
      if (detailBtn) { e.stopPropagation(); App.detail.open(detailBtn.dataset.detail); return; }
      // סידור מחדש של תחנות
      const reBtn = e.target.closest('[data-reorder]');
      if (reBtn) {
        e.stopPropagation();
        const idx = parseInt(reBtn.dataset.idx, 10);
        const to = reBtn.dataset.reorder === 'up' ? idx - 1 : idx + 1;
        App.edit.reorderInDay(reBtn.dataset.day, idx, to);
        return;
      }
      // מעבר ליום — מהלוח בתכנון עוברים לזמנים; בזמנים נשארים
      const goday = e.target.closest('[data-goday]');
      if (goday && goday.dataset.goday) {
        const fromCal = !!goday.closest('.calendar');
        const patch = { activeDayId: goday.dataset.goday };
        if (fromCal) patch.activeScreen = 'times';
        S().setUi(patch);
        return;
      }
      // עריכת יום
      const editDay = e.target.closest('[data-editday]');
      if (editDay) { e.stopPropagation(); App.detail.openDay(editDay.dataset.editday); return; }
      // לחיצה על כרטיס יום → עבור לזמנים
      const dayCard = e.target.closest('[data-day]');
      if (dayCard) {
        S().setUi({ activeDayId: dayCard.dataset.day, activeScreen: 'times' });
        App.tabs && App.tabs.sync();
        return;
      }
      // לחיצה על שם מקום → מיקוד + זום במפה
      const focusEl = e.target.closest('[data-focus]');
      if (focusEl) {
        e.stopPropagation();
        const item = S().getItem(focusEl.dataset.focus);
        if (item && item.coordinates) { App.map.clearSelection(); App.map.focus(item); }
        else if (item) { /* פריט ללא מיקום — אפשר להתריע */ }
        return;
      }
      // לחיצה על פריט/כרטיס מקום → focus במפה
      const itemEl = e.target.closest('[data-item]');
      if (itemEl) {
        const item = S().getItem(itemEl.dataset.item);
        selectedItemId = itemEl.dataset.item;
        App.map.clearSelection();
        if (item) App.map.focus(item);
        return;
      }
      // הוספת מקום חדש
      if (e.target.id === 'btnAddPlace') {
        const id = App.edit.addItem({ nameHe: 'מקום חדש', type: 'attraction', city: 'הוקאידו' });
        App.detail.open(id); return;
      }
      // זום למסלול היום
      if (e.target.id === 'btnZoomDay') { zoomToDay(S().get().ui.activeDayId); return; }
      // הוספת תחנה ליום הנוכחי
      if (e.target.id === 'btnAddStop') {
        const dayId = S().get().ui.activeDayId;
        const id = App.edit.addItem({ nameHe: 'תחנה חדשה', type: 'attraction', city: S().getDay(dayId).city, dayId });
        App.detail.open(id); return;
      }
      // ייצוא
      if (e.target.id === 'btnExportJson') { downloadJson(); return; }
      if (e.target.id === 'btnPrint') { window.print(); return; }
      // בלוק סיכום מתקפל
      const blockTog = e.target.closest('[data-blocktoggle]');
      if (blockTog) {
        const body = blockTog.nextElementSibling;
        body.classList.toggle('open');
        blockTog.querySelector('.sum-block-arrow').textContent = body.classList.contains('open') ? '▴' : '▾';
        return;
      }
      // מייל
      if (e.target.id === 'btnEmail') {
        const txt = summaryText(S().get());
        window.location.href = 'mailto:?subject=' + encodeURIComponent('סיכום טיול יפן') +
          '&body=' + encodeURIComponent(txt);
        return;
      }
      // ייצוא טקסט / Markdown
      if (e.target.id === 'btnExportMd') {
        downloadFile('japan2-summary.md', summaryText(S().get()), 'text/markdown');
        return;
      }
      // עריכת קונספט
      if (e.target.id === 'btnEditConcept') {
        const cur = S().get().meta.tripConcept || (S().get().meta.hokkaido || {}).subtitle || '';
        const val = prompt('תיאור / קונספט הטיול:', cur);
        if (val != null) App.edit.setMeta('tripConcept', val);
        return;
      }
      // מחיקת תמונה מהגלריה
      const galDel = e.target.closest('[data-galdel]');
      if (galDel) { App.edit.removeGalleryImage(parseInt(galDel.dataset.galdel, 10)); return; }
    });

    // העלאת תמונה לגלריה (change, לא click)
    panelEl.addEventListener('change', e => {
      if (e.target.id === 'galleryInput' && e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.size > 2 * 1024 * 1024) { alert('התמונה גדולה מ-2MB — בחר תמונה קטנה יותר'); return; }
        const reader = new FileReader();
        reader.onload = ev => App.edit.addGalleryImage(ev.target.result);
        reader.readAsDataURL(file);
      }
    });
  }

  function downloadJson() { downloadFile('japan2-trip.json', S().exportFull(), 'application/json'); }
  function downloadFile(name, content, mime) {
    const blob = new Blob([content], { type: mime || 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; a.click();
  }

  function selectItem(id) {
    selectedItemId = id;
    const item = S().getItem(id);
    App.map.clearSelection();
    App.map.highlight(id);
    // הדגשת הכרטיס המתאים ברשימה + גלילה אליו
    highlightCardInList(id);
  }

  // ריחוף על סימן במפה → הדגשת הכרטיס ברשימה
  function hoverItem(id) {
    panelEl.querySelectorAll('.is-hovered').forEach(el => el.classList.remove('is-hovered'));
    if (id) {
      const card = panelEl.querySelector('[data-item="' + id + '"]');
      if (card) card.classList.add('is-hovered');
    }
  }

  function highlightCardInList(id) {
    panelEl.querySelectorAll('.is-active').forEach(el => el.classList.remove('is-active'));
    const card = panelEl.querySelector('[data-item="' + id + '"]');
    if (card) { card.classList.add('is-active'); card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }

  return { setPanel, renderActive, selectItem, hoverItem };
})();
