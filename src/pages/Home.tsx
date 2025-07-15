import { useRef, useState } from 'react'
import Hexagon from '../components/Hexagon'
import db from '../db'
import { ref, set } from "firebase/database"
import { useNavigate } from 'react-router'
import humanId from 'human-id'

const Home = () => {

  const [letters, setLetters] = useState(["", "", "", "", "", "", ""])
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const navigate = useNavigate()

  const updateLetter = (newIndex: number, newVal: string) => {
    const newLetter = newVal.substring(newVal.length - 1).toUpperCase()
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
    const gameName = humanId('-')
    set(ref(db, 'game/' + gameName), {
      letters: letters,
      words: []
    }).then(() => {
      navigate("/game/" + gameName) 
    })
  }

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  return <div className="home">
  <h2>Create Game</h2>
  <p>Step 1: Select 7 letters.</p>
  <div className="home-lettersetter">
  {([0,1,2,3,4,5,6]).map(num => (
    <input key={num} 
           maxLength={1} 
           ref={setInputRef(num)} 
           value={letters[num]} 
           onChange={e => {updateLetter(num, e.target.value)}}
     />  
  ))}
  </div>
  <Hexagon letters={letters}></Hexagon>
  <br />
  <p>Step 2: Create game</p>
  <button id="create-game" onClick={createGame}>Create!</button>
  </div>
}

export default Home
