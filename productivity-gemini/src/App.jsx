import { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hey! I'm your productivity assistant.\n\nTell me what's on your plate today — tasks, projects, anything — and I'll help you organize and prioritize. What are you working on?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Error: " + data.error }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) =>
    text.split("\n").map((line, i) => (
      <span key={i}>{line}{i < text.split("\n").length - 1 && <br />}</span>
    ));

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f1923 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif", padding: "16px",
    }}>
      <div style={{
        width: "100%", maxWidth: "680px", height: "90vh",
        display: "flex", flexDirection: "column",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px", overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
      }}>

        {/* Header */}
        <div style={{
          padding: "20px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "14px",
            background: "linear-gradient(135deg, #4ade80, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
          }}>⚡</div>
          <div>
            <div style={{ color: "#f0f0f0", fontWeight: "600", fontSize: "16px" }}>
              Productivity Assistant
            </div>
            <div style={{ color: "#4ade80", fontSize: "12px", marginTop: "2px" }}>
              ● Powered by Gemini (Free)
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "24px 20px",
          display: "flex", flexDirection: "column", gap: "16px",
          scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}>
              <div style={{
                maxWidth: "82%", padding: "14px 18px",
                borderRadius: msg.role === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #4ade80, #06b6d4)"
                  : "rgba(255,255,255,0.07)",
                color: msg.role === "user" ? "#0f0f1a" : "#e8e8f0",
                fontSize: "14.5px", lineHeight: "1.65",
                fontWeight: msg.role === "user" ? "500" : "400",
                border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
                boxShadow: msg.role === "user" ? "0 4px 20px rgba(74,222,128,0.2)" : "none",
              }}>
                {formatMessage(msg.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                padding: "14px 20px", borderRadius: "20px 20px 20px 6px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", gap: "6px", alignItems: "center",
              }}>
                {[0, 1, 2].map((d) => (
                  <div key={d} style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: "#4ade80",
                    animation: `bounce 1.2s ${d * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(0,0,0,0.2)",
          display: "flex", gap: "12px", alignItems: "flex-end",
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your tasks or questions..."
            rows={1}
            style={{
              flex: 1, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px", padding: "12px 16px",
              color: "#f0f0f0", fontSize: "14px", resize: "none",
              outline: "none", fontFamily: "'Georgia', serif",
              lineHeight: "1.5", maxHeight: "120px", overflowY: "auto",
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(74,222,128,0.4)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              width: "46px", height: "46px", borderRadius: "14px", border: "none",
              background: loading || !input.trim()
                ? "rgba(255,255,255,0.08)"
                : "linear-gradient(135deg, #4ade80, #06b6d4)",
              color: loading || !input.trim() ? "rgba(255,255,255,0.3)" : "#0f0f1a",
              fontSize: "18px",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >↑</button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        textarea::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
    </div>
  );
}
