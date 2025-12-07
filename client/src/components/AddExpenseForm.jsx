import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createExpense } from '../features/expenses/expenseSlice';
import { Plus } from 'lucide-react';

const AddExpenseForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
    });

    const { title, amount, category, date } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createExpense({ title, amount: Number(amount), category, date }));
        onClose();
    };

    const categories = [
        'Food & Dining',
        'Transportation',
        'Utilities',
        'Entertainment',
        'Shopping',
        'Healthcare',
        'Education',
        'Housing',
        'Other'
    ];

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={onChange}
                    required
                    placeholder="e.g., Grocery Shopping"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
            </div>

            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
                    Amount
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={amount}
                        onChange={onChange}
                        required
                        placeholder="0.00"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                        Category
                    </label>
                    <select
                        name="category"
                        id="category"
                        value={category}
                        onChange={onChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">
                        Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        value={date}
                        onChange={onChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-6"
            >
                <Plus size={20} />
                Add Transaction
            </button>
        </form>
    );
};

export default AddExpenseForm;
