
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  title: string;
  to: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ 
  title, 
  to, 
  description, 
  icon,
  className
}) => {
  return (
    <motion.div
      className={cn(
        "card-glass rounded-xl p-5 card-hover",
        className
      )}
      whileHover={{ 
        y: -4,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link to={to} className="block h-full">
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
          {icon && (
            <div className="text-primary mb-2 text-3xl">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default MenuCard;
