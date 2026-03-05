'use client';

import { useState } from 'react';
import { Note } from '@/types';
import styles from './NoteCard.module.css';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isCompleted: boolean) => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export default function NoteCard({ note, onEdit, onDelete, onToggle }: NoteCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(note.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggle(note.id, !note.isCompleted);
    setIsToggling(false);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`${styles.card} ${note.isCompleted ? styles.completed : ''} ${styles[note.priority]}`}>
      <div className={styles.priorityBar} />

      <div className={styles.cardHeader}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={note.isCompleted}
            onChange={handleToggle}
            disabled={isToggling}
            className={styles.checkbox}
          />
          <span className={styles.checkmark}>
            {note.isCompleted && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </label>

        <h3 className={`${styles.title} ${note.isCompleted ? styles.titleCompleted : ''}`}>
          {note.title}
        </h3>

        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => onEdit(note)}
            title="Edit note"
            aria-label="Edit note"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete note"
            aria-label="Delete note"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>

      {note.description && (
        <p className={`${styles.description} ${note.isCompleted ? styles.descCompleted : ''}`}>
          {note.description}
        </p>
      )}

      <div className={styles.cardFooter}>
        <span className={`${styles.priority} ${styles[`priority_${note.priority}`]}`}>
          {PRIORITY_LABELS[note.priority]}
        </span>

        {note.category && (
          <span className={styles.category}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            {note.category}
          </span>
        )}

        <span className={styles.date}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {formatDate(note.createdAt)}
        </span>
      </div>

      {showDeleteConfirm && (
        <div className={styles.deleteConfirm}>
          <p className={styles.deleteMsg}>Delete this note?</p>
          <div className={styles.deleteActions}>
            <button
              className={styles.cancelDeleteBtn}
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className={styles.confirmDeleteBtn}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
