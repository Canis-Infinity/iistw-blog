import Button from '@/components/Button';
import styles from './index.module.css';
import clsx from 'clsx';
import { RiCloseLine } from 'react-icons/ri';

export default function Modal({
  form,
  size,
  title,
  close,
  submit,
  reset,
  children
}) {
  if (form) {
    return (
      <form action="" method={form} className={clsx(styles.modal, styles[size])} onSubmit={submit} onReset={reset}>
        <div className={styles.top}>
          <h3>{title}</h3>
          <Button
            isIconType={true}
            icon={<RiCloseLine />}
            onClick={close}
          />
        </div>
        <div className={styles.wrapper}>
          {children}
        </div>
      </form>
    );
  } else {
    return (
      <div className={clsx(styles.modal, styles[size])}>
        <div className={styles.top}>
          <h3>{title}</h3>
          <Button
            isIconType={true}
            icon={<RiCloseLine />}
            onClick={close}
          />
        </div>
        <div className={styles.wrapper}>
          {children}
        </div>
      </div>
    );
  }
}
