
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Star, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Wish {
  id: string;
  user_id: string;
  order_number: number;
  wish: string;
  created_at: string;
  updated_at: string;
}

export const Wishes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [wishText, setWishText] = useState("");
  const [orderNumber, setOrderNumber] = useState<number>(1);
  const [editingWish, setEditingWish] = useState<Wish | null>(null);

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
    if (user) {
      fetchWishes();
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !wishText.trim()) {
      toast({
        title: "Помилка",
        description: "Будь ласка, введіть ваше бажання",
        variant: "destructive",
      });
      return;
    }

    // Check if order number is already taken (for new wishes)
    if (!editingWish && wishes.some(w => w.order_number === orderNumber)) {
      toast({
        title: "Помилка",
        description: "Це місце вже зайняте іншим бажанням",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingWish) {
        const { error } = await supabase
          .from('wishes')
          .update({
            wish: wishText.trim(),
            order_number: orderNumber,
          })
          .eq('id', editingWish.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('wishes')
          .insert({
            user_id: user.id,
            order_number: orderNumber,
            wish: wishText.trim(),
          });

        if (error) throw error;
      }

      toast({
        title: "Успіх",
        description: editingWish ? "Бажання оновлено" : "Бажання додано",
      });
      
      handleDialogClose();
      fetchWishes();
    } catch (error: any) {
      console.error('Error saving wish:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося зберегти бажання",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (wish: Wish) => {
    setEditingWish(wish);
    setWishText(wish.wish);
    setOrderNumber(wish.order_number);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити це бажання?")) return;

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
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingWish(null);
    setWishText("");
    // Find next available number
    const nextNumber = findNextAvailableNumber();
    setOrderNumber(nextNumber);
  };

  const findNextAvailableNumber = () => {
    for (let i = 1; i <= 100; i++) {
      if (!wishes.some(w => w.order_number === i)) {
        return i;
      }
    }
    return 1;
  };

  // Set initial order number when component loads
  useEffect(() => {
    if (!editingWish && wishes.length > 0) {
      setOrderNumber(findNextAvailableNumber());
    }
  }, [wishes, editingWish]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">100 бажань</h2>
          <p className="text-muted-foreground">Складіть список ваших 100 бажань</p>
        </div>
        
        {wishes.length < 100 && (
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Додати бажання
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingWish ? "Редагувати бажання" : "Нове бажання"}</DialogTitle>
                <DialogDescription>
                  {editingWish ? "Оновіть ваше бажання" : "Додайте нове бажання до списку"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label htmlFor="order" className="text-sm font-medium">Номер</label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    max="100"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label htmlFor="wish" className="text-sm font-medium">Бажання</label>
                  <Input
                    id="wish"
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="Введіть ваше бажання..."
                    className="mt-2"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Скасувати
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {editingWish ? "Оновити" : "Зберегти"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="text-center mb-6">
        <p className="text-2xl font-bold">{wishes.length}/100</p>
        <p className="text-muted-foreground">бажань додано</p>
      </div>

      {wishes.length > 0 ? (
        <div className="grid gap-3">
          {wishes.map((wish) => (
            <Card key={wish.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                    {wish.order_number}
                  </div>
                  <span className="text-sm">{wish.wish}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(wish)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(wish.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Ще немає бажань у списку</p>
            <p className="text-sm text-muted-foreground mt-2">
              Додайте своє перше бажання, щоб почати складати список
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
