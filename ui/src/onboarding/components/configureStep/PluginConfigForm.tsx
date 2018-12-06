// Libraries
import React, {PureComponent, ChangeEvent} from 'react'
import _ from 'lodash'

// Components
import {Form} from 'src/clockface'
import ConfigFieldSwitcher from 'src/onboarding/components/configureStep/ConfigFieldSwitcher'

// Actions
import {updateTelegrafPluginConfig} from 'src/onboarding/actions/dataLoaders'

// Types
import {TelegrafPlugin, ConfigFields} from 'src/types/v2/dataLoaders'

interface Props {
  telegrafPlugin: TelegrafPlugin
  configFields: ConfigFields
  onUpdateTelegrafPluginConfig: typeof updateTelegrafPluginConfig
}

class PluginConfigForm extends PureComponent<Props> {
  public render() {
    const {
      telegrafPlugin: {name},
    } = this.props
    return (
      <>
        <h3>{_.startCase(name)}</h3>
        <Form>{this.formFields}</Form>
      </>
    )
  }

  private get formFields(): JSX.Element[] | JSX.Element {
    const {configFields, telegrafPlugin} = this.props
    if (!configFields) {
      return (
        <div>
          <p>No configuration required.</p>
        </div>
      )
    }

    return Object.entries(configFields).map(([fieldName, fieldType], i) => {
      return (
        <ConfigFieldSwitcher
          key={fieldName}
          fieldName={fieldName}
          fieldType={fieldType}
          index={i}
          onChange={this.handleUpdateConfigField}
          value={_.get(telegrafPlugin, `plugin.config.${fieldName}`, '')}
        />
      )
    })
  }

  private handleUpdateConfigField = (e: ChangeEvent<HTMLInputElement>) => {
    const {onUpdateTelegrafPluginConfig, telegrafPlugin} = this.props
    const {name, value} = e.target

    onUpdateTelegrafPluginConfig(telegrafPlugin.name, name, value)
  }
}

export default PluginConfigForm
