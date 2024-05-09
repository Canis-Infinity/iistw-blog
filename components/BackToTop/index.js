'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import styles from './index.module.css';
import clsx from 'clsx';
import { RiArrowUpSLine } from 'react-icons/ri';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrolled = window.scrollY;
    if (scrolled > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      className={clsx(styles.btn, {[styles.show]: isVisible})}
      isIconType={true}
      onClick={handleClick}
      size="large"
      icon={<RiArrowUpSLine />}
    />
  );
}