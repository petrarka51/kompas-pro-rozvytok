import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarIcon, Plus, Star, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const firstTimeSchema = z.object({
  title: z.string().min(1, "Назва обов'язкова"),
  date: z.date(),
  why_recorded: z.string().optional(),
  what_changed: z.string().optional(),
  how_use_experience: z.string().optional(),
  what_proud_improve: z.string().optional(),
  emotions: z.string().optional(),
});

type FirstTime = z.infer<typeof firstTimeSchema>;

interface FirstTimeWithId {
  id: string;
  user_id: string;
  title: string;
  date: string;
  why_recorded: string | null;
  what_changed: string | null;
  how_use_experience: string | null;
  what_proud_improve: string | null;
  emotions: string | null;
  created_at: string;
  updated_at: string;
}

export const FirstTimes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [firstTimes, setFirstTimes] = useState<FirstTimeWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FirstTimeWithId | null>(null);

  const form = useForm<FirstTime>({
    resolver: zodResolver(firstTimeSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      why_recorded: "",
      what_changed: "",
      how_use_experience: "",
      what_proud_improve: "",
      emotions: "",
    },
  });

  const fetchFirstTimes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('first_times')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setFirstTimes(data || []);
    } catch (error) {
      console.error('Error fetching first times:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити записи",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFirstTimes();
  }, [user]);

  const onSubmit = async (data: FirstTime) => {
    if (!user) return;

    setLoading(true);
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('first_times')
          .update({
            title: data.title,
            date: format(data.date, 'yyyy-MM-dd'),
            why_recorded: data.why_recorded || null,
            what_changed: data.what_changed || null,
            how_use_experience: data.how_use_experience || null,
            what_proud_improve: data.what_proud_improve || null,
            emotions: data.emotions || null,
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('first_times')
          .insert({
            user_id: user.id,
            title: data.title,
            date: format(data.date, 'yyyy-MM-dd'),
            why_recorded: data.why_recorded || null,
            what_changed: data.what_changed || null,
            how_use_experience: data.how_use_experience || null,
            what_proud_improve: data.what_proud_improve || null,
            emotions: data.emotions || null,
          });

        if (error) throw error;
      }

      toast({
        title: "Успіх",
        description: editingItem ? "Запис оновлено" : "Запис додано",
      });
      
      setDialogOpen(false);
      setEditingItem(null);
      form.reset();
      fetchFirstTimes();
    } catch (error: any) {
      console.error('Error saving first time:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося зберегти запис",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: FirstTimeWithId) => {
    setEditingItem(item);
    form.reset({
      title: item.title,
      date: new Date(item.date),
      why_recorded: item.why_recorded || "",
      what_changed: item.what_changed || "",
      how_use_experience: item.how_use_experience || "",
      what_proud_improve: item.what_proud_improve || "",
      emotions: item.emotions || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей запис?")) return;

    try {
      const { error } = await supabase
        .from('first_times')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успіх",
        description: "Запис видалено",
      });
      
      fetchFirstTimes();
    } catch (error: any) {
      console.error('Error deleting first time:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося видалити запис",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Мої "Вперше"</h2>
          <p className="text-muted-foreground">Записуйте речі, які ви робили вперше</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Додати запис
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Редагувати запис" : "Новий запис 'Вперше'"}</DialogTitle>
              <DialogDescription>
                Поділіться своїм досвідом та рефлексією
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Назва</FormLabel>
                        <FormControl>
                          <Input placeholder="Короткий заголовок" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Дата</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: uk })
                                ) : (
                                  <span>Оберіть дату</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="why_recorded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Чому я записав це "вперше"?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Розкажіть, чому це важливо для вас..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="what_changed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Що змінилося в мені?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Які зміни ви помітили в собі..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="how_use_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Як використаю цей досвід?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Як ви плануєте використати цей досвід у майбутньому..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="what_proud_improve"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Чим пишаюсь, що варто покращити?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ваші досягнення та області для розвитку..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emotions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Які емоції відчував?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Опишіть свої емоції та відчуття..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Скасувати
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {editingItem ? "Оновити" : "Зберегти"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {firstTimes.length > 0 ? (
        <div className="grid gap-4">
          {firstTimes.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      {item.title}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(item.date), "dd MMMM yyyy", { locale: uk })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.why_recorded && (
                  <div>
                    <p className="font-medium text-sm">Чому записав це "вперше":</p>
                    <p className="text-sm text-muted-foreground">{item.why_recorded}</p>
                  </div>
                )}
                {item.what_changed && (
                  <div>
                    <p className="font-medium text-sm">Що змінилося:</p>
                    <p className="text-sm text-muted-foreground">{item.what_changed}</p>
                  </div>
                )}
                {item.emotions && (
                  <div>
                    <p className="font-medium text-sm">Емоції:</p>
                    <p className="text-sm text-muted-foreground">{item.emotions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Ще немає записів про "вперше"</p>
            <p className="text-sm text-muted-foreground mt-2">
              Додайте свій перший запис, щоб почати збирати спогади
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};