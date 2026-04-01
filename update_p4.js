const fs = require('fs');
let html = fs.readFileSync('vylex.html', 'utf8');

// 1. Add Navigation Item
const navLoc = '<div class="nav-item" onclick="showSection(\'kanban\')"><i class="fa fa-table-columns"></i><span data-i18n="nav.kanban">Kanban</span></div>';
const navNew = navLoc + '\n      <div class="nav-item" onclick="showSection(\'customkanban\')"><i class="fa fa-clipboard-list"></i><span>Mis Kanbans</span></div>';
html = html.replace(navLoc, navNew);

// 2. Add Section HTML
const sectionLoc = '<!-- ===== CANALES ===== -->';
const customKanbanHTML = `
    <!-- ===== Kanbans Personales ===== -->
    <div class="section" id="sec-customkanban">
      <div class="section-intro">
        <i class="fa fa-clipboard-list"></i> <span>Tus Tableros de Kanban Personalizados. Crea tus propios flujos de trabajo.</span>
      </div>
      <div style="display:flex;gap:12px;margin-bottom:20px;align-items:center">
        <select id="ckSelector" class="filter-select" style="min-width:200px" onchange="renderActiveCustomKanban()"></select>
        <button class="btn-primary btn-sm" onclick="createNewKanbanBoard()"><i class="fa fa-plus"></i> Nuevo Tablero</button>
        <button class="btn-secondary btn-sm" onclick="editCurrentKanbanBoard()"><i class="fa fa-pen"></i> Editar Tablero</button>
        <button class="btn-danger btn-sm" onclick="deleteCurrentKanbanBoard()"><i class="fa fa-trash"></i> Eliminar Tablero</button>
        <button class="btn-outline btn-sm" style="margin-left:auto" onclick="addCustomKanbanCol()"><i class="fa fa-plus"></i> Añadir Columna</button>
      </div>
      <div class="kanban-wrap" style="height:calc(100vh - 200px);overflow-x:auto">
        <div class="kanban-board" id="customKanbanBoard" style="display:flex;gap:16px;align-items:flex-start;min-height:100%"></div>
      </div>
    </div>
`;
html = html.replace(sectionLoc, customKanbanHTML + '\n    ' + sectionLoc);

