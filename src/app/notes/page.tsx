'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import { getNotes, saveNote, updateNote } from '@/lib/note-storage';
import NoteEditor from '@/components/notes/NoteEditor';
import NoteCard from '@/components/notes/NoteCard';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const notesList = await getNotes();
      setNotes(notesList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
      console.error('Error loading notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (noteData: any) => {
    try {
      if (editingNote) {
        await updateNote({
          ...editingNote,
          ...noteData,
          timestamp: Date.now()
        });
      } else {
        await saveNote(noteData);
      }
      setIsEditing(false);
      setEditingNote(undefined);
      await loadNotes();
    } catch (error) {
      throw error; // Let the NoteEditor handle the error
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingNote(undefined);
  };

  const filteredNotes = searchQuery
    ? notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : notes;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4 mb-8">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Notes
        </h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              New Note
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingNote ? 'Edit Note' : 'New Note'}
          </h2>
          <NoteEditor
            note={editingNote}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onUpdate={loadNotes}
            />
          ))}
          {filteredNotes.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 