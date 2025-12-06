import express from 'express';
import Expense from '../models/Expense.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, async (req, res) => {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    })
    .post(protect, async (req, res) => {
        const { description, amount, category, paymentMethod, date, notes } = req.body;

        const expense = new Expense({
            user: req.user._id,
            description,
            amount,
            category,
            paymentMethod,
            date,
            notes,
        });

        const createdExpense = await expense.save();
        res.status(201).json(createdExpense);
    });

router.route('/:id')
    .delete(protect, async (req, res) => {
        const expense = await Expense.findById(req.params.id);

        if (expense) {
            if (expense.user.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error('Not authorized');
            }
            await expense.deleteOne();
            res.json({ message: 'Expense removed' });
        } else {
            res.status(404);
            throw new Error('Expense not found');
        }
    })
    .put(protect, async (req, res) => {
        const expense = await Expense.findById(req.params.id);

        if (expense) {
            if (expense.user.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error('Not authorized');
            }

            expense.description = req.body.description || expense.description;
            expense.amount = req.body.amount || expense.amount;
            expense.category = req.body.category || expense.category;
            expense.paymentMethod = req.body.paymentMethod || expense.paymentMethod;
            expense.date = req.body.date || expense.date;
            expense.notes = req.body.notes || expense.notes;

            const updatedExpense = await expense.save();
            res.json(updatedExpense);
        } else {
            res.status(404);
            throw new Error('Expense not found');
        }
    });

export default router;
