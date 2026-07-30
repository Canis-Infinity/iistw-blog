function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 收集 heading 成 env.toc，並把 id 寫回 heading token
 * @param {import('markdown-it')} md
 * @param {{ includeLevel?: number[], idPrefix?: string }} [opts]
 */
export function markdownItCollectToc(md, opts) {
  const include = (opts && opts.includeLevel) || [1, 2, 3];
  const idPrefix = (opts && opts.idPrefix) || '';
  const seen = new Map();

  md.core.ruler.push('collect_toc', (state) => {
    state.env = state.env || {};
    state.env.toc = [];

    for (let i = 0; i < state.tokens.length; i++) {
      const t = state.tokens[i];
      if (t.type !== 'heading_open') continue;

      const level = Number(String(t.tag || '').slice(1));
      if (!include.includes(level)) continue;

      const inline = state.tokens[i + 1];
      if (!inline || inline.type !== 'inline') continue;

      const title = String(inline.content || '').trim();
      if (!title) continue;

      const base = idPrefix + slugify(title);
      const count = (seen.get(base) || 0) + 1;
      seen.set(base, count);

      const id = count === 1 ? base : `${base}-${count}`;

      if (typeof t.attrSet === 'function') t.attrSet('id', id);

      state.env.toc.push({ level, id, title });
    }
  });
}
