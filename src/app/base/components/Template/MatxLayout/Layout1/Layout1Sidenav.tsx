import { Hidden, Switch } from '@mui/material';
import {Box, styled, Theme, useTheme} from '@mui/system';
import React from 'react';
import {themeShadows} from "../../MatxTheme/themeColors";
import {sidenavCompactWidth, sideNavWidth} from "../../../../../utils/constant";
import useSettings from "../../../../hooks/useSettings";
import {convertHexToRGB} from "../../../../../utils/utils";
import Brand from "../../Brand/Brand";
import Sidenav from "../../Sidenav/Sidenav";

interface SidebarNavRoot {
    theme: Theme,
    width: number | string,
    primaryBg?: string,
    bgImgURL: any
}
const SidebarNavRoot: any = styled(Box)(({ theme, width, primaryBg, bgImgURL }: SidebarNavRoot) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: width,
    boxShadow: themeShadows[8],
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top',
    backgroundSize: 'cover',
    zIndex: 111,
    overflow: 'hidden',
    color: theme.palette.text.primary,
    transition: 'all 250ms ease-in-out',
    backgroundImage: `linear-gradient(to bottom, rgba(${primaryBg}, 0.96), rgba(${primaryBg}, 0.96)), url(${bgImgURL})`,
    '&:hover': {
        width: sideNavWidth,
        '& .sidenavHoverShow': {
            display: 'block',
        },
        '& .compactNavItem': {
            width: '100%',
            maxWidth: '100%',
            '& .nav-bullet': {
                display: 'block',
            },
            '& .nav-bullet-text': {
                display: 'none',
            },
        },
    },
}));

const NavListBox = styled(Box)(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const Layout1Sidenav = () => {
    const theme = useTheme();
    const { settings, updateSettings }: any = useSettings();
    const leftSidebar = settings.layout1Settings.leftSidebar;
    const { mode, bgImgURL } = leftSidebar;

    const getSidenavWidth = () => {
        switch (mode) {
            case 'compact':
                return sidenavCompactWidth;
            default:
                return sideNavWidth;
        }
    };
    const primaryRGB = convertHexToRGB(theme.palette.primary.main);

    const updateSidebarMode = (sidebarSettings: any) => {
        updateSettings({
            layout1Settings: {
                leftSidebar: {
                    ...sidebarSettings,
                },
            },
        });
    };

    const handleSidenavToggle = () => {
        updateSidebarMode({ mode: mode === 'compact' ? 'full' : 'compact' });
    };

    return (
        <SidebarNavRoot bgImgURL={bgImgURL} primaryBg={primaryRGB} width={getSidenavWidth()}>
            <NavListBox>
                <Brand>
                    <Hidden smDown>
                        <Switch
                            onChange={handleSidenavToggle}
                            checked={leftSidebar.mode !== 'full'}
                            color="secondary"
                            size="small"
                        />
                    </Hidden>
                </Brand>
                <Sidenav />
            </NavListBox>
        </SidebarNavRoot>
    );
};

export default React.memo(Layout1Sidenav);
