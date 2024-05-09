'use client';
import { useRef } from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import moment from 'moment';
import 'moment/locale/zh-tw';
import { MdPreview, config } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';
import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
import MarkExtension from 'markdown-it-mark';
import markdownItImplicitFigures from 'markdown-it-implicit-figures';
import markdownItScrollTable from 'markdown-it-scrolltable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import styles from './index.module.css';

config({
  editorConfig: {
    languageUserDefined: {
      'zh-TW': ZH_TW
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

  const deleteToast = useRef(null);

  const handleDeleteComment = () => {
    deleteToast.current = toast.loading('留言刪除中', {...defaultProps});
    axios
      .delete(
        `${process.env.baseUrl}/api/blog/comment/${commentData._id}`,
        {
          headers: {
            Authorization: userData.token,
          }
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.update(deleteToast.current, { render: res.data.message, type: "success", isLoading: false, ...defaultProps });
          handleFetchComment();
          return;
        } else {
          toast.update(deleteToast.current, { render: res.data.message, type: "error", isLoading: false, ...defaultProps });
          return;
        }
      })
      .catch((error) => {
        toast.update(deleteToast.current, { render: error, type: "error", isLoading: false, ...defaultProps });
        return;
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <div className={styles.avatar}>
          <Image
            src={`${process.env.baseUrl}${commentData.user.avatar}`}
            alt={commentData.user.nickname}
            width={80}
            height={80}
            priority
          />
        </div>
        <span className={styles.nickname}>{commentData.user.nickname}</span>
        {
          commentData.user.username === "canis22788" && (
            <span className={styles.badge}>作者</span>
          )
        }
      </div>
      <div className={styles.content}>
        <MdPreview
          modelValue={commentData.content}
          theme={theme}
          showCodeRowNumber={true}
          previewTheme="github"
          formatCopiedText={formatCopiedText}
          language="zh-TW"
        />
      </div>
      <div className={styles.info}>
        <Button
          isTextType={true}
          tippy="點擊回覆此留言"
          onClick={handleReplyEditorToggle}
          className={styles.replyBtn}
          desktop={true}
        >
          回覆
        </Button>
        <Button
          isTextType={true}
          onClick={handleReplyEditorToggle}
          className={styles.replyBtn}
          mobile={true}
        >
          回覆
        </Button>
        {
          userData.username === commentData.user.username && (
            <>
              <div className={styles.separator}></div>
              <Button
                isTextType={true}
                tippy="點擊刪除此留言"
                onClick={handleDeleteComment}
                className={styles.replyBtn}
              >
                刪除
              </Button>
            </>
          )
        }
        <div className={styles.separator}></div>
        <Tippy
          content={moment(commentData.datetime).format('YYYY-MM-DD HH:mm:ss')}
          placement="auto"
        >
          <span className={styles.time}>{moment(commentData.datetime).fromNow()}</span>
        </Tippy>
        {
          replys > 0 && handleReplyToggle && (
            <>
              <div className={styles.separator}></div>
              <Button
                isTextType={true}
                tippy="點擊查看回覆"
                onClick={handleReplyToggle}
                className={styles.replyBtn}
                mono={true}
                desktop={true}
              >
                {new Intl.NumberFormat().format(replys)} 則回覆
              </Button>
              <Button
                isTextType={true}
                onClick={handleReplyToggle}
                className={styles.replyBtn}
                mono={true}
                mobile={true}
              >
                {new Intl.NumberFormat().format(replys)} 則回覆
              </Button>
            </>
          )
        }
      </div>
    </div>
  );
}