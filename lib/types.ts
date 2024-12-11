export interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeResponse {
  success: boolean;
  data: {
    items: Notice[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
  pagination: {
    currentPage: number;
    pageSize: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}
