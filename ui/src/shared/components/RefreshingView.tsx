// Libraries
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'

// Components
import LineGraph from 'src/shared/components/LineGraph'
import StepPlot from 'src/shared/components/StepPlot'
import Stacked from 'src/shared/components/Stacked'
import GaugeChart from 'src/shared/components/GaugeChart'
import SingleStat from 'src/shared/components/SingleStat'
import TimeSeries from 'src/shared/components/TimeSeries'
import SingleStatTransform from 'src/shared/components/SingleStatTransform'
import TimeMachineTables from 'src/shared/components/tables/TimeMachineTables'
import EmptyGraphMessage from 'src/shared/components/EmptyGraphMessage'

// Constants
import {emptyGraphCopy} from 'src/shared/copy/cell'

// Actions
import {setHoverTime} from 'src/dashboards/actions/v2/hoverTime'

// Types
import {TimeRange} from 'src/types'
import {AppState} from 'src/types/v2'
import {DashboardQuery} from 'src/types/v2/dashboards'
import {
  RefreshingViewProperties,
  ViewType,
  LineView,
  SingleStatView,
} from 'src/types/v2/dashboards'
import {RemoteDataState} from 'src/types'

interface OwnProps {
  timeRange: TimeRange
  viewID: string
  inView: boolean
  manualRefresh: number
  onZoom: (range: TimeRange) => void
  properties: RefreshingViewProperties
}

interface StateProps {
  link: string
}

interface DispatchProps {
  handleSetHoverTime: typeof setHoverTime
}

type Props = OwnProps & StateProps & DispatchProps

class RefreshingView extends PureComponent<Props> {
  public static defaultProps: Partial<Props> = {
    inView: true,
    manualRefresh: 0,
  }

  public render() {
    const {
      link,
      inView,
      onZoom,
      viewID,
      timeRange,
      properties,
      manualRefresh,
      handleSetHoverTime,
    } = this.props

    if (!properties.queries.length) {
      return <EmptyGraphMessage message={emptyGraphCopy} />
    }

    return (
      <TimeSeries
        link={link}
        inView={inView}
        queries={this.queries}
        key={manualRefresh}
      >
        {({tables, loading, isInitialFetch}) => {
          if (isInitialFetch && loading === RemoteDataState.Loading) {
            return <EmptyGraphMessage message="Loading..." />
          }

          if (!tables.some(d => !!d.data.length)) {
            return <EmptyGraphMessage message="No Results" />
          }

          switch (properties.type) {
            case ViewType.SingleStat:
              return (
                <SingleStatTransform tables={tables}>
                  {stat => <SingleStat stat={stat} properties={properties} />}
                </SingleStatTransform>
              )
            case ViewType.Table:
              return (
                <TimeMachineTables tables={tables} properties={properties} />
              )
            case ViewType.Gauge:
              return (
                <GaugeChart
                  tables={tables}
                  key={manualRefresh}
                  properties={properties}
                />
              )
            case ViewType.Line:
              return (
                <LineGraph
                  tables={tables}
                  viewID={viewID}
                  onZoom={onZoom}
                  loading={loading}
                  timeRange={timeRange}
                  properties={properties}
                  handleSetHoverTime={handleSetHoverTime}
                />
              )
            case ViewType.LinePlusSingleStat:
              const lineProperties = {
                ...properties,
                type: ViewType.Line,
              } as LineView

              const singleStatProperties = {
                ...properties,
                type: ViewType.SingleStat,
              } as SingleStatView

              return (
                <LineGraph
                  tables={tables}
                  viewID={viewID}
                  onZoom={onZoom}
                  loading={loading}
                  timeRange={timeRange}
                  properties={lineProperties}
                  handleSetHoverTime={handleSetHoverTime}
                >
                  <SingleStatTransform tables={tables}>
                    {stat => (
                      <SingleStat
                        stat={stat}
                        properties={singleStatProperties}
                      />
                    )}
                  </SingleStatTransform>
                </LineGraph>
              )
            case ViewType.StepPlot:
              return (
                <StepPlot
                  tables={tables}
                  viewID={viewID}
                  onZoom={onZoom}
                  loading={loading}
                  timeRange={timeRange}
                  properties={properties}
                  handleSetHoverTime={handleSetHoverTime}
                />
              )
            case ViewType.Stacked:
              return (
                <Stacked
                  tables={tables}
                  viewID={viewID}
                  onZoom={onZoom}
                  loading={loading}
                  timeRange={timeRange}
                  properties={properties}
                  handleSetHoverTime={handleSetHoverTime}
                />
              )
            default:
              return <div>YO!</div>
          }
        }}
      </TimeSeries>
    )
  }

  private get queries(): DashboardQuery[] {
    const {properties} = this.props
    const {type, queries} = properties

    if (type === ViewType.SingleStat) {
      return [queries[0]]
    }

    if (type === ViewType.Gauge) {
      return [queries[0]]
    }

    return queries
  }
}

const mstp = ({source}: AppState): StateProps => {
  const link = source.links.query

  return {
    link,
  }
}

const mdtp = {
  handleSetHoverTime: setHoverTime,
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mstp,
  mdtp
)(RefreshingView)
