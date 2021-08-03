import React, { useState } from 'react'

import { Descendant } from 'slate'
import NoteEditor from './NoteEditor'
import NoteTitleBar from './NoteTitleBar'
import { emptyValue } from '../other/Serialization'
import styles from '../../stylesheets/notes/NoteEditorContainer.module.css'

export enum NoteEditorSize {
  FullScreen = '65em',
  Medium = '42em',
}

interface NoteEditorContainerProps {
  size: NoteEditorSize,
}

function NoteEditorContainer({ size }: NoteEditorContainerProps) {
  const [ title, setTitle ] = useState<Descendant[] | undefined>(emptyValue)
  const [ content, setContent ] = useState<Descendant[] | undefined>(emptyValue)

  return (
    <div className={styles['note-editor-container']}>
      <div
        className={styles['editor-proper']}
        style={{
          maxWidth: size,
        }}
      >
        <NoteTitleBar
          // @ts-ignore
          title={title}
          setTitle={setTitle}
        />
        <NoteEditor
          // @ts-ignore
          title={title}
          content={content}
          setContent={setContent}
        />
      </div>
    </div>
  );
}

export default NoteEditorContainer
