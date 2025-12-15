import React, { useCallback, useEffect, useState } from 'react';
import { DailyEntry, Mood, MOOD_LABELS } from '../types';
import { getTodayStr, getDailyEntries, saveDailyEntry } from '../services/storageService';
import { Card, CheckboxRow, SectionTitle } from './ui';
import { Eye, EyeOff, Lock } from 'lucide-react';

const DEFAULT_ENTRY: DailyEntry = {
  date: getTodayStr(),
  future_step: false,
  body_presence: false,
  life_moment: false,
  mood: null,
  mental_noise: '',
  note: '',
};

export const DailyView: React.FC = () => {
  const today = getTodayStr();
  const [entry, setEntry] = useState<DailyEntry>(DEFAULT_ENTRY);
  const [isSaved, setIsSaved] = useState(true);
  const [isNoiseOpen, setIsNoiseOpen] = useState(true);

  // Load data on mount
  useEffect(() => {
    const all = getDailyEntries();
    if (all[today]) {
      setEntry(all[today]);
      // If there is content, default to closed to avoid re-reading/cycling
      if (all[today].mental_noise && all[today].mental_noise.trim().length > 0) {
        setIsNoiseOpen(false);
      }
    } else {
      setEntry({ ...DEFAULT_ENTRY, date: today });
      setIsNoiseOpen(true);
    }
  }, [today]);

  // Auto-save debouncer
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDailyEntry(entry);
      setIsSaved(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [entry]);

  const handleChange = useCallback((field: keyof DailyEntry, value: any) => {
    setIsSaved(false);
    setEntry((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="px-1">
        <h1 className="text-2xl font-bold text-stone-800">今天</h1>
        <p className="text-stone-500">{today}</p>
      </header>

      {/* 3 Checkboxes */}
      <section>
        <SectionTitle>今日三件事</SectionTitle>
        <Card className="space-y-1 !p-2">
          <CheckboxRow
            label="一件對未來有幫助的小事"
            subLabel="不用很大，做了就算"
            checked={entry.future_step}
            onChange={() => handleChange('future_step', !entry.future_step)}
          />
          <div className="h-px bg-stone-100 mx-4" />
          <CheckboxRow
            label="一件讓身體回到現在的事"
            subLabel="深呼吸、喝水、散步"
            checked={entry.body_presence}
            onChange={() => handleChange('body_presence', !entry.body_presence)}
          />
          <div className="h-px bg-stone-100 mx-4" />
          <CheckboxRow
            label="一件純生活的事"
            subLabel="無關效率，只是活著"
            checked={entry.life_moment}
            onChange={() => handleChange('life_moment', !entry.life_moment)}
          />
        </Card>
      </section>

      {/* Mood */}
      <section>
        <SectionTitle>狀態觀察（不是評分）</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(MOOD_LABELS) as Mood[]).map((m) => (
            <button
              key={m}
              onClick={() => handleChange('mood', m)}
              className={`p-4 rounded-xl border transition-all text-left ${
                entry.mood === m
                  ? 'bg-stone-800 border-stone-800 text-white shadow-md'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span className="text-lg">{MOOD_LABELS[m]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Mental Noise */}
      <section>
        <div className="flex justify-between items-end mb-3 px-1">
            <SectionTitle>🧠 內耗暫存區</SectionTitle>
            <button 
                onClick={() => setIsNoiseOpen(!isNoiseOpen)}
                className="text-stone-400 hover:text-stone-600 transition-colors p-1"
            >
                {isNoiseOpen ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
        <Card className="relative overflow-hidden transition-all duration-300">
          {isNoiseOpen ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                 <p className="text-stone-400 text-sm mb-3">
                    今天腦袋在吵什麼？倒出來，不分析、不標籤。
                </p>
                <textarea
                    className="w-full min-h-[120px] p-3 rounded-lg bg-stone-50 border border-transparent focus:bg-white focus:border-stone-300 focus:ring-0 transition-all resize-none text-stone-700 placeholder:text-stone-300"
                    placeholder="寫在這裡，把它留在這裡..."
                    value={entry.mental_noise}
                    onChange={(e) => handleChange('mental_noise', e.target.value)}
                />
                {entry.mental_noise && (
                    <div className="mt-2 flex justify-end">
                        <button 
                            onClick={() => setIsNoiseOpen(false)}
                            className="text-xs text-stone-400 hover:text-stone-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-50 transition-colors"
                        >
                            <Lock size={12} />
                            <span>寫好了，蓋上蓋子</span>
                        </button>
                    </div>
                )}
            </div>
          ) : (
            <div 
                onClick={() => setIsNoiseOpen(true)}
                className="flex flex-col items-center justify-center py-8 text-stone-400 cursor-pointer hover:text-stone-500 transition-colors gap-2"
            >
                <Lock size={24} className="opacity-20" />
                <span className="text-sm font-medium">念頭已暫存</span>
                <span className="text-xs opacity-60">（點擊重新查看）</span>
            </div>
          )}
        </Card>
      </section>

      {/* Optional Note */}
      <section>
        <SectionTitle>備註（可選）</SectionTitle>
        <input
          type="text"
          className="w-full bg-transparent border-b border-stone-300 py-2 text-stone-700 focus:outline-none focus:border-stone-500 placeholder:text-stone-300 transition-colors"
          placeholder="最多一行，沒事也可以不寫"
          value={entry.note}
          onChange={(e) => handleChange('note', e.target.value)}
        />
      </section>

      <div className="text-center h-6">
        {!isSaved && <span className="text-xs text-stone-400">儲存中...</span>}
      </div>
    </div>
  );
};