import mongoose from 'mongoose';

const expenseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true, // e.g., 'Cash', 'Credit Card'
    },
    date: {
        type: Date,
        default: Date.now,
    },
    notes: {
        type: String,
    }
}, {
    timestamps: true,
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
