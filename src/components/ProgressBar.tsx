import "./ProgressBar.scss"
import { isPangram } from "../helpers"
import { useEffect, useState } from "react"

interface ProgressBarProps {
  wordList: string[]
  foundWords: string[]
  letters: string[]
}

const calculateWordValue = (word: string, letters: string[]):number => {
  if (word.length == 4) {
    return 1
  }

  if (isPangram(word, letters)) {
    return word.length + 7
  }

  return word.length
}

const calculateScore = (words: string[], letters: string[]):number => {
  return words.reduce((accum, current) => (accum + calculateWordValue(current, letters)), 0)
}

const ProgressBar = (props: ProgressBarProps) => {
  const [score, setScore] = useState<number>(0)
  const highestPossible = calculateScore(props.wordList, props.letters)
  const completeProportion = score / highestPossible

  useEffect(() => {
    setScore(calculateScore(props.foundWords, props.letters))
  }, [props.foundWords])

  return (
    <div className="progress-bar">
      <div className="progress-bar-inner" style={{width: `calc(${100*completeProportion}% - 2px)`}}>
      </div>
    </div>
  )
}

export default ProgressBar
