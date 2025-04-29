
import BackendSelector from "@/components/BackendSelector";

interface HomeLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const HomeLayout = ({ children, title, subtitle, action }: HomeLayoutProps) => {
  return (
    <div 
      className="flex-1 flex flex-col items-center max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="w-full flex flex-col items-center mb-8">
        <div className="w-full flex justify-end mb-4">
          <BackendSelector />
        </div>
        
        {title && (
          <h1 
            className="text-3xl font-semibold tracking-tight mb-2 text-center"
          >
            {title}
          </h1>
        )}
        
        {subtitle && (
          <p 
            className="text-muted-foreground text-lg text-center mb-4"
          >
            {subtitle}
          </p>
        )}
        
        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
};

export default HomeLayout;
