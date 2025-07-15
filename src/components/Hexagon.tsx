import './Hexagon.scss'

interface HexagonProps {
  letters: string[],
  onLetterClick?: (letter:string) => void
}

const Hexagon = (props: HexagonProps) => {

  const clickHandler = ():(letter:string)=> void => {
    if (props.onLetterClick) {
      return props.onLetterClick
    }
    return () => {}
  }

  return (
    <div className="hexagon-container">
    {props.letters.map((letter, idx) => (
    <div className="hexagonlet" key={idx} onClick={clickHandler} >
      <p>{letter}</p>
    </div>
    ))}
    </div>
  )
}

export default Hexagon
