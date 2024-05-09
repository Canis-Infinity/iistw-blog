'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
import { Emoji, Mark, ExportPDF } from '@vavt/rt-extension';
import MarkExtension from 'markdown-it-mark';
import markdownItImplicitFigures from 'markdown-it-implicit-figures';
import markdownItScrollTable from 'markdown-it-scrolltable';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItToc from 'markdown-it-table-of-contents';
import markdwonItAnchor from 'markdown-it-anchor';
import markdownItAbbr from 'markdown-it-abbr';
import markdownItNamedCodeBlocks from 'markdown-it-named-code-blocks';
import markdownItKbd from '@gerhobbelt/markdown-it-kbd';
import hightlightLines from '@/utils/hightlightLines';
import screenfull from 'screenfull';
import UnAuth from '@/components/UnAuth';
import Modal from '@/components/Modal';
import DataStatus from '@/components/DataStatus';
import Button from '@/components/Button';
import CoverUpload from '@/components/CoverUpload';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Tags from '@yaireo/tagify/dist/react.tagify';
import '@yaireo/tagify/dist/tagify.css';
import { useDebouncedCallback } from 'use-debounce';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { MdOutlineFormatColorText } from 'react-icons/md';
import { BsEmojiSmileFill, BsFillFileEarmarkPdfFill } from 'react-icons/bs';
import { RiInformationFill } from 'react-icons/ri';
import { SiCodesandbox } from 'react-icons/si';
import { TbArticle } from 'react-icons/tb';
import pageStyles from '@/styles/page.module.css';
import formStyles from '@/styles/form.module.css';
import styles from './index.module.css';
import { getToken } from '@/utils/getToken';

