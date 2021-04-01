// @ts-nocheck

import { Node, Text } from 'slate'

import escapeHtml from 'escape-html'

export interface NoteDataObject {
  note_id: string,
  title: Node[],
  content: string,
  date_created: string,
  date_modified: string,
}


export function getTitlePreview(note: NoteDataObject): string {
  const title = note.title[0].children[0]

  return title.text;
}

export function getContentPreview(note: NoteDataObject): string {
  const document = new DOMParser().parseFromString(note.content, 'text/html')
  const formattedContent = deserialize(document.body)

  let preview = ''
  for (const node of formattedContent) {
    preview += Node.string(node)
  }

  return preview;
}

export function serialize(node: Node): string {
  if (Text.isText(node)) {
    let formattedText = escapeHtml(node.text)

    if (node.bold) {
      formattedText = '<strong>' + formattedText + '</strong>'
    }

    if (node.italic) {
      formattedText = '<em>' + formattedText + '</em>'
    }
    
    return formattedText;
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

export function deserialize(el: HTMLElement): Node[] {
  if (el.nodeType === 3) {
    return { text: el.textContent };
  } else if (el.nodeType !== 1) {
    return null;
  }

  const children = Array.from(el.childNodes).map(deserialize)

  if (children.length === 0) {
    children = [{ text: '' }]
  }

  switch (el.nodeName) {
    case 'BODY':
      return children;
    case 'BR':
      return '\n';
    case 'H1':
      return { type: 'heading-one', children };
    case 'H2':
      return { type: 'heading-two', children };
    case 'BLOCKQUOTE':
      return { type: 'block-quote', children };
    case 'P':
      return { type: 'paragraph', children };
    case 'UL':
      return { type: 'bulleted-list', children };
    case 'OL':
      return { type: 'numbered-list', children };
    case 'LI':
      return { type: 'list-item', children };
    default:
      return { text: el.textContent };
  }
}

export const emptyValue = [ { type: 'paragraph', children: [ { text: '' } ] } ]