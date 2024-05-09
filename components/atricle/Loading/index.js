import styles from './index.module.css';
import { ImSpinner8 } from 'react-icons/im';

export default function Loading({ content }) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}>
        <ImSpinner8 />
      </div>
      {content && <div>{content}</div>}
    </div>
  );
};