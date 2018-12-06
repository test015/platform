// Libraries
import React, {PureComponent, ChangeEvent} from 'react'
import _ from 'lodash'

// Components
import {Form, Input} from 'src/clockface'
import URIFormElement from 'src/shared/components/URIFormElement'

// Types
import {ConfigFieldType} from 'src/types/v2/dataLoaders'

interface Props {
  fieldName: string
  fieldType: ConfigFieldType
  index: number
  onChange: (e: ChangeEvent<HTMLElement>) => void
  value: string
}

class ConfigFieldSwitcher extends PureComponent<Props> {
  public render() {
    const {fieldType, fieldName, onChange, value} = this.props

    switch (fieldType) {
      case ConfigFieldType.Uri:
      case ConfigFieldType.UriArray:
        return (
          <URIFormElement
            name={fieldName}
            key={name}
            autoFocus={this.autoFocus}
            onChange={onChange}
            value={value}
          />
        )
      case ConfigFieldType.String:
      case ConfigFieldType.StringArray:
        return (
          <Form.Element label={fieldName} key={fieldName}>
            <Input
              name={fieldName}
              autoFocus={this.autoFocus}
              onChange={onChange}
              value={value}
            />
          </Form.Element>
        )
      default:
        return <div />
    }
  }

  private get autoFocus(): boolean {
    const {index} = this.props
    return index === 0
  }
}

export default ConfigFieldSwitcher
