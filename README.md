# Profanity Detection Service

This project is a web service for detecting and censoring inappropriate content in texts. It uses a local database to store banned words and can optionally use a language model (Ollama) for advanced detection.

## Prerequisites

Before starting, make sure you have installed:

- **Node.js**: Version 18.x or higher
  - [Download Node.js](https://nodejs.org/)
- **Ollama** (optional, for advanced AI detection)
  - [Download Ollama](https://ollama.ai/)
  - Recommended models: llama3 or mistral

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd profanity-service
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

```bash
npm run prisma:migrate
```

This will create the local SQLite database (`prisma/dev.db`) and apply the necessary migrations.

## Running the Project

### Option 1: Running without Ollama

If you only want to use keyword-based detection (without AI):

```bash
npm run dev
```

### Option 2: Running with Ollama (recommended)

To use all features including advanced AI detection:

1. **Make sure you have Ollama installed and at least one model downloaded**

```bash
ollama pull llama3
# or
ollama pull mistral
```

2. **Run the project with Ollama**

```bash
npm run dev:local
```

This command will start both the Ollama server and the Next.js application in parallel.

## Accessing the Application

Once started, open [http://localhost:3000](http://localhost:3000) in your browser to access the main interface.

## Main Features

- **Banned Words Management**: Add, edit, and remove words from the profanity dictionary.
- **Text Validation**: Check if a text contains inappropriate words or phrases.
- **Automatic Censoring**: Option to automatically censor inappropriate content.
- **Activity Log**: View a history of all validations performed.
- **Advanced Detection**: Use AI models to detect subtle or contextual content (requires Ollama).

## Additional Tools

- **Prisma Studio**: For visually managing the database

```bash
npm run prisma:studio
```

This will open a web interface at [http://localhost:5555](http://localhost:5555) where you can view and modify data directly.
