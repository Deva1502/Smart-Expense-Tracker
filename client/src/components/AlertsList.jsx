import { AlertTriangle, CheckCircle } from 'lucide-react';

const AlertsList = ({ alerts = [] }) => {
    // This is a placeholder for now. 
    // In a real app, `alerts` would be passed as props or selected from Redux.
    // For this task, we assume "No unusual activity" if empty.

    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                <div className="bg-emerald-900/20 p-3 rounded-full">
                    <CheckCircle className="text-emerald-500" size={32} />
                </div>
                <h3 className="text-lg font-medium text-white">All Good!</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                    We haven't detected any unusual spending patterns or budget overruns this month.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{alert.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlertsList;
