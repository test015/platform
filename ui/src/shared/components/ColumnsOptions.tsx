import React, {Component} from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import DraggableColumn from 'src/shared/components/draggable_column/DraggableColumn'

import {FieldOption} from 'src/types/v2/dashboards'

interface Props {
  columns: FieldOption[]
  onMoveColumn: (dragIndex: number, hoverIndex: number) => void
  onUpdateColumn: (column: FieldOption) => void
}

class ColumnsOptions extends Component<Props> {
  public render() {
    const {columns} = this.props

    return (
      <>
        <label className="form-label">Table Columns</label>
        <div className="logs-options--columns">
          {columns.map((c, i) => this.getDraggableColumn(c, i))}
        </div>
      </>
    )
  }

  private getDraggableColumn(column: FieldOption, i: number): JSX.Element {
    const {onMoveColumn, onUpdateColumn} = this.props
    return (
      <DraggableColumn
        key={column.internalName}
        index={i}
        id={column.internalName}
        internalName={column.internalName}
        displayName={column.displayName}
        visible={column.visible}
        onUpdateColumn={onUpdateColumn}
        onMoveColumn={onMoveColumn}
      />
    )
  }
}

export default DragDropContext(HTML5Backend)(ColumnsOptions)
