import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Edit, Trash2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MonthlyPhoto {
  id: string;
  user_id: string;
  month: number;
  year: number;
  photo_url: string;
  caption: string | null;
  created_at: string;
  updated_at: string;
}

const monthNames = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

export const MonthlyPhotos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<MonthlyPhoto[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<MonthlyPhoto | null>(null);

  const fetchPhotos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('monthly_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching monthly photos:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити фото",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Помилка",
          description: "Будь ласка, оберіть файл зображення",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Помилка",
          description: "Розмір файлу не повинен перевищувати 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${selectedYear}/${selectedMonth}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('monthly_photos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('monthly_photos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!editingPhoto && !selectedFile) {
      toast({
        title: "Помилка",
        description: "Будь ласка, оберіть фото",
        variant: "destructive",
      });
      return;
    }

    // Check if photo for this month/year already exists
    const existingPhoto = photos.find(p => p.month === selectedMonth && p.year === selectedYear);
    if (!editingPhoto && existingPhoto) {
      toast({
        title: "Помилка",
        description: "Фото для цього місяця вже існує",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let photoUrl = editingPhoto?.photo_url || "";

      if (selectedFile) {
        photoUrl = await uploadFile(selectedFile);
      }

      if (editingPhoto) {
        const { error } = await supabase
          .from('monthly_photos')
          .update({
            caption: caption || null,
            photo_url: photoUrl,
          })
          .eq('id', editingPhoto.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('monthly_photos')
          .insert({
            user_id: user.id,
            month: selectedMonth,
            year: selectedYear,
            photo_url: photoUrl,
            caption: caption || null,
          });

        if (error) throw error;
      }

      toast({
        title: "Успіх",
        description: editingPhoto ? "Фото оновлено" : "Фото додано",
      });
      
      handleDialogClose();
      fetchPhotos();
    } catch (error: any) {
      console.error('Error saving photo:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося зберегти фото",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (photo: MonthlyPhoto) => {
    setEditingPhoto(photo);
    setSelectedMonth(photo.month);
    setSelectedYear(photo.year);
    setCaption(photo.caption || "");
    setSelectedFile(null);
    setDialogOpen(true);
  };

  const handleDelete = async (photo: MonthlyPhoto) => {
    if (!confirm("Ви впевнені, що хочете видалити це фото?")) return;

    try {
      // Delete from storage
      const urlParts = photo.photo_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const fileExt = fileName.split('.').pop();
      const storageFileName = `${user?.id}/${photo.year}/${photo.month}.${fileExt}`;
      
      await supabase.storage
        .from('monthly_photos')
        .remove([storageFileName]);

      // Delete from database
      const { error } = await supabase
        .from('monthly_photos')
        .delete()
        .eq('id', photo.id);

      if (error) throw error;

      toast({
        title: "Успіх",
        description: "Фото видалено",
      });
      
      fetchPhotos();
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося видалити фото",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingPhoto(null);
    setSelectedFile(null);
    setCaption("");
    setSelectedMonth(new Date().getMonth() + 1);
    setSelectedYear(new Date().getFullYear());
  };

  const isMonthAvailable = (month: number, year: number) => {
    if (editingPhoto && editingPhoto.month === month && editingPhoto.year === year) {
      return true;
    }
    return !photos.some(p => p.month === month && p.year === year);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Фото місяця</h2>
          <p className="text-muted-foreground">Завантажуйте фото, які символізують ваші місяці</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Camera className="w-4 h-4 mr-2" />
              {editingPhoto ? "Редагувати фото" : "Додати фото"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPhoto ? "Редагувати фото місяця" : "Додати фото місяця"}</DialogTitle>
              <DialogDescription>
                {editingPhoto ? "Оновіть фото та підпис" : "Завантажте фото та додайте підпис"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="month">Місяць</Label>
                  <select
                    id="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={!!editingPhoto}
                  >
                    {monthNames.map((name, index) => (
                      <option 
                        key={index + 1} 
                        value={index + 1}
                        disabled={!isMonthAvailable(index + 1, selectedYear)}
                      >
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="year">Рік</Label>
                  <select
                    id="year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={!!editingPhoto}
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="photo">Фото</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {!editingPhoto && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Підтримувані формати: JPEG, PNG (макс. 5MB)
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="caption">Підпис (опціонально)</Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Короткий опис фото..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Скасувати
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {editingPhoto ? "Оновити" : "Зберегти"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {photos.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={photo.photo_url}
                  alt={photo.caption || `${monthNames[photo.month - 1]} ${photo.year}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {monthNames[photo.month - 1]} {photo.year}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(photo)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(photo)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              {photo.caption && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{photo.caption}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Ще немає фото місяців</p>
            <p className="text-sm text-muted-foreground mt-2">
              Додайте своє перше фото, щоб почати збирати візуальні спогади
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};