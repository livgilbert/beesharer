import './Hexagon.scss'

interface HexagonProps {
  letters: string[],
  onLetterClick?: (letter:string) => void
}

const Hexagon = (props: HexagonProps) => {

  const clickHandler = (letter:string):( () => void ) => {
    const letterClick = props.onLetterClick
    if (letterClick) {
      return () => { letterClick(letter) }
    }
    return () => {}
  }

  return (
    <div className="hexagon-container">
    {props.letters.map((letter, idx) => (
    <div className="hexagonlet" key={idx} onClick={clickHandler(letter)} >
      <p className="noselect">{letter}</p>
    </div>
    ))}
    </div>
  )
}

export default Hexagon
