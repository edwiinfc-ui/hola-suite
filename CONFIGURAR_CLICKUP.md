# Configurar ClickUp para la Sincronización

## 1. Obtener API Key de ClickUp

1. Ve a: https://app.clickup.com/settings/apps/integrations
2. Busca "API Token" o "Personal API Token"
3. Crea uno nuevo si no tienes
4. Copia el token (comienza con `pk_`)

## 2. Obtener List ID

1. En ClickUp, abre el listado que quieres sincronizar
2. En la URL verás algo como: `https://app.clickup.com/t/123456/list/789012`
3. El `789012` es tu **List ID**

## 3. Configurar .env

Edita el archivo `.env` en la raíz del proyecto:

```env
PORT=3000
CACHE_TTL=3600
CLICKUP_API_KEY=pk_tuapikeyaquí
CLICKUP_LIST_ID=tulistidaquí
JWT_SECRET=cambia_esta_clave_por_una_segura
```

## 4. Reiniciar servidor

```bash
npm start
```

## 5. Probar

1. Abre http://localhost:3000
2. Login con: `admin@holasuite.com` / `hola2025`
3. Debería sincronizar automáticamente con ClickUp

## Troubleshooting

Si ves error **"Configura API Key y List ID de ClickUp..."**:
- Verifica que .env tiene valores válidos (no placeholders)
- Verifica que API Key comienza con `pk_`
- Verifica que List ID es solo números

Si ves **"API Key inválida"**:
- El API Key que usaste es incorrecto o expiró
- Genera uno nuevo en ClickUp

Si ves **"List ID no encontrado"**:
- Verifica que el List ID es correcto
- Asegúrate de que tienes acceso a ese listado
