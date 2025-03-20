
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

type NavItemProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

const NavItem = ({ to, children, className }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "relative px-3 py-2 text-sm font-medium transition-all",
          "hover:text-primary",
          isActive ? "text-primary" : "text-foreground/80",
          className
        )
      }
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transform origin-left animate-fade-in" />
      )}
    </NavLink>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 p-4 md:p-6",
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container max-w-6xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="font-semibold text-lg flex items-center">
          <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">PTF</span>
          <span>PumpFun Token Launcher</span>
        </NavLink>
        
        <nav className="hidden md:flex space-x-1">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/launch">Launch Token</NavItem>
          <NavItem to="/marketplace">Marketplace</NavItem>
        </nav>
        
        {/* <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-primary bg-accent rounded-full hover:bg-accent/70 transition-colors">
            Connect Wallet
          </button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
