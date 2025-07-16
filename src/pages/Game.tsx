import { useEffect, useState } from "react"
import { useParams } from "react-router"
import Hexagon from "../components/Hexagon"
import ProgressBar from '../components/ProgressBar'
import { onValue, ref, update } from "firebase/database"
import db from "../db"
import { isPangram } from "../helpers"

enum WordValidity {
  Valid,
  TooShort,
  NoCenterLetter,
  AlreadyInList,
  NotInDictionary
} 

const Game = () => {
  const { gameId } = useParams()
  const [letters, setLetters] = useState<string[]>([])
  const [words, setWords] = useState<string[]>([])
  const [wordList, setWordList] = useState<string[]>([])
  const [word, setWord] = useState("")
  const [error, setError] = useState("")
  const [showGrid, setShowGrid] = useState(false)

  useEffect(() => {
    const query = ref(db, "game/" + gameId)
    return onValue(query, snapshot => {
      const data = snapshot.val()
      if (snapshot.exists()) {
        if (data.letters) {
          setLetters(data.letters)
        } 
        if (data.words) {
          setWords(data.words)
        }
        if (data.wordList) {
          setWordList(data.wordList)
        }
      }
    })
  }, [])

  const handleKeyPress = (e:KeyboardEvent) => {
    e.preventDefault()
    const key = e.key.toUpperCase()
    if (letters.includes(key)) {
      const newWord = word + e.key.toUpperCase()
      if (newWord.length <= 20) {
        setWord(newWord)
      }
    }
    if (e.keyCode == 8 && word.length > 0) {
      deleteChar()
    }
    if (e.keyCode == 13) {
      submitWord()
    }
  }

  const handleHexagonClick = (letter: string) => {
    const newWord = word + letter
    if (newWord.length <= 20) {
      setWord(newWord)
    }
  }
  
  const deleteChar = () => {
    const newWord = word.substring(0, word.length - 1)
    setWord(newWord)
  }

  const submitWord = () => {
    const validity = wordValidity()
    if (validity == WordValidity.Valid) {
      const newWords = [...words, word]
      update(ref(db, 'game/' + gameId), {
        words: newWords
      })
      setWord("")
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
    if (word.length < 4) {
      return WordValidity.TooShort
    }
    if (word.indexOf(letters[6]) < 0) {
      return WordValidity.NoCenterLetter
    }
    if (words.includes(word)) {
      return WordValidity.AlreadyInList
    }
    if (!wordList.includes(word)) {
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
  }, [letters,word])

  return (
    <div className="game">
    <div className="game-word-container">
      <p className="game-word-entry">{word.split("").map((wordLetter,idx) => (
        <span key={idx} className={(wordLetter == letters[6]) ? "golden" : ""}>{wordLetter}</span>
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
    <ProgressBar wordList={wordList} foundWords={words} letters={letters} />
    <div className="game-main-content">
      <Hexagon letters={letters} onLetterClick={handleHexagonClick}/>
      <div className="game-main-content-wordlist"> 
      {words.map((word,idx) => (
        <p key={idx} className={isPangram(word, letters) ? "pangram" : ""}>{properCase(word)}</p>
      ))}
      </div>
    </div>
    </div>
  )
}

export default Game
