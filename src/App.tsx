import { useMemo, useState } from 'react';
import { BookOpen, Check, Library, Bookmark } from 'lucide-react';
import type { Book, ReadingStatus } from '@/types';
import { STATUS_META } from '@/types';
import { useLocalStorage } from '@/useLocalStorage';
import { AddBookForm } from '@/components/AddBookForm';
import { BookCard } from '@/components/BookCard';

type Filter = ReadingStatus | 'all';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'reading', label: 'Reading' },
  { value: 'want-to-read', label: 'Want to Read' },
  { value: 'finished', label: 'Finished' },
];

function App() {
  const [books, setBooks] = useLocalStorage<Book[]>('reading-list', []);
  const [filter, setFilter] = useState<Filter>('all');

  function addBook(title: string, status: ReadingStatus) {
    setBooks((prev) => [
      { id: crypto.randomUUID(), title, status, addedAt: Date.now() },
      ...prev,
    ]);
  }

  function changeStatus(id: string, status: ReadingStatus) {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }

  function deleteBook(id: string) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return books;
    return books.filter((b) => b.status === filter);
  }, [books, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: books.length };
    for (const b of books) c[b.status] = (c[b.status] ?? 0) + 1;
    return c;
  }, [books]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white">
            <BookOpen size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Reading List
            </h1>
            <p className="text-sm text-gray-500">
              Track what you want to read, are reading, and have finished.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Add form */}
        <AddBookForm books={books} onAdd={addBook} />

        {/* Summary */}
        {books.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3 sm:py-4">
              <div className="mb-1.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gray-900 text-white sm:mb-0">
                <Library size={16} strokeWidth={2.5} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg font-bold leading-none text-gray-900 sm:text-xl">
                  {books.length}
                </p>
                <p className="mt-1 text-[11px] font-medium text-gray-500 sm:text-xs">
                  Total Books
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3 sm:py-4">
              <div className="mb-1.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-sky-100 text-sky-700 sm:mb-0">
                <BookOpen size={16} strokeWidth={2.5} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg font-bold leading-none text-gray-900 sm:text-xl">
                  {counts['reading'] ?? 0}
                </p>
                <p className="mt-1 text-[11px] font-medium text-gray-500 sm:text-xs">
                  Reading
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3 sm:py-4">
              <div className="mb-1.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:mb-0">
                <Check size={16} strokeWidth={2.5} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg font-bold leading-none text-gray-900 sm:text-xl">
                  {counts['finished'] ?? 0}
                </p>
                <p className="mt-1 text-[11px] font-medium text-gray-500 sm:text-xs">
                  Finished
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {books.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.value;
              const count = counts[f.value] ?? 0;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full px-1.5 text-xs ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Book list / empty state */}
        <div className="mt-5">
          {books.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <Library size={26} />
              </div>
              <p className="text-base font-medium text-gray-700">
                Your reading list is empty. Add your first book.
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Use the form above to get started.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/60 px-6 py-14 text-center">
              <p className="text-base font-medium text-gray-700">
                No books in this category yet.
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Try a different filter or add a new book.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {filtered.map((book) => (
                <li key={book.id}>
                  <BookCard
                    book={book}
                    onChangeStatus={changeStatus}
                    onDelete={deleteBook}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="mx-auto max-w-2xl px-4 pb-8 text-center sm:px-6">
        <p className="text-xs text-gray-400">
          {books.length > 0
            ? `${books.length} book${books.length === 1 ? '' : 's'} · saved on this device`
            : 'Saved on this device'}
        </p>
      </footer>
    </div>
  );
}

export default App;
