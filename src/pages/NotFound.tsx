
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4">
      <div 
        className="text-center card-glass rounded-xl p-12 max-w-md"
      >
        <div 
          className="flex justify-center mb-6"
        >
          <AlertCircle className="text-destructive h-16 w-16" />
        </div>
        
        <h1 
          className="text-4xl font-bold mb-4"
        >
          404
        </h1>
        
        <p 
          className="text-xl text-muted-foreground mb-8"
        >
          Oops! Page not found
        </p>
        
        <div>
          <Link 
            to="/home" 
            className="btn-primary inline-flex"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
