import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    animated?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, animated = false, children, ...props }, ref) => {
        const content = (
            <div
                ref={ref}
                className={cn(
                    'glass-card p-6 transition-all duration-300',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );

        if (animated) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {content}
                </motion.div>
            );
        }

        return content;
    }
);

Card.displayName = "Card";
