const fs = require('fs');
let content = fs.readFileSync('vylex.html', 'utf8');

// 1. Add workspaceMembers to APP
content = content.replace(
  "  users:[],\n  groups:[],",
  "  users:[],\n  groups:[],\n  workspaceMembers:[],"
);

// 2. Insert new Modals (after userModal)
const newModals = `
<div class="modal-overlay" id="passwordModal" onclick="closeModal('passwordModal',event)">
  <div class="modal" onclick="event.stopPropagation()" style="max-width:400px">
    <div class="modal-header">
      <div class="modal-title"><i class="fa fa-key"></i> <span data-i18n="users.change_pass">Cambiar Contraseña</span></div>
      <button class="modal-close" onclick="closeModal('passwordModal')"><i class="fa fa-xmark"></i></button>
    </div>
    <div style="padding:20px">
      <input type="hidden" id="pmUserId">
      <div style="margin-bottom:15px">
        <label data-i18n="users.new_pass">Nueva Contraseña:</label>
        <input type="password" id="pmNewPass" style="width:100%;padding:10px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;color:#fff;margin-top:5px" placeholder="Mínimo 6 caracteres">
      </div>
      <button class="btn-primary" style="width:100%" onclick="submitPasswordReset()" data-i18n="users.save_pass">Guardar Contraseña</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="responsableModal" onclick="closeModal('responsableModal',event)">
  <div class="modal" onclick="event.stopPropagation()" style="max-width:400px">
    <div class="modal-header">
      <div class="modal-title"><i class="fa fa-user-check"></i> <span data-i18n="modal.select_consultant">Seleccionar Responsable</span></div>
      <button class="modal-close" onclick="closeModal('responsableModal')"><i class="fa fa-xmark"></i></button>
    </div>
    <div style="padding:20px">
      <input type="hidden" id="rmAction">
      <div style="margin-bottom:15px">
        <label data-i18n="modal.consultant_member">Consultor / Miembro:</label>
        <select id="rmSelect" style="width:100%;padding:10px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;color:#fff;margin-top:5px">
          <option value="">Cargando...</option>
        </select>
      </div>
      <button class="btn-primary" style="width:100%" onclick="submitResponsable()">Asignar</button>
    </div>
  </div>
</div>
`;

