// Should take you from JSON objects to strings
// you can pass to your Django models. 
function serialize(nodes) {
  return JSON.stringify(nodes);
}

export default serialize
