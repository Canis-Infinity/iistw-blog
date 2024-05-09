'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import Tabs from '@/components/Tabs';
import DataStatus from '@/components/DataStatus';
import Pagination from '@/components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-tw';
import clsx from 'clsx';
import styles from './index.module.css';
import { MdChat } from 'react-icons/md';
import { RiHeart3Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '@/utils/getToken';

export default function Notifications() {
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

  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    {
      id: 1,
      name: '全部',
      value: 'all',
    },
    {
      id: 2,
      name: '已讀',
      value: 'read',
    },
    {
      id: 3,
      name: '未讀',
      value: 'unread',
    },
  ];

  const handleTabsClick = (value) => {
    setActiveTab(value);
  };

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const [isLoading, setIsLoading] = useState(true);

  const [notiData, setNotiData] = useState([]);

  const handleFetchNoti = useCallback(() => {
    if (!userData.token) return;
    setIsLoading(true);
    axios
      .get(`${process.env.baseUrl}/api/blog/noti?type=${activeTab}&page=${page}`, {
        headers: {
          Authorization: userData.token,
        },
      })
      .then((res) => {
        const { message, data, page, total } = res.data;
        if (res.status === 200) {
          setNotiData(data);
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
    handleFetchNoti();
  }, [handleFetchNoti]);

  const handleMarkAllAsRead = () => {
    axios
      .patch(`${process.env.baseUrl}/api/blog/noti`, null, {
        headers: {
          Authorization: userData.token,
        },
      })
      .then((res) => {
        const { message, data } = res.data;
        if (res.status === 200) {
          toast.success(message, {...defaultProps});
          if (page === 1) {
            handleFetchNoti();
            // fetchNoti(); // 作弊
          } else {
            setPage(1);
          }
        } else {
          console.log(message)
          toast.error(message, {...defaultProps});
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h1 className={styles.title}>通知中心</h1>
      <div className={styles.tabs}>
        <Tabs tabs={tabs} handleClick={handleTabsClick} activeTab={activeTab} />
        <Button
          isTextType={true}
          onClick={handleMarkAllAsRead}
          className={styles.markAllAsReadBtn}
        >
          全部已讀
        </Button>
      </div>
      <div className={styles.wrapper}>
        {
          isLoading ? (
            <DataStatus type="loading" content="正在獲取通知" />
          ) : notiData.length === 0 ? (
            <DataStatus type="empty" content="暫無通知" />
          ) : (
            <>
              <div className={styles.notis}>
                {
                  notiData.map((noti) => {
                    return (
                      <Link href={`/article/${noti.articleId}`} key={noti._id} className={styles.noti}>
                        <div className={clsx(styles.status, {[styles.read]: noti.hasRead, [styles.unread]: !noti.hasRead})}></div>
                        <div className={styles.type}>
                          {
                            noti.type === 'comment' && (
                              <MdChat />
                            )
                          }
                          {
                            noti.type === 'like' && (
                              <RiHeart3Fill />
                            )
                          }
                        </div>
                        <div className={styles.avatar}>
                          <Image
                            src={`${process.env.baseUrl}${noti.avatar}`}
                            alt={noti.from}
                            width={80}
                            height={80}
                          />
                        </div>
                        <div className={styles.content}>
                          <h4 className={styles.subject}>{noti.content}</h4>
                          <p className={styles.time}>{moment(noti.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                        </div>
                      </Link>
                    )
                  })
                }
              </div>
              <Pagination total={total} current={page} handlePageChange={handlePageChange} />
            </>
          )
        }
      </div>
    </>
  );
}