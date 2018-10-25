import React, {SFC} from 'react'

interface Props {
  ratio: number
}

const CellTypeBar: SFC<Props> = ({ratio}) => {
  const scale = num => num / ratio

  return (
    <svg className="cell-type--svg" viewBox={`0 0 100 ${scale(100)}`}>
      <g>
        <polyline
          className="chart-line"
          vectorEffect="non-scaling-stroke"
          strokeWidth="2"
          points={`2,${scale(2)} 2,${scale(98)} 98,${scale(98)}`}
        />
        <polygon
          className="poly fade"
          points={`
          2 ${scale(80)} 
          19 ${scale(80)}
          19 ${scale(65)}
          32 ${scale(65)}
          32 ${scale(73)}
          45 ${scale(73)}
          45 ${scale(46)}
          60 ${scale(46)}
          60 ${scale(60)}
          70 ${scale(60)}
          70 ${scale(22)}
          83 ${scale(22)}
          83 ${scale(6)}
          98 ${scale(6)}
          98 ${scale(98)}
          2 ${scale(98)}
          `}
        />
        <polyline
          className="chart-line"
          vectorEffect="non-scaling-stroke"
          strokeWidth="2"
          points={`
          2 ${scale(80)}
          19 ${scale(80)}
          19 ${scale(65)}
          32 ${scale(65)}
          32 ${scale(73)}
          45 ${scale(73)}
          45 ${scale(46)}
          60 ${scale(46)}
          60 ${scale(60)}
          70 ${scale(60)}
          70 ${scale(22)}
          83 ${scale(22)}
          83 ${scale(6)}
          98 ${scale(6)}
          `}
        />
      </g>
    </svg>
  )
}

export default CellTypeBar
