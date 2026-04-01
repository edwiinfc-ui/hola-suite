# GUÍA DE INTEGRACIÓN - Auditoría en Modales Existentes

## 📌 Cómo Integrar Auditoría en tu Dashboard

---

## 1. MODAL DE EDICIÓN DE CLIENTE

**Ubicación:** Modal que abre cuando editas un cliente

**Cambio necesario en JavaScript:**

```javascript
// ANTES:
async function guardarClienteEditado(clientId, campo, nuevoValor) {
  // ... código para guardar ...
  updateClientData(clientId, campo, nuevoValor);
  showToast('Cambio guardado');
}

// DESPUÉS:
async function guardarClienteEditado(clientId, campo, nuevoValor) {
  // Obtener valor anterior (si existe)
  const clienteAnterior = DATABASE[clientId];
  const valorAnterior = clienteAnterior?.[campo];
  
  // ... código para guardar ...
  updateClientData(clientId, campo, nuevoValor);
  
  // ★ REGISTRAR EN AUDITORÍA
  await logAuditAction(
    'EDIT_FIELD',           // Acción
    'cliente',              // Tipo de entidad
    clientId,               // ID del cliente
    campo,                  // Campo editado (e.g., "nombre", "email", "plan")
    valorAnterior,          // Valor anterior
    nuevoValor,             // Valor nuevo
    'Edición manual desde dashboard'  // Razón
  );
  
  showToast('Cambio guardado y registrado');
}
```

---

## 2. ASIGNACIÓN DE VENDEDOR

**Ubicación:** Cuando seleccionas un vendedor en el modal de vendedores

**Integración:**

```html
<!-- En el HTML -->
<select id="vendorSelect" onchange="asignarVendedor()">
  <option value="">Seleccionar vendedor...</option>
  <option value="Juan">Juan</option>
  <option value="Maria">Maria</option>
</select>

<button onclick="guardarAsignacionVendedor()">Guardar</button>
```

```javascript
// En JavaScript
async function guardarAsignacionVendedor() {
  const clientId = getCurrentClientId();
  const vendor = document.getElementById('vendorSelect').value;
  
  if (!vendor) {
    showError('Selecciona un vendedor');
    return;
  }
  
  // ★ SINCRONIZAR A CLICKUP
  const synced = await syncSalesPoint(clientId, vendor, getCurrentClientName());
  
  if (synced) {
    showToast('Vendedor asignado y sincronizado con ClickUp');
    // Actualizar UI localmente
    document.getElementById('vendorBadge').textContent = vendor;
  } else {
    showError('Error sincronizando con ClickUp');
  }
}
```

---

## 3. INICIO DE IMPLEMENTACIÓN

**Ubicación:** Cuando cambias estado del cliente a "EN IMPLEMENTACION"

**Integración:**

```javascript
async function iniciarImplementacion(clientId, implementador) {
  const startDate = new Date().toISOString().split('T')[0];
  
  // ★ SINCRONIZAR A CLICKUP
  const synced = await syncImplementationPoint(clientId, implementador, startDate);
  
  if (synced) {
    // Actualizar UI
    updateClientStatus(clientId, 'EN IMPLEMENTACION');
    document.getElementById('implementadorBadge').textContent = implementador;
    showToast('Implementación iniciada');
  }
}
```

---

## 4. CANCELACIÓN DE CLIENTE

**Ubicación:** Cuando marcas un cliente como "CANCELADO"

**Integración:**

```javascript
async function cancelarCliente(clientId) {
  // Abrir modal con razón
  const razonModal = `
    <div class="modal">
      <h3>Razón de Cancelación</h3>
      <textarea id="cancelReason"></textarea>
      <button onclick="confirmarCancelacion('${clientId}')">Confirmar</button>
    </div>
  `;
  showModal(razonModal);
}

async function confirmarCancelacion(clientId) {
  const reason = document.getElementById('cancelReason').value;
  
  if (!reason) {
    showError('Debes proporcionar una razón');
    return;
  }
  
  // ★ SINCRONIZAR A CLICKUP
  const synced = await syncCancellationPoint(
    clientId,
    reason,
    getCurrentUser()
  );
  
  if (synced) {
    updateClientStatus(clientId, 'CANCELADO');
    showToast('Cliente cancelado y sincronizado');
    closeModal();
  }
}
```

