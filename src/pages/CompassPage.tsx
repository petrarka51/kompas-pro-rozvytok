
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompassForm } from "@/components/CompassForm";
import { CompassStatistics } from "@/components/CompassStatistics";
import { Essays } from "@/components/development/Essays";
import { FirstTimes } from "@/components/development/FirstTimes";
import { Wishes } from "@/components/development/Wishes";
import { MonthlyPhotos } from "@/components/development/MonthlyPhotos";
import { Navigate } from "react-router-dom";

const CompassPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Компас розвитку</h1>
        
        <Tabs defaultValue="compass" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="compass">Компас</TabsTrigger>
            <TabsTrigger value="statistics">Статистика</TabsTrigger>
            <TabsTrigger value="essays">Есе</TabsTrigger>
            <TabsTrigger value="first-times">Вперше</TabsTrigger>
            <TabsTrigger value="wishes">Бажання</TabsTrigger>
            <TabsTrigger value="photos">Фото</TabsTrigger>
          </TabsList>

          <TabsContent value="compass" className="mt-6">
            <CompassForm />
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <CompassStatistics />
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

export default CompassPage;
