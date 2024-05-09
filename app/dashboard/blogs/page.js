'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import Tabs from '@/components/Tabs';
import DataStatus from '@/components/DataStatus';
import Pagination from '@/components/Pagination';
import 'moment/locale/zh-tw';
import clsx from 'clsx';
import tableStyles from '@/styles/table.module.css';
import styles from './index.module.css';
import { ImSpinner8 } from 'react-icons/im';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '@/utils/getToken';

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

export default function Blogs() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUser = getToken();
      setUserData(currentUser);
    }
  }, []);

  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultProps = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    draggable: true,
    theme: theme,
    // transition: bounce,
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('type') || 'published';

  const tabs = [
    {
      id: 1,
      name: '已發佈',
      value: 'published',
    },
    {
      id: 2,
      name: '草稿',
      value: 'draft',
    },
  ];

  const handleTabsClick = (value) => {
    router.push(`/dashboard/blogs?type=${value}`);
  };

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const [isLoading, setIsLoading] = useState(true);

  const [articleData, setArticleData] = useState([]);

  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleFetchArticles = useCallback(() => {
    if (!userData.token) return;
    setIsLoading(true);
    axios
      .get(`${process.env.baseUrl}/api/blog/${activeTab}?page=${page}`, {
        headers: {
          Authorization: userData.token,
        },
      })
      .then((res) => {
        const { message, data, page, total } = res.data;
        if (res.status === 200) {
          setArticleData(data);
          setPage(page);
          setTotal(total);
          setIsLoading(false);
        } else {
          console.log(message)
          setPage(1);
          setTotal(0);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setPage(1);
        setTotal(0);
        setIsLoading(false);
      });
  }, [userData, activeTab, page]);

  useEffect(() => {
    handleFetchArticles();
  }, [handleFetchArticles]);

  const deleteToast = useRef(null);

  const handleDelete = (articleId) => {
    deleteToast.current = toast.loading('部落格刪除中', {...defaultProps});
    axios
      .delete(`${process.env.baseUrl}/api/blog/${articleId}`, {
        headers: {
          Authorization: userData.token,
        },
      })
      .then((res) => {
        const { message } = res.data;
        if (res.status === 200) {
          toast.update(deleteToast.current, { render: res.data.message, type: "success", isLoading: false, ...defaultProps });
          handleFetchArticles();
          return;
        } else {
          toast.update(deleteToast.current, { render: res.data.message, type: "error", isLoading: false, ...defaultProps });
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        toast.update(deleteToast.current, { render: error, type: "error", isLoading: false, ...defaultProps });
        return;
      });
  };

  return (
    <>
      <h1 className={styles.title}>部落格管理</h1>
      <div className={styles.tabs}>
        <Tabs tabs={tabs} handleClick={handleTabsClick} activeTab={activeTab} />
      </div>
      <div className={styles.wrapper}>
        {
          isLoading ? (
            <DataStatus type="loading" content="正在獲取部落格列表" />
          ) : articleData.length === 0 ? (
            <DataStatus type="empty" content="暫無部落格" />
          ) : (
            <>
              <div className={tableStyles.wrapper}>
                <div className={tableStyles.table}>
                  <div className={tableStyles.thead}>
                    <div className={tableStyles.tr}>
                      <div className={clsx(tableStyles.th, tableStyles.fit)} data-desktop>縮圖</div>
                      <div className={tableStyles.th}>標題</div>
                      {
                        activeTab === 'published' && (
                          <div className={clsx(tableStyles.th, tableStyles.alignRight)}>瀏覽數</div>
                        )
                      }
                      <div className={clsx(tableStyles.th, tableStyles.fit, tableStyles.alignRight)}>動作</div>
                    </div>
                  </div>
                  {
                    articleData.map((article) => {
                      return (
                        <div key={article._id} className={tableStyles.tbody}>
                          <div className={tableStyles.tr}>
                            <div className={clsx(tableStyles.td, tableStyles.fit)} data-desktop>
                              <div className={styles.thumbnail}>
                                {loading && <Loading />}
                                <Image
                                  src={`${process.env.baseUrl}${article.cover}`}
                                  alt={article.title}
                                  width={200}
                                  height={150}
                                  onLoad={handleImageLoad}
                                />
                              </div>
                            </div>
                            <div className={tableStyles.td}><Link href={`/article/${article._id}`} className={styles.link}>{article.title}</Link></div>
                            {
                              !article.isDraft && (
                                <div className={clsx(tableStyles.td, tableStyles.mono, tableStyles.alignRight)}>{new Intl.NumberFormat().format(article.views)}</div>
                              )
                            }
                            <div className={clsx(tableStyles.td, tableStyles.fit)}>
                              <div className={tableStyles.actions}>
                                <Button
                                  isNextLink={`/publish/edit/${article._id}`}
                                  isTextType={true}
                                  className={tableStyles.primary}
                                >
                                  編輯
                                </Button>
                                <Button
                                  isTextType={true}
                                  onClick={() => {
                                    handleDelete(article._id);
                                  }}
                                  className={tableStyles.warning}
                                >
                                  刪除
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <Pagination total={total} current={page} handlePageChange={handlePageChange} />
            </>
          )
        }
      </div>
    </>
  );
}