/* ============================================================
   projects.js — منطق شاشة قائمة المشاريع (index.html)
   ============================================================ */

const ProjectsPage = (() => {
  let searchTerm = '';

  function totalArea(project) {
    return project.measurements.reduce((s, m) => s + (Number(m.area) || 0), 0).toFixed(2);
  }

  function matches(project, term) {
    if (!term) return true;
    const t = term.trim();
    return project.client.includes(t) || (project.phone || '').includes(t);
  }

  function render() {
    const grid = document.getElementById('projects-grid');
    const projects = Storage.listProjects().filter(p => matches(p, searchTerm));

    if (projects.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="glyph">🗂️</div>
          <div class="title">${searchTerm ? 'لا توجد نتائج مطابقة' : 'لا توجد مشاريع بعد'}</div>
          <div>${searchTerm ? 'جرّب كلمة بحث أخرى' : 'اضغط "إضافة مشروع جديد" للبدء'}</div>
        </div>`;
      return;
    }

    grid.innerHTML = projects.map(p => `
      <div class="project-card" data-id="${p.id}">
        <div class="top">
          <div>
            <div class="name">${Core.esc(p.client)}</div>
            <div class="loc">📍 ${Core.esc(p.location)}</div>
          </div>
          <span class="badge">${p.measurements.length} قطعة</span>
        </div>
        <div style="font-size:13px; color:var(--ink-soft);">☎️ ${Core.esc(p.phone)}</div>
        <div class="meta">
          <span>📅 ${Core.fmtDate(p.createdAt)}</span>
          <span>📐 <b>${totalArea(p)}</b> م²</span>
        </div>
        <div class="actions">
          <button class="btn btn-primary btn-sm act-open">فتح المشروع</button>
          <button class="btn btn-outline btn-sm act-edit">تعديل</button>
          <button class="btn btn-danger btn-sm act-delete">حذف</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.project-card').forEach(card => {
      const id = card.dataset.id;
      card.querySelector('.act-open').addEventListener('click', () => {
        location.href = `editor.html?id=${encodeURIComponent(id)}`;
      });
      card.querySelector('.act-edit').addEventListener('click', () => openProjectModal(Storage.getProject(id)));
      card.querySelector('.act-delete').addEventListener('click', () => confirmDelete(id));
    });
  }

  function openProjectModal(existing = null) {
    const isEdit = !!existing;
    const html = `
      <div class="modal-backdrop" id="proj-modal">
        <div class="modal">
          <div class="modal-head">
            <h3>${isEdit ? 'تعديل بيانات المشروع' : 'إضافة مشروع جديد'}</h3>
            <button class="icon-btn" id="pm-close">✕</button>
          </div>
          <div class="modal-body">
            <div class="field">
              <label>اسم العميل *</label>
              <input id="pm-client" value="${isEdit ? Core.esc(existing.client) : ''}" placeholder="مثال: شركة الأمل">
            </div>
            <div class="field">
              <label>الموقع *</label>
              <input id="pm-location" value="${isEdit ? Core.esc(existing.location) : ''}" placeholder="مثال: الرياض - حي النرجس">
            </div>
            <div class="field">
              <label>رقم التواصل *</label>
              <input id="pm-phone" type="tel" value="${isEdit ? Core.esc(existing.phone) : ''}" placeholder="05xxxxxxxx">
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn btn-outline" id="pm-cancel">إلغاء</button>
            <button class="btn btn-primary" id="pm-save">${isEdit ? 'حفظ التعديلات' : 'إضافة المشروع'}</button>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('proj-modal');
    const close = () => modal.remove();
    modal.querySelector('#pm-close').addEventListener('click', close);
    modal.querySelector('#pm-cancel').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    modal.querySelector('#pm-save').addEventListener('click', () => {
      const client = document.getElementById('pm-client').value.trim();
      const location_ = document.getElementById('pm-location').value.trim();
      const phone = document.getElementById('pm-phone').value.trim();
      if (!client || !location_ || !phone) {
        Toast.show('يرجى تعبئة جميع الحقول الإجبارية', 'danger');
        return;
      }
      if (isEdit) {
        Storage.updateProject(existing.id, { client, location: location_, phone });
        Toast.show('تم تحديث بيانات المشروع', 'success');
      } else {
        Storage.addProject({ client, location: location_, phone });
        Toast.show('تم إضافة المشروع بنجاح', 'success');
      }
      close();
      render();
    });
  }

  function confirmDelete(id) {
    const p = Storage.getProject(id);
    const html = `
      <div class="modal-backdrop" id="del-modal">
        <div class="modal">
          <div class="modal-head"><h3>حذف المشروع</h3><button class="icon-btn" id="dm-close">✕</button></div>
          <div class="modal-body">
            <div class="confirm-text">هل أنت متأكد من حذف مشروع <b>${Core.esc(p.client)}</b>؟ سيتم حذف جميع المقاسات المرتبطة به ولا يمكن التراجع عن هذا الإجراء.</div>
          </div>
          <div class="modal-foot">
            <button class="btn btn-outline" id="dm-cancel">إلغاء</button>
            <button class="btn btn-danger" id="dm-confirm">حذف نهائياً</button>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('del-modal');
    const close = () => modal.remove();
    modal.querySelector('#dm-close').addEventListener('click', close);
    modal.querySelector('#dm-cancel').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    modal.querySelector('#dm-confirm').addEventListener('click', () => {
      Storage.deleteProject(id);
      Toast.show('تم حذف المشروع', 'success');
      close();
      render();
    });
  }

  function init() {
    Core.renderTopbar('topbar');
    document.getElementById('search-input').addEventListener('input', e => {
      searchTerm = e.target.value;
      render();
    });
    document.getElementById('add-project-btn').addEventListener('click', () => openProjectModal());
    render();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', ProjectsPage.init);
