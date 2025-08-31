#!/bin/bash

# Ejecuta el servidor de Ollama en segundo plano
ollama serve &

# Espera unos segundos para que el servidor inicie
sleep 5

# Descarga el modelo
ollama pull mistral

# Espera a que el servidor de Ollama se detenga
# (lo cual solo sucederá si el servicio falla o se detiene)
wait