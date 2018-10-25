import React, {SFC} from 'react'

interface Props {
  text: string
  color: string
}

const Label: SFC<Props> = ({text, color}) => {
  return (
    <span className="label--flag" style={{backgroundColor: color}}>
      <span className="label--text" style={{color}}>
        {text}
      </span>
    </span>
  )
}

export default Label
