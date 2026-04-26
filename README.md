# Smart Daily Assistant Agent

A stateless, cross-platform AI assistant that organizes your day using Google Gemini 1.5 Flash. Accessible via a premium Web UI and a Telegram Bot.

## Live Demo
- **Web UI**: [smartt-daily-assistant.vercel.app](https://smartt-daily-assistant.vercel.app/)
- **Telegram Bot**: `@[YOUR_BOT_USERNAME]`

## Architecture
This project is built with **Next.js 15 (App Router)** and follows a strictly server-side architecture for AI processing.

- **Core Intelligence**: Google Gemini 2.5 Flash using structured JSON output (JSON Schema).
- **Backend**: Next.js API Routes (`/api/chat` and `/api/telegram`).
- **Web UI**: Modern Vanilla CSS design with glassmorphism and responsive layouts.
- **Messaging**: Telegram Bot API integration via secure webhooks.

## Agentic Behavior
The assistant is designed to act as a proactive planner rather than a simple chatbot:
1. **Deconstruction**: Automatically breaks vague user messages into granular tasks.
2. **Prioritization**: Assigns High/Medium/Low priority badges to every task.
3. **Reasoning**: Generates a plain-language "Daily Plan" explaining the flow of the day.
4. **Follow-up Logic**: Identifies missing information (e.g., times, deadines) and asks exactly one clarifying question.

## Security Practices
- **No Client-Side Keys**: The Gemini SDK is only initialized and called in server-side files.
- **Webhook Security**: The Telegram endpoint validates an `X-Telegram-Bot-Api-Secret-Token` header to ensure requests only come from Telegram.
- **Environment Variables**: All secrets (Gemini Key, Telegram Token, Webhook Secret) are stored as environment variables.
- **Public Repo Safety**: `.env` is ignored by Git. A `.env.example` is provided for configuration.

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/meron-23/Smart-Daily-Assistant.git
   cd Smart-Daily-Assistant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   - `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/).
   - `TELEGRAM_BOT_TOKEN`: Get from [@BotFather](https://t.me/botfather).
   - `WEBHOOK_SECRET`: A custom alphanumeric string for security.

4. **Run locally**:
   ```bash
   npm run dev
   ```

## Deployment
1. Deploy the project to **Vercel**.
2. Add the environment variables in the Vercel Dashboard.
3. Set your Telegram Webhook by visiting (or using curl):
   `https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<DEPLOY_URL>/api/telegram&secret_token=<SECRET>`

## Tech Stack
- Next.js 15
- TypeScript
- Google Generative AI SDK
- Vanilla CSS
- Telegram Bot API
