"use client";

import { useState, useRef, useEffect } from "react";

interface Task {
  task: string;
  priority: "high" | "medium" | "low";
  deadline: string | null;
}

interface AssistantResponse {
  tasks: Task[];
  plan: string;
  followUp: string | null;
}

interface Message {
  role: "user" | "assistant";
  content: string | AssistantResponse;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ 
          text: typeof m.content === "string" 
            ? m.content 
            : `Plan: ${m.content.plan}. Tasks: ${m.content.tasks.map(t => t.task).join(", ")}` 
        }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please check your connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1>Smart Assistant</h1>
        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Plan your day with Gemini Intelligence</p>
      </header>

      <div className="chat-container">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.4 }}>
            <p>Start by describing your tasks for today...</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>"I need to finish my report by 2pm, buy groceries, and call the vet."</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role === "user" ? "user-message" : "assistant-message"}`}>
            {typeof msg.content === "string" ? (
              <p>{msg.content}</p>
            ) : "error" in msg.content ? (
              <p className="error-text">Error: {(msg.content as any).error}</p>
            ) : (
              <div>
                {(msg.content as AssistantResponse).tasks?.length > 0 && (
                  <>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Daily Tasks</h3>
                    <ul className="task-list">
                      {(msg.content as AssistantResponse).tasks.map((task, j) => (
                        <li key={j} className="task-item">
                          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                          <span style={{ fontWeight: 500 }}>{task.task}</span>
                          {task.deadline && (
                            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.6 }}>{task.deadline}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                <div className="plan-text">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem', marginTop: '1rem' }}>Plan</h3>
                  <p>{(msg.content as AssistantResponse).plan}</p>
                </div>

                {(msg.content as AssistantResponse).followUp && (
                  <div className="follow-up">
                    <strong>Question:</strong> {(msg.content as AssistantResponse).followUp}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="message assistant-message">
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Plan my day: ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
    </main>
  );
}
