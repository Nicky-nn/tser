import { FormControl, FormHelperText, useTheme } from '@mui/material'
import Select, { GroupBase, Props as DefaultProps } from 'react-select'

import { MyInputLabel } from '../MyInputs/MyInputLabel'
import { reactSelectStyle } from '../MySelect/ReactSelect'

type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = DefaultProps<Option, IsMulti, Group> & {
  error?: boolean
  formHelperText?: string
  inputLabel?: string
}

/**
 * Componente para realizar el select para formularios
 * @param props
 * @constructor
 */
const FormSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: SelectProps<Option, IsMulti, Group>,
) => {
  const t = useTheme()
  const { error, formHelperText, inputLabel, ...others } = props

  return (
    <FormControl fullWidth error={error || false} component={'div'} size={'medium'}>
      {inputLabel && <MyInputLabel shrink>{inputLabel}</MyInputLabel>}
      <Select
        menuPosition={'fixed'}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: t.palette.primary.light,
          },
        })}
        styles={{
          ...reactSelectStyle(error || false),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          menu: (provided) => ({ ...provided, zIndex: 9999 }),
          placeholder: (base) => ({
            ...base,
            color: !error ? '#a4a4a4' : t.palette.error.main,
          }),
          control: (baseStyles, state) => {
            return {
              ...baseStyles,
              boxShadow: state.isFocused
                ? `0 0 0px 1px ${error ? t.palette.error.main : t.palette.primary.main}`
                : 'none',
              borderColor: !error ? 'rgb(52, 49, 76, 0.3)' : '#FF3D57',
              ':hover': {
                ...baseStyles[':hover'],
                borderColor: !error ? 'rgba(52, 49, 76, 1)' : t.palette.error.main,
              },
            }
          },
        }}
        {...others}
      />
      {formHelperText && <FormHelperText>{formHelperText}</FormHelperText>}
    </FormControl>
  )
}

export default FormSelect
