import Select, {GroupBase, StylesConfig} from 'react-select'

export const ReactSelect = Select;


export const reactSelectCustomStyles: StylesConfig<number, false, GroupBase<number>> | undefined = {
    menu: () => ({
        zIndex: 2
    }),
    menuList: () => ({
        overflowY: "auto"
    })
};