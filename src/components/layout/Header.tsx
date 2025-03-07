
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = location.pathname !== '/';

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/');
  };

  const handleHeaderClick = () => {
    if (isLoggedIn) {
      navigate('/home');
    }
  };

  return (
    <motion.header 
      className="flex justify-between items-center px-8 py-6 bg-background border-b border-border/60 sticky top-0 z-10 backdrop-blur-sm bg-background/80"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleHeaderClick}
    >
      <motion.h1 
        className="text-2xl font-medium tracking-tight cursor-pointer"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        Poyraz Trading System
      </motion.h1>
      
      {isLoggedIn && (
        <motion.button 
          className="btn-destructive flex items-center gap-1.5 py-1.5 px-4"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
        >
          Logout
        </motion.button>
      )}
    </motion.header>
  );
};

export default Header;
