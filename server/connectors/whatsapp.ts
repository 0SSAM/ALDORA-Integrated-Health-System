import { WhatsAppMessagePayload, validateWhatsAppPayload } from "../domain/whatsapp-policy";
import { ENV } from "../_core/env";

export async function sendWhatsAppMessage(payload: WhatsAppMessagePayload) {
  validateWhatsAppPayload(payload);

  const apiKey = process.env.WHATSAPP_API_KEY;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!apiKey || !phoneNumberId) {
    // In demo/dev mode without keys, we log but don't fail the operational flow
    console.warn("[WhatsApp] Integration keys missing. Message logged to console instead of sent.");
    console.info(`[WhatsApp Simulation] To: ${payload.to}, Body: ${payload.text || payload.templateName}`);
    return { success: true, messageId: `sim_${Date.now()}`, simulated: true };
  }

  // Real Meta WhatsApp Business API call
  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
  const body = payload.templateName ? {
    messaging_product: "whatsapp",
    to: payload.to,
    type: "template",
    template: {
      name: payload.templateName,
      language: { code: payload.templateLanguage || "en_US" },
      components: payload.components
    }
  } : {
    messaging_product: "whatsapp",
    to: payload.to,
    type: "text",
    text: { body: payload.text }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp API failed: ${error}`);
  }

  return await response.json();
}
