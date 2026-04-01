# 🔗 Flujo de Conexión - Opa Suite API

## Diagrama de flujo

```
┌─────────────────────────────────────────────────────────┐
│  DASHBOARD HOLA SUITE (Este navegador)                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ 1. Usuario hace clic en "Probar"
                 │ 2. Lee valores de configuración:
                 │    - cfgHolaUrl (URL Base)
                 │    - cfgHolaToken (Bearer Token)
                 │    - cfgHolaWs (Workspace ID, opcional)
                 │
                 ▼
         ┌───────────────┐
         │ ¿URL y Token  │──── NO ──→ ⚠️ "Configura primero"
         │   completados?│
         └───────┬───────┘
                 │ SI
                 │
                 ▼
    ┌────────────────────────────────────────┐
    │ normalizeHolaBaseUrl()                 │
    │ Convierte: URL → formato estándar      │
    │ Ej: "wispro.holasuite.com" →           │
    │     "https://wispro.holasuite.com"     │
    └────────┬───────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │ getHolaApiBases(url)                   │
    │ Genera dos URLs de fallback:           │
    │ - api: .../api/v1                      │
    │ - plain: .../                          │
    └────────┬───────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────┐
│ Intenta conectar (en orden):                            │
│ 1. {api}/atendimento                                   │
│ 2. {api}/atendimento?workspace={id}                   │
│ 3. {api}/conversations?page=1&per_page=100            │
│ 4. {api}/workspaces/{id}/conversations?...             │
│ 5. {api}/chats?page=1&per_page=100                    │
│ 6. {plain}/conversations?page=1&per_page=100          │
│                                                        │
│ Headers en cada petición:                              │
│ Authorization: Bearer {token}                          │
│ Content-Type: application/json                         │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────┐       ┌──────────────────┐
│   ¿Éxito? (200)    │       │  ¿Error? (4xx/5xx)│
└────────┬───────────┘       └────────┬─────────┘
         │ SI                         │ NO
         │                            │
         ▼                            ▼
    ✅ CONECTADO               ⚠️ Intenta siguiente
    - Muestra estado           - Si agotas todos:
    - Carga conversaciones       ❌ ERROR
    - Renderiza OPA
```

---

## Estados posibles

### ✅ CONECTADO
```
Indicador: Verde ✅ "API conectada"
Endpoint resuelto: /atendimento (o similar)
Conversaciones cargadas: N (número)
```

### ⚠️ INTENTANDO CONEXIÓN
```
Indicador: Rotatorio 🔄 "Sincronizando..."
Probando endpoints en orden de fallback
```

### ❌ DESCONECTADO
```
Indicador: Rojo ✗ "Error de conexión / endpoint"
Posibles causas:
- URL vacía o incorrecta
- Token inválido
- CORS bloqueado
- Servidor no disponible
```

---

## Configuración en localStorage

El dashboard guarda la configuración en el navegador bajo la clave `holaCfg`:

```javascript
// Estructura guardada:
{
  holaUrl: "https://wispro.holasuite.com",
  holaToken: "tu_token_aqui",
  holaWs: "workspace-id-opcional",
  // ... otros campos
}
```

**Verificar configuración guardada:**
```javascript
// En consola (F12):
const cfg = JSON.parse(localStorage.getItem('holaCfg') || '{}');
console.log('URL:', cfg.holaUrl);
console.log('Token length:', cfg.holaToken?.length);
console.log('Workspace:', cfg.holaWs);
```

---

## Flujo de sincronización completo

```
fetchHolaConvs()
├─ ¿Hay URL y Token?
│  ├─ NO → Muestra "Configura primero"
│  └─ SI ↓
├─ ¿Usar proxy backend?
│  ├─ SI → postJson('/api/opa/conversations', {...})
│  └─ NO ↓
├─ getHolaApiBases() → genera URLs
├─ fetchJsonWithFallback() → intenta todos los endpoints
├─ ¿Éxito?
│  ├─ SI → normalizeHolaConversation()
│  │       APP.holaConversations = [...datos...]
│  │       renderOPA() → muestra en dashboard
│  └─ NO ↓
├─ ❌ Captura error
├─ Genera conversaciones DEMO
├─ renderOPA() con demo
└─ Muestra toast de error
```

---

## Prueba de conectividad manual

### 1. Verifica acceso a URL base
```bash
curl -H "Authorization: Bearer TU_TOKEN" \
     https://wispro.holasuite.com/api/v1/atendimento
```

### 2. En navegador (consola F12)
```javascript
const url = 'https://wispro.holasuite.com/api/v1/atendimento';
const token = document.getElementById('cfgHolaToken').value;

console.log('Intentando conectar a:', url);
console.log('Con token:', token.substring(0, 20) + '...');

fetch(url, {
  headers: {'Authorization': `Bearer ${token}`}
})
.then(r => {
  console.log('Status:', r.status, r.statusText);
  return r.json();
})
.then(d => console.log('✅ Datos:', d))
.catch(e => console.error('❌ Error:', e));
```

---

## Información para debugging

**Abre consola (F12) y ejecuta:**

```javascript
console.log({
  url: document.getElementById('cfgHolaUrl')?.value,
  hasToken: !!document.getElementById('cfgHolaToken')?.value,
  tokenLength: document.getElementById('cfgHolaToken')?.value?.length,
  workspace: document.getElementById('cfgHolaWs')?.value,
  storedConfig: JSON.parse(localStorage.getItem('holaCfg') || '{}'),
  holaConversations: APP.holaConversations?.length || 0
});
```

**Resultado esperado:**
```javascript
{
  url: "https://wispro.holasuite.com",
  hasToken: true,
  tokenLength: 150,
  workspace: "",
  storedConfig: { holaUrl: "...", holaToken: "...", ... },
  holaConversations: 25
}
```

---

## Próximos pasos

Una vez **conectado** ✅:

1. Haz clic en **Sincronizar** para actualizar conversaciones
2. Los **indicadores KPI** funcionan como filtros
3. Haz clic en cualquier conversación para ver **detalles**
4. Las **alertas** se clasifican automáticamente (crítica/advertencia/normal)
