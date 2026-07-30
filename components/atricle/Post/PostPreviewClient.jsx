'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { config } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
import MarkExtension from 'markdown-it-mark';
import markdownItImplicitFigures from 'markdown-it-implicit-figures';
import markdownItFootnote from 'markdown-it-footnote';
// import markdownItToc from 'markdown-it-table-of-contents';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAbbr from 'markdown-it-abbr';
import markdownItNamedCodeBlocks from 'markdown-it-named-code-blocks';
import markdownItKbd from '@gerhobbelt/markdown-it-kbd';
import hightlightLines from '@/utils/hightlightLines';

import { markdownItCollectToc } from '@/lib/markdownItCollectToc';
import { markdownItInjectToc } from '@/lib/markdownItInjectToc';

const MdPreview = dynamic(
  () => import('md-editor-rt').then((m) => m.MdPreview),
  { ssr: false }
);

let configured = false;

const formatCopiedText = (text) =>
  `${text}\n\n- 來源：Infinity 資訊部落格（https://blog.iistw.com/）`;

export default function PostPreviewClient({ value = '', theme = 'light' }) {
  useEffect(() => {
    if (configured) return;
    configured = true;

    config({
      editorConfig: {
        languageUserDefined: { 'zh-TW': ZH_TW },
      },
      markdownItConfig(md) {
        md.use(MarkExtension)
          .use(hightlightLines)
          .use(markdownItImplicitFigures, {
            figcaption: true,
            keepAlt: true,
            lazyLoading: true,
          })
          .use(require('markdown-it-scrolltable'))
          .use(markdownItAnchor, {
            slugify: (s) =>
              s
                .trim()
                .toLowerCase()
                .replace(/[\s]+/g, '-')
                .replace(/[^\w\u4e00-\u9fff-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, ''),
          })
          .use(markdownItCollectToc, { includeLevel: [1, 2, 3] })
          .use(markdownItInjectToc)
          .use(markdownItFootnote)
          .use(markdownItAbbr)
          .use(markdownItNamedCodeBlocks)
          .use(markdownItKbd);
      },
    });
  }, []);

  return (
    <MdPreview
      value={value}
      theme={theme}
      showCodeRowNumber
      previewTheme="github"
      formatCopiedText={formatCopiedText}
      language="zh-TW"
    />
  );
}
