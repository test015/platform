// libraires
import React, {PureComponent} from 'react'

// types
import {Cell} from 'src/types/v2'

interface Props {
  cells: Cell[]
}

class DashboardPreview extends PureComponent<Props> {
  public render() {
    return <div className="dashboard-preview">{this.layout}</div>
  }

  private get layout(): JSX.Element {
    const {cells} = this.props

    if (cells.length) {
      return (
        <div className="dashboard-preview--layout">
          {cells.map(cell => {
            const {id, x, y, w, h} = cell

            if (y + 1 < 11) {
              return (
                <div
                  key={id}
                  className="dashboard-preview--cell"
                  style={{
                    gridRowStart: y + 1,
                    gridColumnStart: x + 1,
                    gridRowEnd: Math.min(y + h + 1, 11),
                    gridColumnEnd: x + w + 1,
                  }}
                />
              )
            }

            return null
          })}
        </div>
      )
    }

    return <span className="dashboard-preview--no-cells">no cells</span>
  }
}
export default DashboardPreview
