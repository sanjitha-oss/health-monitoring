// patient.js - handle save/load/preview/print/download for patient summary
(function(){
  const ids = ['name','dob','nhs','gender','phone','admission','address','gp','allergies','notes',
               'bp_sys','bp_dia','hr','rr','temp','spo2','weight','height'];
  const get = id => document.getElementById(id);
  const formatDate = d => d ? new Date(d).toLocaleDateString() : '';

  function readForm(){
    const obj = {};
    ids.forEach(id => { const el = get(id); obj[id] = el ? el.value : ''; });
    return obj;
  }

  function writeForm(obj){
    ids.forEach(id => { const el = get(id); if(el) el.value = (obj && obj[id]) || ''; });
    renderPreview();
  }

  // patients store: { nhsOrId: patientObject }
  function loadPatients(){
    try{
      const raw = localStorage.getItem('patients');
      if(raw) return JSON.parse(raw);
    }catch(e){ /* ignore */ }
    // migrate single patientSummary to patients if present
    const single = localStorage.getItem('patientSummary');
    if(single){
      try{
        const p = JSON.parse(single);
        const key = (p.nhs && p.nhs.trim()) || (p.name && p.name.trim()) || 'unknown';
        const obj = {};
        obj[key] = p;
        localStorage.setItem('patients', JSON.stringify(obj));
        localStorage.removeItem('patientSummary');
        return obj;
      }catch(e){}
    }
    return {};
  }

  function savePatients(map){ localStorage.setItem('patients', JSON.stringify(map)); }

  function renderPreview(){
    const p = readForm();
    const preview = document.getElementById('previewArea');
    const generatedDate = document.getElementById('generatedDate');
    generatedDate.innerText = new Date().toLocaleString();

    preview.innerHTML = `
      <div style="border:1px solid #e6eefb;padding:12px;border-radius:6px">
        <div class="summary-row"><div class="summary-label">Name</div><div class="summary-value">${escapeHtml(p.name)||'N/A'}</div></div>
        <div class="summary-row"><div class="summary-label">DOB</div><div class="summary-value">${escapeHtml(formatDate(p.dob))||'N/A'}</div></div>
        <div class="summary-row"><div class="summary-label">NHS/ID</div><div class="summary-value">${escapeHtml(p.nhs)||'N/A'}</div></div>
        <div class="summary-row"><div class="summary-label">Gender</div><div class="summary-value">${escapeHtml(p.gender)||'N/A'}</div></div>
        <div class="summary-row"><div class="summary-label">Phone</div><div class="summary-value">${escapeHtml(p.phone)||'N/A'}</div></div>
        <div class="summary-row"><div class="summary-label">GP</div><div class="summary-value">${escapeHtml(p.gp)||'N/A'}</div></div>
        <div style="margin-top:8px"><div class="summary-label">Address</div><div class="summary-value">${escapeHtml(p.address)||'N/A'}</div></div>
        <div style="margin-top:8px"><div class="summary-label">Allergies</div><div class="summary-value">${escapeHtml(p.allergies)||'None'}</div></div>
        <div style="margin-top:8px"><div class="summary-label">Notes</div><div class="summary-value">${escapeHtml(p.notes)||'-'}</div></div>
      </div>`;
  }

  function escapeHtml(s){
    if(!s) return '';
    return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
  }

  // Buttons
  const saveBtn = document.getElementById('saveBtn');
  const loadBtn = document.getElementById('loadBtn');
  const lookupBtn = document.getElementById('lookupBtn');
  const lookupInput = document.getElementById('lookupInput');
  const newBtn = document.getElementById('newBtn');
  const printBtn = document.getElementById('printBtn');
  const pdfBtn = document.getElementById('pdfBtn');
  const jpgBtn = document.getElementById('jpgBtn');
  const clearBtn = document.getElementById('clearBtn');

  // Save patient into 'patients' map using NHS or name as key
  if(saveBtn) saveBtn.addEventListener('click', ()=>{
    const p = readForm();
    const patients = loadPatients();
    const key = (p.nhs && p.nhs.trim()) || (p.name && p.name.trim());
    if(!key){ alert('Please enter Name or NHS/ID to save'); return; }

    // if it's a new patient (not present), ensure vitals provided
    const exists = !!patients[key];
    if(!exists){
      const requiredVitals = ['bp_sys','bp_dia','hr','temp','spo2'];
      const missing = requiredVitals.filter(id => !p[id] || p[id].toString().trim() === '');
      if(missing.length){ alert('New patient - please enter vitals: '+missing.join(', ')); return; }
    }

    patients[key] = p;
    savePatients(patients);
    document.getElementById('statusMsg').innerText = exists ? 'Patient updated' : 'New patient saved';
    alert('Patient saved locally');
  });

  if(loadBtn) loadBtn.addEventListener('click', ()=>{
    const patients = loadPatients();
    const keys = Object.keys(patients);
    if(keys.length === 1){ writeForm(patients[keys[0]]); document.getElementById('statusMsg').innerText='Loaded saved patient'; }
    else if(keys.length > 1) alert('Multiple patients saved. Use lookup to find a specific patient.');
    else alert('No saved patient found');
  });

  if(lookupBtn) lookupBtn.addEventListener('click', ()=>{
    const q = (lookupInput.value||'').trim();
    if(!q){ alert('Enter NHS number or full name to lookup'); return; }
    const patients = loadPatients();
    // prefer exact NHS match
    if(patients[q]){ writeForm(patients[q]); showExisting(); return; }
    // try case-insensitive name match
    const matchKey = Object.keys(patients).find(k => k.toLowerCase() === q.toLowerCase());
    if(matchKey){ writeForm(patients[matchKey]); showExisting(); return; }

    // no match -> new patient flow
    showNewPatientFlow(q);
  });

  if(newBtn) newBtn.addEventListener('click', ()=>{ // clear and show new
    ids.forEach(id=>{ const el=get(id); if(el) el.value=''; });
    showNewPatientFlow('');
  });

  if(clearBtn) clearBtn.addEventListener('click', ()=>{
    if(confirm('Clear form?')){ ids.forEach(id=>{ const el=get(id); if(el) el.value=''; renderPreview(); } ); document.getElementById('statusMsg').innerText=''; hideVitals(); }
  });

  if(printBtn) printBtn.addEventListener('click', ()=>{ renderPreview(); window.print(); });

  if(pdfBtn) pdfBtn.addEventListener('click', ()=>{
    renderPreview();
    const element = document.getElementById('patientCard');
    const name = (document.getElementById('name')||{}).value || 'patient';
    const opt = {
      margin: 0.5,
      filename: `patient_summary_${name.replace(/\s+/g,'_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    // html2pdf available via CDN included in page
    html2pdf().set(opt).from(element).save();
  });

  if(jpgBtn) jpgBtn.addEventListener('click', ()=>{
    renderPreview();
    const el = document.getElementById('patientCard');
    // html2canvas is bundled in html2pdf bundle; but attempt to use it directly if available
    const canvasPromise = window.html2canvas ? html2canvas(el, {scale:2}) : html2canvas(el, {scale:2});
    canvasPromise.then(canvas => {
      const link = document.createElement('a');
      link.download = 'patient_summary.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    }).catch(err => { alert('Failed to generate image: '+err); });
  });

  // render preview live
  ids.forEach(id => { const el=get(id); if(el) el.addEventListener('input', renderPreview); });

  // initialize form from saved data if present
  function showExisting(){
    document.getElementById('statusMsg').innerText = 'Existing patient loaded';
    hideVitals();
    renderPreview();
  }

  function showNewPatientFlow(q){
    document.getElementById('statusMsg').innerText = q ? `New patient: ${q} — please complete details and vitals` : 'New patient — please complete details and vitals';
    // populate lookup value into name or nhs depending on format (numbers likely nhs)
    if(q){ if(/^\d+$/.test(q.replace(/\s+/g,''))) get('nhs').value = q; else get('name').value = q; }
    showVitals();
    renderPreview();
  }

  function showVitals(){ document.querySelectorAll('.vitals').forEach(el=>el.style.display='block'); }
  function hideVitals(){ document.querySelectorAll('.vitals').forEach(el=>el.style.display='none'); }

  (function init(){
    const patients = loadPatients();
    const keys = Object.keys(patients);
    if(keys.length === 1){ writeForm(patients[keys[0]]); document.getElementById('statusMsg').innerText='Loaded saved patient'; hideVitals(); }
    else renderPreview();
  })();

})();
