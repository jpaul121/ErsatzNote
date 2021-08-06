import { Editable, Slate, withReact } from 'slate-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { clearTitle, emptyValue } from '../other/Serialization'

import { Descendant } from 'slate'
import NoteEditor from './NoteEditor'
import { axiosInstance } from '../../axiosAPI'
import { createEditor } from 'slate'
import styles from '../../stylesheets/notes/NoteEditorContainer.module.css'

interface MatchProps {
  note_id: string,
  notebook_id: string,
}

export enum NoteEditorSize {
  FullScreen = '65em',
  Medium = '44em',
}

interface NoteEditorContainerProps {
  size: NoteEditorSize,
}

function NoteEditorContainer({ match, size }: NoteEditorContainerProps & RouteComponentProps<MatchProps>) {
  const [ title, setTitle ] = useState(emptyValue)
  const [ content, setContent ] = useState<Descendant[] | null>(emptyValue)

  const titleBar = useMemo(() => withReact(createEditor()), [])

  const _isMounted = useRef(false)

  async function getTitle() {
    if (match.params.note_id) {
      const response = await axiosInstance.get(
        `/api/notes/${match.params.note_id}/`,
      )
      
      if (_isMounted.current) setTitle(response.data.title)
    } else clearTitle(_isMounted, titleBar, setTitle)
  }
  
  useEffect(() => {
    _isMounted.current = true
    getTitle()

    return () => {
      _isMounted.current = false
    };
  }, [ match ])

  return (
    <div className={styles['note-editor-container']}>
      <div
        className={styles['editor-proper']}
        style={{
          maxWidth: size,
        }}
      >
        <Slate
          editor={titleBar}
          value={title}
          onChange={newTitle => setTitle(newTitle)}
        >
          <Editable
            placeholder='Title'
          />
        </Slate>
        <NoteEditor
          // @ts-ignore
          content={content}
          setContent={setContent}          
          setTitle={setTitle}
          title={title}
          titleBar={titleBar}
        />
      </div>
    </div>
  );
}

const finishedNoteEditorContainer = withRouter(NoteEditorContainer)

export default finishedNoteEditorContainer
