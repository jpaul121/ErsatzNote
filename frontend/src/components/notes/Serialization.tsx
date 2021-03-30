// @ts-nocheck

import { Node, Text } from 'slate'

import escapeHtml from 'escape-html'
import { jsx } from 'slate-hyperscript'

export interface NoteDataObject {
  note_id: string,
  title: any,
  content: string,
  date_created: string,
  date_modified: string,
}


export function getTitlePreview(note) {
  const title = note.title[0].children[0]

  return title.text;
}

export function serialize(node: Node) {
  if (Text.isText(node)) {
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
    case 'paragraph':
      return `<p>${children}</p>`;
    default:
      return children;
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
    case 'H1':
      return jsx('element', { type: 'heading-one' }, children);
    case 'H2':
      return jsx('element', { type: 'heading-two' }, children);
    case 'BLOCKQUOTE':
      return jsx('element', { type: 'block-quote' }, children);
    case 'P':
      return jsx('element', { type: 'paragraph' }, children);
    case 'UL':
      return jsx('element', { type: 'bulleted-list' }, children);
    case 'OL':
      return jsx('element', { type: 'numbered-list' }, children);
    case 'LI':
      return jsx('element', { type: 'list-item' }, children);
    default:
      return el.textContent;
  }
}

export const emptyValue = [ { type: 'paragraph', children: [ { text: '' } ] } ]