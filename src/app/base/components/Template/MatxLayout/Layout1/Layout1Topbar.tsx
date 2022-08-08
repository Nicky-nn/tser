import React, {FC} from 'react'
import {Link} from 'react-router-dom'
import {Box, styled, useTheme} from '@mui/system'
import {Avatar, Hidden, IconButton, MenuItem, useMediaQuery,} from '@mui/material'
import {themeShadows} from "../../MatxTheme/themeColors";
import useSettings from "../../../../hooks/useSettings";
import useAuth from "../../../../hooks/useAuth";
import NotificationBar from "../../NotificationBar/NotificationBar";
import {MailOutline, Menu, PowerSettingsNew, Settings} from "@mui/icons-material";
import {Span} from "../../Typography";
import {NotificationProvider} from "../../../../contexts/NotificationContext";
import MatxMenu from "../../MatxMenu/MatxMenu";
import {ThemeColorBarProvider} from "../../../../contexts/ThemeColorContext";
import ThemeColorBar from "../../NotificationBar/ThemeColorBar";
import {topBarHeight} from "../../../../../utils/constant";
import {cuentaRouteMap} from "../../../../../modules/cuenta/CuentaRoutesMap";

const StyledIconButton = styled(IconButton)(({theme}) => ({
    color: theme.palette.text.primary,
}))

const TopbarRoot = styled('div')(({theme}) => ({
    top: 0,
    zIndex: 96,
    transition: 'all 0.3s ease',
    boxShadow: themeShadows[8],
    height: topBarHeight,
}))

const TopbarContainer = styled(Box)(({theme}) => ({
    padding: '8px',
    paddingLeft: 18,
    paddingRight: 20,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
        paddingLeft: 16,
        paddingRight: 16,
    },
    [theme.breakpoints.down('xs')]: {
        paddingLeft: 14,
        paddingRight: 16,
    },
}))

const UserMenu = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: 24,
    padding: 4,
    '& span': {
        margin: '0 8px',
    },
}))

const StyledItem = styled(MenuItem)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    minWidth: 185,
    '& a': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
    },
    '& span': {
        marginRight: '10px',
        color: theme.palette.text.primary,
    },
}))

const IconBox = styled('div')(({theme}) => ({
    display: 'inherit',
    [theme.breakpoints.down('md')]: {
        display: 'none !important',
    },
}))

const Layout1Topbar: FC<any> = () => {
    const theme = useTheme()
    const {settings, updateSettings}: any = useSettings()
    const {logout, user}: any = useAuth()
    const isMdScreen = useMediaQuery(theme.breakpoints.down('md'))

    const updateSidebarMode = (sidebarSettings: any) => {
        updateSettings({
            layout1Settings: {
                leftSidebar: {
                    ...sidebarSettings,
                },
            },
        })
    }

    const handleSidebarToggle = () => {
        let {layout1Settings} = settings
        let mode
        if (isMdScreen) {
            mode =
                layout1Settings.leftSidebar.mode === 'close'
                    ? 'mobile'
                    : 'close'
        } else {
            mode =
                layout1Settings.leftSidebar.mode === 'full' ? 'close' : 'full'
        }
        updateSidebarMode({mode})
    }

    return (
        <TopbarRoot>
            <TopbarContainer>
                <Box display="flex">
                    <StyledIconButton onClick={handleSidebarToggle}>
                        <Menu>Menu</Menu>
                    </StyledIconButton>

                    <IconBox>
                        <StyledIconButton>
                            <MailOutline>mail_outline</MailOutline>
                        </StyledIconButton>
                    </IconBox>
                </Box>
                <Box display="flex" alignItems="center">
                    <NotificationProvider>
                        <NotificationBar/>
                    </NotificationProvider>
                    <ThemeColorBarProvider>
                        <ThemeColorBar/>
                    </ThemeColorBarProvider>

                    <MatxMenu
                        menuButton={
                            <UserMenu>
                                <Hidden xsDown>
                                    <Span>
                                        Hola <strong>{user.nombres}</strong>
                                    </Span>
                                </Hidden>
                                <Avatar
                                    src={user.avatar}
                                    sx={{cursor: 'pointer'}}
                                />
                            </UserMenu>
                        }
                    >
                        <StyledItem>
                            <Link to={cuentaRouteMap.cuenta}>
                                <Settings> settings </Settings> &nbsp;&nbsp;
                                <Span> Opciones </Span>
                            </Link>
                        </StyledItem>
                        <StyledItem onClick={logout}>
                            <PowerSettingsNew> power_settings_new </PowerSettingsNew> &nbsp;&nbsp;
                            <Span> Cerrar Sesión </Span>
                        </StyledItem>
                    </MatxMenu>
                </Box>
            </TopbarContainer>
        </TopbarRoot>
    )
}

export default React.memo(Layout1Topbar)
