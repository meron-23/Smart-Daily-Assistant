# Smart Daily Assistant Agent

A stateless, cross-platform AI assistant that organizes your day using Meta Llama 3.1 70B via NVIDIA NIM. Accessible via a premium Web UI and a Telegram Bot.

## Live Demo
- **Web UI**: [smart-daily-asistant.vercel.app](https://smart-daily-asistant-git-main-meronmuluye75-gmailcoms-projects.vercel.app/)
- **Telegram Bot**: `@[YOUR_BOT_USERNAME]`

## Architecture
This project is built with **Next.js 15 (App Router)** and follows a strictly server-side architecture for AI processing.

- **Core Intelligence**: Meta Llama 3.1 70B via NVIDIA NIM (OpenAI-compatible).
- **Backend**: Next.js API Routes (`/api/chat` and `/api/telegram`).
- **Web UI**: Modern Vanilla CSS design with glassmorphism and responsive layouts.
- **Messaging**: Telegram Bot API integration via secure webhooks.

## Agentic Behavior
The assistant is designed to act as a proactive planner rather than a simple chatbot:
1. **Deconstruction**: Automatically breaks vague user messages into granular tasks.
2. **Prioritization**: Assigns High/Medium/Low priority badges to every task.
3. **Reasoning**: Generates a plain-language "Daily Plan" explaining the flow of the day.
4. **Follow-up Logic**: Identifies missing information (e.g., times, deadlines) and asks exactly one clarifying question.

## Security Practices
- **No Client-Side Keys**: The AI SDK is only initialized and called in server-side files.
- **Webhook Security**: The Telegram endpoint validates an `X-Telegram-Bot-Api-Secret-Token` header to ensure requests only come from Telegram.
- **Environment Variables**: All secrets are stored as environment variables on Vercel.
- **Public Repo Safety**: `.env` is ignored by Git. A `.env.example` is provided for configuration.

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/meron-23/Smart-Daily-Assistant.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   - `NVIDIA_API_KEY`: Get from NVIDIA NIM.
   - `TELEGRAM_BOT_TOKEN`: Get from @BotFather.
   - `WEBHOOK_SECRET`: A custom string (e.g., `123456`).

4. **Run locally**:
   ```bash
   npm run dev
   ```

## Deployment
1. Deploy to **Vercel**.
2. Set Environment Variables in Vercel Dashboard.
3. Set your Telegram Webhook to point to `your-site.vercel.app/api/telegram`.

## Tech Stack
- Next.js 15
- TypeScript
- OpenAI SDK (connecting to NVIDIA NIM)
- Vanilla CSS
- Telegram Bot API