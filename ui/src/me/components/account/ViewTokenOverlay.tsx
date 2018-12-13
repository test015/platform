// Libraries
import React, {PureComponent} from 'react'

// Components
import {OverlayContainer, OverlayBody, OverlayHeading} from 'src/clockface'

// Types
import {Authorization} from 'src/api'

interface Props {
  auth: Authorization
  onDismissOverlay: () => void
}

export default class ViewTokenOverlay extends PureComponent<Props> {
  public render() {
    const {description} = this.props.auth
    return (
      <OverlayContainer>
        <OverlayHeading title={description} onDismiss={this.handleDismiss} />
        <OverlayBody>
          <pre>{JSON.stringify(this.props.auth, null, 2)}</pre>
        </OverlayBody>
      </OverlayContainer>
    )
  }

  private handleDismiss = () => {
    this.props.onDismissOverlay()
  }
}
