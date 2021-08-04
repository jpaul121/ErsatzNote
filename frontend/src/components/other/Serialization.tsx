// @ts-nocheck

import { Descendant, Node, Text } from 'slate'

import escapeHtml from 'escape-html'

export interface NoteDataObject {
  note_id?: string,
  title: Node[] | string,
  content: string,
  date_created?: string,
  date_modified: string,
}

export function clearEditor(editor, isMountedRef, setContent) {
  editor.selection = {
    anchor: { path: [ 0, 0 ], offset: 0 },
    focus: { path: [ 0, 0 ], offset: 0 },
  }

  if (isMountedRef.current) setContent(emptyValue)
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
    if (node.type === 'bulleted-list' || 'numbered-list') {
      for (const listItem of node.children) {
        preview += `${Node.string(listItem)},\n`
      }
    } else preview += `${Node.string(node)}\n`
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
    
    if (node.code) {
      formattedText = '<code>' + formattedText + '</code>'
    }
    
    return formattedText;
  }
  
  const children = node.children.map(n => serialize(n)).join('')

  switch (node.type) {
    case 'block-quote':
      return `<blockquote {...attributes}>${children}</blockquote>`;
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

  let children = Array.from(el.childNodes).map(deserialize)

  if (children.length === 0) {
    children = [{ text: '' }]
  }

  switch (el.nodeName) {
    case 'BODY':
      return children;
    case 'BR':
      return '\n';
    case 'CODE':
      return { code: true, text: el.textContent };
    case 'STRONG':
      if (el.textContent?.includes('<em>')) {
        let finalString = el.textContent

        finalString = finalString.replace('<em>', '').replace('</em>', '')
        
        return { bold: true, italic: true, text: finalString };
      }
      return { bold: true, text: el.textContent };
    case 'EM':
      if (el.textContent?.includes('<strong>')) {
        let finalString = el.textContent

        finalString = finalString.replace('<strong>', '').replace('</strong>', '')
        
        return { bold: true, italic: true, text: finalString };
      }
      return { italic: true, text: el.textContent };
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

export const emptyValue: Descendant[] = [ { type: 'paragraph', children: [ { text: '' } ] } ]
