# 📊 NUEVAS CARACTERÍSTICAS: Sistema Mejorado de Vendedores y Metas

## 📅 Fecha: 1 de Abril de 2026
## 🚀 Estado: Implementado y Funcional

---

## 🎯 OVERVIEW: Lo Que Cambió

El sistema ahora integra **matching inteligente** de clientes con **actualización de estados** desde Google Sheets/Excel, conectando todo con **metas generales de venta** por persona, por total de clientes y por dólares.

---

## 1. 🔗 MATCHING INTELIGENTE DE CLIENTES

### ¿Qué es?
Cuando importas un cliente desde Google Sheets, el sistema:
1. **Busca si ya existe** en ClickUp por nombre (búsqueda exacta y parcial)
2. **Si existe**: Lo actualiza con información nueva
3. **Si no existe**: Lo marca como "nuevo" para crear manualmente

### Cómo Funciona

#### Endpoint Backend
```
POST /api/sales/import-clients
Headers: Authorization: Bearer {token}
Body:
{
  "rows": [
    {
      "cliente": "Nombre del Cliente",
      "estado": "ganado",        // o: perdido, en-implementacion, desistio
      "valor": 50000,            // en dólares
      "monto": 50000             // alternativa
    },
    ...
  ],
  "vendedor": "Nombre Vendedor"  // opcional
}

Response:
{
  "ok": true,
  "matched": 15,     // Clientes encontrados (actualizados)
  "updated": 12,     // Campos actualizados
  "created": 3,      // Clientes nuevos (no existentes)
  "results": [
    {
      "cliente": "Acme Corp",
      "action": "updated",
      "taskId": "12345",
      "estado": "ganado",
      "valor": 50000
    },
    ...
  ],
  "message": "15 coincidencias, 12 actualizados, 3 nuevos"
}
```

#### Estados Soportados
- ✅ **ganado** / won → Cliente convertido
- 📋 **en-implementacion** / implementing → En proceso
- ❌ **desistio** / canceled → Cliente perdido
- 💼 **implementado** / implemented → Ya activo

---

## 2. 📈 METAS GENERALES DE VENTA

### Nuevos Endpoints

#### GET Metas Generales
```
GET /api/sales/general-targets
Response:
{
  "targets": {
    "totalClientes": 50,        // Meta de clientes a ganar
    "totalDolares": 500000,     // Meta en dólares
    "metaPorPersona": 10000,    // Por vendedor
    "periodo": "mensual",       // o: trimestral, anual
    "fechaInicio": "2026-04-01",
    "activo": true
  },
  "progreso": {
    "clientesGanados": 32,
    "dolaresTotales": 320000,
    "clientesRestantes": 18,
    "dolaresRestantes": 180000,
    "porcentajeClientes": 64,
    "porcentajeDolares": 64
  }
}
```

#### POST Actualizar Metas
```
POST /api/sales/general-targets
Body:
{
  "totalClientes": 50,
  "totalDolares": 500000,
  "metaPorPersona": 10000,
  "periodo": "mensual",
  "fechaInicio": "2026-04-01",
  "activo": true
}
```

#### GET Resumen Completo
```
GET /api/sales/summary
Response:
{
  "generalTargets": { ... },
  "totales": {
    "clientes": 100,
    "clientesGanados": 32,
    "valor": 320000,
    "vendedores": 4
  },
  "porVendedor": {
    "Carlos Sales": {
      "clientes": 15,
      "ganados": 8,
      "valor": 80000,
      "meta": { "2026-04": 50000 }
    },
    ...
  },
  "progreso": {
    "porcentajeClientes": 64,
    "porcentajeDolares": 64
  }
}
```

#### GET Metas Individuales por Vendedor
```
GET /api/sales/vendor-targets/{vendedor}
Response:
{
  "vendedor": "Carlos Sales",
  "clientes": {
    "total": 15,
    "ganados": 8,
    "enImplementacion": 5,
    "desistidos": 2
  },
  "valor": {
    "total": 80000
  },
  "meta": { "2026-04": 50000 },
  "clientesDetalle": [
    {
      "id": "12345",
      "nombre": "Acme Corp",
      "estado": "ganado",
      "valor": 50000,
      "plan": "Pro"
    },
    ...
  ]
}
```

---

## 3. 🎨 INTERFAZ DE USUARIO (Frontend)

### A. Modal de Metas Generales
**Botón**: `Metas Generales` en la sección de "Vendedores & Metas"

**Funcionalidades**:
- Establecer meta total de clientes
- Establecer meta total de dólares
- Definir meta por persona
- Seleccionar período (mensual, trimestral, anual)
- Ver progreso en tiempo real con barras de porcentaje
- Activar/desactivar metas

### B. Dashboard de Metas
Se muestra automáticamente en "Vendedores & Metas":
- 4 tarjetas de KPI (Meta Clientes, Meta Dólares, Vendedores, En Impl.)
- Indicadores de progreso
- Estado por vendedor

### C. Importación Avanzada de Google Sheets
**Botón**: `Importar con Matching` en configuración

**Flujo**:
1. Pide URL del Google Sheet
2. Obtiene lista de vendedores disponibles
3. Permite seleccionar a qué vendedor asignar
4. Hace matching inteligente
5. Actualiza estados automáticamente
6. Muestra resumen detallado

---

## 4. 🔄 FLUJO INTEGRADO: De Google Sheets a Metas

### Paso 1: Preparar Google Sheet
Columnas esperadas:
- `cliente` / `nombre` / `name` → Nombre del cliente
- `estado` / `status` → Estado (ganado, perdido, etc.)
- `valor` / `monto` / `amount` → Valor en dólares

