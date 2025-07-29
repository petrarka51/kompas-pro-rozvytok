
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CompassProgressProps {
  profile: {
    current_streak: number;
  };
  mostFrequentEmotion: string;
}

export const CompassProgress = ({ profile, mostFrequentEmotion }: CompassProgressProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
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
              {mostFrequentEmotion}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
