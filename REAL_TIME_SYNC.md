# 🔄 Sincronización en Tiempo Real con ClickUp

## ¿Qué es?

Sistema de sincronización automática bidireccional entre el dashboard y ClickUp que detecta y aplica cambios cada 10 segundos sin necesidad de recargar la página.

## Características

✅ **Polling Automático** - Cada 10 segundos verifica cambios en ClickUp  
✅ **Detección de Cambios Locales** - Detecta cambios que haces en el dashboard  
✅ **Cola de Sincronización** - Gestiona cambios pendientes con reintentos  
✅ **Notificaciones** - Toast alerts en tiempo real  
✅ **Log de Cambios** - Historial completo de todas las sincronizaciones  
✅ **Manejo de Conflictos** - Estrategia: ClickUp gana (fuente de verdad)  

## Cómo Usar

### 1. Iniciar Sincronización

1. Ve a la sección **Sincronización** del dashboard
2. Busca el botón **"⚡ Iniciar Sync en Vivo"**
3. Haz clic para activar la sincronización

```javascript
startRealTimeSync(); // Inicia polling cada 10s
```

### 2. Detener Sincronización

1. El botón cambia a **"Detener Sync"** cuando está activo
2. Haz clic para pausar

```javascript
stopRealTimeSync(); // Detiene el polling
```

### 3. Ver Historial

Haz clic en el botón **"Log"** para ver los últimos 20 cambios sincronizados:
- Fuente (local/clickup)
- Timestamp exacto
- Cliente afectado
- Campo y valor nuevo
- Estado (synced/applied)

## Datos Sincronizados

Los siguientes campos se sincronizan automáticamente:

| Campo | Tipo | Sync Bidireccional |
|-------|------|-------------------|
| rKickoff | Text | ✅ |
| rVer | Text | ✅ |
| rCap | Text | ✅ |
| rGoLive | Text | ✅ |
| rAct | Text | ✅ |
| rVenta | Text | ✅ |
| plan | Select | ✅ |
| pais | Text | ✅ |
| email | Email | ✅ |
| telefono | Tel | ✅ |
| presupuesto | Currency | ✅ |
| tipoCliente | Select | ✅ |
| industria | Text | ✅ |

## Cómo Funciona

### Fase 1: Detección de Cambios

**Cambios Locales (Dashboard)**
```
1. Usuario edita un campo en el dashboard
2. Evento "change" dispara detectAndQueueLocalChanges()
3. Se compara APP.data con última versión conocida
4. Los cambios se agregan a APP.realtimeSync.queue
```

**Cambios Remotos (ClickUp)**
```
1. Polling cada 10 segundos llama pollClickUpForChanges()
2. Busca cambios comparando custom_fields
3. Si hay cambios, se aplican inmediatamente al dashboard
4. Se muestra notificación toast
```

### Fase 2: Sincronización

```javascript
// Cada 10 segundos:
1. pollClickUpForChanges()    // Obtener cambios de ClickUp
   ├─ Detectar cambios vs última sync
   ├─ Aplicar cambios al APP.data
   └─ Mostrar notificaciones

2. processSyncQueue()         // Procesar cambios locales pendientes
   ├─ Mapear campos locales a custom fields de ClickUp
   ├─ Enviar PUT request a ClickUp API
   ├─ Registrar en change log
   └─ Reintentar si falla
```

### Fase 3: Manejo de Conflictos

**Estrategia: ClickUp Gana**

Si tanto el dashboard como ClickUp cambian el mismo campo:
```
Local:   "Juan Pérez"
ClickUp: "Juan Carlos Pérez"

Resultado: Se acepta "Juan Carlos Pérez" de ClickUp
Razón: ClickUp es la fuente de verdad del sistema
```

Se registra el conflicto en `APP.realtimeSync.changeLog`:
```javascript
{
  source: 'conflict',
  clientId: 'client123',
  field: 'nombre',
  localValue: 'Juan Pérez',
  clickupValue: 'Juan Carlos Pérez',
  resolution: 'clickup_wins',
  timestamp: 1642345234000
}
```

## API Status

### Estado de Sincronización

```javascript
const status = getSyncStatus();
{
  enabled: true,
  lastSync: 1642345234000,
  queueLength: 0,
  changeCount: 42,
  pollInterval: 10000,
  lastChanges: [
    { source: 'local', clientId: 'c1', field: 'plan', newValue: 'PRO', status: 'synced' },
    { source: 'clickup', clientId: 'c2', field: 'rKickoff', newValue: 'Juan', status: 'applied' }
  ]
}
```

