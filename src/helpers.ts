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

export { isPangram, wordHasValidLetters }
