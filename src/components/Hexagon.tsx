import './Hexagon.scss'

type HexagonProps = {
  letters: String[]
  onLetterClick?: VoidFunction
}

const Hexagon = (props: HexagonProps) => {
  return (
    <div className="hexagon-container">
    {props.letters.map((letter, idx) => (
    <div className="hexagonlet" key={idx} onClick={() => {props.onLetterClick(letter)}} >
      <p>{letter}</p>
    </div>
    ))}
    </div>
  )
}

export default Hexagon
