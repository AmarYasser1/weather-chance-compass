import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Satellite, Database } from 'lucide-react';
import { isAuthenticated, logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    setAuthStatus(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    setAuthStatus(false);
    navigate('/login');
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Satellite className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">NASA MERRA-2 Weather Analysis</h1>
              <p className="text-sm text-muted-foreground">Historical weather probability prediction</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              Historical Data: 1980-2025
            </Badge>
            <ThemeToggle />
            <div className="flex items-center gap-3">
              {authStatus ? (
                <Button onClick={handleLogout} variant="ghost">
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Login
                  </Link>
                  <Link to="/register" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;