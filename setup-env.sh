#!/bin/bash

# Script para configurar el archivo .env con las credenciales de Supabase

# Crear o sobrescribir el archivo .env
cat > .env << EOL
# Configuración de la base de datos para Supabase
DATABASE_URL="postgresql://postgres.hujenvmvkjxmylolsaho:adminprofanity1234@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.hujenvmvkjxmylolsaho:adminprofanity1234@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
EOL

echo "Archivo .env creado con éxito con las credenciales de Supabase."
echo "Para usar SQLite en desarrollo local, modifica el archivo prisma/schema.prisma."
