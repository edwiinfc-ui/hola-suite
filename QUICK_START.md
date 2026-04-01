# ⚡ Quick Start — Sincronización en Tiempo Real

## 5 Pasos para Activar Sincronización en Tiempo Real

### Paso 1: Configura Credenciales de ClickUp

```
1. Abre el dashboard
2. Ve a la sección "Sincronización" (sidebar)
3. Busca los campos:
   - 📌 API Key ClickUp
   - 📌 List ID ClickUp
   
4. Obtén tu API Key:
   https://app.clickup.com/settings/apps/integrations
   
5. Pega la API Key en el input
6. Ingresa el List ID del listado ClickUp que quieres sincronizar
```

### Paso 2: Inicia Sincronización en Tiempo Real

```
1. En la sección "Sincronización", busca el panel:
   ⚡ Sincronización en Tiempo Real
   
2. Haz clic en el botón verde:
   🟢 Iniciar Sync en Vivo
   
3. Verifica que el indicador parpadea en la esquina inferior derecha
```

### Paso 3: Observa los Cambios

```
Ahora cuando hagas cambios:

📝 Editas un cliente en el dashboard
  ↓
⏱️ Se envía automáticamente a ClickUp
  ↓
🔄 ClickUp actualiza el campo
  ↓
📥 El dashboard recibe la confirmación
  ↓
🔔 Toast notification: "✅ Sincronizado"
```

### Paso 4: Ver Historial de Cambios

```
1. Haz clic en el botón "📋 Log"
2. Se abre una ventana con los últimos 20 cambios
3. Puedes ver:
   - Quién hizo el cambio (local o ClickUp)
   - Cuándo (timestamp exacto)
   - Qué cliente
   - Qué campo cambió
   - Nuevo valor
```

### Paso 5: Detener Sincronización (si es necesario)

```
1. El botón cambió de color a rojo: 🔴 Detener Sync
2. Haz clic para pausar la sincronización
3. El indicador desaparecerá de la esquina inferior derecha
```

---

## 🎯 Casos de Uso

### Caso 1: Actualizar Plan de Cliente

**En Dashboard:**
```
1. Abre cliente "ACME Corp"
2. Busca el tab "General"
3. Cambia Plan: "BASIC" → "PRO"
4. Se guarda automáticamente
5. ✅ Toast: "Sincronizado: plan="PRO""
6. ClickUp se actualiza en automático
```

### Caso 2: Cambiar Responsable

**En Dashboard:**
```
1. Abre cliente "Tech Solutions"
2. Tab "Etapas"
3. Haz clic en "Verificación" (responsable)
4. Selecciona nuevo responsable: "Juan García"
5. Se envía automáticamente a ClickUp
6. ✅ Notificación confirmando cambio
```

### Caso 3: Edición Masiva

**Selecciona múltiples clientes:**
```
1. Marca checkboxes de clientes
2. Haz clic en "Editar Masivamente"
3. Selecciona campo: "plan"
4. Ingresa valor: "ENTERPRISE"
5. Haz clic "Aplicar"
6. Se sincronizan todos a ClickUp automáticamente
```

---

## 📊 Indicador de Estado

### Indicador Verde Pulsante 🟢

```
Ubicación: Esquina inferior derecha

Cuando está activo:
  ⚡ Sync en vivo  (con animación pulsante)
  
Significa:
  ✅ Sincronización en tiempo real ACTIVA
  ✅ Los cambios se envían cada 10 segundos
  ✅ Los cambios de ClickUp se aplican automáticamente
  
Qué ocurre en segundo plano:
  • Polling a ClickUp cada 10s
  • Detección de cambios locales
  • Cola de sincronización procesada
  • Notificaciones en tiempo real
```

---

## 🔍 Debugging

### Ver Estado Actual en Consola

```javascript
// Abre la consola (F12) y ejecuta:

// 1. Ver si está activa
console.log('Sync activo:', APP.realtimeSync.enabled);

// 2. Ver cambios pendientes
console.log('Cola:', APP.realtimeSync.queue);

// 3. Ver cambios recientes
console.log('Historial:', APP.realtimeSync.changeLog);

// 4. Ver estado completo
console.log(getSyncStatus());

// Output ejemplo:
// {
//   enabled: true,
//   lastSync: 1642345234000,
//   queueLength: 0,
//   changeCount: 42,
//   pollInterval: 10000,
//   lastChanges: [...]
// }
```

### Forzar Sincronización Inmediata

```javascript
// Ejecuta en consola si necesitas sincronizar ahora:

processSyncQueue();    // Procesa cambios locales pendientes
pollClickUpForChanges(); // Obtiene cambios de ClickUp
```

---

## ⚠️ Problemas Comunes

