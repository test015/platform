// Libraries
import React, {PureComponent} from 'react'

// Components
import DataExplorer from 'src/dataExplorer/components/DataExplorer'
import TimeMachineTabs from 'src/shared/components/TimeMachineTabs'
import {Page} from 'src/pageLayout'
import Threesizinator from 'src/shared/components/Threesizinator'

interface State {
  handlePositions: number[]
}

class DataExplorerPage extends PureComponent<{}, State> {
  public state: State = {handlePositions: [0.2, 0.4, 0.8, 0.9]}

  public render() {
    return (
      <Page>
        <Page.Header fullWidth={true}>
          <Page.Header.Left>
            <Page.Title title="Data Explorer" />
          </Page.Header.Left>
          <Page.Header.Center>
            <TimeMachineTabs />
          </Page.Header.Center>
          <Page.Header.Right />
        </Page.Header>
        <Page.Contents fullWidth={true} scrollable={false}>
          <Threesizinator
            handlePositions={this.state.handlePositions}
            onSetHandlePositions={this.handleSetHandlePositions}
          />
        </Page.Contents>
      </Page>
    )
  }

  private handleSetHandlePositions = (handlePositions: number[]) => {
    this.setState({handlePositions})
  }
}

export default DataExplorerPage
