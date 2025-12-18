import { OpenAI } from "openai";
import { intents } from "../data/intents";
import { faq } from "../data/faq";
import { flows } from "../data/flows";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message manquant" });
  }

  const text = message.toLowerCase();

  // 1️⃣ Recherche d’intention simple
  for (const intent of intents) {
    if (intent.keywords.some((k) => text.includes(k))) {
      const answer =
        faq[intent.name] ||
        flows[intent.name];

      if (answer) {
        return res.status(200).json({ reply: answer });
      }
    }
  }

  // 2️⃣ Fallback IA (cas rare)
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu es l’assistant officiel de l’auto-école Class’Permis. Réponds de façon claire, professionnelle, concise. N’invente jamais de tarifs ou de règles."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300
    });

    const reply = completion.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Erreur IA" });
  }
}
