# 🚀 Guía: Conectar Hola Suite a Supabase

Supabase es un Backend-as-a-Service que reemplaza SQLite con PostgreSQL en la nube, agregando autenticación, realtime y más.

## 📋 Tabla de Contenidos

1. [Obtener Credenciales](#obtener-credenciales)
2. [Configurar .env](#configurar-env)
3. [Instalar Dependencias](#instalar-dependencias)
4. [Crear Tablas](#crear-tablas)
5. [Integrar con Node.js](#integrar-con-nodejs)
6. [Migrar Datos](#migrar-datos)
7. [Probar Conexión](#probar-conexión)

---

## 1️⃣ Obtener Credenciales

### Paso 1: Ve al Dashboard de Supabase

https://supabase.com/dashboard/project/vvrnufzwyxszknnnfvig

### Paso 2: Obtén las API Keys

1. En el menú izquierdo → **Settings** → **API**
2. Busca estas secciones:
   
   **Project URL:**
   ```
   https://vvrnufzwyxszknnnfvig.supabase.co
   ```
   
   **Project API keys:**
   - `anon` (public) - Para el frontend
   - `service_role` (secret) - Para el backend ⚠️ PROTEGER

3. Copia las keys y guárdalas en un lugar seguro

---

## 2️⃣ Configurar .env

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Luego edita `.env` y agrega:

```env
# Supabase
SUPABASE_URL=https://vvrnufzwyxszknnnfvig.supabase.co
SUPABASE_ANON_KEY=eyJ... (anon key)
SUPABASE_SERVICE_KEY=eyJ... (service_role key)

# JWT (genera un string largo y aleatorio)
JWT_SECRET=tu_secret_super_seguro_aqui_1234567890

# Server
PORT=3000
NODE_ENV=development
```

⚠️ **IMPORTANTE:** Nunca commits `.env` - ya está en `.gitignore`

---

## 3️⃣ Instalar Dependencias

```bash
npm install @supabase/supabase-js
```

---

## 4️⃣ Crear Tablas en Supabase

### En el Dashboard de Supabase:

1. Ve a **SQL Editor** (en el menú izquierdo)
2. Click en "New Query"
3. Copia y pega el siguiente SQL:

```sql
-- ═══════════════════════════════════════════════════════════════
-- TABLA: CLIENTES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  valor DECIMAL(10, 2) DEFAULT 0,
  rVenta TEXT,
  estado TEXT DEFAULT 'prospecto',
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID
);

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_clientes_rventa ON clientes(rVenta);
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON clientes(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);

-- ═══════════════════════════════════════════════════════════════
-- TABLA: SALES_GOALS (Metas de Ventas)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sales_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendedor TEXT NOT NULL,
  mes TEXT NOT NULL,
  meta_clientes INTEGER DEFAULT 0,
  meta_valor DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(vendedor, mes)
);

CREATE INDEX IF NOT EXISTS idx_sales_goals_vendedor ON sales_goals(vendedor);
CREATE INDEX IF NOT EXISTS idx_sales_goals_mes ON sales_goals(mes);

-- ═══════════════════════════════════════════════════════════════
-- TABLA: AUDIT_LOGS (Auditoría)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  tabla TEXT,
  accion TEXT,
  datos_antes TEXT,
  datos_despues TEXT,
  ip TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_tabla ON audit_logs(tabla);
CREATE INDEX IF NOT EXISTS idx_audit_accion ON audit_logs(accion);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);

-- ═══════════════════════════════════════════════════════════════
-- TABLA: SALES_CONFIG (Configuración de Ventas)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sales_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) - CONFIGURAR PERMISOS
-- ═══════════════════════════════════════════════════════════════

-- Permitir lectura pública de clientes
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read clientes" 
ON clientes FOR SELECT 
USING (true);

CREATE POLICY "Allow insert clientes" 
ON clientes FOR INSERT 
WITH CHECK (true);

-- Permitir auditoría
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert audit_logs" 
ON audit_logs FOR INSERT 
WITH CHECK (true);
```

4. Click en "Run" para ejecutar

✅ Las tablas están creadas y listas

---

## 5️⃣ Integrar con Node.js

### Usar el módulo de Supabase

En `server.js`, reemplaza SQLite con Supabase:

```javascript
// Antes (SQLite):
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data/database.db');

// Después (Supabase):
const { supabase, getClientes, crearCliente } = require('./db/supabase');
```

### Ejemplo: Obtener Clientes

**SQLite:**
```javascript
app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM clientes', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
```

**Supabase:**
```javascript
app.get('/api/data', async (req, res) => {
  try {
    const clientes = await getClientes();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 6️⃣ Migrar Datos

### Si tienes datos en SQLite y quieres migrar a Supabase:

```javascript
const sqlite3 = require('sqlite3');
const { crearCliente } = require('./db/supabase');

async function migrarDatos() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./data/database.db');
    
    db.all('SELECT * FROM clientes', async (err, rows) => {
      if (err) return reject(err);
      
      console.log(`📦 Migrando ${rows.length} clientes...`);
      
      for (const cliente of rows) {
        try {
          await crearCliente(cliente);
        } catch (error) {
          console.error(`Error migrando cliente ${cliente.id}:`, error);
        }
      }
      
      console.log('✅ Migración completada');
      resolve();
    });
  });
}

// Ejecutar:
migrarDatos().catch(console.error);
```

---

## 7️⃣ Probar Conexión

### Script de prueba:

Crea `test-supabase.js`:

```javascript
const { 
  verificarConexion, 
  getClientes, 
  getEstadisticas 
} = require('./db/supabase');

async function test() {
  try {
    // Verificar conexión
    await verificarConexion();
    
    // Obtener clientes
    const clientes = await getClientes();
    console.log(`✅ Total clientes: ${clientes.length}`);
    
    // Estadísticas
    const stats = await getEstadisticas();
    console.log('📊 Estadísticas:', stats);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
```

Ejecuta:
```bash
node test-supabase.js
```

---

## ✨ Ventajas de Supabase

| Característica | SQLite | Supabase |
|---|---|---|
| **Base de Datos** | Local | PostgreSQL en la nube |
| **Escalabilidad** | Limitada | Ilimitada |
| **Acceso Remoto** | No | Sí |
| **Autenticación** | Manual | Integrada |
| **Realtime** | No | Sí |
| **Backups** | Manual | Automáticos |
| **Colaboración** | Difícil | Fácil |
| **Seguridad** | Básica | Avanzada |

---

## 🔒 Seguridad

### ⚠️ NUNCA publiques:
- `.env` (protegido por `.gitignore`)
- Service Role Key (solo para backend)
- JWT Secret

### Proteger Production:
```env
NODE_ENV=production
# URLs de producción
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
```

---

## 📚 Recursos Útiles

- [Documentación Supabase](https://supabase.com/docs)
- [SQL Editor Playground](https://supabase.com/docs/guides/database/sql-editor)
- [Authentication Docs](https://supabase.com/docs/guides/auth)
- [API Reference](https://supabase.com/docs/reference)

---

## 🆘 Problemas Comunes

### "Connection refused"
- Verifica que `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` sean correctos
- Comprueba que `.env` existe en la raíz del proyecto

### "Tabla no existe"
- Ve a SQL Editor en Supabase y verifica que las tablas estén creadas
- Ejecuta el SQL de la sección "Crear Tablas"

### "Permission denied"
- Revisa Row Level Security (RLS) en cada tabla
- Ejecuta los comandos de RLS del SQL de creación

---

**Versión:** 2.1  
**Fecha:** 1 de Abril de 2026  
**Sistema:** Hola Suite Dashboard + Supabase
