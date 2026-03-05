'use client';

import { Note } from '@/types';
import NoteCard from './NoteCard';
import styles from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  loading: boolean;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isCompleted: boolean) => void;
}

export default function NoteList({ notes, loading, onEdit, onDelete, onToggle }: NoteListProps) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonHeader} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLineShort} />
            <div className={styles.skeletonFooter} />
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIllustration}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="56" fill="#eef2ff" />
            <rect x="35" y="32" width="50" height="60" rx="6" fill="#c7d2fe" />
            <rect x="35" y="32" width="50" height="60" rx="6" fill="white" fillOpacity="0.6" />
            <rect x="43" y="44" width="34" height="4" rx="2" fill="#6366f1" />
            <rect x="43" y="54" width="28" height="3" rx="1.5" fill="#a5b4fc" />
            <rect x="43" y="62" width="22" height="3" rx="1.5" fill="#a5b4fc" />
            <rect x="43" y="70" width="30" height="3" rx="1.5" fill="#a5b4fc" />
            <circle cx="84" cy="82" r="14" fill="#6366f1" />
            <path d="M78 82h12M84 76v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className={styles.emptyTitle}>No notes yet</h2>
        <p className={styles.emptyText}>
          Create your first note to get started. Click the{' '}
          <strong>New Note</strong> button above.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