### Ver Log Completo

```javascript
viewSyncLog(); // Abre alerta con últimos 20 cambios
```

## Requisitos

✅ **API Key ClickUp** - Configurado en Configuración  
✅ **List ID** - ID del listado ClickUp a sincronizar  
✅ **Conexión de Internet** - Para acceder a ClickUp API  

### Configurar Credenciales

1. Ve a **Configuración** → **ClickUp**
2. Pega tu **API Key** (obtén en https://app.clickup.com/settings/apps/integrations)
3. Ingresa el **List ID** del listado ClickUp

## Características Avanzadas

### Cambiar Intervalo de Polling

```javascript
APP.realtimeSync.pollInterval = 5000; // 5 segundos (más rápido)
// o
APP.realtimeSync.pollInterval = 30000; // 30 segundos (más eficiente)

// Reiniciar para aplicar cambios
stopRealTimeSync();
startRealTimeSync();
```

### Inspeccionar Cola de Cambios

```javascript
console.log('Cambios pendientes:', APP.realtimeSync.queue);
// [
//   { type: 'update', clientId: 'c1', field: 'plan', newValue: 'PRO', timestamp: ... },
//   { type: 'update', clientId: 'c2', field: 'rVer', newValue: 'Juan', timestamp: ... }
// ]
```

### Ver Mapeador de Campos

```javascript
mapLocalFieldToClickUp('plan');      // → 'plan'
mapClickUpFieldToLocal('rKickoff');  // → 'rKickoff'
```

## Troubleshooting

### Sincronización No Inicia

**Problema:** Botón no hace nada o error en consola

**Solución:**
```javascript
// Verificar configuración
const apiKey = document.getElementById('cfgClickupApiKey')?.value;
const listId = document.getElementById('cfgClickupListId')?.value;

if (!apiKey) console.error('❌ API Key no configurada');
if (!listId) console.error('❌ List ID no configurado');
```

### Cambios No Se Sincronizan

**Problema:** Edito un cliente pero no aparece en ClickUp

**Solución:**
```javascript
// Ver estado
const status = getSyncStatus();
if (status.queueLength > 0) {
  console.log('⏳ Hay cambios en la cola esperando sincronización');
  console.log('Cambios:', APP.realtimeSync.queue);
}

// Procesar inmediatamente
processSyncQueue();
```

### Conflictos Constantemente

**Problema:** Mismo campo se actualiza en ambos lados todo el tiempo

**Solución:**
1. Decide dónde actualizar (dashboard o ClickUp)
2. No edites en ambos lados simultáneamente
3. Espera a que la notificación confirme la sincronización

## Métricas y Monitoring

### Performance

Los cambios de sincronización deben tomar < 200ms:
```javascript
const log = APP.realtimeSync.changeLog;
const avgTime = log.reduce((sum, change) => sum + (change.timestamp), 0) / log.length;
console.log(`Tiempo promedio de sincronización: ${avgTime}ms`);
```

### Cambios Totales

```javascript
const totalChanges = APP.realtimeSync.changeLog.length;
const syncedChanges = APP.realtimeSync.changeLog.filter(c => c.status === 'synced').length;
const appliedChanges = APP.realtimeSync.changeLog.filter(c => c.status === 'applied').length;

console.log(`Total: ${totalChanges}, Enviados: ${syncedChanges}, Aplicados: ${appliedChanges}`);
```

## Límites y Restricciones

- **Intervalo mínimo:** 5 segundos (evitar rate limiting de ClickUp)
- **Cambios por ciclo:** 5 cambios máximo (para no sobrecargar API)
- **Reintentos:** 3 intentos máximo por cambio fallido
- **Caché de sincronización:** Se limpia cada 24 horas

## Próximas Mejoras

🔲 WebSockets para actualizaciones instantáneas  
🔲 Batch API para sincronizar múltiples cambios  
🔲 Offline mode con sync cuando hay conexión  
🔲 Encriptación de credenciales en localStorage  
🔲 Dashboard de analytics de sincronización  

## Soporte

Si encuentras problemas:

1. **Abre la consola** (F12) y busca errores rojos
2. **Ver Log de Cambios** - Haz clic en el botón "Log"
3. **Revisa Credenciales** - Asegúrate que API Key y List ID sean correctos
4. **Reinicia Sync** - Detén y vuelve a iniciar

---

**Última actualización:** 2024  
**Versión:** 1.0  
**Estado:** ✅ Producción
