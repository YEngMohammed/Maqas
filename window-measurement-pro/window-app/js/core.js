/* ============================================================
   core.js — التوجيه المشترك، الوضع الليلي/النهاري، أدوات عامة
   ============================================================ */

const Toast = (() => {
  function ensureHost() {
    let host = document.getElementById('toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toast-host';
      document.body.appendChild(host);
    }
    return host;
  }
  function show(message, type = 'default') {
    const host = ensureHost();
    const el = document.createElement('div');
    el.className = 'toast' + (type !== 'default' ? ' ' + type : '');
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
  return { show };
})();
window.Toast = Toast;

const Core = (() => {
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function initTheme() {
    const theme = Storage.getTheme();
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = Storage.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    Storage.setTheme(next);
    applyTheme(next);
    document.querySelectorAll('.switch[data-theme-switch]').forEach(s => s.classList.toggle('on', next === 'dark'));
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }

  function fmtDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return iso; }
  }

  function fmtTime(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  }

  function renderTopbar(mountId, opts = {}) {
    const el = document.getElementById(mountId);
    if (!el) return;
    const backHtml = opts.showBack
      ? `<a class="back-link" href="index.html">→ رجوع لقائمة المشاريع</a>`
      : `<div class="brand"><div class="mark">🪟</div><span>إدارة مقاسات الشبابيك</span></div>`;
    el.innerHTML = `
      ${backHtml}
      <div class="tools">
        <button class="icon-btn" id="theme-toggle-btn" title="الوضع الليلي/النهاري">🌗</button>
        <a class="icon-btn" href="settings.html" title="الإعدادات">⚙️</a>
      </div>
    `;
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
  }


  function registerPWA() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  return { initTheme, toggleTheme, applyTheme, qs, esc, fmtDate, fmtTime, renderTopbar, fileToBase64, downloadBlob, registerPWA };
})();
window.Core = Core;

// تطبيق الثيم فوراً قبل رسم الصفحة لتفادي وميض اللون
Core.initTheme();
Core.registerPWA();
