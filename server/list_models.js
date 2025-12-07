import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function listModels() {
    try {
        // We'll access the API directly via fetch if the SDK doesn't expose listModels easily in this version, 
        // but typically it's under the generativeModel or specialized client. 
        // Actually, the SDK has a way. Let's try to use the raw API if needed, but let's try a simple generation with "gemini-pro" first as a fallback check?
        // No, let's stick to the plan: List models.

        // Wait, the node SDK 0.24 should verify.
        // Let's just try to change to 'gemini-pro' in the test script as a quick check, 
        // while also writing a list models script.

        /* 
           The SDK doesn't always expose listModels directly on the main class easily without some setup. 
           Let's use a simple fetch to the REST API using the key.
        */
        const key = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("Models:", JSON.stringify(data, null, 2));
        fs.writeFileSync('models_list.txt', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("FAILED:", error.message);
        fs.writeFileSync('models_list.txt', `Error: ${error.message}`);
    }
}
listModels();
