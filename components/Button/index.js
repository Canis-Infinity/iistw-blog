import Link from 'next/link';
import clsx from 'clsx';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import styles from './index.module.css';

export default function Button({
  isLink,
  isNextLink,
  flex,
  isIconType,
  isTextType,
  size,
  width,
  color,
  className,
  type,
  icon,
  content,
  onClick,
  mobile,
  desktop,
  children,
  tippy,
  mono,
  disabled,
}) {
  const sizeBlackList = [undefined, 'normal'];
  const widthBlackList = [undefined, 'normal'];

  type = type ? type : 'button';

  if (isLink) {

    return tippy ? (
      <Tippy
        content={tippy.content}
        placement={tippy.placement || 'auto'}
      >
        <a
          href={isLink}
          className={clsx({
            [styles.btn]: !isIconType,
            [styles.iconType]: isIconType,
            [styles.textType]: isTextType,
            [styles[color]]: color,
            [styles.flex]: flex,
            [styles[size]]: !sizeBlackList.includes(size),
            [styles[width]]: !widthBlackList.includes(width),
            [styles.mono]: mono,
          }, className)}
          onClick={onClick}
          data-mobile={mobile}
          data-desktop={desktop}
        >
          {icon && icon}
          {content && content}
          {children && children}
        </a>
      </Tippy>
    ) : (
      <a
        href={isLink}
        className={clsx({
          [styles.btn]: !isIconType,
          [styles.iconType]: isIconType,
          [styles.textType]: isTextType,
          [styles[color]]: color,
          [styles.flex]: flex,
          [styles[size]]: !sizeBlackList.includes(size),
          [styles[width]]: !widthBlackList.includes(width),
          [styles.mono]: mono,
        }, className)}
        onClick={onClick}
        data-mobile={mobile}
        data-desktop={desktop}
      >
        {icon && icon}
        {content && content}
        {children && children}
      </a>
    );
  }
  if (isNextLink) {
    return tippy ? (
      <Tippy
        content={tippy.content}
        placement={tippy.placement || 'auto'}
      >
        <Link
          href={isNextLink}
          className={clsx({
            [styles.btn]: !isIconType,
            [styles.iconType]: isIconType,
            [styles.textType]: isTextType,
            [styles[color]]: color,
            [styles.flex]: flex,
            [styles[size]]: !sizeBlackList.includes(size),
            [styles[width]]: !widthBlackList.includes(width),
            [styles.mono]: mono,
          }, className)}
          onClick={onClick}
          data-mobile={mobile}
          data-desktop={desktop}
        >
          {icon && icon}
          {content && content}
          {children && children}
        </Link>
      </Tippy>
    ) : (
      <Link
        href={isNextLink}
        className={clsx({
          [styles.btn]: !isIconType,
          [styles.iconType]: isIconType,
          [styles.textType]: isTextType,
          [styles[color]]: color,
          [styles.flex]: flex,
          [styles[size]]: !sizeBlackList.includes(size),
          [styles[width]]: !widthBlackList.includes(width),
          [styles.mono]: mono,
        }, className)}
        onClick={onClick}
        data-mobile={mobile}
        data-desktop={desktop}
      >
        {icon && icon}
        {content && content}
        {children && children}
      </Link>
    );
  }
  if (isTextType) {
    return tippy ? (
      <Tippy
        content={tippy.content}
        placement={tippy.placement || 'auto'}
      >
        <button
          type={type}
          className={clsx(styles.textType, className, {
            [styles.mono]: mono,
          })}
          onClick={onClick}
          data-mobile={mobile}
          data-desktop={desktop}
          disabled={disabled}
        >
          {icon && icon}
          {content && content}
          {children && children}
        </button>
      </Tippy>
    ) : (
      <button
        type={type}
        className={clsx(styles.textType, className, {
          [styles.mono]: mono,
        })}
        onClick={onClick}
        data-mobile={mobile}
        data-desktop={desktop}
      >
        {icon && icon}
        {content && content}
        {children && children}
      </button>
    );
  }
  return tippy ? (
    <Tippy
      content={tippy.content}
      placement={tippy.placement || 'auto'}
    >
      <button
        type={type}
        className={clsx({
          [styles.btn]: !isIconType,
          [styles.iconType]: isIconType,
          [styles[color]]: color,
          [styles.flex]: flex,
          [styles[size]]: !sizeBlackList.includes(size),
          [styles[width]]: !widthBlackList.includes(width),
          [styles.mono]: mono,
        }, className)}
        onClick={onClick}
        data-mobile={mobile}
        data-desktop={desktop}
        disabled={disabled}
      >
        {icon && icon}
        {content && content}
        {children && children}
      </button>
    </Tippy>
  ) : (
    <button
      type={type}
      className={clsx({
        [styles.btn]: !isIconType,
        [styles.iconType]: isIconType,
        [styles[color]]: color,
        [styles.flex]: flex,
        [styles[size]]: !sizeBlackList.includes(size),
        [styles[width]]: !widthBlackList.includes(width),
        [styles.mono]: mono,
      }, className)}
      onClick={onClick}
      data-mobile={mobile}
      data-desktop={desktop}
      disabled={disabled}
    >
      {icon && icon}
      {content && content}
      {children && children}
    </button>
  );
}