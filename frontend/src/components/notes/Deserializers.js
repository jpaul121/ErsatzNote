import { Text } from 'slate'

export function deserialize(nodes) {
  return JSON.stringify(nodes);
}

export function deserializePreview(input) {
  const node = Text.isTextList(input) ? input[0] : input
  
  console.log(node)
  
  if (Text.isText(node)) {
    return node['text'];
  }

  const children = node.children.map(n => deserializePreview(n)).join('')
  
  return children;
}
