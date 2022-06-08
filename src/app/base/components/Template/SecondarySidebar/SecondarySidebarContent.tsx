import {FC} from 'react'
import {styled} from '@mui/system'
import {Span} from '../Typography'
import {Theme} from '@mui/material'
import MatxCustomizer from "../MatxCustomizer/MatxCustomizer";

type SidebarRootProps = {
    theme: Theme,
    width: number
}

const SidebarRoot: FC<any> = styled('div')(({theme, width}: SidebarRootProps): any => ({
    position: 'fixed',
    height: '100vh',
    width: width,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows[8],
    backgroundColor: theme.palette.primary.main,
    zIndex: 98,
    transition: 'all 0.15s ease',
    color: theme.palette.text.primary,
    '@global': {
        '@media screen and (min-width: 767px)': {
            '.content-wrap, .layout2.layout-contained, .layout2.layout-full': {
                marginRight: (props: any) => props.width,
            },
            '.matx-customizer': {
                right: (props: any) => props.width,
            },
        },
        '@media screen and (max-width: 959px)': {
            '.toolbar-menu-wrap .menu-area': {
                width: (props: any) => `calc(100% - ${props.width})`,
            },
        },
    },
}))

const SecondarySidebarContent = () => {
    // const {palette} = useTheme()
    // const textColor = palette.primary.contrastText
    return (
        <SidebarRoot width={'50px'} className="secondary-sidebar">
            <Span sx={{m: 'auto'}}></Span>
            <MatxCustomizer/>
            <Span sx={{m: 'auto'}}></Span>
        </SidebarRoot>
    )
}

export default SecondarySidebarContent
