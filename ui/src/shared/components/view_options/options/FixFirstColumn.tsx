import React, {SFC} from 'react'

import {Input, InputType, Form, Columns} from 'src/clockface'

interface Props {
  fixed: boolean
  onToggleFixFirstColumn: () => void
}

const GraphOptionsFixFirstColumn: SFC<Props> = ({
  fixed,
  onToggleFixFirstColumn,
}) => (
  <div className="form-group col-xs-12">
    <Form.Element colsXS={Columns.Twelve} label="Lock First Column">
      <Input
        type={InputType.Checkbox}
        checked={!!fixed}
        onChange={onToggleFixFirstColumn}
      />
    </Form.Element>
  </div>
)

export default GraphOptionsFixFirstColumn
