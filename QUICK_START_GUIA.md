# 🚀 QUICK START - Comandos & Accesos Rápidos

---

## ⚡ VERIFICAR QUE TODO FUNCIONA

```bash
# Ejecutar script de verificación
cd /home/ixcsoft/Dashboard\ -\ Hola\ suite
bash verify_endpoints.sh

# Resultado esperado: ✅ Todos los endpoints respondiendo
```

---

## 🌐 ACCESO AL DASHBOARD

```
http://localhost:3000
```

---

## 📂 DIRECTORIO DE ARCHIVOS

```bash
cd /home/ixcsoft/Dashboard\ -\ Hola\ suite
```

### Archivos principales:
- `server.js` - Backend con endpoints
- `vylex.html` - Frontend con funciones
- `sales_config.json` - Datos de consultores/implementadores
- `audit_logs.json` - Registro de auditoría

### Documentación:
- `README_AUDITORIA.md` - Guía rápida
- `CHANGELOG_SISTEMA_AUDITORIA.md` - Detalles técnicos
- `GUIA_INTEGRACION_AUDITORIA.md` - Ejemplos de código
- `RESUMEN_FINAL_VERIFICACION.md` - Este resumen

---

## 🔧 COMANDOS DEL SERVIDOR

### Iniciar servidor
```bash
cd /home/ixcsoft/Dashboard\ -\ Hola\ suite
node server.js
```

### Verificar sintaxis
```bash
node -c server.js
# Sin errores = correcto
```

### Detener servidor
```bash
pkill -f "node server.js"
```

### Ver logs
```bash
tail -f /tmp/server.log
```

---

## 📡 ENDPOINTS DISPONIBLES

### Auditoría
```bash
# Registrar cambio
curl -X POST http://localhost:3000/api/audit/log \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "ASSIGN_VENDOR",
    "entityType": "cliente",
    "entityId": "task_123",
    "field": "rVenta",
    "oldValue": "Pedro",
    "newValue": "Juan",
    "reason": "Cambio de responsable"
  }'

# Obtener auditoría
curl -X GET http://localhost:3000/api/audit/logs \
  -H "Authorization: Bearer $TOKEN"
```

### Sincronización con ClickUp

```bash
# Sincronizar vendedor
curl -X POST http://localhost:3000/api/sync/sales-point \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task_123",
    "vendor": "Juan",
    "clientName": "Acme Corp"
  }'

# Sincronizar implementación
curl -X POST http://localhost:3000/api/sync/impl-point \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task_123",
    "implementador": "Carlos",
    "startDate": "2024-01-15"
  }'

# Sincronizar cancelación
curl -X POST http://localhost:3000/api/sync/cancel-point \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task_123",
    "reason": "Cliente solicitó",
    "cancelledBy": "usuario@email.com"
  }'
```

### Clientes

```bash
# Eliminar con documentación
curl -X POST http://localhost:3000/api/client/delete-documented \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "task_123",
    "reason": "Empresa cerró",
    "documentation": "Noticia en LinkedIn"
  }'

# Obtener clientes eliminados
curl -X GET http://localhost:3000/api/client/deleted \
  -H "Authorization: Bearer $TOKEN"

# Sincronizar consultores/implementadores
curl -X POST http://localhost:3000/api/sales/sync-vendedores \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💻 FUNCIONES JAVASCRIPT EN FRONTEND

### Auditoría
```javascript
// Registrar cambio
await logAuditAction(
  'EDIT_FIELD',           // Acción
  'cliente',              // Tipo
  'task_123',             // ID
  'nombre',               // Campo
  'Anterior',             // Valor anterior
  'Nuevo',                // Valor nuevo
  'Razón del cambio'      // Razón
);

// Obtener logs
const logs = await getAuditLogs();

// Obtener eliminados
const deleted = await getDeletedClients();
```

### Sincronización
```javascript
// Sincronizar vendedor
await syncSalesPoint('task_123', 'Juan', 'Acme Corp');