---

## 5. EDICIÓN MASIVA (Bulk Edit)

**Ubicación:** Modal de edición masiva

**Integración:**

```javascript
async function guardarEdicionMasiva(clientIds, cambios) {
  // cambios = { campo: nuevoValor }
  
  for (const clientId of clientIds) {
    for (const [campo, nuevoValor] of Object.entries(cambios)) {
      const clienteAnterior = DATABASE[clientId];
      const valorAnterior = clienteAnterior?.[campo];
      
      // Actualizar dato
      updateClientData(clientId, campo, nuevoValor);
      
      // ★ REGISTRAR CADA CAMBIO
      await logAuditAction(
        'EDIT_FIELD',
        'cliente',
        clientId,
        campo,
        valorAnterior,
        nuevoValor,
        `Edición masiva: ${cambios}`
      );
    }
  }
  
  showToast(`${clientIds.length} clientes actualizados y registrados`);
}
```

---

## 6. ELIMINACIÓN DE CLIENTE (CON DOCUMENTACIÓN)

**Ubicación:** Botón de eliminar cliente

**Integración:**

```html
<!-- En el HTML -->
<button onclick="mostrarModalEliminacion()">Eliminar Cliente</button>

<!-- Modal de Eliminación con Documentación -->
<div id="deleteModal" class="modal hidden">
  <h3>Eliminar Cliente (requiere documentación)</h3>
  
  <textarea 
    id="deleteReason" 
    placeholder="Razón de eliminación (ej: Empresa cerró)"
  ></textarea>
  
  <textarea 
    id="deleteDocumentation" 
    placeholder="Documentación (ej: Correo del cliente, ticket, acta de reunión)"
  ></textarea>
  
  <div style="display: flex; gap: 10px;">
    <button onclick="confirmarEliminacion()">Confirmar Eliminación</button>
    <button onclick="cerrarModal()">Cancelar</button>
  </div>
</div>
```

```javascript
function mostrarModalEliminacion() {
  const clientId = getCurrentClientId();
  document.getElementById('deleteModal').classList.remove('hidden');
  window.deletingClientId = clientId;  // Guardar para después
}

async function confirmarEliminacion() {
  const clientId = window.deletingClientId;
  const reason = document.getElementById('deleteReason').value.trim();
  const documentation = document.getElementById('deleteDocumentation').value.trim();
  
  if (!reason || !documentation) {
    showError('Debes proporcionar razón Y documentación');
    return;
  }
  
  // ★ ELIMINAR CON DOCUMENTACIÓN
  const deleted = await deleteClientWithDocumentation(
    clientId,
    reason,
    documentation
  );
  
  if (deleted) {
    removeClientFromUI(clientId);
    showToast('Cliente eliminado (registrado en auditoría)');
    document.getElementById('deleteModal').classList.add('hidden');
  }
}
```

---

## 7. SINCRONIZACIÓN DE CONSULTORES/IMPLEMENTADORES

**Ubicación:** Botón "Sincronizar con ClickUp" o función de refresh

**Integración:**

```javascript
async function sincronizarRolesDesdeClickUp() {
  showSpinner('Sincronizando roles...');
  
  // ★ SINCRONIZAR
  const result = await syncRolesFromClickUp();
  
  hideSpinner();
  
  if (result && result.ok) {
    showToast(
      `✅ Sincronizado: ${result.consultores} consultores, ${result.implementadores} implementadores`
    );
    
    // Actualizar dropdowns en UI
    actualizarListasVendoresImplementadores();
  } else {
    showError('Error sincronizando roles');
  }
}
```

---

## 8. TABLA DE AUDITORÍA (Dashboard)

**Crear tabla para mostrar registro de cambios:**

```html
<div id="auditTable" class="table-container">
  <h3>Registro de Cambios</h3>
  <table>
    <thead>
      <tr>
        <th>Fecha/Hora</th>
        <th>Usuario</th>
        <th>Acción</th>
        <th>Entidad</th>
        <th>Campo</th>
        <th>Antes</th>
        <th>Después</th>
        <th>Razón</th>
      </tr>
    </thead>
    <tbody id="auditTableBody">
      <!-- Se llena con JavaScript -->
    </tbody>
  </table>
</div>
```

