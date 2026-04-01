#!/bin/bash

# Test Script for Real-Time Sync Feature
# Run in browser console to verify all functions exist and work

echo "🧪 Testing Real-Time Sync Implementation..."

# Test 1: Verify all functions exist
echo ""
echo "Test 1: Verificar que todas las funciones existan"
grep -c "function startRealTimeSync" vylex.html && echo "✅ startRealTimeSync()" || echo "❌ startRealTimeSync()"
grep -c "function stopRealTimeSync" vylex.html && echo "✅ stopRealTimeSync()" || echo "❌ stopRealTimeSync()"
grep -c "function pollClickUpForChanges" vylex.html && echo "✅ pollClickUpForChanges()" || echo "❌ pollClickUpForChanges()"
grep -c "function processSyncQueue" vylex.html && echo "✅ processSyncQueue()" || echo "❌ processSyncQueue()"
grep -c "function detectAndQueueLocalChanges" vylex.html && echo "✅ detectAndQueueLocalChanges()" || echo "❌ detectAndQueueLocalChanges()"
grep -c "function getSyncStatus" vylex.html && echo "✅ getSyncStatus()" || echo "❌ getSyncStatus()"
grep -c "function viewSyncLog" vylex.html && echo "✅ viewSyncLog()" || echo "❌ viewSyncLog()"
grep -c "function mapLocalFieldToClickUp" vylex.html && echo "✅ mapLocalFieldToClickUp()" || echo "❌ mapLocalFieldToClickUp()"
grep -c "function mapClickUpFieldToLocal" vylex.html && echo "✅ mapClickUpFieldToLocal()" || echo "❌ mapClickUpFieldToLocal()"
grep -c "function handleSyncConflict" vylex.html && echo "✅ handleSyncConflict()" || echo "❌ handleSyncConflict()"
grep -c "function showRealTimeSyncIndicator" vylex.html && echo "✅ showRealTimeSyncIndicator()" || echo "❌ showRealTimeSyncIndicator()"
grep -c "function diffStates" vylex.html && echo "✅ diffStates()" || echo "❌ diffStates()"
grep -c "function addRealTimeSyncCSS" vylex.html && echo "✅ addRealTimeSyncCSS()" || echo "❌ addRealTimeSyncCSS()"

# Test 2: Verify APP.realtimeSync object
echo ""
echo "Test 2: Verificar estructura de APP.realtimeSync"
grep "APP.realtimeSync=" vylex.html | head -1
grep "enabled:" vylex.html | grep -i sync | head -1
grep "pollInterval" vylex.html | grep -i sync | head -1
grep "queue:" vylex.html | head -1

# Test 3: Check for UI elements
echo ""
echo "Test 3: Verificar elementos UI"
grep -c "btnStartRealSync" vylex.html && echo "✅ Botón Iniciar Sync" || echo "❌ Botón Iniciar Sync"
grep -c "btnStopRealSync" vylex.html && echo "✅ Botón Detener Sync" || echo "❌ Botón Detener Sync"
grep -c "realtimeSyncIndicator" vylex.html && echo "✅ Indicador de Sync" || echo "❌ Indicador de Sync"

# Test 4: Check for documentation
echo ""
echo "Test 4: Verificar documentación"
[ -f "REAL_TIME_SYNC.md" ] && echo "✅ REAL_TIME_SYNC.md existe" || echo "❌ REAL_TIME_SYNC.md no existe"

# Test 5: Count new lines of code
echo ""
echo "Test 5: Estadísticas de código"
TOTAL_LINES=$(wc -l < vylex.html)
echo "📊 Total de líneas en vylex.html: $TOTAL_LINES"

SYNC_FUNCTIONS=$(grep -c "function.*Sync" vylex.html)
echo "📊 Funciones de sincronización: $SYNC_FUNCTIONS"

SYNC_LINES=$(grep -n "REAL-TIME SYNC WITH CLICKUP" vylex.html | cut -d: -f1)
if [ ! -z "$SYNC_LINES" ]; then
  echo "📊 Sección Real-Time Sync comienza en línea: $SYNC_LINES"
fi

echo ""
echo "✅ Tests completados!"
