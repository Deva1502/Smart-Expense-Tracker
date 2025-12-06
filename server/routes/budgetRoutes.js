import express from 'express';
import Budget from '../models/Budget.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, async (req, res) => {
        const budgets = await Budget.find({ user: req.user._id });
        res.json(budgets);
    })
    .post(protect, async (req, res) => {
        const { category, amount, month } = req.body;

        // Check if budget already exists for this category and month
        const existingBudget = await Budget.findOne({
            user: req.user._id,
            category,
            month
        });

        if (existingBudget) {
            existingBudget.amount = amount;
            const updatedBudget = await existingBudget.save();
            return res.json(updatedBudget);
        }

        const budget = new Budget({
            user: req.user._id,
            category,
            amount,
            month
        });

        const createdBudget = await budget.save();
        res.status(201).json(createdBudget);
    });

export default router;
