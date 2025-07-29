
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Trophy, Flame, Target } from "lucide-react";

interface Profile {
  points: number;
  current_streak: number;
  total_days: number;
}

interface CompassEntry {
  date: string;
  points_earned: number;
}

export const CompassStatistics = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entries, setEntries] = useState<CompassEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('points, current_streak, total_days')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch compass entries for chart data
      const { data: entriesData, error: entriesError } = await supabase
        .from('compass_entries')
        .select('date, points_earned')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (entriesError) throw entriesError;

      setProfile(profileData);
      setEntries(entriesData || []);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  const currentPoints = profile?.points || 0;
  const currentStreak = profile?.current_streak || 0;
  const totalDays = profile?.total_days || 0;

  // Calculate progress to next level (every 100 points = new level)
  const currentLevel = Math.floor(currentPoints / 100);
  const pointsToNextLevel = 100 - (currentPoints % 100);
  const progressPercentage = ((currentPoints % 100) / 100) * 100;

  // Recent activity (last 7 days)
  const last7Days = entries.slice(0, 7);
  const recentPoints = last7Days.reduce((sum, entry) => sum + entry.points_earned, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загальні бали</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPoints}</div>
            <p className="text-xs text-muted-foreground">
              Рівень {currentLevel + 1}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Поточна серія</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              днів поспіль
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всього днів</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDays}</div>
            <p className="text-xs text-muted-foreground">
              активних днів
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">За тиждень</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentPoints}</div>
            <p className="text-xs text-muted-foreground">
              балів за 7 днів
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Прогрес до наступного рівня</CardTitle>
          <CardDescription>
            {pointsToNextLevel} балів до рівня {currentLevel + 2}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Рівень {currentLevel + 1}</span>
            <span>{currentPoints % 100}/100 балів</span>
          </div>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Остання активність</CardTitle>
            <CardDescription>Ваші останні записи у компасі</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {last7Days.map((entry, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="text-sm">
                    {new Date(entry.date).toLocaleDateString('uk-UA', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                  <span className="text-sm font-medium">+{entry.points_earned} балів</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
