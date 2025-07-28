import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Target, Edit, Trash2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Wish {
  id: string;
  user_id: string;
  wish: string;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export const Wishes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState("");
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWishes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('user_id', user.id)
        .order('order_number', { ascending: true });

      if (error) throw error;
      setWishes(data || []);
    } catch (error) {
      console.error('Error fetching wishes:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити бажання",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWishes();
  }, [user]);

  const handleAddWish = async () => {
    if (!user || !newWish.trim()) return;
    
    if (wishes.length >= 100) {
      toast({
        title: "Ліміт досягнуто",
        description: "Ви можете мати максимум 100 бажань",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const orderNumber = wishes.length + 1;
      
      const { error } = await supabase
        .from('wishes')
        .insert({
          user_id: user.id,
          wish: newWish.trim(),
          order_number: orderNumber,
        });

      if (error) throw error;

      toast({
        title: "Успіх",
        description: "Бажання додано",
      });
      
      setNewWish("");
      fetchWishes();
    } catch (error: any) {
      console.error('Error adding wish:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося додати бажання",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditWish = async () => {
    if (!editingWish || !editText.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('wishes')
        .update({ wish: editText.trim() })
        .eq('id', editingWish.id);

      if (error) throw error;

      toast({
        title: "Успіх",
        description: "Бажання оновлено",
      });
      
      setEditingWish(null);
      setEditText("");
      fetchWishes();
    } catch (error: any) {
      console.error('Error updating wish:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося оновити бажання",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWish = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити це бажання?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('wishes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успіх",
        description: "Бажання видалено",
      });
      
      fetchWishes();
    } catch (error: any) {
      console.error('Error deleting wish:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося видалити бажання",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (wish: Wish) => {
    setEditingWish(wish);
    setEditText(wish.wish);
  };

  const cancelEdit = () => {
    setEditingWish(null);
    setEditText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Список 100 бажань</h2>
          <p className="text-muted-foreground">Створіть свій список мрій та цілей</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {wishes.length} / 100
        </Badge>
      </div>

      {wishes.length < 100 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Додати нове бажання
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Введіть ваше бажання..."
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddWish()}
                className="flex-1"
              />
              <Button 
                onClick={handleAddWish} 
                disabled={loading || !newWish.trim()}
              >
                Додати
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {wishes.length > 0 ? (
        <div className="grid gap-3">
          {wishes.map((wish) => (
            <Card key={wish.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="min-w-[3rem] justify-center">
                    {wish.order_number}
                  </Badge>
                  
                  {editingWish?.id === wish.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEditWish()}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleEditWish} disabled={!editText.trim()}>
                        Зберегти
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Скасувати
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="flex-1 text-sm">{wish.wish}</p>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(wish)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteWish(wish.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Ваш список бажань поки що порожній</p>
            <p className="text-sm text-muted-foreground mt-2">
              Додайте своє перше бажання, щоб почати створювати список мрій
            </p>
          </CardContent>
        </Card>
      )}

      {wishes.length === 100 && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="text-center py-8">
            <Star className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <p className="text-green-800 font-semibold">Вітаємо! Ви досягли 100 бажань!</p>
            <p className="text-green-700 text-sm mt-2">
              Ваш список мрій завершено. Тепер час втілювати їх у життя!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};