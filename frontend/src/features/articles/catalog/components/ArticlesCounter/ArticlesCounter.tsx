import type { ArticlesCounterProps } from "../../articles-catalog.types";

import css from './ArticlesCounter.module.css';

export const ArticlesCounter = ({ totalItems }: ArticlesCounterProps) => {
  return (
    <div className={css.wrapper}>
      <p className={css.text}>{totalItems} articles</p>
    </div>
  );
};
