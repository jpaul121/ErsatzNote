// Deserialization usually involves receiving 
// some obscure data structure and returning a 
// simple value, not the other way around. 
function deserialize(string) {
  return string.split('\n').map(line => {
    return {
      children: [ { text: line } ],
    };
  });
}

export default deserialize
