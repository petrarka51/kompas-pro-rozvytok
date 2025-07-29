
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FitnessTests } from "@/components/development/FitnessTests";
import { EnglishTests } from "@/components/development/EnglishTests";
import { Essays } from "@/components/development/Essays";
import { FirstTimes } from "@/components/development/FirstTimes";
import { Wishes } from "@/components/development/Wishes";
import { MonthlyPhotos } from "@/components/development/MonthlyPhotos";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Development = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Особисті досягнення та розвиток</CardTitle>
            <CardDescription>
              Відстежуйте свій прогрес у різних сферах життя та розвитку
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="fitness" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="fitness">🏃 Фітнес</TabsTrigger>
            <TabsTrigger value="english">🇬🇧 Англійська</TabsTrigger>
            <TabsTrigger value="essays">📚 Есе</TabsTrigger>
            <TabsTrigger value="first-times">🌟 Вперше</TabsTrigger>
            <TabsTrigger value="wishes">🎯 Бажання</TabsTrigger>
            <TabsTrigger value="photos">📸 Фото</TabsTrigger>
          </TabsList>

          <TabsContent value="fitness" className="mt-6">
            <FitnessTests />
          </TabsContent>

          <TabsContent value="english" className="mt-6">
            <EnglishTests />
          </TabsContent>

          <TabsContent value="essays" className="mt-6">
            <Essays />
          </TabsContent>

          <TabsContent value="first-times" className="mt-6">
            <FirstTimes />
          </TabsContent>

          <TabsContent value="wishes" className="mt-6">
            <Wishes />
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <MonthlyPhotos />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Development;
