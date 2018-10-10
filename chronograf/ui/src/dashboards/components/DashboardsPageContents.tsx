// Libraries
import React, {Component, MouseEvent} from 'react'
import _ from 'lodash'

// Components
// import DashboardsTable from 'src/dashboards/components/DashboardsTable'
import DashboardsDeck from 'src/dashboards/components/DashboardsDeck'

import {Button, ComponentColor, IconFont} from 'src/clockface'

// Decorators
import {ErrorHandling} from 'src/shared/decorators/errors'

// Types
import {Dashboard} from 'src/types/v2'
import {Notification} from 'src/types/notifications'

import {mockdash} from './mockdash'

interface Props {
  dashboards: Dashboard[]
  defaultDashboardLink: string
  onSetDefaultDashboard: (dashboardLink: string) => void
  onDeleteDashboard: (dashboard: Dashboard) => () => void
  onCreateDashboard: () => void
  onCloneDashboard: (
    dashboard: Dashboard
  ) => (event: MouseEvent<HTMLButtonElement>) => void
  onExportDashboard: (dashboard: Dashboard) => () => void
  notify: (message: Notification) => void
  searchTerm: string
}

@ErrorHandling
class DashboardsPageContents extends Component<Props> {
  public render() {
    // const {
    //   onDeleteDashboard,
    //   onCloneDashboard,
    //   onExportDashboard,
    //   defaultDashboardLink,
    //   onSetDefaultDashboard,
    // } = this.props

    return (
      <div className="col-sm-12 col-md-12">
        {this.dashboardsList}
        {/* <DashboardsTable
          dashboards={this.filteredDashboards}
          onDeleteDashboard={onDeleteDashboard}
          onCloneDashboard={onCloneDashboard}
          onExportDashboard={onExportDashboard}
          defaultDashboardLink={defaultDashboardLink}
          onSetDefaultDashboard={onSetDefaultDashboard}
          onCreateDashboard={onCreateDashboard}
          searchTerm={searchTerm}
        /> */}
      </div>
    )
  }

  private get dashboardsList(): JSX.Element {
    const {dashboards, onCreateDashboard} = this.props

    if (dashboards.length < 1) {
      return (
        <>
          <h4>Looks like you don't have any dashboards...</h4>
          <br />
          <Button
            text="Create a Dashboard"
            icon={IconFont.Plus}
            color={ComponentColor.Primary}
            onClick={onCreateDashboard}
          />
        </>
      )
    }

    return (
      <DashboardsDeck dashboards={[mockdash, ...this.filteredDashboards]} />
    )
  }

  private get filteredDashboards(): Dashboard[] {
    const {dashboards, searchTerm} = this.props

    const matchingDashboards = dashboards.filter(d =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return _.sortBy(matchingDashboards, d => d.name.toLowerCase())
  }
}

export default DashboardsPageContents
