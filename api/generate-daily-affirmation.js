const fetch = require('node-fetch');

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

    const affirmation = await generateAffirmationFromClaude(
      'Give me a special, meaningful daily affirmation. This should be more profound and thoughtful than a regular affirmation - something to reflect on throughout the day. Make it feel like a heartfelt message from someone who truly cares about me.',
      ANTHROPIC_API_KEY
    );
    
    res.status(200).json({ affirmation });
  } catch (error) {
    console.error('Anthropic API error:', error.message);
    res.status(500).json({ error: 'Failed to generate daily affirmation. ' + error.message });
  }
};
