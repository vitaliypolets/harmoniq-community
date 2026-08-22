import { useState, useEffect } from 'react';
import type { ArticlesFiltersProps, ArticleFilter } from "../../articles-catalog.types";

import css from './ArticlesFilters.module.css';

const OPTIONS: { value: ArticleFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'popular', label: 'Popular' },
];

export const ArticlesFilters = ({ activeFilter, onFilterChange }: ArticlesFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = OPTIONS.find(opt => opt.value === activeFilter) || OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest(`.${css.container}`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: ArticleFilter) => {
    onFilterChange(value);
    setIsOpen(false);
  };

  return (
    <div className={css.container}>
      <button
        type="button"
        className={css.selectButton}
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption.label}</span>
        <svg
          className={`${css.chevron} ${isOpen ? css.chevronRotated : ''}`}
          width="16"
          height="16"
        >
          <use href="/icons/sprite.svg#icon-chevron-down" />
        </svg>
      </button>

      {isOpen && (
        <ul className={css.dropdown} role="listbox">
          {OPTIONS.map(option => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={activeFilter === option.value}
                className={`${css.option} ${activeFilter === option.value ? css.active : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
