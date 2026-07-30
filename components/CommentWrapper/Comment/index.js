'use client';
import { API_BASE_URL } from '@/lib/config';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Button from '@/components/Button';
import moment from 'moment';
import 'moment/locale/zh-tw';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import styles from './index.module.css';

const CommentPreviewClient = dynamic(() => import('./CommentPreviewClient'), {
  ssr: false,
});

const formatCopiedText = (text) =>
  `${text}\n\n- 來源：Infinity 資訊部落格（https://blog.iistw.com/）`;

export default function Comment({
  userData,
  commentData,
  theme,
  handleReplyEditorToggle,
  handleReplyToggle,
  handleFetchComment,
  replys,
}) {
  const defaultProps = {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    draggable: true,
    theme,
  };

  const deleteToast = useRef(null);

  const handleDeleteComment = () => {
    deleteToast.current = toast.loading('留言刪除中', { ...defaultProps });
    axios
      .delete(`${API_BASE_URL}/api/blog/comment/${commentData._id}`, {
        headers: { Authorization: userData.token },
      })
      .then((res) => {
        toast.update(deleteToast.current, {
          render: res.data.message,
          type: res.status === 200 ? 'success' : 'error',
          isLoading: false,
          ...defaultProps,
        });
        if (res.status === 200) handleFetchComment();
      })
      .catch((error) => {
        toast.update(deleteToast.current, {
          render: String(error),
          type: 'error',
          isLoading: false,
          ...defaultProps,
        });
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <div className={styles.avatar}>
          <Image
            src={`${API_BASE_URL}${commentData.user.avatar}`}
            alt={commentData.user.nickname}
            width={80}
            height={80}
            priority
            unoptimized
          />
        </div>
        <span className={styles.nickname}>{commentData.user.nickname}</span>
        {commentData.user.username === 'canis22788' && (
          <span className={styles.badge}>作者</span>
        )}
      </div>

      <div className={styles.content}>
        <CommentPreviewClient
          value={commentData.content}
          theme={theme}
          formatCopiedText={formatCopiedText}
        />
      </div>

      <div className={styles.info}>
        <Button
          isTextType
          tippy="點擊回覆此留言"
          onClick={handleReplyEditorToggle}
          className={styles.replyBtn}
          desktop
        >
          回覆
        </Button>
        <Button
          isTextType
          onClick={handleReplyEditorToggle}
          className={styles.replyBtn}
          mobile
        >
          回覆
        </Button>

        {userData.username === commentData.user.username && (
          <>
            <div className={styles.separator} />
            <Button
              isTextType
              tippy="點擊刪除此留言"
              onClick={handleDeleteComment}
              className={styles.replyBtn}
            >
              刪除
            </Button>
          </>
        )}

        <div className={styles.separator} />
        <Tippy
          content={moment(commentData.datetime).format('YYYY-MM-DD HH:mm:ss')}
          placement="auto"
        >
          <span className={styles.time}>
            {moment(commentData.datetime).fromNow()}
          </span>
        </Tippy>

        {replys > 0 && handleReplyToggle && (
          <>
            <div className={styles.separator} />
            <Button
              isTextType
              tippy="點擊查看回覆"
              onClick={handleReplyToggle}
              className={styles.replyBtn}
              mono
              desktop
            >
              {new Intl.NumberFormat().format(replys)} 則回覆
            </Button>
            <Button
              isTextType
              onClick={handleReplyToggle}
              className={styles.replyBtn}
              mono
              mobile
            >
              {new Intl.NumberFormat().format(replys)} 則回覆
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
