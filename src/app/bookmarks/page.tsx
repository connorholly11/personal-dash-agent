'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from '@/types/bookmark';
import { getBookmarks, getAllTags } from '@/lib/bookmark-storage';
import BookmarkCard from '@/components/bookmarks/BookmarkCard';
import NewBookmarkForm from '@/components/bookmarks/NewBookmarkForm';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);

  const loadData = async () => {
    const [bookmarksList, tagsList] = await Promise.all([
      getBookmarks(),
      getAllTags()
    ]);
    setBookmarks(bookmarksList);
    setTags(tagsList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBookmarks = selectedTag === 'all'
    ? bookmarks
    : bookmarks.filter(bookmark => bookmark.tags.includes(selectedTag));

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
          <button
            onClick={() => setIsAddingBookmark(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            Add Bookmark
          </button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedTag === 'all'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedTag === tag
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {isAddingBookmark && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <NewBookmarkForm
            onSave={() => {
              setIsAddingBookmark(false);
              loadData();
            }}
            onCancel={() => setIsAddingBookmark(false)}
          />
        </div>
      )}

      {filteredBookmarks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No bookmarks found. Add your first bookmark to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onUpdate={loadData}
              onTagClick={(tag) => setSelectedTag(tag)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 