# 🎯 PASO A PASO - Conectar Opa Suite

## 5 MINUTOS PARA CONECTAR

---

### PASO 1️⃣: Abre el Dashboard

Entra a tu dashboard: `https://tu-dominio.com`

**Deberías ver:**
- Barra de navegación a la izquierda
- Título "¡Hola! Suite — Control Center v2"

---

### PASO 2️⃣: Ve a Configuración

Haz clic en el icono **⚙️** en la barra izquierda

**Deberías ver:**
- Sección "Configuración"
- Varias tarjetas (ClickUp, Opa, Google Sheets, etc)

---

### PASO 3️⃣: Encuentra la tarjeta Opa

Busca la tarjeta con icono de **💬** y título **"¡Hola! / Opa Suite API"**

```
┌─────────────────────────────────────┐
│ 💬 ¡Hola! / Opa Suite API           │
├─────────────────────────────────────┤
│ URL Base                            │
│ [____________________________]       │
│                                     │
│ Token de Acceso                     │
│ [********************]              │
│                                     │
│ Workspace ID (opcional)             │
│ [____________________________]       │
│                                     │
│ [Probar]  [Guardar]                 │
└─────────────────────────────────────┘
```

---

### PASO 4️⃣: Completa el campo "URL Base"

En el primer campo, ingresa:
```
https://wispro.holasuite.com/api/v1
```

**Puntos importantes:**
- ✅ Incluye `https://` al principio
- ✅ INCLUYE `/api/v1` al final (¡IMPORTANTE!)
- ❌ NO incluyas espacios

**Campo después de ingresar:**
```
URL Base
[https://wispro.holasuite.com__________]
```

---

### PASO 5️⃣: Completa el campo "Token de Acceso"

En el segundo campo, ingresa tu token Bearer

Si no tienes token:
1. Contacta tu administrador de Opa
2. Solicita: "API Token para integraciones"
3. Espera a que te lo envíe
4. Vuelve aquí y pégalo

**Formato esperado:**
- Comienza con `Bearer ` (opcional, el sistema lo agrega)
- Seguido de caracteres largo (150+)
- Ejemplo: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Campo después de ingresar:**
```
Token de Acceso
[********************] ← Se muestra como puntos (es seguro)
```

---

### PASO 6️⃣: (Opcional) Completa "Workspace ID"

Si tu administrador te dijo que uses un workspace específico, ingrésalo aquí.

**Si no sabes qué hacer:**
- Déjalo **vacío** (es opcional)
- Presiona Tab para pasar al siguiente

**Ejemplo si tienes workspace:**
```
Workspace ID
[mi-workspace-123_____________________]
```

---

### PASO 7️⃣: Guarda la configuración

Haz clic en el botón gris **"Guardar"**

**Resultado esperado:**
- ✅ Toast verde arriba: "✅ Configuración guardada"
- Los campos permanecen llenos
- Botón Probar se activa

```
Notificación:
┌─────────────────────────────┐
│ ✅ Configuración guardada   │ ← Aparece aquí
└─────────────────────────────┘
```

---

### PASO 8️⃣: Prueba la conexión

Haz clic en el botón naranja **"Probar"** 🔌

**Espera a que aparezca un spinning:**
```
⟳ Probando conexión con API Opa/Hola Suite...
```

---

### PASO 9️⃣: Verifica el resultado

#### ✅ ÉXITO (Verde):
```
Status: ✅ Conectado · /atendimento

Notificación:
┌──────────────────────────────────┐
│ ✅ Conexión exitosa             │
│    con API Opa Suite            │
└──────────────────────────────────┘
```
**¡LISTO!** Puedes pasar al siguiente paso.

#### ❌ ERROR (Rojo):
```
Status: ❌ Desconectado

Notificación muestra posible causa:
- "🔒 Error CORS: Verifica que la URL sea correcta..."
- "🔐 Error de autenticación: Revisa que el token..."
- "❌ Endpoint no encontrado: Verifica la URL base..."
```

**Si ves error**, ve a la sección "TROUBLESHOOTING" más abajo ⬇️

---

## ✅ LISTO: Sincroniza datos

Una vez conectado, sincroniza las conversaciones:

### Opción 1: Desde Opa
1. Vuelve a **Configuración** → **Opa Suite**
2. Haz clic en **"Probar"** nuevamente
3. Debería cargar conversaciones automáticamente

### Opción 2: Desde el Dashboard
1. Haz clic en **💬 OPA** en la barra lateral
2. Busca botón **"Sincronizar"** (si existe)
3. Espera a que cargue

**Resultado esperado:**
```
Sección OPA:
┌─────────────────────────────────────┐
│ 💬 Suite Opa                        │
├─────────────────────────────────────┤
│ Total: 15  Críticas: 2  Advertencias: 4
│ Resueltas: 8  Pendientes: 1         │
│                                     │
│ [Lista de conversaciones...]        │
└─────────────────────────────────────┘
```

---

## ❌ TROUBLESHOOTING

### Problema: "Configura la URL y Token primero"

**Significa:**
- Uno o ambos campos están vacíos

