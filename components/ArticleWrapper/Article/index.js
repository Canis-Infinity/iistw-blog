import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './index.module.css';
import { useInView } from "framer-motion";
import { ImSpinner8 } from 'react-icons/im';
import { MdRemoveRedEye } from 'react-icons/md';
import moment from 'moment';

const Loading = ({ content }) => {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}>
        <ImSpinner8 />
      </div>
      {content && <div>{content}</div>}
    </div>
  );
};

export default function Article({
  _id,
  title,
  intro,
  tags,
  createdAt,
  views,
  cover,
}) {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(isInView);
    if (isInView) {
      setTimeout(() => {
        setIsVisible(false);
      }, 300)
    }
  }, [isInView]);

  return (
    <Link ref={ref} href={`/article/${_id}`} className={clsx(styles.wrapper, {[styles.slider]: isVisible, [styles.hide]: !isInView})}>
      <div className={styles.info}>
        <span className={styles.datetime}>{moment(createdAt).format('YYYY-MM-DD HH:MM:SS')}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.intro}>{intro}</p>
        <div className={styles.tags}>
          <span className={clsx(styles.tag, styles.views)}><MdRemoveRedEye />{new Intl.NumberFormat().format(views)}</span>
          {
            JSON.parse(tags).map((tag, index) => {
              return <span key={index} className={styles.tag}>{tag}</span>
            })
          }
        </div>
      </div>
      <div className={styles.cover}>
        {loading && <Loading />}
        <Image
          src={cover ? `${process.env.baseUrl}${cover}` : '/image.png'}
          alt="cover"
          width={960}
          height={540}
          onLoad={handleImageLoad}
          priority
        />
      </div>
    </Link>
  );
}