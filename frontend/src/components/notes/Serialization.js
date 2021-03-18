import { jsx } from 'slate-hyperscript'

export function getTitlePreview(note) {
  const title = note.title[0].children[0]

  return title.text;
}

export function getContentPreview(note) {
  const content = note.content[0].children[0]

  return content.text;
}

export function serialize(node) {
  if ('text' in node) {
    return escapeHtml(node.text);
  }

  const children = node.children.map(n => serialize(n)).join('')

  switch (node.type) {
    case 'block-quote':
      return `<blockquote><p>${children}</p></blockquote>`;
    case 'bulleted-list':
      return `<ul {...attributes}>${children}</ul>`;
    case 'heading-one':
      return `<h1 {...attributes}>${children}</h1>`;
    case 'heading-two':
      return `<h2 {...attributes}>${children}</h2>`;
    case 'list-item':
      return `<li {...attributes}>${children}</li>`;
    case 'numbered-list':
      return `<ol {...attributes}>${children}</ol>`;
    default:
      return `<p>${children}</p>`;
  }
}

export function deserialize(el) {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  }

  const children = Array.from(el.childNodes).map(deserialize)

  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children);
    case 'BR':
      return '\n';
    case 'BLOCKQUOTE':
      return jsx('element', { type: 'quote' }, children);
    case 'P':
      return jsx('element', { type: 'paragraph' }, children);
    case 'A':
      return jsx(
        'element',
        { type: 'link', url: el.getAttribute('href') },
        children
      );
    default:
      return el.textContent;
  }
}