**Solución:**
1. Vuelve a Configuración
2. Verifica que `cfgHolaUrl` tenga: `https://wispro.holasuite.com/api/v1`
3. Verifica que `cfgHolaToken` no esté vacío
4. Haz clic "Guardar"
5. Prueba nuevamente

---

### Problema: "🔒 Error CORS"

**Significa:**
- El navegador no puede conectar con la URL
- El servidor Opa rechaza peticiones desde tu dominio

**Soluciones (en orden de intento):**

**Opción A: Verifica que la URL sea correcta**
```javascript
// En consola (F12), ejecuta:
fetch('https://wispro.holasuite.com/api/v1/atendimento')
  .then(r => console.log('Status:', r.status))
  .catch(e => console.error('Error:', e.message));
```
- Si ves un número (200, 404, etc) → URL está bien, es CORS
- Si ves "Failed to fetch" → URL no es accesible

**Opción B: Contacta admin**
Pide: "Agregar CORS para el dominio `[tu-dominio.com]` en la API Opa"

**Opción C: Usa Backend Proxy**
Si `server.js` está corriendo, el sistema puede usarlo automáticamente

---

### Problema: "🔐 Error de autenticación (401)"

**Significa:**
- El token no es válido o expiró

**Soluciones:**

**Opción A: Verifica el token**
```javascript
// En consola:
const token = document.getElementById('cfgHolaToken').value;
console.log('Token starts with Bearer:', token.startsWith('Bearer'));
console.log('Token length:', token.length); // Debe ser >50
```

**Opción B: Solicita nuevo token**
1. Contacta tu admin de Opa
2. Pide: "Generar nuevo API Token"
3. Espera a recibirlo
4. Vuelve aquí y reemplaza el anterior

**Opción C: Verifica permisos**
Pide al admin que verifique que tu usuario tenga permisos de API

---

### Problema: "❌ Endpoint no encontrado (404)"

**Significa:**
- La URL es incorrecta o el servidor no tiene ese endpoint

**Soluciones:**

**Opción A: Verifica la URL nuevamente**
```
❌ Mal:
- https://wispro-holasuite.com (guión en vez de punto)
- https://wispro.holasuite.com/ (termina con /)
- https://wispro.holasuite.com/opa (tiene ruta extra)

✅ Bien:
- https://wispro.holasuite.com
```

**Opción B: Pregunta al admin**
"¿Cuál es exactamente la URL base de Opa? Necesito solo el dominio sin rutas."

---

### Problema: "Failed to fetch" (Genérico)

**Significa:**
- Varios problemas posibles

**Pasos para diagnosticar:**

1. **¿Puedes acceder a la URL en el navegador?**
   ```
   Abre: https://wispro.holasuite.com
   - Si ves algo → El servidor está en línea
   - Si ves error → Servidor no accesible
   ```

2. **¿Revisaste F12 → Network?**
   ```
   - Haz clic en "Probar"
   - Abre F12
   - Ve a tab "Network"
   - Busca petición a wispro.holasuite.com
   - Haz clic → mira Response
   ```

3. **¿Es problema de firewall/VPN?**
   ```
   - ¿Estás en una red corporativa?
   - ¿Hay proxy/firewall?
   - Intenta desde otra red
   ```

---

## 📞 WHEN EVERYTHING FAILS

Si probaste todo y aún no funciona:

1. **Abre consola (F12 → Console)**

2. **Ejecuta esto y copia el resultado:**
   ```javascript
   console.log({
     currentUrl: window.location.href,
     savedConfig: JSON.parse(localStorage.getItem('holaCfg') || '{}'),
     formUrl: document.getElementById('cfgHolaUrl')?.value,
     hasToken: !!document.getElementById('cfgHolaToken')?.value
   });
   ```

3. **Haz clic "Probar" nuevamente**

4. **Copia los errores rojo de la consola**

5. **Contacta soporte con:**
   - Tu dominio del dashboard
   - URL Opa que estás usando
   - Token primeros 20 caracteres (si puedes compartir)
   - Resultado del console.log() arriba
   - Error de consola completo

---

## ✨ ¡LISTO!

Una vez conectado, deberías ver:

### En Configuración:
```
✅ Conectado · /atendimento
```

### En la sección OPA:
```
Total: N   Críticas: N   Advertencias: N   Resueltas: N   Pendientes: N

[Lista de conversaciones con detalles]
```

### Funcionalidades activas:
- ✅ Haz clic en números KPI para filtrar
- ✅ Haz clic en una conversación para ver detalles
- ✅ Sincroniza automáticamente o manual
- ✅ Alertas clasificadas por tipo

---

## 🎯 PRÓXIMOS PASOS

1. **Configura webhooks de Slack** (opcional)
   - CS Webhook: Para alertas de atención
   - Sales Webhook: Para alertas de ventas

2. **Sincroniza Google Sheets** (si lo necesitas)
   - Para respaldo de datos

3. **Revisa las métricas**
   - Dashboard muestra el resumen
   - OPA muestra conversaciones

---

**¿Necesitas ayuda?** Lee los otros archivos:
- `SOLUCION_RAPIDA_OPA.md` - Errores comunes
- `EJEMPLOS_CONFIGURACION.md` - Tu caso específico
- `FLUJO_CONEXION_OPA.md` - Cómo funciona internamente
