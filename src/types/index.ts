export type Priority = 'low' | 'medium' | 'high';

export interface Note {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteDto {
  title: string;
  description?: string;
  priority?: Priority;
  category?: string;
}

export interface UpdateNoteDto {
  title?: string;
  description?: string;
  priority?: Priority;
  category?: string;
  isCompleted?: boolean;
}

export interface NotesFilter {
  search?: string;
  priority?: Priority;
  status?: 'completed' | 'pending' | 'all';
  sortBy?: 'createdAt' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
