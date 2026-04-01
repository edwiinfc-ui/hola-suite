#!/bin/bash

# ╔════════════════════════════════════════════════════════════════════════════╗
# ║                     🚀 DEPLOY A VERCEL - SCRIPT                           ║
# ║                        Hola Suite v2.1                                     ║
# ╚════════════════════════════════════════════════════════════════════════════╝

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                      🚀 DEPLOY A VERCEL                                   ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para imprimir
log() {
  echo -e "${GREEN}✅${NC} $1"
}

error() {
  echo -e "${RED}❌${NC} $1"
}

warning() {
  echo -e "${YELLOW}⚠️${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
  error "No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
  exit 1
fi

log "Verificando Vercel CLI..."

# Verificar si Vercel está instalado
if ! command -v vercel &> /dev/null; then
  warning "Vercel CLI no está instalado. Instalando..."
  npm install -g vercel
fi

vercel --version

echo ""
echo "════════════════════════════════════════════════════════════════════════════"
echo "📋 PASOS PARA DESPLEGAR:"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  VERIFICAR GIT"
echo "   • ¿Está tu código en GitHub?"
echo "   • ¿Hiciste commit de todos los cambios?"
echo ""

read -p "¿Tu código está en GitHub? (s/n): " github_ready
if [[ $github_ready != "s" ]]; then
  warning "Primero sube tu código a GitHub:"
  echo "   git add -A"
  echo "   git commit -m 'Deploy to Vercel'"
  echo "   git push origin main"
  exit 0
fi

echo ""
echo "2️⃣  AUTENTICARSE EN VERCEL"
echo "   • Si es la primera vez, vercel abrirá tu navegador"
echo "   • Inicia sesión o crea una cuenta gratis"
echo ""

read -p "Presiona Enter para continuar..."

log "Iniciando Vercel..."
echo ""

# Ejecutar vercel
vercel --prod

if [ $? -eq 0 ]; then
  echo ""
  echo "════════════════════════════════════════════════════════════════════════════"
  log "🎉 ¡DESPLIEGUE EXITOSO!"
  echo "════════════════════════════════════════════════════════════════════════════"
  echo ""
  echo "📊 Tu app está disponible en:"
  echo "   https://hola-suite.vercel.app"
  echo ""
  echo "🔧 Para agregar dominio personalizado:"
  echo "   1. Ve a https://vercel.com/dashboard"
  echo "   2. Selecciona 'hola-suite'"
  echo "   3. Settings → Domains"
  echo ""
  echo "📚 Documentación: VERCEL_DEPLOYMENT.md"
  echo ""
else
  error "Error durante el despliegue. Verifica los logs arriba."
  exit 1
fi

echo ""
echo "✨ ¡Listo!"
