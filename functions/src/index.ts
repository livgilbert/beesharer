import { onValueCreated } from 'firebase-functions/v2/database';
import { initializeApp } from 'firebase-admin/app';
import * as fs from 'fs'
import * as path from 'path'

initializeApp();

const isValidWord = (word:string, letters:string[]):boolean => {
  // long enough
  if (word.length < 4) {
    return false
  }
  // has center letter
  if (word.indexOf(letters[6]) < 0) {
    return false
  }
  // each letter is valid
  for (const letter of word) {
    if (!letters.includes(letter)) {
      return false
    }
  }
  return true
}

export const setupGameDictionary = onValueCreated('/game/{gameId}', async (event) => {
  const snapshot = event.data;
  const ref = snapshot.ref;
  const gameData = snapshot.val();

  if (gameData?.processed) {
    console.log(`Game ${ref.key} already processed.`);
    return;
  }

  console.log(`Processing new game: ${ref.key}`);

  const data = fs.readFileSync(path.join(__dirname + "/scrabble-dictionary.txt"), 'utf8')
  const allWords = data.split("\n")
  const letters = gameData.letters
  const wordList = []

  for (const word of allWords) {
    if (isValidWord(word, letters)) {
      wordList.push(word)
    }
  }

  console.log(wordList) 

  await ref.update({ wordList: wordList });
});

