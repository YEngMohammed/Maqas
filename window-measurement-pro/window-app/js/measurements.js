/* ============================================================
   measurements.js — منطق محرر المقاسات (editor.html)
   ============================================================ */

const MeasurementsPage = (() => {
  let project = null;
  let editingPos = null;      // pos الصف الجاري تعديله، أو null لإضافة جديد
  let pickedModelCode = '';

  const ORIENTATIONS = ['شمال', 'جنوب', 'شرق', 'غرب', 'داخلي', 'منور'];

  function calcArea(width, height, qty) {
    const w = Number(width) || 0, h = Number(height) || 0, q = Number(qty) || 0;
    return ((w * h * q) / 10000).toFixed(2);
  }

  function renderHeader() {
    document.getElementById('h-client').textContent = project.client;
    document.getElementById('h-location').textContent = project.location;
    document.getElementById('h-phone').textContent = project.phone;
    document.getElementById('h-date').textContent = Core.fmtDate(project.createdAt);
    document.getElementById('h-now').textContent = Core.fmtDate(new Date().toISOString()) + ' · ' + Core.fmtTime(new Date().toISOString());
  }

  function typeOptionsHTML(selected) {
    return Storage.listTypes().map(t =>
      `<option value="${Core.esc(t)}" ${t === selected ? 'selected' : ''}>${Core.esc(t)}</option>`
    ).join('');
  }

  function orientationOptionsHTML(selected) {
    return ORIENTATIONS.map(o =>
      `<option value="${o}" ${o === selected ? 'selected' : ''}>${o}</option>`
    ).join('');
  }

  function refreshTypeSelect() {
    const sel = document.getElementById('f-type');
    const current = sel.value;
    sel.innerHTML = typeOptionsHTML(current);
  }

  function resetForm() {
    editingPos = null;
    pickedModelCode = '';
    document.getElementById('measure-form').reset();
    document.getElementById('f-pos').value = '';
    document.getElementById('f-pos').placeholder = Storage.nextPos(project);
    document.getElementById('f-qty').value = 1;
    document.getElementById('f-model').value = '';
    document.getElementById('f-area').value = '0.00';
    document.getElementById('f-type').innerHTML = typeOptionsHTML();
    document.getElementById('f-orientation').innerHTML = orientationOptionsHTML();
    document.getElementById('form-mode-label').textContent = 'إضافة مقاس جديد';
    document.getElementById('cancel-edit-btn').style.display = 'none';
    document.getElementById('save-row-btn').textContent = 'حفظ / إضافة المقاس';
    updateArea();
  }

  function loadRowIntoForm(row) {
    editingPos = row.pos;
    pickedModelCode = row.modelCode || '';
    document.getElementById('f-pos').value = row.pos;
    document.getElementById('f-pos').placeholder = '';
    document.getElementById('f-width').value = row.width;
    document.getElementById('f-height').value = row.height;
    document.getElementById('f-sillRight').value = row.sillRight;
    document.getElementById('f-sillLeft').value = row.sillLeft;
    document.getElementById('f-qty').value = row.qty;
    document.getElementById('f-type').innerHTML = typeOptionsHTML(row.type);
    document.getElementById('f-orientation').innerHTML = orientationOptionsHTML(row.orientation);
    document.getElementById('f-model').value = row.modelCode || '';
    document.getElementById('f-notes').value = row.notes || '';
    document.getElementById('form-mode-label').textContent = `تعديل الشباك ${row.pos}`;
    document.getElementById('cancel-edit-btn').style.display = '';
    document.getElementById('save-row-btn').textContent = 'حفظ التعديل';
    updateArea();
    document.getElementById('measure-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateArea() {
    const w = document.getElementById('f-width').value;
    const h = document.getElementById('f-height').value;
    const q = document.getElementById('f-qty').value;
    document.getElementById('f-area').value = calcArea(w, h, q);
  }

  function collectFormData() {
    return {
      pos: document.getElementById('f-pos').value.trim(),
      width: Number(document.getElementById('f-width').value) || 0,
      height: Number(document.getElementById('f-height').value) || 0,
      sillRight: Number(document.getElementById('f-sillRight').value) || 0,
      sillLeft: Number(document.getElementById('f-sillLeft').value) || 0,
      qty: Number(document.getElementById('f-qty').value) || 1,
      area: Number(document.getElementById('f-area').value) || 0,
      orientation: document.getElementById('f-orientation').value,
      type: document.getElementById('f-type').value,
      modelCode: pickedModelCode,
      notes: document.getElementById('f-notes').value.trim()
    };
  }

  function saveRow() {
    const width = document.getElementById('f-width').value;
    const height = document.getElementById('f-height').value;
    if (!width || !height) {
      Toast.show('يرجى إدخال العرض والارتفاع', 'danger');
      return;
    }
    const data = collectFormData();
    if (editingPos) {
      Storage.updateMeasurement(project.id, editingPos, data);
      Toast.show('تم حفظ التعديل', 'success');
    } else {
      Storage.addMeasurement(project.id, data);
      Toast.show('تمت إضافة المقاس', 'success');
    }
    project = Storage.getProject(project.id);
    resetForm();
    renderTable();
  }

  function renderTable() {
    const tbody = document.getElementById('measure-tbody');
    const rows = project.measurements;

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
        <div class="glyph">📐</div>
        <div class="title">لا توجد مقاسات مضافة بعد</div>
        <div>استخدم النموذج أعلاه لإضافة أول قطعة</div>
      </div></td></tr>`;
    } else {
      tbody.innerHTML = rows.map(m => `
        <tr data-pos="${m.pos}">
          <td><span class="pos-chip">${m.pos}</span></td>
          <td class="mono">${m.width}</td>
          <td class="mono">${m.height}</td>
          <td class="mono">${m.sillRight}</td>
          <td class="mono">${m.sillLeft}</td>
          <td class="mono">${m.qty}</td>
          <td class="mono">${Number(m.area).toFixed(2)}</td>
          <td>${Core.esc(m.orientation)}</td>
          <td>${Core.esc(m.type)}</td>
          <td>${m.modelCode ? `<span class="pos-chip">${Core.esc(m.modelCode)}</span>` : '—'}</td>
          <td style="white-space:normal; max-width:160px;">${Core.esc(m.notes) || '—'}</td>
          <td>
            <div class="row-actions">
              <button class="icon-mini act-edit" title="تعديل">✏️</button>
              <button class="icon-mini act-dup" title="تكرار">⧉</button>
              <button class="icon-mini act-del" title="حذف">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // صف الإجمالي العام
    const totalQty = rows.reduce((s, m) => s + (Number(m.qty) || 0), 0);
    const totalArea = rows.reduce((s, m) => s + (Number(m.area) || 0), 0).toFixed(2);
    document.getElementById('measure-tfoot').innerHTML = `
      <tr>
        <td colspan="5">الإجمالي العام</td>
        <td class="mono">${totalQty}</td>
        <td class="mono">${totalArea} م²</td>
        <td colspan="5"></td>
      </tr>`;

    tbody.querySelectorAll('tr[data-pos]').forEach(tr => {
      const pos = tr.dataset.pos;
      tr.querySelector('.act-edit').addEventListener('click', () => {
        loadRowIntoForm(project.measurements.find(m => m.pos === pos));
      });
      tr.querySelector('.act-dup').addEventListener('click', () => {
        Storage.duplicateMeasurement(project.id, pos);
        project = Storage.getProject(project.id);
        renderTable();
        Toast.show('تم تكرار الصف', 'success');
      });
      tr.querySelector('.act-del').addEventListener('click', () => {
        Storage.deleteMeasurement(project.id, pos);
        project = Storage.getProject(project.id);
        if (editingPos === pos) resetForm();
        renderTable();
        Toast.show('تم حذف الصف', 'success');
      });
    });
  }

  // ---------------- نافذة اختيار النموذج ----------------
  function openModelPicker() {
    const models = Storage.listModels();
    const html = `
      <div class="modal-backdrop" id="model-picker">
        <div class="modal modal-lg">
          <div class="modal-head"><h3>اختيار نموذج التصميم</h3><button class="icon-btn" id="mp-close">✕</button></div>
          <div class="modal-body">
            ${models.length === 0
              ? `<div class="empty-state"><div class="glyph">🖼️</div><div class="title">لا توجد نماذج مضافة</div><div>أضف نماذج من صفحة الإعدادات أولاً</div></div>`
              : `<div class="model-grid">${models.map(m => `
                  <div class="model-card ${m.code === pickedModelCode ? 'selected' : ''}" data-code="${Core.esc(m.code)}">
                    <img src="${m.image}" alt="${Core.esc(m.code)}">
                    <div class="code">${Core.esc(m.code)}</div>
                  </div>`).join('')}</div>`}
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('model-picker');
    const close = () => modal.remove();
    modal.querySelector('#mp-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    modal.querySelectorAll('.model-card').forEach(card => {
      card.addEventListener('click', () => {
        pickedModelCode = card.dataset.code;
        document.getElementById('f-model').value = pickedModelCode;
        close();
      });
    });
  }

  function init() {
    const id = Core.qs('id');
    project = Storage.getProject(id);
    if (!project) {
      document.body.innerHTML = `<div class="page"><div class="empty-state">
        <div class="glyph">⚠️</div><div class="title">المشروع غير موجود</div>
        <a class="btn btn-primary" href="index.html" style="margin-top:10px;">العودة للقائمة</a>
      </div></div>`;
      return;
    }
    Core.renderTopbar('topbar', { showBack: true });
    renderHeader();
    resetForm();
    renderTable();

    ['f-width', 'f-height', 'f-qty'].forEach(id_ =>
      document.getElementById(id_).addEventListener('input', updateArea)
    );
    document.getElementById('f-model').addEventListener('click', openModelPicker);
    document.getElementById('save-row-btn').addEventListener('click', saveRow);
    document.getElementById('cancel-edit-btn').addEventListener('click', resetForm);

    document.getElementById('export-excel-btn').addEventListener('click', () => Exporter.exportExcel(project));
    document.getElementById('export-pdf-btn').addEventListener('click', () => Exporter.exportMeasurementsPDF(project));
    document.getElementById('export-models-btn').addEventListener('click', () => Exporter.exportModelsBookletPDF(project));
  }

  return { init, refreshTypeSelect };
})();

document.addEventListener('DOMContentLoaded', MeasurementsPage.init);
