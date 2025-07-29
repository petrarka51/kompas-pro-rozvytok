
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, BookOpen, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Essay {
  id: string;
  user_id: string;
  topic_id: string;
  content: string;
  character_count: number;
  created_at: string;
  updated_at: string;
}

interface EssayTopic {
  id: string;
  title: string;
  deadline: string;
}

export const Essays = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [topics, setTopics] = useState<EssayTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [editingEssay, setEditingEssay] = useState<Essay | null>(null);

  const fetchEssays = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('essays')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('essay_topics')
        .select('*')
        .order('deadline', { ascending: true });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  useEffect(() => {
    fetchEssays();
    fetchTopics();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !content.trim()) {
      toast({
        title: "Помилка",
        description: "Будь ласка, введіть текст есе",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTopicId && !editingEssay) {
      toast({
        title: "Помилка",
        description: "Будь ласка, оберіть тему",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingEssay) {
        const { error } = await supabase
          .from('essays')
          .update({
            content: content.trim(),
            character_count: content.trim().length,
          })
          .eq('id', editingEssay.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('essays')
          .insert({
            user_id: user.id,
            topic_id: selectedTopicId,
            content: content.trim(),
            character_count: content.trim().length,
          });

        if (error) throw error;
      }

      toast({
        title: "Успіх",
        description: editingEssay ? "Есе оновлено" : "Есе збережено",
      });
      
      handleDialogClose();
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

  const handleEdit = (essay: Essay) => {
    setEditingEssay(essay);
    setContent(essay.content);
    setSelectedTopicId(essay.topic_id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити це есе?")) return;

    try {
      const { error } = await supabase
        .from('essays')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успіх",
        description: "Есе видалено",
      });
      
      fetchEssays();
    } catch (error: any) {
      console.error('Error deleting essay:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося видалити есе",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingEssay(null);
    setContent("");
    setSelectedTopicId("");
  };

  const getTopicTitle = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.title : "Невідома тема";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Есе</h2>
          <p className="text-muted-foreground">Пишіть есе на різні теми</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Написати есе
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEssay ? "Редагувати есе" : "Нове есе"}</DialogTitle>
              <DialogDescription>
                {editingEssay ? "Редагуйте ваше есе" : "Оберіть тему та напишіть есе"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {!editingEssay && (
                <div>
                  <label htmlFor="topic" className="text-sm font-medium">Тема</label>
                  <select
                    id="topic"
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                  >
                    <option value="">Оберіть тему</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.title} (до {new Date(topic.deadline).toLocaleDateString('uk-UA')})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="content" className="text-sm font-medium">Текст есе</label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Напишіть ваше есе тут..."
                  className="min-h-[300px] mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Символів: {content.length}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Скасувати
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {editingEssay ? "Оновити" : "Зберегти"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {essays.length > 0 ? (
        <div className="grid gap-4">
          {essays.map((essay) => (
            <Card key={essay.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      {getTopicTitle(essay.topic_id)}
                    </CardTitle>
                    <CardDescription>
                      {new Date(essay.created_at).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} • {essay.character_count} символів
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(essay)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(essay.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {essay.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Ще немає написаних есе</p>
            <p className="text-sm text-muted-foreground mt-2">
              Додайте своє перше есе, щоб почати писати
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
