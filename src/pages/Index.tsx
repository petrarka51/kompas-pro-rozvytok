
import { Link } from "react-router-dom";
import Semen from "@/components/Semen";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Кожне завтра розпочинається вже сьогодні
                </h1>
                <p className="text-xl text-gray-600">
                  Твій особистий провідник у розвитку
                </p>
                <div className="pt-4">
                  <Link 
                    to="/compass"
                    className="compass-button-primary inline-block"
                  >
                    Заповнити Компас
                  </Link>
                </div>
                <div className="pt-8">
                  <h2 className="text-2xl font-semibold mb-4">Що таке Компас?</h2>
                  <p className="text-gray-700">
                    Компас — це інструмент для щоденної рефлексії, який допомагає відстежувати 
                    твій особистий розвиток у трьох сферах: фізичній, емоційній та інтелектуальній.
                  </p>
                </div>
                <div className="pt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-compass-blue flex items-center justify-center text-white font-bold">1</div>
                    <p>Щоденно заповнюй три сфери розвитку</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-compass-blue flex items-center justify-center text-white font-bold">2</div>
                    <p>Відслідковуй свій прогрес та отримуй бали</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-compass-blue flex items-center justify-center text-white font-bold">3</div>
                    <p>Розвивай себе та розблоковуй досягнення</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <Semen className="transform scale-125" />
            </div>
          </div>
          
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Три сфери розвитку</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-compass-green rounded-full mb-4 flex items-center justify-center text-white text-2xl">
                  💪
                </div>
                <h3 className="text-xl font-bold mb-2">Фізичний розвиток</h3>
                <p className="text-gray-700">
                  Відстежуй свою фізичну активність, регулярні тренування та загальне самопочуття.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-compass-yellow rounded-full mb-4 flex items-center justify-center text-white text-2xl">
                  🧠
                </div>
                <h3 className="text-xl font-bold mb-2">Інтелектуальний розвиток</h3>
                <p className="text-gray-700">
                  Записуй всі навчальні активності: читання, лекції, подкасти, та відстежуй свій прогрес.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-compass-purple rounded-full mb-4 flex items-center justify-center text-white text-2xl">
                  ❤️
                </div>
                <h3 className="text-xl font-bold mb-2">Емоційний розвиток</h3>
                <p className="text-gray-700">
                  Аналізуй свої емоції, вчися розпізнавати їх та розвивай емоційний інтелект.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
