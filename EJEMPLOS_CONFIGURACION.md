# 🎯 Ejemplos de Configuración - Opa Suite

## Escenario 1: Instancia Opa en wispro.holasuite.com

**Tu situación actual - Opa alojado en wispro**

### Configuración:
```
URL Base:      https://wispro.holasuite.com/api/v1
Token:         [Tu token Bearer aquí]
Workspace ID:  (Déjalo vacío)
```

### Pasos:
1. Ve a ⚙️ **Configuración**
2. Busca **"¡Hola! / Opa Suite API"**
3. En el campo **"URL Base"** ingresa: `https://wispro.holasuite.com`
4. En el campo **"Token de Acceso"** ingresa tu token
5. Haz clic en **"Guardar"**
6. Haz clic en **"Probar"**

### Resultado esperado:
- ✅ Verde: "Conectado · /atendimento"
- Toast verde: "Conexión exitosa con API Opa Suite"

---

## Escenario 2: Hola Suite Cloud (api.holasuite.com)

**Si usas el servicio cloud oficial de Hola Suite**

### Configuración:
```
URL Base:      https://api.holasuite.com
Token:         [Bearer token de Hola Suite]
Workspace ID:  (Déjalo vacío)
```

### Dónde obtener el token:
1. Entra a https://api.holasuite.com
2. Perfil → Seguridad → Generar API Token
3. Copia el token completo
4. Pégalo en el campo del dashboard

---

## Escenario 3: Instancia privada con Workspace

**Si tienes una instancia privada que usa workspaces**

### Configuración:
```
URL Base:      https://tu-dominio.com/opa
Token:         [Token Bearer]
Workspace ID:  mi-workspace-123
```

### Pasos adicionales:
- El sistema intentará endpoints como:
  - `{url}/api/v1/atendimento?workspace=mi-workspace-123`
  - `{url}/api/v1/workspaces/mi-workspace-123/conversations`

---

## Escenario 4: Docker/Localhost (desarrollo local)

**Si Opa está corriendo localmente**

### Configuración:
```
URL Base:      http://localhost:3000
Token:         [Token para local]
Workspace ID:  (Déjalo vacío o especifica si lo usas)
```

### Nota importante:
- Si el backend está en puerto diferente, ajusta el 3000
- Algunos problemas locales de CORS pueden resolverse con:
  - Proxy backend (`server.js`) habilitado
  - Configurar CORS en Opa local

---

## Escenario 5: Detrás de proxy/load balancer

**Si tienes Opa detrás de un proxy (nginx, Apache, etc.)**

### Configuración:
```
URL Base:      https://tu-proxy.com/opa
Token:         [Token Bearer]
Workspace ID:  (si aplica)
```

### Requiere validar:
```bash
# Desde terminal, verifica que la URL sea accesible:
curl -H "Authorization: Bearer TU_TOKEN" \
     https://tu-proxy.com/opa/api/v1/atendimento
```

---

## Troubleshooting por escenario

### 🔴 Error: "Failed to fetch"
**Diagnóstico:**
```javascript
// En consola (F12):
fetch('https://wispro.holasuite.com/api/v1/atendimento')
  .then(r => console.log('Status:', r.status))
  .catch(e => console.log('Error:', e.message));
```

**Soluciones:**
- [ ] ¿La URL es correcta y sin espacios?
- [ ] ¿El servidor Opa está encendido?
- [ ] ¿Hay firewall/proxy bloqueando?
- [ ] ¿El CORS está configurado en Opa?

### 🔴 Error: "401 Unauthorized"
**Posibles causas:**
- Token inválido o expirado
- Token con formato incorrecto (falta "Bearer ")
- Cuenta de usuario sin permisos

**Solución:**
```javascript
// Verifica token en consola:
const token = document.getElementById('cfgHolaToken').value;
console.log('Token starts with Bearer:', token.startsWith('Bearer'));
console.log('Token length:', token.length); // Debe ser >50
console.log('First 30 chars:', token.substring(0, 30));
```

### 🔴 Error: "403 Forbidden"
**Causas posibles:**
- Usuario sin permisos para /atendimento
- Token válido pero cuenta restringida
- Workspace diferente

**Solución:**
- Contacta admin: "Mi token no puede acceder a /atendimento"
- Verifica que tu usuario sea Admin o tenga permisos de API

### 🔴 Error: "404 Not Found"
**Causas:**
- URL base incorrecta
- Ruta incorrecta después de normalizar
- Servidor no tiene ese endpoint

**Solución:**
```javascript
// Prueba manualmente:
const baseUrl = 'https://wispro.holasuite.com';
const endpoints = [
  `${baseUrl}/api/v1/atendimento`,
  `${baseUrl}/atendimento`,
  `${baseUrl}/api/conversations`,
];

endpoints.forEach(url => {
  fetch(url).then(r => console.log(url, '→', r.status));
});
```

### 🔴 Error: "CORS error"
**Es el error más común si tienes CORS bloqueado:**

```
Error: Access to XMLHttpRequest at 'https://wispro.holasuite.com/...'
from origin 'https://tu-dashboard.com' has been blocked by CORS policy
```

**Soluciones (en orden):**

**Opción 1: Habilitar CORS en servidor Opa**
```
El admin de Opa debe agregar tu dashboard a CORS:
- Origin: https://tu-dashboard.com
- Methods: GET, POST, OPTIONS
- Headers: Authorization, Content-Type
```

**Opción 2: Usar proxy backend (si está disponible)**
```javascript
// Usa backend local como proxy
// Si server.js está configurado, el dashboard automáticamente lo usará
// Ve a Configuración → testea la conexión
```

**Opción 3: Verificar origen exacto**
```javascript
// En consola, identifica cuál es tu origen exacto:
console.log('Tu origen:', window.location.origin);
// Resultado esperado: https://tu-dominio.com (sin path)
```

---

## Validación de token

### Formato válido:
```
❌ Malo:
- "mio-token-1234" (sin Bearer)
- "bearer abc123" (minúscula)
- "eyJhbGciOiJIUz..." (sin Bearer)

✅ Bien:
- "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
- Cualquier formato que empiece con "Bearer "
```

### Obtener token según plataforma:

**Hola Suite Cloud:**
```
1. https://api.holasuite.com
2. Perfil → Configuración
3. API Tokens → Generar nuevo
4. Copiar token (incluye "Bearer " si lo muestra)
```

**Opa privada:**
```
1. Contacta tu admin
2. Solicita: "API Token para integraciones"
3. Especifica: "Necesito acceso a /atendimento y /conversations"
```

**Docker local:**
```bash
# Si está en contenedor:
docker logs opa-container | grep "API_TOKEN"
# O desde admin panel local
```

---

## Checklist final

- [ ] ¿La URL es absolutamente correcta sin typos?
- [ ] ¿Incluye protocolo (`https://` o `http://`)?
- [ ] ¿NO termina con `/api/v1`?
- [ ] ¿El token incluye "Bearer " al inicio?
- [ ] ¿El token no está expirado?
- [ ] ¿Guardaste antes de probar?
- [ ] ¿Revisaste F12 → Network para ver headers?
- [ ] ¿Preguntaste al admin si CORS está configurado?

---

## Contactar soporte

Si aún no funciona, proporciona:

```
Dashboard URL: https://mi-dominio.com
Opa URL: https://wispro.holasuite.com
Error exacto: "Failed to fetch" o "401 Unauthorized"
¿CORS habilitado en Opa?: SI / NO / NO SÉ
¿Backend proxy disponible?: SI / NO
Resultado de consola (F12):
[Pega aquí el error completo]
```
