
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompassForm from "@/components/CompassForm";
import { CompassStatistics } from "@/components/CompassStatistics";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const CompassPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <Tabs defaultValue="compass" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compass">🧭 Компас</TabsTrigger>
            <TabsTrigger value="statistics">📊 Статистика</TabsTrigger>
          </TabsList>

          <TabsContent value="compass" className="mt-6">
            <CompassForm />
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <CompassStatistics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompassPage;
