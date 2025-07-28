import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { CalendarIcon, Plus, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const englishTestSchema = z.object({
  test_number: z.number().min(1).max(3),
  date: z.date(),
  grammar: z.number().min(0).max(100),
  vocabulary: z.number().min(0).max(100),
  reading: z.number().min(0).max(100),
  listening: z.number().min(0).max(100),
});

type EnglishTest = z.infer<typeof englishTestSchema>;

interface EnglishTestWithId {
  id: string;
  user_id: string;
  test_number: number;
  date: string;
  grammar: number;
  vocabulary: number;
  reading: number;
  listening: number;
  created_at: string;
  updated_at: string;
}

export const EnglishTests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tests, setTests] = useState<EnglishTestWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<EnglishTest>({
    resolver: zodResolver(englishTestSchema),
    defaultValues: {
      test_number: 1,
      date: new Date(),
      grammar: 0,
      vocabulary: 0,
      reading: 0,
      listening: 0,
    },
  });

  const fetchTests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('english_tests')
        .select('*')
        .eq('user_id', user.id)
        .order('test_number', { ascending: true });

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching english tests:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити тести",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTests();
  }, [user]);

  const onSubmit = async (data: EnglishTest) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('english_tests')
        .upsert({
          user_id: user.id,
          test_number: data.test_number,
          date: format(data.date, 'yyyy-MM-dd'),
          grammar: data.grammar,
          vocabulary: data.vocabulary,
          reading: data.reading,
          listening: data.listening,
        });

      if (error) throw error;

      toast({
        title: "Успіх",
        description: "Тест з англійської збережено",
      });
      
      setDialogOpen(false);
      form.reset();
      fetchTests();
    } catch (error: any) {
      console.error('Error saving english test:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося зберегти тест",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTestNumbers = () => {
    const existingNumbers = tests.map(t => t.test_number);
    return [1, 2, 3].filter(num => !existingNumbers.includes(num));
  };

  const calculateAverage = (test: EnglishTestWithId) => {
    return Math.round((test.grammar + test.vocabulary + test.reading + test.listening) / 4);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Тести з англійської</h2>
          <p className="text-muted-foreground">Відстежуйте прогрес вивчення англійської мови</p>
        </div>
        
        {getAvailableTestNumbers().length > 0 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Додати тест
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Новий тест з англійської</DialogTitle>
                <DialogDescription>
                  Введіть результати вашого тесту з англійської мови
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="test_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Номер тесту</FormLabel>
                          <FormControl>
                            <select 
                              {...field} 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            >
                              {getAvailableTestNumbers().map(num => (
                                <option key={num} value={num}>Тест {num}</option>
                              ))}
                            </select>
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
                          <FormLabel>Дата тесту</FormLabel>
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="grammar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grammar (бали)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              max="100"
                              min="0"
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vocabulary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vocabulary (бали)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              max="100"
                              min="0"
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="reading"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reading (бали)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              max="100"
                              min="0"
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="listening"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Listening (бали)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              max="100"
                              min="0"
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Скасувати
                    </Button>
                    <Button type="submit" disabled={loading}>
                      Зберегти
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {tests.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Результати тестів</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Тест</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Grammar</TableHead>
                  <TableHead>Vocabulary</TableHead>
                  <TableHead>Reading</TableHead>
                  <TableHead>Listening</TableHead>
                  <TableHead>Середній бал</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>Тест {test.test_number}</TableCell>
                    <TableCell>{format(new Date(test.date), "dd.MM.yyyy")}</TableCell>
                    <TableCell>{test.grammar}</TableCell>
                    <TableCell>{test.vocabulary}</TableCell>
                    <TableCell>{test.reading}</TableCell>
                    <TableCell>{test.listening}</TableCell>
                    <TableCell className="font-semibold">{calculateAverage(test)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Ще немає результатів тестів з англійської</p>
            <p className="text-sm text-muted-foreground mt-2">
              Додайте свій перший тест, щоб почати відстежувати прогрес
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};