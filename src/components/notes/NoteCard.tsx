'use client';

import { Note } from '@/types/note';
import { deleteNote } from '@/lib/note-storage';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onUpdate: () => void;
}

export default function NoteCard({ note, onEdit, onUpdate }: NoteCardProps) {
  const handleDelete = () => {
    if (!note.id) return;
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(note.id);
      onUpdate();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {note.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(note.timestamp)}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="text-indigo-500 hover:text-indigo-700 text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {note.content}
        </p>
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
} 