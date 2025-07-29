
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Award, Activity } from "lucide-react";

interface CompassOverviewProps {
  profile: {
    points: number;
    current_streak: number;
    total_days: number;
  };
  weeklyActivity: number;
  mostFrequentEmotion: string;
  averagePoints: number;
}

export const CompassOverview = ({ 
  profile, 
  weeklyActivity, 
  mostFrequentEmotion, 
  averagePoints 
}: CompassOverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Загальні бали</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profile.points}</div>
          <p className="text-xs text-muted-foreground">
            Середній бал: {averagePoints}
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
          <div className="text-2xl font-bold">{weeklyActivity}</div>
          <p className="text-xs text-muted-foreground">
            з 7 днів
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
