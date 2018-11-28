// Libraries
import React, {PureComponent} from 'react'
import {withRouter, WithRouterProps} from 'react-router'

import {connect} from 'react-redux'
import _ from 'lodash'

// Components
import {ErrorHandling} from 'src/shared/decorators/errors'
import {
  WizardFullScreen,
  WizardProgressHeader,
  ProgressBar,
} from 'src/clockface'
import OnboardingStepSwitcher from 'src/onboarding/components/OnboardingStepSwitcher'

// Actions
import {notify as notifyAction} from 'src/shared/actions/notifications'
import {
  setSetupParams,
  incrementCurrentStepIndex,
  decrementCurrentStepIndex,
  setCurrentStepIndex,
  setStepStatus,
} from 'src/onboarding/actions/steps'
import {
  addDataSource,
  removeDataSource,
  setDataSources,
  setActiveDataSource,
} from 'src/onboarding/actions/dataSources'

// Constants
import {StepStatus} from 'src/clockface/constants/wizard'

// Types
import {Links} from 'src/types/v2/links'
import {SetupParams} from 'src/onboarding/apis'
import {DataSource} from 'src/types/v2/dataSources'
import {Notification, NotificationFunc} from 'src/types'
import {AppState} from 'src/types/v2'
import OnboardingSideBar from 'src/onboarding/components/OnboardingSideBar'

export interface OnboardingStepProps {
  links: Links
  currentStepIndex: number
  onSetCurrentStepIndex: (stepNumber: number) => void
  onIncrementCurrentStepIndex: () => void
  onDecrementCurrentStepIndex: () => void
  handleSetStepStatus: (index: number, status: StepStatus) => void
  stepStatuses: StepStatus[]
  stepTitles: string[]
  setupParams: SetupParams
  handleSetSetupParams: (setupParams: SetupParams) => void
  notify: (message: Notification | NotificationFunc) => void
  onCompleteSetup: () => void
  onExit: () => void
}

interface OwnProps {
  startStep?: number
  stepStatuses?: StepStatus[]
  onCompleteSetup: () => void
}

interface DispatchProps {
  notify: (message: Notification | NotificationFunc) => void
  onSetSetupParams: typeof setSetupParams
  onIncrementCurrentStepIndex: typeof incrementCurrentStepIndex
  onDecrementCurrentStepIndex: typeof decrementCurrentStepIndex
  onSetCurrentStepIndex: typeof setCurrentStepIndex
  onSetStepStatus: typeof setStepStatus
  onAddDataSource: typeof addDataSource
  onRemoveDataSource: typeof removeDataSource
  onSetDataSources: typeof setDataSources
  onSetActiveDataSource: typeof setActiveDataSource
}

interface StateProps {
  links: Links
  currentStepIndex: number
  stepStatuses: StepStatus[]
  setupParams: SetupParams
  dataSources: DataSource[]
}

type Props = OwnProps & StateProps & DispatchProps & WithRouterProps

@ErrorHandling
class OnboardingWizard extends PureComponent<Props> {
  public stepTitles = [
    'Welcome',
    'Admin Setup',
    'Select Data Sources',
    'Configure Data Sources',
    'Complete',
  ]

  public stepSkippable = [false, false, false, false, false]

  constructor(props: Props) {
    super(props)
    this.state = {
      dataSources: [],
    }
  }

  public render() {
    const {
      currentStepIndex,
      dataSources,
      onRemoveDataSource,
      onAddDataSource,
      onSetDataSources,
      setupParams,
    } = this.props

    return (
      <WizardFullScreen>
        {this.progressHeader}
        <div className="wizard-step--container">
          <OnboardingSideBar
            dataSources={dataSources}
            onTabClick={this.handleClickSideBarTab}
            title="Selected Sources"
            visible={this.sideBarVisible}
          />
          <OnboardingStepSwitcher
            currentStepIndex={currentStepIndex}
            onboardingStepProps={this.onboardingStepProps}
            setupParams={setupParams}
            dataSources={dataSources}
            onAddDataSource={onAddDataSource}
            onRemoveDataSource={onRemoveDataSource}
            onSetDataSources={onSetDataSources}
          />
        </div>
      </WizardFullScreen>
    )
  }

  private get progressHeader(): JSX.Element {
    const {
      stepStatuses,
      currentStepIndex,
      onIncrementCurrentStepIndex,
      onSetCurrentStepIndex,
    } = this.props

    if (
      currentStepIndex === 0 ||
      currentStepIndex === stepStatuses.length - 1
    ) {
      return <div className="wizard--progress-header hidden" />
    }

    return (
      <WizardProgressHeader
        currentStepIndex={currentStepIndex}
        stepSkippable={this.stepSkippable}
        onSkip={onIncrementCurrentStepIndex}
      >
        <ProgressBar
          currentStepIndex={currentStepIndex}
          handleSetCurrentStep={onSetCurrentStepIndex}
          stepStatuses={stepStatuses}
          stepTitles={this.stepTitles}
        />
      </WizardProgressHeader>
    )
  }

  private get sideBarVisible() {
    const {currentStepIndex, dataSources} = this.props
    return (
      currentStepIndex === 3 ||
      (currentStepIndex === 2 && dataSources.length > 0)
    )
  }

  private handleClickSideBarTab = (dataSourceID: string) => {
    const {onSetCurrentStepIndex, onSetActiveDataSource} = this.props
    onSetCurrentStepIndex(3)
    onSetActiveDataSource(dataSourceID)
  }

  private handleExit = () => {
    const {router, onCompleteSetup} = this.props
    onCompleteSetup()
    router.push(`/sources`)
  }

  private get onboardingStepProps(): OnboardingStepProps {
    const {
      stepStatuses,
      links,
      notify,
      onCompleteSetup,
      setupParams,
      currentStepIndex,
      onSetStepStatus,
      onSetSetupParams,
      onSetCurrentStepIndex,
      onDecrementCurrentStepIndex,
      onIncrementCurrentStepIndex,
    } = this.props

    return {
      stepStatuses,
      stepTitles: this.stepTitles,
      currentStepIndex,
      onSetCurrentStepIndex,
      onIncrementCurrentStepIndex,
      onDecrementCurrentStepIndex,
      handleSetStepStatus: onSetStepStatus,
      links,
      setupParams,
      handleSetSetupParams: onSetSetupParams,
      notify,
      onCompleteSetup,
      onExit: this.handleExit,
    }
  }
}

const mstp = ({
  links,
  onboarding: {
    steps: {currentStepIndex, stepStatuses, setupParams},
    dataSources,
  },
}: AppState): StateProps => ({
  links,
  currentStepIndex,
  stepStatuses,
  setupParams,
  dataSources,
})

const mdtp: DispatchProps = {
  notify: notifyAction,
  onSetSetupParams: setSetupParams,
  onDecrementCurrentStepIndex: decrementCurrentStepIndex,
  onIncrementCurrentStepIndex: incrementCurrentStepIndex,
  onSetCurrentStepIndex: setCurrentStepIndex,
  onSetStepStatus: setStepStatus,
  onAddDataSource: addDataSource,
  onRemoveDataSource: removeDataSource,
  onSetDataSources: setDataSources,
  onSetActiveDataSource: setActiveDataSource,
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mstp,
  mdtp
)(withRouter(OnboardingWizard))
