#!/bin/bash

# Script para iniciar el proyecto Amaris en desarrollo

echo "🚀 Iniciando Amaris Monolito..."
echo ""

# Frontend
echo "📦 Iniciando Frontend (Next.js)..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Frontend corriendo en http://localhost:3000"
echo ""

# Backend
echo "📦 Iniciando Backend (Express)..."
cd ../backend
npm run dev &
BACKEND_PID=$!

echo "✅ Backend corriendo en http://localhost:5000"
echo ""
echo "=========================================="
echo "✨ Proyecto iniciado exitosamente!"
echo "=========================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Presiona Ctrl+C para detener ambos servicios"
echo ""

# Esperar a que el usuario presione Ctrl+C
trap "kill $FRONTEND_PID $BACKEND_PID; echo ''; echo '🛑 Servicios detenidos'; exit" INT
wait
