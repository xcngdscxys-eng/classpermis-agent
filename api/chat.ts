import { OpenAI } from "openai";
import { intents } from "../data/intents.js";
import { faq } from "../data/faq.js";
import { flows } from "../data/flows.js";

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

// Fallback sans IA (mode local uniquement)
return res.status(200).json({
  reply:
    "Je n’ai pas encore cette information. Souhaitez-vous être rappelé par l’auto-école ou poser une autre question ?"
});

