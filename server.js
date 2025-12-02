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
app.use(express.static('.'));

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

// Category prompts for different affirmation types
const categoryPrompts = {
  general: 'Give me a short, sweet, and uplifting affirmation to brighten my day. Make it feel personal and warm, like a friend encouraging me.',
  'self-love': 'Give me a heartfelt affirmation about self-love and self-acceptance. Help me appreciate and love myself more. Make it feel like a warm hug from a caring friend.',
  motivation: 'Give me a powerful, motivating affirmation to help me push through challenges and achieve my goals. Make it energizing and inspiring, like a coach cheering me on.',
  calm: 'Give me a calming, peaceful affirmation to help me feel relaxed and at ease. Help me find inner peace and tranquility. Make it soothing and gentle.',
  confidence: 'Give me an empowering affirmation to boost my confidence and self-belief. Help me feel strong and capable. Make it bold and uplifting.',
  gratitude: 'Give me a warm affirmation about gratitude and appreciation for life. Help me focus on the good things around me. Make it heartfelt and genuine.',
  healing: 'Give me a gentle, nurturing affirmation for emotional healing and growth. Help me process difficult feelings with compassion. Make it tender and supportive.'
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
    const prompt = categoryPrompts[category] || categoryPrompts.general;

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
