// Libraries
import React, {Component} from 'react'

// Components
import {OverlayTechnology} from 'src/clockface'
import CellNoteOverlay from 'src/dashboards/components/cell_note/CellNoteOverlay'

// Types
import {View} from 'src/types/v2'

interface Props {
  view: View
}

enum OverlayState {
  Visible = 'visible',
  Hidden = 'hidden',
}

interface State {
  overlay: OverlayState
}

class NoteEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      overlay: OverlayState.Hidden,
    }
  }

  public render() {
    const {overlay} = this.state

    return (
      <OverlayTechnology visible={overlay === OverlayState.Visible}>
        <CellNoteOverlay note={''} />
      </OverlayTechnology>
    )
  }
}

export default NoteEditor
