export interface MessageApiResponse {
  chats: Chat[];
  pagination: Pagination;
}

export interface Chat {
  _id: string;
  userId: string;
  role: string;
  modelUsed: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: string;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
