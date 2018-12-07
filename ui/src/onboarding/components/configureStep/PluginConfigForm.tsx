// Libraries
import React, {PureComponent, ChangeEvent} from 'react'
import _ from 'lodash'

// Components
import {Form} from 'src/clockface'
import ConfigFieldSwitcher from 'src/onboarding/components/configureStep/ConfigFieldSwitcher'

// Actions
import {
  updateTelegrafPluginConfig,
  addTelegrafPluginConfigFieldValue,
  removeTelegrafPluginConfigFieldValue,
  setTelegrafPluginAsync,
} from 'src/onboarding/actions/dataLoaders'

// Types
import {
  TelegrafPlugin,
  ConfigFields,
  ConfigFieldType,
} from 'src/types/v2/dataLoaders'

interface Props {
  telegrafPlugin: TelegrafPlugin
  configFields: ConfigFields
  onUpdateTelegrafPluginConfig: typeof updateTelegrafPluginConfig
  onAddTelegrafPluginConfigFieldValue: typeof addTelegrafPluginConfigFieldValue
  onRemoveTelegrafPluginConfigFieldValue: typeof removeTelegrafPluginConfigFieldValue
  onSave: typeof setTelegrafPluginAsync
  authToken: string
}

class PluginConfigForm extends PureComponent<Props> {
  public render() {
    const {
      telegrafPlugin: {name},
    } = this.props
    return (
      <>
        <h3>{_.startCase(name)}</h3>
        <Form onSubmit={this.handleSave}>{this.formFields}</Form>
      </>
    )
  }

  private handleSave = () => {
    this.props.onSave(this.props.telegrafPlugin.name, this.props.authToken)
  }

  private get formFields(): JSX.Element[] | JSX.Element {
    const {configFields, telegrafPlugin} = this.props

    if (!configFields) {
      return <p>No configuration required.</p>
    }

    return Object.entries(configFields).map(([fieldName, fieldType], i) => {
      return (
        <ConfigFieldSwitcher
          key={fieldName}
          fieldName={fieldName}
          fieldType={fieldType}
          index={i}
          onChange={this.handleUpdateConfigField}
          value={this.getFieldValue(telegrafPlugin, fieldName, fieldType)}
          addTagValue={this.handleAddConfigFieldValue}
          removeTagValue={this.handleRemoveConfigFieldValue}
        />
      )
    })
  }

  private handleAddConfigFieldValue = (
    value: string,
    fieldName: string
  ): void => {
    const {onAddTelegrafPluginConfigFieldValue, telegrafPlugin} = this.props

    onAddTelegrafPluginConfigFieldValue(telegrafPlugin.name, fieldName, value)
  }

  private handleRemoveConfigFieldValue = (value: string, fieldName: string) => {
    const {onRemoveTelegrafPluginConfigFieldValue, telegrafPlugin} = this.props

    onRemoveTelegrafPluginConfigFieldValue(
      telegrafPlugin.name,
      fieldName,
      value
    )
  }

  private getFieldValue(
    telegrafPlugin: TelegrafPlugin,
    fieldName: string,
    fieldType: ConfigFieldType
  ): string | string[] {
    let defaultEmpty: string | string[]
    if (
      fieldType === ConfigFieldType.String ||
      fieldType === ConfigFieldType.Uri
    ) {
      defaultEmpty = ''
    } else {
      defaultEmpty = []
    }

    return _.get(telegrafPlugin, `plugin.config.${fieldName}`, defaultEmpty)
  }

  private handleUpdateConfigField = (e: ChangeEvent<HTMLInputElement>) => {
    const {onUpdateTelegrafPluginConfig, telegrafPlugin} = this.props
    const {name, value} = e.target

    onUpdateTelegrafPluginConfig(telegrafPlugin.name, name, value)
  }
}

export default PluginConfigForm
