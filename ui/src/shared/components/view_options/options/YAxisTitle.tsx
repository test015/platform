// Libraries
import React, {PureComponent} from 'react'

// Components
import {Form, Columns} from 'src/clockface'
import OptIn from 'src/shared/components/OptIn'

interface Props {
  label: string
  onUpdateYAxisLabel: (label: string) => void
}
class YAxisTitle extends PureComponent<Props> {
  public render() {
    const {label, onUpdateYAxisLabel} = this.props

    return (
      <Form.Element label="Title" colsSM={Columns.Three}>
        <OptIn
          type="text"
          customValue={label}
          onSetValue={onUpdateYAxisLabel}
          customPlaceholder={this.defaultYLabel || 'y-axis title'}
        />
      </Form.Element>
    )
  }

  private get defaultYLabel() {
    return ''
  }
}

export default YAxisTitle
