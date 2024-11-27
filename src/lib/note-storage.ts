import { db } from './db';
import type { Note, NoteFormData } from '@/types/note';

// Temporary user ID until auth is implemented
const TEMP_USER_ID = 'temp-user';

export async function getNotes(): Promise<Note[]> {
  return await db.notes
    .where('userId')
    .equals(TEMP_USER_ID)
    .reverse()
    .sortBy('timestamp');
}

export async function saveNote(noteData: NoteFormData): Promise<Note> {
  const note: Omit<Note, 'id'> = {
    ...noteData,
    userId: TEMP_USER_ID,
    timestamp: Date.now(),
  };

  const id = await db.notes.add(note);
  return await db.notes.get(id) as Note;
}

export async function updateNote(note: Note): Promise<Note> {
  const updatedNote = {
    ...note,
    timestamp: Date.now()
  };
  await db.notes.put(updatedNote);
  return updatedNote;
}

export async function deleteNote(noteId: string): Promise<void> {
  await db.notes.delete(noteId);
}

export async function searchNotes(query: string): Promise<Note[]> {
  const lowercaseQuery = query.toLowerCase();
  
  return await db.notes
    .where('userId')
    .equals(TEMP_USER_ID)
    .filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      (note.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ?? false)
    )
    .reverse()
    .sortBy('timestamp');
} 