```javascript
async function mostrarTablaAuditoria() {
  const logs = await getAuditLogs();
  const tbody = document.getElementById('auditTableBody');
  
  tbody.innerHTML = logs.map(log => `
    <tr>
      <td>${new Date(log.timestamp).toLocaleString('es-ES')}</td>
      <td>${log.user}</td>
      <td><strong>${log.action}</strong></td>
      <td>${log.details.entityType}</td>
      <td>${log.details.field || '-'}</td>
      <td><code>${log.details.oldValue || '-'}</code></td>
      <td><code>${log.details.newValue || '-'}</code></td>
      <td>${log.details.reason || '-'}</td>
    </tr>
  `).join('');
}
```

---

## 9. TABLA DE CLIENTES ELIMINADOS

**Crear tabla para mostrar clientes eliminados:**

```html
<div id="deletedClientsTable" class="table-container">
  <h3>Clientes Eliminados</h3>
  <table>
    <thead>
      <tr>
        <th>Cliente ID</th>
        <th>Eliminado Por</th>
        <th>Fecha</th>
        <th>Razón</th>
        <th>Documentación</th>
      </tr>
    </thead>
    <tbody id="deletedTableBody">
      <!-- Se llena con JavaScript -->
    </tbody>
  </table>
</div>
```

```javascript
async function mostrarClientesEliminados() {
  const deleted = await getDeletedClients();
  const tbody = document.getElementById('deletedTableBody');
  
  tbody.innerHTML = deleted.map(item => `
    <tr>
      <td>${item.clientId}</td>
      <td>${item.deletedBy}</td>
      <td>${new Date(item.deletedAt).toLocaleString('es-ES')}</td>
      <td>${item.reason}</td>
      <td>${item.documentation}</td>
    </tr>
  `).join('');
}
```

---

## 10. INTEGRACIÓN CON EVENTOS SSE

**Para sincronización en tiempo real cuando hay cambios remotos:**

```javascript
function conectarSSEParaAuditoria() {
  const token = localStorage.getItem('access_token');
  
  const eventSource = new EventSource('/api/data/sync', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  eventSource.addEventListener('sync-completed', (event) => {
    const data = JSON.parse(event.data);
    console.log('Cambio sincronizado:', data);
    
    // Actualizar UI basado en el tipo de sincronización
    if (data.point === 'sales') {
      actualizarVendorEnUI(data.taskId, data.vendor);
    } else if (data.point === 'implementation') {
      actualizarImplementadorEnUI(data.taskId, data.implementador);
    } else if (data.point === 'cancellation') {
      actualizarStatusEnUI(data.taskId, 'CANCELADO');
    }
  });
  
  eventSource.addEventListener('client-deleted', (event) => {
    const data = JSON.parse(event.data);
    removerClienteDelUI(data.clientId);
  });
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

Integra auditoría en estos puntos del dashboard:

- [ ] Edición individual de cliente
- [ ] Asignación de vendedor
- [ ] Inicio de implementación
- [ ] Cancelación de cliente
- [ ] Edición masiva
- [ ] Eliminación de cliente (con documentación)
- [ ] Sincronización de roles desde ClickUp
- [ ] Tabla de auditoría en dashboard
- [ ] Tabla de clientes eliminados
- [ ] Eventos SSE para cambios remotos

---

## ⚠️ PUNTOS IMPORTANTES

1. **SIEMPRE registra cambios importantes:** Especialmente eliminaciones y cambios de responsables
2. **REQUIERE documentación para deletes:** No permitas eliminar sin justificar
3. **Los valores anteriores importan:** Siempre guarda `oldValue` para auditoría
4. **Sincroniza a ClickUp:** Usa las funciones de sync-point para cambios críticos
5. **Realtime es mejor:** Usa SSE para que otros usuarios vean cambios en tiempo real

---

**Implementación recomendada:** 
1. Primero integra auditoría en edición individual
2. Luego en asignación de vendedor
3. Luego en cancelaciones
4. Finalmente en bulk edits

Esto te da control total y trazabilidad completa.
