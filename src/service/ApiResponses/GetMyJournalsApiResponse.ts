export interface MyJournalsApiResponse {
  journals: Journals;
  dailyMoodSummary: DailyMoodSummary;
}

export interface Journals {
  journals: Journal[];
  pagination: Pagination;
}

export interface Journal {
  _id: string;
  userId: string;
  date: string;
  title: string;
  content: string;
  iv: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DailyMoodSummary {
  _id: string;
  userId: string;
  date: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

