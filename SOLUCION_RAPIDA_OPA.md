# 🚀 SOLUCIÓN RÁPIDA: Error de Conexión Opa Suite

## TL;DR (La solución en 2 minutos)

El error `"Error de conexión / endpoint"` significa que **falta configurar la URL y Token de la API Opa**.

### ✅ Pasos rápidos:

1. **Ve a ⚙️ Configuración** (en la barra lateral)
2. **Busca "¡Hola! / Opa Suite API"** (tarjeta con 💬)
3. **Completa estos campos:**
   - **URL Base**: `https://wispro.holasuite.com/api/v1` (DEBE incluir `/api/v1` al final)
   - **Token de Acceso**: Tu token Bearer (solicita a tu admin)
   - **Workspace ID**: Déjalo vacío si no lo necesitas
4. **Haz clic en "Guardar"** ✅ 
5. **Haz clic en "Probar"** 🔌
6. **Si ves "✅ Conectado"** → ¡Listo! Sincroniza conversaciones

---

## 📋 Información Detallada

### Campos de configuración

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| **URL Base** | `https://wispro.holasuite.com` | Dominio de tu instancia Opa (sin `/api/v1`) |
| **Token** | `eyJhbGciOiJIUzI1NiI...` | Bearer token para autenticación |
| **Workspace ID** | `workspace-123` | (Opcional) Si tu Opa usa workspaces |

### ⚠️ Errores comunes

| Problema | Solución |
|----------|----------|
| ❌ "Configura la URL y Token" | Rellena ambos campos, no dejes vacío ninguno |
| ❌ "Failed to fetch" | Verifica que la URL sea accesible (abre en navegador) |
| ❌ "Error de autenticación (401/403)" | El token es inválido, solicita uno nuevo |
| ❌ "CORS error" | Contacta admin para configurar CORS en el servidor Opa |
| ❌ "Endpoint no encontrado" | La URL es incorrecta, verifica el dominio |

---

## 🔍 Prueba manual en la consola

Si los pasos anteriores no funcionan, abre **F12 → Console** y ejecuta:

```javascript
// Reemplaza con tus valores reales
const url = 'https://wispro.holasuite.com/api/v1/atendimento';
const token = 'TU_TOKEN_AQUI';

fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(data => console.log('✅ Éxito:', data))
  .catch(err => console.error('❌ Error:', err.message));
```

**Resultados posibles:**
- ✅ Ves datos en la consola → API funciona, revisa configuración del dashboard
- ❌ "Failed to fetch" → Problema de red/CORS
- ❌ "401 Unauthorized" → Token inválido
- ❌ "404 Not Found" → Endpoint/URL incorrecta

---

## 📞 Información para soporte

Si necesitas contactar al equipo de Hola Suite, proporciona:

```
URL Opa: https://wispro.holasuite.com
Dashboard corre en: [Tu dominio aquí]
Error: Failed to fetch / CORS
Pasos realizados: [Cuéntales qué intentaste]
```

---

## 🎯 Checklist final

- [ ] ¿Ingresaste URL sin `/api/v1` al final?
- [ ] ¿El token tiene el formato Bearer correcto?
- [ ] ¿Haciste clic en "Guardar"?
- [ ] ¿Esperaste a que cargue antes de probar?
- [ ] ¿Abriste consola (F12) para ver errores detallados?
- [ ] ¿La URL es accesible desde tu navegador?
- [ ] ¿Revisaste que el token no esté expirado?

---

## 📚 Próximas características (una vez conectado)

✅ Ver conversaciones en tiempo real  
✅ Filtrar por estado (críticas, advertencias, resueltas)  
✅ Sincronizar automáticamente  
✅ Métricas de atención  
✅ Webhook para Slack  
