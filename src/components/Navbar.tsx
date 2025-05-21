
import { Link } from "react-router-dom";

const Navbar = () => {
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
          </div>
          <div className="flex items-center">
            <button className="text-gray-900 hover:text-compass-purple px-3 py-2 text-sm font-medium">
              Увійти з Google
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
