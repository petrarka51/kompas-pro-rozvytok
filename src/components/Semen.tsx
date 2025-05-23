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
        <img
          src="/image_semen_main.png"
          width="120" 
          height="120" 
          viewBox="0 0 120 120" 
          className="transform -scale-x-100"
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
          viewBox="0 0 120 120" 
          className="transform -scale-x-100"
        >
          <path d="M60 100C82.0914 100 100 82.0914 100 60C100 37.9086 82.0914 20 60 20C37.9086 20 20 37.9086 20 60C20 82.0914 37.9086 100 60 100Z" fill="#8B5E34"/>
          <path d="M40 55C46.0751 55 51 50.0751 51 44C51 37.9249 46.0751 33 40 33C33.9249 33 29 37.9249 29 44C29 50.0751 33.9249 55 40 55Z" fill="#5D3C1C"/>
          <path d="M80 55C86.0751 55 91 50.0751 91 44C91 37.9249 86.0751 33 80 33C73.9249 33 69 37.9249 69 44C69 50.0751 73.9249 55 80 55Z" fill="#5D3C1C"/>
          <path d="M55 62C58.3137 62 61 59.3137 61 56C61 52.6863 58.3137 50 55 50C51.6863 50 49 52.6863 49 56C49 59.3137 51.6863 62 55 62Z" fill="black"/>
          <path d="M65 62C68.3137 62 71 59.3137 71 56C71 52.6863 68.3137 50 65 50C61.6863 50 59 52.6863 59 56C59 59.3137 61.6863 62 65 62Z" fill="black"/>
          <path d="M60 75C65.5228 75 70 72.5376 70 69.5C70 66.4624 65.5228 64 60 64C54.4772 64 50 66.4624 50 69.5C50 72.5376 54.4772 75 60 75Z" fill="#333333"/>
          <path d="M37 40L25 30" stroke="black" strokeWidth="2"/>
          <path d="M83 40L95 30" stroke="black" strokeWidth="2"/>
          <path d="M60 85C65.5228 85 70 80.5228 70 75H50C50 80.5228 54.4772 85 60 85Z" fill="#333333"/>
        </svg>
      </div>
    </div>
  );
};

export default Semen;
