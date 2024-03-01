import React, { FunctionComponent } from 'react'
import Select, { Props as DefaultProps, StylesConfig } from 'react-select'

const reactSelectStyles: StylesConfig<any> | undefined = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  placeholder: (base) => ({
    ...base,
    color: '#a4a4a4',
  }),
}

interface OwnProps extends DefaultProps {}

type Props = OwnProps

const FormSelect: FunctionComponent<Props> = (props: Props) => {
  return (
    <>
      <Select
        className={'formSelect'}
        styles={reactSelectStyles}
        menuPosition={'fixed'}
        {...props}
      />
    </>
  )
}

export default FormSelect
