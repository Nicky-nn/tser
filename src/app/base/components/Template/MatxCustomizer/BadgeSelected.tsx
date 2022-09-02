import { Badge } from '@mui/material';
import { styled } from '@mui/system';
import { FC } from 'react';

const BadgeSelected: FC<any> = styled(Badge)(() => ({
  top: '0',
  right: '0',
  height: '32px',
  width: '32px',
  borderRadius: '50%',
}));

export default BadgeSelected;
