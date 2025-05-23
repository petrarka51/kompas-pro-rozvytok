import { useState, useEffect } from "react";

interface SemenProps {
  className?: string;
}

const quotes = [
  "🐴 Краще бути щирим сьогодні, ніж ідеальним ніколи!",
  "🐴 Пам'ятай: навіть маленький крок — це рух уперед!",
  "🐴 Кожне твоє зусилля має значення!",
  "🐴 Твій особистий розвиток — це твій найбільший скарб!",
  "🐴 Я вірю в тебе більше, ніж ти іноді віриш у себе!",
  "🐴 Сьогоднішні дії формують твоє завтра!"
];

const Semen: React.FC<SemenProps> = ({ className = "" }) => {
  const [quote, setQuote] = useState<string>("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className={flex flex-col items-center ${className}}>
      <div className="relative">
        <svg 
          className="absolute top-0 right-0 transform translate-x-12 -translate-y-8 w-36 h-36 text-gray-100"
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50,5 Q80,20 80,50 Q80,80 50,95 Q20,80 20,50 Q20,20 50,5" fill="#f9fafb" />
        </svg>
        <div className="relative z-10 bg-white p-4 rounded-lg shadow-md max-w-xs">
          <p className="text-gray-800 text-lg">{quote}</p>
        </div>
      </div>
      <div className="mt-4">
        <img 
            src="/image_semen_main.png" 
            width="120"
            height="120"
            className="rounded-lg shadow-lg transition-all duration-300 hover:scale-120"
        />
      </div>
    </div>
  );
};

export default Semen;
