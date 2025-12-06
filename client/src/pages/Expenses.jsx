import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExpenses, createExpense, deleteExpense, reset } from '../features/expenses/expenseSlice';
import { Plus, Trash2, Calendar, Tag, CreditCard, Loader2 } from 'lucide-react';
import Modal from '../components/Modal'; // Will create this

function Expenses() {
    const dispatch = useDispatch();
    const { expenses, isLoading, isError, message } = useSelector(
        (state) => state.expenses
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        paymentMethod: 'Credit Card',
        date: new Date().toISOString().split('T')[0]
    });

    const { description, amount, category, paymentMethod, date } = formData;

    useEffect(() => {
        if (isError) {
            console.error(message);
        }
        dispatch(getExpenses());
        return () => {
            dispatch(reset());
        };
    }, [isError, message, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createExpense({
            ...formData,
            amount: Number(amount)
        }));
        setFormData({
            description: '',
            amount: '',
            category: '',
            paymentMethod: 'Credit Card',
            date: new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(false);
    };

    const onDelete = (id) => {
        if (window.confirm('Delete expense?')) {
            dispatch(deleteExpense(id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Expenses</h1>
                    <p className="text-gray-400 mt-1">Manage your daily spending</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                >
                    <Plus size={20} /> Add Expense
                </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-800 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {expenses.length > 0 ? (
                                expenses.map((expense) => (
                                    <tr key={expense._id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{expense.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700">
                                                <Tag size={12} /> {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(expense.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={14} />
                                                {expense.paymentMethod}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-white">
                                            ${expense.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => onDelete(expense._id)}
                                                className="text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No expenses found. Start adding some!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Simple Modal Implementation */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-white mb-6">Add New Expense</h2>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <input type="text" name="description" value={description} onChange={onChange} className="w-full bg-gray-800 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Amount</label>
                                    <input type="number" name="amount" value={amount} onChange={onChange} className="w-full bg-gray-800 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Date</label>
                                    <input type="date" name="date" value={date} onChange={onChange} className="w-full bg-gray-800 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Category</label>
                                <select name="category" value={category} onChange={onChange} className="w-full bg-gray-800 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" required>
                                    <option value="">Select Category</option>
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Health">Health</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
                                <select name="paymentMethod" value={paymentMethod} onChange={onChange} className="w-full bg-gray-800 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg mt-2">
                                {isLoading ? 'Saving...' : 'Save Expense'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Expenses;
