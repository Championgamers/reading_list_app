export type ReadingStatus = 'want-to-read' | 'reading' | 'finished';

export interface Book {
  id: string;
  title: string;
  status: ReadingStatus;
  addedAt: number;
}

export const STATUS_META: Record<
  ReadingStatus,
  { label: string; short: string; badge: string; ring: string }
> = {
  'want-to-read': {
    label: 'Want to Read',
    short: 'Want to Read',
    badge: 'bg-amber-100 text-amber-800',
    ring: 'ring-amber-200',
  },
  reading: {
    label: 'Reading',
    short: 'Reading',
    badge: 'bg-sky-100 text-sky-800',
    ring: 'ring-sky-200',
  },
  finished: {
    label: 'Finished',
    short: 'Finished',
    badge: 'bg-emerald-100 text-emerald-800',
    ring: 'ring-emerald-200',
  },
};

export const STATUS_ORDER: ReadingStatus[] = [
  'reading',
  'want-to-read',
  'finished',
];
