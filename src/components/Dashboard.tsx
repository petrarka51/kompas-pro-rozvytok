
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Award, Target, Clock, Activity, Heart, Brain, Dumbbell, BookOpen, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  totalPoints: number;
  currentStreak: number;
  totalDays: number;
  compassEntries: number;
  essays: number;
  firstTimes: number;
  wishes: number;
  photos: number;
  fitnessTests: number;
  englishTests: number;
  actions: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPoints: 0,
    currentStreak: 0,
    totalDays: 0,
    compassEntries: 0,
    essays: 0,
    firstTimes: 0,
    wishes: 0,
    photos: 0,
    fitnessTests: 0,
    englishTests: 0,
    actions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('points, current_streak, total_days')
        .eq('id', user!.id)
        .single();

      // Fetch counts from all tables
      const [compassRes, essaysRes, firstTimesRes, wishesRes, photosRes, fitnessRes, englishRes, actionsRes] = await Promise.all([
        supabase.from('compass_entries').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('essays').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('first_times').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('wishes').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('monthly_photos').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('fitness_tests').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('english_tests').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('actions').select('id', { count: 'exact' }).eq('user_id', user!.id)
      ]);

      setStats({
        totalPoints: profile?.points || 0,
        currentStreak: profile?.current_streak || 0,
        totalDays: profile?.total_days || 0,
        compassEntries: compassRes.count || 0,
        essays: essaysRes.count || 0,
        firstTimes: firstTimesRes.count || 0,
        wishes: wishesRes.count || 0,
        photos: photosRes.count || 0,
        fitnessTests: fitnessRes.count || 0,
        englishTests: englishRes.count || 0,
        actions: actionsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Дашборд розвитку</h1>
        <p className="text-gray-600">Ваш прогрес у всіх сферах розвитку</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загальні бали</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">Зароблено балів</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Поточна серія</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">днів поспіль</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загальні дні</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalDays}</div>
            <p className="text-xs text-muted-foreground">днів активності</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Записи Компасу</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.compassEntries}</div>
            <p className="text-xs text-muted-foreground">щоденних записів</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Прогрес до цілей</CardTitle>
          <CardDescription>Ваші досягнення у розвитку</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Серія днів</span>
                <span>{stats.currentStreak}/30 днів</span>
              </div>
              <Progress value={(stats.currentStreak / 30) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Записи Компасу</span>
                <span>{stats.compassEntries}/100 записів</span>
              </div>
              <Progress value={(stats.compassEntries / 100) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Есе</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.essays}</div>
            <p className="text-xs text-muted-foreground">написано</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Перший раз</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.firstTimes}</div>
            <p className="text-xs text-muted-foreground">нових досвідів</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Бажання</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.wishes}</div>
            <p className="text-xs text-muted-foreground">записано</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Фото</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.photos}</div>
            <p className="text-xs text-muted-foreground">завантажено</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Фітнес тести</CardTitle>
            <Dumbbell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fitnessTests}</div>
            <p className="text-xs text-muted-foreground">пройдено</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Тести англійської</CardTitle>
            <Brain className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.englishTests}</div>
            <p className="text-xs text-muted-foreground">пройдено</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
