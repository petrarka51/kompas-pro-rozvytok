import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format, isAfter } from "date-fns";
import { uk } from "date-fns/locale";
import { FileText, Clock, CheckCircle, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface EssayTopic {
  id: string;
  title: string;
  deadline: string;
  created_at: string;
  updated_at: string;
}

interface Essay {
  id: string;
  user_id: string;
  topic_id: string;
  content: string;
  character_count: number;
  created_at: string;
  updated_at: string;
}

export const Essays = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [topics, setTopics] = useState<EssayTopic[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<EssayTopic | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('essay_topics')
        .select('*')
        .order('deadline', { ascending: true });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching essay topics:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити теми есе",
        variant: "destructive",
      });
    }
  };

  const fetchEssays = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('essays')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setEssays(data || []);
    } catch (error) {
      console.error('Error fetching essays:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити есе",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchEssays();
  }, [user]);

  const getEssayForTopic = (topicId: string) => {
    return essays.find(essay => essay.topic_id === topicId);
  };

  const isDeadlinePassed = (deadline: string) => {
    return isAfter(new Date(), new Date(deadline));
  };

  const handleOpenDialog = (topic: EssayTopic) => {
    const existingEssay = getEssayForTopic(topic.id);
    setCurrentTopic(topic);
    setContent(existingEssay?.content || "");
    setDialogOpen(true);
  };

  const handleSaveEssay = async () => {
    if (!user || !currentTopic) return;

    const characterCount = content.length;
    
    if (characterCount < 500) {
      toast({
        title: "Помилка",
        description: "Есе має містити мінімум 500 символів",
        variant: "destructive",
      });
      return;
    }

    if (characterCount > 4000) {
      toast({
        title: "Помилка",
        description: "Есе має містити максимум 4000 символів",
        variant: "destructive",
      });
      return;
    }

    if (isDeadlinePassed(currentTopic.deadline)) {
      toast({
        title: "Помилка",
        description: "Дедлайн для цього есе вже минув",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('essays')
        .upsert({
          user_id: user.id,
          topic_id: currentTopic.id,
          content,
          character_count: characterCount,
        });

      if (error) throw error;

      toast({
        title: "Успіх",
        description: "Есе збережено",
      });
      
      setDialogOpen(false);
      setContent("");
      setCurrentTopic(null);
      fetchEssays();
    } catch (error: any) {
      console.error('Error saving essay:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося зберегти есе",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Есе</h2>
        <p className="text-muted-foreground">Напишіть есе на запропоновані теми</p>
      </div>

      <div className="grid gap-4">
        {topics.map((topic) => {
          const essay = getEssayForTopic(topic.id);
          const deadlinePassed = isDeadlinePassed(topic.deadline);
          const isCompleted = essay && essay.character_count >= 500 && essay.character_count <= 4000;
          
          return (
            <Card key={topic.id} className={`${isCompleted ? 'border-green-500' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {topic.title}
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4" />
                      Дедлайн: {format(new Date(topic.deadline), "dd MMMM yyyy", { locale: uk })}
                      {deadlinePassed && (
                        <Badge variant="destructive">Прострочено</Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="default" className="bg-green-500">Виконано</Badge>
                      )}
                    </CardDescription>
                  </div>
                  
                  <Button 
                    onClick={() => handleOpenDialog(topic)}
                    disabled={deadlinePassed && !essay}
                    variant={essay ? "outline" : "default"}
                  >
                    {essay ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Редагувати
                      </>
                    ) : (
                      "Написати есе"
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              {essay && (
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-2">
                    Кількість символів: {essay.character_count} / 4000
                    <span className={essay.character_count >= 500 ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                      (мінімум: 500)
                    </span>
                  </div>
                  <div className="bg-muted p-3 rounded max-h-32 overflow-y-auto">
                    <p className="text-sm">
                      {essay.content.substring(0, 200)}
                      {essay.content.length > 200 && "..."}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {topics.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Ще немає доступних тем для есе</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{currentTopic?.title}</DialogTitle>
            <DialogDescription>
              Дедлайн: {currentTopic && format(new Date(currentTopic.deadline), "dd MMMM yyyy", { locale: uk })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Обмеження: від 500 до 4000 символів
              </p>
              <p className={`text-sm font-medium ${
                content.length >= 500 && content.length <= 4000 
                  ? "text-green-600" 
                  : content.length > 4000 
                    ? "text-red-600" 
                    : "text-yellow-600"
              }`}>
                {content.length} / 4000
              </p>
            </div>

            <Textarea
              placeholder="Почніть писати ваше есе..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] resize-none"
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Скасувати
              </Button>
              <Button 
                onClick={handleSaveEssay} 
                disabled={loading || content.length < 500 || content.length > 4000}
              >
                Зберегти
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};