# 💻 Ejemplos de Código — Real-Time Sync

## Ejemplo 1: Iniciar y Detener Sincronización

### Iniciar automáticamente al cargar el dashboard

```javascript
// En el evento window.onload o document.ready:
window.addEventListener('load', () => {
  // Verificar si está configurado
  const apiKey = document.getElementById('cfgClickupApiKey')?.value;
  const listId = document.getElementById('cfgClickupListId')?.value;
  
  if (apiKey && listId) {
    // Iniciar automáticamente
    startRealTimeSync();
    console.log('✅ Sincronización iniciada automáticamente');
  } else {
    console.log('⚠️ Configura API Key y List ID primero');
  }
});
```

### Iniciar con intervalo personalizado

```javascript
// Iniciar con polling cada 5 segundos
APP.realtimeSync.pollInterval = 5000;
startRealTimeSync();

// Luego detener y reiniciar después de 10 minutos
setTimeout(() => {
  stopRealTimeSync();
  console.log('Sincronización pausada por 10 minutos');
  
  // Reanudar
  setTimeout(() => {
    startRealTimeSync();
  }, 600000); // 10 minutos
}, 600000);
```

---

## Ejemplo 2: Monitorear Cambios en Tiempo Real

### Ver cada cambio mientras sucede

```javascript
// Crear un monitor que muestre cambios cada 5 segundos
const monitor = setInterval(() => {
  const status = getSyncStatus();
  
  console.clear();
  console.log('📊 =================');
  console.log('📊 ESTADO SYNC');
  console.log('📊 =================');
  console.log('Estado:', status.enabled ? '🟢 ACTIVO' : '🔴 INACTIVO');
  console.log('Total cambios:', status.changeCount);
  console.log('Pendientes:', status.queueLength);
  console.log('Último sync:', new Date(status.lastSync).toLocaleTimeString());
  console.log('');
  console.log('Últimos 5 cambios:');
  status.lastChanges.forEach((change, idx) => {
    console.log(`${idx + 1}. ${change.field} = "${change.newValue}" (${change.status})`);
  });
}, 5000);

// Para detener el monitor:
// clearInterval(monitor);
```

### Salida esperada

```
📊 =================
📊 ESTADO SYNC
📊 =================
Estado: 🟢 ACTIVO
Total cambios: 42
Pendientes: 0
Último sync: 14:35:22

Últimos 5 cambios:
1. plan = "PRO" (synced)
2. rKickoff = "Juan" (synced)
3. email = "info@acme.com" (applied)
4. pais = "Argentina" (applied)
5. presupuesto = "5000" (synced)
```

---

## Ejemplo 3: Procesar Cambios Manualmente

### Forzar sincronización inmediata

```javascript
// Si necesitas sincronizar ahora en lugar de esperar 10 segundos:

console.log('Iniciando sincronización inmediata...');

// Paso 1: Procesar cambios locales pendientes
console.log('Paso 1: Procesando cambios locales...');
processSyncQueue();

// Paso 2: Obtener cambios de ClickUp
console.log('Paso 2: Obteniendo cambios de ClickUp...');
await pollClickUpForChanges();

// Paso 3: Verificar resultado
console.log('Paso 3: Verificando resultado...');
const status = getSyncStatus();
console.log(`✅ Sincronización completada: ${status.changeCount} cambios totales`);
```

---

## Ejemplo 4: Detectar Cambios Específicos

### Filtrar cambios por tipo

```javascript
// Cambios hechos localmente (en el dashboard)
const localChanges = APP.realtimeSync.changeLog.filter(c => c.source === 'local');
console.log('Cambios locales:', localChanges.length);
localChanges.forEach(c => {
  console.log(`  • ${c.field}: "${c.oldValue}" → "${c.newValue}"`);
});

// Cambios de ClickUp
const remoteChanges = APP.realtimeSync.changeLog.filter(c => c.source === 'clickup');
console.log('Cambios de ClickUp:', remoteChanges.length);

// Conflictos
const conflicts = APP.realtimeSync.changeLog.filter(c => c.source === 'conflict');
console.log('Conflictos resueltos:', conflicts.length);
conflicts.forEach(c => {
  console.log(`  • ${c.field}: local="${c.localValue}" vs clickup="${c.clickupValue}"`);
  console.log(`    Resolución: ${c.resolution}`);
});

// Cambios por cliente
const clientChanges = {};
APP.realtimeSync.changeLog.forEach(change => {
  if (!clientChanges[change.clientId]) {
    clientChanges[change.clientId] = 0;
  }
  clientChanges[change.clientId]++;
});
console.log('Cambios por cliente:', clientChanges);
```

---

## Ejemplo 5: Manejo de Errores

### Reintentar sincronización fallida

