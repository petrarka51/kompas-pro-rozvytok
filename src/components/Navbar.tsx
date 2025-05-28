
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-lg sm:text-xl font-bold text-gray-800">
              Українська академія лідерства
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center space-x-8">
            <Link to="/" className="text-gray-900 hover:text-compass-purple px-3 py-2 text-sm font-medium">
              Головна
            </Link>
            {user && (
              <>
                <Link to="/profile" className="text-gray-900 hover:text-compass-purple px-3 py-2 text-sm font-medium">
                  Мій профіль
                </Link>
                <Link to="/compass" className="text-gray-900 hover:text-compass-purple px-3 py-2 text-sm font-medium">
                  Компас
                </Link>
                <Link to="/statistics" className="text-gray-900 hover:text-compass-purple px-3 py-2 text-sm font-medium">
                  Моя статистика
                </Link>
                <Link to="/values" className="text-gray-900 hover:text-compass-purple px-3 py-2 text-sm font-medium">
                  Цінності
                </Link>
                <Link to="/instructions" className="text-gray-900 hover:text-compass-purple px-3 py-2 text-sm font-medium">
                  Інструкція
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex md:items-center space-x-4">
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <Button onClick={signOut} variant="ghost" size="sm">
                <LogOut size={16} />
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="text-gray-900 hover:text-compass-purple">
                  Увійти
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/" 
                className="block text-gray-900 hover:text-compass-purple px-3 py-2 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Головна
              </Link>
              {user && (
                <>
                  <Link 
                    to="/profile" 
                    className="block text-gray-900 hover:text-compass-purple px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Мій профіль
                  </Link>
                  <Link 
                    to="/compass" 
                    className="block text-gray-900 hover:text-compass-purple px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Компас
                  </Link>
                  <Link 
                    to="/statistics" 
                    className="block text-gray-900 hover:text-compass-purple px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Моя статистика
                  </Link>
                  <Link 
                    to="/values" 
                    className="block text-gray-900 hover:text-compass-purple px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Цінності
                  </Link>
                  <Link 
                    to="/instructions" 
                    className="block text-gray-900 hover:text-compass-purple px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Інструкція
                  </Link>
                </>
              )}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4">
                {loading ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mx-3"></div>
                ) : user ? (
                  <Button 
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }} 
                    variant="ghost" 
                    className="w-full justify-start text-left"
                  >
                    <LogOut size={16} className="mr-2" />
                    Вийти
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-900 hover:text-compass-purple">
                      Увійти
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
