const fetch = require('node-fetch');

const relationshipPrompts = {
  love: (partnerName) => `Write a sweet, romantic affirmation for my partner ${partnerName}. Make it feel like a loving message from their significant other - warm, intimate, and full of love. Keep it 1-2 sentences with a romantic emoji.`,
  appreciation: (partnerName) => `Write a heartfelt message of appreciation for my partner ${partnerName}. Express gratitude for having them in my life and what they mean to me. Make it feel genuine and loving, 1-2 sentences with a heart emoji.`,
  support: (partnerName) => `Write an encouraging, supportive message for my partner ${partnerName}. Let them know I believe in them and I'm always here for them. Make it feel like a warm hug from their loving partner, 1-2 sentences with a supportive emoji.`,
  missing: (partnerName) => `Write a sweet "missing you" message for my partner ${partnerName}. Express how much I think about them and can't wait to see them. Make it romantic and heartfelt, 1-2 sentences with a loving emoji.`,
  goodmorning: (partnerName) => `Write a sweet good morning message for my partner ${partnerName}. Start their day with love and warmth. Make it feel like waking up to a loving text, 1-2 sentences with a morning/love emoji.`,
  goodnight: (partnerName) => `Write a tender goodnight message for my partner ${partnerName}. End their day with love and sweet dreams. Make it cozy and romantic, 1-2 sentences with a night/love emoji.`
};

async function generateAffirmationFromClaude(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      system: 'You are a warm, caring friend who gives personalized, heartfelt affirmations. Your affirmations should feel natural and personal, like something a loving friend would say. Keep them concise (1-2 sentences) and include a relevant emoji at the end. Make each affirmation unique and uplifting. Only respond with the affirmation itself, no extra text.'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Anthropic API request failed');
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

module.exports = async (req, res) => {
  try {
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const category = req.query.category || 'love';
    const partnerName = req.query.partnerName || 'my love';
    const promptGenerator = relationshipPrompts[category] || relationshipPrompts.love;
    const prompt = promptGenerator(partnerName);

    const affirmation = await generateAffirmationFromClaude(prompt, ANTHROPIC_API_KEY);
    
    res.status(200).json({ affirmation });
  } catch (error) {
    console.error('Anthropic API error:', error.message);
    res.status(500).json({ error: 'Failed to generate affirmation. ' + error.message });
  }
};
