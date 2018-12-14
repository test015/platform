import React from 'react'

// Types
import {Dropdown, Form} from 'src/clockface'
import {FieldOption} from 'src/types/v2/dashboards'

interface Props {
  selected: FieldOption
  fieldOptions: FieldOption[]
  onChange: (fieldOption: FieldOption) => void
}

const SortBy = ({fieldOptions, onChange, selected}: Props) => {
  return (
    <Form.Element label="Default Sort Field">
      <Dropdown
        selectedID={selected.internalName}
        customClass="dropdown-stretch"
        onChange={onChange}
      >
        {fieldOptions.map(({internalName, displayName}) => (
          <Dropdown.Item
            key={internalName}
            id={internalName}
            value={internalName}
          >
            {displayName}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </Form.Element>
  )
}

export default SortBy
