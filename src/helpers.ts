const isPangram = (word:string, letters: string[]):boolean => {
  for (const char of letters) {
    if (word.indexOf(char) < 0) {
      return false
    }
  }
  return true
}

export { isPangram }
