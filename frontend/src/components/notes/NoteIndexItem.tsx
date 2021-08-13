// @ts-nocheck

import React from 'react'

function NoteIndexItem({ date_created, date_modified, title }) {
  return (
    <li>
      <span>
        {title}
      </span>
      <span>
        {date_modified}
        {date_created}
      </span>
    </li>
  );
}

export default NoteIndexItem
