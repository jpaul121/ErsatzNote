// @ts-nocheck

import { Node, Text } from 'slate'

import escapeHtml from 'escape-html'
import { jsx } from 'slate-hyperscript'

export interface NoteDataObject {
  note_id: string,
  title: any,
  content: any
  date_created: string,
  date_modified: string,
}


export function getTitlePreview(note) {
  const title = note.title[0].children[0]

  return title.text;
}

export function getContentPreview(note) {
  const content = note.content[0].children[0]

  return content.text;
}

export function serialize(content) {
  let html = ''
  
  content.forEach(function(node) {
    if (Text.isText(node)) {
      html += escapeHtml(node.text)
      return;
    }
    const children = node.children.map(n => serialize(n)).join('')
  
    switch (node.type) {
      case 'block-quote':
        html += `<blockquote><p>${children}</p></blockquote>`
        break;
      case 'bulleted-list':
        html += `<ul {...attributes}>${children}</ul>`
        break;
      case 'heading-one':
        html += `<h1 {...attributes}>${children}</h1>`
        break;
      case 'heading-two':
        html += `<h2 {...attributes}>${children}</h2>`
        break;
      case 'list-item':
        html += `<li {...attributes}>${children}</li>`
        break;
      case 'numbered-list':
        html += `<ol {...attributes}>${children}</ol>`
        break;
      default:
        html += `<p>${children}</p>`
        break;
    }
  })

  return html;
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

export const emptyValue = [ { type: 'paragraph', children: [ { text: '' } ] } ]