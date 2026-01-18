import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/ask", async (req, res) => {
  try {
    const userQuestion = req.body.question;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
आप एक CTET शिक्षक हैं।
बहुत सरल हिंदी में उत्तर दीजिए।
उदाहरण देकर समझाइए।

प्रश्न:
${userQuestion}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ answer: response });

  } catch (err) {
    console.error("GEMINI ERROR:", err);
    res.json({
      error: "कुछ समस्या आ गई है (Gemini से जवाब नहीं मिल पाया)"
    });
  }
});

app.listen(3000, () => {
  console.log("CTET AI Assistant (Gemini) चल रहा है पोर्ट 3000 पर");
});
