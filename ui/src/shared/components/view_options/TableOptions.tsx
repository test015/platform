// Libraries
import React, {Component} from 'react'
import {connect} from 'react-redux'

// Components
import DecimalPlacesOption from 'src/shared/components/view_options/options/DecimalPlaces'
import ThresholdList from 'src/shared/components/view_options/options/ThresholdList'
import ColumnOptions from 'src/shared/components/ColumnsOptions'
import FixFirstColumn from 'src/shared/components/view_options/options/FixFirstColumn'

// Actions
import {
  setDecimalPlaces,
  setColors,
  setFieldOptions,
  setTableOptions,
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
  decimalPlaces: DecimalPlaces
  fieldOptions: FieldOption[]
  tableOptions: ViewTableOptions
}

interface DispatchProps {
  onSetDecimalPlaces: typeof setDecimalPlaces
  onSetColors: typeof setColors
  onSetFieldOptions: typeof setFieldOptions
  onSetTableOptions: typeof setTableOptions
}

type Props = DispatchProps & StateProps

@ErrorHandling
export class TableOptions extends Component<Props, {}> {
  public render() {
    const {
      onSetDecimalPlaces,
      decimalPlaces,
      colors,
      onSetColors,
      fieldOptions,
      tableOptions,
    } = this.props

    const {fixFirstColumn} = tableOptions
    const colorConfigs: ColorConfig[] = colors.map(color => ({
      color,
    }))

    return (
      <>
        <div className="col-xs-6">
          <h5 className="display-options--header">Table Controls</h5>
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
          <ColumnOptions
            columns={fieldOptions}
            onMoveColumn={this.handleMoveColumn}
            onUpdateColumn={this.handleUpdateColumn}
          />
          <ThresholdList
            colorConfigs={colorConfigs}
            onUpdateColors={onSetColors}
            onValidateNewColor={() => true}
          />
        </div>
      </>
    )
  }

  private handleMoveColumn = (dragIndex, hoverIndex) => {
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
}

const mstp = (state: AppState) => {
  const view = getActiveTimeMachine(state).view as NewView<TableView>
  const {colors, decimalPlaces, fieldOptions, tableOptions} = view.properties

  return {colors, decimalPlaces, fieldOptions, tableOptions}
}

const mdtp: DispatchProps = {
  onSetDecimalPlaces: setDecimalPlaces,
  onSetColors: setColors,
  onSetFieldOptions: setFieldOptions,
  onSetTableOptions: setTableOptions,
}

export default connect<StateProps, DispatchProps>(
  mstp,
  mdtp
)(TableOptions)
