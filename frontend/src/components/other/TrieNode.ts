interface TrieNodeInterface {
  character: string,
  children: { [ key: string ]: TrieNodeInterface },
  isCompleteWord: boolean,
}

class TrieNode implements TrieNodeInterface {
  public character
  public children: { [ key: string ]: TrieNode }
  public isCompleteWord
  
  constructor(character: string, isCompleteWord: boolean) {
    this.character = character
    this.children = {}
    this.isCompleteWord = isCompleteWord
  }

  public addChild(character: string, isCompleteWord: boolean): TrieNode {
    if (!this.hasChild(character)) {
      this.children[character] = new TrieNode(character, isCompleteWord)
    }
    
    const childNode = this.children[character]
    childNode.isCompleteWord = childNode.isCompleteWord || isCompleteWord
    
    return childNode;
  }

  public getChild(character: string): TrieNode {
    return this.children[character];
  }

  public hasChild(character: string): boolean {
    return !!this.children[character];
  }

  public removeChild(character: string): TrieNode {
    const childNode = this.getChild(character)

    // Only delete childNode if:
    // i. childNode has no children
    // ii. childNode doesn't make a complete word
    if (
      childNode
      && !childNode.isCompleteWord
      && Object.keys(childNode.children).length === 0
    ) delete this.children[character];

    return this;
  }

  public suggestChildren(): Array<string> {
    return [ ...Object.keys(this.children) ];
  }
}

export default TrieNode
