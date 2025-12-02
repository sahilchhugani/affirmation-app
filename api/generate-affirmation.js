const fetch = require('node-fetch');

const categoryPrompts = {
  general: 'Give me a short, sweet, and uplifting affirmation to brighten my day. Make it feel personal and warm, like a friend encouraging me.',
  'self-love': 'Give me a heartfelt affirmation about self-love and self-acceptance. Help me appreciate and love myself more. Make it feel like a warm hug from a caring friend.',
  motivation: 'Give me a powerful, motivating affirmation to help me push through challenges and achieve my goals. Make it energizing and inspiring, like a coach cheering me on.',
  calm: 'Give me a calming, peaceful affirmation to help me feel relaxed and at ease. Help me find inner peace and tranquility. Make it soothing and gentle.',
  confidence: 'Give me an empowering affirmation to boost my confidence and self-belief. Help me feel strong and capable. Make it bold and uplifting.',
  gratitude: 'Give me a warm affirmation about gratitude and appreciation for life. Help me focus on the good things around me. Make it heartfelt and genuine.',
  healing: 'Give me a gentle, nurturing affirmation for emotional healing and growth. Help me process difficult feelings with compassion. Make it tender and supportive.'
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
      return res.status(500).json({ error: 'API key not configured', env: Object.keys(process.env).filter(k => k.includes('ANTHROPIC')) });
    }

    const category = req.query.category || 'general';
    const prompt = categoryPrompts[category] || categoryPrompts.general;

    const affirmation = await generateAffirmationFromClaude(prompt, ANTHROPIC_API_KEY);
    
    res.status(200).json({ affirmation });
  } catch (error) {
    console.error('Anthropic API error:', error.message);
    res.status(500).json({ error: 'Failed to generate affirmation. ' + error.message });
  }
};
