// Libraries
import React, {PureComponent} from 'react'
import _ from 'lodash'

// Components
import {ErrorHandling} from 'src/shared/decorators/errors'
import LineProtocol from 'src/onboarding/components/configureStep/lineProtocol/LineProtocol'
import PluginConfigSwitcher from 'src/onboarding/components/configureStep/PluginConfigSwitcher'
import EmptyDataSourceState from 'src/onboarding/components/configureStep/EmptyDataSourceState'

// Actions
import {updateTelegrafPluginConfig} from 'src/onboarding/actions/dataLoaders'

// Types
import {TelegrafPlugin, DataLoaderType} from 'src/types/v2/dataLoaders'

export interface Props {
  telegrafPlugins: TelegrafPlugin[]
  currentIndex: number
  onUpdateTelegrafPluginConfig: typeof updateTelegrafPluginConfig
  dataLoaderType: DataLoaderType
  bucket: string
  org: string
}

@ErrorHandling
class ConfigureDataSourceSwitcher extends PureComponent<Props> {
  public render() {
    const {
      bucket,
      org,
      telegrafPlugins,
      currentIndex,
      dataLoaderType,
      onUpdateTelegrafPluginConfig,
    } = this.props

    switch (dataLoaderType) {
      case DataLoaderType.Streaming:
        return (
          <PluginConfigSwitcher
            onUpdateTelegrafPluginConfig={onUpdateTelegrafPluginConfig}
            telegrafPlugins={telegrafPlugins}
            currentIndex={currentIndex}
          />
        )
      case DataLoaderType.LineProtocol:
        return <LineProtocol bucket={bucket} org={org} />
      case DataLoaderType.CSV:
        return <div>{DataLoaderType.CSV}</div>
      default:
        return <EmptyDataSourceState />
    }
  }
}

export default ConfigureDataSourceSwitcher
