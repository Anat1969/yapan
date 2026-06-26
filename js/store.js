// ============================================================
//  store.js — המאגר המרכזי + שמירה (BASE + OVERRIDES) + pubsub
//
//  BASE   נבנה מהמקורות בכל טעינה (לא נשמר).
//  OVERRIDES נשמר ב-localStorage כדלתא של עריכות המשתמש.
//  כל שינוי עובר דרך store.update(delta) → שומר → מודיע.
// ============================================================
window.App = window.App || {};
App.store = (function () {

  const LS_KEY = 'japan2.overrides.v9'; // v9: מיקום מדויק למלונות הוקאידו
  let state = null;          // { meta, days, dayOrder, items, ui }
  let overrides = null;      // הדלתא הנשמר
  const subscribers = [];

  // ----- ברירת מחדל ל-ui -----
  function defaultUi() {
    return {
      activeScreen: 'planning',
      activeDayId: null,
      filters: { people: null, type: null, priority: null, status: null, city: null },
      mapCenter: null,
    };
  }

  // ----- קריאה/כתיבה ל-localStorage -----
  function loadOverrides() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : emptyOverrides();
    } catch (e) {
      console.warn('overrides load failed, starting clean', e);
      return emptyOverrides();
    }
  }
  function emptyOverrides() {
    return { items: {}, deleted: [], days: {}, dayOrder: null, ui: {}, tripMeta: {} };
  }
  function persist() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(overrides)); }
    catch (e) { console.warn('persist failed', e); }
  }

  // ----- בניית state מ-BASE + OVERRIDES -----
  function rebuild() {
    const base = App.normalize.build();
    overrides = loadOverrides();

    // items: בסיס → מחיקות → patches/חדשים
    const items = {};
    Object.keys(base.items).forEach(id => { items[id] = base.items[id]; });
    (overrides.deleted || []).forEach(id => { delete items[id]; });
    Object.keys(overrides.items || {}).forEach(id => {
      items[id] = Object.assign({}, items[id] || App.normalize.makeItem({ id }), overrides.items[id]);
    });

    // days: בסיס → patches
    const days = {};
    Object.keys(base.days).forEach(id => { days[id] = base.days[id]; });
    Object.keys(overrides.days || {}).forEach(id => {
      if (days[id]) days[id] = Object.assign({}, days[id], overrides.days[id]);
    });

    const dayOrder = overrides.dayOrder || base.dayOrder.slice();
    const ui = Object.assign(defaultUi(), overrides.ui || {});
    if (!ui.activeDayId && dayOrder.length) ui.activeDayId = dayOrder[0];

    // meta: בסיס + tripMeta עריך (קונספט, גלריה...)
    const meta = Object.assign({}, base.meta, overrides.tripMeta || {});

    state = { meta, days, dayOrder, items, ui };
  }

  // ============================================================
  //  API
  // ============================================================
  function init() { rebuild(); }

  function get() { return state; }
  function getItem(id) { return state.items[id]; }
  function getDay(id) { return state.days[id]; }
  function allItems() { return Object.keys(state.items).map(id => state.items[id]); }
  function itemsForDay(dayId) {
    const d = state.days[dayId];
    if (!d) return [];
    return (d.itemOrder || []).map(id => state.items[id]).filter(Boolean);
  }

  function subscribe(fn) { subscribers.push(fn); }
  function notify() { subscribers.forEach(fn => fn(state)); }

  // עדכון מרכזי — מקבל דלתא וממזג ל-state + overrides
  function update(delta, opts) {
    opts = opts || {};
    delta = delta || {};

    // items patches
    if (delta.items) {
      Object.keys(delta.items).forEach(id => {
        state.items[id] = Object.assign({}, state.items[id] || App.normalize.makeItem({ id }), delta.items[id]);
        overrides.items[id] = Object.assign({}, overrides.items[id] || {}, delta.items[id]);
      });
    }
    // item deletions
    if (delta.deleted) {
      delta.deleted.forEach(id => {
        delete state.items[id];
        if (!overrides.deleted.includes(id)) overrides.deleted.push(id);
        delete overrides.items[id];
        // הסרה מסדר הימים
        Object.keys(state.days).forEach(did => {
          const d = state.days[did];
          if (d.itemOrder && d.itemOrder.includes(id)) {
            d.itemOrder = d.itemOrder.filter(x => x !== id);
            overrides.days[did] = Object.assign({}, overrides.days[did] || {}, { itemOrder: d.itemOrder });
          }
        });
      });
    }
    // days patches
    if (delta.days) {
      Object.keys(delta.days).forEach(id => {
        if (!state.days[id]) return;
        state.days[id] = Object.assign({}, state.days[id], delta.days[id]);
        overrides.days[id] = Object.assign({}, overrides.days[id] || {}, delta.days[id]);
      });
    }
    // day order
    if (delta.dayOrder) {
      state.dayOrder = delta.dayOrder.slice();
      overrides.dayOrder = delta.dayOrder.slice();
    }
    // ui (לא תמיד שומרים — חלק מה-ui ארעי)
    if (delta.ui) {
      state.ui = Object.assign({}, state.ui, delta.ui);
      overrides.ui = Object.assign({}, overrides.ui || {}, delta.ui);
    }
    // tripMeta — קונספט, גלריה (עריך)
    if (delta.tripMeta) {
      state.meta = Object.assign({}, state.meta, delta.tripMeta);
      overrides.tripMeta = Object.assign({}, overrides.tripMeta || {}, delta.tripMeta);
    }

    persist();
    if (!opts.silent) notify();
  }

  // עדכון ui בלבד (נשמר, מודיע אם צריך)
  function setUi(patch, opts) { update({ ui: patch }, opts); }

  // איפוס מלא
  function reset() {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    rebuild();
    notify();
  }

  // ייצוא
  function exportOverrides() { return JSON.stringify(overrides, null, 2); }
  function exportFull() { return JSON.stringify({ days: state.days, dayOrder: state.dayOrder, items: state.items }, null, 2); }

  return {
    init, get, getItem, getDay, allItems, itemsForDay,
    subscribe, notify, update, setUi, reset,
    exportOverrides, exportFull,
  };
})();