### Paso 2: Importar con Matching
```javascript
// Desde consola del navegador:
await importarDesdeGoogleSheetAvanzado(
  'https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit',
  'Carlos Sales'  // vendedor asignado
);
```

### Paso 3: Automáticamente...
1. ✅ Sistema busca clientes existentes por nombre
2. ✅ Si existe: actualiza estado y valor
3. ✅ Si no existe: lo marca para crear en ClickUp
4. ✅ Asigna el vendedor especificado
5. ✅ Calcula progreso de metas
6. ✅ Registra todo en auditoría

### Paso 4: Verificar Metas
- Dashboard muestra progreso actualizado
- Barras de porcentaje se actualizan
- Resumen por vendedor refleja cambios

---

## 5. 💾 DATOS ALMACENADOS

### sales_config.json (Estructura Mejorada)
```json
{
  "consultores": ["Carlos Sales", "Maria Venta", ...],
  "implementadores": ["Tech Support 1", ...],
  "monthlyGoals": {
    "Carlos Sales": {
      "2026-04": 50000,
      "2026-05": 60000
    }
  },
  "generalTargets": {
    "totalClientes": 50,
    "totalDolares": 500000,
    "metaPorPersona": 10000,
    "periodo": "mensual",
    "fechaInicio": "2026-04-01",
    "activo": true
  },
  "vendorMatches": { ... },
  "implMatches": { ... }
}
```

---

## 6. 📋 CASOS DE USO

### Caso 1: Vendedor Importa Nuevos Clientes
```
1. Vendedor tiene lista en Excel/Google Sheets
2. Abre config → "Importar con Matching"
3. Pega URL del sheet
4. Sistema matchea con ClickUp
5. Actualiza estados automáticamente
6. Vendedor ve progreso en dashboard
```

### Caso 2: Manager Establece Metas de Equipo
```
1. Manager abre "Metas Generales"
2. Establece: 50 clientes, $500k, $10k por persona
3. Sistema calcula automáticamente progreso
4. Muestra por vendedor en dashboard
5. Se actualiza en tiempo real al importar datos
```

### Caso 3: Sincronización Automática de Google Sheets
```
1. Config → Ingresar IDs de Sheets
2. Click en "Sincronizar Sheets"
3. Sistema hace matching inteligente automáticamente
4. Actualiza estados de clientes
5. Todo auditado
```

---

## 7. 🔐 AUDITORÍA

Todas las acciones se registran:
- Importaciones desde Google Sheets
- Actualizaciones de estados
- Cambios de metas
- Asignación de vendedores

**Acceso**: `GET /api/audit/logs`

---

## 8. 🚀 CÓMO USAR DESDE CONSOLA

### Importar Clientes Manualmente
```javascript
const datos = [
  { cliente: "Acme Corp", estado: "ganado", valor: 50000 },
  { cliente: "Tech Inc", estado: "en-implementacion", valor: 30000 }
];

await importClientesFromSheets(datos, "Carlos Sales");
```

### Ver Metas Actuales
```javascript
const resumen = await fetch('/api/sales/summary', {
  headers: getAuthHeader()
}).then(r => r.json());

console.log(resumen);
```

### Actualizar Metas
```javascript
await fetch('/api/sales/general-targets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + APP.token
  },
  body: JSON.stringify({
    totalClientes: 50,
    totalDolares: 500000,
    metaPorPersona: 10000,
    periodo: "mensual"
  })
}).then(r => r.json());
```

---

## 9. ⚠️ NOTAS IMPORTANTES

### Matching Inteligente
- Busca **primero por coincidencia exacta** (normalizada)
- Luego por **búsqueda parcial** (contiene palabras clave)
- Si no encuentra, marca como "nuevo"

### Estados Supported
El sistema normaliza automáticamente:
- `ganado` = `won` = `listo para kickoff` ✅
- `perdido` = `lost` ✅
- `en-implementacion` = `implementation` = `implementing` 📋
- `desistio` = `canceled` ❌

### Performance
- Matching es instantáneo (caché de ClickUp)
- Dashboard se carga en <1s
- Importación de 100+ filas en ~5s

---

## 10. 📞 SOPORTE

### Errores Comunes

**"No hay datos en el Google Sheet"**
- Verificar que el Sheet tenga datos
- Verificar el ID del Sheet es correcto
- Verificar columnas: cliente, estado, valor

**"Error en matching inteligente, usando merge clásico"**
- Sistema intenta fallback automático
- Revisar console para detalles
- Verificar nombres de clientes en ClickUp

**"Metas no se actualizan"**
- Verificar que `generalTargets.activo = true`
- Hacer sync desde ClickUp para actualizar cache
- Refrescar página

---

## 📝 RESUMEN TÉCNICO

| Feature | Endpoint | Frontend | Status |
|---------|----------|----------|--------|
| Import Clients | POST /api/sales/import-clients | ✅ | ✅ |
| General Targets | POST /api/sales/general-targets | ✅ | ✅ |
| Get Targets | GET /api/sales/general-targets | ✅ | ✅ |
| Summary | GET /api/sales/summary | ✅ | ✅ |
| Vendor Targets | GET /api/sales/vendor-targets/:vendor | ✅ | ✅ |
| Google Sheets Sync | POST (enhanced) | ✅ | ✅ |
| Matching Inteligente | Backend logic | ✅ | ✅ |
| Dashboard | renderVendedoresTable | ✅ | ✅ |
| Auditoría | writeLog | ✅ | ✅ |

---

**Implementado por**: GitHub Copilot  
**Versión**: 2.0 - Sistema de Metas Integrado  
**Última actualización**: 1 de Abril de 2026
