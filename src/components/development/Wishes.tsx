import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export const Wishes = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            100 Бажань
          </CardTitle>
          <CardDescription>
            Складіть список ваших 100 бажань і працюйте над їх втіленням
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Функціонал 100 бажань буде додано незабаром
          </div>
        </CardContent>
      </Card>
    </div>
  );
};