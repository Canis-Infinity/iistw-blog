'use client';
import { API_BASE_URL } from '@/lib/config';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

import Button from '@/components/Button';
import Comment from '@/components/CommentWrapper/Comment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import formStyles from '@/styles/form.module.css';
import styles from './index.module.css';

const FloorEditorClient = dynamic(() => import('./FloorEditorClient'), {
  ssr: false,
});

const formatCopiedText = (text) =>
  `${text}\n\n- 來源：Infinity 資訊部落格（https://blog.iistw.com/）`;

export default function Floor({
  userData,
  theme,
  commentData,
  title,
  publisher,
  handleFetchComment,
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

  const [replyVisible, setReplyVisible] = useState(false);
  const [replyEditorVisible, setReplyEditorVisible] = useState(false);
  const [text, setText] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);

  const formRef = useRef(null);
  const editorRef = useRef(null);
  const submitReplyToast = useRef(null);

  const handleReplyToggle = (status) => {
    setReplyVisible(status ? status : !replyVisible);
  };

  const handleReplyEditorToggle = () => {
    setReplyEditorVisible((v) => !v);
  };

  const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
      files.map(
        (file) =>
          new Promise((rev, rej) => {
            const formData = new FormData();
            formData.append('file', file);
            axios
              .post(`${API_BASE_URL}/api/blog/upload`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: userData.token,
                },
              })
              .then((r) => rev(r))
              .catch((e) => rej(e));
          })
      )
    );

    callback(res.map((item) => item.data.url));
  };

  const handleEditorPreview = useCallback(() => {
    editorRef.current?.togglePreview(false);
  }, []);

  useEffect(() => {
    if (!replyEditorVisible) return;
    handleEditorPreview();
  }, [handleEditorPreview, replyEditorVisible]);

  const handleReply = (event) => {
    event.preventDefault();
    setBtnDisabled(true);

    submitReplyToast.current = toast.loading('新增留言中', { ...defaultProps });

    const formData = new FormData(formRef.current);
    formData.append('articleId', commentData.articleId);
    formData.append('replyId', commentData._id);
    formData.append('title', title);
    formData.append('content', text);
    formData.append('publisher', publisher);

    axios
      .post(`${API_BASE_URL}/api/blog/comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: userData.token,
        },
      })
      .then((res) => {
        toast.update(submitReplyToast.current, {
          render: res.data.message,
          type: res.status === 200 ? 'success' : 'error',
          isLoading: false,
          ...defaultProps,
        });

        if (res.status === 200) {
          setText('');
          handleFetchComment();
          handleReplyToggle(true);
        }
      })
      .catch((error) => {
        toast.update(submitReplyToast.current, {
          render: String(error),
          type: 'error',
          isLoading: false,
          ...defaultProps,
        });
        console.log(error);
      })
      .finally(() => setBtnDisabled(false));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.comment}>
        <Comment
          userData={userData}
          commentData={commentData}
          theme={theme}
          handleReplyEditorToggle={handleReplyEditorToggle}
          handleReplyToggle={handleReplyToggle}
          handleFetchComment={handleFetchComment}
          replys={commentData.reply?.length ? commentData.reply.length : 0}
        />
      </div>

      {replyVisible && commentData.reply?.length > 0 ? (
        <div className={styles.comment} style={{ paddingLeft: '3rem' }}>
          {commentData.reply.map((item, index) => (
            <Comment
              key={index}
              userData={userData}
              commentData={item}
              theme={theme}
              handleReplyToggle={handleReplyToggle}
              handleFetchComment={handleFetchComment}
            />
          ))}
        </div>
      ) : null}

      {replyEditorVisible && (
        <form method="post" action="" ref={formRef} className={styles.form}>
          <div className={formStyles.field}>
            <FloorEditorClient
              theme={theme}
              text={text}
              setText={setText}
              onUploadImg={onUploadImg}
              formatCopiedText={formatCopiedText}
              editorRef={editorRef}
            />
          </div>

          <div className={formStyles.actions}>
            <Button
              color="primary"
              content={btnDisabled ? '回覆中' : '回覆'}
              size="large"
              width="relaxed"
              onClick={handleReply}
              disabled={btnDisabled}
            />
          </div>
        </form>
      )}
    </div>
  );
}