// 3. Add script logic before closing </body>
const scriptLoc = '</body>';
const kanbanLogic = `
<script>
// ---------- KANBANS PERSONALES ----------
let cKanbans = [];
let actKanbanId = null;

async function loadCustomKanbans() {
  try {
    const res = await fetch('/api/kanbans', {headers: getAuthHeader()});
    if(res.ok) {
      cKanbans = await res.json();
      const sel = document.getElementById('ckSelector');
      if(!sel) return;
      sel.innerHTML = cKanbans.map(k => \`<option value="\${k.id}">\${k.title}</option>\`).join('');
      if(cKanbans.length === 0) sel.innerHTML = '<option value="">Sin tableros</option>';
      if(cKanbans.length > 0 && !actKanbanId) actKanbanId = cKanbans[0].id;
      if(actKanbanId) sel.value = actKanbanId;
      renderActiveCustomKanban();
    }
  } catch(e) { console.error('Kanban load err', e); }
}

async function renderActiveCustomKanban() {
  const selId = document.getElementById('ckSelector')?.value;
  if(selId) actKanbanId = selId;
  const kb = cKanbans.find(k => String(k.id) === String(actKanbanId));
  const board = document.getElementById('customKanbanBoard');
  if(!board) return;
  if(!kb) { board.innerHTML = '<div style="color:var(--muted)">Crea o selecciona un tablero.</div>'; return; }

  let html = '';
  (kb.columns || []).forEach((col, cIdx) => {
    html += \`<div class="kanban-col" data-cidx="\${cIdx}" style="min-width:280px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:12px;padding:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h4 style="margin:0;color:var(--text);font-size:14px">\${col.title} (\${col.cards?.length||0})</h4>
        <div>
          <i class="fa fa-plus" style="cursor:pointer;color:var(--primary);margin-right:8px" onclick="addCardToCol(\${cIdx})" title="Añadir Tarjeta"></i>
          <i class="fa fa-trash" style="cursor:pointer;color:var(--danger)" onclick="delCol(\${cIdx})" title="Eliminar Columna"></i>
        </div>
      </div>
      <div class="k-cards-container" style="min-height:50px" data-cidx="\${cIdx}">\`;
    (col.cards || []).forEach((card, cdIdx) => {
      html += \`<div class="kanban-card" data-cdidx="\${cdIdx}" style="background:var(--bg-card);padding:12px;border-radius:8px;margin-bottom:8px;border:1px solid var(--border);cursor:grab">
        <div style="display:flex;justify-content:space-between">
          <strong style="font-size:13px;color:var(--text)">\${card.title}</strong>
          <i class="fa fa-trash" style="font-size:11px;color:var(--danger);cursor:pointer" onclick="delCard(\${cIdx}, \${cdIdx})"></i>
        </div>
        \${card.desc ? \`<div style="font-size:11px;color:var(--muted);margin-top:6px">\${card.desc}</div>\` : ''}
        \${card.resp ? \`<div style="font-size:10px;color:var(--info);margin-top:6px"><i class="fa fa-user"></i> \${card.resp}</div>\` : ''}
      </div>\`;
    });
    html += \`</div></div>\`;
  });
  board.innerHTML = html;

  // Initialize Sortable
  document.querySelectorAll('#customKanbanBoard .k-cards-container').forEach(el => {
    try {
      new Sortable(el, {
        group: 'custom-kanban',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function (evt) {
          const fromCol = evt.from.dataset.cidx;
          const toCol = evt.to.dataset.cidx;
          const oldIdx = evt.oldIndex;
          const newIdx = evt.newIndex;
          if(fromCol === toCol && oldIdx === newIdx) return;
          
          const card = kb.columns[fromCol].cards.splice(oldIdx, 1)[0];
          kb.columns[toCol].cards.splice(newIdx, 0, card);
          saveCurrentCustomKanban(kb);
        }
      });
    } catch(e) {}
  });
}

function delCol(cIdx) {
  if(!confirm('¿Eliminar esta columna y sus tarjetas?')) return;
  const kb = cKanbans.find(k => String(k.id) === String(actKanbanId));
  kb.columns.splice(cIdx, 1);
  saveCurrentCustomKanban(kb);
  renderActiveCustomKanban();
}
function delCard(cIdx, cdIdx) {
  if(!confirm('¿Eliminar esta tarjeta?')) return;
  const kb = cKanbans.find(k => String(k.id) === String(actKanbanId));
  kb.columns[cIdx].cards.splice(cdIdx, 1);
  saveCurrentCustomKanban(kb);
  renderActiveCustomKanban();
}
function addCardToCol(cIdx) {
  const ttl = prompt('Título de la tarjeta:');
  if(!ttl) return;
  const desc = prompt('Descripción (opcional):');
  const resp = prompt('Responsable (opcional):');
  const kb = cKanbans.find(k => String(k.id) === String(actKanbanId));
  kb.columns[cIdx].cards.push({ id: Date.now(), title: ttl, desc: desc||'', resp: resp||'' });
  saveCurrentCustomKanban(kb);
  renderActiveCustomKanban();
}

function addCustomKanbanCol() {
  const kb = cKanbans.find(k => String(k.id) === String(actKanbanId));
  if(!kb) return alert('Primero selecciona o crea un tablero.');
  const nm = prompt('Nombre de la columna:');
  if(!nm) return;
  if(!kb.columns) kb.columns = [];
  kb.columns.push({ id: Date.now(), title: nm, cards: [] });
  saveCurrentCustomKanban(kb);
  renderActiveCustomKanban();
}

async function createNewKanbanBoard() {
  const title = prompt('Nombre del nuevo Tablero:');
  if(!title) return;
  const newK = { title, columns: [ {id:Date.now(), title:'To Do', cards:[]}, {id:Date.now()+1, title:'Doing', cards:[]}, {id:Date.now()+2, title:'Done', cards:[]} ] };
  try {
    const res = await fetch('/api/kanbans', { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(newK) });
    if(res.ok) { actKanbanId = (await res.json()).id; await loadCustomKanbans(); }
  } catch(e) { console.error(e); }
}

async function editCurrentKanbanBoard() {
  const kb = cKanbans.find(k => String(k.id) === String(actKanbanId));
  if(!kb) return;
  const title = prompt('Nuevo nombre:', kb.title);
  if(!title) return;
  kb.title = title;
  await saveCurrentCustomKanban(kb);
  loadCustomKanbans();
}

async function deleteCurrentKanbanBoard() {
  if(!actKanbanId) return;
  if(!confirm('¿Estás seguro de ELIMINAR todo el tablero?')) return;
  try {
    const res = await fetch('/api/kanbans/' + actKanbanId, { method: 'DELETE', headers: getAuthHeader() });
    if(res.ok) { actKanbanId = null; await loadCustomKanbans(); }
  } catch(e) { console.error(e); }
}

async function saveCurrentCustomKanban(kb) {
  try {
    await fetch('/api/kanbans/' + kb.id, { method: 'PUT', headers: getAuthHeader(), body: JSON.stringify(kb) });
  } catch(e) { console.error(e); }
}

// Ensure load Custom Kanbans on boot
window.addEventListener('load', () => { setTimeout(loadCustomKanbans, 1500); });
</script>
</body>`;
html = html.replace('</body>', kanbanLogic);

// Add to SEC_INFO inside vylex.html
html = html.replace('config:[\'Configuración\',\'Ajustes del sistema\']', 'config:[\'Configuración\',\'Ajustes del sistema\'],\n  customkanban:[\'Kanbans Personales\',\'Tableros dinámicos y arrastrables\']');

fs.writeFileSync('vylex.html', html);
console.log('Phase 4 injected');
