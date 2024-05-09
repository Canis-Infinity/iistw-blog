import styles from './index.module.css';

export default function ArticleWrapper({ children }) {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
}