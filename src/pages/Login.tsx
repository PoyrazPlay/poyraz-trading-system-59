
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      // For demo purposes, accept any username/password
      if (username && password) {
        toast({
          title: 'Login successful',
          description: 'Welcome to Poyraz Trading System',
        });
        navigate('/home');
      } else {
        toast({
          title: 'Login failed',
          description: 'Please enter both username and password',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div 
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 
            className="mt-6 text-3xl font-bold tracking-tight"
          >
            Poyraz Trading System
          </h2>
          <p 
            className="mt-2 text-sm text-muted-foreground"
          >
            Sign in to access your trading dashboard
          </p>
        </div>
        
        <div 
          className="card-glass p-8 rounded-xl shadow-lg"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border border-input px-3 py-2 bg-background text-foreground shadow-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-input px-3 py-2 bg-background text-foreground shadow-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary py-2.5"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
