// api/chat.js — Vercel Serverless Function (geen Express nodig)
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Pas dit aan voor jouw PGP Titus “persoonlijkheid”
const SYSTEM_PROMPT = `Je bent Onderwijsmodel PGP Titus: behulpzame onderwijsassistent (mbo/vo).
Beantwoord kort, duidelijk en in het Nederlands. Geef concrete stappen en voorbeelden.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  try {
    const { userMessage } = req.body || {};
    if (!userMessage) return res.status(400).json({ error: "userMessage ontbreekt" });

    const r = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ]
    });

    res.status(200).json({ text: r.output_text || "(geen antwoord ontvangen)" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Serverfout" });
  }
}
