# 🚀 Guía de Configuración y Uso

## 📋 Resumen de Cambios

### ✅ Lo que se mejoró:

1. **Login Simplificado** 
   - Sin contraseña visible
   - Auto-login desde URL si está configurado
   - Auto-login desde localStorage si ya se conectó antes

2. **Sesión Única Compartible**
   - Cada usuario obtiene un ID de sesión único
   - Se puede compartir un link con otras personas
   - Todos verán los mismos datos sin login adicional

3. **Configuración Accesible**
   - API Key y List ID en la pantalla de login
   - Botón de compartir en el topbar
   - Configuración persistente en localStorage

4. **Auto-conexión a ClickUp**
   - Se valida la conexión antes de permitir acceso
   - Indicador de estado de conexión
   - Feedback visual claro

---

## 🔧 Cómo Usar

### Paso 1: Primera Conexión

1. Abre el dashboard
2. Ves la pantalla de login
3. Ingresa:
   - **API Key ClickUp**: `pk_xxxxx...` (obtén en https://app.clickup.com/settings/apps/integrations)
   - **List ID ClickUp**: El ID de tu listado
4. Haz clic en **"Conectar y Continuar"**
5. Se valida la conexión y entrará automáticamente

### Paso 2: Auto-Login en Futuras Visitas

- La próxima vez que abras el dashboard
- Se auto-loginearía automáticamente
- Sin necesidad de ingresar credenciales

### Paso 3: Compartir con Otros

1. Una vez dentro, haz clic en **"Compartir"** (icono en topbar)
2. Se genera un link automáticamente
3. Copia el link
4. Comparte con otros
5. Cualquiera con el link verá lo mismo sin login

---

## 🔗 Ejemplo de URL Compartible

```
https://tu-dominio.com/Dashboard-HolaSuite/vylex.html?apiKey=pk_xxxxxxx&listId=12345678
```

Cuando alguien abre este link:
- Se auto-conecta automáticamente
- Ve todos los datos
- Puede usar todas las funciones
- Sin necesidad de login

---

## 🛠️ Configuración Técnica

### Session ID
- Se genera automáticamente: `sess_TIMESTAMP_RANDOM`
- Se almacena en localStorage
- Se usa para rastrear sesiones

### Credenciales
- Se almacenan en localStorage
- Se recuperan automáticamente
- Se pueden compartir via URL

### Storage
```javascript
localStorage.vylex_sessionId    // ID único de sesión
localStorage.vylex_apiKey      // API Key de ClickUp
localStorage.vylex_listId      // List ID de ClickUp
```

---

## 🔒 Seguridad

⚠️ **IMPORTANTE:**

- **No compartas tu API Key públicamente**
- El link incluye credenciales - úsalo solo con personas de confianza
- Si necesitas revocar acceso, cambia la API Key en ClickUp
- Las credenciales se almacenan en localStorage (accesible via JS)

---

## 🎯 URLs Especiales

### Auto-login desde URL
```
vylex.html?apiKey=pk_xxx&listId=12345
```

### Crear nueva sesión
```
vylex.html  // Generará nuevo session ID
```

### Limpiar sesión
```javascript
// En consola:
localStorage.removeItem('vylex_sessionId');
localStorage.removeItem('vylex_apiKey');
localStorage.removeItem('vylex_listId');
```

---

## 🚨 Troubleshooting

### "API Key inválida"
- Verifica que la API Key sea correcta
- Va en https://app.clickup.com/settings/apps/integrations
- Debe empezar con `pk_`

### "List ID no encontrado"
- Asegúrate que el List ID sea correcto
- Obtén el ID del listado en ClickUp
- Puede variar entre workspaces

### "No se conecta automáticamente"
- Limpia localStorage y recarga
- En consola ejecuta:
  ```javascript
  localStorage.clear();
  location.reload();
  ```

### "La sesión expiró"
- Cierra sesión y vuelve a conectar
- O haz clic en "Compartir" para obtener nuevo link

---

## 📱 Acceso Móvil

El dashboard es responsive:
- Abre en teléfono/tablet
- Usa la URL del link compartible
- Funciona igual que en desktop

---

## 👥 Multi-usuario

### Caso 1: Mismo dispositivo, diferentes usuarios
- Cada usuario abre su propio link
- Se guarda su propia sesión
- localStorage se sobrescribe (último usuario gana)

### Caso 2: Diferentes dispositivos, mismo proyecto
- Copia el link compartible
- Cada dispositivo lo abre
- Todos ven los mismos datos en tiempo real

### Caso 3: Diferentes proyectos ClickUp
- Crea un link con API Key + List ID de proyecto A
- Crea otro link con API Key + List ID de proyecto B
- Comparte cada link según corresponda

---

## 📊 Datos Sincronizados

Cuando te conectas:
- ✓ Todos los clientes del listado
- ✓ Estado de implementación
- ✓ Etapas completadas
- ✓ Responsables asignados
- ✓ Canales configurados
- ✓ Presupuestos y datos financieros

Todo en **tiempo real** vía ClickUp API.

---

## 🔄 Sincronización

- **Automática cada 10 segundos**
- **Bidireccional** (local ↔ ClickUp)
- **Cambios remotos** se aplican automáticamente
- **Cambios locales** se sincronizan al guardar

Haz clic en **🔄 Sincronizar** (topbar) para forzar sync inmediata.

---

## ⚙️ Configuración Avanzada

### Cambiar intervalo de sync
En consola:
```javascript
APP.realtimeSync.pollInterval = 5000; // 5 segundos
```

### Ver estado actual
```javascript
getSyncStatus();
```

### Ver último login
```javascript
console.log(APP.currentUser);
```

### Ver credenciales almacenadas
```javascript
console.log({
  sessionId: localStorage.vylex_sessionId,
  apiKey: localStorage.vylex_apiKey,
  listId: localStorage.vylex_listId
});
```

---

## 📞 Soporte

Si encontraras problemas:

1. Abre la consola (F12)
2. Busca errores rojos
3. Verifica que API Key y List ID sean correctos
4. Intenta limpiar localStorage y recargar
5. Revisa que ClickUp esté funcionando

---

## ✅ Checklist para Usar

- [ ] Obtuve mi API Key de ClickUp
- [ ] Tengo el List ID de mi proyecto
- [ ] Puedo conectarme sin errores
- [ ] Los datos se cargan correctamente
- [ ] Puedo generar un link compartible
- [ ] Otra persona puede acceder con el link
- [ ] Veremos los mismos datos en tiempo real

---

**¡Listo! Ahora puedes compartir el dashboard con tu equipo.** 🎉
