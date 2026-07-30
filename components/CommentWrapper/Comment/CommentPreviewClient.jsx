'use client';

import { useEffect } from 'react';
import { MdPreview, config } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
import MarkExtension from 'markdown-it-mark';
import markdownItImplicitFigures from 'markdown-it-implicit-figures';

let configured = false;

export default function CommentPreviewClient({
  value,
  theme,
  formatCopiedText,
}) {
  useEffect(() => {
    if (configured) return;
    configured = true;

    config({
      editorConfig: {
        languageUserDefined: { 'zh-TW': ZH_TW },
      },
      markdownItConfig(md) {
        md.use(MarkExtension).use(markdownItImplicitFigures, {
          figcaption: true,
          keepAlt: true,
          lazyLoading: true,
        });

        const scrollTable = require('markdown-it-scrolltable');
        md.use(scrollTable);
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
