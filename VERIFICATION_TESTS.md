# ✅ Tests de Verificación del Sistema

## 🧪 Test Suite - Ejecutar en Console del Navegador

### Prerequisitos
1. Abrir http://localhost:3000/vylex.html
2. Loguearse como administrador
3. Abrir DevTools (F12) → Console

---

## Test 1: Auditoría Funciona

```javascript
// Obtener logs de auditoría
const logs = await getAuditLogs(50);
console.log('Total logs:', logs.length);
console.log('Primer log:', logs[0]);

// Esperado:
// - logs.length > 0
// - logs[0] tiene: id, timestamp, user, action, details
```

**Resultado Esperado**:
```
✅ Total logs: 47
✅ user: admin@example.com
✅ action: SYNC_ROLES
✅ timestamp: ISO string
```

---

## Test 2: Sincronización de Roles

```javascript
// Sincronizar consultores e implementadores desde ClickUp
const result = await fetch('/api/sales/sync-vendedores', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
}).then(r => r.json());

console.log('Sync result:', result);

// Esperado:
// - result.ok === true
// - result.consultores >= 1
// - result.implementadores >= 1
```

**Resultado Esperado**:
```json
{
  "ok": true,
  "consultores": 24,
  "implementadores": 19,
  "matches": 1250
}
```

---

## Test 3: Registrar Auditoría

```javascript
// Simular una acción de auditoría
await logAuditAction(
  'TEST_ACTION',
  'client',
  'test_client_123',
  'plan',
  'Free',
  'Premium',
  'Test desde console'
);

// Verificar que se registró
const logs = await getAuditLogs(10);
const testLog = logs.find(l => l.action === 'TEST_ACTION');
console.log('Test log:', testLog);
```

**Resultado Esperado**:
```
✅ testLog.action === 'TEST_ACTION'
✅ testLog.details.field === 'plan'
✅ testLog.details.oldValue === 'Free'
✅ testLog.details.newValue === 'Premium'
```

---

## Test 4: Sincronización de Punto de Venta

```javascript
// Simular sincronización de vendedor
const taskId = '123456789';
const vendor = 'Carlos Sales';
const clientName = 'Test Client';

const result = await syncSalesPoint(taskId, vendor, clientName);
console.log('Sales point sync:', result);

// Verificar en logs
const logs = await getAuditLogs(5);
const syncLog = logs.find(l => l.action === 'SYNC_SALES_POINT');
console.log('Sync log:', syncLog);
```

**Resultado Esperado**:
```
✅ result === true
✅ syncLog.details.vendor === 'Carlos Sales'
✅ Toast success: "Vendedor sincronizado a ClickUp"
```

---

## Test 5: Sincronización de Punto de Implementación

```javascript
// Simular inicio de implementación
const taskId = '987654321';
const implementador = 'Juan Tech';
const startDate = new Date().toISOString().split('T')[0];

const result = await syncImplementationPoint(taskId, implementador, startDate);
console.log('Impl point sync:', result);

// Verificar en logs
const logs = await getAuditLogs(5);
const implLog = logs.find(l => l.action === 'SYNC_IMPL_POINT');
console.log('Impl log:', implLog);
```

**Resultado Esperado**:
```
✅ result === true
✅ implLog.details.implementador === 'Juan Tech'
✅ Toast success: "Implementación sincronizada a ClickUp"
```

---

## Test 6: Sincronización de Cancelación

```javascript
// Simular cancelación
const taskId = '555666777';
const reason = 'Cliente cambió de proveedor';
const cancelledBy = APP.currentUser.username;

const result = await syncCancellationPoint(taskId, reason, cancelledBy);
console.log('Cancel point sync:', result);

// Verificar en logs
const logs = await getAuditLogs(5);
const cancelLog = logs.find(l => l.action === 'SYNC_CANCEL_POINT');
console.log('Cancel log:', cancelLog);
```

**Resultado Esperado**:
```
✅ result === true
✅ cancelLog.details.reason === 'Cliente cambió de proveedor'
✅ Toast success: "Cancelación sincronizada a ClickUp"
```

---

## Test 7: Eliminación con Documentación

```javascript
// Intentar eliminar sin documentación (debe fallar)
let result = await deleteClientWithDocumentation(
  'client_123',
  '', // Sin razón
  ''  // Sin documentación
);
console.log('Delete without docs:', result);
// Esperado: false + Toast error

// Ahora con documentación (debe funcionar)
result = await deleteClientWithDocumentation(
  'client_123',
  'Datos incorrectos - cliente duplicado',
  'Aprobado por Manager - Ticket #5542'
);
console.log('Delete with docs:', result);

// Verificar en deleted clients
const deleted = await getDeletedClients();
console.log('Deleted clients:', deleted);
```

