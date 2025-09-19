# Profanity Detection Service

This project is a web service for detecting and censoring inappropriate content in texts. It uses a local database to store banned words and can optionally use a language model (Ollama) for advanced detection in both English and Spanish.

## Prerequisites

Before starting, make sure you have installed:

- **Node.js**: Version 18.x or higher
  - [Download Node.js](https://nodejs.org/)
- **Ollama** (optional, for advanced AI detection)
  - **IMPORTANT**: Ollama must be installed separately, it is not included in the project dependencies
  - [Download Ollama](https://ollama.ai/)
  - Recommended model: mistral

All other dependencies, including **Concurrently** (for running multiple processes), are included in the project's package.json and will be installed with `npm install`

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/Jesus9464/Profanity.git
cd profanity-service
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

### For local development (SQLite)

```bash
# Asegúrate de que el archivo prisma/schema.prisma use SQLite
npm run prisma:migrate
```

This will create the local SQLite database (`prisma/dev.db`) and apply the necessary migrations.

### For production (Supabase PostgreSQL)

```bash
# Ejecuta el script para configurar las variables de entorno
./setup-env.sh

# Genera el cliente Prisma
npx prisma generate

# Aplica las migraciones a la base de datos de producción
npx prisma migrate deploy
```

## Running the Project

### Option 1: Running without Ollama

If you only want to use keyword-based detection (without AI):

```bash
npm run dev
```

### Option 2: Running with Ollama (recommended)

To use all features including advanced AI detection:

1. **Make sure you have Ollama installed and the mistral model downloaded**

```bash
ollama pull mistral
```

2. **Run the project with Ollama**

```bash
npm run dev:local
```

This command will start both the Ollama server and the Next.js application in parallel using concurrently.

## Accessing the Application

Once started, open [http://localhost:3000](http://localhost:3000) in your browser to access the main interface.

## Main Features

- **Banned Words Management**: Add, edit, and remove words from the profanity dictionary.
- **Text Validation**: Check if a text contains inappropriate words or phrases in both English and Spanish.
- **Automatic Censoring**: Option to automatically censor inappropriate content.
- **Activity Log**: View a history of all validations performed.
- **Advanced Detection**: Use AI models to detect subtle or contextual content (requires Ollama).
- **Multilingual Support**: Detects profanity in both English and Spanish.
- **Obfuscated Text Detection**: Identifies profanity even when obfuscated with special characters, numbers, or letter substitutions (e.g., "fvck", "m0therfukker").
- **Default Profanity List**: Includes a built-in list of common profanity words that will be detected even if the database is empty.

## API Usage

The service provides a REST API for text moderation:

```bash
POST /api/moderate
```

Request body:
```json
{
  "text": "Text to check for profanity",
  "useLLM": true  // Set to false to use only dictionary-based detection
}
```

Response:
```json
{
  "containsProfanity": true,
  "severity": 2,
  "hits": [
    { "term": "offensive_word", "start": 10, "end": 15, "severity": 2 }
  ],
  "usedLLM": true
}
```

## Additional Tools

- **Prisma Studio**: For visually managing the database

```bash
npm run prisma:studio
```

This will open a web interface at [http://localhost:5555](http://localhost:5555) where you can view and modify data directly.

- **Update Normalized Terms**: If you've enhanced the normalization function and need to update existing words in the database

```bash
npx ts-node scripts/update-normalized-terms.ts
```

This script will update all existing words in the database with the latest normalization logic, ensuring that obfuscated text detection works properly with all stored words.

## Deployment to Production

### Setting up Supabase

1. Create a Supabase account and project at [https://supabase.com](https://supabase.com)
2. Get your database connection strings from the Supabase dashboard
3. Configure your environment variables:

```bash
# Run the setup script to create the .env file with Supabase credentials
./setup-env.sh
```

### Troubleshooting Production Issues

If you encounter 500 errors in production but the application works fine locally:

1. **Check database connection**: Verify that your Supabase connection strings are correct in the `.env` file
2. **IP allowlist**: Make sure your deployment server's IP is allowed in Supabase's IP allowlist
3. **Prisma client**: Ensure you're using a singleton Prisma client instance across your application
4. **Environment variables**: Confirm that all required environment variables are set in your deployment platform
5. **Database migrations**: Verify that all migrations have been applied to your production database

```bash
npx prisma migrate deploy
```

### Switching Between Development and Production

To switch between SQLite (development) and PostgreSQL (production):

1. Update the `prisma/schema.prisma` file to use the appropriate database provider
2. Run `npx prisma generate` to update the Prisma client
3. Apply migrations with `npx prisma migrate dev` (development) or `npx prisma migrate deploy` (production)
