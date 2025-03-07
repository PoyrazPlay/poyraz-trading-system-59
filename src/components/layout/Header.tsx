
import { useNavigate, useLocation } from 'react-router-dom';

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
    <header 
      className="flex justify-between items-center px-8 py-6 bg-background border-b border-border/60 sticky top-0 z-10 backdrop-blur-sm bg-background/80"
      onClick={handleHeaderClick}
    >
      <h1 
        className="text-2xl font-medium tracking-tight cursor-pointer"
      >
        Poyraz Trading System
      </h1>
      
      {isLoggedIn && (
        <button 
          className="btn-destructive flex items-center gap-1.5 py-1.5 px-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
