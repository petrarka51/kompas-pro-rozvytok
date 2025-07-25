
import { Link } from "react-router-dom";
import Semen from "@/components/Semen";

const Index = () => {
  const values = [
    {
      title: "Будь вільним!",
      description: "В свободі духу творити себе та кращий світ навколо себе."
    },
    {
      title: "Будь справжнім!",
      description: "Єдиним у думці, у слові й у ділі, щирим у намірах і щедрим у діях."
    },
    {
      title: "Будь другом!",
      description: "Із Всесвітом, із людством і з Україною, з кожним хто поруч, хто тут і сьогодні, щоб нами почате не мало кінця."
    },
    {
      title: "Будь мудрим!",
      description: "Дивитися глибше і бачити краще, любити життя й обирати добро."
    },
    {
      title: "Будь творчим!",
      description: "Відважно йти вперед з відкритим навстіж серцем, поглядом мрії сягаючи за обрії можливості."
    },
    {
      title: "Будь!",
      description: "Не вагатися! Не боятися! Не вдавати! Справді бути і бути разом!"
    },
    {
      title: "Бо ми — Україна!",
      description: "Народ борців, земля добра, край гідності і свободи, наша праця, наша мрія, наша доля!"
    },
  ];

  // Helper function to get a color class based on index
  const getColorClass = (index: number): string => {
    const colors = [
      "bg-compass-blue",
      "bg-compass-purple", 
      "bg-compass-green",
      "bg-compass-yellow", 
      "bg-compass-red",
      "bg-compass-brown",
      "bg-compass-orange"
    ];
    
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
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
                    Це твій особистий щоденник, який допомагає тобі краще зрозуміти себе, 
                    свої цінності та напрямок руху.
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
          
          {/* Three Areas Section */}
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

        {/* Instructions Section */}
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-8 text-center">Інструкції</h2>
              
              <div className="space-y-12">
                <section>
                  <h3 className="text-2xl font-bold mb-4">Як користуватися?</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="min-w-10 h-10 rounded-full bg-compass-blue flex items-center justify-center text-white font-bold">1</div>
                      <p>
                        <span className="font-bold">Щоденне заповнення:</span> Намагайся заповнювати Компас кожного дня, найкраще ввечері, 
                        підсумовуючи події та враження.
                      </p>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="min-w-10 h-10 rounded-full bg-compass-blue flex items-center justify-center text-white font-bold">2</div>
                      <p>
                        <span className="font-bold">Три сфери розвитку:</span> Обов'язково заповнюй всі три сфери — фізичну, емоційну 
                        та інтелектуальну. Це допоможе тобі підтримувати баланс.
                      </p>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="min-w-10 h-10 rounded-full bg-compass-blue flex items-center justify-center text-white font-bold">3</div>
                      <p>
                        <span className="font-bold">Рефлексія:</span> Не поспішай, дай собі час подумати над кожним питанням. 
                        Щира відповідь собі — найцінніше в цьому процесі.
                      </p>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="min-w-10 h-10 rounded-full bg-compass-blue flex items-center justify-center text-white font-bold">4</div>
                      <p>
                        <span className="font-bold">Відстеження прогресу:</span> Регулярно переглядай свою статистику, щоб бачити 
                        динаміку та знаходити інсайти щодо власного розвитку.
                      </p>
                    </div>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-2xl font-bold mb-4">Бали та досягнення</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>За кожне заповнення Компаса ти отримуєш <strong>10 балів</strong></li>
                    <li>За заповнення протягом 3 днів поспіль — додаткові <strong>5 балів</strong></li>
                    <li>За заповнення протягом 7 днів поспіль — додаткові <strong>15 балів</strong></li>
                    <li>За заповнення протягом 21 дня поспіль — додаткові <strong>50 балів</strong></li>
                    <li>За повне заповнення (всі поля форми) — додаткові <strong>2 бали</strong> щодня</li>
                  </ul>
                  <p className="mt-4">
                    Бали допомагають відстежувати твій прогрес і розблоковувати різноманітні досягнення. 
                    Вони є показником твоєї послідовності та відданості особистому розвитку.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-2xl font-bold mb-4">Поради для ефективної рефлексії</h3>
                  <div className="bg-compass-purple-light p-6 rounded-lg space-y-3">
                    <p><span className="font-bold">🔹 Будь чесним з собою</span> — тільки так ти зможеш отримати реальну користь.</p>
                    <p><span className="font-bold">🔹 Заповнюй у спокійному середовищі</span> — знайди місце, де тебе ніхто не відволікатиме.</p>
                    <p><span className="font-bold">🔹 Будь регулярним</span> — створи звичку щоденної рефлексії.</p>
                    <p><span className="font-bold">🔹 Переглядай свої минулі записи</span> — це допоможе тобі побачити свій прогрес і зрозуміти патерни.</p>
                    <p><span className="font-bold">🔹 Експериментуй</span> — пробуй нові активності в різних сферах розвитку.</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Цінності</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className={`h-3 ${getColorClass(index)}`}></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-700">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
