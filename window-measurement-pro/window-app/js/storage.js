/* ============================================================
   storage.js — طبقة التخزين المحلي (LocalStorage)
   هيكل البيانات موحّد حسب المواصفات، مع حفظ متزامن فوري.
   ============================================================ */

const DB_KEY = 'winapp_db_v1';

const DEFAULT_DB = {
  settings: {
    theme: 'light',
    types: [' منور', 'مطبخ', 'حمام', ' غرفة ']
  },
  models: [],
  projects: []
};

const Storage = (() => {
  let cache = null;

  function _load() {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(DB_KEY);
      cache = raw ? JSON.parse(raw) : structuredClone(DEFAULT_DB);
      // ضمان وجود كل الحقول الأساسية حتى مع بيانات قديمة/ناقصة
      cache.settings = Object.assign(structuredClone(DEFAULT_DB.settings), cache.settings || {});
      cache.models = cache.models || [];
      cache.projects = cache.projects || [];
    } catch (e) {
      console.error('تعذر قراءة قاعدة البيانات المحلية، سيتم البدء من جديد', e);
      cache = structuredClone(DEFAULT_DB);
    }
    return cache;
  }

  function _persist() {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(cache));
      return true;
    } catch (e) {
      console.error('فشل الحفظ (قد تكون المساحة ممتلئة)', e);
      if (window.Toast) Toast.show('فشل الحفظ محلياً — تحقق من مساحة التخزين', 'danger');
      return false;
    }
  }

  function getDB() { return _load(); }
  function save() { return _persist(); }

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ---------------- المشاريع ----------------
  function listProjects() { return _load().projects; }

  function getProject(id) { return _load().projects.find(p => p.id === id) || null; }

  function addProject({ client, location, phone }) {
    const db = _load();
    const proj = {
      id: uid('proj'),
      client, location, phone,
      createdAt: new Date().toISOString(),
      measurements: []
    };
    db.projects.unshift(proj);
    _persist();
    return proj;
  }

  function updateProject(id, patch) {
    const db = _load();
    const p = db.projects.find(x => x.id === id);
    if (!p) return null;
    Object.assign(p, patch);
    _persist();
    return p;
  }

  function deleteProject(id) {
    const db = _load();
    db.projects = db.projects.filter(x => x.id !== id);
    _persist();
  }

  // ---------------- المقاسات ----------------

  /**
   * nextPos — يولّد رقم الشباك التالي تلقائيًا بناءً على آخر قيمة مُدخلة.
   * يدعم: أرقام (1→2)، حروف إنجليزية (A→B)، حروف عربية (أ→ب)،
   * ونصوص مختلطة مثل "شباك 3" → "شباك 4" أو "Win-A" → "Win-B".
   * إذا لم يكن هناك قيم سابقة يبدأ من "1".
   */
  function nextPos(project) {
    const measurements = project.measurements;
    if (measurements.length === 0) return '1';

    const lastPos = measurements[measurements.length - 1].pos || '';
    return incrementValue(lastPos);
  }

  /**
   * incrementValue — يأخذ قيمة ويرجع القيمة التالية في التسلسل.
   */
  function incrementValue(value) {
    if (!value) return '1';

    // حالة 1: القيمة رقم صرف مثل "1", "02", "15"
    if (/^\d+$/.test(value)) {
      const num = parseInt(value, 10) + 1;
      return String(num).padStart(value.length, '0');
    }

    // حالة 2: القيمة حرف إنجليزي واحد مثل "A" أو "z"
    if (/^[A-Za-z]$/.test(value)) {
      const code = value.charCodeAt(0);
      if ((code >= 65 && code < 90) || (code >= 97 && code < 122)) {
        return String.fromCharCode(code + 1);
      }
      // بعد Z أو z نرجع لرقم
      return '1';
    }

    // حالة 3: نص ينتهي برقم مثل "شباك 3" أو "Pos. 01"
    const numSuffix = value.match(/^(.*?)(\d+)$/);
    if (numSuffix) {
      const prefix = numSuffix[1];
      const numPart = numSuffix[2];
      const next = parseInt(numPart, 10) + 1;
      return prefix + String(next).padStart(numPart.length, '0');
    }

    // حالة 4: نص ينتهي بحرف إنجليزي مثل "Win-A"
    const letterSuffix = value.match(/^(.*?)([A-Za-z])$/);
    if (letterSuffix) {
      const prefix = letterSuffix[1];
      const letter = letterSuffix[2];
      const code = letter.charCodeAt(0);
      if ((code >= 65 && code < 90) || (code >= 97 && code < 122)) {
        return prefix + String.fromCharCode(code + 1);
      }
      // بعد Z نبدأ رقم
      return prefix + '1';
    }

    // الحالة الافتراضية: نضيف رقم
    return value + '2';
  }

  function addMeasurement(projectId, data) {
    const db = _load();
    const p = db.projects.find(x => x.id === projectId);
    if (!p) return null;
    // إذا لم يُحدد pos يدوياً، نولّده تلقائيًا
    const pos = (data.pos && data.pos.trim()) ? data.pos.trim() : nextPos(p);
    const row = Object.assign({ pos }, data, { pos });
    p.measurements.push(row);
    _persist();
    return row;
  }

  function updateMeasurement(projectId, oldPos, patch) {
    const db = _load();
    const p = db.projects.find(x => x.id === projectId);
    if (!p) return null;
    const row = p.measurements.find(m => m.pos === oldPos);
    if (!row) return null;
    Object.assign(row, patch);
    // إذا تم تغيير رقم الشباك
    if (patch.pos && patch.pos.trim()) {
      row.pos = patch.pos.trim();
    }
    _persist();
    return row;
  }

  function deleteMeasurement(projectId, pos) {
    const db = _load();
    const p = db.projects.find(x => x.id === projectId);
    if (!p) return;
    p.measurements = p.measurements.filter(m => m.pos !== pos);
    // لا نعيد الترقيم تلقائياً لأن المستخدم قد يكون أدخل أرقامًا مخصصة
    _persist();
  }

  function duplicateMeasurement(projectId, pos) {
    const db = _load();
    const p = db.projects.find(x => x.id === projectId);
    if (!p) return null;
    const row = p.measurements.find(m => m.pos === pos);
    if (!row) return null;
    const copy = Object.assign({}, row, { pos: nextPos(p) });
    p.measurements.push(copy);
    _persist();
    return copy;
  }

  // ---------------- الأنواع ----------------
  function listTypes() { return _load().settings.types; }
  function addType(name) {
    const db = _load();
    if (!db.settings.types.includes(name)) db.settings.types.push(name);
    _persist();
  }
  function renameType(oldName, newName) {
    const db = _load();
    const i = db.settings.types.indexOf(oldName);
    if (i > -1) db.settings.types[i] = newName;
    db.projects.forEach(p => p.measurements.forEach(m => { if (m.type === oldName) m.type = newName; }));
    _persist();
  }
  function deleteType(name) {
    const db = _load();
    db.settings.types = db.settings.types.filter(t => t !== name);
    _persist();
  }

  // ---------------- النماذج ----------------
  function listModels() { return _load().models; }
  function addModel(code, imageBase64) {
    const db = _load();
    const model = { id: uid('m'), code, image: imageBase64 };
    db.models.push(model);
    _persist();
    return model;
  }
  function updateModel(id, patch) {
    const db = _load();
    const m = db.models.find(x => x.id === id);
    if (!m) return null;
    Object.assign(m, patch);
    _persist();
    return m;
  }
  function deleteModel(id) {
    const db = _load();
    db.models = db.models.filter(x => x.id !== id);
    _persist();
  }

  // ---------------- الثيم ----------------
  function getTheme() { return _load().settings.theme; }
  function setTheme(theme) {
    const db = _load();
    db.settings.theme = theme;
    _persist();
  }

  // ---------------- النسخ الاحتياطي ----------------
  function exportJSON() {
    return JSON.stringify(_load(), null, 2);
  }
  function importJSON(jsonStr, mode = 'merge') {
    const incoming = JSON.parse(jsonStr);
    const db = _load();
    if (mode === 'replace') {
      cache = incoming;
    } else {
      // دمج: إضافة المشاريع/النماذج/الأنواع غير الموجودة بنفس المعرف
      const existingProjIds = new Set(db.projects.map(p => p.id));
      (incoming.projects || []).forEach(p => { if (!existingProjIds.has(p.id)) db.projects.push(p); });
      const existingModelIds = new Set(db.models.map(m => m.id));
      (incoming.models || []).forEach(m => { if (!existingModelIds.has(m.id)) db.models.push(m); });
      (incoming.settings?.types || []).forEach(t => { if (!db.settings.types.includes(t)) db.settings.types.push(t); });
    }
    _persist();
  }

  return {
    getDB, save, uid,
    listProjects, getProject, addProject, updateProject, deleteProject,
    addMeasurement, updateMeasurement, deleteMeasurement, duplicateMeasurement, nextPos,
    listTypes, addType, renameType, deleteType,
    listModels, addModel, updateModel, deleteModel,
    getTheme, setTheme,
    exportJSON, importJSON
  };
})();
