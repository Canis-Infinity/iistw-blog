import styles from './index.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Copyright © 2024{' '}
        <a href="https://iistw.com/" className="link" target="_blank">
          Infinity 資訊
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
