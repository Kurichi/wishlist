export const TIMEFRAME_LABELS: Record<string, string> = {
  'short-term': '短期',
  'medium-term': '中期',
  'long-term': '長期',
};

export const CATEGORY_LABELS: Record<string, string> = {
  gadgets: 'ガジェット',
  experiences: '体験',
  skills: 'スキル',
  lifestyle: '生活',
  other: 'その他',
};

export const PRIORITY_LABELS: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export const STATUS_LABELS: Record<string, string> = {
  unstarted: '未着手',
  considering: '検討中',
  purchased: '購入済',
};

export const DESIRE_TYPE_LABELS: Record<string, string> = {
  'specific-product': '具体的な商品',
  'general-image': 'イメージ',
  'problem-to-solve': '課題',
};

export const TIMEFRAME_OPTIONS = Object.entries(TIMEFRAME_LABELS).map(([value, label]) => ({ value, label }));
export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));
export const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }));
export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
export const DESIRE_TYPE_OPTIONS = Object.entries(DESIRE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export const SORT_OPTIONS = [
  { value: 'createdAt', label: '作成日' },
  { value: 'updatedAt', label: '更新日' },
  { value: 'budget', label: '予算' },
  { value: 'priority', label: '優先度' },
  { value: 'name', label: '名前' },
];
