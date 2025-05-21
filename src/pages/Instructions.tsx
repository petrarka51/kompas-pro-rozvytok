
const Instructions = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Про Компас – Твій особистий провідник у розвитку</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Що таке Компас?</h2>
            <p className="text-lg">
              Компас — це інструмент для щоденної рефлексії, який допомагає відстежувати твій особистий розвиток у трьох сферах: 
              фізичній, емоційній та інтелектуальній. Це твій особистий щоденник, який допомагає тобі краще зрозуміти себе, 
              свої цінності та напрямок руху.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Як користуватися?</h2>
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
            <h2 className="text-2xl font-bold mb-4">Бали та досягнення</h2>
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
            <h2 className="text-2xl font-bold mb-4">Поради для ефективної рефлексії</h2>
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
  );
};

export default Instructions;
