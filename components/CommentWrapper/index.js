'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
import { Emoji, Mark, ExportPDF } from '@vavt/rt-extension';
import MarkExtension from 'markdown-it-mark';
import markdownItImplicitFigures from 'markdown-it-implicit-figures';
import markdownItScrollTable from 'markdown-it-scrolltable';
import screenfull from 'screenfull';
import Button from '@/components/Button';
import Link from 'next/link';
import DataStatus from '@/components/DataStatus';
import Floor from '@/components/CommentWrapper/Floor';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { MdOutlineFormatColorText } from 'react-icons/md';
import { BsEmojiSmileFill, BsFillFileEarmarkPdfFill } from 'react-icons/bs';
import { RiInformationFill } from 'react-icons/ri';
import formStyles from '@/styles/form.module.css';
import styles from './index.module.css';
import { getToken } from '@/utils/getToken';

config({
  editorConfig: {
    languageUserDefined: {
      'zh-TW': ZH_TW
    }
  },
  editorExtensions: {
    screenfull: {
      instance: screenfull
    }
  },
  markdownItConfig(md) {
    md
      .use(MarkExtension)
      .use(markdownItImplicitFigures, {
        figcaption: true,
        keepAlt: true,
        lazyLoading: true,
      })
      .use(markdownItScrollTable);
  }
});

const formatCopiedText = (text) => {
  return `${text}\n\n- 來源：Infinity 資訊部落格（https://blog.iistw.com/）`;
};

const toolbar = [
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  0,
  1,
  2,
  '-',
  'revoke',
  'next',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog',
  'github'
];

export default function Publish({ theme, articleId, title, publisher }) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUser = getToken();
      setUserData(currentUser);
    }
  }, []);

  const [commentData, setCommentData] = useState([]);

  const handleFetchComment = useCallback(() => {
    axios
      .get(`${process.env.baseUrl}/api/blog/comment/${articleId}`)
      .then((res) => {
        const { message, data } = res.data;
        if (res.status === 200) {
          setCommentData(data);
          return;
        } else {
          console.log(message);
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  }, [articleId]);

  useEffect(() => {
    handleFetchComment();
  }, [handleFetchComment]);

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

  const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const formData = new FormData();
          formData.append('file', file);
          axios
            .post(`${process.env.baseUrl}/api/blog/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: userData.token,
              }
            })
            .then((res) => rev(res))
            .catch((error) => rej(error));
        });
      })
    );

    callback(res.map((item) => item.data.url));
  };

  const formRef = useRef(null);

  const [text, setText] = useState('');

  const editorRef = useRef(null);

  const handleEditorPreview = useCallback(() => {
    if (typeof window !== 'undefined') {
      editorRef.current?.togglePreview(false);
    }
  }, [editorRef]);

  useEffect(() => {
    handleEditorPreview();
  }, [handleEditorPreview]);

  const [btnDisabled, setBtnDisabled] = useState(false);

  const submitCommentToast = useRef(null);

  const handleComment = (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    submitCommentToast.current = toast.loading('新增留言中', {...defaultProps});
    const formData = new FormData(formRef.current);
    formData.append('articleId', articleId);
    formData.append('title', title);
    formData.append('publisher', publisher);
    formData.append('content', text);
    const data = Object.fromEntries(formData);
    // console.log(data);
    axios
      .post(`${process.env.baseUrl}/api/blog/comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: userData.token,
        }
      })
      .then((res) => {
        if (res.status === 200) {
          toast.update(submitCommentToast.current, { render: res.data.message, type: "success", isLoading: false, ...defaultProps });
          setText('');
          handleFetchComment();
          return;
        } else {
          toast.update(submitCommentToast.current, { render: res.data.message, type: "error", isLoading: false, ...defaultProps });
          return;
        }
      })
      .catch((error) => {
        toast.update(submitCommentToast.current, { render: error, type: "error", isLoading: false, ...defaultProps });
        console.log(error);
      });
    setBtnDisabled(false);
  };

  return (
    <div className={styles.wrapper}>
      {
        !['admin', 'user'].includes(userData?.role) ? (
          <DataStatus
            content={<p>如果想要留言的話，請先<Link href="/login" className="link">登入</Link>喔！</p>}
            type="info"
            color="secondary"
          />
        ) :(
          <>
            <form method="post" action="" ref={formRef} className={styles.form}>
              <div className={formStyles.field}>
                <MdEditor
                  ref={editorRef}
                  modelValue={text}
                  onChange={setText}
                  language="zh-TW"
                  theme={theme}
                  showCodeRowNumber={true}
                  previewTheme="github"
                  placeholder="有趣的評論會讓我的文章更加精彩！"
                  formatCopiedText={formatCopiedText}
                  onUploadImg={onUploadImg}
                  style={{maxHeight: '15rem'}}
                  defToolbars={[
                    <Mark
                      key="mark-extension"
                      // title="標記"
                      trigger={<MdOutlineFormatColorText />}
                    />,
                    <Emoji
                      key="emoji-extension"
                      // title="表情符號"
                      trigger={<BsEmojiSmileFill />}
                    />,
                    <ExportPDF
                      key="ExportPDF"
                      // title="匯出 PDF"
                      modelValue={text}
                      height="700px"
                      trigger={<BsFillFileEarmarkPdfFill />}
                    />
                  ]}
                  toolbars={toolbar}
                />
                <div className={formStyles.description}>
                  <RiInformationFill />
                  <div className={formStyles.content}>
                    <p>Markdown 語法：<a className="link" href="https://imzbf.github.io/md-editor-rt/en-US/grammar" target="_blank">MdEditorRT Documentation</a></p>
                    <p>Katex 語法：<a className="link" href="https://katex.org/docs/supported.html" target="_blank">Supported Functions · KaTeX</a></p>
                    <details>
                      <summary>Alert 種類</summary>
                      <div className="detailContent">
                        <ul className={styles.alertTypeGrid}>
                          <li>note 筆記</li>
                          <li>abstract 摘要</li>
                          <li>info 資訊</li>
                          <li>tip 提示</li>
                          <li>success 成功</li>
                          <li>question 問題</li>
                          <li>warning 警告</li>
                          <li>failure 失敗</li>
                          <li>danger 危險</li>
                          <li>bug 漏洞</li>
                          <li>example 範例</li>
                          <li>quote 引用</li>
                          <li>hint 建議</li>
                          <li>caution 警告</li>
                          <li>error 錯誤</li>
                          <li>attention 注意</li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
              <div className={formStyles.actions}>
                <Button
                  color="primary"
                  content={btnDisabled ? "發佈中" : "發佈"}
                  onClick={handleComment}
                  disabled={btnDisabled}
                />
              </div>
            </form>
            {
              commentData.length > 0 ? commentData.map((floor) => {
                return (
                  <Floor
                    key={floor._id}
                    theme={theme}
                    userData={userData}
                    commentData={{...floor}}
                    title={title}
                    publisher={publisher}
                    handleFetchComment={handleFetchComment}
                  />
                );
              }) : (
                <DataStatus
                  content={<p>還沒有留言喔！你要當第一個嗎？</p>}
                  type="empty"
                  color="secondary"
                />
              )
            }
          </>
        )
      }
    </div>
  )
}
