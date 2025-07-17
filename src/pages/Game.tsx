import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import Hexagon from "../components/Hexagon"
import ProgressBar from '../components/ProgressBar'
import { onValue, ref, update } from "firebase/database"
import db from "../db"
import { isPangram, wordHasValidLetters } from "../helpers"
import ProfileContext from "../ProfileContext"
import type { Word } from "../types"
import ProfileIcon from "../components/ProfileIcon"
import WordGrid from "../components/WordGrid"

enum WordValidity {
  Valid,
  TooShort,
  NoCenterLetter,
  AlreadyInList,
  NotInDictionary,
  HasInvalidLetter
} 

const Game = () => {
  const { gameId } = useParams()
  const [letters, setLetters] = useState<string[]>([])
  const [words, setCurrentWords] = useState<Word[]>([])
  const [wordList, setCurrentWordList] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [showGrid, setShowGrid] = useState(false)
  const profile = useContext(ProfileContext)

  const wordsTextOnly = words.map(w => w.text)

  useEffect(() => {
    const query = ref(db, "game/" + gameId)
    return onValue(query, snapshot => {
      const data = snapshot.val()
      if (snapshot.exists()) {
        if (data.letters) {
          setLetters(data.letters)
        } 
        if (data.words) {
          setCurrentWords(data.words)
        }
        if (data.wordList) {
          setCurrentWordList(data.wordList)
        }
      }
    })
  }, [])

  const handleKeyPress = (e:KeyboardEvent) => {
    if (e.keyCode == 8 && currentWord.length > 0) {
      deleteChar()
    }
    if (e.keyCode == 13) {
      submitWord()
    }
    const char = e.key.toUpperCase()
    if (char.length > 1) {
      return
    }
    const newWord = currentWord + e.key.toUpperCase()
    if (newWord.length <= 20) {
      setCurrentWord(newWord)
    }
  }

  const handleHexagonClick = (letter: string) => {
    const newWord = currentWord + letter
    if (newWord.length <= 20) {
      setCurrentWord(newWord)
    }
  }
  
  const deleteChar = () => {
    const newWord = currentWord.substring(0, currentWord.length - 1)
    setCurrentWord(newWord)
  }

  const submitWord = () => {
    const validity = wordValidity()
    if (validity == WordValidity.Valid) {
      const newWords = [...words, {text: currentWord, user: profile}]
      update(ref(db, 'game/' + gameId), {
        words: newWords
      })
      setCurrentWord("")
      setError("")
    }
    if (validity == WordValidity.TooShort) {
      setError("Too short")
    }
    if (validity == WordValidity.NoCenterLetter) {
      setError("Must include center letter")
    }
    if (validity == WordValidity.AlreadyInList) {
      setError("Already in word list")
    }
    if (validity == WordValidity.NotInDictionary) {
      setError("Not in dictionary")
    }
    if (validity == WordValidity.HasInvalidLetter) {
      setError("Invalid letters")
    }
  }

  const shuffle = () => {
    const newLetters = [...letters]
    for (let i = newLetters.length - 2; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1))
      const temp = newLetters[i]
      newLetters[i] = newLetters[j]
      newLetters[j] = temp
    }
    setLetters(newLetters)
  }

  const wordValidity = () => {
    if (currentWord.length < 4) {
      return WordValidity.TooShort
    }
    if (!wordHasValidLetters(currentWord, letters)) {
      return WordValidity.HasInvalidLetter
    }
    if (currentWord.indexOf(letters[6]) < 0) {
      return WordValidity.NoCenterLetter
    }
    if (wordsTextOnly.includes(currentWord)) {
      return WordValidity.AlreadyInList
    }
    if (!wordList.includes(currentWord)) {
      return WordValidity.NotInDictionary
    }
    return WordValidity.Valid
  }

  const properCase = (word:string):string => {
    return word.substring(0,1).toUpperCase() + word.substring(1).toLowerCase()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [letters,currentWord])

  return (
    <div className="game">
    <div className="game-word-container border">
      <div className="profile-container">
      <ProfileIcon profile={profile} size={34} />
      </div>
      <p className="game-word-entry">{currentWord.split("").map((wordLetter,idx) => (
        <span key={idx} className={(wordLetter == letters[6]) ? "golden" : !letters.includes(wordLetter) ? "gray": "" }>{wordLetter}</span>
      ))}
      <span id="cursor"></span>
      </p>
      <p className="game-error">{error}</p>
      <div className="game-button-container">
        <button onClick={deleteChar}>Delete</button>
        <button onClick={shuffle}>Shuffle</button>
        <button onClick={submitWord}>Enter</button>
      </div>
    </div>
    <ProgressBar wordList={wordList} foundWords={wordsTextOnly} letters={letters} />
    <div className="game-main-content">
      <Hexagon letters={letters} onLetterClick={handleHexagonClick}/>
      <div className="game-main-content-wordlist border"> 
      {words.map((word,idx) => (
        <p key={idx} className={isPangram(word.text, letters) ? "pangram" : ""}><ProfileIcon profile={word.user} /> {properCase(word.text)}</p>
      ))}
      </div>
    </div>
    {showGrid ? <WordGrid wordList={wordList} foundWords={wordsTextOnly} letters={letters} /> : <button id="grid-show" onClick={() => {setShowGrid(true)}}>Grid</button>}
    </div>
  )
}

export default Game
