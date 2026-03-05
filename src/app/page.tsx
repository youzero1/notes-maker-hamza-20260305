'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import NoteList from '@/components/NoteList';
import NoteForm from '@/components/NoteForm';
import { Note, NotesFilter, CreateNoteDto, UpdateNoteDto } from '@/types';
import styles from './page.module.css';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [filter, setFilter] = useState<NotesFilter>({
    search: '',
    priority: undefined,
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.search) params.set('search', filter.search);
      if (filter.priority) params.set('priority', filter.priority);
      if (filter.status) params.set('status', filter.status);
      if (filter.sortBy) params.set('sortBy', filter.sortBy);
      if (filter.sortOrder) params.set('sortOrder', filter.sortOrder);

      const res = await fetch(`/api/notes?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      setNotes(json.data || []);
    } catch (err) {
      addToast('Failed to load notes', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, addToast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreate = async (data: CreateNoteDto) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create');
      setNotes((prev) => [json.data, ...prev]);
      setShowForm(false);
      addToast('Note created successfully!', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to create note', 'error');
    }
  };

  const handleUpdate = async (id: string, data: UpdateNoteDto) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update');
      setNotes((prev) => prev.map((n) => (n.id === id ? json.data : n)));
      setEditingNote(null);
      addToast('Note updated successfully!', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to update note', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete');
      setNotes((prev) => prev.filter((n) => n.id !== id));
      addToast('Note deleted successfully!', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to delete note', 'error');
    }
  };

  const handleToggle = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update');
      setNotes((prev) => prev.map((n) => (n.id === id ? json.data : n)));
      addToast(isCompleted ? 'Marked as complete!' : 'Marked as pending!', 'info');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to toggle note', 'error');
    }
  };

  const toastIcons: Record<Toast['type'], string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className={styles.page}>
      <Header
        filter={filter}
        onFilterChange={setFilter}
        onNewNote={() => {
          setEditingNote(null);
          setShowForm(true);
        }}
        noteCount={notes.length}
      />

      <main className={styles.main}>
        <div className="container">
          <NoteList
            notes={notes}
            loading={loading}
            onEdit={(note) => {
              setEditingNote(note);
              setShowForm(true);
            }}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        </div>
      </main>

      {showForm && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
              setEditingNote(null);
            }
          }}
        >
          <div className="modal">
            <NoteForm
              note={editingNote}
              onSubmit={async (data) => {
                if (editingNote) {
                  await handleUpdate(editingNote.id, data);
                } else {
                  await handleCreate(data as CreateNoteDto);
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingNote(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span className="toast-icon">{toastIcons[toast.type]}</span>
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
