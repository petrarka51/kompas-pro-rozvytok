
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CompassOverview } from "./compass/CompassOverview";
import { CompassProgress } from "./compass/CompassProgress";
import { RecentEntries } from "./compass/RecentEntries";

interface CompassEntry {
  id: string;
  date: string;
  points_earned: number;
  emotion: string;
  emotion_emoji: string;
  physical_activity: string;
  intellectual_activity: string;
}

interface Profile {
  points: number;
  current_streak: number;
  total_days: number;
}

export const CompassStatistics = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<CompassEntry[]>([]);
  const [profile, setProfile] = useState<Profile>({ points: 0, current_streak: 0, total_days: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: entriesData, error: entriesError } = await supabase
        .from('compass_entries')
        .select('*')
        .eq('user_id', user!.id)
        .order('date', { ascending: false })
        .limit(30);

      if (entriesError) throw entriesError;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('points, current_streak, total_days')
        .eq('id', user!.id)
        .single();

      if (profileError) throw profileError;

      setEntries(entriesData || []);
      setProfile(profileData || { points: 0, current_streak: 0, total_days: 0 });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeeklyActivity = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekAgo && entryDate <= today;
    }).length;
  };

  const getMostFrequentEmotion = () => {
    const emotions = entries.map(entry => entry.emotion).filter(Boolean);
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
    )?.[0] || "Невідомо";
  };

  const getAveragePoints = () => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.points_earned, 0);
    return Math.round(total / entries.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CompassOverview 
        profile={profile}
        weeklyActivity={getWeeklyActivity()}
        mostFrequentEmotion={getMostFrequentEmotion()}
        averagePoints={getAveragePoints()}
      />
      
      <CompassProgress 
        profile={profile}
        mostFrequentEmotion={getMostFrequentEmotion()}
      />
      
      <RecentEntries entries={entries} />
    </div>
  );
};
