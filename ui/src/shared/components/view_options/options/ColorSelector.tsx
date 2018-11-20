// Libraries
import React, {PureComponent} from 'react'

// Components
import {Form, Columns} from 'src/clockface'
import ColorScaleDropdown from 'src/shared/components/ColorScaleDropdown'

// Types
import {Color} from 'src/types/colors'
import {ErrorHandling} from 'src/shared/decorators/errors'

interface Props {
  colors: Color[]
  onUpdateColors: (colors: Color[]) => void
}

@ErrorHandling
class LineGraphColorSelector extends PureComponent<Props> {
  public render() {
    const {colors} = this.props

    return (
      <Form.Element label="Line Colors" colsSM={Columns.Three}>
        <ColorScaleDropdown
          onChoose={this.handleSelectColors}
          stretchToFit={true}
          selected={colors}
        />
      </Form.Element>
    )
  }

  public handleSelectColors = (colorScale): void => {
    const {onUpdateColors} = this.props
    const {colors} = colorScale

    onUpdateColors(colors)
  }
}

export default LineGraphColorSelector
