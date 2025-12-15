import React, { useEffect, useState, useMemo } from 'react';
import { getCurrentQuarterId, getQuarterlyReviews, saveQuarterlyReview } from '../services/storageService';
import { QuarterlyReview } from '../types';
import { Card, SectionTitle } from './ui';
import { ChevronDown, History, Leaf } from 'lucide-react';

const DEFAULT_REVIEW: QuarterlyReview = {
  id: '',
  quarter: '',
  intention: '',
  intention_reflection: '',
  carry_over_assets: '',
  proof_of_progress: '',
  next_small_adjustment: '',
  updatedAt: '',
};

export const QuarterlyView: React.FC = () => {
  const currentQId = getCurrentQuarterId();
  // State to track which quarter we are viewing
  const [selectedQId, setSelectedQId] = useState(currentQId);
  
  const [review, setReview] = useState<QuarterlyReview>(DEFAULT_REVIEW);
  const [isSaved, setIsSaved] = useState(true);
  
  // Cache all reviews to build the history list
  const [allReviews, setAllReviews] = useState<Record<string, QuarterlyReview>>({});

  // Load all data on mount
  useEffect(() => {
    const data = getQuarterlyReviews();
    setAllReviews(data);
  }, []);

  // Calculate available options (Current + History)
  const quarterOptions = useMemo(() => {
    const keys = Object.keys(allReviews);
    // Ensure current quarter is always an option, even if not saved yet
    if (!keys.includes(currentQId)) {
      keys.push(currentQId);
    }
    // Sort descending (newest first)
    return keys.sort().reverse();
  }, [allReviews, currentQId]);

  // When selected quarter changes, load the data
  useEffect(() => {
    if (allReviews[selectedQId]) {
      setReview(allReviews[selectedQId]);
    } else {
      // If selecting the current quarter but it doesn't exist yet, reset to default
      if (selectedQId === currentQId) {
          setReview({ ...DEFAULT_REVIEW, id: currentQId, quarter: currentQId });
      }
    }
  }, [selectedQId, allReviews, currentQId]);

  // Auto-save logic
  useEffect(() => {
    // Only save if we have a valid ID and the effect wasn't triggered just by switching views
    // (We rely on the user making changes which updates 'review' object)
    if (review.id) {
        const timer = setTimeout(() => {
            saveQuarterlyReview({
                ...review,
                updatedAt: new Date().toISOString()
            });
            // Update local cache so the dropdown stays consistent
            setAllReviews(prev => ({...prev, [review.id]: review}));
            setIsSaved(true);
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, [review]);

  const handleChange = (field: keyof QuarterlyReview, value: string) => {
    setIsSaved(false);
    setReview((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <header className="px-1 flex justify-between items-start">
        <div>
            <h1 className="text-2xl font-bold text-stone-800">季度回顧</h1>
            <div className="relative inline-block mt-1 group">
                <select 
                    value={selectedQId}
                    onChange={(e) => setSelectedQId(e.target.value)}
                    className="appearance-none bg-transparent text-stone-500 font-medium py-1 pr-8 pl-0 cursor-pointer focus:outline-none hover:text-stone-700 transition-colors"
                >
                    {quarterOptions.map(q => (
                        <option key={q} value={q}>
                            {q} {q === currentQId ? '(本季)' : ''}
                        </option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none group-hover:text-stone-600" />
            </div>
        </div>
        {selectedQId !== currentQId && (
            <div className="flex items-center gap-1 text-stone-400 bg-stone-100 px-2 py-1 rounded-full text-xs">
                <History size={12} />
                <span>回顧模式</span>
            </div>
        )}
      </header>

      {/* 季度意圖 Section */}
      <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <SectionTitle>季度意圖</SectionTitle>
            <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full mb-3">這不是承諾，只是本季允許</span>
          </div>
          
          <Card className="bg-gradient-to-br from-[#fafaf9] to-white border-stone-200">
              <div className="text-stone-700 text-lg leading-relaxed font-medium">
                  <span className="inline-block mr-1">這一季，我允許自己把注意力放在</span>
                  <input 
                      type="text"
                      className="bg-transparent border-b-2 border-stone-300 text-stone-900 focus:outline-none focus:border-stone-500 px-1 py-0 min-w-[120px] w-full mt-2 sm:w-auto sm:mt-0 placeholder:text-stone-300 placeholder:font-normal"
                      placeholder="這裡..."
                      value={review.intention}
                      onChange={(e) => handleChange('intention', e.target.value)}
                  />
                  <span className="ml-1">上。</span>
              </div>
          </Card>
      </section>

      {/* 意圖回顧 - Only show if intention is set */}
      {review.intention && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <SectionTitle>意圖回顧</SectionTitle>
              <Card className="relative">
                  <Leaf className="absolute top-4 right-4 text-stone-100" size={48} />
                  <p className="text-stone-600 font-medium mb-3 relative z-10">
                    這一季，有沒有哪個時刻，你其實有靠近這個意圖？
                  </p>
                  <textarea 
                      className="w-full min-h-[80px] border-none focus:ring-0 text-stone-700 bg-transparent resize-none p-0 placeholder:text-stone-300 relative z-10"
                      placeholder="回答「沒有」也是完全合法的。這只是為了觀察，不是為了打分數。"
                      value={review.intention_reflection}
                      onChange={(e) => handleChange('intention_reflection', e.target.value)}
                  />
              </Card>
          </section>
      )}

      {/* 分隔線 */}
      <div className="flex items-center gap-4 px-2">
          <div className="h-px bg-stone-200 flex-1"></div>
          <span className="text-xs text-stone-400 font-medium tracking-widest uppercase">Deep Dive</span>
          <div className="h-px bg-stone-200 flex-1"></div>
      </div>

      <section className="space-y-6">
        <div>
            <SectionTitle>1. 能帶走的東西</SectionTitle>
            <Card>
                <p className="text-stone-500 text-sm mb-2">這三個月，我有沒有累積什麼能被帶走的東西？（知識、技能、體驗、關係）</p>
                <textarea 
                    className="w-full min-h-[100px] border-none focus:ring-0 text-stone-700 bg-transparent resize-none p-0 placeholder:text-stone-300"
                    placeholder={selectedQId === currentQId ? "寫下你的發現..." : "當時沒有紀錄"}
                    value={review.carry_over_assets}
                    onChange={(e) => handleChange('carry_over_assets', e.target.value)}
                />
            </Card>
        </div>

        <div>
            <SectionTitle>2. 原地踏步的反證</SectionTitle>
            <Card>
                <p className="text-stone-500 text-sm mb-2">哪些具體發生的小事，其實證明我並沒有在原地踏步？</p>
                <textarea 
                    className="w-full min-h-[100px] border-none focus:ring-0 text-stone-700 bg-transparent resize-none p-0 placeholder:text-stone-300"
                    placeholder={selectedQId === currentQId ? "例如：終於讀完了那本書、學會煮一道菜..." : "當時沒有紀錄"}
                    value={review.proof_of_progress}
                    onChange={(e) => handleChange('proof_of_progress', e.target.value)}
                />
            </Card>
        </div>

        <div>
            <SectionTitle>3. 下一季的微調</SectionTitle>
            <Card>
                <p className="text-stone-500 text-sm mb-2">下一季，我只微調一件什麼？（只選一件）</p>
                <textarea 
                    className="w-full min-h-[80px] border-none focus:ring-0 text-stone-700 bg-transparent resize-none p-0 placeholder:text-stone-300"
                    placeholder={selectedQId === currentQId ? "例如：早起 10 分鐘、多喝一杯水..." : "當時沒有紀錄"}
                    value={review.next_small_adjustment}
                    onChange={(e) => handleChange('next_small_adjustment', e.target.value)}
                />
            </Card>
        </div>
      </section>

      <div className="text-center h-6">
        {!isSaved && <span className="text-xs text-stone-400">儲存中...</span>}
        {isSaved && <span className="text-xs text-stone-300">已自動儲存</span>}
      </div>
    </div>
  );
};