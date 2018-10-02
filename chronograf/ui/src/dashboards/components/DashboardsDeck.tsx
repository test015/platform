import React, {PureComponent} from 'react'
import DashboardsCard from 'src/dashboards/components/DashboardCard'

import {Dashboard} from 'src/types/v2'

interface Props {
  dashboards: Dashboard[]
}

class DashboardsDeck extends PureComponent<Props> {
  public render() {
    return <div className="dashboard-deck">{this.dashboardCards}</div>
  }

  private get dashboardCards(): JSX.Element | JSX.Element[] {
    const {dashboards} = this.props

    if (dashboards) {
      return dashboards.map(d => (
        <DashboardsCard key={`${d.id}`} dashboard={d} />
      ))
    }

    return <h4>No dashboards match your search term.</h4>
  }
}

export default DashboardsDeck
