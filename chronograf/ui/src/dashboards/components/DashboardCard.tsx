// Libraries
import React, {PureComponent} from 'react'
import moment from 'moment'
import {Link, withRouter, WithRouterProps} from 'react-router'
import classnames from 'classnames'

// Components
import DashboardPreview from 'src/dashboards/components/DashboardPreview'
import Avatar from 'src/shared/components/avatar/Avatar'
import DashboardCardMenu from 'src/dashboards/components/DashboardCardMenu'
import {Label} from 'src/clockface'

// MOCK DATA
import {LeroyJenkins} from 'src/user/mockUserData'

// Types
import {Dashboard} from 'src/types/v2'

interface Props {
  dashboard: Dashboard
  onDeleteDashboard: () => void
  onCloneDashboard: () => void
  onExportDashboard: () => void
}
class DashboardsCard extends PureComponent<Props & WithRouterProps> {
  public render() {
    const {
      dashboard: {id, name, cells, modified, description},
      onDeleteDashboard,
      onCloneDashboard,
      onExportDashboard,
    } = this.props

    return (
      <div className="dashboard-card">
        <div className="dashboard-card--container">
          <DashboardPreview cells={cells} />
          <div className="dashboard-card--content">
            <div className="dashboard-card--header">
              <Avatar
                imageURI={LeroyJenkins.avatar}
                diameterPixels={20}
                customClass="dashboard-card--owner"
              />
              <Link to={`/dashboards/${id}?${this.sourceParam}`}>{name}</Link>
              <DashboardCardMenu
                dashboard={this.props.dashboard}
                onDelete={onDeleteDashboard}
                onClone={onCloneDashboard}
                onExport={onExportDashboard}
              />
            </div>
            <div className="dashboard-card--description">
              <p>{description}</p>
            </div>
            <div className="dashboard-card--labels">{this.labels}</div>
            <div className="dashboard-card--footer">
              <span className="dashboard-card--status">
                status <span className={this.statusClassNames} />
              </span>
              <span className="dashboard-card--modified">
                {modified &&
                  `Modified ${moment(modified.date).fromNow()} by ${
                    modified.userID
                  }`}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  private get statusClassNames(): string {
    const {
      dashboard: {connected},
    } = this.props

    return classnames('dashboard-card--status-indicator', {
      'status-connected': connected,
    })
  }

  private get sourceParam(): string {
    const {
      location: {query},
    } = this.props

    if (!query.sourceID) {
      return ''
    }

    return `sourceID=${query.sourceID}`
  }

  private get labels(): JSX.Element[] {
    const {
      dashboard: {id, labels},
    } = this.props

    if (labels) {
      return labels.map(label => (
        <Label
          key={`${id}_${label.name}`}
          text={label.name}
          color={label.color}
        />
      ))
    }
  }
}

export default withRouter(DashboardsCard)
