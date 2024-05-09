'use client';
import { useState } from 'react';
import styles from './index.module.css';
import clsx from 'clsx';

export default function Input({
  type,
  name,
  id,
  placeholder,
  defaultValue,
  inputRef,
  onChange,
  onBlur,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  passWordToggle,
  flex,
  color,
  rounded,
  left,
  right,
  kbd,
  size,
  mobile,
  desktop,
}) {
  const [cursor, setCursor] = useState('pointer');

  if (['input', 'search'].includes(type)) {
    setCursor('text')
  }

  const handleClick = (event) => {
    event.stopPropagation();
    const input = event.target.querySelector('input') || event.target.querySelector('select') || event.target;
    const typeOfInput = input.tagName.toLowerCase();
    if (typeOfInput === 'input') {
      input.focus();
    } else if (typeOfInput === 'select') {
      input.click();
    }
  };

  return (
    <div
      className={clsx(styles.wrapper, {
        [styles.flex]: flex,
        [styles[color]]: color,
        [styles[size]]: size,
        [styles.rounded]: rounded,
      })}
      style={{ cursor: cursor }}
      onClick={handleClick}
      data-mobile={mobile}
      data-desktop={desktop}
    >
      {left && <div className={styles.left}>{left}</div>}
      <input
        className={clsx(styles.input)}
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        ref={inputRef}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        defaultValue={defaultValue}
      />
      {kbd && <kbd>{kbd}</kbd>}
      {right && <div className={styles.right} onClick={passWordToggle} style={passWordToggle ? {pointerEvents: 'all'} : {}}>{right}</div>}
    </div>
  );
}