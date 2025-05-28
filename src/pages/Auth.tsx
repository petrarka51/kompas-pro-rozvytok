
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Semen from "@/components/Semen";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Перевіряємо чи користувач вже залогінений
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Ви успішно увійшли!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast.success("Перевірте пошту для підтвердження реєстрації! Лист надіслано українською мовою.");
      }
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Невірний email або пароль");
      } else if (error.message.includes("User already registered")) {
        toast.error("Користувач з таким email вже існує");
      } else {
        toast.error(error.message || "Виникла помилка");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Помилка входу через Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {isLogin ? "Вхід" : "Реєстрація"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {isLogin ? "Увійдіть у свій аккаунт" : "Створіть новий аккаунт"}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          {!isLogin && (
            <div>
              <Label htmlFor="fullName" className="text-sm sm:text-base">Повне ім'я</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                placeholder="Введіть ваше повне ім'я"
                className="mt-1"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-sm sm:text-base">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Мінімум 6 символів"
              minLength={6}
              className="mt-1"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Завантаження..." : (isLogin ? "Увійти" : "Зареєструватися")}
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">або</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleAuth}
          variant="outline"
          className="w-full mb-4 text-sm sm:text-base"
          disabled={loading}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isLogin ? "Увійти з Google" : "Зареєструватися з Google"}
        </Button>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-compass-purple hover:underline text-sm sm:text-base"
          >
            {isLogin 
              ? "Немає аккаунту? Зареєструйтесь" 
              : "Вже маєте аккаунт? Увійдіть"
            }
          </button>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <Link to="/" className="text-gray-500 hover:text-compass-purple text-sm sm:text-base">
            ← Повернутися на головну
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <Semen />
      </div>
    </div>
  );
};

export default Auth;
