/* ============================================================
   export.js — محرك التصدير: Excel / PDF المقاسات / كراسة النماذج
   ============================================================ */

const Exporter = (() => {
  const COLS = ['رقم الشباك','العرض(سم)','الارتفاع(سم)','جالس يمين(سم)','جالس شمال(سم)','العدد','المساحة(م²)','الاتجاه','النوع','رقم النموذج','ملاحظات'];

  function rowToArray(m) {
    return [m.pos, m.width, m.height, m.sillRight, m.sillLeft, m.qty, Number(m.area).toFixed(2), m.orientation, m.type, m.modelCode || '', m.notes || ''];
  }

  // ---------------- Excel ----------------
  function exportExcel(project) {
    if (typeof XLSX === 'undefined') { Toast.show('تعذر تحميل مكتبة Excel — تحقق من الاتصال', 'danger'); return; }
    const wb = XLSX.utils.book_new();

    const header = [
      ['بيانات المشروع'],
      ['اسم العميل', project.client],
      ['الموقع', project.location],
      ['رقم التواصل', project.phone],
      ['تاريخ الإنشاء', Core.fmtDate(project.createdAt)],
      [],
      COLS
    ];
    const rows = project.measurements.map(rowToArray);
    const totalQty = project.measurements.reduce((s, m) => s + (Number(m.qty) || 0), 0);
    const totalArea = project.measurements.reduce((s, m) => s + (Number(m.area) || 0), 0).toFixed(2);
    const totalsRow = ['الإجمالي العام', '', '', '', '', totalQty, totalArea, '', '', '', ''];

    const ws = XLSX.utils.aoa_to_sheet([...header, ...rows, totalsRow]);
    ws['!cols'] = COLS.map(() => ({ wch: 15 }));
    XLSX.utils.book_append_sheet(wb, ws, 'المقاسات');
    XLSX.writeFile(wb, `${project.client}-مقاسات.xlsx`);
    Toast.show('تم تصدير ملف Excel', 'success');
  }

  // ---------------- PDF المقاسات (أفقي) ----------------
  function exportMeasurementsPDF(project) {
    if (typeof html2pdf === 'undefined') { Toast.show('تعذر تحميل مكتبة PDF — تحقق من الاتصال', 'danger'); return; }
    const totalQty = project.measurements.reduce((s, m) => s + (Number(m.qty) || 0), 0);
    const totalArea = project.measurements.reduce((s, m) => s + (Number(m.area) || 0), 0).toFixed(2);

    const container = document.createElement('div');
    container.style.cssText = 'direction:rtl; font-family:Tajawal,Arial,sans-serif; padding:24px; color:#101826;';
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #0B5FFF; padding-bottom:14px; margin-bottom:16px;">
        <div>
          <div style="font-size:22px; font-weight:900;">تقرير مقاسات المشروع</div>
          <div style="font-size:13px; color:#4B5768; margin-top:4px;">${Core.esc(project.client)} — ${Core.esc(project.location)}</div>
        </div>
        <div style="text-align:left; font-size:12px; color:#4B5768;">
          <div>التاريخ: ${Core.fmtDate(new Date().toISOString())}</div>
          <div>الوقت: ${Core.fmtTime(new Date().toISOString())}</div>
        </div>
      </div>
      <table style="width:100%; border-collapse:collapse; font-size:12px;">
        <thead>
          <tr>${COLS.map(c => `<th style="background:#E7EFFF; color:#0B5FFF; padding:8px 6px; border:1px solid #DCE1E7; font-weight:800;">${c}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${project.measurements.map(m => `<tr>${rowToArray(m).map(v => `<td style="padding:7px 6px; border:1px solid #DCE1E7; text-align:center;">${Core.esc(v)}</td>`).join('')}</tr>`).join('')}
        </tbody>
        <tfoot>
          <tr style="background:#E7EFFF; font-weight:900; color:#0B5FFF;">
            <td colspan="5" style="padding:9px 6px; border:1px solid #DCE1E7; text-align:center;">الإجمالي العام</td>
            <td style="padding:9px 6px; border:1px solid #DCE1E7; text-align:center;">${totalQty}</td>
            <td style="padding:9px 6px; border:1px solid #DCE1E7; text-align:center;">${totalArea} م²</td>
            <td colspan="4" style="border:1px solid #DCE1E7;"></td>
          </tr>
        </tfoot>
      </table>
    `;

    html2pdf().set({
      margin: 10,
      filename: `${project.client}-تقرير-مقاسات.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    }).from(container).save().then(() => Toast.show('تم تصدير تقرير PDF', 'success'));
  }

  // ---------------- PDF كراسة النماذج (شبكة 2x2) ----------------
  function exportModelsBookletPDF(project) {
    if (typeof html2pdf === 'undefined') { Toast.show('تعذر تحميل مكتبة PDF — تحقق من الاتصال', 'danger'); return; }
    const usedCodes = [...new Set(project.measurements.map(m => m.modelCode).filter(Boolean))];
    const allModels = Storage.listModels();
    const usedModels = usedCodes.map(code => allModels.find(m => m.code === code)).filter(Boolean);

    if (usedModels.length === 0) {
      Toast.show('لا توجد نماذج مستخدمة في هذا المشروع', 'danger');
      return;
    }

    const pages = [];
    for (let i = 0; i < usedModels.length; i += 4) pages.push(usedModels.slice(i, i + 4));

    const container = document.createElement('div');
    container.style.cssText = 'direction:rtl; font-family:Tajawal,Arial,sans-serif; color:#101826;';
    container.innerHTML = pages.map((page, pi) => `
      <div style="padding:24px; ${pi > 0 ? 'page-break-before: always;' : ''}">
        <div style="font-size:18px; font-weight:900; border-bottom:3px solid #0B5FFF; padding-bottom:10px; margin-bottom:16px;">
          كراسة نماذج التصميم — ${Core.esc(project.client)}
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          ${page.map(m => `
            <div style="border:1px solid #DCE1E7; border-radius:10px; overflow:hidden;">
              <img src="${m.image}" style="width:100%; height:220px; object-fit:contain; background:#F3F5F7; display:block;">
              <div style="padding:10px; text-align:center; font-weight:800; font-size:14px; background:#E7EFFF; color:#0B5FFF;">${Core.esc(m.code)}</div>
            </div>`).join('')}
        </div>
      </div>
    `).join('');

    html2pdf().set({
      margin: 10,
      filename: `${project.client}-كراسة-نماذج.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(container).save().then(() => Toast.show('تم تصدير كراسة النماذج', 'success'));
  }

  return { exportExcel, exportMeasurementsPDF, exportModelsBookletPDF };
})();
window.Exporter = Exporter;
