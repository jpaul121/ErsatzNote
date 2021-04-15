import React, { useEffect, useRef, useState } from 'react'

import { Descendant } from 'slate'
import NoteEditor from './NoteEditor'
import NoteTitleBar from './NoteTitleBar'
import { emptyValue } from './Serialization'
import styles from './NoteEditorContainer.module.css'

function NoteEditorContainer(): JSX.Element {
  const [ title, setTitle ] = useState<Descendant[]>()
  const [ content, setContent ] = useState<Descendant[]>()
  
  const _isMounted = useRef(false)

  useEffect(() => {
    _isMounted.current = true
    
    if (_isMounted) setTitle(emptyValue)
    if (_isMounted) setContent(emptyValue)
  })

  return (
    <div className={styles['note-editor-container']}>
      <div className={styles['editor-proper']}>
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
