import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { LayoutDashboard, Receipt, LogOut, Wallet } from 'lucide-react';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 p-6 flex flex-col border-r border-gray-700">
                <div className="flex items-center gap-2 mb-10 text-emerald-400">
                    <Wallet size={32} />
                    <h1 className="text-2xl font-bold tracking-tight">SmartFinance</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/expenses" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/expenses') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
                        <Receipt size={20} />
                        <span className="font-medium">Expenses</span>
                    </Link>
                </nav>

                <div className="border-t border-gray-700 pt-4 mt-auto">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-gray-950">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
