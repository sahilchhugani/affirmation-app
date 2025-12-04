const fetch = require('node-fetch');

const categoryPrompts = {
  general: 'Give me a simple, warm reminder that things are okay. Like a friend casually reassuring me.',
  'self-love': 'Remind me to be kind to myself today. Keep it simple and real.',
  motivation: 'Give me a gentle push to keep going. Not over the top, just real encouragement.',
  calm: 'Help me take a breath and feel okay. Something soothing and simple.',
  confidence: 'Remind me that I can handle this. Keep it grounded and real.',
  gratitude: 'Help me notice something good right now. Keep it simple.',
  healing: 'Remind me it is okay to not be okay. Be gentle and real.'
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
      system: 'Give a short, warm affirmation (under 12 words). It should feel genuine and human, not cheesy or over-the-top. End with one emoji. Example tone: "You are doing better than you think 💛" or "It is okay to take things slow 🌿"'
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
      // Show all env var names to debug
      return res.status(500).json({ 
        error: 'API key not configured', 
        allEnvKeys: Object.keys(process.env).slice(0, 20),
        hasAnthropic: Object.keys(process.env).filter(k => k.toLowerCase().includes('anthrop'))
      });
    }

    const category = req.query.category || 'general';
    const customFeeling = req.query.feeling;
    
    let prompt;
    if (customFeeling && customFeeling.trim()) {
      prompt = `I'm feeling: "${customFeeling}". Give me a short affirmation that fits this feeling.`;
    } else {
      prompt = categoryPrompts[category] || categoryPrompts.general;
    }

    const affirmation = await generateAffirmationFromClaude(prompt, ANTHROPIC_API_KEY);
    
    res.status(200).json({ affirmation });
  } catch (error) {
    console.error('Anthropic API error:', error.message);
    res.status(500).json({ error: 'Failed to generate affirmation. ' + error.message });
  }
};
