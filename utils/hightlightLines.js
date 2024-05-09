export default function hightlightLines(md) {
  const REG = /{([\d,-]+)}/;
  const FIRST_LINE_REG = /<pre><code[^>]*><span class="code-block">/;
  const LAST_LINE_REG = /<\/span><\/code><\/pre>/;
  let fence = md.renderer.rules.fence;

  md.renderer.rules.fence = function () {
    let args = [],
      len = arguments.length;
    while (len--) args[len] = arguments[len];

    let tokens = args[0];
    let idx = args[1];
    let options = args[2];
    let self = args[4];
    let token = tokens[idx];

    if (!token.info || !REG.test(token.info)) {
      return fence.apply(void 0, args);
    }

    let lineNumbers = REG.exec(token.info)[1]
      .split(',')
      .map(function (v) {
        return v.split('-').map(function (v) {
          return parseInt(v, 10);
        });
      });
    let langName = token.info.replace(REG, '').trim();
    let code = options.highlight
      ? options.highlight(token.content, langName)
      : token.content;
    let splitArr = code.split('\n');
    let codeSplits = splitArr.map(function (split, index) {
      let lineNumber = index + 1;
      let inRange = lineNumbers.some(function (ref) {
        let start = ref[0];
        let end = ref[1];

        if (start && end) {
          return lineNumber >= start && lineNumber <= end;
        }

        return lineNumber === start;
      });

      if (inRange) {
        if (index === 0) {
          let matcheCode = split.match(FIRST_LINE_REG);
          return {
            code: `${matcheCode}<div class="highlighted-line">${split.replace(matcheCode, '')}</div>\n`,
            highlighted: true,
          };
        } else if (index === splitArr.length - 1) {
          let matcheCode = split.match(LAST_LINE_REG);
          return {
            code: `<div class="highlighted-line">${split.replace(matcheCode, '')}</div>${matcheCode}\n`,
            highlighted: true,
          };
        }
        return {
          code: `<div class="highlighted-line">${split}</div>\n`,
          highlighted: true,
        };
      }

      return {
        code: split,
      };
    });
    let highlightedCode = '';
    codeSplits.forEach(function (split, index) {
      console.log(index, split);
      if (split.highlighted) {
        highlightedCode += split.code;
      } else {
        highlightedCode += split.code + '\n';
      }
    });

    console.log('highlightedCode:', highlightedCode);

    if (highlightedCode.startsWith('<pre')) {
      return highlightedCode;
    }
    return highlightedCode.trim();
  };
}