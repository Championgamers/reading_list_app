import { useState } from 'react';
import { BookOpen, Check, Trash2, ChevronDown, Bookmark } from 'lucide-react';
import type { Book, ReadingStatus } from '@/types';
import { STATUS_META, STATUS_ORDER } from '@/types';

interface BookCardProps {
  book: Book;
  onChangeStatus: (id: string, status: ReadingStatus) => void;
  onDelete: (id: string) => void;
}

export function BookCard({ book, onChangeStatus, onDelete }: BookCardProps) {
  const [open, setOpen] = useState(false);
  const meta = STATUS_META[book.status];

  return (
    <div
      className={`group relative flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm ring-1 ${meta.ring} transition hover:shadow-md`}
    >
      <div
        className={`mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl ${meta.badge}`}
      >
        {book.status === 'finished' ? (
          <Check size={18} strokeWidth={2.5} />
        ) : book.status === 'reading' ? (
          <BookOpen size={18} strokeWidth={2.5} />
        ) : (
          <Bookmark size={18} strokeWidth={2.5} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-gray-900">
          {book.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.badge}`}
          >
            {meta.short}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
            >
              Change status
              <ChevronDown
                size={14}
                className={`transition ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <div className="absolute left-0 z-10 mt-1 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onChangeStatus(book.id, s);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-50 ${
                      s === book.status
                        ? 'font-semibold text-gray-900'
                        : 'text-gray-600'
                    }`}
                  >
                    {STATUS_META[s].label}
                    {s === book.status && (
                      <Check size={14} className="text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onDelete(book.id)}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