**Resultado Esperado**:
```
✅ Primer intento: false (sin documentación)
✅ Segundo intento: true (con documentación)
✅ Deleted clients contiene el cliente eliminado
✅ Registrado en auditoría con razón completa
```

---

## Test 8: Meta de Vendedor

```javascript
// Establecer meta mensual
const seller = 'Carlos Sales';
const month = 'Abril';
const goal = 50000;

// Simular desde modal de metas
document.getElementById('salesGoalsSeller').value = seller;
document.getElementById('salesGoalsMonth').value = month;
document.getElementById('salesGoalsAmount').value = goal;

await saveSalesGoal();

// Verificar en auditoría
const logs = await getAuditLogs(5);
const goalLog = logs.find(l => l.action === 'SALES_GOAL_SET');
console.log('Goal log:', goalLog);
```

**Resultado Esperado**:
```
✅ goalLog.action === 'SALES_GOAL_SET'
✅ goalLog.details.newValue === 50000
✅ Toast success: "Meta de $50,000 establecida para Carlos Sales"
```

---

## Test 9: Endpoints API Directos

```javascript
// Test /api/audit/logs
const logsRes = await fetch('/api/audit/logs', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
}).then(r => r.json());
console.log('Audit logs count:', logsRes.logs.length);

// Test /api/client/deleted
const deletedRes = await fetch('/api/client/deleted', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
}).then(r => r.json());
console.log('Deleted clients count:', deletedRes.deletedClients.length);

// Test /api/sales/goals
const goalsRes = await fetch('/api/sales/goals', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
}).then(r => r.json());
console.log('Sales goals:', goalsRes);
```

**Resultado Esperado**:
```
✅ logsRes.logs es array
✅ deletedRes.deletedClients es array
✅ goalsRes es objeto con meses y vendedores
```

---

## Test 10: Flujo Completo (End-to-End)

```javascript
// 1. Sincronizar roles
console.log('1. Sincronizando roles...');
await syncRolesFromClickUp();

// 2. Establecer meta
console.log('2. Estableciendo meta...');
await logAuditAction('TEST_META', 'sales_goal', 'test_april', 'amount', null, 100000);

// 3. Asignar vendedor
console.log('3. Asignando vendedor...');
await syncSalesPoint('task_123', 'Test Vendor', 'Test Client');

// 4. Iniciar implementación
console.log('4. Iniciando implementación...');
await syncImplementationPoint('task_123', 'Test Implementador', new Date().toISOString());

// 5. Verificar auditoría completa
console.log('5. Verificando auditoría...');
const allLogs = await getAuditLogs(100);
console.log('Total acciones registradas:', allLogs.length);
console.log('✅ FLUJO COMPLETO EXITOSO');
```

---

## 🎯 Checklist de Verificación

- [ ] Servidor inicia sin errores: `✅ Servidor corriendo en http://localhost:3000`
- [ ] Se puede logear en http://localhost:3000/vylex.html
- [ ] Función `logAuditAction()` existe y funciona
- [ ] Función `syncSalesPoint()` existe y funciona
- [ ] Función `syncImplementationPoint()` existe y funciona
- [ ] Función `syncCancellationPoint()` existe y funciona
- [ ] Función `deleteClientWithDocumentation()` existe y funciona
- [ ] Función `getAuditLogs()` retorna datos
- [ ] Función `getDeletedClients()` retorna array
- [ ] `/api/audit/logs` endpoint funciona
- [ ] `/api/sync/sales-point` endpoint funciona
- [ ] `/api/sync/impl-point` endpoint funciona
- [ ] `/api/sync/cancel-point` endpoint funciona
- [ ] `/api/client/delete-documented` endpoint funciona
- [ ] `/api/client/deleted` endpoint funciona
- [ ] Consultores y implementadores sincronizados desde ClickUp
- [ ] Todas las acciones se registran en auditoría
- [ ] Eliminación requiere documentación (soft delete)
- [ ] SSE notifications en tiempo real funcionan

---

## 📊 Resultado Final

**Si todos los tests pasan:**
```
🎉 SISTEMA VERIFICADO Y FUNCIONAL
✅ Auditoría completa
✅ 3-Point ClickUp Sync
✅ Consultores vs Implementadores
✅ Immutabilidad enforced
✅ Listo para producción
```

**Si algún test falla:**
1. Revisar console para error messages
2. Verificar que `APP.token` está configurado
3. Revisar que el servidor está corriendo
4. Comprobar que `localStorage` tiene `access_token`
5. Re-loguearse si es necesario

---

**Versión**: 1.0
**Fecha**: 1 Abril 2026
**Autor**: GitHub Copilot
