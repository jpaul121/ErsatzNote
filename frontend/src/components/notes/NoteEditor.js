import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'regenerator-runtime/runtime.js'

import { ContentState, EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import React, { Component } from 'react'

import { Editor } from 'react-draft-wysiwyg'
import axios from 'axios'
import drafttoHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import styles from './NoteEditor.module.css'
import { withRouter } from 'react-router'

class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contentState: null,
      isLoading: true,
      noteID: null,
    }
  }

  async componentDidMount() {
    await this.getNote()
  }

  async getNote() {
    const { match } = this.props
    const note_id = match.params.note_id

    const response = await axios.get(`/api/notes/${note_id}`)
    const content = response.data.content

    // Yes, the author is aware this.setState doesn't return anything. 
    if (content) {
      const contentState = convertFromRaw(content)
      
      return this.setState({
        contentState,
        isLoading: false,
        noteID: note_id,
      });
    } else {
      return this.setState({
        contentState: ContentState.createFromText('', ''),
        isLoading: false,
        noteID: note_id,
      });
    }
  }

  onContentStateChange(contentState) {
    this.setState({
      contentState,
    });
  }

  saveNote() {
    axios.post(`/api/${this.state.noteID}`, {
      content: convertToRaw(this.contentState),
    })
  }

  render() {
    return !this.state.isLoading && (
      <div>
        <Editor
          editorState={EditorState.createWithContent(this.state.contentState)}
          wrapperClassName='editor-wrapper'
          editorClassName='text-editor'
          onContentStateChange={this.onContentStateChange}
        />
        <button 
          type='button' 
          onClick={this.saveNote}
        >
          Save
        </button>
      </div>
    );
  }
}

const finishedNoteEditor = withRouter(NoteEditor)

export default finishedNoteEditor
