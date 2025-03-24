import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/gemini", async (req, res) => {
    try {
        const response = await fetch(`${process.env.API_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: req.body.prompt }]
                    }
                ]
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
