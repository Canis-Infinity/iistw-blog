'use client';
import { API_BASE_URL } from '@/lib/config';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Loading from '@/components/atricle/Loading';
import clsx from 'clsx';
import styles from './index.module.css';
import moment from 'moment';
import { MdRemoveRedEye } from 'react-icons/md';
import axios from 'axios';

const PostPreviewClient = dynamic(() => import('./PostPreviewClient'), {
  ssr: false,
});

export default function Post({ articleId, data, theme }) {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => setLoading(false);

  useEffect(() => {
    const handleCopy = (event) => {
      if (!event.clipboardData) return;
      const codeElemets = document.querySelectorAll('code');
      if (codeElemets.length === 0) return;

      let isInCode = false;
      codeElemets.forEach((codeElement) => {
        if (codeElement.contains(event.target)) isInCode = true;
      });
      if (!isInCode) return;

      event.preventDefault();
      const selection = document.getSelection();
      const modifiedSelection =
        selection +
        '\n\n- 來源：Infinity 資訊部落格（https://blog.iistw.com/）';
      event.clipboardData.setData('text/plain', modifiedSelection);
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  useEffect(() => {
    if (!articleId || data?.isDraft) return;
    const formData = new FormData();
    formData.append('id', articleId);
    axios
      .post(`${API_BASE_URL}/api/blog/views`, formData)
      .catch(console.log);
  }, [articleId, data?.isDraft]);

  return (
    <>
      <div
        className={styles.cover}
        style={data.cover ? {} : { opacity: '0.5' }}
      >
        {loading && <Loading />}
        <Image
          src={
            data.cover
              ? `${API_BASE_URL}${data.cover}`
              : `${API_BASE_URL}/blogs/image.png`
          }
          alt="cover"
          width={960}
          height={480}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onLoad={handleImageLoad}
          priority
        />
      </div>

      <h1>{data.title}</h1>

      <div className={styles.body}>
        <PostPreviewClient value={data.body} theme={theme} />
      </div>

      <div className={styles.info}>
        <div className={styles.tags}>
          <span className={clsx(styles.tag, styles.views)}>
            <MdRemoveRedEye />
            {new Intl.NumberFormat().format(data.views)}
          </span>
          {JSON.parse(data.tags)?.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.times}>
          <span className={styles.datetime}>
            創建於 {moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </span>
          {data.updatedAt && (
            <span className={styles.datetime}>
              更新於 {moment(data.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
