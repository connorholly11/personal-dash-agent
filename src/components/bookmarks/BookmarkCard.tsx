'use client';

import { Bookmark } from '@/types/bookmark';
import { deleteBookmark } from '@/lib/bookmark-storage';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onUpdate: () => void;
  onTagClick: (tag: string) => void;
}

export default function BookmarkCard({ bookmark, onUpdate, onTagClick }: BookmarkCardProps) {
  const handleDelete = async () => {
    if (!bookmark.id) return;
    if (confirm('Are you sure you want to delete this bookmark?')) {
      await deleteBookmark(bookmark.id);
      onUpdate();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:underline line-clamp-2"
          >
            {bookmark.title}
          </a>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {bookmark.description}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 self-end sm:self-auto"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
        {bookmark.tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
} 