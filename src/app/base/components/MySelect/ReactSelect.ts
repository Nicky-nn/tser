import Select, {StylesConfig} from 'react-select'

export const ReactSelect = Select;


export const reactSelectStyles: StylesConfig<any> | undefined = {
    menuPortal: base => ({
        ...base,
        zIndex: 9999
    }),
};