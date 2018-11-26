// Libraries
import React, {Component} from 'react'

// Components
import {OverlayContainer, OverlayBody, OverlayHeading} from 'src/clockface'

interface Props {
  note: string
}

interface State {
  noteDraft: string
}

class CellNoteOverlay extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      noteDraft: props.note,
    }
  }

  public render() {
    return (
      <OverlayContainer maxWidth={720}>
        <OverlayHeading title={this.overlayTitle} />
        <OverlayBody>
          <p>sdgdfdg</p>
        </OverlayBody>
      </OverlayContainer>
    )
  }

  private get overlayTitle(): string {
    const {note} = this.props

    if (note) {
      return 'Edit Note'
    }

    return 'Add Note'
  }
}

export default CellNoteOverlay
