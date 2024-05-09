'use client';
import { TbAlertTriangleFilled } from 'react-icons/tb'
import Button from '@/components/Button';
import styles from './index.module.css';

export default function UnAuth() {
  return (<div className={styles.wrapper}>
    <TbAlertTriangleFilled />
    <h2>權限錯誤</h2>
    <p>您沒有權限瀏覽此頁面，請前往登入。</p>
    <Button
      isNextLink="/login"
      color="primary"
      content="前往登入"
      className={styles.button}
    />
  </div>)
}