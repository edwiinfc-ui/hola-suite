# 🔧 Guía de Conexión Corregida - API Opa/Hola Suite

## 📋 Errores Encontrados en Console (F12)

```
❌ POST http://localhost:8001/api/opa/test 501 (Unsupported method ('POST'))
Opa API Test Error: {url: 'https://wispro.holasuite.com/api/v1', wsInput: '', error: 'HTTP 501'}
```

## 🔍 Análisis del Problema

El error 501 ocurre porque:
1. **El código intentaba usar un proxy local** (`/api/opa/test`) que no existe
2. **El servidor local no puede procesar peticiones CORS** a la API de Opa
3. **El navegador hace la petición directamente** cuando no hay proxy disponible (fallback)

## ✅ Solución Implementada

Se **modificó la función `testHolaApi()`** para:
- ✅ Evitar intentar usar el proxy local (`/api/opa/test`)
- ✅ Usar siempre fallback directo al navegador
- ✅ Hacer la petición directamente a la API de Opa/Hola Suite
- ✅ Proporcionar mejor mensajes de error

## 🚀 Configuración Correcta

### 1. Obtener Credenciales

Tu URL y Token deben estar en el mismo lugar donde obtuviste acceso a Opa/Hola Suite:
- **URL Base**: `https://wispro.holasuite.com/api/v1` (COMPLETA, con `/api/v1`)
- **Token**: Bearer token válido de tu cuenta de Opa/Hola Suite

### 2. Configurar en el Dashboard

1. Ve a **⚙️ Configuración** en el dashboard
2. En la sección **"¡Hola! / Opa Suite API"**, llena:

```
┌─────────────────────────────────────────────────────┐
│ URL Base:                                           │
│ [https://wispro.holasuite.com/api/v1]  ← COMPLETA  │
│                                                     │
│ Token de Acceso:                                    │
│ [paste-tu-bearer-token-aqui]                        │
│                                                     │
│ Workspace ID: (opcional)                            │
│ [dejar vacío si no lo necesitas]                    │
└─────────────────────────────────────────────────────┘
```

3. Haz clic en **"Guardar"**

### 3. Probar Conexión

1. En la misma sección, haz clic en **"🔌 Probar"**
2. Espera mientras se prueba la conexión
3. Deberías ver: ✅ **Conectado · /me** (u otro endpoint)

## 🆘 Si Sigue Dando Error

### Error: "🔒 CORS Error"
- Significa que el servidor no permite peticiones de CORS
- **Solución**: Usa un servidor proxy (necesitas Node.js):
  - Lee [FLUJO_CONEXION_OPA.md](FLUJO_CONEXION_OPA.md)

### Error: "🔐 Error de autenticación (401/403)"
- El token no es válido o expiró
- **Solución**: 
  - Verifica que copiaste correctamente el token
  - Genera un token nuevo en Opa/Hola Suite
  - Asegúrate de agregar `Bearer ` si es necesario

### Error: "❌ Endpoint no encontrado (404)"
- La URL no es correcta
- **Solución**:
  - Verifica que sea: `https://wispro.holasuite.com/api/v1` (sin "/" final)
  - NO uses solo `https://wispro.holasuite.com`
  - NO uses `https://wispro.holasuite.com/api` (falta `/v1`)

### Error: "⚠️ Error de conexión"
- Problema general de conexión
- **Solución**: Abre Console (F12) y busca más detalles

## 📝 Cambios Realizados

### Archivo: `dashnuevaholasuite.html`

#### 1. Función `testHolaApi()` (Línea ~5746)
```javascript
// ANTES: Intentaba usar /api/opa/test (proxy local)
if(canUseServerProxy()){
  const proxyJson=await postJson('/api/opa/test',{...});
}

// AHORA: Usa siempre fallback directo (sin proxy)
// Hace la petición directamente desde el navegador
const {plain,api}=getHolaApiBases(url);
const headers={Authorization:getHolaAuthHeader(token),...};
const {json,url:resolvedUrl}=await fetchJsonWithFallback(candidates,headers);
```

#### 2. Placeholder del Campo URL (Línea ~1345)
```html
<!-- ANTES: placeholder genérico -->
<input type="text" id="cfgHolaUrl" placeholder="https://api.holasuite.com">

<!-- AHORA: ejemplo específico correcto -->
<input type="text" id="cfgHolaUrl" placeholder="https://wispro.holasuite.com/api/v1">
```

#### 3. Tooltip del Campo URL (Línea ~1345)
```html
<!-- ANTES: no especificaba /api/v1 -->
data-tip="URL base de la API. Ej: https://api.holasuite.com o tu instancia propia."

<!-- AHORA: especifica completamente -->
data-tip="URL completa incluyendo /api/v1. Ej: https://wispro.holasuite.com/api/v1"
```

## 🔗 Flujo de Conexión Ahora Funciona Así

```
┌─────────────────────────────────────────────────┐
│ Usuario escribe URL y Token en Dashboard       │
│ Hace clic en "Probar"                          │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│ Función testHolaApi() Valida Entrada           │
│ - URL no vacía                                  │
│ - Token no vacío                                │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│ Normaliza y Prepara Petición HTTPS             │
│ - normalizeHolaBaseUrl()                        │
│ - getHolaAuthHeader()                           │
│ - Crea lista de endpoints candidatos            │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│ Hace Petición Directa desde Navegador           │
│ - fetchJsonWithFallback()                       │
│ - Intenta /atendimento, /profile, /me, etc     │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│ API Opa Responde (o da CORS error)             │
│ Si CORS error: mostra mensaje explicativo       │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│ Usuario ve Resultado                            │
│ ✅ Conectado · /me (éxito)                      │
│ ❌ Desconectado + ayuda (error)                 │
└─────────────────────────────────────────────────┘
```

## 📚 Documentación Relacionada

- [PASO_A_PASO.md](PASO_A_PASO.md) - Configuración completa
- [FLUJO_CONEXION_OPA.md](FLUJO_CONEXION_OPA.md) - Más detalles técnicos
- [README_SOLUCION_OPA.md](README_SOLUCION_OPA.md) - Historia del problema

## ✨ Resumen

| Aspecto | Estado |
|---------|--------|
| ✅ Error 501 resuelto | Sí - no usa proxy local |
| ✅ URL correcta | Sí - ahora es claro que debe incluir `/api/v1` |
| ✅ Mensaje de error mejorado | Sí - explica qué hacer en cada caso |
| ✅ Funcionalidad completa | Sí - ahora usa fallback directo |
| ✅ CORS manejado | Sí - mensajes específicos para CORS |

---

**Última actualización**: 26 de marzo de 2026  
**Versión**: 1.0
