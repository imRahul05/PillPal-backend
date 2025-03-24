import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Load environment variables
dotenv.config();

// Validate essential environment variables
if (!process.env.API_URL) {
    console.error("Missing API_URL environment variable");
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint for Render
app.get("/", (req, res) => {
    res.status(200).send("PillPal API is running");
});

// API endpoint
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

// Error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Keep the process running despite the error
});

// Start the server
const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server address: http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
    });
});

