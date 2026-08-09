/* ============================================================
   settings.js — منطق شاشة الإعدادات (settings.html)
   ============================================================ */

const SettingsPage = (() => {
  let activeTab = 'theme';

  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.settings-nav button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.settings-panel').forEach(p => p.style.display = (p.id === 'panel-' + tab) ? '' : 'none');
    if (tab === 'types') renderTypes();
    if (tab === 'models') renderModels();
  }

  // ---------------- المظهر ----------------
  function renderTheme() {
    const on = Storage.getTheme() === 'dark';
    document.getElementById('theme-switch').classList.toggle('on', on);
  }

  // ---------------- الأنواع ----------------
  function renderTypes() {
    const list = document.getElementById('types-list');
    const types = Storage.listTypes();
    if (types.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="glyph">🏷️</div><div class="title">لا توجد أنواع مضافة</div></div>`;
      return;
    }
    list.innerHTML = types.map(t => `
      <div class="type-row" data-name="${Core.esc(t)}">
        <span>${Core.esc(t)}</span>
        <div class="row-actions">
          <button class="icon-mini act-rename" title="تعديل">✏️</button>
          <button class="icon-mini act-del" title="حذف">🗑️</button>
        </div>
      </div>`).join('');

    list.querySelectorAll('.type-row').forEach(row => {
      const name = row.dataset.name;
      row.querySelector('.act-rename').addEventListener('click', () => {
        const newName = prompt('اسم النوع الجديد:', name);
        if (newName && newName.trim() && newName.trim() !== name) {
          Storage.renameType(name, newName.trim());
          renderTypes();
          Toast.show('تم تحديث النوع', 'success');
        }
      });
      row.querySelector('.act-del').addEventListener('click', () => {
        if (confirm(`حذف النوع "${name}"؟ لن يؤثر هذا على المقاسات الموجودة مسبقاً لكنه سيُزال من القائمة المستقبلية.`)) {
          Storage.deleteType(name);
          renderTypes();
          Toast.show('تم حذف النوع', 'success');
        }
      });
    });
  }

  function addType() {
    const input = document.getElementById('new-type-input');
    const name = input.value.trim();
    if (!name) return;
    Storage.addType(name);
    input.value = '';
    renderTypes();
    Toast.show('تمت إضافة النوع', 'success');
  }

  // ---------------- النماذج ----------------
  function renderModels() {
    const grid = document.getElementById('models-grid');
    const models = Storage.listModels();
    if (models.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="glyph">🖼️</div><div class="title">لا توجد نماذج مضافة</div></div>`;
      return;
    }
    grid.innerHTML = models.map(m => `
      <div class="model-card" data-id="${m.id}">
        <button class="rm" title="حذف">✕</button>
        <img src="${m.image}" alt="${Core.esc(m.code)}">
        <div class="code">${Core.esc(m.code)}</div>
      </div>`).join('');

    grid.querySelectorAll('.model-card').forEach(card => {
      const id = card.dataset.id;
      card.querySelector('.rm').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('حذف هذا النموذج؟')) {
          Storage.deleteModel(id);
          renderModels();
          Toast.show('تم حذف النموذج', 'success');
        }
      });
      card.addEventListener('click', () => {
        const model = Storage.listModels().find(x => x.id === id);
        const newCode = prompt('تعديل رقم النموذج:', model.code);
        if (newCode && newCode.trim() && newCode.trim() !== model.code) {
          Storage.updateModel(id, { code: newCode.trim() });
          renderModels();
        }
      });
    });
  }

  function openAddModelModal() {
    const html = `
      <div class="modal-backdrop" id="model-modal">
        <div class="modal">
          <div class="modal-head"><h3>إضافة نموذج جديد</h3><button class="icon-btn" id="mm-close">✕</button></div>
          <div class="modal-body">
            <div class="field">
              <label>رقم النموذج *</label>
              <input id="mm-code" placeholder="مثال: MD-101">
            </div>
            <div class="field">
              <label>صورة النموذج *</label>
              <input id="mm-image" type="file" accept="image/*">
            </div>
            <div id="mm-preview" style="display:none;">
              <img id="mm-preview-img" style="width:100%; max-height:180px; object-fit:contain; border-radius:8px; border:1px solid var(--line);">
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn btn-outline" id="mm-cancel">إلغاء</button>
            <button class="btn btn-primary" id="mm-save">إضافة</button>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('model-modal');
    const close = () => modal.remove();
    modal.querySelector('#mm-close').addEventListener('click', close);
    modal.querySelector('#mm-cancel').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    let base64Image = '';
    document.getElementById('mm-image').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      base64Image = await Core.fileToBase64(file);
      document.getElementById('mm-preview').style.display = '';
      document.getElementById('mm-preview-img').src = base64Image;
    });

    modal.querySelector('#mm-save').addEventListener('click', () => {
      const code = document.getElementById('mm-code').value.trim();
      if (!code || !base64Image) {
        Toast.show('يرجى إدخال رقم النموذج ورفع صورة', 'danger');
        return;
      }
      Storage.addModel(code, base64Image);
      close();
      renderModels();
      Toast.show('تمت إضافة النموذج', 'success');
    });
  }

  // ---------------- النسخ الاحتياطي ----------------
  function doExportJSON() {
    const json = Storage.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    Core.downloadBlob(blob, `backup-window-app-${Date.now()}.json`);
    Toast.show('تم تصدير النسخة الاحتياطية', 'success');
  }

  function doImportJSON(file, mode) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        Storage.importJSON(reader.result, mode);
        Toast.show('تم استيراد البيانات بنجاح', 'success');
        renderTypes();
        renderModels();
      } catch (e) {
        console.error(e);
        Toast.show('ملف غير صالح — تعذر الاستيراد', 'danger');
      }
    };
    reader.readAsText(file);
  }

  function init() {
    Core.renderTopbar('topbar', { showBack: true });

    document.querySelectorAll('.settings-nav button').forEach(b =>
      b.addEventListener('click', () => switchTab(b.dataset.tab))
    );
    switchTab('theme');
    renderTheme();

    document.getElementById('theme-switch').addEventListener('click', () => {
      Core.toggleTheme();
      renderTheme();
    });

    document.getElementById('add-type-btn').addEventListener('click', addType);
    document.getElementById('new-type-input').addEventListener('keydown', e => { if (e.key === 'Enter') addType(); });

    document.getElementById('add-model-btn').addEventListener('click', openAddModelModal);

    document.getElementById('export-json-btn').addEventListener('click', doExportJSON);
    document.getElementById('import-json-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const mode = confirm('اضغط "موافق" للدمج مع البيانات الحالية، أو "إلغاء" للاستبدال الكامل.') ? 'merge' : 'replace';
      doImportJSON(file, mode);
      e.target.value = '';
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', SettingsPage.init);
