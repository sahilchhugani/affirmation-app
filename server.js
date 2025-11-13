// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();
console.log('Loaded OpenAI Key:', process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.get('/generate-affirmation', async (req, res) => {
  try {
    const prompt =
      'Give me a short, original, uplifting daily affirmation with a positive emoji at the end.';
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 32,
        temperature: 1.1,
      }),
    });
    if (!openaiRes.ok) {
      const error = await openaiRes.text();
      console.error('OpenAI API error:', error);
      throw new Error('OpenAI API error: ' + error);
    }
    const data = await openaiRes.json();
    const affirmation = data.choices?.[0]?.message?.content?.trim();
    res.json({ affirmation });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Failed to fetch affirmation.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Create a .env file in the project root and add: OPENAI_API_KEY=your_openai_key_here
