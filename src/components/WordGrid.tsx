import './WordGrid.scss'

interface WordGridProps {
  wordList: string[]
  foundWords: string[] 
  letters: string[]
}

const WordGrid = (props: WordGridProps) => {

  const maxLength = Math.max(...props.wordList.map(w => w.length))
  const startingLetters = Array.from(new Set(props.wordList.map(w => w[0]))).sort()

  // returns -1 if there were never any words of that letter and length
  const remainingWords = (startingLetter: string, length: number):number => {
    const wordsInList = props.wordList.filter(w => (w[0] == startingLetter && w.length == length)).length
    if (wordsInList == 0) {
      return -1
    }
    const wordsFound = props.foundWords.filter(w => (w[0] == startingLetter && w.length == length)).length

    return wordsInList - wordsFound
  }

  const gridContent = (startingLetter: string, length: number):string => {
    const remaining = remainingWords(startingLetter, length)
    if (remaining == -1) {
      return ""
    }
    else if (remaining == 0) {
      return "️✓"
    } else {
      return remaining.toString()
    }
  }

  return (
    <div className="word-grid border">
    <table className="word-grid-content">
    <tr>
    <th></th>
    { Array.from({length: maxLength - 3}, (_,i) => 4+i).map(wordLength => (
      <th key={wordLength}><p>{wordLength}</p></th>
    ))}
    </tr>
    {startingLetters.map(startingLetter => (
      <tr>
      <td key={startingLetter}><p>{startingLetter}</p></td>
      { Array.from({length: maxLength - 3}, (_,i) => 4+i).map(wordLength => (
        <td key={wordLength}><p>{gridContent(startingLetter, wordLength)}</p></td>
      ))}
      </tr>
    ))}
    </table>
  </div>)
}

export default WordGrid
