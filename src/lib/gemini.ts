import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function processAssistantRequest(message: string, history: any[] = []) {
  const systemInstruction = `You are a Smart Daily Assistant. Help users organize their day.
  Identify tasks, deadlines, and priorities.
  If information is missing (like specific times for events), ask exactly one follow-up question in the followUp field.
  If info is complete, provide a structured plan and set followUp to null.
  
  REQUIRED JSON STRUCTURE:
  {
    "tasks": [
      { "task": "string", "priority": "high" | "medium" | "low", "deadline": "string or null" }
    ],
    "plan": "string summary of the day",
    "followUp": "string question or null"
  }
  
  Always respond in JSON format.`;

  try {
    const formattedHistory = history.map((h: any) => ({
      role: h.role === "user" ? "user" : "assistant",
      content: typeof h.parts[0].text === "string" ? h.parts[0].text : JSON.stringify(h.parts[0].text)
    }));

    const response = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [
        { role: "system", content: systemInstruction },
        ...formattedHistory,
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content);
  } catch (error: any) {
    console.error("NVIDIA API Error:", error);
    return {
      tasks: [],
      plan: "I'm having trouble connecting to my brain right now. Please try again later.",
      followUp: "Shall we try once more?",
    };
  }
}
