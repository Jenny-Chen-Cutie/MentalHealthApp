import { DailyEntry, QuarterlyReview } from '../types';

const DAILY_KEY = 'gentle_self_daily';
const QUARTERLY_KEY = 'gentle_self_quarterly';

export const getDailyEntries = (): Record<string, DailyEntry> => {
  try {
    const data = localStorage.getItem(DAILY_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to load daily entries", e);
    return {};
  }
};

export const saveDailyEntry = (entry: DailyEntry) => {
  const entries = getDailyEntries();
  entries[entry.date] = entry;
  localStorage.setItem(DAILY_KEY, JSON.stringify(entries));
  return entries;
};

export const getQuarterlyReviews = (): Record<string, QuarterlyReview> => {
  try {
    const data = localStorage.getItem(QUARTERLY_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to load quarterly reviews", e);
    return {};
  }
};

export const saveQuarterlyReview = (review: QuarterlyReview) => {
  const reviews = getQuarterlyReviews();
  reviews[review.id] = review;
  localStorage.setItem(QUARTERLY_KEY, JSON.stringify(reviews));
  return reviews;
};

export const getTodayStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getCurrentQuarterId = (): string => {
  const now = new Date();
  const q = Math.floor((now.getMonth() + 3) / 3);
  return `${now.getFullYear()}-Q${q}`;
};