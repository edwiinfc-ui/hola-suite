const fs = require('fs');
let html = fs.readFileSync('vylex.html', 'utf8');

// 1. Grid to Flexbox
html = html.replace('.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:20px}', '.kpi-grid{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:20px}\n.kpi-grid > * {flex:1 1 180px;min-width:180px}');
html = html.replace('.charts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:14px;margin-bottom:20px}', '.charts-grid{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:20px}\n.charts-grid > * {flex:1 1 340px;min-width:340px}');

// 2. Branding (Cover URL) - HTML addition
html = html.replace('<div class="cfg-f"><label>LOGO (URL O DATA URI)</label><input type="text" id="cfgBrandLogoUrl" placeholder="https://.../logo.png"></div>', 
`<div class="cfg-f"><label>LOGO (URL O DATA URI)</label><input type="text" id="cfgBrandLogoUrl" placeholder="https://.../logo.png"></div>
<div class="cfg-f"><label>IMAGEN DE PORTADA</label><input type="text" id="cfgBrandCoverUrl" placeholder="https://.../cover.jpg"></div>`);

// Fallback in case the label was lowercase (it seems it was 'Logo (URL o Data URI)')
html = html.replace('<div class="cfg-f"><label>Logo (URL o Data URI)</label><input type="text" id="cfgBrandLogoUrl" placeholder="https://.../logo.png"></div>', 
`<div class="cfg-f"><label>Logo (URL o Data URI)</label><input type="text" id="cfgBrandLogoUrl" placeholder="https://.../logo.png"></div>
<div class="cfg-f mt-12"><label>Imagen de Portada (Login)</label><input type="text" id="cfgBrandCoverUrl" placeholder="https://unsplash.com/..."></div>`);

// Branding - JS definition
html = html.replace("logoUrl:document.getElementById('cfgBrandLogoUrl')?.value.trim()||'',", "logoUrl:document.getElementById('cfgBrandLogoUrl')?.value.trim()||'',\n    coverUrl:document.getElementById('cfgBrandCoverUrl')?.value.trim()||'',");

// Branding - applyBranding() additions
html = html.replace("const root=document.documentElement;", "const root=document.documentElement;\n  const coverUrl=b.coverUrl||'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200';\n  const loginBg=document.querySelector('.login-bg-image');if(loginBg)loginBg.style.backgroundImage=\`url(\${coverUrl})\`;");

// Branding - populate
html = html.replace("['cfgBrandLogoUrl',branding.logoUrl],", "['cfgBrandLogoUrl',branding.logoUrl],\n    ['cfgBrandCoverUrl',branding.coverUrl],");

// 3. User Avatars - HTML addition in userModal
html = html.replace('<div class="config-field"><label>Color / Inicial</label><input type="text" id="umAvatar" placeholder="Inicial del nombre (ej: A)" maxlength="2"></div>',
`<div class="config-field"><label>Fotos / Inicial</label>
   <div style="display:flex;gap:8px">
     <input type="text" id="umAvatar" placeholder="Inicial (A)" maxlength="2" style="width:60px">
     <input type="text" id="umPhoto" placeholder="URL Foto de Perfil" style="flex:1">
   </div>
 </div>`);

// 4. Update saveUser / renderUsuarios / setUserUI
html = html.replace("const av=document.getElementById('umAvatar').value.trim()||'U';", "const av=document.getElementById('umAvatar').value.trim()||'U';\n  const avatarUrl=document.getElementById('umPhoto').value.trim()||'';");
html = html.replace("name,email,password:pass,role,av", "name,email,password:pass,role,av,avatarUrl");

// update setUserUI rendering
const oldSetUserUI = `function setUserUI(u){
  document.getElementById('uAv').textContent=u.av;document.getElementById('uAvTop').textContent=u.av;
  document.getElementById('uName').textContent=u.name;
  document.getElementById('uRole').textContent=u.role==='admin'?'Administrador':u.role==='consultant'?'Consultor':'Visualizador';
}`;

const newSetUserUI = `function setUserUI(u){
  const renderAv = (id) => {
    let el = document.getElementById(id);
    if(u.avatarUrl) el.innerHTML = \`<img src="\${u.avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">\`;
    else {el.innerHTML=''; el.textContent=u.av;}
  };
  renderAv('uAv'); renderAv('uAvTop');
  document.getElementById('uName').textContent=u.name;
  document.getElementById('uRole').textContent=u.role==='admin'?'Administrador':u.role==='consultant'?'Consultor':'Visualizador';
}`;
html = html.replace(oldSetUserUI, newSetUserUI);

// update clear fields in `openUserModal`
html = html.replace("document.getElementById('umAvatar').value='';", "document.getElementById('umAvatar').value='';\n  const up=document.getElementById('umPhoto'); if(up) up.value='';");

// renderUsuarios - add support for avatar render in table
html = html.replace("<td style=\"display:flex;gap:12px;align-items:center\"><div class=\"u-av\">`+u.av+`</div><div>", "<td style=\"display:flex;gap:12px;align-items:center\"><div class=\"u-av\">`+(u.avatarUrl?`<img src=\"\${u.avatarUrl}\" style=\"width:100%;height:100%;border-radius:50%;object-fit:cover\">`:u.av)+`</div><div>");

// ensure the edit fill includes the photo
html = html.replace("document.getElementById('umAvatar').value=u.av;", "document.getElementById('umAvatar').value=u.av||'';\n  const up2=document.getElementById('umPhoto'); if(up2) up2.value=u.avatarUrl||'';");

fs.writeFileSync('vylex.html', html);
console.log('Phase 2.5 injected');