config({
  editorConfig: {
    languageUserDefined: {
      'zh-TW': ZH_TW,
    },
  },
  editorExtensions: {
    screenfull: {
      instance: screenfull,
    },
  },
  markdownItConfig(md) {
    md.use(MarkExtension)
    .use(hightlightLines)
      .use(markdownItImplicitFigures, {
        figcaption: true,
        keepAlt: true,
        lazyLoading: true,
      })
      .use(markdownItScrollTable)
      .use(markdownItFootnote)
      .use(markdownItToc, {
        includeLevel: [1, 2, 3],
        markerPattern: /^\[toc\]/im,
      })
      .use(markdwonItAnchor, {})
      .use(markdownItAbbr)
      .use(markdownItNamedCodeBlocks)
      .use(markdownItKbd);
  },
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
  'github',
];

export default function Publish({ params }) {
  const { id } = params;
  const router = useRouter();

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
              },
            })
            .then((res) => rev(res))
            .catch((error) => rej(error));
        });
      })
    );

    callback(res.map((item) => item.data.url));
  };

  const formRef = useRef(null);

  const [articleData, setArticleData] = useState({});

  const coverRef = useRef(null);
  const [oldCover, setOldCover] = useState('');
  const [cover, setCover] = useState([]);

  const handleCoverUpload = (event) => {
    setCover(event.target.files);
  };

  const [text, setText] = useState('');

  const editorRef = useRef(null);

  const handleEditorPreview = useCallback(() => {
    if (mounted) {
      const viewport = window.innerWidth;
      editorRef.current?.togglePreview(viewport <= 760 ? false : true);
    }
  }, [mounted, editorRef]);

  const handleEditorPreviewDebounce = useDebouncedCallback(
    handleEditorPreview,
    500
  );

  useEffect(() => {
    handleEditorPreview();
  }, [handleEditorPreview]);

  useEffect(() => {
    window.addEventListener('resize', handleEditorPreviewDebounce);

    return () => {
      window.removeEventListener('resize', handleEditorPreviewDebounce);
    };
  });

  const tagifyRef = useRef(null);

  const [whitelist, setWhitelist] = useState([
    '網站開發',
    '學習',
    '前端',
    '入門',
    '後端',
    '技巧',
    '性能優化',
    'HTML',
    'CSS',
    'JavaScript',
    'React.js',
    'Next.js',
    'Vue.js',
    'Nuxt.js',
    'Node.js',
    'Express.js',
    'jQuery',
    'PHP',
    'MySQL',
    'MongoDB',
    'UI/UX',
    'Illustrator',
    'Photoshop',
  ]);

  const tagifyDefaultSettings = {
    blacklist: [],
    dropdown: {
      enabled: 0,
      maxItems: 20,
      highlightFirst: true,
    },
  };

  const handleFetch = useCallback(() => {
    axios
      .get(`${process.env.baseUrl}/api/blog/${id}`)
      .then((res) => {
        // console.log(res)
        const { message, data } = res.data;
        if (res.status === 200) {
          const { title, intro, body, tags, cover, isDraft, postDirections } = data;
          setOldCover(cover);
          setText(body);
          setArticleData({ title, intro, body, tags, cover, isDraft, postDirections });
          const temp = JSON.parse(tags);
          temp.forEach((item) => {
            tagifyRef.current.addTags(item);
          });
          return;
        } else {
          console.log(message);
          toast.error(message, { ...defaultProps });
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const submitPublishToast = useRef(null);

  const handleSubmitEdit = (event) => {
    event.preventDefault();
    submitPublishToast.current = toast.loading('更新部落格中', {
      ...defaultProps,
    });
    const formData = new FormData(formRef.current);
    formData.append('body', text);
    formData.append('tags', JSON.stringify(tagifyRef.current.value));
    formData.append('isDraft', false);
    formData.append('publisher', userData.username);
    formData.append('oldCover', oldCover);
    const data = Object.fromEntries(formData);
    // console.log(data);
    if (!data.title) {
      toast.update(submitPublishToast.current, {
        render: '標題不能為空',
        type: 'error',
        isLoading: false,
        ...defaultProps,
      });
      return;
    }
    if (!data.intro) {
      toast.update(submitPublishToast.current, {
        render: '簡短介紹不能為空',
        type: 'error',
        isLoading: false,
        ...defaultProps,
      });
      return;
    }
    if (!data.body) {
      toast.update(submitPublishToast.current, {
        render: '內文不能為空',
        type: 'error',
        isLoading: false,
        ...defaultProps,
      });
      return;
    }
    axios
      .patch(`${process.env.baseUrl}/api/blog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: userData.token,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.update(submitPublishToast.current, {
            render: `${res.data.message}，將自動導向至部落格列表頁面`,
            type: 'success',
            isLoading: false,
            ...defaultProps,
          });
          setTimeout(() => {
            router.replace('/dashboard/blogs?type=published');
          }, 3000);
        } else {
          toast.update(submitPublishToast.current, {
            render: res.data.message,
            type: 'error',
            isLoading: false,
            ...defaultProps,
          });
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        toast.update(submitPublishToast.current, {
          render: error,
          type: 'error',
          isLoading: false,
          ...defaultProps,
        });
        return;
      });
  };

  const submitDraftToast = useRef(null);

  const handleSubmitDraft = (event) => {
    event.preventDefault();
    submitDraftToast.current = toast.loading('更新部落格草稿中', {
      ...defaultProps,
    });
    const formData = new FormData(formRef.current);
    formData.append('body', text);
    formData.append('tags', JSON.stringify(tagifyRef.current.value));
    formData.append('isDraft', true);
    formData.append('publisher', userData.username);
    formData.append('oldCover', oldCover);
    const data = Object.fromEntries(formData);
    // console.log(data);
    if (!data.title) {
      toast.update(submitDraftToast.current, {
        render: '標題不能為空',
        type: 'error',
        isLoading: false,
        ...defaultProps,
      });
      return;
    }
    axios
      .patch(`${process.env.baseUrl}/api/blog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: userData.token,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.update(submitDraftToast.current, {
            render: `${res.data.message}，將自動導向至部落格列表頁面`,
            type: 'success',
            isLoading: false,
            ...defaultProps,
          });
          setTimeout(() => {
            router.replace('/dashboard/blogs?type=draft');
          }, 3000);
        } else {
          toast.update(submitDraftToast.current, {
            render: res.data.message,
            type: 'error',
            isLoading: false,
            ...defaultProps,
          });
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        toast.update(submitDraftToast.current, {
          render: error,
          type: 'error',
          isLoading: false,
          ...defaultProps,
        });
        return;
      });
  };

  const handleReset = () => {
    // tagifyRef.current && tagifyRef.current.removeAllTags();
    const temp = JSON.parse(articleData.tags);
    temp.forEach((item) => {
      tagifyRef.current.addTags(item);
    });
    setCover([]);
  };

  const [csbModalVisible, setCsbModalVisible] = useState(false);

  const handleCSBSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const csbURL = formData.get('csbURL');
    if (!csbURL) {
      toast.error('連結不能為空', { ...defaultProps });
      return;
    }
    handleSnippet('csb', { url: csbURL });
    setCsbModalVisible(false);
  };

  const [embedCardModalVisible, setEmbedCardModalVisible] = useState(false);

  const handleEmbedCardSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const ecTitle = formData.get('ecTitle');
    const ecURL = formData.get('ecURL');
    if (!ecTitle) {
      toast.error('標題不能為空', { ...defaultProps });
      return;
    }
    if (!ecURL) {
      toast.error('連結不能為空', { ...defaultProps });
      return;
    }
    handleSnippet('ec', { title: ecTitle, url: ecURL });
    setEmbedCardModalVisible(false);
  };

  const handleSnippet = (type, obj) => {
    if (type === 'csb') {
      navigator.clipboard.writeText(
        `<a target="_blank" href="${obj?.url}" class="csb"></a>`
      );
      toast.success('已複製 CodeSandbox 按鈕', { ...defaultProps });
    } else if (type === 'ec') {
      navigator.clipboard.writeText(
        `<a target="_blank" href="${obj?.url}" class="embedCard">
  <div class="icon">
  <i class="ri-landscape-line ri-fw"></i>
  </div>
  <div class="info">
    <h4 class="title">${obj?.title}</h4>
    <div class="link">${obj?.url}</div>
  </div>
  <div class="icon secondary">
    <i class="ri-share-circle-line ri-fw"></i>
  </div>
</a>`
      );
      toast.success('已複製引文連結按鈕', { ...defaultProps });
    }
  };

  return (
    <>
      {userData?.role === undefined ? (
        <main className={pageStyles.wrapper}>
          <DataStatus type="loading" content="頁面載入中" />
        </main>
      ) : !['admin'].includes(userData?.role) ? (
        <main className={pageStyles.wrapper}>
          <UnAuth />
        </main>
      ) : (
        <main className={pageStyles.wrapper}>
          <form method="post" action="" ref={formRef} className={styles.form}>
            <CoverUpload
              name="cover"
              id="cover"
              cover={cover}
              original={`${process.env.baseUrl}${oldCover}`}
              upload={handleCoverUpload}
              coverRef={coverRef}
            />
            <div className={formStyles.field}>
              <div className={formStyles.fieldTitle}>標題</div>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="為此篇文章取一個標題吧！"
                size="large"
                flex={true}
                defaultValue={articleData.title}
              />
            </div>
            <div className={formStyles.field}>
              <div className={formStyles.fieldTitle}>簡短介紹</div>
              <Textarea
                name="intro"
                id="intro"
                placeholder="為此篇文章寫一個吸引人的簡短介紹吧！"
                flex={true}
                rows={3}
                defaultValue={articleData.intro}
              />
            </div>
            <div className={formStyles.field}>
              <div className={formStyles.fieldTitle}>內文</div>
              {mounted && (
                <MdEditor
                  ref={editorRef}
                  modelValue={text || articleData.body}
                  onChange={setText}
                  language="zh-TW"
                  theme={theme}
                  showCodeRowNumber={true}
                  previewTheme="github"
                  placeholder="請在此輸入內文"
                  formatCopiedText={formatCopiedText}
                  onUploadImg={onUploadImg}
                  defToolbars={[
                    <Mark
                      key="mark-extension"
                      trigger={<MdOutlineFormatColorText />}
                    />,
                    <Emoji
                      key="emoji-extension"
                      trigger={<BsEmojiSmileFill />}
                    />,
                    <ExportPDF
                      key="ExportPDF"
                      modelValue={text}
                      height="700px"
                      trigger={<BsFillFileEarmarkPdfFill />}
                    />,
                  ]}
                  toolbars={toolbar}
                />
              )}
              <div className={styles.snippets}>
                <Button
                  color="secondary4"
                  icon={<SiCodesandbox />}
                  content="CodeSandbox 按鈕"
                  onClick={() => {
                    setCsbModalVisible(true);
                  }}
                />
                <Button
                  color="secondary4"
                  icon={<TbArticle />}
                  content="引文連結按鈕"
                  onClick={() => {
                    setEmbedCardModalVisible(true);
                  }}
                />
              </div>
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
            <div className={formStyles.field}>
              <div className={formStyles.fieldTitle}>標籤</div>
              <Tags
                tagifyRef={tagifyRef}
                defaultValue=""
                settings={tagifyDefaultSettings}
                whitelist={whitelist}
              />
              <div className={formStyles.description}>
                <RiInformationFill />
                <div className={formStyles.content}>
                  <p>按 Enter 新增標籤，雙擊標籤以編輯。</p>
                </div>
              </div>
            </div>
            <div className={formStyles.field}>
              <div className={formStyles.fieldTitle}>上一篇</div>
              {/* <Input
                type="text"
                name="prevTitle"
                id="prevTitle"
                placeholder="上一篇標題"
                size="large"
                flex={true}
                defaultValue={articleData.postDirections?.prev.title}
              /> */}
              <Input
                type="url"
                name="prevUrl"
                id="prevUrl"
                placeholder="https://example.com/"
                size="large"
                flex={true}
                defaultValue={articleData.postDirections?.prev.url}
              />
            </div>
            <div className={formStyles.field}>
              <div className={formStyles.fieldTitle}>下一篇</div>
              {/* <Input
                type="text"
                name="nextTitle"
                id="nextTitle"
                placeholder="下一篇標題"
                size="large"
                flex={true}
                defaultValue={articleData.postDirections?.next.title}
              /> */}
              <Input
                type="url"
                name="nextUrl"
                id="nextUrl"
                placeholder="https://example.com/"
                size="large"
                flex={true}
                defaultValue={articleData.postDirections?.next.url}
              />
            </div>
            <div className={formStyles.actions}>
              <Button
                color="primary"
                content={articleData.isDraft ? '發佈' : '更新'}
                onClick={handleSubmitEdit}
              />
              {articleData.isDraft && (
                <Button
                  color="secondary4"
                  content="更新"
                  onClick={handleSubmitDraft}
                />
              )}
              <Button
                color="secondary2"
                content="重設"
                type="reset"
                onClick={handleReset}
              />
            </div>
          </form>
        </main>
      )}
      {csbModalVisible &&
        createPortal(
          <Modal
            title="CodeSandbox 按鈕連結"
            size="small"
            close={() => {
              setCsbModalVisible(false);
            }}
            form="post"
            submit={handleCSBSubmit}
          >
            <div className={formStyles.field}>
              <Input
                type="url"
                name="csbURL"
                id="csbURL"
                placeholder="https://"
                size="large"
                flex={true}
                color="third"
              />
            </div>
            <div className={formStyles.actions}>
              <Button color="primary" content="確認" type="submit" />
              <Button
                color="secondary"
                content="關閉"
                onClick={() => {
                  setCsbModalVisible(false);
                }}
              />
            </div>
          </Modal>,
          document.body
        )}
      {embedCardModalVisible &&
        createPortal(
          <Modal
            title="引文連結按鈕"
            size="small"
            close={() => {
              setEmbedCardModalVisible(false);
            }}
            form="post"
            submit={handleEmbedCardSubmit}
          >
            <div className={formStyles.field}>
              <Input
                type="text"
                name="ecTitle"
                id="ecTitle"
                placeholder="標題"
                size="large"
                flex={true}
                color="third"
              />
            </div>
            <div className={formStyles.field}>
              <Input
                type="url"
                name="ecURL"
                id="ecURL"
                placeholder="https://"
                size="large"
                flex={true}
                color="third"
              />
            </div>
            <div className={formStyles.actions}>
              <Button color="primary" content="確認" type="submit" />
              <Button
                color="secondary"
                content="關閉"
                onClick={() => {
                  setEmbedCardModalVisible(false);
                }}
              />
            </div>
          </Modal>,
          document.body
        )}
    </>
  );
}
