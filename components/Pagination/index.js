'use client';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './index.module.css';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

export default function Pagination({ total, current, handlePageChange }) {
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 400);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize)
    };
  }, [isSmallDevice]);

  const max = isSmallDevice ? 5 : 7;

  const pageNumbers = [];

  for (let i = 1; i <= total; i++) {
    pageNumbers.push(i);
  }

  let start = Math.max(current - (isSmallDevice ? 1 : 2), 1);
  let end = Math.min(start + (max - 1), total);

  if (end - start < (max - 1)) {
    start = Math.max(end - (max - 1), 1);
  }

  const handlePrev = () => {
    if (current > 1) {
      handlePageChange(current - 1);
    }
  };

  const handleNext = () => {
    if (current < total) {
      handlePageChange(current + 1);
    } else {
      handlePageChange(total);
    }
  };

  const handlePageClick = (event) => {
    const page = parseInt(event.target.innerText);
    handlePageChange(page);
  }

  if (total === 0) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <ul>
        <li className={clsx({[styles.disabled]: current === 1})} onClick={handlePrev}><TbChevronLeft /></li>
        {pageNumbers.slice(start - 1, end).map((number) => (
          <li
            key={number}
            className={clsx({[styles.active]: number === current})}
            onClick={handlePageClick}
          >
            {number}
          </li>
        ))}
        <li className={clsx({[styles.disabled]: current === total})} onClick={handleNext}><TbChevronRight /></li>
      </ul>
    </div>
  );
}