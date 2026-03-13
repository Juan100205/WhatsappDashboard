const PHONE_ID    = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;
const API_BASE    = `https://graph.facebook.com/v19.0/${PHONE_ID}`;

export async function sendTextMessage(to: string, text: string) {
  const res = await fetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`WhatsApp API error: ${JSON.stringify(err)}`);
  }
  return res.json();
}

export async function markAsRead(messageId: string) {
  await fetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    }),
  });
}

export async function downloadMedia(mediaId: string): Promise<Buffer> {
  // 1. Obtener URL del media
  const metaRes = await fetch(
    `https://graph.facebook.com/v19.0/${mediaId}`,
    { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
  );
  const { url } = await metaRes.json();

  // 2. Descargar el archivo
  const fileRes = await fetch(url, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });
  const buffer = await fileRes.arrayBuffer();
  return Buffer.from(buffer);
}
