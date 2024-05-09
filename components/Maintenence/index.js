import styles from './index.module.css';
import { RiSettings6Fill } from 'react-icons/ri';

export default function Maintenence() {
  return (
    <div className={styles.wrapper}>
      <RiSettings6Fill />
      <h1>系統維護中</h1>
    </div>
  );
}