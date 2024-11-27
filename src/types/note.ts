export interface Note {
  id?: string;
  title: string;
  content: string;
  tags?: string[];
  timestamp: number;
  userId: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags?: string[];
} 