import Select, { StylesConfig } from 'react-select'

export const ReactSelect = Select

/**
 * @description cuando enviar parametros para cambiar el color del select
 * @param error
 */
export const reactSelectStyle = (
  error: boolean = false,
): StylesConfig<any> | undefined => ({
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
  placeholder: (base) => ({
    ...base,
    color: !error ? '#a4a4a4' : '#FF3D57',
  }),
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: !error ? 'grey' : '#FF3D57',
    ':hover': {
      ...baseStyles[':hover'],
      borderColor: !error ? 'grey' : '#FF3D57',
    },
  }),
})

export const reactSelectStyles: StylesConfig<any> | undefined = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),
  placeholder: (base) => ({
    ...base,
    color: '#a4a4a4',
  }),
}
