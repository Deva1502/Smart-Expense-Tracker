import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExpenses } from '../features/expenses/expenseSlice';
import { getBudgets } from '../features/budgets/budgetSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import AIInsights from '../components/AIInsights';

function Dashboard() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { expenses, isLoading: expensesLoading } = useSelector((state) => state.expenses);
    const { budgets } = useSelector((state) => state.budgets);

    useEffect(() => {
        dispatch(getExpenses());
        dispatch(getBudgets());
    }, [dispatch]);

    // Calculate totals
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Prepare chart data
    const categoryData = expenses.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.category);
        if (existing) {
            existing.value += curr.amount;
        } else {
            acc.push({ name: curr.category, value: curr.amount });
        }
        return acc;
    }, []);

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:border-emerald-500/50 transition-all">
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

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Budget Status</h3>
                        <div className="bg-blue-900/30 p-2 rounded-lg text-blue-400">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {budgets.length} Active
                    </p>
                    <span className="text-xs text-gray-500 mt-2 block">Monthly goals set</span>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:border-amber-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Alerts</h3>
                        <div className="bg-amber-900/30 p-2 rounded-lg text-amber-400">
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        0
                    </p>
                    <span className="text-xs text-gray-500 mt-2 block">No unusual activity detected</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Charts */}
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Spending by Category</h3>
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

                {/* AI Section with direct integration */}
                <AIInsights />
            </div>
        </div>
    );
}

export default Dashboard;
