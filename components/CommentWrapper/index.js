'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

import Button from '@/components/Button';
import Link from 'next/link';
import DataStatus from '@/components/DataStatus';
import Floor from '@/components/CommentWrapper/Floor';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { RiInformationFill } from 'react-icons/ri';
import formStyles from '@/styles/form.module.css';
import styles from './index.module.css';
import { getToken } from '@/utils/getToken';

const EditorClient = dynamic(() => import('./EditorClient'), { ssr: false });

const formatCopiedText = (text) =>
  `${text}\n\n- 來源：Infinity 資訊部落格（https://blog.iistw.com/）`;

export default function Publish({ theme, articleId, title, publisher }) {
  const [userData, setUserData] = useState({});
  const [commentData, setCommentData] = useState([]);
  const [text, setText] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);

  const formRef = useRef(null);
  const submitCommentToast = useRef(null);

  useEffect(() => {
    setUserData(getToken());
  }, []);

  const handleFetchComment = useCallback(() => {
    axios
      .get(`${process.env.baseUrl}/api/blog/comment/${articleId}`)
      .then((res) => {
        if (res.status === 200) setCommentData(res.data.data);
      })
      .catch(console.log);
  }, [articleId]);

  useEffect(() => {
    handleFetchComment();
  }, [handleFetchComment]);

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

  const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
      files.map(
        (file) =>
          new Promise((rev, rej) => {
            const formData = new FormData();
            formData.append('file', file);
            axios
              .post(`${process.env.baseUrl}/api/blog/upload`, formData, {
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

  const handleComment = (event) => {
    event.preventDefault();
    setBtnDisabled(true);

    submitCommentToast.current = toast.loading('新增留言中', {
      ...defaultProps,
    });

    const formData = new FormData(formRef.current);
    formData.append('articleId', articleId);
    formData.append('title', title);
    formData.append('publisher', publisher);
    formData.append('content', text);

    axios
      .post(`${process.env.baseUrl}/api/blog/comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: userData.token,
        },
      })
      .then((res) => {
        toast.update(submitCommentToast.current, {
          render: res.data.message,
          type: res.status === 200 ? 'success' : 'error',
          isLoading: false,
          ...defaultProps,
        });

        if (res.status === 200) {
          setText('');
          handleFetchComment();
        }
      })
      .catch((error) => {
        toast.update(submitCommentToast.current, {
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
      {!['admin', 'user'].includes(userData?.role) ? (
        <DataStatus
          content={
            <p>
              如果想要留言的話，請先
              <Link href="/login" className="link">
                登入
              </Link>
              喔！
            </p>
          }
          type="info"
          color="secondary"
        />
      ) : (
        <>
          <form method="post" action="" ref={formRef} className={styles.form}>
            <div className={formStyles.field}>
              <EditorClient
                theme={theme}
                text={text}
                setText={setText}
                onUploadImg={onUploadImg}
                formatCopiedText={formatCopiedText}
              />

              <div className={formStyles.description}>
                <RiInformationFill />
                <div className={formStyles.content}>
                  <p>
                    Markdown 語法：
                    <a
                      className="link"
                      href="https://imzbf.github.io/md-editor-rt/en-US/grammar"
                      target="_blank"
                    >
                      MdEditorRT Documentation
                    </a>
                  </p>
                  <p>
                    Katex 語法：
                    <a
                      className="link"
                      href="https://katex.org/docs/supported.html"
                      target="_blank"
                    >
                      Supported Functions · KaTeX
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className={formStyles.actions}>
              <Button
                color="primary"
                content={btnDisabled ? '發佈中' : '發佈'}
                onClick={handleComment}
                disabled={btnDisabled}
              />
            </div>
          </form>

          {commentData.length > 0 ? (
            commentData.map((floor) => (
              <Floor
                key={floor._id}
                theme={theme}
                userData={userData}
                commentData={{ ...floor }}
                title={title}
                publisher={publisher}
                handleFetchComment={handleFetchComment}
              />
            ))
          ) : (
            <DataStatus
              content={<p>還沒有留言喔！你要當第一個嗎？</p>}
              type="empty"
              color="secondary"
            />
          )}
        </>
      )}
    </div>
  );
}
