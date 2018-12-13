// Libraries
import React, {Component} from 'react'
import {connect} from 'react-redux'

// Components
import DecimalPlacesOption from 'src/shared/components/view_options/options/DecimalPlaces'
import ThresholdList from 'src/shared/components/view_options/options/ThresholdList'

// Actions
import {setDecimalPlaces, setColors} from 'src/shared/actions/v2/timeMachines'

// Utils
import {getActiveTimeMachine} from 'src/shared/selectors/timeMachines'

// Decorators
import {ErrorHandling} from 'src/shared/decorators/errors'

// Types
import {AppState, NewView} from 'src/types/v2'
import {DecimalPlaces, TableView} from 'src/types/v2/dashboards'
import {Color, ColorConfig} from 'src/types/colors'

interface StateProps {
  colors: Color[]
  decimalPlaces: DecimalPlaces
}

interface DispatchProps {
  onSetDecimalPlaces: typeof setDecimalPlaces
  onSetColors: typeof setColors
}

type Props = DispatchProps & StateProps

@ErrorHandling
export class TableOptions extends Component<Props, {}> {
  public render() {
    const {onSetDecimalPlaces, decimalPlaces, colors, onSetColors} = this.props
    const colorConfigs: ColorConfig[] = colors.map(color => ({
      color,
    }))

    return (
      <>
        <div className="col-xs-6">
          <h5 className="display-options--header">Table Controls</h5>
          {decimalPlaces && (
            <DecimalPlacesOption
              digits={decimalPlaces.digits}
              isEnforced={decimalPlaces.isEnforced}
              onDecimalPlacesChange={onSetDecimalPlaces}
            />
          )}
          <ThresholdList
            colorConfigs={colorConfigs}
            onUpdateColors={onSetColors}
            onValidateNewColor={() => true}
          />
        </div>
      </>
    )
  }
}

const mstp = (state: AppState) => {
  const view = getActiveTimeMachine(state).view as NewView<TableView>
  const {colors, decimalPlaces} = view.properties

  return {colors, decimalPlaces}
}

const mdtp: DispatchProps = {
  onSetDecimalPlaces: setDecimalPlaces,
  onSetColors: setColors,
}

export default connect<StateProps, DispatchProps>(
  mstp,
  mdtp
)(TableOptions)
