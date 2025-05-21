
import { useState } from "react";
import { CircleUserRound } from "lucide-react";

const Profile = () => {
  const [userStats] = useState({
    points: 450,
    streak: 9,
    totalDays: 45,
    physical: 35,
    emotional: 40,
    intellectual: 25
  });

  const achievements = [
    { id: 1, name: "Початківець", description: "Заповни Компас 7 днів поспіль", unlocked: true, icon: "🌱" },
    { id: 2, name: "Спортсмен", description: "Запиши 10 фізичних активностей", unlocked: true, icon: "🏃‍♂️" },
    { id: 3, name: "Книголюб", description: "Прочитай 5 книг", unlocked: true, icon: "📚" },
    { id: 4, name: "Емоційний інтелект", description: "Відзнач 20 різних емоцій", unlocked: false, icon: "🧠" },
    { id: 5, name: "Філософ", description: "Запиши 30 думок дня", unlocked: false, icon: "🤔" },
    { id: 6, name: "Воїн світла", description: "Заповнюй Компас 30 днів поспіль", unlocked: false, icon: "⚔️" }
  ];

  // Generate last 10 days for history
  const today = new Date();
  const last10days = Array.from({ length: 10 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const filled = i === 0 || i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i === 6 || i === 7 || i === 9;
    return {
      date: date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }),
      filled
    };
  }).reverse();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
            <CircleUserRound size={80} />
          </div>
          
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-2">Користувач Компасу</h2>
            <p className="text-gray-600 mb-4">user@example.com</p>
            
            <div className="stats flex flex-wrap gap-6 mb-8">
              <div className="stat p-4 bg-compass-purple-light rounded-lg">
                <div className="stat-title text-sm text-gray-500">Всього балів</div>
                <div className="stat-value text-3xl font-bold">{userStats.points}</div>
              </div>
              
              <div className="stat p-4 bg-compass-purple-light rounded-lg">
                <div className="stat-title text-sm text-gray-500">Поточна серія</div>
                <div className="stat-value text-3xl font-bold">{userStats.streak} днів</div>
              </div>
              
              <div className="stat p-4 bg-compass-purple-light rounded-lg">
                <div className="stat-title text-sm text-gray-500">Всього днів</div>
                <div className="stat-value text-3xl font-bold">{userStats.totalDays}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6">Розподіл активності</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="h-24 bg-compass-green bg-opacity-25 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-2xl font-bold text-compass-green">{userStats.physical}%</span>
              <span className="text-sm text-gray-600">Фізичний розвиток</span>
            </div>
            <div className="h-24 bg-compass-purple bg-opacity-25 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-2xl font-bold text-compass-purple">{userStats.emotional}%</span>
              <span className="text-sm text-gray-600">Емоційний розвиток</span>
            </div>
            <div className="h-24 bg-compass-yellow bg-opacity-25 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-2xl font-bold text-amber-500">{userStats.intellectual}%</span>
              <span className="text-sm text-gray-600">Інтелектуальний розвиток</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-6">Історія заповнення</h3>
          <div className="flex justify-between mb-8">
            {last10days.map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${day.filled ? 'bg-compass-blue text-white' : 'bg-gray-200'}`}>
                  {day.filled ? "✓" : ""}
                </div>
                <div className="text-xs text-gray-500">{day.date}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6">Досягнення</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <div key={achievement.id} className={`p-4 rounded-lg border-2 ${achievement.unlocked ? 'border-compass-blue bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{achievement.icon}</div>
                  <h4 className="font-bold">{achievement.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-2 text-xs text-compass-blue font-medium">Розблоковано</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
