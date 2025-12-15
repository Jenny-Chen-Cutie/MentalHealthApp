import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { getDailyEntries, getTodayStr } from '../services/storageService';
import { Mood, MOOD_COLORS, MOOD_LABELS } from '../types';
import { Card, SectionTitle } from './ui';

export const WeeklyView: React.FC = () => {
  const stats = useMemo(() => {
    const all = getDailyEntries();
    const today = new Date(getTodayStr());
    
    // Get last 7 days including today
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }

    const weeklyEntries = dates.map((d) => all[d]).filter(Boolean);

    // Counts
    const counts = {
      future_step: 0,
      body_presence: 0,
      life_moment: 0,
    };
    
    const moodCounts: Record<string, number> = {
      calm: 0,
      ordinary: 0,
      tired: 0,
      low: 0,
    };

    weeklyEntries.forEach((e) => {
      if (e.future_step) counts.future_step++;
      if (e.body_presence) counts.body_presence++;
      if (e.life_moment) counts.life_moment++;
      if (e.mood) moodCounts[e.mood]++;
    });

    const checkboxData = [
      { name: '未來小事', count: counts.future_step, color: '#a8a29e' },
      { name: '身體回來', count: counts.body_presence, color: '#a8a29e' },
      { name: '生活感', count: counts.life_moment, color: '#a8a29e' },
    ];

    const moodData = Object.keys(moodCounts).map((key) => ({
      name: MOOD_LABELS[key as Mood],
      key: key as Mood,
      count: moodCounts[key],
      color: MOOD_COLORS[key as Mood],
    }));

    return { checkboxData, moodData, daysRecorded: weeklyEntries.length };
  }, []);

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
       <header className="px-1">
        <h1 className="text-2xl font-bold text-stone-800">本週趨勢</h1>
        <p className="text-stone-500">只看發生頻率，沒有好壞之分</p>
      </header>

      {/* Checkbox Frequency */}
      <section>
        <SectionTitle>事件發生次數（近 7 天）</SectionTitle>
        <Card className="h-64">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.checkboxData} layout="vertical" margin={{ left: 0, right: 30 }}>
              <XAxis type="number" domain={[0, 7]} hide />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" barSize={32} radius={[0, 4, 4, 0]}>
                {stats.checkboxData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#57534e' : '#e7e5e4'} />
                ))}
              </Bar>
              {/* Custom Axis Labels rendered via HTML/CSS layout outside commonly, but here simplistic approach */}
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-4 mt-[-200px] pointer-events-none relative z-10 pl-2">
              {stats.checkboxData.map((d, i) => (
                  <div key={i} className="flex justify-between items-center h-[32px] mb-[32px] last:mb-0">
                      <span className="text-sm font-medium text-stone-600 mix-blend-multiply bg-white/50 px-1 rounded">{d.name}</span>
                      <span className="text-sm font-bold text-stone-800 pr-4">{d.count} 天</span>
                  </div>
              ))}
          </div>
          <div className="h-[30px]" /> {/* Spacer for visual layout hack */}
        </Card>
      </section>

      {/* Mood Distribution */}
      <section>
        <SectionTitle>心情狀態分佈</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
            {stats.moodData.map((m) => (
                <div key={m.key} className="bg-white p-4 rounded-xl border border-stone-100 flex flex-col items-center justify-center gap-2">
                    <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: m.color }}
                    >
                        {m.name.split(' ')[0]}
                    </div>
                    <span className="text-stone-600 text-sm font-medium">{m.name.split(' ')[1]}</span>
                    <span className="text-2xl font-bold text-stone-800">{m.count}<span className="text-xs font-normal text-stone-400 ml-1">次</span></span>
                </div>
            ))}
        </div>
      </section>

      <section className="px-1 text-center">
          <p className="text-stone-400 text-sm">
            本週紀錄了 {stats.daysRecorded} 天。<br/>
            單日沒有意義，趨勢才有。
          </p>
      </section>
    </div>
  );
};