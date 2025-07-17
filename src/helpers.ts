import type { Word } from "./types"

const isPangram = (word:string, letters: string[]):boolean => {
  for (const char of letters) {
    if (word.indexOf(char) < 0) {
      return false
    }
  }
  return true
}

const wordHasValidLetters = (word:string, letters:string[]):boolean => {
  for (const letter of word) {
    if (!letters.includes(letter)) {
      return false
    }
  }
  return true
}

const wordSort = (a:Word,b:Word) => {
  const textA = a.text.toUpperCase()
  const textB = b.text.toUpperCase()
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
}

export { isPangram, wordHasValidLetters, wordSort }
