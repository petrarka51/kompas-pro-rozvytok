
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Award, Target, Clock, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CompassEntry {
  id: string;
  date: string;
  points_earned: number;
  emotion: string;
  emotion_emoji: string;
  physical_activity: string;
  intellectual_activity: string;
}

interface Profile {
  points: number;
  current_streak: number;
  total_days: number;
}

export const CompassStatistics = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<CompassEntry[]>([]);
  const [profile, setProfile] = useState<Profile>({ points: 0, current_streak: 0, total_days: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch compass entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('compass_entries')
        .select('*')
        .eq('user_id', user!.id)
        .order('date', { ascending: false })
        .limit(30);

      if (entriesError) throw entriesError;

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('points, current_streak, total_days')
        .eq('id', user!.id)
        .single();

      if (profileError) throw profileError;

      setEntries(entriesData || []);
      setProfile(profileData || { points: 0, current_streak: 0, total_days: 0 });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeeklyActivity = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekAgo && entryDate <= today;
    }).length;
  };

  const getMostFrequentEmotion = () => {
    const emotions = entries.map(entry => entry.emotion).filter(Boolean);
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
    )?.[0] || "Невідомо";
  };

  const getAveragePoints = () => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.points_earned, 0);
    return Math.round(total / entries.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загальні бали</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.points}</div>
            <p className="text-xs text-muted-foreground">
              Середній бал: {getAveragePoints()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Поточна серія</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.current_streak}</div>
            <p className="text-xs text-muted-foreground">
              днів поспіль
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загальні дні</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.total_days}</div>
            <p className="text-xs text-muted-foreground">
              днів активності
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Тижнева активність</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getWeeklyActivity()}</div>
            <p className="text-xs text-muted-foreground">
              з 7 днів
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Прогрес до мети</CardTitle>
            <CardDescription>Ваш щоденний прогрес</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Поточна серія</span>
                <span className="text-sm font-medium">{profile.current_streak}/30 днів</span>
              </div>
              <Progress value={(profile.current_streak / 30) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Найчастіша емоція</CardTitle>
            <CardDescription>За останні записи</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-4">
              <Badge variant="outline" className="text-lg">
                {getMostFrequentEmotion()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Останні записи</CardTitle>
          <CardDescription>Ваша активність за останні дні</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{entry.emotion_emoji || "😊"}</div>
                  <div>
                    <p className="font-medium">{new Date(entry.date).toLocaleDateString('uk-UA')}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.physical_activity || "Без фізичної активності"}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {entry.points_earned} балів
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
