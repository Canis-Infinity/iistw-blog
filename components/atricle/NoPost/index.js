import Button from '@/components/Button';
import styles from './index.module.css';
import { RiQuestionLine, RiHome6Fill } from 'react-icons/ri';

export default function NoPost() {
  return (
    <div className={styles.noPost}>
      <RiQuestionLine />
      <h1>找不到部落格</h1>
      <p>發生未知錯誤，沒有找到部落格，可能已遭刪除，請返回上一頁重試或點擊下方按鈕回首頁。</p>
      <Button
        isNextLink="/"
        color="primary"
        desktop={true}
        content="回首頁"
        icon={<RiHome6Fill />}
      />
    </div>
  );
};