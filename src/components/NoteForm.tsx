'use client';

import { useState, useEffect } from 'react';
import { Note, CreateNoteDto, UpdateNoteDto, Priority } from '@/types';
import styles from './NoteForm.module.css';

interface NoteFormProps {
  note?: Note | null;
  onSubmit: (data: CreateNoteDto | UpdateNoteDto) => Promise<void>;
  onCancel: () => void;
}

export default function NoteForm({ note, onSubmit, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [description, setDescription] = useState(note?.description || '');
  const [priority, setPriority] = useState<Priority>(note?.priority || 'medium');
  const [category, setCategory] = useState(note?.category || '');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const isEditing = !!note;

  const validate = () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title must be under 200 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category: category.trim() || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const priorityOptions: { value: Priority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: '#22c55e' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
  ];

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>
          {isEditing ? 'Edit Note' : 'Create New Note'}
        </h2>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onCancel}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.formBody}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">
            Title <span className={styles.required}>*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({});
            }}
            placeholder="Enter note title..."
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            autoFocus
          />
          {errors.title && (
            <p className={styles.errorMsg}>{errors.title}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)..."
            className={styles.textarea}
            rows={4}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Priority</label>
          <div className={styles.priorityOptions}>
            {priorityOptions.map(({ value, label, color }) => (
              <label key={value} className={styles.priorityLabel}>
                <input
                  type="radio"
                  name="priority"
                  value={value}
                  checked={priority === value}
                  onChange={() => setPriority(value)}
                  className={styles.hiddenRadio}
                />
                <span
                  className={`${styles.priorityChip} ${
                    priority === value ? styles.activePriority : ''
                  }`}
                  style={{
                    '--chip-color': color,
                  } as React.CSSProperties}
                >
                  <span
                    className={styles.priorityDot}
                    style={{ background: color }}
                  />
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">
            Category / Tag
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Work, Personal, Shopping..."
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formFooter}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? (
            <span className={styles.spinner} />
          ) : null}
          {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}
