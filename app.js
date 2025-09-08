const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("its Working");
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt, framework } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an experienced programmer with expertise in web development and UI/UX design. 
You create modern, animated, and fully responsive UI components.  
Now, generate a UI component for: ${prompt}  
Framework to use: ${framework}  
Requirements:
- Clean, well-structured, easy to understand code
- Responsive, animated, SEO optimized
- Include hover effects, shadows, animations, colors, typography
- Return ONLY the code inside Markdown fenced code blocks
- No explanations or comments
- Full single HTML file`,
    });
const output =result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ text: output  });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
