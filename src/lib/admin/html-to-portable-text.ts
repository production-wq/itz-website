/**
 * Converts the constrained HTML the content-generation pipeline produces
 * (h2/h3/p, ul/ol/li, strong, a — see scripts/lib/content-gen.mjs's
 * systemPrompt, and content-schemas.mjs's POST_SCHEMA) into Sanity's
 * Portable Text block array, for the "Generate with AI" Studio action to
 * drop straight into a post's `body` field.
 *
 * The exact inverse of portableTextToHtml() in scripts/sync-sanity-posts.mjs
 * — that one reads Portable Text back out as HTML once a post is synced from
 * Sanity. Between the two, a post can round-trip through either direction
 * without losing structure.
 *
 * Deliberately NOT a general HTML parser: the input is always model output
 * matching the constrained tag set above, never arbitrary markup.
 */

export type PortableTextSpan = {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
};

export type PortableTextMarkDef = {
  _key: string;
  _type: 'link';
  href: string;
};

export type PortableTextBlock = {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h2' | 'h3';
  listItem?: 'bullet' | 'number';
  children: PortableTextSpan[];
  markDefs: PortableTextMarkDef[];
};

let keyCounter = 0;
const nextKey = () => `k${(keyCounter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const decodeEntities = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

/** Parses the inline content of one block (text, <strong>, <a href="…">) into spans + markDefs. */
function parseInline(html: string): { children: PortableTextSpan[]; markDefs: PortableTextMarkDef[] } {
  const children: PortableTextSpan[] = [];
  const markDefs: PortableTextMarkDef[] = [];

  // Stack of active mark names for the text currently being accumulated.
  let marks: string[] = [];
  let cursor = 0;
  const tag = /<(\/?)(strong|a)(?:\s+href="([^"]*)")?\s*>/gi;
  let match: RegExpExecArray | null;

  const pushText = (raw: string) => {
    const text = decodeEntities(raw);
    if (!text) return;
    children.push({ _type: 'span', _key: nextKey(), text, marks: [...marks] });
  };

  // href of the currently-open link, so its close tag knows which markDef to reference.
  const linkStack: string[] = [];

  while ((match = tag.exec(html))) {
    pushText(html.slice(cursor, match.index));
    cursor = tag.lastIndex;

    const [, closing, name, href] = match;
    if (name.toLowerCase() === 'strong') {
      marks = closing ? marks.filter((m) => m !== 'strong') : [...marks, 'strong'];
      continue;
    }
    // anchor
    if (closing) {
      const key = linkStack.pop();
      if (key) marks = marks.filter((m) => m !== key);
    } else {
      const key = nextKey();
      markDefs.push({ _key: key, _type: 'link', href: href ?? '' });
      linkStack.push(key);
      marks = [...marks, key];
    }
  }
  pushText(html.slice(cursor));

  // A block with no inline tags at all still needs one plain span.
  if (children.length === 0) children.push({ _type: 'span', _key: nextKey(), text: '', marks: [] });

  return { children, markDefs };
}

function block(style: PortableTextBlock['style'], inner: string, listItem?: PortableTextBlock['listItem']) {
  const { children, markDefs } = parseInline(inner);
  return { _type: 'block' as const, _key: nextKey(), style, ...(listItem ? { listItem } : {}), children, markDefs };
}

/** HTML fragment (h2/h3/p/ul/ol/li/strong/a) → Portable Text blocks. */
export function htmlToPortableText(html: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = [];
  const top = /<(h2|h3|p|ul|ol)>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = top.exec(html))) {
    const [, tag, inner] = match;
    const t = tag.toLowerCase();

    if (t === 'ul' || t === 'ol') {
      const li = /<li>([\s\S]*?)<\/li>/gi;
      let itemMatch: RegExpExecArray | null;
      while ((itemMatch = li.exec(inner))) {
        blocks.push(block('normal', itemMatch[1], t === 'ol' ? 'number' : 'bullet'));
      }
      continue;
    }

    blocks.push(block(t === 'p' ? 'normal' : (t as 'h2' | 'h3'), inner));
  }

  return blocks;
}
