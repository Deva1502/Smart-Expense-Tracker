import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBudget } from '../features/budgets/budgetSlice';
import { Target } from 'lucide-react';

const SetBudgetForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        category: 'Food & Dining',
        amount: '',
        month: new Date().toISOString().slice(0, 7) // YYYY-MM
    });

    const { category, amount, month } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(setBudget({
            category,
            amount: Number(amount),
            month
        }));
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                    Category
                </label>
                <select
                    name="category"
                    id="category"
                    value={category}
                    onChange={onChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
                    Monthly Budget Limit
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
                        placeholder="e.g. 500"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-400 mb-1">
                    Month
                </label>
                <input
                    type="month"
                    name="month"
                    id="month"
                    value={month}
                    onChange={onChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-6"
            >
                <Target size={20} />
                Set Budget
            </button>
        </form>
    );
};

export default SetBudgetForm;
