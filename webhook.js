// webhook.js - Receives incoming WhatsApp messages
require('dotenv').config();
const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const BSP_API_URL = process.env.BSP_API_URL;
const ACCESS_TOKEN = process.env.BSP_ACCESS_TOKEN;

const app = express();
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

// Campaign context - customize for your campaign
const CAMPAIGN_CONTEXT = `
You are a friendly campaign assistant for [YOUR BRAND].
Current campaign: Summer Sale 2026 - 30% off all products.
Rules:
- Keep responses under 3 sentences
- Always include a clear call-to-action
- If asked about pricing, reference the 30% discount
- Escalate to human if user says "agent" or shows frustration
- Collect email if user shows purchase intent
`;

app.post('/webhook', async (req, res) => {
  // Ack immediately - WhatsApp/BSP webhooks retry (and can disable the
  // webhook) if a response doesn't arrive within a few seconds.
  res.sendStatus(200);

  const { from, text, type } = req.body || {};

  if (type !== 'message' || !from || !text?.body) {
    return;
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      system: CAMPAIGN_CONTEXT,
      messages: [{ role: 'user', content: text.body }],
    });

    if (message.stop_reason === 'refusal') {
      console.warn(`Claude declined to respond to ${from}`, message.stop_details);
      return;
    }

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock) {
      console.warn(`No text content in Claude response for ${from}`);
      return;
    }

    await sendWhatsAppMessage(from, textBlock.text);
  } catch (err) {
    console.error(`Failed to handle message from ${from}:`, err.message);
  }
});

async function sendWhatsAppMessage(to, text) {
  await axios.post(
    `${BSP_API_URL}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      text: { body: text },
    },
    {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    }
  );
}

app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
