export interface GetDailyRoutineApiResponse {
  reflections: Reflection[];
  pagination: Pagination;
}

export interface Reflection {
  _id: string;
  userId: string;
  title: string;
  date: string;
  reflection: string;
  groundingTip: string;
  mantra: string;
  todayEnergy: string;
  emotionalTheme: string;
  suggestedFocus: string;
  createdAt: string;
  updatedAt: string;
  userDescription: string;
  __v: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
