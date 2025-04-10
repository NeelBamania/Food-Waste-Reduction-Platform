import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className={`${isHome ? '' : 'bg-gray-900'} relative z-10 container mx-auto px-6 py-6`}>
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <Heart className="h-8 w-8 text-green-400 animate-float" />
          <span className="text-3xl font-bold text-white tracking-tight">FoodShare</span>
        </Link>
        <div className="hidden md:flex space-x-10">
          <Link to="/about" className="text-white hover:text-green-400 transition-colors duration-300">About</Link>
          <Link to="/donate" className="text-white hover:text-green-400 transition-colors duration-300">Donate</Link>
          <Link to="/volunteer" className="text-white hover:text-green-400 transition-colors duration-300">Volunteer</Link>
          <Link to="/contact" className="text-white hover:text-green-400 transition-colors duration-300">Contact</Link>
        </div>
        <Link to="/donate" className="btn-primary flex items-center space-x-2">
          <span>Donate Now</span>
          <Heart className="h-4 w-4" />
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;