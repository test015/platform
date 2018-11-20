// Libraries
import React, {PureComponent} from 'react'

// Components
import {Form, Columns, Radio, ButtonShape} from 'src/clockface'

// Constants
import {AXES_SCALE_OPTIONS} from 'src/dashboards/constants/cellEditor'

interface Props {
  scale: string
  onUpdateYAxisScale: (scale: string) => void
}

const {LINEAR, LOG} = AXES_SCALE_OPTIONS

class YAxisBase extends PureComponent<Props> {
  public render() {
    const {scale, onUpdateYAxisScale} = this.props

    return (
      <Form.Element label="Scale" colsSM={Columns.Three}>
        <Radio shape={ButtonShape.StretchToFit}>
          <Radio.Button
            id="y-scale-tab--linear"
            value={LINEAR}
            active={scale === LINEAR || scale === ''}
            titleText="Set Y-Axis to Linear Scale"
            onClick={onUpdateYAxisScale}
          >
            Linear
          </Radio.Button>
          <Radio.Button
            id="y-scale-tab--logarithmic"
            value={LOG}
            active={scale === LOG}
            titleText="Set Y-Axis to Logarithmic Scale"
            onClick={onUpdateYAxisScale}
          >
            Logarithmic
          </Radio.Button>
        </Radio>
      </Form.Element>
    )
  }
}

export default YAxisBase
