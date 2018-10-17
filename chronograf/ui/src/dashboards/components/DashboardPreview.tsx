// libraires
import React, {PureComponent} from 'react'

// Components
import CellTypeBar from './dashboard_icons/CellTypeBar'

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
                >
                  {this.cellType(cell)}
                </div>
              )
            }

            return null
          })}
        </div>
      )
    }

    return <span className="dashboard-preview--no-cells">no cells</span>
  }

  private cellType = (cell: Cell): JSX.Element => {
    switch (cell.viewType) {
      case 'bar':
      case 'line':
      case 'stacked':
      case 'step-plot':
      case 'line-plus-single-stat':
      case 'table':
      case 'markdown':
      case 'log-viewer':
        return (
          <div className="cell-type">
            <CellTypeBar ratio={cell.w / cell.h} />
          </div>
        )
      case 'single-stat':
      case 'gauge':
      default:
        return <div className={`cell-type ${cell.viewType}`} />
    }
  }
}
export default DashboardPreview

// export enum ViewType {
//   Bar = 'bar',
//   Line = 'line',
//   Stacked = 'stacked',
//   StepPlot = 'step-plot',
//   LinePlusSingleStat = 'line-plus-single-stat',
//   SingleStat = 'single-stat',
//   Gauge = 'gauge',
//   Table = 'table',
//   Markdown = 'markdown',
//   LogViewer = 'log-viewer',
// }
