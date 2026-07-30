function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildTocHtml(items) {
  if (!items || !items.length) return `<nav class="md-toc"></nav>`;

  const min = Math.min(...items.map((x) => x.level));
  let html = `<nav class="md-toc">`;
  let current = min - 1;

  for (const it of items) {
    const lvl = it.level;
    const title = escapeHtml(it.title);
    const id = escapeHtml(it.id);

    while (current < lvl) {
      html += `<ul class="md-toc__list">`;
      current++;
    }
    while (current > lvl) {
      html += `</ul>`;
      current--;
    }

    html += `<li class="md-toc__item md-toc__lvl-${lvl}"><a class="md-toc__link" href="#${id}">${title}</a></li>`;
  }

  while (current >= min) {
    html += `</ul>`;
    current--;
  }

  html += `</nav>`;
  return html;
}

/**
 * 把 Markdown 裡的 [[toc]]（或 @[toc]）替換成目錄 HTML
 * @param {import('markdown-it')} md
 * @param {{ marker?: string|RegExp }} [opts]
 */
export function markdownItInjectToc(md, opts) {
  const marker = (opts && opts.marker) || /^\s*(\[\[toc\]\]|\@\[(toc)\])\s*$/i;

  md.core.ruler.push('inject_toc', (state) => {
    state.env = state.env || {};
    const toc = state.env.toc || [];
    const tokens = state.tokens || [];

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (!t || t.type !== 'inline') continue;

      const content = String(t.content || '').trim();
      const hit =
        marker instanceof RegExp ? marker.test(content) : content === marker;
      if (!hit) continue;

      const open = tokens[i - 1];
      const close = tokens[i + 1];
      if (!open || !close) continue;
      if (open.type !== 'paragraph_open' || close.type !== 'paragraph_close')
        continue;

      const html = buildTocHtml(toc);

      const htmlToken = new state.Token('html_block', '', 0);
      htmlToken.content = html + '\n';

      tokens.splice(i - 1, 3, htmlToken);
      i--;
    }
  });
}
