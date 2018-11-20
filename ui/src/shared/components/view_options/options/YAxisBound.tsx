// Libraries
import React, {PureComponent} from 'react'

// Constants
import {AXES_SCALE_OPTIONS} from 'src/dashboards/constants/cellEditor'

// Components
import {Form, Columns} from 'src/clockface'
import OptIn from 'src/shared/components/OptIn'

interface Props {
  label: string
  bound: string
  scale: string
  onUpdateYAxisBound: (bound: string) => void
}

const {LOG} = AXES_SCALE_OPTIONS
const getInputMin = scale => (scale === LOG ? '0' : null)

class YAxisBound extends PureComponent<Props> {
  public render() {
    const {label, bound, scale, onUpdateYAxisBound} = this.props

    return (
      <Form.Element label={label} colsSM={Columns.Three} colsXS={Columns.Six}>
        <OptIn
          customPlaceholder={'Enter a number'}
          customValue={bound}
          onSetValue={onUpdateYAxisBound}
          type="number"
          min={getInputMin(scale)}
        />
      </Form.Element>
    )
  }
}

export default YAxisBound
