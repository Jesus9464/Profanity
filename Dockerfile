# Usa la imagen base de Ollama
FROM ollama/ollama:latest

# Expone el puerto por defecto de Ollama
EXPOSE 11434

# Descarga el modelo "mistral" que usas en tu código
RUN ollama pull mistral

# Define el comando para que Ollama se ejecute
CMD ["ollama", "serve"]