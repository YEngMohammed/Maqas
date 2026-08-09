

```js
// server/api.js
const express = require('express');
const router = express.Router();

// ============================================================
// 📦 مخازن البيانات الوهمية (In-Memory Mock Data)
// ============================================================

let projects = [
  {
    id: 'proj_001',
    client: 'أحمد محمد',
    location: 'الرياض - حي النرجس',
    phone: '0551234567',
    createdAt: '2026-07-15T10:30:00Z',
    updatedAt: '2026-08-01T14:20:00Z',
    notes: 'مشروع فيلا سكنية - طلب عاجل',
    status: 'قيد العمل',
    customFields: { color: 'أبيض', floor: 'الأول' },
    measurements: [
      {
        id: 'meas_001',
        pos: '1',
        width: 120,
        height: 150,
        sillRight: 10,
        sillLeft: 10,
        qty: 2,
        area: 3.6,
        orientation: 'شمال',
        type: 'نافذة',
        modelCode: 'W-2000',
        notes: 'نافذة مزدوجة',
        customFields: {}
      },
      {
        id: 'meas_002',
        pos: '2',
        width: 90,
        height: 210,
        sillRight: 5,
        sillLeft: 5,
        qty: 1,
        area: 1.89,
        orientation: 'شرق',
        type: 'باب',
        modelCode: 'D-1500',
        notes: 'باب شرفة',
        customFields: {}
      }
    ]
  },
  {
    id: 'proj_002',
    client: 'سارة العلي',
    location: 'جدة - حي الشاطئ',
    phone: '0509876543',
    createdAt: '2026-07-20T09:00:00Z',
    updatedAt: '2026-08-05T11:15:00Z',
    notes: 'مبنى تجاري - 5 طوابق',
    status: 'جديد',
    customFields: { buildingType: 'تجاري', floors: 5 },
    measurements: []
  },
  {
    id: 'proj_003',
    client: 'خالد السعودية',
    location: 'الدمام - حي النزهة',
    phone: '0534567890',
    createdAt: '2026-06-10T08:00:00Z',
    updatedAt: '2026-07-30T16:45:00Z',
    notes: 'مشروع مكتمل',
    status: 'مكتمل',
    customFields: {},
    measurements: [
      {
        id: 'meas_003',
        pos: '1',
        width: 150,
        height: 180,
        sillRight: 15,
        sillLeft: 15,
        qty: 4,
        area: 10.8,
        orientation: 'غرب',
        type: 'نافذة',
        modelCode: 'W-3000',
        notes: '',
        customFields: {}
      }
    ]
  }
];

let settings = {
  theme: 'light',
  sidebarCollapsed: false,
  customFields: [
    { id: 'cf_001', key: 'color', label: 'اللون', type: 'select', target: 'project', required: false, options: ['أبيض', 'أسود', 'رمادي', 'بني'], order: 1, visible: true },
    { id: 'cf_002', key: 'floor', label: 'الطابق', type: 'number', target: 'project', required: false, options: [], order: 2, visible: true },
    { id: 'cf_003', key: 'glassType', label: 'نوع الزجاج', type: 'select', target: 'measurement', required: false, options: ['عادي', 'مقوى', 'عازل'], order: 1, visible: true }
  ],
  windowTypes: [
    { id: 'wt_001', name: 'نافذة', icon: '🪟', color: '#3B82F6', defaultSillRight: 10, defaultSillLeft: 10 },
    { id: 'wt_002', name: 'باب', icon: '🚪', color: '#10B981', defaultSillRight: 5, defaultSillLeft: 5 },
    { id: 'wt_003', name: 'منور', icon: '🏠', color: '#F59E0B', defaultSillRight: 0, defaultSillLeft: 0 }
  ],
  defaultOrientation: 'شمال',
  currency: 'SAR',
  measurementUnit: 'cm'
};

let backups = [
  {
    id: 'backup_001',
    timestamp: '2026-08-08T20:00:00Z',
    size: 45678,
    projectCount: 3,
    data: ''
  }
];

// ============================================================
// 🛠️ دوال مساعدة
// ============================================================

function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

function calculateArea(width, height) {
  return (width * height) / 10000; // تحويل من سم² إلى م²
}

function filterProjects(projectsList, query) {
  let filtered = [...projectsList];

  // البحث النصي
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.client.toLowerCase().includes(searchLower) ||
      p.location.toLowerCase().includes(searchLower) ||
      p.notes.toLowerCase().includes(searchLower)
    );
  }

  // فلترة حسب الحالة
  if (query.status && query.status !== 'all') {
    filtered = filtered.filter(p => p.status === query.status);
  }

  // فلترة حسب التاريخ
  if (query.from) {
    filtered = filtered.filter(p => new Date(p.createdAt) >= new Date(query.from));
  }
  if (query.to) {
    filtered = filtered.filter(p => new Date(p.createdAt) <= new Date(query.to));
  }

  // الترتيب
  const sortField = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  filtered.sort((a, b) => {
    if (sortField === 'totalArea') {
      const areaA = a.measurements.reduce((sum, m) => sum + (m.area || 0), 0);
      const areaB = b.measurements.reduce((sum, m) => sum + (m.area || 0), 0);
      return (areaA - areaB) * sortOrder;
    }
    if (a[sortField] < b[sortField]) return -1 * sortOrder;
    if (a[sortField] > b[sortField]) return 1 * sortOrder;
    return 0;
  });

  return filtered;
}

// ============================================================
// 📋 Projects CRUD
// ============================================================

// GET /api/projects - جلب قائمة المشاريع
router.get('/projects', (req, res) => {
  try {
    const filtered = filterProjects(projects, req.query);

    // تجهيز البيانات للعرض (بدون measurements للـ list view)
    const result = filtered.map(p => ({
      ...p,
      totalArea: p.measurements.reduce((sum, m) => sum + (m.area || 0), 0),
      measurementCount: p.measurements.length
    }));

    res.json({
      success: true,
      data: result,
      total: result.length,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/projects/:id - جلب مشروع واحد
router.get('/projects/:id', (req, res) => {
  try {
    const project = projects.find(p => p.id === req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'المشروع غير موجود' });
    }

    const totalArea = project.measurements.reduce((sum, m) => sum + (m.area || 0), 0);

    res.json({
      success: true,
      data: {
        ...project,
        totalArea,
        measurementCount: project.measurements.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/projects - إنشاء مشروع جديد
router.post('/projects', (req, res) => {
  try {
    const { client, location, phone, notes, status, customFields } = req.body;

    if (!client || !location) {
      return res.status(400).json({ success: false, error: 'اسم العميل والموقع مطلوبان' });
    }

    const now = new Date().toISOString();
    const newProject = {
      id: generateId('proj'),
      client,
      location,
      phone: phone || '',
      createdAt: now,
      updatedAt: now,
      notes: notes || '',
      status: status || 'جديد',
      customFields: customFields || {},
      measurements: []
    };

    projects.unshift(newProject); // إضافة في البداية

    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/projects/:id - تحديث مشروع
router.put('/projects/:id', (req, res) => {
  try {
    const index = projects.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'المشروع غير موجود' });
    }

    const { client, location, phone, notes, status, customFields } = req.body;

    projects[index] = {
      ...projects[index],
      client: client !== undefined ? client : projects[index].client,
      location: location !== undefined ? location : projects[index].location,
      phone: phone !== undefined ? phone : projects[index].phone,
      notes: notes !== undefined ? notes : projects[index].notes,
      status: status !== undefined ? status : projects[index].status,
      customFields: customFields !== undefined ? customFields : projects[index].customFields,
      updatedAt: new Date().toISOString()
    };

    res.json({ success: true, data: projects[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/projects/:id - حذف مشروع
router.delete('/projects/:id', (req, res) => {
  try {
    const index = projects.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'المشروع غير موجود' });
    }

    const deleted = projects.splice(index, 1)[0];

    res.json({ success: true, message: 'تم حذف المشروع', data: { id: deleted.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// 📐 Measurements CRUD
// ============================================================

// POST /api/measurements - إضافة مقاس لمشروع
router.post('/measurements', (req, res) => {
  try {
    const { projectId, pos, width, height, sillRight, sillLeft, qty, orientation, type, modelCode, notes, customFields } = req.body;

    if (!projectId || !width || !height) {
      return res.status(400).json({ success: false, error: 'معرف المشروع والعرض والارتفاع مطلوبة' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'المشروع غير موجود' });
    }

    const area = calculateArea(width, height) * (qty || 1);

    const newMeasurement = {
      id: generateId('meas'),
      pos: pos || '',
      width: parseFloat(width),
      height: parseFloat(height),
      sillRight: parseFloat(sillRight) || 0,
      sillLeft: parseFloat(sillLeft) || 0,
      qty: parseInt(qty) || 1,
      area: Math.round(area * 100) / 100,
      orientation: orientation || settings.defaultOrientation,
      type: type || 'نافذة',
      modelCode: modelCode || '',
      notes: notes || '',
      customFields: customFields || {}
    };

    project.measurements.push(newMeasurement);
    project.updatedAt = new Date().toISOString();

    res.status(201).json({ success: true, data: newMeasurement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/measurements/:id - تحديث مقاس
router.put('/measurements/:id', (req, res) => {
  try {
    // البحث عن المقاس في جميع المشاريع
    let targetProject = null;
    let measurementIndex = -1;

    for (const project of projects) {
      const idx = project.measurements.findIndex(m => m.id === req.params.id);
      if (idx !== -1) {
        targetProject = project;
        measurementIndex = idx;
        break;
      }
    }

    if (!targetProject || measurementIndex === -1) {
      return res.status(404).json({ success: false, error: 'المقاس غير موجود' });
    }

    const { pos, width, height, sillRight, sillLeft, qty, orientation, type, modelCode, notes, customFields } = req.body;

    const current = targetProject.measurements[measurementIndex];
    const newWidth = width !== undefined ? parseFloat(width) : current.width;
    const newHeight = height !== undefined ? parseFloat(height) : current.height;
    const newQty = qty !== undefined ? parseInt(qty) : current.qty;
    const area = calculateArea(newWidth, newHeight) * newQty;

    targetProject.measurements[measurementIndex] = {
      ...current,
      pos: pos !== undefined ? pos : current.pos,
      width: newWidth,
      height: newHeight,
      sillRight: sillRight !== undefined ? parseFloat(sillRight) : current.sillRight,
      sillLeft: sillLeft !== undefined ? parseFloat(sillLeft) : current.sillLeft,
      qty: newQty,
      area: Math.round(area * 100) / 100,
      orientation: orientation !== undefined ? orientation : current.orientation,
      type: type !== undefined ? type : current.type,
      modelCode: modelCode !== undefined ? modelCode : current.modelCode,
      notes: notes !== undefined ? notes : current.notes,
      customFields: customFields !== undefined ? customFields : current.customFields
    };

    targetProject.updatedAt = new Date().toISOString();

    res.json({ success: true, data: targetProject.measurements[measurementIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/measurements/:id - حذف مقاس
router.delete('/measurements/:id', (req, res) => {
  try {
    let targetProject = null;
    let measurementIndex = -1;

    for (const project of projects) {
      const idx = project.measurements.findIndex(m => m.id === req.params.id);
      if (idx !== -1) {
        targetProject = project;
        measurementIndex = idx;
        break;
      }
    }

    if (!targetProject || measurementIndex === -1) {
      return res.status(404).json({ success: false, error: 'المقاس غير موجود' });
    }

    const deleted = targetProject.measurements.splice(measurementIndex, 1)[0];
    targetProject.updatedAt = new Date().toISOString();

    res.json({ success: true, message: 'تم حذف المقاس', data: { id: deleted.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// ⚙️ Settings
// ============================================================

// GET /api/settings - جلب الإعدادات
router.get('/settings', (req, res) => {
  try {
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/settings - تحديث الإعدادات
router.put('/settings', (req, res) => {
  try {
    const { theme, sidebarCollapsed, customFields, windowTypes, defaultOrientation, currency, measurementUnit } = req.body;

    settings = {
      ...settings,
      theme: theme !== undefined ? theme : settings.theme,
      sidebarCollapsed: sidebarCollapsed !== undefined ? sidebarCollapsed : settings.sidebarCollapsed,
      customFields: customFields !== undefined ? customFields : settings.customFields,
      windowTypes: windowTypes !== undefined ? windowTypes : settings.windowTypes,
      defaultOrientation: defaultOrientation !== undefined ? defaultOrientation : settings.defaultOrientation,
      currency: currency !== undefined ? currency : settings.currency,
      measurementUnit: measurementUnit !== undefined ? measurementUnit : settings.measurementUnit
    };

    res.json({ success: true, data: settings });
  } catch (error) {
    res