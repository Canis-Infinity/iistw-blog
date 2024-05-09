'use client';
import { useState, useEffect } from 'react';
import ArticleWrapper from '@/components/ArticleWrapper';
import Article from '@/components/ArticleWrapper/Article';
import Skeleton from '@/components/ArticleWrapper/Skeleton';
import DataStatus from '@/components/DataStatus';
import pageStyles from '@/styles/page.module.css';
import styles from './index.module.css';
import axios from 'axios';

export default function Search({ params }) {
  const { keyword } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.baseUrl}/api/blog/search/${keyword}`)
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
  }, [keyword]);

  return (
    <main className={pageStyles.wrapper}>
      <p>以下是查找關鍵字「<span className={styles.keyword}>{decodeURIComponent(keyword)}</span>」的結果：</p>
      <ArticleWrapper articles={articles}>
        {
          isLoading ? (
            [...Array(10).keys()].map((index) => {
              return <Skeleton key={index} />
            })
          ) : articles.length === 0 ? (
            <DataStatus type="empty" content="沒有找到相關文章" />
          ) : (
            articles.map((article, index) => {
              return <Article key={article._id} {...article} />
            })
          )
        }
      </ArticleWrapper>
    </main>
  )
}