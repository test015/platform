import React, {SFC} from 'react'

interface Props {
  ratio: number
}

const CellTypeBar: SFC<Props> = ({ratio}) => {
  const scale = num => num / ratio

  return (
    <svg className="cell-type--svg" viewBox={`0 0 100 ${scale(100)}`}>
      <g>
        <rect
          className="poly"
          x="12"
          y={scale(66)}
          width="22"
          height={scale(33)}
        />
        <rect
          className="poly"
          x="39"
          y={scale(23)}
          width="22"
          height={scale(76)}
        />
        <rect
          className="poly"
          x="66"
          y={scale(45)}
          width="22"
          height={scale(54)}
        />
        <polyline
          vectorEffect="non-scaling-stroke"
          strokeWidth="2"
          className="chart-line"
          points={`2 ${scale(2)} 2 ${scale(98)} 98 ${scale(98)}`}
        />
      </g>
    </svg>
  )
}

export default CellTypeBar
