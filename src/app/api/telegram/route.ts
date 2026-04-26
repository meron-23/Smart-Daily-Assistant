import { NextResponse } from "next/server";
import { processAssistantRequest } from "@/lib/gemini";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    // Validate secret token
    if (WEBHOOK_SECRET) {
      const secret = req.headers.get("x-telegram-bot-api-secret-token");
      if (secret !== WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true }); // Acknowledge anyway to avoid retries
    }

    const chatId = message.chat.id;
    const userText = message.text;

    // Process with AI
    const aiResponse = await processAssistantRequest(userText);

    // Format for Telegram
    let replyText = "";
    
    if (aiResponse.tasks && aiResponse.tasks.length > 0) {
      replyText += "📋 *Task List:*\n";
      aiResponse.tasks.forEach((t: any) => {
        const priorityIcon = t.priority === "high" ? "🔴" : t.priority === "medium" ? "🟡" : "🟢";
        replyText += `${priorityIcon} *${t.task}*${t.deadline ? ` (Due: ${t.deadline})` : ""}\n`;
      });
      replyText += "\n";
    }

    replyText += `🗓️ *Plan:*\n${aiResponse.plan}\n`;

    if (aiResponse.followUp) {
      replyText += `\n❓ *Question:* ${aiResponse.followUp}`;
    }

    // Send back to Telegram
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
        parse_mode: "Markdown",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Telegram API Error:", error);
    return { ok: true }; // Always return OK to Telegram to stop retries if there's a fatal err
  }
}
