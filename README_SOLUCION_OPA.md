# 📋 Documentación - Error de Conexión Opa Suite

**Estado:** ✅ Solucionado (Guías de configuración completadas)  
**Última actualización:** 2024

---

## 📁 Archivos de documentación creados

### 1. **SOLUCION_RAPIDA_OPA.md** ⚡ (EMPEZA AQUÍ)
   - ✅ Solución en 2 minutos
   - ✅ Pasos exactos qué hacer
   - ✅ Errores comunes y soluciones
   - **Este archivo es para leer primero**

### 2. **FLUJO_CONEXION_OPA.md** 🔗
   - 📊 Diagrama visual del flujo
   - 🔍 Pruebas manuales en consola
   - 💾 Estructura de localStorage
   - Para entender cómo funciona internamente

### 3. **EJEMPLOS_CONFIGURACION.md** 🎯
   - 5 escenarios diferentes de instalación
   - Troubleshooting específico por error
   - Cómo obtener token según plataforma
   - Para diferentes tipos de setup

### 4. **OPA_CONNECTION_GUIDE.md** 📖
   - Guía completa y detallada
   - Explicación de cada campo
   - Verificación manual
   - Para referencia general

---

## 🎯 Tu problema específico

### Error recibido:
```
❌ Error de conexión / endpoint
Failed to fetch desde: https://wispro.holasuite.com
Endpoints intentados: /atendimento, /conversations, /chats
```

### Causa raíz:
✓ URL no configurada en el campo `cfgHolaUrl`  
✓ Token no configurado en el campo `cfgHolaToken`

### Solución:
1. Abre **⚙️ Configuración** → **¡Hola! / Opa Suite API**
2. **URL Base**: `https://wispro.holasuite.com`
3. **Token de Acceso**: [Tu token Bearer]
4. Haz clic en **"Guardar"** y luego **"Probar"**

---

## ✅ Lo que se mejoró en el código

### 1. Mensajes de error más descriptivos
```javascript
// Antes:
toast('error', 'Error: ' + e.message);

// Ahora:
if (isMissingConfig) {
  detailedMsg = '⚠️ URL o Token no configurados. Ve a Configuración';
} else if (isCorsError) {
  detailedMsg = '🔒 Error CORS o conectividad...';
} else if (is401) {
  detailedMsg = '🔐 Error de autenticación. Revisa el token';
}
```

### 2. Botón directo a Configuración
```html
Cuando falta URL/Token, muestra:
"Configura URL/Token → [Configurar]"
    ↓ (clickeable)
    Abre la sección de configuración automáticamente
```

### 3. Mejor diagnóstico en testHolaApi()
```javascript
// Ahora detecta y explica:
- ✅ Conexión exitosa
- ❌ Configuración incompleta
- 🔒 Error CORS
- 🔐 Error de autenticación (401/403)
- 📍 Endpoint no encontrado (404)
```

---

## 🚀 Próximos pasos después de conectar

Una vez que veas ✅ **"Conectado"**:

1. ✅ Las conversaciones de Opa aparecerán en la sección OPA
2. ✅ Usa los **indicadores KPI** como **filtros**
3. ✅ Haz clic en cualquier conversación para ver detalles
4. ✅ Las **alertas** se clasifican automáticamente:
   - 🔴 Críticas (palabras en alertWords danger)
   - 🟡 Advertencias (palabras en alertWords warning)
   - ⚪ Normal

---

## 🔧 Cambios técnicos realizados

### Archivo: `dashnuevaholasuite.html`

**Función `fetchHolaConvs()` - Líneas ~4480**
- ✅ Mejores mensajes de error contextuales
- ✅ Diferencia entre falta de config vs error de conexión
- ✅ Botón directo a configuración
- ✅ Registro de errors en consola para debugging

**Función `testHolaApi()` - Líneas ~5530**
- ✅ Validación de URL y Token antes de probar
- ✅ Detecta tipo de error específico
- ✅ Mensajes de ayuda contextuales
- ✅ Console.error() con detalles para debugging

---

## 📞 Si aún no funciona

**Abre F12 (Consola) y copia estos comandos:**

```javascript
// 1. Verifica configuración
const cfg = JSON.parse(localStorage.getItem('holaCfg') || '{}');
console.log({
  url: cfg.holaUrl,
  hasToken: !!cfg.holaToken,
  workspace: cfg.holaWs
});

// 2. Verifica campos del formulario
console.log({
  formUrl: document.getElementById('cfgHolaUrl')?.value,
  formToken: document.getElementById('cfgHolaToken')?.value
});

// 3. Intenta conectar manualmente
const url = 'https://wispro.holasuite.com/api/v1/atendimento';
const token = document.getElementById('cfgHolaToken')?.value;
fetch(url, {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => console.log('Status:', r.status))
  .catch(e => console.error('Error:', e.message));
```

**Pega el resultado en soporte con info:**
- Tu dominio del dashboard
- Error que ves en consola
- Respuesta de los comandos arriba

---

## 📚 Referencia rápida

### Campos en Configuración
| ID HTML | Campo | Tipo | Requerido |
|---------|-------|------|-----------|
| `cfgHolaUrl` | URL Base | Text | ✅ Sí |
| `cfgHolaToken` | Token de Acceso | Password | ✅ Sí |
| `cfgHolaWs` | Workspace ID | Text | ❌ No |
| `cfgSlackCsWebhook` | Webhook Slack CS | Text | ❌ No |
| `cfgSlackSalesWebhook` | Webhook Slack Ventas | Text | ❌ No |

### Funciones principales
| Función | Propósito |
|---------|----------|
| `fetchHolaConvs()` | Sincroniza todas las conversaciones |
| `testHolaApi()` | Prueba la conexión |
| `renderOPA()` | Muestra conversaciones en interfaz |
| `normalizeHolaBaseUrl()` | Limpia/normaliza URL |
| `getHolaApiBases()` | Genera URLs de fallback |

---

## 💾 Datos guardados

El dashboard guarda la configuración en:
```javascript
localStorage['holaCfg'] = {
  holaUrl: "https://wispro.holasuite.com",
  holaToken: "Bearer...",
  holaWs: "workspace-id",
  // ... otros campos
}
```

Para ver:
```javascript
console.log(JSON.parse(localStorage.getItem('holaCfg')));
```

Para limpiar (en caso de problemas):
```javascript
localStorage.removeItem('holaCfg');
location.reload();
```

---

## ✨ Resumen

| Antes | Después |
|-------|---------|
| ❌ Error genérico sin detalles | ✅ Errores específicos con contexto |
| ❌ "Error: undefined" | ✅ "🔒 Error CORS - Verifica URL..." |
| ❌ No había forma rápida a Config | ✅ Botón directo desde error |
| ❌ Mensajes en inglés + genéricos | ✅ Mensajes claros con emojis |

---

## 🎓 Para aprender más

Revisa estos archivos en orden:
1. **SOLUCION_RAPIDA_OPA.md** - Soluciona rápido
2. **FLUJO_CONEXION_OPA.md** - Entiende cómo funciona
3. **EJEMPLOS_CONFIGURACION.md** - Tu caso específico
4. **OPA_CONNECTION_GUIDE.md** - Referencia completa

---

**¿Necesitas ayuda?** Revisa el archivo que corresponde a tu situación o contacta soporte con:
- Tu URL de dashboard
- El error específico que ves
- Resultado de F12 → Console
