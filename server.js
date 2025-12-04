// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('Warning: ANTHROPIC_API_KEY not found in .env file');
} else {
  console.log('Anthropic API key loaded successfully');
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Function to call Anthropic Claude API
async function generateAffirmationFromClaude(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
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

// Category prompts for different affirmation types
const categoryPrompts = {
  general: 'Give me a simple, warm reminder that things are okay. Like a friend casually reassuring me.',
  'self-love': 'Remind me to be kind to myself today. Keep it simple and real.',
  motivation: 'Give me a gentle push to keep going. Not over the top, just real encouragement.',
  calm: 'Help me take a breath and feel okay. Something soothing and simple.',
  confidence: 'Remind me that I can handle this. Keep it grounded and real.',
  gratitude: 'Help me notice something good right now. Keep it simple.',
  healing: 'Remind me it is okay to not be okay. Be gentle and real.'
};

// Relationship mode prompts - for couples
const relationshipPrompts = {
  love: (partnerName) => `Write a sweet, romantic affirmation for my partner ${partnerName}. Make it feel like a loving message from their significant other - warm, intimate, and full of love. Keep it 1-2 sentences with a romantic emoji.`,
  appreciation: (partnerName) => `Write a heartfelt message of appreciation for my partner ${partnerName}. Express gratitude for having them in my life and what they mean to me. Make it feel genuine and loving, 1-2 sentences with a heart emoji.`,
  support: (partnerName) => `Write an encouraging, supportive message for my partner ${partnerName}. Let them know I believe in them and I'm always here for them. Make it feel like a warm hug from their loving partner, 1-2 sentences with a supportive emoji.`,
  missing: (partnerName) => `Write a sweet "missing you" message for my partner ${partnerName}. Express how much I think about them and can't wait to see them. Make it romantic and heartfelt, 1-2 sentences with a loving emoji.`,
  goodmorning: (partnerName) => `Write a sweet good morning message for my partner ${partnerName}. Start their day with love and warmth. Make it feel like waking up to a loving text, 1-2 sentences with a morning/love emoji.`,
  goodnight: (partnerName) => `Write a tender goodnight message for my partner ${partnerName}. End their day with love and sweet dreams. Make it cozy and romantic, 1-2 sentences with a night/love emoji.`
};

// Relationship mode endpoint
app.get('/generate-relationship-affirmation', async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const category = req.query.category || 'love';
    const partnerName = req.query.partnerName || 'my love';
    const promptGenerator = relationshipPrompts[category] || relationshipPrompts.love;
    const prompt = promptGenerator(partnerName);

    const affirmation = await generateAffirmationFromClaude(prompt);
    
    res.json({ affirmation });
  } catch (error) {
    console.error('Anthropic API error:', error.message);
    res.status(500).json({ error: 'Failed to generate affirmation. ' + error.message });
  }
});

app.get('/generate-affirmation', async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const category = req.query.category || 'general';
    const customFeeling = req.query.feeling;
    
    let prompt;
    if (customFeeling && customFeeling.trim()) {
      prompt = `I'm feeling: "${customFeeling}". Give me a short affirmation that fits this feeling.`;
    } else {
      prompt = categoryPrompts[category] || categoryPrompts.general;
    }

    const affirmation = await generateAffirmationFromClaude(prompt);
    
    res.json({ affirmation });
  } catch (error) {
    console.error('Anthropic API error:', error.message);
    res.status(500).json({ error: 'Failed to generate affirmation. ' + error.message });
  }
});

app.get('/generate-daily-affirmation', async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const affirmation = await generateAffirmationFromClaude(
      'Give me a special, meaningful daily affirmation. This should be more profound and thoughtful than a regular affirmation - something to reflect on throughout the day. Make it feel like a heartfelt message from someone who truly cares about me.'
    );
    
    res.json({ affirmation });
  } catch (error) {
    console.error('Anthropic API error:', error.message);
    res.status(500).json({ error: 'Failed to generate daily affirmation. ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