### "El botón no funciona"

**Solución:**
```javascript
// En consola, verifica:
const apiKey = document.getElementById('cfgClickupApiKey')?.value;
if (!apiKey) {
  console.error('❌ API Key no está configurada');
  console.log('Ve a Configuración → ClickUp → Pega tu API Key');
}
```

### "Los cambios no se sincronizan"

**Solución:**
```javascript
// Verifica la API Key es válida:
// (Debe empezar con "pk_" o similar)

// Verifica el List ID:
const listId = document.getElementById('cfgClickupListId')?.value;
console.log('List ID:', listId);

// Si es correcto pero sigue sin funcionar:
// 1. Detén sync (botón rojo)
// 2. Espera 5 segundos
// 3. Vuelve a iniciar
```

### "Ver conflictos de sincronización"

```javascript
// Ver cambios que causaron conflicto:
const conflicts = APP.realtimeSync.changeLog
  .filter(c => c.source === 'conflict');
  
console.log('Conflictos:', conflicts);

// Estos están marcados con resolution: 'clickup_wins'
```

---

## 📈 Métricas

Puedes monitorear el desempeño en la consola:

```javascript
// Ver tiempos de sincronización
const times = APP.realtimeSync.changeLog
  .map(c => c.timestamp);

const avgDelay = times.length > 1 
  ? (times[times.length-1] - times[0]) / times.length 
  : 0;

console.log(`Tiempo promedio entre cambios: ${avgDelay}ms`);

// Ver cantidad de cambios por tipo
const bySource = {};
APP.realtimeSync.changeLog.forEach(c => {
  bySource[c.source] = (bySource[c.source] || 0) + 1;
});
console.log('Cambios por fuente:', bySource);
// Output: { local: 23, clickup: 19 }
```

---

## 🚨 Cuando Algo Sale Mal

### Paso 1: Reiniciar Sincronización

```javascript
// En la consola:
stopRealTimeSync();    // Detiene
setTimeout(() => {
  startRealTimeSync(); // Reinicia después de 2s
}, 2000);
```

### Paso 2: Limpiar Caché

```javascript
// En la consola:
clearFilterCache();       // Limpia caché de filtros
memoCache.clear();        // Limpia memoización
```

### Paso 3: Forzar Sincronización Completa

```javascript
// En la consola:
// Primero obtén cambios de ClickUp
await pollClickUpForChanges();

// Luego procesa cambios locales
processSyncQueue();

// Verifica el resultado
console.log(getSyncStatus());
```

---

## ✨ Características Avanzadas

### Cambiar Frecuencia de Polling

```javascript
// Por defecto: 10 segundos
// Para más rápido (5 segundos):
APP.realtimeSync.pollInterval = 5000;

// Para más lento (30 segundos):
APP.realtimeSync.pollInterval = 30000;

// Luego reinicia:
stopRealTimeSync();
startRealTimeSync();
```

### Monitorear Cambios en Tiempo Real

```javascript
// Ver cada cambio mientras sucede:
const checkChanges = setInterval(() => {
  const status = getSyncStatus();
  console.clear();
  console.log('📊 ESTADO ACTUAL:');
  console.log('  Cambios: ', status.changeCount);
  console.log('  Pendientes:', status.queueLength);
  console.log('  Último sync:', new Date(status.lastSync));
  console.log('  Últimos cambios:', status.lastChanges);
}, 5000);

// Para detener:
clearInterval(checkChanges);
```

---

## 🎓 Flujo Completo de Ejemplo

```
13:00 - Usuario edita "plan" de cliente "ACME" a "PRO"
        ↓ Dashboard detecta cambio
        ↓ Se agrega a APP.realtimeSync.queue
        
13:00:05 - Polling detecta cambio local
         ↓ Envía PUT a ClickUp API
         ↓ PUT request: /task/123/custom_fields
         
13:00:08 - ClickUp confirma actualización
         ↓ Dashboard recibe OK
         ↓ APP.data actualiza
         ↓ Toast: "✅ Sincronizado: plan="PRO""
         
13:00:10 - Siguiente polling:
          ↓ Verifica si hay cambios en ClickUp
          ↓ No hay cambios
          ↓ Continúa esperando
          
13:00:15 - Usuario en otra pestaña edita "pais" en ClickUp
         ↓ Dashboard no lo ve aún
         
13:00:20 - Siguiente polling:
          ↓ Obtiene tareas de ClickUp
          ↓ Detecta: "pais" cambió a "Argentina"
          ↓ Aplica cambio localmente
          ↓ APP.data actualiza
          ↓ UI renderiza
          ↓ Toast: "📥 ACME: pais="Argentina""
```

---

## 🔗 Recursos

