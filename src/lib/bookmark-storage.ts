import { db } from './db';
import type { Bookmark, BookmarkFormData } from '@/types/bookmark';

// Temporary user ID until auth is implemented
const TEMP_USER_ID = 'temp-user';

export async function getBookmarks(): Promise<Bookmark[]> {
  return await db.bookmarks
    .where('userId')
    .equals(TEMP_USER_ID)
    .reverse()
    .sortBy('timestamp');
}

export async function getBookmarksByTag(tag: string): Promise<Bookmark[]> {
  return await db.bookmarks
    .where('userId')
    .equals(TEMP_USER_ID)
    .filter(bookmark => bookmark.tags.includes(tag))
    .reverse()
    .sortBy('timestamp');
}

export async function saveBookmark(bookmarkData: BookmarkFormData): Promise<Bookmark> {
  const bookmark: Omit<Bookmark, 'id'> = {
    ...bookmarkData,
    timestamp: Date.now(),
    userId: TEMP_USER_ID
  };

  const id = await db.bookmarks.add(bookmark);
  return await db.bookmarks.get(id) as Bookmark;
}

export async function updateBookmark(id: string, bookmarkData: BookmarkFormData): Promise<void> {
  await db.bookmarks.update(id, bookmarkData);
}

export async function deleteBookmark(id: string): Promise<void> {
  await db.bookmarks.delete(id);
}

export async function getAllTags(): Promise<string[]> {
  const bookmarks = await getBookmarks();
  const tagSet = new Set<string>();
  bookmarks.forEach(bookmark => {
    bookmark.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
} 