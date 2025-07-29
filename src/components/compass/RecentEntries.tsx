
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompassEntry {
  id: string;
  date: string;
  points_earned: number;
  emotion: string;
  emotion_emoji: string;
  physical_activity: string;
}

interface RecentEntriesProps {
  entries: CompassEntry[];
}

export const RecentEntries = ({ entries }: RecentEntriesProps) => {
  return (
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
  );
};
