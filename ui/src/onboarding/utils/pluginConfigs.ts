// Constants
import {telegrafPluginsInfo} from 'src/onboarding/constants/pluginConfigs'

// Types
import {
  TelegrafPluginName,
  ConfigFields,
  Plugin,
} from 'src/types/v2/dataLoaders'

export const getConfigFields = (
  pluginName: TelegrafPluginName
): ConfigFields => {
  return telegrafPluginsInfo[pluginName].fields
}

export const updateConfig = <T extends Plugin>(
  plugin: T,
  key: string,
  value: string
): T => {
  return Object.assign({}, plugin, {
    config: Object.assign({}, plugin.config, {[key]: value}),
  })
}

export const createNewPlugin = (name: TelegrafPluginName): Plugin => {
  return telegrafPluginsInfo[name].defaults
}