```javascript
// Función para reintentar con backoff exponencial
async function retrySyncWithBackoff(maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Intento ${attempt}/${maxRetries}...`);
      
      // Intentar procesar queue
      await processSyncQueue();
      
      console.log('✅ Sincronización exitosa');
      return true;
    } catch (error) {
      console.error(`❌ Intento ${attempt} falló:`, error.message);
      
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1);
        console.log(`⏳ Reintentar en ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.error('❌ Sincronización falló después de 3 intentos');
  return false;
}

// Usar:
await retrySyncWithBackoff();
```

---

## Ejemplo 6: Webhook-like Notifications

### Notificar cuando un campo específico cambia

```javascript
// Crear una función que monitoree cambios en un campo específico
function watchField(fieldName, callback) {
  const checkInterval = setInterval(() => {
    const recentChanges = APP.realtimeSync.changeLog.slice(-1);
    
    recentChanges.forEach(change => {
      if (change.field === fieldName && !change._notified) {
        change._notified = true;
        callback(change);
      }
    });
  }, 1000);
  
  return () => clearInterval(checkInterval); // Retornar función para desuscribirse
}

// Usar:
const unwatch = watchField('plan', (change) => {
  console.log(`📢 Plan cambió a: ${change.newValue}`);
  console.log(`   Cliente: ${APP.data.find(c => c.id === change.clientId)?.nombre}`);
  console.log(`   Fuente: ${change.source}`);
});

// Para dejar de escuchar:
// unwatch();
```

---

## Ejemplo 7: Exportar Historial de Cambios

### Generar reporte CSV de sincronizaciones

```javascript
function exportSyncLogToCSV() {
  const headers = ['Timestamp', 'Fuente', 'Cliente', 'Campo', 'Valor Anterior', 'Valor Nuevo', 'Estado', 'Resolución'];
  
  const rows = APP.realtimeSync.changeLog.map(change => {
    const client = APP.data.find(c => c.id === change.clientId);
    return [
      new Date(change.timestamp).toLocaleString(),
      change.source || 'local',
      client?.nombre || change.clientId,
      change.field,
      change.oldValue || '—',
      change.newValue || '—',
      change.status || '—',
      change.resolution || '—'
    ];
  });
  
  // Convertir a CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Descargar
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sync-log-${new Date().toISOString()}.csv`;
  a.click();
  
  console.log('✅ Historial exportado a CSV');
}

// Usar:
exportSyncLogToCSV();
```

---

## Ejemplo 8: Dashboard de Estadísticas

### Mostrar métricas de sincronización

```javascript
function displaySyncDashboard() {
  const stats = {
    total: APP.realtimeSync.changeLog.length,
    local: APP.realtimeSync.changeLog.filter(c => c.source === 'local').length,
    clickup: APP.realtimeSync.changeLog.filter(c => c.source === 'clickup').length,
    conflicts: APP.realtimeSync.changeLog.filter(c => c.source === 'conflict').length,
    synced: APP.realtimeSync.changeLog.filter(c => c.status === 'synced').length,
    applied: APP.realtimeSync.changeLog.filter(c => c.status === 'applied').length,
  };
  
  // Agrupar por campo
  const byField = {};
  APP.realtimeSync.changeLog.forEach(c => {
    byField[c.field] = (byField[c.field] || 0) + 1;
  });
  
  // Agrupar por cliente
  const byClient = {};
  APP.realtimeSync.changeLog.forEach(c => {
    const clientName = APP.data.find(cl => cl.id === c.clientId)?.nombre || c.clientId;
    byClient[clientName] = (byClient[clientName] || 0) + 1;
  });
  
  console.log('📊 ================== ESTADÍSTICAS ===================');
  console.log(`Total de cambios:       ${stats.total}`);
  console.log(`  ├─ Locales:           ${stats.local}`);
  console.log(`  ├─ De ClickUp:        ${stats.clickup}`);
  console.log(`  └─ Conflictos:        ${stats.conflicts}`);
  console.log(`Sincronizados:          ${stats.synced}`);
  console.log(`Aplicados:              ${stats.applied}`);
  
  console.log('\n📋 Cambios por campo:');
  Object.entries(byField).forEach(([field, count]) => {
    console.log(`  • ${field}: ${count}`);
  });
  
  console.log('\n👥 Cambios por cliente (Top 5):');
  Object.entries(byClient)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .forEach(([client, count]) => {
      console.log(`  • ${client}: ${count}`);
    });
    
  console.log('====================================================');
  
  return stats;
}

// Usar:
displaySyncDashboard();
```

---

## Ejemplo 9: Sincronización Selectiva

### Sincronizar solo ciertos clientes

```javascript
async function syncSpecificClients(clientIds) {
  const changes = APP.realtimeSync.queue.filter(c => clientIds.includes(c.clientId));
  
  console.log(`Sincronizando ${changes.length} cambios de ${clientIds.length} clientes...`);
  
  for (const change of changes) {
    try {
      const client = APP.data.find(c => c.id === change.clientId);
      const clickupField = mapLocalFieldToClickUp(change.field);
      const apiKey = document.getElementById('cfgClickupApiKey')?.value;
      
      if (client && clickupField && apiKey) {
        await updateClickUpField(
          client.clickupTaskId,
          clickupField,
          change.newValue,
          apiKey
        );
        console.log(`✅ ${client.nombre}.${change.field} sincronizado`);
      }
    } catch (error) {
      console.error(`❌ Error sincronizando ${change.clientId}:`, error);
    }
  }
}

