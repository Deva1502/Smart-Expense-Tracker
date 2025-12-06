import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });
        const budgets = await Budget.find({ user: req.user._id });
        console.log(expenses);
        console.log(budgets);
        

        // Prepare data for prompt
        const expenseSummary = JSON.stringify(expenses);
        const budgetSummary = JSON.stringify(budgets);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
        As a financial advisor AI, analyze the following expense and budget data for the user.
        
        Expenses: ${expenseSummary}
        Budgets: ${budgetSummary}
        
        Please provide:
        1. An analysis of spending patterns.
        2. Identify any anomalies or unusual expenses.
        3. Recommendations for monthly budgets based on history.
        4. Alerts if any budget is exceeded or at risk.
        
        Format the response in JSON with keys: "spending_analysis", "anomalies", "recommendations", "alerts".
        Only return valid JSON, no markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        console.log(result);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '');

        try {
            res.json(JSON.parse(cleanedText));
        } catch (e) {
            console.error("JSON Parse Error:", e);
            // Fallback: Return raw text as analysis if JSON fails
            res.json({
                spending_analysis: text,
                anomalies: [],
                recommendations: [],
                alerts: []
            });
        }
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({
            message: 'AI Analysis failed',
            details: error.message
        });
    }
});

export default router;
