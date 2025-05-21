
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Semen from "@/components/Semen";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Ой! Сторінку не знайдено</p>
        <Link to="/" className="compass-button-primary">
          Повернутися на головну
        </Link>
      </div>
      <div className="mt-8">
        <Semen />
      </div>
    </div>
  );
};

export default NotFound;
