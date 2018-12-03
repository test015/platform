import React, {PureComponent} from 'react'
import classnames from 'classnames'

import 'src/shared/components/Threesizinator.scss'

interface Props {
  handlePositions: number[]
  onSetHandlePositions: (value: number[]) => void
}

interface State {
  isDragging: boolean
}

class Threesizinator extends PureComponent<Props, State> {
  public state: State = {isDragging: false}

  private container = React.createRef<HTMLDivElement>()
  private dragIndex: number = 0

  public render() {
    const [p0, p1, p2, p3] = this.props.handlePositions

    const f0 = p0
    const f1 = p1 - p0
    const f2 = p2 - p1
    const f3 = p3 - p2
    const f4 = 1 - p3

    return (
      <div ref={this.container} className={this.containerClass}>
        <div className="threesizinator--division" style={{flexGrow: f0}} />
        <div
          className="threesizinator--handle"
          data-drag-index={0}
          onMouseDown={this.handleMouseDown}
        />
        <div className="threesizinator--division" style={{flexGrow: f1}} />
        <div
          className="threesizinator--handle"
          data-drag-index={1}
          onMouseDown={this.handleMouseDown}
        />
        <div className="threesizinator--division" style={{flexGrow: f2}} />
        <div
          className="threesizinator--handle"
          data-drag-index={2}
          onMouseDown={this.handleMouseDown}
        />
        <div className="threesizinator--division" style={{flexGrow: f3}} />
        <div
          className="threesizinator--handle"
          data-drag-index={3}
          onMouseDown={this.handleMouseDown}
        />
        <div className="threesizinator--division" style={{flexGrow: f4}} />
      </div>
    )
  }

  private get containerClass() {
    const containerClass = classnames('threesizinator threesizinator__row', {
      threesizinator__dragging: this.state.isDragging,
    })

    return containerClass
  }

  private handleMouseDown = e => {
    this.dragIndex = +e.target.dataset.dragIndex
    this.setState({isDragging: true})

    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  private handleMouseUp = () => {
    this.setState({isDragging: false})

    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  private handleDrag = e => {
    const {handlePositions, onSetHandlePositions} = this.props
    const {x, width} = this.container.current.getBoundingClientRect() as DOMRect

    // The `x` position of the mouse relative to the `.threesiznator` container
    let mouseXRelative = e.pageX - x

    // Clamp `mouseXRelative` to the container
    if (mouseXRelative < 0) {
      mouseXRelative = 0
    } else if (mouseXRelative > width) {
      mouseXRelative = width
    }

    const newPos = mouseXRelative / width
    const newPositions = [...handlePositions]

    // Update the position of the handle being dragged
    newPositions[this.dragIndex] = newPos

    // If the new position of the handle being dragged is greater than
    // subsequent handles on the right, set them all to the new position to
    // acheive the collapsing / “accordian” effect
    for (let i = this.dragIndex + 1; i < newPositions.length; i++) {
      if (newPos > newPositions[i]) {
        newPositions[i] = newPos
      }
    }

    // Do something similar for handles on the left
    for (let i = 0; i < this.dragIndex; i++) {
      if (newPos < newPositions[i]) {
        newPositions[i] = newPos
      }
    }

    onSetHandlePositions(newPositions)
  }
}

export default Threesizinator
