import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    current: number;
    total: number;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = '' }) => {
    // Ensure appropriate bounds
    const safeTotal = Math.max(total, 1);
    const percentage = Math.min(100, Math.max(0, (current / safeTotal) * 100));

    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between text-xs text-slate-400 mb-1 px-1">
                <span>Progreso</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-luma-teal"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};
