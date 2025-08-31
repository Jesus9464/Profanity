# Usa la imagen base de Ollama
FROM ollama/ollama:latest

# Copia el script de inicio al contenedor
COPY start.sh /start.sh

# Haz que el script sea ejecutable
RUN chmod +x /start.sh

# Expone el puerto por defecto de Ollama
EXPOSE 11434

# Ejecuta el script de inicio al iniciar el contenedor
CMD ["/start.sh"]