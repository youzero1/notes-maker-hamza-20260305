'use client';

import { useState, useCallback } from 'react';
import { NotesFilter, Priority } from '@/types';
import styles from './Header.module.css';

interface HeaderProps {
  filter: NotesFilter;
  onFilterChange: (filter: NotesFilter) => void;
  onNewNote: () => void;
  noteCount: number;
}

export default function Header({ filter, onFilterChange, onNewNote, noteCount }: HeaderProps) {
  const [searchValue, setSearchValue] = useState(filter.search || '');
  const [showFilters, setShowFilters] = useState(false);

  const debounce = useCallback(
    (fn: (val: string) => void, delay: number) => {
      let timer: NodeJS.Timeout;
      return (val: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(val), delay);
      };
    },
    []
  );

  const debouncedSearch = useCallback(
    debounce((val: string) => {
      onFilterChange({ ...filter, search: val });
    }, 350),
    [filter, onFilterChange]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Notes Maker';

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#6366f1" />
              <path d="M7 10h14M7 14h10M7 18h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className={styles.title}>{appName}</h1>
            <p className={styles.subtitle}>
              {noteCount} {noteCount === 1 ? 'note' : 'notes'}
            </p>
          </div>
        </div>

        <button className={styles.newBtn} onClick={onNewNote}>
          <span className={styles.newBtnIcon}>+</span>
          <span className={styles.newBtnText}>New Note</span>
        </button>
      </div>

      <div className={`container ${styles.controls}`}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchValue}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          {searchValue && (
            <button
              className={styles.searchClear}
              onClick={() => {
                setSearchValue('');
                onFilterChange({ ...filter, search: '' });
              }}
            >
              ✕
            </button>
          )}
        </div>

        <button
          className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
          {(filter.priority || filter.status !== 'all') && (
            <span className={styles.filterBadge} />
          )}
        </button>
      </div>

      {showFilters && (
        <div className={`container ${styles.filterPanel}`}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status</label>
            <div className={styles.filterOptions}>
              {(['all', 'pending', 'completed'] as const).map((s) => (
                <button
                  key={s}
                  className={`${styles.filterChip} ${
                    filter.status === s ? styles.activeChip : ''
                  }`}
                  onClick={() => onFilterChange({ ...filter, status: s })}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Priority</label>
            <div className={styles.filterOptions}>
              <button
                className={`${styles.filterChip} ${
                  !filter.priority ? styles.activeChip : ''
                }`}
                onClick={() => onFilterChange({ ...filter, priority: undefined })}
              >
                All
              </button>
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  className={`${styles.filterChip} ${styles[p]} ${
                    filter.priority === p ? styles.activeChip : ''
                  }`}
                  onClick={() => onFilterChange({ ...filter, priority: p })}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort By</label>
            <div className={styles.filterOptions}>
              <select
                className={styles.select}
                value={filter.sortBy}
                onChange={(e) =>
                  onFilterChange({ ...filter, sortBy: e.target.value as NotesFilter['sortBy'] })
                }
              >
                <option value="createdAt">Date Created</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
              </select>
              <select
                className={styles.select}
                value={filter.sortOrder}
                onChange={(e) =>
                  onFilterChange({ ...filter, sortOrder: e.target.value as 'asc' | 'desc' })
                }
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <button
            className={styles.clearFilters}
            onClick={() =>
              onFilterChange({
                search: filter.search,
                priority: undefined,
                status: 'all',
                sortBy: 'createdAt',
                sortOrder: 'desc',
              })
            }
          >
            Reset Filters
          </button>
        </div>
      )}
    </header>
  );
}
