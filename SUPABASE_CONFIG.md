# Configuración de Supabase para el Servicio de Profanidad

Para que la aplicación funcione correctamente en producción con Supabase, necesitas configurar las siguientes variables de entorno en tu archivo `.env`:

```
# Configuración de la base de datos
DATABASE_URL="postgresql://postgres.hujenvmvkjxmylolsaho:adminprofanity1234@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.hujenvmvkjxmylolsaho:adminprofanity1234@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

## Notas importantes:

1. **Puerto para DATABASE_URL**: Usa el puerto 6543 con pgbouncer=true para conexiones con pooling.
2. **Puerto para DIRECT_URL**: Usa el puerto 5432 para conexiones directas.
3. **Despliegue**: Asegúrate de que estas variables estén configuradas en tu plataforma de despliegue.

## Solución de problemas comunes:

- Si recibes errores 500 en producción pero funciona en local, verifica que estas variables estén correctamente configuradas.
- Si hay problemas de conexión, verifica que la IP desde donde te conectas esté permitida en la configuración de Supabase.
