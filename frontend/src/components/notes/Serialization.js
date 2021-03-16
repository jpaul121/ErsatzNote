export function getTitlePreview(note) {
  const title = note.title[0].children[0]

  return title.text;
}

export function getContentPreview(note) {
  const content = note.content[0].children[0]

  return content.text;
}