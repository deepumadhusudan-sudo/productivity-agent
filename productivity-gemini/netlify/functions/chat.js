export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured on server." }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body);

    // Convert messages to Gemini format
    const systemPrompt = `You are a daily productivity assistant. Keep all answers SHORT and PRACTICAL (2-5 sentences max).

Your tasks:
- Help organize work and personal tasks
- Suggest priorities (use High/Medium/Low labels)
- Break large tasks into small numbered steps
- Ask ONE follow-up question when you need clarity

Formatting rules:
- Use ✅ for completed/done items
- Use 🔴 High, 🟡 Medium, 🟢 Low for priorities
- Use numbered lists for steps
- Never write long paragraphs
- Always end with an actionable suggestion`;

    // Gemini uses "contents" array with "parts"
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error.message }),
      };
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error: " + err.message }),
    };
  }
};
