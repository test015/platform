// Libraries
import React, {Component} from 'react'
import {connect} from 'react-redux'

// Components
import DecimalPlacesOption from 'src/shared/components/view_options/options/DecimalPlaces'
import ThresholdList from 'src/shared/components/view_options/options/ThresholdList'
import ColumnOptions from 'src/shared/components/columns_options/ColumnsOptions'
import FixFirstColumn from 'src/shared/components/view_options/options/FixFirstColumn'
import TimeFormat from 'src/shared/components/view_options/options/TimeFormat'
import TimeAxis from 'src/shared/components/view_options/options/TimeAxis'
import SortBy from 'src/shared/components/view_options/options/SortBy'

// Constants
import {THRESHOLD_TYPE_BASE} from 'src/shared/constants/thresholds'

// Actions
import {
  setDecimalPlaces,
  setColors,
  setFieldOptions,
  setTableOptions,
  setTimeFormat,
} from 'src/shared/actions/v2/timeMachines'

// Utils
import {getActiveTimeMachine} from 'src/shared/selectors/timeMachines'

// Decorators
import {ErrorHandling} from 'src/shared/decorators/errors'

// Types
import {AppState, NewView} from 'src/types/v2'
import {
  DecimalPlaces,
  TableView,
  FieldOption,
  TableOptions as ViewTableOptions,
} from 'src/types/v2/dashboards'
import {Color, ColorConfig} from 'src/types/colors'
import {move} from 'src/shared/utils/move'

interface StateProps {
  colors: Color[]
  timeFormat: string
  fieldOptions: FieldOption[]
  decimalPlaces: DecimalPlaces
  tableOptions: ViewTableOptions
}

interface DispatchProps {
  onSetColors: typeof setColors
  onSetTimeFormat: typeof setTimeFormat
  onSetFieldOptions: typeof setFieldOptions
  onSetTableOptions: typeof setTableOptions
  onSetDecimalPlaces: typeof setDecimalPlaces
}

type Props = DispatchProps & StateProps

@ErrorHandling
export class TableOptions extends Component<Props, {}> {
  public render() {
    const {
      timeFormat,
      onSetColors,
      fieldOptions,
      tableOptions,
      decimalPlaces,
      onSetTimeFormat,
      onSetDecimalPlaces,
    } = this.props

    const {fixFirstColumn, verticalTimeAxis, sortBy} = tableOptions

    return (
      <>
        <div className="col-xs-6">
          <h5 className="display-options--header">Table Controls</h5>
          <SortBy
            selected={sortBy}
            fieldOptions={fieldOptions}
            onChange={this.handleChangeSortBy}
          />
          <TimeFormat
            timeFormat={timeFormat}
            onTimeFormatChange={onSetTimeFormat}
          />
          <FixFirstColumn
            fixed={fixFirstColumn}
            onToggleFixFirstColumn={this.handleToggleFixFirstColumn}
          />
          {decimalPlaces && (
            <DecimalPlacesOption
              digits={decimalPlaces.digits}
              isEnforced={decimalPlaces.isEnforced}
              onDecimalPlacesChange={onSetDecimalPlaces}
            />
          )}
          <TimeAxis
            verticalTimeAxis={verticalTimeAxis}
            onToggleVerticalTimeAxis={this.handleToggleVerticalTimeAxis}
          />
          <ColumnOptions
            columns={fieldOptions}
            onMoveColumn={this.handleMoveColumn}
            onUpdateColumn={this.handleUpdateColumn}
          />
          <ThresholdList
            colorConfigs={this.colorConfigs}
            onUpdateColors={onSetColors}
            onValidateNewColor={() => true}
          />
        </div>
      </>
    )
  }

  private handleChangeSortBy = (sortBy: FieldOption) => {
    const {tableOptions, onSetTableOptions} = this.props
    onSetTableOptions({...tableOptions, sortBy})
  }

  private handleMoveColumn = (dragIndex: number, hoverIndex: number) => {
    const fieldOptions = move(this.props.fieldOptions, dragIndex, hoverIndex)
    this.props.onSetFieldOptions(fieldOptions)
  }

  private handleUpdateColumn = (fieldOption: FieldOption) => {
    const {internalName} = fieldOption
    const fieldOptions = this.props.fieldOptions.map(
      fopt => (fopt.internalName === internalName ? fieldOption : fopt)
    )

    this.props.onSetFieldOptions(fieldOptions)
  }

  private handleToggleFixFirstColumn = () => {
    const {onSetTableOptions, tableOptions} = this.props
    const fixFirstColumn = !tableOptions.fixFirstColumn
    onSetTableOptions({...tableOptions, fixFirstColumn})
  }

  private handleToggleVerticalTimeAxis = (verticalTimeAxis: boolean): void => {
    const {tableOptions, onSetTableOptions} = this.props
    onSetTableOptions({...tableOptions, verticalTimeAxis})
  }

  private get colorConfigs(): ColorConfig[] {
    return this.props.colors.map(color => {
      const isBase = color.id === THRESHOLD_TYPE_BASE

      const config: ColorConfig = {
        color,
        isBase,
      }

      if (isBase) {
        config.label = 'Base'
      }

      return config
    })
  }
}

const mstp = (state: AppState) => {
  const view = getActiveTimeMachine(state).view as NewView<TableView>
  const {
    colors,
    decimalPlaces,
    fieldOptions,
    tableOptions,
    timeFormat,
  } = view.properties

  return {colors, decimalPlaces, fieldOptions, tableOptions, timeFormat}
}

const mdtp: DispatchProps = {
  onSetDecimalPlaces: setDecimalPlaces,
  onSetColors: setColors,
  onSetFieldOptions: setFieldOptions,
  onSetTableOptions: setTableOptions,
  onSetTimeFormat: setTimeFormat,
}

export default connect<StateProps, DispatchProps>(
  mstp,
  mdtp
)(TableOptions)
