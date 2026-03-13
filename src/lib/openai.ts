import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
  const ext = mimeType.includes("ogg") ? "ogg" : "mp4";
  const file = new File([audioBuffer.buffer as ArrayBuffer], `audio.${ext}`, { type: mimeType });

  const result = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
    language: "es",
  });
  return result.text;
}

export async function generateReply(
  clientName: string,
  history: { role: "user" | "assistant"; content: string }[],
  newMessage: string
): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `Eres un asistente de atención al cliente para Vecino Alquila,
una empresa de arrendamiento de apartamentos en Colombia.
Tu nombre es Valentina. Responde siempre en español, de forma amable,
breve y profesional. Ayuda a los clientes con:
información sobre inmuebles disponibles, precios, zonas, visitas y citas.
El cliente se llama ${clientName}.`,
    },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: newMessage },
  ];

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 300,
    temperature: 0.7,
  });

  return res.choices[0].message.content ?? "Lo siento, no pude procesar tu mensaje.";
}
