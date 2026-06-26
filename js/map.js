// ============================================================
//  map.js — Leaflet, markers מעוינים, חיווים, מצבים קבועים, ייצוב
// ============================================================
window.App = window.App || {};
App.map = (function () {

  let map = null;
  let markers = {};      // itemId → L.Marker
  let routeLayer = null;
  let onSelect = null;   // callback(itemId)
  let onHover = null;    // callback(itemId|null)

  // מצבי מבט קבועים — מנצלים את כל שטח המפה
  const VIEWS = {
    japan:    { bounds: [[33.0, 133.0], [45.8, 146.0]], label: '🗾 כל יפן' },
    osaka:    { bounds: [[34.2, 135.0], [36.6, 137.0]], label: '🏯 קנסאי' },     // אוסקה+קיוטו+קאנאזאווה
    hokkaido: { bounds: [[42.2, 139.8], [44.6, 145.5]], label: '🏔 הוקאידו' },
    tokyo:    { bounds: [[35.5, 139.4], [35.85, 139.95]], label: '🗼 טוקיו' },
  };

  function init(opts) {
    opts = opts || {};
    onSelect = opts.onSelect;
    onHover = opts.onHover;

    map = L.map('leafletMap', {
      zoomControl: true,
      scrollWheelZoom: true,    // זום חופשי בגלגלת (המפה מופרדת מהסרגלים)
      doubleClickZoom: true,
      zoomSnap: 0.25,           // זום עדין/חלק
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 100, // גלגלת רגישה פחות = שליטה טובה יותר
      worldCopyJump: false,
    });
    map.fitBounds(VIEWS.japan.bounds);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', maxZoom: 19, subdomains: 'abcd',
    }).addTo(map);

    // שכבת אזורים שקופה (מתחת לסימונים, לא אינטראקטיבית)
    regionLayer = L.layerGroup().addTo(map);
    routeLayer = L.layerGroup().addTo(map);
    drawRegions();

    addViewButtons();
    addZoomButtons();
    addLegendOverlay();
    return map;
  }

  // עיגולים שקופים ל-3 חלקי הטיול — צבעים תואמים, שקופים, ללא לחיצה
  let regionLayer = null;
  const REGIONS = [
    { name: 'קנסאי', center: [34.85, 135.62], radius: 75000, color: '#c0392b' },   // אדום
    { name: 'הוקאידו', center: [43.45, 143.0], radius: 180000, color: '#2d6a4f' },  // ירוק
    { name: 'טוקיו', center: [35.68, 139.7], radius: 45000, color: '#2c3e50' },     // כחול
  ];
  function drawRegions() {
    if (!regionLayer) return;
    regionLayer.clearLayers();
    REGIONS.forEach(r => {
      L.circle(r.center, {
        radius: r.radius,
        color: r.color, weight: 1.5, opacity: 0.25,
        fillColor: r.color, fillOpacity: 0.06,
        interactive: false,           // לא תופס לחיצות — לא מפריע לסימונים
        dashArray: '8,6',
      }).addTo(regionLayer);
    });
  }

  // כפתורי זום גדולים נוספים (מעבר ל-zoomControl הקטן)
  function addZoomButtons() {
    const ctl = L.control({ position: 'topleft' });
    ctl.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-zoom-btns');
      div.innerHTML =
        '<button class="map-zoom-btn" data-zoom="in">➕</button>' +
        '<button class="map-zoom-btn" data-zoom="out">➖</button>';
      L.DomEvent.disableClickPropagation(div);
      div.addEventListener('click', e => {
        const b = e.target.closest('[data-zoom]');
        if (!b) return;
        if (b.dataset.zoom === 'in') map.zoomIn(1);
        else map.zoomOut(1);
      });
      return div;
    };
    ctl.addTo(map);
  }

  // ----- כפתורי מצבי מבט קבועים על המפה -----
  function addViewButtons() {
    const ctl = L.control({ position: 'topright' });
    ctl.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-views');
      div.innerHTML = Object.keys(VIEWS).map(k =>
        '<button class="map-view-btn" data-view="' + k + '">' + VIEWS[k].label + '</button>'
      ).join('');
      L.DomEvent.disableClickPropagation(div);
      div.addEventListener('click', e => {
        const b = e.target.closest('[data-view]');
        if (b) setView(b.dataset.view);
      });
      return div;
    };
    ctl.addTo(map);
  }

  function setView(key) {
    const v = VIEWS[key];
    if (v && map) map.flyToBounds(v.bounds, { duration: 0.6 });
  }

  // ----- מקרא מרוכז על המפה (overlay) -----
  let legendCtl = null;
  function addLegendOverlay() {
    legendCtl = L.control({ position: 'bottomright' });
    legendCtl.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-legend-overlay');
      div.id = 'mapLegendOverlay';
      div.innerHTML = App.components.legendBox();
      L.DomEvent.disableClickPropagation(div);
      return div;
    };
    legendCtl.addTo(map);
  }

  function diamondIcon(item, opts) {
    opts = opts || {};
    const p = item.priority || 'medium';
    const sz = p === 'high' ? 22 : p === 'medium' ? 16 : 11;
    const sel = opts.selected ? ' selected' : '';
    const approx = (item.meta && item.meta.approxLocation) ? ' approx' : '';
    const label = '<span class="marker-label">' + App.components.esc(item.nameHe) +
      (item.meta && item.meta.approxLocation ? ' <span class="ml-approx">(משוער)</span>' : '') + '</span>';

    // תפקיד מיוחד במסלול יום: start / end / hotel
    if (opts.role === 'start') {
      return L.divIcon({ className: '', iconSize: [30, 44], iconAnchor: [15, 15],
        html: '<div class="marker-diamond role-start' + sel + approx + '"><div class="role-pin start">▶</div>' + label + '</div>' });
    }
    if (opts.role === 'end') {
      return L.divIcon({ className: '', iconSize: [30, 44], iconAnchor: [15, 15],
        html: '<div class="marker-diamond role-end' + sel + approx + '"><div class="role-pin end">■</div>' + label + '</div>' });
    }
    if (item.type === 'hotel') {
      return L.divIcon({ className: '', iconSize: [30, 44], iconAnchor: [15, 15],
        html: '<div class="marker-diamond hotel-marker' + sel + approx + '"><div class="hotel-pin">🏨</div>' + label + '</div>' });
    }
    // יעד רגיל — מעוין עם מספר סידורי
    const num = (opts.seq != null) ? '<span class="m-seq">' + opts.seq + '</span>' : '';
    return L.divIcon({
      className: '',
      html: '<div class="marker-diamond' + sel + approx + '">' + num +
        App.components.priorityDiamond(p) + label + '</div>',
      iconSize: [sz * 2, sz * 2 + 16],
      iconAnchor: [sz, sz],
    });
  }

  // tooltip תוכן בריחוף
  function tooltipHtml(item) {
    const C = App.components;
    return '<div class="mtip-name">' + C.esc(item.nameHe) + '</div>' +
      (item.nameEn ? '<div class="mtip-en">' + C.esc(item.nameEn) + '</div>' : '') +
      '<div class="mtip-meta">' +
        (item.recommendedTime ? '🕐 ' + C.esc(item.recommendedTime) + '  ' : '') +
        (item.duration ? '⏱ ' + C.esc(item.duration) : '') +
      '</div>' +
      (item.shortDescription ? '<div class="mtip-desc">' + C.esc(item.shortDescription.slice(0, 90)) + '</div>' : '');
  }

  // popup תוכן בלחיצה (מפורט יותר + קישור)
  function popupHtml(item) {
    const C = App.components;
    const gmaps = 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent([item.nameEn || item.nameHe, item.city, 'Japan'].filter(Boolean).join(', ')) +
      (item.coordinates ? '&center=' + item.coordinates.lat + ',' + item.coordinates.lng : '');
    return '<div class="mpop">' +
      '<div class="mpop-head">' + C.priorityDiamond(item.priority, { sm: true }) +
        ' <strong>' + C.esc(item.nameHe) + '</strong></div>' +
      (item.nameEn ? '<div class="mtip-en">' + C.esc(item.nameEn) + '</div>' : '') +
      '<div class="mpop-row">' + C.typeBadge(item.type) + ' ' + C.statusPill(item.status) + '</div>' +
      (item.recommendedTime || item.duration ? '<div class="mpop-meta">🕐 ' + C.esc(item.recommendedTime || '—') + ' · ⏱ ' + C.esc(item.duration || '—') + '</div>' : '') +
      (item.shortDescription ? '<div class="mpop-desc">' + C.esc(item.shortDescription) + '</div>' : '') +
      '<div class="mpop-actions">' +
        '<a href="' + gmaps + '" target="_blank">📍 מפות</a>' +
        '<button data-popdetail="' + C.esc(item.id) + '">✎ פרטים</button>' +
      '</div></div>';
  }

  function sync(items) {
    if (!map) return;
    const wanted = {};
    items.forEach(i => { if (i.coordinates) wanted[i.id] = i; });

    Object.keys(markers).forEach(id => {
      if (!wanted[id]) { map.removeLayer(markers[id]); delete markers[id]; }
    });

    Object.keys(wanted).forEach(id => {
      const item = wanted[id];
      if (markers[id]) {
        markers[id].setIcon(diamondIcon(item));
        markers[id].setLatLng([item.coordinates.lat, item.coordinates.lng]);
        markers[id].setTooltipContent(tooltipHtml(item));
        markers[id].setPopupContent(popupHtml(item));
      } else {
        const m = L.marker([item.coordinates.lat, item.coordinates.lng], {
          icon: diamondIcon(item),
          riseOnHover: true,
        }).addTo(map);
        m.bindTooltip(tooltipHtml(item), { direction: 'top', className: 'marker-tip', offset: [0, -10] });
        m.bindPopup(popupHtml(item), { className: 'marker-pop' });
        m.on('click', () => { onSelect && onSelect(id); });
        m.on('mouseover', () => { onHover && onHover(id); });
        m.on('mouseout', () => { onHover && onHover(null); });
        m.on('popupopen', e => {
          const btn = e.popup.getElement().querySelector('[data-popdetail]');
          if (btn) btn.addEventListener('click', () => { map.closePopup(); App.detail.open(btn.dataset.popdetail); });
        });
        markers[id] = m;
      }
    });
  }

  // סנכרון מסלול יום עם תפקידים: תחילה/סוף/מספור יעדים
  // מקבל רשימה מסודרת + (אופציונלי) פריט לינה
  function syncDayRoute(orderedItems, hotelItem) {
    if (!map) return;
    // פריטים עם קואורדינטות בלבד
    const located = orderedItems.filter(i => i.coordinates);
    const wantedIds = {};
    located.forEach(i => { wantedIds[i.id] = true; });
    if (hotelItem && hotelItem.coordinates) wantedIds[hotelItem.id] = true;

    // הסר markers שלא ביום
    Object.keys(markers).forEach(id => {
      if (!wantedIds[id]) { map.removeLayer(markers[id]); delete markers[id]; }
    });

    // מספור יעדים אמיתיים (לא נסיעה/מעבר/לוגיסטיקה)
    const stopTypes = ['attraction', 'view', 'hike', 'swim', 'water', 'onsen', 'culture', 'nature', 'food', 'shopping', 'rest', 'sport'];
    let seq = 0;
    located.forEach((item, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === located.length - 1;
      let role = null, seqNum = null;
      if (isFirst) role = 'start';
      else if (isLast) role = 'end';
      if (stopTypes.includes(item.type) && !isFirst && !isLast) { seq++; seqNum = seq; }
      placeMarker(item, { role, seq: seqNum });
    });

    // לינה
    if (hotelItem && hotelItem.coordinates) placeMarker(hotelItem, {});

    drawRoute(located);
  }

  // הצבה/עדכון של marker יחיד עם אופציות תפקיד
  function placeMarker(item, opts) {
    const ll = [item.coordinates.lat, item.coordinates.lng];
    if (markers[item.id]) {
      markers[item.id].setIcon(diamondIcon(item, opts));
      markers[item.id].setLatLng(ll);
      markers[item.id].setTooltipContent(tooltipHtml(item));
      markers[item.id].setPopupContent(popupHtml(item));
      markers[item.id]._role = opts.role;
    } else {
      const m = L.marker(ll, { icon: diamondIcon(item, opts), riseOnHover: true }).addTo(map);
      m.bindTooltip(tooltipHtml(item), { direction: 'top', className: 'marker-tip', offset: [0, -10] });
      m.bindPopup(popupHtml(item), { className: 'marker-pop' });
      m.on('click', () => { onSelect && onSelect(item.id); });
      m.on('mouseover', () => { onHover && onHover(item.id); });
      m.on('mouseout', () => { onHover && onHover(null); });
      m.on('popupopen', e => {
        const btn = e.popup.getElement().querySelector('[data-popdetail]');
        if (btn) btn.addEventListener('click', () => { map.closePopup(); App.detail.open(btn.dataset.popdetail); });
      });
      markers[item.id] = m;
      markers[item.id]._role = opts.role;
    }
  }

  // סנכרון מסך לינה: רק מלונות, ממוספרים לפי יום, תווית עם תאריך
  // entries = [{ hotel, dayIndex, date }]
  function syncLodging(entries) {
    if (!map) return;
    clearRoute();
    const wanted = {};
    entries.forEach(e => { if (e.hotel.coordinates) wanted[e.hotel.id] = e; });

    Object.keys(markers).forEach(id => {
      if (!wanted[id]) { map.removeLayer(markers[id]); delete markers[id]; }
    });

    // קו מסלול לינות לפי סדר הימים (חיבור בין מקומות הלינה)
    const ordered = entries.filter(e => e.hotel.coordinates)
      .sort((a, b) => a.dayIndex - b.dayIndex);
    const coords = ordered.map(e => [e.hotel.coordinates.lat, e.hotel.coordinates.lng]);
    if (coords.length > 1) {
      L.polyline(coords, { color: 'white', weight: 5, opacity: 0.6 }).addTo(routeLayer);
      L.polyline(coords, { color: '#16697a', weight: 2.5, opacity: 0.8, dashArray: '2,7', lineCap: 'round' }).addTo(routeLayer);
    }

    ordered.forEach(e => {
      const h = e.hotel;
      const ll = [h.coordinates.lat, h.coordinates.lng];
      const icon = lodgeIcon(h, e.dayIndex);
      if (markers[h.id]) {
        markers[h.id].setIcon(icon); markers[h.id].setLatLng(ll);
        markers[h.id].setTooltipContent(lodgeTip(h, e));
        markers[h.id].setPopupContent(popupHtml(h));
      } else {
        const mk = L.marker(ll, { icon, riseOnHover: true }).addTo(map);
        mk.bindTooltip(lodgeTip(h, e), { direction: 'top', className: 'marker-tip', offset: [0, -14] });
        mk.bindPopup(popupHtml(h), { className: 'marker-pop' });
        mk.on('click', () => { onSelect && onSelect(h.id); });
        mk.on('mouseover', () => { onHover && onHover(h.id); });
        mk.on('mouseout', () => { onHover && onHover(null); });
        mk.on('popupopen', ev => {
          const btn = ev.popup.getElement().querySelector('[data-popdetail]');
          if (btn) btn.addEventListener('click', () => { map.closePopup(); App.detail.open(btn.dataset.popdetail); });
        });
        markers[h.id] = mk;
      }
    });
  }

  function lodgeIcon(hotel, dayIndex) {
    const sel = ''; // הדגשה מנוהלת ע"י highlight()
    // צבע לפי סטטוס (סופי=ירוק, חלופה=כתום, לא סופי=אפור)
    const stColor = hotel.status === 'selected' ? '#1e8449'
      : hotel.status === 'alternative' ? '#d4870e' : '#8a8780';
    return L.divIcon({
      className: '', iconSize: [34, 46], iconAnchor: [17, 17],
      html: '<div class="marker-diamond lodge-marker' + sel + '">' +
        '<div class="lodge-pin" style="background:' + stColor + '"><span class="lodge-num-pin">' + dayIndex + '</span></div>' +
        '<span class="marker-label">' + App.components.esc(hotel.nameHe) + '</span></div>',
    });
  }
  function lodgeTip(hotel, e) {
    const C = App.components;
    return '<div class="mtip-name">🏨 יום ' + e.dayIndex + ' · ' + C.esc(e.date) + '</div>' +
      '<div class="mtip-meta">' + C.esc(hotel.nameHe) + '</div>' +
      (hotel.district ? '<div class="mtip-desc">📍 ' + C.esc(hotel.district) + '</div>' : '');
  }

  function drawRoute(orderedItems) {
    if (!map || !routeLayer) return;
    routeLayer.clearLayers();
    const coords = orderedItems.filter(i => i.coordinates).map(i => [i.coordinates.lat, i.coordinates.lng]);
    if (coords.length > 1) {
      // קו הילה לבן מתחת + קו כהה — בולט יותר כשכבת מידע
      L.polyline(coords, { color: 'white', weight: 6, opacity: 0.7 }).addTo(routeLayer);
      L.polyline(coords, { color: '#c0392b', weight: 3, opacity: 0.85, dashArray: '1,6', lineCap: 'round' }).addTo(routeLayer);
    }
    return coords;
  }
  function clearRoute() { if (routeLayer) routeLayer.clearLayers(); }

  function fitItems(items) {
    if (!map) return;
    const coords = items.filter(i => i.coordinates).map(i => [i.coordinates.lat, i.coordinates.lng]);
    if (coords.length === 1) map.flyTo(coords[0], 12, { duration: 0.5 });
    else if (coords.length > 1) map.flyToBounds(L.latLngBounds(coords).pad(0.18), { maxZoom: 13, duration: 0.5 });
  }

  function focus(item) {
    if (!map || !item || !item.coordinates) return;
    map.flyTo([item.coordinates.lat, item.coordinates.lng], 13, { duration: 0.6 });
    highlight(item.id);
    if (markers[item.id]) markers[item.id].openPopup();
  }

  // הדגשת סימן (סנכרון דו-כיווני עם הרשימה)
  function highlight(itemId) {
    Object.keys(markers).forEach(id => {
      const el = markers[id].getElement();
      if (!el) return;
      const d = el.querySelector('.marker-diamond');
      if (d) d.classList.toggle('selected', id === itemId);
    });
  }
  function clearSelection() { highlight(null); }

  function invalidate() { if (map) setTimeout(() => map.invalidateSize(), 60); }
  function refreshLegend() {
    const el = document.getElementById('mapLegendOverlay');
    if (el) el.innerHTML = App.components.legendBox();
  }

  return {
    init, sync, syncDayRoute, syncLodging, drawRoute, clearRoute, fitItems, focus, highlight,
    clearSelection, invalidate, setView, refreshLegend, get: () => map, VIEWS,
  };
})();
