import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}`);
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`SUCCESS: ${modelName} works.`);
        return true;
    } catch (error) {
        console.error(`ERROR with ${modelName}:`, error.message);
        return false;
    }
}

async function runTests() {
    console.log("Testing API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-2.0-flash"];
    for (const model of models) {
        await testModel(model);
    }
}

runTests();
