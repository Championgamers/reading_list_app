import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Book, ReadingStatus } from '@/types';
import { STATUS_META, STATUS_ORDER } from '@/types';

const MAX_TITLE_LENGTH = 60;

interface AddBookFormProps {
  books: Book[];
  onAdd: (title: string, status: ReadingStatus) => void;
}

export function AddBookForm({ books, onAdd }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('want-to-read');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a book title.');
      return;
    }
    if (trimmed.length > MAX_TITLE_LENGTH) {
      setError('Book title must be 60 characters or fewer.');
      return;
    }
    const normalized = trimmed.replace(/\s+/g, ' ').toLowerCase();
    const exists = books.some(
      (b) => b.title.trim().replace(/\s+/g, ' ').toLowerCase() === normalized
    );
    if (exists) {
      setError('This book is already in your reading list.');
      return;
    }
    onAdd(trimmed, status);
    setTitle('');
    setStatus('want-to-read');
    setError('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label
            htmlFor="book-title"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Book title
          </label>
          <input
            id="book-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. The Great Gatsby"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-500">{error}</p>
          )}
        </div>

        <div className="sm:w-44">
          <label
            htmlFor="book-status"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="book-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ReadingStatus)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-[0.99] sm:w-auto"
      >
        <Plus size={18} />
        Add to list
      </button>
    </form>
  );
}
