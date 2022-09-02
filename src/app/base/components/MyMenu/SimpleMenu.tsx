import { Menu, MenuItem, ThemeProvider } from '@mui/material';
import { alpha, Box, styled } from '@mui/system';
import React, { Children, FC, Fragment, useState } from 'react';

import useSettings from '../../hooks/useSettings';

const MenuButton = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  color: theme.palette.text.primary,
  '& div:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
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
  '& .MuiMenu-list': {
    padding: '4px 0',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 18,
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(1.5),
  },
  '&:active': {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity,
    ),
  },
}));

interface SimpleMenuProps {
  children: JSX.Element | JSX.Element[];
  menuButton: JSX.Element;
  shouldCloseOnItemClick?: boolean;
  horizontalPosition?: number | 'right' | 'left' | 'center';
}

const SimpleMenu: FC<SimpleMenuProps> = (props: SimpleMenuProps) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const children = Children.toArray(props.children);
  let { shouldCloseOnItemClick = true, horizontalPosition = 'right' } = props;
  const { settings } = useSettings();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <MenuButton onClick={handleClick}>{props.menuButton}</MenuButton>
      <ThemeProvider theme={settings.themes[settings.activeTheme]}>
        <Menu
          elevation={3}
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: horizontalPosition,
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: horizontalPosition,
          }}
        >
          {children.map((child, index) => (
            <div onClick={shouldCloseOnItemClick ? handleClose : () => {}} key={index}>
              {child}
            </div>
          ))}
        </Menu>
      </ThemeProvider>
    </Fragment>
  );
};

export default SimpleMenu;
