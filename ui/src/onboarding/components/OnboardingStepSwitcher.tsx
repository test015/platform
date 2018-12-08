// Libraries
import React, {PureComponent} from 'react'
import _ from 'lodash'

// Components
import InitStep from 'src/onboarding/components/InitStep'
import AdminStep from 'src/onboarding/components/AdminStep'
import SelectDataSourceStep from 'src/onboarding/components/selectionStep/SelectDataSourceStep'
import ConfigureDataSourceStep from 'src/onboarding/components/configureStep/ConfigureDataSourceStep'
import CompletionStep from 'src/onboarding/components/CompletionStep'
import VerifyDataStep from 'src/onboarding/components/verifyStep/VerifyDataStep'
import {ErrorHandling} from 'src/shared/decorators/errors'
import FetchAuthToken from 'src/onboarding/components/verifyStep/FetchAuthToken'

// Actions
import {
  addTelegrafPlugin,
  updateTelegrafPluginConfig,
  removeTelegrafPlugin,
  setDataLoadersType,
  addTelegrafPluginConfigFieldValue,
  removeTelegrafPluginConfigFieldValue,
  createTelegrafConfigAsync,
} from 'src/onboarding/actions/dataLoaders'

// Types
import {SetupParams} from 'src/onboarding/apis'
import {TelegrafPlugin, DataLoaderType} from 'src/types/v2/dataLoaders'
import {OnboardingStepProps} from 'src/onboarding/containers/OnboardingWizard'

interface Props {
  onboardingStepProps: OnboardingStepProps
  onAddTelegrafPlugin: typeof addTelegrafPlugin
  onUpdateTelegrafPluginConfig: typeof updateTelegrafPluginConfig
  onAddTelegrafPluginConfigFieldValue: typeof addTelegrafPluginConfigFieldValue
  onRemoveTelegrafPluginConfigFieldValue: typeof removeTelegrafPluginConfigFieldValue
  onRemoveTelegrafPlugin: typeof removeTelegrafPlugin
  onSetDataLoadersType: typeof setDataLoadersType
  setupParams: SetupParams
  dataLoaders: {telegrafPlugins: TelegrafPlugin[]; type: DataLoaderType}
  currentStepIndex: number
  onSaveTelegrafConfig: typeof createTelegrafConfigAsync
}

@ErrorHandling
class OnboardingStepSwitcher extends PureComponent<Props> {
  public render() {
    const {
      currentStepIndex,
      onboardingStepProps,
      setupParams,
      dataLoaders,
      onSetDataLoadersType,
      onAddTelegrafPlugin,
      onSaveTelegrafConfig,
      onUpdateTelegrafPluginConfig,
      onRemoveTelegrafPlugin,
      onAddTelegrafPluginConfigFieldValue,
      onRemoveTelegrafPluginConfigFieldValue,
    } = this.props

    switch (currentStepIndex) {
      case 0:
        return <InitStep {...onboardingStepProps} />
      case 1:
        return <AdminStep {...onboardingStepProps} />
      case 2:
        return (
          <SelectDataSourceStep
            {...onboardingStepProps}
            {...dataLoaders}
            onSetDataLoadersType={onSetDataLoadersType}
            bucket={_.get(setupParams, 'bucket', '')}
            onAddTelegrafPlugin={onAddTelegrafPlugin}
            onRemoveTelegrafPlugin={onRemoveTelegrafPlugin}
          />
        )
      case 3:
        return (
          <FetchAuthToken
            bucket={_.get(setupParams, 'bucket', '')}
            username={_.get(setupParams, 'username', '')}
          >
            {authToken => (
              <ConfigureDataSourceStep
                {...onboardingStepProps}
                {...dataLoaders}
                authToken={authToken}
                onUpdateTelegrafPluginConfig={onUpdateTelegrafPluginConfig}
                onAddTelegrafPluginConfigFieldValue={
                  onAddTelegrafPluginConfigFieldValue
                }
                onRemoveTelegrafPluginConfigFieldValue={
                  onRemoveTelegrafPluginConfigFieldValue
                }
                onSaveTelegrafConfig={onSaveTelegrafConfig}
              />
            )}
          </FetchAuthToken>
        )
      case 4:
        return <VerifyDataStep {...onboardingStepProps} {...dataLoaders} />
      case 5:
        return <CompletionStep {...onboardingStepProps} />
      default:
        return <div />
    }
  }
}

export default OnboardingStepSwitcher
