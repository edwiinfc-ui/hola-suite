# 🚀 Desplegar Hola Suite en Vercel

Vercel es la plataforma ideal para desplegar aplicaciones Node.js. Ofrece despliegue sin servidor, dominios gratuitos, y escalado automático.

## 📋 Tabla de Contenidos

1. [Instalación de Vercel CLI](#instalación)
2. [Configurar Vercel](#configurar-vercel)
3. [Crear vercel.json](#crear-verceljson)
4. [Variables de Entorno](#variables-de-entorno)
5. [Desplegar](#desplegar)
6. [Dominio Personalizado](#dominio-personalizado)

---

## 1️⃣ Instalación de Vercel CLI

```bash
npm install -g vercel
```

O usar sin instalar:

```bash
npx vercel@latest --version
```

---

## 2️⃣ Configurar Vercel

### Paso 1: Autenticarse en Vercel

```bash
vercel login
```

Esto abrirá una ventana del navegador para autenticarse con tu cuenta de Vercel.

**O si ya tienes cuenta:**
```bash
vercel
```

### Paso 2: Conectar tu Proyecto

En la carpeta del proyecto:

```bash
cd "/home/ixcsoft/Dashboard- Hola suite"
vercel link
```

Sigue los pasos interactivos:
- ¿Deseas conectar a un proyecto existente? → **No**
- ¿Deseas crear un nuevo proyecto? → **Sí**
- Nombre del proyecto → `hola-suite` (o lo que prefieras)
- Selecciona framework → **Other** (es un proyecto custom)

---

## 3️⃣ Crear vercel.json

Este archivo configura cómo Vercel despliega tu app.

Crea `vercel.json` en la raíz del proyecto:

```json
{
  "version": 2,
  "buildCommand": "npm install",
  "devCommand": "node server.js",
  "name": "hola-suite",
  "public": false,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["sfo1"],
  "functions": {
    "server.js": {
      "maxDuration": 60,
      "memory": 1024
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        }
      ]
    }
  ]
}
```

---

## 4️⃣ Variables de Entorno

### En Vercel Dashboard:

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `hola-suite`
3. **Settings** → **Environment Variables**
4. Agrega estas variables:

```
SUPABASE_URL=https://vvrnufzwyxszknnnfvig.supabase.co
SUPABASE_SERVICE_KEY=tu_service_key_aqui
SUPABASE_ANON_KEY=tu_anon_key_aqui
JWT_SECRET=tu_jwt_secret_aqui
NODE_ENV=production
PORT=3000
```

⚠️ **NO publiques localmente .env** - ya está en .gitignore

---

## 5️⃣ Desplegar

### Opción A: Desde Git (Recomendado)

Una vez que tu código está en GitHub:

1. Ve a https://vercel.com/new
2. Selecciona **Import Git Repository**
3. Conecta tu repositorio `hola-suite` de GitHub
4. Configura:
   - **Framework**: Other
   - **Root Directory**: `.`
   - **Build Command**: `npm install`
   - **Output Directory**: `.`
   - **Environment Variables**: Agrega las del punto anterior
5. Click **Deploy**

### Opción B: Desde CLI

```bash
vercel --prod
```

Esto:
- Compila tu proyecto
- Sube a Vercel
- Te da una URL pública

---

## 6️⃣ Dominio Personalizado

### Opción A: Subdominio de Vercel (Gratis)

Ya tienes uno automáticamente:
```
https://hola-suite.vercel.app
```

### Opción B: Dominio Personalizado

1. En Vercel Dashboard → **Domains**
2. Click **Add**
3. Escribe tu dominio: `tudominio.com`
4. Sigue las instrucciones para configurar DNS

---

## ✨ Verificar Despliegue

```bash
vercel env pull
vercel logs --follow
```

O visita:
```
https://hola-suite.vercel.app
```

---

## 🔧 Estructura Vercel

```
.
├── server.js              ← Punto de entrada
├── package.json           ← Dependencias
├── .env.local             ← Local (NO subir)
├── vercel.json            ← Configuración Vercel
├── vylex.html             ← Frontend
└── public/                ← Archivos estáticos
```

---

## 🚀 Workflow Completo

```bash
# 1. Hacer cambios locales
git add -A
git commit -m "Update feature"

# 2. Subir a GitHub
git push origin main

# 3. Vercel despliega automáticamente
# (Si configuraste GitHub integration)

# 4. O desplegar manualmente
vercel --prod
```

---

## 📊 Ventajas de Vercel

| Feature | Value |
|---------|-------|
| **Dominio Gratis** | ✅ `.vercel.app` |
| **SSL/HTTPS** | ✅ Automático |
| **Escalado** | ✅ Automático |
| **Deploys Rápidos** | ✅ ~30 segundos |
| **Rollback** | ✅ Un click |
| **Preview URLs** | ✅ Para PRs |
| **Logs en Tiempo Real** | ✅ Sí |
| **Analytics** | ✅ Gratis |

---

## 🆘 Problemas Comunes

### Error: "Cannot find module"

```bash
npm install
vercel --prod
```

### Error: "Port already in use"

Vercel usa puerto 3000 automáticamente. En `vercel.json`:

```json
"env": {
  "PORT": "3000"
}
```

### Error: "Timeout"

Aumenta el timeout en `vercel.json`:

```json
"functions": {
  "server.js": {
    "maxDuration": 60
  }
}
```

---

## 📚 Recursos

- [Documentación Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Node.js en Vercel](https://vercel.com/docs/platforms/v2/concepts/runtimes#node.js)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Versión:** 2.1  
**Fecha:** 1 de Abril de 2026  
**Sistema:** Hola Suite Dashboard + Vercel
