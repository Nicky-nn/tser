import { Box, styled } from '@mui/material'

/**
 * @description Item para lo StackMenu y StackMenuActionTable
 */
export const StackMenuItem = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
}))
