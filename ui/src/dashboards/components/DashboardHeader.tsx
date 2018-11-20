// Libraries
import React, {Component} from 'react'

// Components
import {Page} from 'src/pageLayout'
import AutoRefreshDropdown from 'src/shared/components/dropdown_auto_refresh/AutoRefreshDropdown'
import TimeRangeDropdown from 'src/shared/components/TimeRangeDropdown'
import GraphTips from 'src/shared/components/graph_tips/GraphTips'
import RenameDashboard from 'src/dashboards/components/rename_dashboard/RenameDashboard'
import {
  Dropdown,
  DropdownMode,
  Button,
  ButtonShape,
  ComponentColor,
  IconFont,
} from 'src/clockface'

// Constants
import {GraphType, GRAPH_TYPES} from 'src/dashboards/graphics/graph'

// Types
import * as AppActions from 'src/types/actions/app'
import * as QueriesModels from 'src/types/queries'
import {Dashboard, DashboardSwitcherLinks} from 'src/types/v2/dashboards'

interface Props {
  activeDashboard: string
  dashboard: Dashboard
  timeRange: QueriesModels.TimeRange
  autoRefresh: number
  handleChooseTimeRange: (timeRange: QueriesModels.TimeRange) => void
  handleChooseAutoRefresh: AppActions.SetAutoRefreshActionCreator
  onManualRefresh: () => void
  handleClickPresentationButton: AppActions.DelayEnablePresentationModeDispatcher
  onAddCell: (viewType: GraphType) => void
  showTemplateControlBar: boolean
  zoomedTimeRange: QueriesModels.TimeRange
  onRenameDashboard: (name: string) => Promise<void>
  dashboardLinks: DashboardSwitcherLinks
  isHidden: boolean
}

class DashboardHeader extends Component<Props> {
  public static defaultProps: Partial<Props> = {
    zoomedTimeRange: {
      upper: null,
      lower: null,
    },
  }

  public render() {
    const {
      handleChooseAutoRefresh,
      onManualRefresh,
      autoRefresh,
      handleChooseTimeRange,
      timeRange: {upper, lower},
      zoomedTimeRange: {upper: zoomedUpper, lower: zoomedLower},
      isHidden,
    } = this.props

    return (
      <Page.Header fullWidth={true} inPresentationMode={isHidden}>
        <Page.Header.Left>{this.dashboardTitle}</Page.Header.Left>
        <Page.Header.Right>
          <GraphTips />
          {this.addCellButton}
          <AutoRefreshDropdown
            onChoose={handleChooseAutoRefresh}
            onManualRefresh={onManualRefresh}
            selected={autoRefresh}
          />
          <TimeRangeDropdown
            onSetTimeRange={handleChooseTimeRange}
            timeRange={{
              upper: zoomedUpper || upper,
              lower: zoomedLower || lower,
            }}
          />
          <Button
            icon={IconFont.ExpandA}
            titleText="Enter Presentation Mode"
            shape={ButtonShape.Square}
            onClick={this.handleClickPresentationButton}
          />
        </Page.Header.Right>
      </Page.Header>
    )
  }

  private handleClickPresentationButton = (): void => {
    this.props.handleClickPresentationButton()
  }

  private get addCellButton(): JSX.Element {
    const {dashboard} = this.props

    if (dashboard) {
      return (
        <Dropdown
          widthPixels={160}
          icon={IconFont.AddCell}
          buttonColor={ComponentColor.Primary}
          titleText="Add a Cell"
          onChange={this.handleAddCell}
          mode={DropdownMode.ActionList}
        >
          {this.organizedViewTypes.map(g => {
            if (g.type === 'divider') {
              return (
                <Dropdown.Divider
                  key={g.menuOption}
                  id={g.menuOption}
                  text={g.menuOption}
                />
              )
            } else {
              return (
                <Dropdown.Item
                  id={`add-cell--${g.menuOption}`}
                  key={`add-cell--${g.menuOption}`}
                  value={g}
                >
                  {g.menuOption}
                </Dropdown.Item>
              )
            }
          })}
        </Dropdown>
      )
    }
  }

  private handleAddCell = (viewType: GraphType): void => {
    const {onAddCell} = this.props

    onAddCell(viewType)
  }

  private get dashboardTitle(): JSX.Element {
    const {dashboard, activeDashboard, onRenameDashboard} = this.props

    if (dashboard) {
      return (
        <RenameDashboard onRename={onRenameDashboard} name={activeDashboard} />
      )
    }

    return <Page.Title title={activeDashboard} />
  }

  private get organizedViewTypes() {
    return [
      {
        type: 'divider',
        menuOption: 'Graphs',
      },
      GRAPH_TYPES[0],
      GRAPH_TYPES[1],
      GRAPH_TYPES[2],
      GRAPH_TYPES[3],
      {
        type: 'divider',
        menuOption: 'Stats',
      },
      GRAPH_TYPES[4],
      GRAPH_TYPES[5],
      GRAPH_TYPES[6],
      {
        type: 'divider',
        menuOption: 'Tabular',
      },
      GRAPH_TYPES[7],
    ]
  }
}

export default DashboardHeader
