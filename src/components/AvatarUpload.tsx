
import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  avatarUrl: string | null;
  onAvatarUpdate: (url: string) => void;
}

const AvatarUpload = ({ avatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Необхідно вибрати файл для завантаження.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdate(data.publicUrl);
      toast({
        title: "Успіх",
        description: "Аватар успішно оновлено!",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити аватар.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="w-32 h-32">
        <AvatarImage src={avatarUrl || undefined} alt="Avatar" />
        <AvatarFallback>
          <div className="text-4xl">👤</div>
        </AvatarFallback>
      </Avatar>
      <div className="absolute bottom-0 right-0">
        <Button
          size="sm"
          className="rounded-full p-2"
          disabled={uploading}
          asChild
        >
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <Camera size={16} />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </Button>
      </div>
    </div>
  );
};

export default AvatarUpload;
