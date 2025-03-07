
const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer 
      className="py-6 px-8 bg-background border-t border-border/60 text-center text-sm text-muted-foreground"
    >
      <p>&copy; {year} Poyraz Trading System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
