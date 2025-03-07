
import React from 'react';
import { Link } from 'react-router-dom';
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
    <div
      className={cn(
        "card-glass rounded-xl p-5 card-hover",
        className
      )}
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
    </div>
  );
};

export default MenuCard;
