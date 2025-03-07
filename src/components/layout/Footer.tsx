
import { motion } from 'framer-motion';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <motion.footer 
      className="py-6 px-8 bg-background border-t border-border/60 text-center text-sm text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <p>&copy; {year} Poyraz Trading System. All rights reserved.</p>
    </motion.footer>
  );
};

export default Footer;
