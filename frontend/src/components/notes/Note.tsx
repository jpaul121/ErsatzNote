import React, { useEffect, useRef, useState } from 'react'

import { NoteData } from '../other/Serialization'

function Note({ content, date_modified, title }: NoteData) {
  return (
    <li>
      <h3>{title}</h3>
      <p>{content}</p>
      <h4>{date_modified}</h4>
    </li>
  );
}

export default Note
