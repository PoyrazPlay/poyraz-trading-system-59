
import { motion } from 'framer-motion';

interface HomeLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const HomeLayout = ({ children, title, subtitle }: HomeLayoutProps) => {
  return (
    <motion.div 
      className="flex-1 flex flex-col items-center max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && (
        <motion.h1 
          className="text-3xl font-semibold tracking-tight mb-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {title}
        </motion.h1>
      )}
      
      {subtitle && (
        <motion.p 
          className="text-muted-foreground text-lg text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      {children}
    </motion.div>
  );
};

export default HomeLayout;