// Sincronizar implementación
await syncImplementationPoint('task_123', 'Carlos', '2024-01-15');

// Sincronizar cancelación
await syncCancellationPoint('task_123', 'Razón', 'usuario@email.com');

// Eliminar con documentación
await deleteClientWithDocumentation(
  'task_123',
  'Razón eliminación',
  'Documentación'
);

// Sincronizar roles desde ClickUp
await syncRolesFromClickUp();
```

---

## 📊 VER DATOS

### Ver consultores
```bash
cat sales_config.json | grep -A5 '"consultores"'
```

### Ver implementadores
```bash
cat sales_config.json | grep -A5 '"implementadores"'
```

### Ver auditoría (últimas 10 líneas)
```bash
tail -10 audit_logs.json
```

### Ver clientes eliminados
```bash
cat sales_config.json | grep -A10 '"deletedClients"'
```

---

## 🔑 VARIABLES DE ENTORNO (.env)

```
CLICKUP_API_KEY=pk_xxxxxx
CLICKUP_LIST_ID=9002104190
JWT_SECRET=tu_secreto_aqui
CACHE_TTL=3600
PORT=3000
```

---

## 📈 MONITOREO

### Chequear proceso
```bash
ps aux | grep "node server.js" | grep -v grep
```

### Revisar puerto 3000
```bash
lsof -i :3000
```

### Ver último reinicio
```bash
ps aux | grep node | awk '{print $9}'
```

---

## 🐛 TROUBLESHOOTING

### Error: "Address already in use"
```bash
# Puerto 3000 está en uso
pkill -f "node server.js"
# Esperar 2-3 segundos y reiniciar
node server.js
```

### Error: "ENOENT: no such file or directory"
```bash
# Verificar que estás en el directorio correcto
cd /home/ixcsoft/Dashboard\ -\ Hola\ suite
ls -la
```

### Error: "Token inválido"
```bash
# Si es esperado (en curl sin token) es normal
# Verificar que tienes token válido en localStorage
localStorage.getItem('access_token')
```

### Error de sintaxis en server.js
```bash
# Verificar
node -c server.js

# Si hay error, revisar líneas indicadas
```

---

## 📚 DOCUMENTOS DE REFERENCIA

| Documento | Para qué | Leer si... |
|-----------|----------|-----------|
| README_AUDITORIA.md | Visión general | Necesitas entender qué se hizo |
| CHANGELOG_SISTEMA_AUDITORIA.md | Detalles técnicos | Necesitas entender cómo funciona |
| GUIA_INTEGRACION_AUDITORIA.md | Ejemplos de código | Necesitas integrar en tus modales |
| RESUMEN_FINAL_VERIFICACION.md | Verificación completa | Necesitas validar que todo funcione |
| Este archivo | Acceso rápido | Necesitas comandos al momento |

---

## ⏱️ TIEMPOS APROXIMADOS

| Acción | Tiempo |
|--------|--------|
| Iniciar servidor | 2-3 segundos |
| Sincronizar con ClickUp | 1-2 segundos |
| Registrar en auditoría | <1 segundo |
| Obtener logs de auditoría | <1 segundo |
| Eliminar cliente | 1-2 segundos |

---

## 🎯 CHECKLIST DIARIO

- [ ] Servidor corriendo: `ps aux | grep node`
- [ ] Puerto 3000 activo: `curl http://localhost:3000`
- [ ] Sin errores: `tail -20 /tmp/server.log`
- [ ] Auditoría funcionando: Ver últimos logs en audit_logs.json

---

## 📞 CONTACTO & SOPORTE

Si algo no funciona:

1. **Revisar logs:** `tail -f /tmp/server.log`
2. **Revisar console:** F12 → Console en browser
3. **Verificar endpoints:** `bash verify_endpoints.sh`
4. **Leer documentación:** Ver archivos .md

---

**Última actualización:** Enero 2024
**Versión:** 2.0
