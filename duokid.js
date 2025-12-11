export default async function handler(req, res) {
    try {
        const { userText } = JSON.parse(req.body);

        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are DuoKid, a friendly children's voice assistant." },
                    { role: "user", content: userText }
                ]
            })
        });

        const data = await openaiRes.json();

        const reply = data?.choices?.[0]?.message?.content || "I cannot respond right now.";

        res.status(200).json({ reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Server error." });
    }
}
