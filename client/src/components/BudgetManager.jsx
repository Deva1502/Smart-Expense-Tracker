import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBudget, deleteBudget } from '../features/budgets/budgetSlice';
import { Target, Trash2, Edit2, Plus, X } from 'lucide-react';

const BudgetManager = ({ onClose }) => {
    const dispatch = useDispatch();
    const { budgets } = useSelector((state) => state.budgets);

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        category: 'Food & Dining',
        amount: '',
        month: new Date().toISOString().slice(0, 7) // YYYY-MM
    });

    const { category, amount, month } = formData;

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

    const resetForm = () => {
        setFormData({
            category: 'Food & Dining',
            amount: '',
            month: new Date().toISOString().slice(0, 7)
        });
        setIsEditing(false);
    };

    const handleEdit = (budget) => {
        setFormData({
            category: budget.category,
            amount: budget.amount,
            month: budget.month
        });
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            dispatch(deleteBudget(id));
        }
    };

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
        resetForm();
    };

    return (
        <div className="space-y-6">
            {/* Active Budgets List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">Active Budgets</h3>
                    {!isEditing && (
                        <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded">
                            {budgets.length} Active
                        </span>
                    )}
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {budgets.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">No active budgets found.</p>
                    ) : (
                        budgets.map((budget) => (
                            <div key={budget._id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 flex justify-between items-center group">
                                <div>
                                    <h4 className="text-white font-medium text-sm">{budget.category}</h4>
                                    <div className="flex gap-3 text-xs text-gray-400 mt-1">
                                        <span>${budget.amount}</span>
                                        <span>{budget.month}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(budget)}
                                        className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-md transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(budget._id)}
                                        className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-md transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="border-t border-gray-800"></div>

            {/* Set/Edit Budget Form */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">
                        {isEditing ? 'Edit Budget' : 'Set New Budget'}
                    </h3>
                    {isEditing && (
                        <button
                            onClick={resetForm}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                        >
                            <X size={14} /> Cancel Edit
                        </button>
                    )}
                </div>

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
                            disabled={isEditing} // Prevent changing category logic complexity for now
                            className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
                                Limit
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    value={amount}
                                    onChange={onChange}
                                    required
                                    placeholder="0"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-6 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
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
                                disabled={isEditing}
                                className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isEditing ? <Edit2 size={18} /> : <Target size={18} />}
                        {isEditing ? 'Update Budget' : 'Set Budget'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BudgetManager;
