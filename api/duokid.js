export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { userText } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY env variable" });
    }

    if (!userText) {
      return res.status(400).json({ error: "Missing userText" });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are DuoKid — a friendly and safe voice assistant for children."
          },
          {
            role: "user",
            content: userText
          }
        ]
      })
    });

    const data = await openaiRes.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Invalid response from OpenAI", raw: data });
    }

    const reply = data.choices[0].message.content;

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}