content = content.replace(
  /(<div class="modal-overlay" id="userModal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
  "$1\n" + newModals
);

// 3. Update resetUserPassword to use the modal
const oldPasswordReset = `async function resetUserPassword(id) {
  if (APP.currentUser?.role !== 'admin') return;
  const newPass = prompt("Introduce la nueva contraseña para este usuario:");
  if (!newPass) return;
  if (newPass.length < 6) return toast('warning', 'Mínimo 6 caracteres');
  try {
    const res = await fetch(\`/api/users/\${id}/password\`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ password: newPass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al cambiar clave');
    toast('success', 'Contraseña actualizada correctamente');
  } catch(e) { toast('error', e.message); }
}`;

const newPasswordReset = `function resetUserPassword(id) {
  if (APP.currentUser?.role !== 'admin') { toast('error', t('toast.no_permissions','Sin permisos')); return; }
  document.getElementById('pmUserId').value = id;
  document.getElementById('pmNewPass').value = '';
  openModal('passwordModal');
}

async function submitPasswordReset() {
  const id = document.getElementById('pmUserId').value;
  const newPass = document.getElementById('pmNewPass').value.trim();
  if (newPass.length < 6) return toast('warning', 'Mínimo 6 caracteres');
  try {
    const res = await fetch(\`/api/users/\${id}/password\`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ password: newPass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al cambiar clave');
    toast('success', 'Contraseña actualizada correctamente');
    closeModal('passwordModal');
  } catch(e) { toast('error', e.message); }
}`;

content = content.replace(oldPasswordReset, newPasswordReset);

// 4. Update bulkAssignConsultant to use modal
const oldBulkAssign = `// Asignar responsable masivo
function bulkAssignConsultant(){
  const responsable=prompt('Ingresa el nombre del responsable:');
  if(!responsable)return;
  
  const selected=Object.values(APP.bulkSelected).filter(id=>id);
  selected.forEach(id=>{
    const c=APP.data.find(cl=>cl.id===id);
    if(c)c.rCap=responsable;
  });
  
  localStorage.setItem('holaData',JSON.stringify({data:APP.data,ts:Date.now(),meta:APP.apiMeta}));
  renderAll(APP.filteredByDate);
  toast('success',\`✅ Responsable asignado a \${selected.length} cliente(s)\`);
}`;

const newBulkAssign = `// Asignar responsable masivo
function bulkAssignConsultant(){
  const selected=Object.values(APP.bulkSelected).filter(id=>id);
  if(selected.length===0){
    toast('warning','Selecciona al menos un cliente');
    return;
  }
  document.getElementById('rmAction').value = 'bulkAssigment';
  openModal('responsableModal');
}

function submitResponsable() {
  const action = document.getElementById('rmAction').value;
  const responsable = document.getElementById('rmSelect').value;
  if(!responsable) return toast('warning', 'Selecciona un miembro');

  if(action === 'bulkAssigment') {
    const selected=Object.values(APP.bulkSelected).filter(id=>id);
    selected.forEach(id=>{
      const c=APP.data.find(cl=>cl.id===id);
      if(c)c.rCap=responsable;
    });
    
    localStorage.setItem('holaData',JSON.stringify({data:APP.data,ts:Date.now(),meta:APP.apiMeta}));
    renderAll(APP.filteredByDate);
    toast('success',\`✅ Responsable asignado a \${selected.length} cliente(s)\`);
    closeModal('responsableModal');
  } else if (action === 'edicionMasiva') {
     document.getElementById('edicionMasivaValor').value = responsable;
     aplicarEdicionMasiva();
     closeModal('responsableModal');
  }
}`;
content = content.replace(oldBulkAssign, newBulkAssign);

// 5. Build dynamic selects in Edicion Masiva
const edicionMasivaInputBlock = `        <input id="edicionMasivaValor" style="width:100%;padding:8px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;color:var(--text);margin-top:6px" placeholder="Escribe el nuevo valor...">`;
const edicionMasivaNewBlock = `        <div id="edicionMasivaInputWrapper">
          <input id="edicionMasivaValor" style="width:100%;padding:8px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;color:var(--text);margin-top:6px" placeholder="Escribe el nuevo valor...">
        </div>`;
content = content.replace(edicionMasivaInputBlock, edicionMasivaNewBlock);

const showBulkEditScript = `function showBulkEditModal(){
  const count=Object.keys(APP.bulkSelected).filter(id=>APP.bulkSelected[id]).length;
  if(count===0){
    toast('warning','Selecciona al menos un cliente');
    return;
  }
  
  document.getElementById('edicionMasivaCount').textContent=count;
  document.getElementById('edicionMasivaCountBtn').textContent=count;
  document.getElementById('edicionMasivaField').value='';
  document.getElementById('edicionMasivaValor').value='';
  
  showModal('edicionMasivaModal');
}`;

const showBulkEditScriptNew = `function handleEdicionMasivaFieldChange() {
  const field=document.getElementById('edicionMasivaField').value;
  const wrapper=document.getElementById('edicionMasivaInputWrapper');
  const isResponsable = ['rKickoff','rVer','rCap','rGoLive','rAct','rVenta'].includes(field);
  
  if(isResponsable) {
    wrapper.innerHTML = \`<select id="edicionMasivaValor" style="width:100%;padding:8px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;color:var(--text);margin-top:6px">
      <option value="">Selecciona Miembro...</option>
      \${APP.workspaceMembers.map(m=>\`<option value="\${m.username}">\${m.username}</option>\`).join('')}
    </select>\`;
  } else {
    wrapper.innerHTML = \`<input id="edicionMasivaValor" style="width:100%;padding:8px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;color:var(--text);margin-top:6px" placeholder="Escribe el nuevo valor...">\`;
  }
}

function showBulkEditModal(){
  const count=Object.keys(APP.bulkSelected).filter(id=>APP.bulkSelected[id]).length;
  if(count===0){
    toast('warning','Selecciona al menos un cliente');
    return;
  }
  
  document.getElementById('edicionMasivaCount').textContent=count;
  document.getElementById('edicionMasivaCountBtn').textContent=count;
  document.getElementById('edicionMasivaField').value='';
  handleEdicionMasivaFieldChange();
  
  showModal('edicionMasivaModal');
}`;
// We need to add onchange="handleEdicionMasivaFieldChange()" to the select
content = content.replace(
  '<select id="edicionMasivaField" style="width:100%;padding:8px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;color:var(--text);margin-top:6px">',
  '<select id="edicionMasivaField" style="width:100%;padding:8px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;color:var(--text);margin-top:6px" onchange="handleEdicionMasivaFieldChange()">'
);
content = content.replace(showBulkEditScript, showBulkEditScriptNew);

// 6. Load Members on Start
const loadMembersScript = `async function loadClickUpMembers() {
  try {
    const res = await fetch('/api/clickup/members', { headers: getAuthHeader() });
    if(res.ok) {
      const data = await res.json();
      APP.workspaceMembers = data.members || [];
      const opts = '<option value="">Selecciona Miembro...</option>' + APP.workspaceMembers.map(m=>\`<option value="\${m.username}">\${m.username}</option>\`).join('');
      const rmSelect = document.getElementById('rmSelect');
      if(rmSelect) rmSelect.innerHTML = opts;
      
      const rptCons = document.getElementById('rptConsultor');
      if(rptCons) rptCons.innerHTML = '<option value="">Todos</option>' + opts;
    }
  } catch(e) {
    console.error('Error fetching clickup members:', e);
  }
}
`;

content = content.replace("window.addEventListener('load',()=>{\n", loadMembersScript + "\nwindow.addEventListener('load',()=>{\n  loadClickUpMembers();\n");

fs.writeFileSync('vylex.html', content);
console.log('Update finished.');
