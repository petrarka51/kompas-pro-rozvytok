import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AvatarUpload from "@/components/AvatarUpload";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userStats, setUserStats] = useState({
    points: 0,
    streak: 0,
    totalDays: 0,
    physical: 0,
    emotional: 0,
    intellectual: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Отримуємо профіль користувача
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      // Отримуємо статистику з записів компасу
      const { data: entriesData } = await supabase
        .from('compass_entries')
        .select('*')
        .eq('user_id', user?.id);

      if (profileData) {
        setProfile(profileData);
        
        // Розраховуємо статистику на основі реальних даних
        const totalEntries = entriesData?.length || 0;
        const physicalEntries = entriesData?.filter(entry => entry.physical_activity)?.length || 0;
        const emotionalEntries = entriesData?.filter(entry => entry.emotion)?.length || 0;
        const intellectualEntries = entriesData?.filter(entry => entry.intellectual_activity)?.length || 0;

        setUserStats({
          points: profileData.points || 0,
          streak: profileData.current_streak || 0,
          totalDays: profileData.total_days || 0,
          physical: totalEntries > 0 ? Math.round((physicalEntries / totalEntries) * 100) : 0,
          emotional: totalEntries > 0 ? Math.round((emotionalEntries / totalEntries) * 100) : 0,
          intellectual: totalEntries > 0 ? Math.round((intellectualEntries / totalEntries) * 100) : 0
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setProfile((prev: any) => ({ ...prev, avatar_url: newAvatarUrl }));
  };

  const achievements = [
    { id: 1, name: "Початківець", description: "Заповни Компас 7 днів поспіль", unlocked: userStats.streak >= 7, icon: "🌱" },
    { id: 2, name: "Спортсмен", description: "Запиши 10 фізичних активностей", unlocked: false, icon: "🏃‍♂️" },
    { id: 3, name: "Книголюб", description: "Прочитай 5 книг", unlocked: false, icon: "📚" },
    { id: 4, name: "Емоційний інтелект", description: "Відзнач 20 різних емоцій", unlocked: false, icon: "🧠" },
    { id: 5, name: "Філософ", description: "Запиши 30 думок дня", unlocked: false, icon: "🤔" },
    { id: 6, name: "Взірець досконалості", description: "Заповнюй Компас 30 днів поспіль", unlocked: userStats.streak >= 30, icon: "⚔️" }
  ];

  // Генеруємо останні 10 днів для історії
  const today = new Date();
  const last10days = Array.from({ length: 10 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const filled = i <= userStats.streak;
    return {
      date: date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }),
      filled
    };
  }).reverse();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Необхідна авторизація</h2>
          <p className="text-gray-600">Будь ласка, увійдіть в систему для перегляду профілю.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <AvatarUpload 
              avatarUrl={profile?.avatar_url} 
              onAvatarUpdate={handleAvatarUpdate}
            />
          </div>
          
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-2">{profile?.full_name || 'Користувач Компасу'}</h2>
            <p className="text-gray-600 mb-4">{profile?.email || user.email}</p>
            
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
