import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { uk } from "date-fns/locale";

interface Action {
  id: string;
  title: string;
  date: string;
  activity_type: string;
  time_spent: number;
  work_done: string;
  insights?: string;
  emotions?: string;
  created_at: string;
}

const activityTypes = [
  "Фізичний розвиток",
  "Інтелектуальний розвиток", 
  "Емоційний розвиток",
  "Соціальний розвиток"
];

const Actions = () => {
  const { user } = useAuth();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: new Date(),
    activity_type: "",
    time_spent: 1,
    work_done: "",
    insights: "",
    emotions: ""
  });

  // Load actions
  const fetchActions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setActions(data || []);
    } catch (error) {
      console.error('Error fetching actions:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити дії",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, [user]);

  // Form handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearForm = () => {
    setFormData({
      title: "",
      date: new Date(),
      activity_type: "",
      time_spent: 1,
      work_done: "",
      insights: "",
      emotions: ""
    });
    setEditingAction(null);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Помилка валідації",
        description: "Назва активності є обов'язковою",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.activity_type) {
      toast({
        title: "Помилка валідації", 
        description: "Тип активності є обов'язковим",
        variant: "destructive"
      });
      return false;
    }

    if (formData.date > new Date()) {
      toast({
        title: "Помилка валідації",
        description: "Дата не може бути в майбутньому",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.work_done.trim()) {
      toast({
        title: "Помилка валідації",
        description: "Опис виконаної роботи є обов'язковим",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!user || !validateForm()) return;

    try {
      const actionData = {
        user_id: user.id,
        title: formData.title.trim(),
        date: format(formData.date, 'yyyy-MM-dd'),
        activity_type: formData.activity_type,
        time_spent: formData.time_spent,
        work_done: formData.work_done.trim(),
        insights: formData.insights.trim() || null,
        emotions: formData.emotions.trim() || null
      };

      if (editingAction) {
        // Update existing action
        const { error } = await supabase
          .from('actions')
          .update(actionData)
          .eq('id', editingAction.id);

        if (error) throw error;
        
        toast({
          title: "Успіх",
          description: "Дію оновлено!"
        });
      } else {
        // Create new action
        const { error } = await supabase
          .from('actions')
          .insert(actionData);

        if (error) throw error;
        
        toast({
          title: "Успіх",
          description: "Дію збережено!"
        });
      }

      clearForm();
      fetchActions();
    } catch (error) {
      console.error('Error saving action:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти дію",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (action: Action) => {
    setEditingAction(action);
    setFormData({
      title: action.title,
      date: new Date(action.date),
      activity_type: action.activity_type,
      time_spent: action.time_spent,
      work_done: action.work_done,
      insights: action.insights || "",
      emotions: action.emotions || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю дію?")) return;

    try {
      const { error } = await supabase
        .from('actions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Успіх",
        description: "Дію видалено!"
      });
      
      fetchActions();
    } catch (error) {
      console.error('Error deleting action:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося видалити дію",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Увійдіть в систему, щоб переглядати свої дії
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Мої дії</h1>
        <p className="text-muted-foreground">
          Додавайте, переглядайте та редагуйте свої дії для розвитку
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            {editingAction ? "Редагувати дію" : "Додати нову дію"}
          </CardTitle>
          <CardDescription>
            Заповніть форму для {editingAction ? "оновлення" : "створення"} дії
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Назва активності *</Label>
              <Input
                id="title"
                placeholder="Наприклад, Волонтерив у притулку"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Дата *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP", { locale: uk }) : <span>Оберіть дату</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && handleInputChange('date', date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Activity Type */}
            <div className="space-y-2">
              <Label>Тип активності *</Label>
              <Select value={formData.activity_type} onValueChange={(value) => handleInputChange('activity_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть тип активності" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Spent */}
            <div className="space-y-2">
              <Label htmlFor="time_spent">Час, витрачений на дію (хвилини) *</Label>
              <Input
                id="time_spent"
                type="number"
                min="1"
                value={formData.time_spent}
                onChange={(e) => handleInputChange('time_spent', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Work Done */}
          <div className="space-y-2">
            <Label htmlFor="work_done">Виконана мною робота *</Label>
            <Textarea
              id="work_done"
              placeholder="Короткий опис: що саме було зроблено"
              value={formData.work_done}
              onChange={(e) => handleInputChange('work_done', e.target.value)}
              rows={3}
            />
          </div>

          {/* Insights */}
          <div className="space-y-2">
            <Label htmlFor="insights">Зміст (усвідомлення)</Label>
            <Textarea
              id="insights"
              placeholder="Що я усвідомив(-ла) після цієї дії?"
              value={formData.insights}
              onChange={(e) => handleInputChange('insights', e.target.value)}
              rows={3}
            />
          </div>

          {/* Emotions */}
          <div className="space-y-2">
            <Label htmlFor="emotions">Смак (емоційне враження)</Label>
            <Textarea
              id="emotions"
              placeholder="Які емоції залишились після дії?"
              value={formData.emotions}
              onChange={(e) => handleInputChange('emotions', e.target.value)}
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit}>
              {editingAction ? "Оновити дію" : "Зберегти дію"}
            </Button>
            <Button variant="outline" onClick={clearForm}>
              Очистити
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions List */}
      <Card>
        <CardHeader>
          <CardTitle>Історія дій</CardTitle>
          <CardDescription>
            Ваші збережені дії ({actions.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Завантаження...</p>
            </div>
          ) : actions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Ще немає збережених дій. Додайте першу дію вище!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {actions.map((action) => (
                <Card key={action.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(action.date), "dd MMMM yyyy", { locale: uk })} • {action.activity_type} • {action.time_spent} хв
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(action)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(action.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Робота:</span> {action.work_done}
                      </div>
                      {action.insights && (
                        <div>
                          <span className="font-medium">Усвідомлення:</span> {action.insights}
                        </div>
                      )}
                      {action.emotions && (
                        <div>
                          <span className="font-medium">Емоції:</span> {action.emotions}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Actions;