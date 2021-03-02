import 'regenerator-runtime/runtime.js'

import { BlockButton, Element, Leaf, MarkButton, SaveButton, Toolbar } from './BaseComponents'
import { Editable, Slate, withReact } from 'slate-react'
import React, { useCallback, useEffect, useMemo } from 'react'

import axios from 'axios'
import { createEditor } from 'slate'
import deserialize from './Deserializer'
import serialize from './Serializer'
import { withRouter } from 'react-router'

function NoteEditor({ match, content, setContent, title }) {
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const saveNote = useCallback(() => {
    // This was confusing because usually databases
    // save content in JSON and the client receives
    // plaintext, but in this case it's the other way around. 
    const plaintextContent = serialize(content)
    
    axios.put(
      `/api/notes/${match.params.note_id}/`,
      {
        note_id: match.params.note_id,
        title,
        content: plaintextContent,
      }
    )
  }, [ match, title, content ])

  useEffect(() => {
    async function getNote() {
      const response = await axios.get(
        `/api/notes/${match.params.note_id}/`,
      )
      
      setContent(deserialize(response.data.content))
    }

    getNote()
  }, [ match ])

  return (
    <Slate
      editor={editor}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      value={content}
      onChange={newContent => setContent(newContent)}
    >
      <Toolbar>
        <MarkButton format='bold' icon='format_bold' />
        <MarkButton format='italic' icon='format_italic' />
        <MarkButton format='code' icon='code' />
        <BlockButton format='heading-one' icon='looks_one' />
        <BlockButton format='heading-two' icon='looks_two' />
        <BlockButton format='block_quote' icon='format_quote' />
        <BlockButton format='bulleted_list' icon='format_list_bulleted' />
        <BlockButton format='numbered_list' icon='format_list_numbered' />
        <SaveButton saveNote={saveNote} />
      </Toolbar>
      <Editable
        placeholder='Write something...'
      />
    </Slate>
  );
}

const finishedNoteEditor = withRouter(NoteEditor)

export default finishedNoteEditor
