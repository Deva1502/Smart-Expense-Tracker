import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function testConfig() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log("Testing gemini-2.0-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Test");
        console.log("SUCCESS: gemini-2.0-flash response:", await result.response.text());
        fs.writeFileSync('result.txt', 'SUCCESS');
    } catch (error) {
        console.error("FAILED:", error.message);
        fs.writeFileSync('result.txt', `FAILED: ${error.message}`);
    }
}
testConfig();
