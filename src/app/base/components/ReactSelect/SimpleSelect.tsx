import React, { FunctionComponent } from 'react'
import Select, { Props } from 'react-select'

import { reactSelectStyles } from '../MySelect/ReactSelect'

type SelectProps = Props & {
  id?: string
  label?: string
}

const SimpleSelect: FunctionComponent<SelectProps> = (props: SelectProps) => {
  return <Select {...props} styles={reactSelectStyles} menuPosition={'fixed'} />
}

export default SimpleSelect
