'use client';

import { useEffect, useRef } from 'react';

import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
import { Emoji, Mark, ExportPDF } from '@vavt/rt-extension';

import MarkExtension from 'markdown-it-mark';
import markdownItImplicitFigures from 'markdown-it-implicit-figures';
import screenfull from 'screenfull';

import { MdOutlineFormatColorText } from 'react-icons/md';
import { BsEmojiSmileFill, BsFillFileEarmarkPdfFill } from 'react-icons/bs';

let configured = false;

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
  'github',
];

export default function FloorEditorClient({
  theme,
  text,
  setText,
  onUploadImg,
  formatCopiedText,
  editorRef,
}) {
  const innerRef = useRef(null);

  useEffect(() => {
    if (configured) return;
    configured = true;

    config({
      editorConfig: {
        languageUserDefined: { 'zh-TW': ZH_TW },
      },
      editorExtensions: {
        screenfull: { instance: screenfull },
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

  useEffect(() => {
    const target = editorRef ?? innerRef;
    target.current?.togglePreview(false);
  }, [editorRef]);

  return (
    <MdEditor
      ref={editorRef ?? innerRef}
      value={text}
      onChange={setText}
      language="zh-TW"
      theme={theme}
      showCodeRowNumber
      previewTheme="github"
      placeholder="有趣的評論會讓我的文章更加精彩！"
      formatCopiedText={formatCopiedText}
      onUploadImg={onUploadImg}
      style={{ maxHeight: '12rem' }}
      defToolbars={[
        <Mark key="mark-extension" trigger={<MdOutlineFormatColorText />} />,
        <Emoji key="emoji-extension" trigger={<BsEmojiSmileFill />} />,
        <ExportPDF
          key="ExportPDF"
          value={text}
          height="700px"
          trigger={<BsFillFileEarmarkPdfFill />}
        />,
      ]}
      toolbars={toolbar}
    />
  );
}
