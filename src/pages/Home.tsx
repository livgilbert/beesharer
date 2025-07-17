import { useEffect, useRef, useState } from 'react'
import Hexagon from '../components/Hexagon'
import db from '../db'
import { ref, set } from "firebase/database"
import { useNavigate } from 'react-router'
import humanId from 'human-id'
import './Home.scss'

const Home = () => {

  const [letters, setLetters] = useState(["", "", "", "", "", "", ""])
  const [loading, setLoading] = useState<boolean>(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const navigate = useNavigate()

  const updateLetter = (newIndex: number, newVal: string) => {
    const newLetter = newVal.substring(newVal.length - 1).toUpperCase()
    if (newLetter != "" && letters.includes(newLetter)) {
      return
    }
    const newLetters = letters.map((oldLetter, oldIndex) => (
      oldIndex == newIndex ? newLetter : oldLetter
    ))

    setLetters(newLetters)

    if (newIndex < 6 && newVal != "") {
      const nextInput = inputRefs.current[newIndex + 1]
      if (nextInput) {
        nextInput.focus()
      }
    } 
  }

  const createGame = () => {
    if (letters.includes("")) {
      return
    }
    setLoading(true)
    const gameName = humanId('-')
    set(ref(db, 'game/' + gameName), {
      letters: letters,
      words: []
    }).then(() => {
      navigate("/game/" + gameName) 
    }).catch(e => {
      console.error(e)
    })
  }

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.keyCode == 13) {
      createGame()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeypress)
    return () => {window.removeEventListener('keydown', handleKeypress)}
  }, [letters])

  return <div className="home">
  <h2>Create Game</h2>
  <p>Step 1: Select 7 letters.</p>
  <div className="home-lettersetter">
  {([0,1,2,3,4,5,6]).map(num => (
    <input key={num} 
           maxLength={2} 
           ref={setInputRef(num)} 
           value={letters[num]} 
           onChange={e => {updateLetter(num, e.target.value)}}
     />  
  ))}
  </div>
  <Hexagon letters={letters}></Hexagon>
  <br />
  <p>Step 2: Create game</p>
  <button id="create-game" onClick={createGame}>{loading ? "..." : "Create"}</button>
  </div>
}

export default Home
