'use client';
import { useState, useEffect } from 'react';
import ArticleWrapper from '@/components/ArticleWrapper';
import Article from '@/components/ArticleWrapper/Article';
import Skeleton from '@/components/ArticleWrapper/Skeleton';
import DataStatus from '@/components/DataStatus';
import clsx from 'clsx';
import pageStyles from '@/styles/page.module.css';
import styles from './index.module.css';
import axios from 'axios';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.baseUrl}/api/blog`)
      .then((res) => {
        const { message, data } = res.data;
        if (res.status === 200) {
          setArticles(data);
          setIsLoading(false);
        } else {
          console.log(message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className={clsx(pageStyles.wrapper, styles.wrapper)}>
      <div>
        <div>
          <ArticleWrapper articles={articles}>
            {
              isLoading ? (
                [...Array(10).keys()].map((index) => {
                  return <Skeleton key={index} />
                })
              ) : articles.length === 0 ? (
                <DataStatus type="empty" content="暫時沒有文章" />
              ) : (
                articles.map((article, index) => {
                  return <Article key={article._id} {...article} />
                })
              )
            }
          </ArticleWrapper>
        </div>
      </div>
    </main>
  );
}
