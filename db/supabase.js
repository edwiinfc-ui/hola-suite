/**
 * Supabase Connection Module
 * Configuración y utilidades para conectar con Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validar que existan las variables de entorno
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.error('Asegúrate de tener .env con SUPABASE_URL y SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// Crear cliente de Supabase para el servidor (con Service Role)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

console.log('✅ Conexión a Supabase inicializada');
console.log(`   URL: ${process.env.SUPABASE_URL}`);

/**
 * Funciones de Utilidad
 */

// Verificar conexión a la base de datos
async function verificarConexion() {
  try {
    const { data, error } = await supabase.from('clientes').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Conexión a Supabase verificada');
    return true;
  } catch (error) {
    console.error('❌ Error verificando conexión:', error.message);
    return false;
  }
}

/**
 * CRUD Clientes
 */

async function getClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nombre', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

async function getClienteById(id) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function crearCliente(cliente) {
  const { data, error } = await supabase
    .from('clientes')
    .insert([cliente])
    .select();
  
  if (error) throw error;
  return data?.[0];
}

async function actualizarCliente(id, updates) {
  const { data, error } = await supabase
    .from('clientes')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data?.[0];
}

async function eliminarCliente(id) {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

/**
 * CRUD Metas de Ventas
 */

async function getSalesGoals() {
  const { data, error } = await supabase
    .from('sales_goals')
    .select('*')
    .order('mes', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

async function getSalesGoalsByVendedor(vendedor) {
  const { data, error } = await supabase
    .from('sales_goals')
    .select('*')
    .eq('vendedor', vendedor)
    .order('mes', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

async function crearOrUpdateSalesGoal(vendedor, mes, meta_clientes, meta_valor) {
  // Primero intentar actualizar
  const { data: existente } = await supabase
    .from('sales_goals')
    .select('*')
    .eq('vendedor', vendedor)
    .eq('mes', mes);
  
  if (existente && existente.length > 0) {
    // Actualizar
    const { data, error } = await supabase
      .from('sales_goals')
      .update({ meta_clientes, meta_valor, updated_at: new Date() })
      .eq('vendedor', vendedor)
      .eq('mes', mes)
      .select();
    
    if (error) throw error;
    return data?.[0];
  } else {
    // Crear nuevo
    const { data, error } = await supabase
      .from('sales_goals')
      .insert([{ vendedor, mes, meta_clientes, meta_valor }])
      .select();
    
    if (error) throw error;
    return data?.[0];
  }
}

async function eliminarSalesGoal(id) {
  const { error } = await supabase
    .from('sales_goals')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

/**
 * Auditoría
 */

async function registrarAuditoria(user_id, tabla, accion, datos_antes, datos_despues, ip) {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert([{
      user_id,
      tabla,
      accion,
      datos_antes: JSON.stringify(datos_antes),
      datos_despues: JSON.stringify(datos_despues),
      ip
    }])
    .select();
  
  if (error) {
    console.error('Error registrando auditoría:', error);
    return null;
  }
  return data?.[0];
}

async function getAuditLogs(limit = 100) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

/**
 * Búsquedas y Filtros
 */

async function buscarClientes(query) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .ilike('nombre', `%${query}%`)
    .limit(10);
  
  if (error) throw error;
  return data || [];
}

async function getClientesByVendedor(vendedor) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('rVenta', vendedor)
    .order('nombre', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

async function getClientesByEstado(estado) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('estado', estado)
    .order('nombre', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

/**
 * Estadísticas
 */

async function getEstadisticas() {
  try {
    // Total de clientes
    const { count: totalClientes } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true });
    
    // Clientes por estado
    const { data: clientesPorEstado } = await supabase
      .from('clientes')
      .select('estado');
    
    const estadisticas = {
      totalClientes: totalClientes || 0,
      porEstado: {},
      vendedoresActivos: 0,
      valorTotal: 0
    };
    
    // Contar por estado
    clientesPorEstado?.forEach(c => {
      estadisticas.porEstado[c.estado] = (estadisticas.porEstado[c.estado] || 0) + 1;
    });
    
    return estadisticas;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return null;
  }
}

// Exportar módulo
module.exports = {
  supabase,
  verificarConexion,
  // Clientes
  getClientes,
  getClienteById,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  buscarClientes,
  getClientesByVendedor,
  getClientesByEstado,
  // Metas
  getSalesGoals,
  getSalesGoalsByVendedor,
  crearOrUpdateSalesGoal,
  eliminarSalesGoal,
  // Auditoría
  registrarAuditoria,
  getAuditLogs,
  // Estadísticas
  getEstadisticas
};
