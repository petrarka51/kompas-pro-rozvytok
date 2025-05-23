
import { useState } from "react";
import Semen from "./Semen";
import { toast } from "sonner";

const physicalActivities = [
  "Пробіжка",
  "Зарядка",
  "Тренування",
  "Спортзал", 
  "Йога",
  "Прогулянка",
  "Танці",
  "Плавання",
  "Інше"
];

const emotions = [
  { name: "Радість", emoji: "😊" },
  { name: "Спокій", emoji: "😌" },
  { name: "Сум", emoji: "😔" },
  { name: "Злість", emoji: "😡" },
  { name: "Тривога", emoji: "😰" },
  { name: "Вдячність", emoji: "🙏" },
  { name: "Натхнення", emoji: "✨" },
  { name: "Втома", emoji: "😴" },
  { name: "Збентеження", emoji: "😕" }
];

const intellectualActivities = [
  "Читання книги",
  "Онлайн-курс",
  "Лекція",
  "Подкаст",
  "Стаття",
  "Дискусія",
  "Документальний фільм",
  "Розв'язання задач",
  "Вивчення мови",
  "Інше"
];

const values = [
  "Будь вільним!",
  "Будь справжнім!",
  "Будь другом!",
  "Будь мудрим!",
  "Будь творчим!",
  "Будь!",
  "Бо ми — Україна!"
];

const CompassForm = () => {
  const [formData, setFormData] = useState({
    physicalActivity: "",
    physicalActivityDuration: "",
    physicalActivityType: "",
    emotion: "",
    intellectualActivity: "",
    thought: "",
    event: "",
    person: "",
    gratitude: "",
    value: ""
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would save the data to a database here
    console.log("Form submitted:", formData);
    toast.success("Компас заповнено! +10 балів");
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Semen className="sticky top-20" />
        </div>
        
        <div className="md:w-2/3">
          {submitted ? (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Дякуємо за заповнення!</h2>
              <p className="mb-4">Ти заробив 10 балів!</p>
              <button 
                className="compass-button-primary"
                onClick={() => setSubmitted(false)}
              >
                Заповнити знову
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-6">Компас</h2>
              
              <div>
                <label htmlFor="physicalActivity" className="compass-label">Фізичний розвиток</label>
                <select 
                  name="physicalActivity" 
                  id="physicalActivity" 
                  value={formData.physicalActivity} 
                  onChange={handleChange}
                  className="compass-select"
                  required
                >
                  <option value="" disabled>Оберіть активність</option>
                  {physicalActivities.map((activity) => (
                    <option key={activity} value={activity}>{activity}</option>
                  ))}
                </select>
                
                {formData.physicalActivity && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="physicalActivityType" className="compass-label">Тип</label>
                      <input 
                        type="text" 
                        name="physicalActivityType"
                        id="physicalActivityType" 
                        value={formData.physicalActivityType}
                        onChange={handleChange}
                        placeholder="Наприклад: Пробіг"
                        className="compass-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="physicalActivityDuration" className="compass-label">Тривалість (хв)</label>
                      <input 
                        type="text" 
                        name="physicalActivityDuration" 
                        id="physicalActivityDuration"
                        value={formData.physicalActivityDuration}
                        onChange={handleChange}
                        placeholder="Тривалість"
                        className="compass-input"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="emotion" className="compass-label">Емоційний розвиток</label>
                <select 
                  name="emotion" 
                  id="emotion" 
                  value={formData.emotion} 
                  onChange={handleChange}
                  className="compass-select"
                  required
                >
                  <option value="" disabled>Оберіть емоцію дня</option>
                  {emotions.map((emotion) => (
                    <option key={emotion.name} value={emotion.name}>
                      {emotion.emoji} {emotion.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="intellectualActivity" className="compass-label">Інтелектуальний розвиток</label>
                <select 
                  name="intellectualActivity" 
                  id="intellectualActivity" 
                  value={formData.intellectualActivity} 
                  onChange={handleChange}
                  className="compass-select"
                  required
                >
                  <option value="" disabled>Оберіть активність</option>
                  {intellectualActivities.map((activity) => (
                    <option key={activity} value={activity}>{activity}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="thought" className="compass-label">Думка дня</label>
                <textarea 
                  name="thought" 
                  id="thought" 
                  value={formData.thought}
                  onChange={handleChange}
                  rows={3}
                  className="compass-input"
                  placeholder="Запиши свою важливу думку сьогодні..."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="event" className="compass-label">Подія дня</label>
                <textarea 
                  name="event" 
                  id="event" 
                  value={formData.event}
                  onChange={handleChange}
                  rows={3}
                  className="compass-input"
                  placeholder="Яка подія запам'яталася тобі сьогодні?"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="person" className="compass-label">Людина дня</label>
                <input 
                  type="text" 
                  name="person" 
                  id="person"
                  value={formData.person}
                  onChange={handleChange}
                  className="compass-input"
                  placeholder="Хто вплинув на твій день?"
                />
              </div>
              
              <div>
                <label htmlFor="gratitude" className="compass-label">Вдячність дня</label>
                <textarea 
                  name="gratitude" 
                  id="gratitude"
                  value={formData.gratitude}
                  onChange={handleChange} 
                  rows={3}
                  className="compass-input"
                  placeholder="За що ти вдячний/вдячна сьогодні?"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="value" className="compass-label">Цінність дня</label>
                <select 
                  name="value" 
                  id="value" 
                  value={formData.value}
                  onChange={handleChange}
                  className="compass-select"
                >
                  <option value="" disabled>Оберіть цінність</option>
                  {values.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4">
                <button type="submit" className="compass-button-primary w-full">
                  Зберегти
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompassForm;
