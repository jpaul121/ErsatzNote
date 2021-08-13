export const initialEditorValue = {}

interface TrieNodeInterface {
  character: string,
  children: { [ key: string ]: TrieNodeInterface },
  isCompleteWord: boolean,
}

export class TrieNode implements TrieNodeInterface {
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

const ROOT_CHARACTER = '*'

export class Trie {
  private root: TrieNode
  
  constructor() {
    this.root = new TrieNode(ROOT_CHARACTER, false)
  }

  public addWord(word: string): Trie {
    const characters: Array<string> = Array.from(word)
    let currentNode = this.root

    for (const [ index, character ] of characters.entries()) {
      const isCompleteWord = index === (characters.length - 1)
      currentNode = currentNode.addChild(character, isCompleteWord)
    }

    return this;
  }

  public addWords(words: Set<string>): Trie {
    for (const word of words) {
      this.addWord(word)
    }

    return this;
  }

  public deleteWord(word: string): Trie | void {
    function depthFirstDelete(currentNode: TrieNode, index=0) {
      if (index >= word.length) return;
      
      const character = word[index]
      const nextNode = currentNode.getChild(character)

      if (!nextNode) return;

      depthFirstDelete(nextNode, index + 1)

      if (index === (word.length - 1)) nextNode.isCompleteWord = false
      
      currentNode.removeChild(character)
    }

    depthFirstDelete(this.root)

    return this;
  }

  public doesWordExist(word: string): boolean {
    const lastCharacter = this.getLastCharacterNode(word)

    return !!lastCharacter && lastCharacter.isCompleteWord;
  }

  public getLastCharacterNode(word: string): TrieNode | null {
    const characters = Array.from(word)
    let currentNode = this.root

    for (let index = 0; index < characters.length; index++) {
      if (!currentNode.hasChild(characters[index])) return null;
      currentNode = currentNode.getChild(characters[index])
    }

    return currentNode;
  }

  public includesPossibleMatch(word: string): boolean {
    // Returns true if the last character in the given
    // search term completes a word or if it has any children
    const lastCharacter = this.getLastCharacterNode(word)
    if (!lastCharacter) return false;
    return (lastCharacter.isCompleteWord || !!(Object.keys(lastCharacter.children).length));
  }

  public suggestNextCharacters(word: string): Array<string> | null {
    const lastCharacter = this.getLastCharacterNode(word)
    if (!lastCharacter) return null;
    return lastCharacter.suggestChildren();
  }
}
