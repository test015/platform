import React, {PureComponent} from 'react'
import {Link, withRouter, WithRouterProps} from 'react-router'
import {Dashboard} from 'src/types/v2'

interface Props {
  dashboard: Dashboard
}
class DashboardsCard extends PureComponent<Props & WithRouterProps> {
  private tags = ['first', 'second', 'third']

  public render() {
    const {
      dashboard: {id, name},
    } = this.props

    console.log('dashing', this.props.dashboard)

    return (
      <div className="dashboard-card">
        <div className="dashboard-card--container">
          <div className="dashboard-card--preview" />
          <div className="dashboard-card--content">
            <div className="dashboard-card--header">
              <span className="dashboard-card--owner" />
              <Link to={`/dashboards/${id}?${this.sourceParam}`}>{name}</Link>
            </div>
            <div className="dashboard-card--description">
              <p>
                Distillery church-key narwhal pitchfork hashtag XOXO hella
                organic gochujang pok pok.
              </p>
            </div>
            <div>
              {this.tags.map(tag => (
                <span className="tag-flag" key={`${name}${tag}`}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="dashboard-card--footer">
              <span className="dashboard-card--status">
                status<span className="dashboard-card--status-indicator" />
              </span>
              <span className="dashboard-card--modified">
                Modified 10m ago by UserX
              </span>
            </div>
          </div>
        </div>
      </div>
    )
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
}

export default withRouter(DashboardsCard)
