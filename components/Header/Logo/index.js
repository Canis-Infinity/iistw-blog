'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import styles from './index.module.css';

export default function Logo() {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* <Image
        src={`/logo-text-${theme}.svg`}
        alt="logo"
        width={Math.floor(2944 / 20)}
        height={560 / 20}
        priority
        data-desktop
      /> */}
      <span className={styles.title}>部落格</span>
    </>
  )
}