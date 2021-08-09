import TrieNode from './TrieNode'

const ROOT_CHARACTER = '*'

class Trie {
  public root: TrieNode
  
  constructor() {
    this.root = new TrieNode(ROOT_CHARACTER, false)
  }

  addWord(word: string): Trie {
    const characters: Array<string> = Array.from(word)
    let currentNode = this.root

    for (const [ index, character ] of characters.entries()) {
      const isCompleteWord = index === characters.length - 1
      currentNode = currentNode.addChild(character, isCompleteWord)
    }

    return this;
  }

  deleteWord(word: string): Trie | void {
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

  doesWordExist(word: string): boolean {
    const lastCharacter = this.getLastCharacterNode(word)

    return !!lastCharacter && lastCharacter.isCompleteWord;
  }

  getLastCharacterNode(word: string): TrieNode | null {
    const characters = Array.from(word)
    let currentNode = this.root

    for (let index = 0; index < characters.length; index++) {
      if (!currentNode.hasChild(characters[index])) return null;
      currentNode = currentNode.getChild(characters[index])
    }

    return currentNode;
  }

  suggestNextCharacters(word: string): Array<string> | null {
    const lastCharacter = this.getLastCharacterNode(word)

    if (!lastCharacter) return null;

    return lastCharacter.suggestChildren();
  }
}

export default Trie
