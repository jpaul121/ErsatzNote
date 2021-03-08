// This should give you the kind of JSON object
// that the Slate editor expects. 
function deserialize(str) {
  const nodes = JSON.parse(str)
  
  return nodes;
}

export default deserialize
