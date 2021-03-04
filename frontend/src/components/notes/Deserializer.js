import { Node } from 'slate'

// Serialization usually involves taking in a
// simple value and turning it into a data structure, 
// but in this case I'm saving the editor's contents
// as plaintext, and it's the editor that wants the JSON. 
function serialize(nodes) {
  return nodes.map(n => Node.string(n)).join('\n');
}

export default serialize
