import styles from './index.module.css';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const Item = ({ direction, url, title }) => {
  if (!url) return null;
  if (direction === 'prev') {
    return (
      <a className={styles.naviPrev} href={url}>
        <div className={styles.icon}>
          <MdOutlineKeyboardArrowLeft />
        </div>
        <div className={styles.naviInfo}>
          <div className={styles.content}>上一篇</div>
          <div className={styles.title}>{title}</div>
        </div>
      </a>
    )
  } else if (direction === 'next') {
    return (
      <a className={styles.naviNext} href={url}>
        <div className={styles.naviInfo}>
          <div className={styles.content}>下一篇</div>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.icon}>
          <MdOutlineKeyboardArrowRight />
        </div>
      </a>
    )
  }
};

export default function Navigation({ data }) {
  return (
    <div className={styles.navigation}>
      <Item direction='prev' url={data.prev.url} title={data.prev.title} />
      <Item direction='next' url={data.next.url} title={data.next.title} />
    </div>
  );
};