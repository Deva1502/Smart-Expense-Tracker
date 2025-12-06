import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testKey() {
    console.log("Testing API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Sending prompt to gemini-1.5-flash...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Response:", response.text());
        console.log("SUCCESS: Key and Model are working.");
    } catch (error) {
        console.error("ERROR:", error.message);
        console.error("Full Error:", JSON.stringify(error, null, 2));
    }
}

testKey();