// Usar: Sincronizar solo los cambios de dos clientes
// syncSpecificClients(['client-123', 'client-456']);
```

---

## Ejemplo 10: Integración con Notificaciones del Navegador

### Notificar al usuario cuando hay cambios importantes

```javascript
function enableBrowserNotifications() {
  // Solicitar permiso
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  
  // Monitorear cambios
  const checkInterval = setInterval(() => {
    const lastChange = APP.realtimeSync.changeLog[APP.realtimeSync.changeLog.length - 1];
    
    if (lastChange && !lastChange._notified) {
      lastChange._notified = true;
      
      const client = APP.data.find(c => c.id === lastChange.clientId);
      const title = `${client?.nombre || 'Cliente'} actualizado`;
      const body = `${lastChange.field}: ${lastChange.newValue}`;
      
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: '/favicon.ico',
          tag: 'sync-notification'
        });
      }
    }
  }, 2000);
  
  return () => clearInterval(checkInterval);
}

// Usar:
// const stopNotifications = enableBrowserNotifications();
// Para detener: stopNotifications();
```

---

## Ejemplo 11: Guardar Backup Periódico

### Guardar respaldo del estado sincronizado

```javascript
function createSyncBackup() {
  const backup = {
    timestamp: Date.now(),
    data: APP.data,
    syncLog: APP.realtimeSync.changeLog,
    status: getSyncStatus()
  };
  
  // Comprimir
  const compressed = compressData(backup);
  
  // Guardar en localStorage con timestamp
  const key = `syncBackup_${Date.now()}`;
  localStorage.setItem(key, compressed);
  
  console.log(`✅ Backup guardado: ${key}`);
  
  return key;
}

// Crear backup automático cada 30 minutos
setInterval(() => {
  createSyncBackup();
  console.log('⏱️ Backup periódico creado');
}, 30 * 60 * 1000);
```

---

## Ejemplo 12: Comparación de Estados

### Ver exactamente qué cambió entre dos momentos

```javascript
function compareStates(oldState, newState) {
  const differences = [];
  
  newState.forEach(newItem => {
    const oldItem = oldState.find(item => item.id === newItem.id);
    
    if (!oldItem) {
      differences.push({
        type: 'NUEVO',
        id: newItem.id,
        changes: newItem
      });
      return;
    }
    
    const changes = {};
    for (const key in newItem) {
      if (oldItem[key] !== newItem[key]) {
        changes[key] = {
          before: oldItem[key],
          after: newItem[key]
        };
      }
    }
    
    if (Object.keys(changes).length > 0) {
      differences.push({
        type: 'MODIFICADO',
        id: newItem.id,
        changes: changes
      });
    }
  });
  
  return differences;
}

// Usar:
const changes = compareStates(
  JSON.parse(APP.realtimeSync.lastLocalState || '[]'),
  APP.data
);

console.log('Cambios detectados:');
changes.forEach(change => {
  console.log(`${change.type}: ${change.id}`);
  if (change.type === 'MODIFICADO') {
    Object.entries(change.changes).forEach(([field, values]) => {
      console.log(`  ${field}: "${values.before}" → "${values.after}"`);
    });
  }
});
```

---

## Ejemplo 13: Rate Limiting Manual

### Controlar la velocidad de sincronización

```javascript
class SyncRateLimiter {
  constructor(maxPerSecond = 1) {
    this.maxPerSecond = maxPerSecond;
    this.timestamps = [];
  }
  
  async waitIfNeeded() {
    const now = Date.now();
    const oneSecondAgo = now - 1000;
    
    // Limpiar timestamps antiguos
    this.timestamps = this.timestamps.filter(t => t > oneSecondAgo);
    
    if (this.timestamps.length >= this.maxPerSecond) {
      const oldestTimestamp = this.timestamps[0];
      const waitTime = oldestTimestamp + 1000 - now + 10;
      console.log(`⏳ Rate limit: esperando ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.timestamps.push(Date.now());
  }
}

// Usar:
const limiter = new SyncRateLimiter(5); // 5 cambios/segundo máximo

async function syncWithRateLimit(changes) {
  for (const change of changes) {
    await limiter.waitIfNeeded();
    console.log(`Sincronizando: ${change.field}`);
    // Hacer sync...
  }
}
```

---

**Nota:** Todos estos ejemplos usan las funciones disponibles en el sistema de sincronización. Ejecútalos en la consola del navegador (F12) mientras el dashboard está abierto.
