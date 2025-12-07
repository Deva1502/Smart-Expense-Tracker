import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExpenses } from '../features/expenses/expenseSlice';
import { getBudgets } from '../features/budgets/budgetSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, Calendar as CalendarIcon, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import AddExpenseForm from '../components/AddExpenseForm';
import BudgetManager from '../components/BudgetManager';
import AlertsList from '../components/AlertsList';

function Dashboard() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { expenses, isLoading: expensesLoading } = useSelector((state) => state.expenses);
    const { budgets } = useSelector((state) => state.budgets);

    const [dateRange, setDateRange] = useState('month');
    const [customDate, setCustomDate] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getExpenses());
        dispatch(getBudgets());
    }, [dispatch]);

    // Filter expenses based on range
    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const expenseDay = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());

        if (dateRange === 'all') return true;

        if (dateRange === 'custom' && customDate) {
            return expenseDay.getTime() === new Date(customDate).getTime();
        }

        const diffTime = now - expenseDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateRange === 'today') {
            return expenseDay.getTime() === today.getTime();
        }
        if (dateRange === 'week') return diffDays <= 7 && diffDays >= 0;
        if (dateRange === 'month') return diffDays <= 30 && diffDays >= 0;
        if (dateRange === 'year') {
            return diffDays <= 365 && diffDays >= 0;
        }
        return true;
    });

    // Calculate totals
    const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Prepare chart data
    const categoryData = filteredExpenses.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.category);
        if (existing) {
            existing.value += curr.amount;
        } else {
            acc.push({ name: curr.category, value: curr.amount });
        }
        return acc;
    }, []);

    // Helper: Map all active budget categories plus any categories with expenses
    // to create a unified list for the radar chart
    const budgetPerformanceData = (() => {
        const allCategories = new Set([
            ...budgets.map(b => b.category),
            ...categoryData.map(c => c.name)
        ]);

        return Array.from(allCategories).map(category => {
            const budgetItem = budgets.find(b => b.category === category);
            const expenseItem = categoryData.find(c => c.name === category);

            return {
                subject: category,
                Budget: budgetItem ? budgetItem.amount : 0,
                Spent: expenseItem ? expenseItem.value : 0,
                fullMark: Math.max(budgetItem ? budgetItem.amount : 0, expenseItem ? expenseItem.value : 0) * 1.2
            };
        }).filter(item => item.Budget > 0 || item.Spent > 0);
    })();

    // Prepare trend data
    const trendData = Object.values(filteredExpenses
        .reduce((acc, curr) => {
            const dateStr = new Date(curr.date).toISOString().split('T')[0];
            if (!acc[dateStr]) {
                acc[dateStr] = { date: dateStr, amount: 0 };
            }
            acc[dateStr].amount += curr.amount;
            return acc;
        }, {}))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <Plus size={20} />
                        Add Expense
                    </button>

                    <div className="flex flex-wrap items-center gap-2 bg-gray-900 p-2 rounded-xl border border-gray-800">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 outline-none focus:border-emerald-500"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="year">Last 365 Days</option>
                            <option value="custom">Custom Date</option>
                        </select>

                        {dateRange === 'custom' && (
                            <div className="relative">
                                <input
                                    type="date"
                                    value={customDate}
                                    onChange={(e) => setCustomDate(e.target.value)}
                                    className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 outline-none focus:border-emerald-500"
                                />
                                <CalendarIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:border-emerald-500/50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Total Expenses</h3>
                        <div className="bg-emerald-900/30 p-2 rounded-lg text-emerald-400">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {user?.currency === 'USD' ? '$' : user?.currency} {totalExpenses.toFixed(2)}
                    </p>
                    <span className="text-xs text-gray-500 mt-2 block">All time spending</span>
                </div>

                <div
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all cursor-pointer"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Budget Status</h3>
                        <div className="bg-blue-900/30 p-2 rounded-lg text-blue-400">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {budgets.length} Active
                    </p>
                    <span className="text-xs text-gray-500 mt-2 block">Click to set monthly goals</span>
                </div>

                <div
                    onClick={() => setIsAlertsModalOpen(true)}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:border-amber-500/50 transition-all cursor-pointer"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Alerts</h3>
                        <div className="bg-amber-900/30 p-2 rounded-lg text-amber-400">
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        0
                    </p>
                    <span className="text-xs text-gray-500 mt-2 block">Click to view alerts</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Spending Analysis (Bar)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Spending Distribution (Pie)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Budget vs Actual Spend</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={budgetPerformanceData}>
                                <PolarGrid stroke="#374151" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar
                                    name="Budget"
                                    dataKey="Budget"
                                    stroke="#3B82F6"
                                    fill="#3B82F6"
                                    fillOpacity={0.3}
                                />
                                <Radar
                                    name="Spent"
                                    dataKey="Spent"
                                    stroke="#EF4444"
                                    fill="#EF4444"
                                    fillOpacity={0.5}
                                />
                                <Legend wrapperStyle={{ color: '#fff' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Time Series Chart */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Expense Trend</h3>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="date"
                                stroke="#9CA3AF"
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                dot={{ fill: '#3B82F6', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Expense"
            >
                <AddExpenseForm onClose={() => setIsAddModalOpen(false)} />
            </Modal>

            <Modal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                title="Manage Monthly Budgets"
            >
                <BudgetManager onClose={() => setIsBudgetModalOpen(false)} />
            </Modal>

            <Modal
                isOpen={isAlertsModalOpen}
                onClose={() => setIsAlertsModalOpen(false)}
                title="Spending Alerts"
            >
                <AlertsList />
            </Modal>
        </div>
    );
}

export default Dashboard;
