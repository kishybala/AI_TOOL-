import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "./firebaseConfig.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Server is running!");
});


app.post("/api/analyze", async (req, res) => {
  try {
    // Sirf kuch fields ke bajaye poora req.body lein
    const formData = req.body;
    const { studentName, fatherName, age, eyeContact, speechLevel, socialResponse, sensoryReactions } = formData;

    console.log("Form data received:", formData);

    // Modified prompt to include activity titles/headings
    const prompt = `
Based on this child’s responses, give 3 short therapy goals and 2 activities that can help improvement.
For each activity, also provide a short heading/title.
Child details:
Age: ${age}
Eye Contact: ${eyeContact}
Speech Level: ${speechLevel}
Social Response: ${socialResponse}
Sensory Reactions: ${sensoryReactions.join(", ")}

ONLY RETURN RAW JSON, do NOT include any markdown formatting or code blocks.
Format:
{
  "therapy_goals": ["Goal 1","Goal 2","Goal 3"],
  "activities": [
    {"title": "Activity 1 heading", "description": "Activity 1 description"},
    {"title": "Activity 2 heading", "description": "Activity 2 description"}
  ]
}
`;

    console.log("🔄 Calling Gemini API...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); // Model ka naam "gemini-1.0-pro" karein
    const result = await model.generateContent(prompt);
    const aiResponse = result.response;
    let aiText = aiResponse.text();
    console.log("✅ AI raw text:", aiText);

    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedData;
    try {
      parsedData = JSON.parse(aiText);
    } catch (err) {
      console.error("Error parsing AI response:", err);
      parsedData = {
        therapy_goals: ["Could not generate goals"],
        activities: [
          { title: "Could not generate title", description: "Could not generate description" },
          { title: "Could not generate title", description: "Could not generate description" }
        ]
      };
    }

    // Firestore me poora formData save 
    await db.collection("aiReports").add({
      ...formData, // Poora form data yahan save hoga (naam, pita ka naam, etc.)
      aiResponse: parsedData,
      createdAt: new Date(),
    });

    console.log("✅ Data saved to Firestore successfully!");

    res.json(parsedData);

  } catch (error) {
    console.error("❌ Error in AI processing:", error.message);
    console.error("Full error:", error);
    res.status(500).json({
      error: "AI processing failed",
      message: error.message,
      therapy_goals: ["Error: Unable to generate goals"],
      activities: [
        { title: "Error", description: "Unable to generate activities" }
      ]
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
