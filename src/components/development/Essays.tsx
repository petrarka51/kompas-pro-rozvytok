import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Essays = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Есе для написання</CardTitle>
          <CardDescription>
            Тут ви можете переглянути та написати есе на задані теми
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Функціонал есе буде додано незабаром
          </div>
        </CardContent>
      </Card>
    </div>
  );
};