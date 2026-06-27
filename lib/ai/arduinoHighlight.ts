const KEYWORDS = new Set([
  "void",
  "int",
  "float",
  "double",
  "char",
  "long",
  "boolean",
  "byte",
  "if",
  "else",
  "for",
  "while",
  "return",
  "true",
  "false",
  "const",
  "static",
  "include",
  "define",
  "setup",
  "loop",
  "pinMode",
  "digitalWrite",
  "digitalRead",
  "analogRead",
  "analogWrite",
  "Serial",
  "delay",
  "delayMicroseconds",
  "pulseIn",
  "HIGH",
  "LOW",
  "INPUT",
  "OUTPUT",
  "INPUT_PULLUP",
  "String",
  "class",
  "public",
  "private",
]);

const COMMENT = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
const STRING = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
const NUMBER = /\b\d+(?:\.\d+)?\b/g;
const WORD = /\b[A-Za-z_]\w*\b/g;

export function highlightArduinoCode(code: string): string {
  const tokens: { start: number; end: number; className: string }[] = [];

  const addMatches = (regex: RegExp, className: string) => {
    for (const match of code.matchAll(regex)) {
      if (match.index == null) continue;
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        className,
      });
    }
  };

  addMatches(COMMENT, "text-white/35 italic");
  addMatches(STRING, "text-emerald-300/90");
  addMatches(NUMBER, "text-amber-300/90");

  for (const match of code.matchAll(WORD)) {
    if (match.index == null) continue;
    const word = match[0];
    if (KEYWORDS.has(word)) {
      tokens.push({
        start: match.index,
        end: match.index + word.length,
        className: "text-sky-300/95",
      });
    }
  }

  tokens.sort((a, b) => a.start - b.start);

  let html = "";
  let cursor = 0;

  for (const token of tokens) {
    if (token.start < cursor) continue;
    html += escapeHtml(code.slice(cursor, token.start));
    html += `<span class="${token.className}">${escapeHtml(code.slice(token.start, token.end))}</span>`;
    cursor = token.end;
  }

  html += escapeHtml(code.slice(cursor));
  return html;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
