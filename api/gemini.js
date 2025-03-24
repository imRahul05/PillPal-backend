// api/gemini.js - Place this in the /api directory
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const API_URL = process.env.API_URL;
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      
      if (!API_URL || !GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API configuration missing' });
      }
  
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: req.body.prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return res.status(500).json({ error: error.message });
    }
  }