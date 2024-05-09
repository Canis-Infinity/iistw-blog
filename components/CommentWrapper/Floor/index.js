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
import Comment from '@/components/CommentWrapper/Comment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { MdOutlineFormatColorText } from 'react-icons/md';
import { BsEmojiSmileFill, BsFillFileEarmarkPdfFill } from 'react-icons/bs';
import formStyles from '@/styles/form.module.css';
import styles from './index.module.css';

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

export default function Floor({
  userData,
  theme,
  commentData,
  title,
  publisher,
  handleFetchComment,
}) {
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

  const [replyVisible, setReplyVisible] = useState(false);

  const handleReplyToggle = (status) => {
    setReplyVisible(status ? status : !replyVisible);
  };

  const [replyEditorVisible, setReplyEditorVisible] = useState(false);

  const handleReplyEditorToggle = () => {
    setReplyEditorVisible(!replyEditorVisible);
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
  }, [handleEditorPreview, replyEditorVisible]);

  const [btnDisabled, setBtnDisabled] = useState(false);

  const submitReplyToast = useRef(null);

  const handleReply = (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    submitReplyToast.current = toast.loading('新增留言中', {...defaultProps});
    const formData = new FormData(formRef.current);
    formData.append('articleId', commentData.articleId);
    formData.append('replyId', commentData._id);
    formData.append('title', title);
    formData.append('content', text);
    formData.append('publisher', publisher);
    const data = Object.fromEntries(formData);
    axios
      .post(`${process.env.baseUrl}/api/blog/comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: userData.token,
        }
      })
      .then((res) => {
        if (res.status === 200) {
          toast.update(submitReplyToast.current, { render: res.data.message, type: "success", isLoading: false, ...defaultProps });
          setText('');
          handleFetchComment();
          handleReplyToggle(true);
          return;
        } else {
          toast.update(submitReplyToast.current, { render: res.data.message, type: "error", isLoading: false, ...defaultProps });
          return;
        }
      })
      .catch((error) => {
        toast.update(submitReplyToast.current, { render: error, type: "error", isLoading: false, ...defaultProps });
        console.log(error);
      });
    setBtnDisabled(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.comment}>
        <Comment userData={userData} commentData={commentData} theme={theme} handleReplyEditorToggle={handleReplyEditorToggle} handleReplyToggle={handleReplyToggle} handleFetchComment={handleFetchComment} replys={commentData.reply?.length ? commentData.reply?.length : 0} />
      </div>
      {
        replyVisible && commentData.reply.length > 0 ? (
          <div className={styles.comment} style={{paddingLeft: '3rem'}}>
            {
              commentData.reply.map((item, index) => {
                return (
                  <Comment key={index} userData={userData} commentData={item} theme={theme} handleReplyToggle={handleReplyToggle} handleFetchComment={handleFetchComment} />
                );
              })
            }
          </div>
        ) : null
      }
      {
        replyEditorVisible && (
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
                style={{maxHeight: '12rem'}}
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
            </div>
            <div className={formStyles.actions}>
              <Button
                color="primary"
                content={btnDisabled ? "回覆中" : "回覆"}
                size="large"
                width="relaxed"
                onClick={handleReply}
                disabled={btnDisabled}
              />
            </div>
          </form>
        )
      }
    </div>
  );
}