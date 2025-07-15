import { useEffect, useState } from "react"
import { useParams } from "react-router"
import Hexagon from "../components/Hexagon"
import { onValue, ref, update } from "firebase/database"
import db from "../db"

const Game = () => {
  const { gameId } = useParams()
  const [letters, setLetters] = useState([])
  const [words, setWords] = useState([])
  const [word, setWord] = useState("")

  useEffect(() => {
    const query = ref(db, "game/" + gameId)
    return onValue(query, snapshot => {
      const data = snapshot.val()
      if (snapshot.exists()) {
        if (data.letters) {
          setLetters(data.letters)
        } if (data.words) {
          setWords(data.words)
        }
      }
    })
  }, [])

  const handleKeyPress = (e:KeyboardEvent) => {
    e.preventDefault()
    if (letters.includes(e.key.toUpperCase())) {
      const newWord = word + e.key.toUpperCase()
      if (newWord.length <= 20) {
        setWord(newWord)
      }
    }
    if (e.keyCode == 8 && word.length > 0) {
      deleteChar()
    }
    if (e.keyCode == 13 && word.length >= 4) {
      submitWord()
    }
  }

  const handleHexagonClick = (letter: String) => {
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
    const newWords = [...words, word]
    update(ref(db, 'game/' + gameId), {
      words: newWords
    })
    setWord("")
  }

  const shuffle = () => {
    const firstSix = letters.splice(0,6)
    console.log(firstSix) 
    console.log(letters) 
  }

  const isValidWord = (word:String):boolean => {
    return true
  }

  const isPangram = (word:String):boolean => {
    for (const char of letters) {
      if (word.indexOf(char) < 0) {
        return false
      }
    }
    return true
  }

  const properCase = (word:String):String => {
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
      <p>{word.split("").map((wordLetter,idx) => (
        <span key={idx} className={(wordLetter == letters[6]) ? "golden" : ""}>{wordLetter}</span>
      ))}
      <span id="cursor"></span>
      </p>
      <div className="game-button-container">
        <button onClick={deleteChar}>Delete</button>
        <button onClick={deleteChar}>Shuffle</button>
        <button onClick={submitWord}>Enter</button>
      </div>
    </div>
    <div className="game-main-content">
      <Hexagon letters={letters} onLetterClick={handleHexagonClick}/>
      <div className="game-main-content-wordlist"> 
      {words.map(word => (
        <p className={isPangram(word) ? "pangram" : ""}>{properCase(word)}</p>
      ))}
      </div>
    </div>
    </div>
  )
}

export default Game
