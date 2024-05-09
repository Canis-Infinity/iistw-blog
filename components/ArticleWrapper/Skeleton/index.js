import styles from './index.module.css';

export default function Skeleton() {

  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <div className={styles.datetime}></div>
        <div className={styles.title}></div>
        <div className={styles.content}></div>
        <div className={styles.tags}></div>
      </div>
      <div className={styles.cover}></div>
    </div>
  );
}