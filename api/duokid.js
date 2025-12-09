export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Brak tekstu" });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Jesteś Duokidem – spokojnym, ciepłym głosem dla dzieci 3–5 lat. Mów bardzo prosto, bezpiecznie. Nigdy nie poruszaj tematów przemocy, seksualności, polityki ani strasznych rzeczy. Zawsze zachęcaj, by ważne sprawy mówić mamie lub tacie."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.6
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Jestem tutaj.";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Błąd połączenia z AI" });
  }
}
