import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const fitnessTestSchema = z.object({
  test_number: z.number().min(1).max(4),
  date: z.date(),
  run_2400m_seconds: z.number().min(1),
  pushups: z.number().min(0),
  abs: z.number().min(0),
  long_jump_cm: z.number().min(1),
  run_40m_seconds: z.number().min(0.1),
});

type FitnessTest = z.infer<typeof fitnessTestSchema>;

interface FitnessTestWithId {
  id: string;
  user_id: string;
  test_number: number;
  date: string;
  run_2400m_seconds: number;
  pushups: number;
  abs: number;
  long_jump_cm: number;
  run_40m_seconds: number;
  created_at: string;
  updated_at: string;
}

export const FitnessTests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tests, setTests] = useState<FitnessTestWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<FitnessTest>({
    resolver: zodResolver(fitnessTestSchema),
    defaultValues: {
      test_number: 1,
      date: new Date(),
      run_2400m_seconds: 0,
      pushups: 0,
      abs: 0,
      long_jump_cm: 0,
      run_40m_seconds: 0,
    },
  });

  const fetchTests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fitness_tests')
        .select('*')
        .eq('user_id', user.id)
        .order('test_number', { ascending: true });

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching fitness tests:', error);
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

  const onSubmit = async (data: FitnessTest) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('fitness_tests')
        .upsert({
          user_id: user.id,
          test_number: data.test_number,
          date: format(data.date, 'yyyy-MM-dd'),
          run_2400m_seconds: data.run_2400m_seconds,
          pushups: data.pushups,
          abs: data.abs,
          long_jump_cm: data.long_jump_cm,
          run_40m_seconds: data.run_40m_seconds,
        });

      if (error) throw error;

      toast({
        title: "Успіх",
        description: "Фітнес-тест збережено",
      });
      
      setDialogOpen(false);
      form.reset();
      fetchTests();
    } catch (error: any) {
      console.error('Error saving fitness test:', error);
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
    return [1, 2, 3, 4].filter(num => !existingNumbers.includes(num));
  };

  const calculateProgress = (metric: keyof Omit<FitnessTest, 'test_number' | 'date'>) => {
    if (tests.length < 2) return null;
    
    const first = tests[0][metric];
    const last = tests[tests.length - 1][metric];
    
    // For running times, lower is better
    if (metric === 'run_2400m_seconds' || metric === 'run_40m_seconds') {
      return ((first - last) / first * 100).toFixed(1);
    }
    
    // For other metrics, higher is better
    return ((last - first) / first * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Фітнес-тести</h2>
          <p className="text-muted-foreground">Відстежуйте свій фізичний прогрес</p>
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
                <DialogTitle>Новий фітнес-тест</DialogTitle>
                <DialogDescription>
                  Введіть результати вашого фітнес-тесту
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
                      name="run_2400m_seconds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Пробіжка 2400м (секунди)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
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
                      name="pushups"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Віджимання (кількість)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
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
                      name="abs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Прес (кількість)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
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
                      name="long_jump_cm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Стрибок у довжину (см)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="run_40m_seconds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Біг 40м (секунди)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

      {tests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Прогрес
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { key: 'run_2400m_seconds' as const, label: 'Пробіжка 2400м', unit: 'сек', better: 'lower' },
                { key: 'pushups' as const, label: 'Віджимання', unit: 'раз', better: 'higher' },
                { key: 'abs' as const, label: 'Прес', unit: 'раз', better: 'higher' },
                { key: 'long_jump_cm' as const, label: 'Стрибок', unit: 'см', better: 'higher' },
                { key: 'run_40m_seconds' as const, label: 'Біг 40м', unit: 'сек', better: 'lower' },
              ].map(({ key, label, unit, better }) => {
                const progress = calculateProgress(key);
                return (
                  <div key={key} className="text-center">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    {progress && (
                      <p className={`text-lg font-semibold ${
                        (better === 'lower' && parseFloat(progress) > 0) || 
                        (better === 'higher' && parseFloat(progress) > 0) 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {better === 'lower' && parseFloat(progress) > 0 ? '-' : '+'}
                        {Math.abs(parseFloat(progress))}%
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

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
                  <TableHead>Пробіжка 2400м</TableHead>
                  <TableHead>Віджимання</TableHead>
                  <TableHead>Прес</TableHead>
                  <TableHead>Стрибок</TableHead>
                  <TableHead>Біг 40м</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>Тест {test.test_number}</TableCell>
                    <TableCell>{format(new Date(test.date), "dd.MM.yyyy")}</TableCell>
                    <TableCell>{test.run_2400m_seconds} сек</TableCell>
                    <TableCell>{test.pushups} раз</TableCell>
                    <TableCell>{test.abs} раз</TableCell>
                    <TableCell>{test.long_jump_cm} см</TableCell>
                    <TableCell>{test.run_40m_seconds} сек</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Ще немає результатів фітнес-тестів</p>
            <p className="text-sm text-muted-foreground mt-2">
              Додайте свій перший тест, щоб почати відстежувати прогрес
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};