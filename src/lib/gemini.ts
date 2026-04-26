import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const schema: any = {
  description: "Daily plan and tasks",
  type: SchemaType.OBJECT,
  properties: {
    tasks: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          task: { type: SchemaType.STRING },
          priority: { type: SchemaType.STRING, enum: ["high", "medium", "low"] },
          deadline: { type: SchemaType.STRING, nullable: true },
        },
        required: ["task", "priority"],
      },
    },
    plan: { type: SchemaType.STRING },
    followUp: { type: SchemaType.STRING, nullable: true },
  },
  required: ["tasks", "plan", "followUp"],
};

export async function processAssistantRequest(message: string, history: any[] = []) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
    systemInstruction: {
      role: "system",
      parts: [{
        text: `You are a Smart Daily Assistant. Help users organize their day.
  Identify tasks, deadlines, and priorities.
  If information is missing (like specific times for events), ask exactly one follow-up question.
  If info is complete, provide a structured plan and set followUp to null.
  Output MUST be valid JSON.` }]
    },
  });

  const chat = model.startChat({
    history: history,
  });

  const result = await chat.sendMessage(message);
  const response = result.response.text();

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error("Failed to parse Gemini response:", response);
    return {
      tasks: [],
      plan: "Sorry, I couldn't process that. Please try again.",
      followUp: "Could you rephrase that?",
    };
  }
}
