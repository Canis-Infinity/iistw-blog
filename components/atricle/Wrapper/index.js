'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import DataStatus from '@/components/DataStatus';
import Post from '@/components/atricle/Post';
import CommentWrapper from '@/components/CommentWrapper';
import pageStyles from '@/styles/page.module.css';

export default function Wrapper({ articleId, data }) {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className={pageStyles.wrapper}>
      {
        !mounted ? (
          <DataStatus type="loading" content="正在獲取部落格內容" />
        ) : (
          <>
            <Post
              articleId={articleId}
              data={data}
              theme={theme}
            />
            <CommentWrapper
              theme={theme}
              articleId={articleId}
              title={data.title}
              publisher={data.publisher}
            />
          </>
        )
      }
    </main>
  )
}