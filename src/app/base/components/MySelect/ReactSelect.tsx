import Select, { StylesConfig } from 'react-select'

export const ReactSelect = Select

/*
EJEMPLO
<Controller
    name="departamento"
    control={control}
    render={({ field }) => (
      <FormControl fullWidth error={Boolean(errors.departamento?.message)}>
        <MyInputLabel shrink>Departamento</MyInputLabel>
        <Select<DepartamentoProps>
          {...field}
          styles={reactSelectStyle(Boolean(errors.departamento?.message))}
          name="departamento"
          placeholder={'Seleccione...'}
          menuPosition={'fixed'}
          value={field.value}
          onChange={async (actividadEconomica: any) => {
            field.onChange(actividadEconomica)
          }}
          onBlur={async (val) => {
            field.onBlur()
          }}
          filterOption={createFilter({ ignoreAccents: false })} // para mejorar el buscador
          isSearchable={false}
          options={DEPARTAMENTOS}
          getOptionValue={(item) => item.codigo?.toString()}
          getOptionLabel={(item) => `${item.sigla} - ${item.departamento}`}
        />
        <FormHelperText>{errors.departamento?.message}</FormHelperText>
      </FormControl>
    )}
  />
 */

/**
 * @description cuando enviar parametros para cambiar el color del select
 * @param error
 */
export const reactSelectStyle = (
  error: boolean = false,
): StylesConfig<any, any, any> | undefined => ({
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
    borderColor: !error ? 'rgb(52, 49, 76, 0.3)' : '#FF3D57',
    ':hover': {
      ...baseStyles[':hover'],
      borderColor: !error ? 'rgba(52, 49, 76, 1)' : '#FF3D57',
    },
  }),
})
