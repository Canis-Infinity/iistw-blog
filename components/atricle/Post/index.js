'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Loading from '@/components/atricle/Loading';
import clsx from 'clsx';
import styles from './index.module.css';
import { MdPreview, config } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';
import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
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
import moment from 'moment';
import { MdRemoveRedEye } from 'react-icons/md';

config({
  editorConfig: {
    languageUserDefined: {
      'zh-TW': ZH_TW
    }
  },
  markdownItConfig(md) {
    md
      .use(MarkExtension)
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
      .use(markdownItAttrs)
      .use(markdwonItAnchor, {})
      .use(markdownItAbbr)
      .use(markdownItNamedCodeBlocks)
      .use(markdownItKbd);
  }
});

const formatCopiedText = (text) => {
  return `${text}\n\n- 來源：Infinity 資訊部落格（https://blog.iistw.com/）`;
};

export default function Post({ articleId, data, theme }) {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    const handleCopy = (event) => {
      if (!event.clipboardData) return;
      const codeElemets = document.querySelectorAll('code');
      if (codeElemets.length === 0) return;
      let isInCode = false;
      codeElemets.forEach((codeElement) => {
        if (codeElement.contains(event.target)) return isInCode = true;
      });
      if (!isInCode) return;
      event.preventDefault();
      const selection = document.getSelection();
      const modifiedSelection = selection + '\n\n- 來源：Infinity 資訊部落格（https://blog.iistw.com/）';
      event.clipboardData.setData("text/plain", modifiedSelection);
    };

    document.addEventListener('copy', handleCopy);
    return () => {
      document.removeEventListener('copy', handleCopy);
    }
  }, []);

  useEffect(() => {
    const handleIncreaseViews = () => {
      const formData = new FormData();
      formData.append('id', articleId);
      axios
        .post(`${process.env.baseUrl}/api/blog/views`, formData)
        .then((res) => {
          const { message, data } = res.data;
          if (res.status === 200) {
            setArticle((prevArticle) => {
              return {
                ...prevArticle,
                views: data,
              };
            });
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
    };
    if (!data.isDraft) {
      handleIncreaseViews();
    }
  }, [articleId, data?.isDraft]);

  return (
    <>
      <div className={styles.cover} style={data.cover ? {} : {opacity: '0.5'}}>
        {loading && <Loading />}
        <Image
          src={data.cover ? `${process.env.baseUrl}${data.cover}` : `${process.env.baseUrl}/blogs/image.png`}
          alt="cover"
          width={960}
          height={480}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onLoad={handleImageLoad}
          priority
        />
      </div>
      <h1>{data.title}</h1>
      <div className={styles.body}>
        <MdPreview
          modelValue={data.body}
          theme={theme}
          showCodeRowNumber={true}
          previewTheme="github"
          formatCopiedText={formatCopiedText}
          language="zh-TW"
        />
      </div>
      <div className={styles.info}>
        <div className={styles.tags}>
          <span className={clsx(styles.tag, styles.views)}><MdRemoveRedEye />{new Intl.NumberFormat().format(data.views)}</span>
          {
            JSON.parse(data.tags)?.map((tag, index) => {
              return <span key={index} className={styles.tag}>{tag}</span>
            })
          }
        </div>
        <div className={styles.times}>
          <span className={styles.datetime}>創建於 {moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
          {data.updatedAt && <span className={styles.datetime}>更新於 {moment(data.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>}
        </div>
      </div>
    </>
  );
}