
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Українська академія лідерства
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
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
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User size={16} />
                    <span>Мій профіль</span>
                  </Button>
                </Link>
                <Button onClick={signOut} variant="ghost" size="sm">
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="text-gray-900 hover:text-compass-purple">
                  Увійти
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
