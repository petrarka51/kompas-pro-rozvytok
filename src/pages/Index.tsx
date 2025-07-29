
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, TrendingUp, Heart, Target, BookOpen, Star, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Компас розвитку
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Платформа для всебічного розвитку особистості. Відслідковуйте свій прогрес, 
            розвивайте навички та досягайте цілей кожного дня.
          </p>
          <Button 
            onClick={() => navigate("/compass")} 
            size="lg"
            className="text-lg px-8 py-3"
          >
            Почати розвиток
          </Button>
        </div>

        {/* Основні можливості */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Compass className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-xl">Щоденний компас</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Записуйте свої фізичні та інтелектуальні активності, емоції та думки кожного дня
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/compass")}
                className="w-full"
              >
                Заповнити компас
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <CardTitle className="text-xl">Статистика прогресу</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Відслідковуйте свій прогрес у всіх сферах розвитку та бачте результати
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/statistics")}
                className="w-full"
              >
                Переглянути статистику
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <CardTitle className="text-xl">Есе та рефлексії</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Пишіть есе на різні теми для розвитку аналітичного мислення
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/compass?tab=essays")}
                className="w-full"
              >
                Написати есе
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-600" />
                <CardTitle className="text-xl">Перший раз</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Записуйте нові досвіди та аналізуйте, як вони впливають на ваш розвиток
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/compass?tab=first-times")}
                className="w-full"
              >
                Додати досвід
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-600" />
                <CardTitle className="text-xl">Бажання</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Визначте свої мрії та бажання, створіть план їх досягнення
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/compass?tab=wishes")}
                className="w-full"
              >
                Записати бажання
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-indigo-600" />
                <CardTitle className="text-xl">Дії розвитку</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Плануйте та відслідковуйте конкретні дії для досягнення цілей
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/actions")}
                className="w-full"
              >
                Планувати дії
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Цінності */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Наші цінності</CardTitle>
            <CardDescription className="text-lg">
              Принципи, на яких побудована платформа розвитку
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">Саморозвиток</h3>
                <p className="text-sm text-gray-600">
                  Постійне вдосконалення та робота над собою
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Досконалість</h3>
                <p className="text-sm text-gray-600">
                  Прагнення до найкращих результатів у всьому
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">Гармонія</h3>
                <p className="text-sm text-gray-600">
                  Баланс між різними сферами життя
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-bold mb-2">Прогрес</h3>
                <p className="text-sm text-gray-600">
                  Постійний рух вперед та розвиток
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Заклик до дії */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                Почніть свій шлях розвитку сьогодні
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Приєднуйтесь до тисяч людей, які вже змінили своє життя
              </p>
              <Button 
                onClick={() => navigate("/compass")} 
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3"
              >
                Розпочати зараз
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
