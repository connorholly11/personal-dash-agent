export interface Bookmark {
  id?: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  notes?: string;
  timestamp: number;  // Unix timestamp in milliseconds
  userId: string;
}

export interface BookmarkFormData {
  url: string;
  title: string;
  description?: string;
  tags: string[];
  notes?: string;
} 