- **Documentación Completa:** [REAL_TIME_SYNC.md](REAL_TIME_SYNC.md)
- **Guía de Implementación:** [IMPLEMENTATION.md](IMPLEMENTATION.md)
- **API ClickUp:** https://clickup.com/api/
- **Dashboard:** `index.html`

---

**¡Listo!** Tu sincronización en tiempo real está configurada.  
Ahora todos los cambios se sincronizarán automáticamente.

🚀 **Disfruta de la sincronización en tiempo real**

---

## 🎉 NUEVA ACTUALIZACIÓN: SISTEMA COMPLETO DE AUDITORÍA + 3-POINT SYNC

### Lo que cambió (1 Abril 2026)

✅ **Servidor REPARADO** - Ahora inicia sin errores
✅ **Auditoría COMPLETA** - Todo queda registrado (quién, qué, cuándo, por qué)
✅ **ClickUp 3-POINT SYNC** - Sincronización en 3 puntos críticos:
   1. Punto de Venta (Sales Point) - Asignar vendedor
   2. Punto de Implementación (Implementation Point) - Iniciar implementación
   3. Punto de Cancelación (Cancellation Point) - Registrar cancelación
✅ **Consultores vs Implementadores** - Distinguidos automáticamente
✅ **Protección de Datos** - Eliminación requiere documentación (soft-delete)

### Funciones Nuevas en DevTools Console

```javascript
// 1. Ver auditoría completa
await getAuditLogs(50)

// 2. Sincronizar vendedor a ClickUp
await syncSalesPoint('taskId', 'Nombre Vendedor', 'Nombre Cliente')

// 3. Marcar implementación iniciada
await syncImplementationPoint('taskId', 'Implementador', new Date())

// 4. Registrar cancelación
await syncCancellationPoint('taskId', 'Motivo', 'Usuario')

// 5. Eliminar cliente (con documentación)
await deleteClientWithDocumentation('clientId', 'Razón', 'Documentación')

// 6. Ver clientes eliminados
await getDeletedClients()
```

### Endpoints Nuevos

```
POST /api/audit/log                      - Registrar acción en auditoría
GET  /api/audit/logs                     - Obtener registros
POST /api/sync/sales-point               - Sincronizar vendedor
POST /api/sync/impl-point                - Sincronizar implementación
POST /api/sync/cancel-point              - Sincronizar cancelación
POST /api/client/delete-documented       - Eliminar con documentación
GET  /api/client/deleted                 - Ver eliminados
POST /api/sales/sync-vendedores          - Sincronizar roles
```

### Estado Actual

```
📊 Sistema: ✅ COMPLETAMENTE FUNCIONAL
🖥️ Servidor: ✅ http://localhost:3000
📝 Auditoría: ✅ ACTIVA
🔗 ClickUp: ✅ 3-POINT SYNC
👥 Roles: ✅ SINCRONIZADOS
🔒 Eliminaciones: ✅ PROTEGIDAS
```

---

### 🎯 Casos de Uso

#### Caso 1: Asignar Vendedor
```
1. Abres ficha de cliente
2. Selecciona vendedor
3. Click en "Sincronizar a ClickUp"
4. Sistema:
   ✅ Actualiza ClickUp
   ✅ Registra en auditoría
   ✅ Notifica a otros usuarios en tiempo real
```

#### Caso 2: Iniciar Implementación
```
1. Cliente entra a fase de kickoff
2. Asigna implementador
3. Sistema:
   ✅ Cambia status a "EN IMPLEMENTACION" en ClickUp
   ✅ Registra fecha de inicio
   ✅ Auditoría completa
```

#### Caso 3: Cancelación
```
1. Cliente quiere cancelar
2. Completa: motivo + documentación
3. Sistema:
   ✅ Status → CANCELADO en ClickUp
   ✅ Auditoría INMUTABLE
   ✅ Nadie puede deshacer sin admin
```

#### Caso 4: Eliminar Duplicado
```
1. Detecto cliente duplicado
2. Intento eliminar
3. Sistema REQUIERE documentación
4. Ingreso razón + ticket
5. Sistema:
   ✅ Soft-delete (no pierde data)
   ✅ Se puede recuperar si es necesario
   ✅ Auditoría registra todo
```

---

### 📚 Documentación Completa

1. **IMPLEMENTATION_GUIDE.md** - Guía de implementación técnica
2. **VERIFICATION_TESTS.md** - Tests para verificar que todo funciona
3. **QUICK_START.md** - Este archivo (guía rápida)

---

**Versión**: 2.0
**Estado**: ✅ PRODUCCIÓN
**Última actualización**: 1 Abril 2026
**Soporte**: Ver console del navegador (F12) para debugging

