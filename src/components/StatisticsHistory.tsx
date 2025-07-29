
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Dumbbell, Brain, Star } from "lucide-react";

interface CompassEntry {
  id: string;
  date: string;
  physical_activity: string;
  physical_description: string;
  emotion: string;
  emotion_emoji: string;
  intellectual_activity: string;
  intellectual_description: string;
  thought_of_day: string;
  event_of_day: string;
  person_of_day: string;
  gratitude_of_day: string;
  value_of_day: string;
  points_earned: number;
}

export const StatisticsHistory = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<CompassEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<CompassEntry | null>(null);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      console.log('Fetching entries for user:', user?.id);
      
      const { data, error } = await supabase
        .from('compass_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching entries:', error);
        throw error;
      }
      
      console.log('Fetched entries:', data);
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 sm:h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="p-4 sm:p-8 text-center">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Поки що немає записів</h2>
        <p className="text-gray-600 mb-4">Почніть заповнювати Компас, щоб побачити свою статистику тут.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-compass-blue" size={24} />
            <h3 className="font-bold text-sm sm:text-base">Всього записів</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-compass-blue">{entries.length}</p>
        </Card>
        
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="text-amber-500" size={24} />
            <h3 className="font-bold text-sm sm:text-base">Зароблено балів</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-500">
            {entries.reduce((sum, entry) => sum + (entry.points_earned || 10), 0)}
          </p>
        </Card>
        
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-red-500" size={24} />
            <h3 className="font-bold text-sm sm:text-base">Емоцій записано</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-red-500">
            {entries.filter(entry => entry.emotion).length}
          </p>
        </Card>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Історія записів</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <Card 
            key={entry.id} 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedEntry(entry)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-sm sm:text-lg">{formatDate(entry.date)}</h3>
              <span className="text-xl sm:text-2xl">{entry.emotion_emoji || '📝'}</span>
            </div>
            
            <div className="space-y-2 text-sm">
              {entry.physical_activity && (
                <div className="flex items-center gap-2">
                  <Dumbbell size={16} className="text-compass-green flex-shrink-0" />
                  <span className="truncate">{entry.physical_activity}</span>
                </div>
              )}
              
              {entry.emotion && (
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-red-500 flex-shrink-0" />
                  <span className="truncate">{entry.emotion}</span>
                </div>
              )}
              
              {entry.intellectual_activity && (
                <div className="flex items-center gap-2">
                  <Brain size={16} className="text-compass-purple flex-shrink-0" />
                  <span className="truncate">{entry.intellectual_activity}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t">
              <span className="text-xs text-gray-500">
                Балів: {entry.points_earned || 10}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Модальне вікно для детального перегляду запису */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">{formatDate(selectedEntry.date)}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedEntry(null)}>
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {selectedEntry.physical_activity && (
                  <div>
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                      <Dumbbell className="text-compass-green" size={20} />
                      Фізична активність
                    </h3>
                    <p className="font-medium">{selectedEntry.physical_activity}</p>
                    {selectedEntry.physical_description && (
                      <p className="text-gray-600 mt-1 text-sm">{selectedEntry.physical_description}</p>
                    )}
                  </div>
                )}
                
                {selectedEntry.emotion && (
                  <div>
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                      <Heart className="text-red-500" size={20} />
                      Емоція дня
                    </h3>
                    <p className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">{selectedEntry.emotion_emoji}</span>
                      <span>{selectedEntry.emotion}</span>
                    </p>
                  </div>
                )}
                
                {selectedEntry.intellectual_activity && (
                  <div>
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                      <Brain className="text-compass-purple" size={20} />
                      Інтелектуальна активність
                    </h3>
                    <p className="font-medium">{selectedEntry.intellectual_activity}</p>
                    {selectedEntry.intellectual_description && (
                      <p className="text-gray-600 mt-1 text-sm">{selectedEntry.intellectual_description}</p>
                    )}
                  </div>
                )}
                
                {selectedEntry.thought_of_day && (
                  <div>
                    <h3 className="font-bold mb-2">💭 Думка дня</h3>
                    <p className="text-gray-700 text-sm">{selectedEntry.thought_of_day}</p>
                  </div>
                )}
                
                {selectedEntry.event_of_day && (
                  <div>
                    <h3 className="font-bold mb-2">🎯 Подія дня</h3>
                    <p className="text-gray-700 text-sm">{selectedEntry.event_of_day}</p>
                  </div>
                )}
                
                {selectedEntry.person_of_day && (
                  <div>
                    <h3 className="font-bold mb-2">👤 Людина дня</h3>
                    <p className="text-gray-700 text-sm">{selectedEntry.person_of_day}</p>
                  </div>
                )}
                
                {selectedEntry.gratitude_of_day && (
                  <div>
                    <h3 className="font-bold mb-2">🙏 Вдячність дня</h3>
                    <p className="text-gray-700 text-sm">{selectedEntry.gratitude_of_day}</p>
                  </div>
                )}
                
                {selectedEntry.value_of_day && (
                  <div>
                    <h3 className="font-bold mb-2">⭐ Цінність дня</h3>
                    <p className="text-gray-700 text-sm">{selectedEntry.value_of_day}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Зароблено балів: {selectedEntry.points_earned || 10}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
