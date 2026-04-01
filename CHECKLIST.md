# ✅ CHECKLIST IMPRIMIBLE - Conectar Opa Suite

Imprime esta página o guárdala como referencia rápida.

---

## 📋 CHECKLIST PRINCIPAL

### Paso 1: Preparación
- [ ] Tengo acceso al dashboard
- [ ] Tengo mi URL de Opa: `https://wispro.holasuite.com/api/v1` (con `/api/v1` al final)
- [ ] Tengo mi Token Bearer listo
- [ ] El navegador está actualizado

### Paso 2: Ir a Configuración
- [ ] Hago clic en ⚙️ (Configuración en barra lateral)
- [ ] Veo la sección de "Opa Suite API"
- [ ] Veo los campos URL, Token, Workspace ID

### Paso 3: Ingresar datos
- [ ] Ingreso URL: `https://wispro.holasuite.com/api/v1`
- [ ] Ingreso Token: [mi token aquí]
- [ ] Dejos Workspace ID vacío (o ingreso mi workspace)
- [ ] Reviso que NO haya espacios extra

### Paso 4: Guardar
- [ ] Hago clic en botón **"Guardar"** (gris)
- [ ] Veo toast verde: "✅ Configuración guardada"
- [ ] Los campos permanecen llenos

### Paso 5: Probar conexión
- [ ] Hago clic en botón **"Probar"** (naranja)
- [ ] Espero a que cargue (spinning)

### Paso 6: Verificar resultado
- [ ] Veo **✅ Conectado · /atendimento** (ÉXITO!)
  - O -
- [ ] Veo ❌ Desconectado (ERROR - ver troubleshooting)

### Paso 7: Sincronizar datos
- [ ] Las conversaciones aparecen en sección OPA
- [ ] Veo números en los indicadores KPI
- [ ] Puedo ver lista de conversaciones

---

## ⚠️ TROUBLESHOOTING CHECKLIST

### Si ves: "Configura URL y Token primero"
- [ ] ¿El campo URL está vacío?
- [ ] ¿El campo Token está vacío?
- [ ] ¿Hice clic en "Guardar"?
- [ ] ✅ Si todo OK → Ve a Paso 5

### Si ves: "Error CORS"
- [ ] ¿La URL es accesible? (prueba en navegador)
- [ ] ¿Hay proxy o firewall?
- [ ] ¿El servidor CORS está configurado?
- [ ] 📞 Contacta admin: "Configura CORS para mi dominio"

### Si ves: "Error de autenticación (401)"
- [ ] ¿El token es válido?
- [ ] ¿El token no expiró?
- [ ] ¿El formato es correcto?
- [ ] 📞 Solicita nuevo token a admin

### Si ves: "Endpoint no encontrado (404)"
- [ ] ¿La URL es correcta?
- [ ] ¿NO tiene `/api/v1` al final?
- [ ] ¿NO tiene barras extra?
- [ ] ✅ Corrige y vuelve a probar

### Si ves: "Failed to fetch" (genérico)
- [ ] Abre F12 → Console
- [ ] Busca errores rojo
- [ ] Copia el error
- [ ] 📞 Contacta soporte con esa info

---

## 🔍 VERIFICACIÓN FINAL

Cuando esté conectado deberías ver:

### Status indicator:
```
✅ Conectado · /atendimento
```

### En sección OPA:
```
Total: [N]   Críticas: [N]   Advertencias: [N]
Resueltas: [N]   Pendientes: [N]
```

### En lista de conversaciones:
```
[Varias conversaciones con detalles]
```

### Si TODO esto es verdad:
- [x] ✅ CONECTADO Y FUNCIONANDO

---

## 📞 INFORMACIÓN PARA SOPORTE

Si necesitas contactar soporte, completa esto:

```
Mi URL de dashboard: ________________

Mi URL de Opa: ________________

Error que veo: ________________

Primeros 20 caracteres del token: ________________

¿Abrí F12 Console? SI / NO

¿Qué dice la consola?: ________________

¿Intenté más de una vez?: SI / NO

Otros detalles: ________________
```

---

## 🎯 CHECKLIST RÁPIDO (1 minuto)

```
[ ] URL: https://wispro.holasuite.com
[ ] Token: [Tengo]
[ ] Guardar
[ ] Probar
[ ] ✅ Conectado
```

---

## 📚 DOCUMENTOS DE REFERENCIA

| Necesito | Lee |
|----------|-----|
| Solución rápida | SOLUCION_RAPIDA_OPA.md |
| Paso a paso | PASO_A_PASO.md |
| Entender flujo | FLUJO_CONEXION_OPA.md |
| Mi setup especial | EJEMPLOS_CONFIGURACION.md |
| Info completa | OPA_CONNECTION_GUIDE.md |

---

## ✨ TIPS FINALES

✅ **DO (Haz esto):**
- Usa HTTPS siempre
- Guarda tu token seguro
- Revisa consola (F12) cuando hay errores
- Contacta admin para CORS

❌ **DON'T (No hagas esto):**
- No incluyas `/api/v1` en URL
- No compartas tu token en chat
- No dejes espacios en los campos
- No pegues la URL en Workspace ID

---

## 🎓 QUICK REFERENCE

### URLs correctas:
```
✅ https://wispro.holasuite.com
✅ https://api.holasuite.com
✅ https://tu-servidor.com

❌ https://wispro.holasuite.com/api/v1
❌ https://wispro.holasuite.com/
❌ wispro.holasuite.com (sin https)
```

### Formatos token:
```
✅ Bearer eyJhbGciOiJIUzI1NiIs...
✅ eyJhbGciOiJIUzI1NiIs... (el sistema agrega Bearer)

❌ bearer eyJhbGciOiJIUzI1NiIs... (minúscula)
❌ Tu nombre (incorrecto)
❌ 12345 (demasiado corto)
```

---

## 🚀 ¡EMPEZA YA!

**Tu primer paso:**

1. Abre dashboard
2. Ve a ⚙️ Configuración
3. Llena URL + Token
4. Haz clic "Guardar"
5. Haz clic "Probar"
6. ✅ ¡Listo!

---

**Tiempo estimado:** 2-5 minutos  
**Dificultad:** Muy fácil  
**Éxito probable:** 95%

*Si algo falla, la documentación tiene todas las soluciones.*

---

**Fecha:** 2024  
**Versión:** 2.0  
**Estado:** ✅ Listo
