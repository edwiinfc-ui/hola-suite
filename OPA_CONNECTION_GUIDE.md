# Guía de Conexión - Opa Suite API

## Problema Identificado
El error **"Error de conexión / endpoint"** ocurre porque los campos de configuración de la API Opa no están completos:
- ❌ URL Base: **Vacío**
- ❌ Token de Acceso: **Vacío**

## Solución

### Paso 1: Accede a la sección de Configuración
1. En el dashboard, haz clic en **⚙️ Configuración** (en la barra lateral)
2. Busca la tarjeta **"¡Hola! / Opa Suite API"** (con ícono de mensajes 💬)

### Paso 2: Completa los campos requeridos

#### **Campo: URL Base** 
- **Placeholder**: `https://api.holasuite.com`
- **Valor para wispro**: `https://wispro.holasuite.com`
- **Instrucciones**: 
  - Si usas una instancia propia de Opa, usa tu dominio
  - Según tus errores, parece ser: `https://wispro.holasuite.com`
  - ⚠️ **NO incluyas rutas como `/api/v1`** - el sistema las añade automáticamente

#### **Campo: Token de Acceso**
- **Placeholder**: `Bearer token...`
- **Instrucciones**:
  - Solicita un token Bearer a tu administrador de Opa/Hola Suite
  - Este token es necesario para autenticarse en la API
  - Si no tienes token, contacta al equipo de Hola Suite

#### **Campo: Workspace ID** (Opcional)
- **Placeholder**: `Opcional: workspace-id`
- **Instrucciones**:
  - Si tu instancia de Opa requiere un workspace específico, ingrésalo aquí
  - Si no sabes si necesitas este campo, déjalo vacío
  - **⚠️ NO pegues una URL aquí** - solo el ID del workspace

### Paso 3: Guarda la configuración
1. Haz clic en **"Guardar"** (botón gris)
2. Deberías ver una notificación: ✅ "Configuración guardada"

### Paso 4: Prueba la conexión
1. Haz clic en **"Probar"** (botón naranja con ícono 🔌)
2. **Si es exitosa**: Verás ✅ "API conectada" con el número de conversaciones
3. **Si falla**: Verifica que los datos sean correctos

---

## Información Técnica

### Endpoints que se intentan alcanzar
El sistema intenta varios endpoints en orden de fallback:
```
1. {URL}/api/v1/atendimento
2. {URL}/api/v1/atendimento?workspace={ID}
3. {URL}/api/v1/conversations?page=1&per_page=100
4. {URL}/api/v1/workspaces/{ID}/conversations?page=1&per_page=100
5. {URL}/api/v1/chats?page=1&per_page=100
6. {URL}/conversations?page=1&per_page=100
```

### Headers que se envían
```
Authorization: Bearer {Token}
Content-Type: application/json
```

### Posibles causas de error "Failed to fetch"
1. ❌ **URL vacía o incorrecta** - Verifica el dominio
2. ❌ **Token inválido o expirado** - Solicita uno nuevo
3. ❌ **CORS bloqueado** - El servidor de Opa rechaza peticiones desde este dominio
4. ❌ **Servidor no disponible** - Intenta acceder a la URL en el navegador
5. ❌ **Red/Firewall** - Verifica conectividad con wispro.holasuite.com

### Datos para pasar a tu administrador
Si contactas soporte, proporciona:
- URL Opa: `https://wispro.holasuite.com`
- El dominio donde corre este dashboard
- Errores del navegador (F12 → Console)

---

## Verificación Manual

### En la consola del navegador (F12)
Ejecuta esto para probar manualmente:
```javascript
const url = 'https://wispro.holasuite.com/api/v1/atendimento';
const token = 'TU_TOKEN_AQUI';
fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(console.log).catch(console.error);
```

Si ves un error CORS, probablemente:
- Necesitas un proxy backend
- Contacta al equipo de Opa para configurar CORS
- Alternativamente, usa la opción de backend proxy (si está disponible)

---

## Checklist de Troubleshooting
- [ ] ¿La URL está completa sin rutas adicionales?
- [ ] ¿El token es válido y no expiró?
- [ ] ¿Pusiste Guardar después de cambiar los campos?
- [ ] ¿Puedes acceder a la URL en el navegador (aunque no muestre datos)?
- [ ] ¿Revisaste F12 → Console para errores CORS?
- [ ] ¿El firewall/proxy permite conexiones salientes a wispro.holasuite.com?

---

## Próximos pasos
Una vez conectado:
1. ✅ Haz clic en "Probar" para confirmar conexión
2. ✅ Sincroniza conversaciones automáticamente
3. ✅ Usa los indicadores KPI como filtros
4. ✅ Ve métricas en tiempo real en la sección OPA
