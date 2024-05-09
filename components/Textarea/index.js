'use client';
import { useState } from 'react';
import styles from './index.module.css';
import clsx from 'clsx';

export default function Textarea({
  name,
  id,
  placeholder,
  defaultValue,
  rows,
  cols,
  textareaRef,
  onChange,
  onBlur,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  flex,
  color,
  size,
  mobile,
  desktop,
}) {
  const [cursor, setCursor] = useState('text');

  const handleClick = (event) => {
    event.stopPropagation();
    const input = event.target.querySelector('textarea') || event.target;
    input.focus();
  };

  return (
    <div
      className={clsx(styles.wrapper, {
        [styles.flex]: flex,
        [styles[color]]: color,
        [styles[size]]: size,
      })}
      style={{ cursor: cursor }}
      onClick={handleClick}
      data-mobile={mobile}
      data-desktop={desktop}
    >
      <textarea
        className={clsx(styles.textarea)}
        name={name}
        id={id}
        placeholder={placeholder}
        ref={textareaRef}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        rows={rows}
        cols={cols}
        defaultValue={defaultValue}
      />
    </div>
  );
}