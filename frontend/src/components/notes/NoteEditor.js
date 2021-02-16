import 'react-quill/dist/quill.snow.css'
import 'regenerator-runtime/runtime.js'

import React, { Component } from 'react'
import ReactQuill, { Quill } from 'react-quill'

import axios from 'axios'
import styles from './NoteEditor.module.css'
import { withRouter } from 'react-router'

class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: null,
      isLoading: true,
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

    // Yes, the author is aware this doesn't return anything. 
    return this.setState({
      content,
      isLoading: false,
    });
  }

  onChange(content, delta, source, editor) {
    const text = editor.getText(content)
    
    this.setState({
      content: text,
    });
  }

  render() {
    return !this.state.isLoading && (
      <div>
        <ReactQuill
          className={styles['editor']}
          placeholder={'Write something...'}
          ref={'editor'}
          value={this.state.content}
        />
      </div>
    );
  }
}

const finishedNoteEditor = withRouter(NoteEditor)

export default finishedNoteEditor
