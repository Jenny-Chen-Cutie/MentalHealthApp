export type Mood = 'calm' | 'ordinary' | 'tired' | 'low';

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  future_step: boolean;
  body_presence: boolean;
  life_moment: boolean;
  mood: Mood | null;
  mental_noise: string;
  note: string;
}

export interface QuarterlyReview {
  id: string; // "YYYY-QX"
  quarter: string;
  
  // New: Quarterly Intention
  intention: string; // "這一季，我允許自己把注意力放在..."
  intention_reflection: string; // "這一季，有沒有哪個時刻，你其實有靠近這個意圖？"

  // Existing: Deep Dive Questions
  carry_over_assets: string;
  proof_of_progress: string;
  next_small_adjustment: string;
  
  updatedAt: string;
}

export type ViewState = 'daily' | 'weekly' | 'quarterly';

export const MOOD_LABELS: Record<Mood, string> = {
  calm: '😌 平靜',
  ordinary: '😐 普通',
  tired: '😣 累',
  low: '😞 低落',
};

export const MOOD_COLORS: Record<Mood, string> = {
  calm: '#a7f3d0', // emerald-200
  ordinary: '#e5e5e5', // neutral-200
  tired: '#fde047', // yellow-300
  low: '#93c5fd', // blue-300
};