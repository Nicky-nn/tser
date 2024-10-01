/* eslint-disable no-unused-vars */
import { Box, Button, ButtonProps, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface KeyTipButtonProps extends ButtonProps {
  keyTip: string
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ) => void
}

const KeyTipButton: React.FC<KeyTipButtonProps> = ({
  children,
  keyTip,
  onClick,
  disabled,
  ...props
}) => {
  const [showKeyTip, setShowKeyTip] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        setShowKeyTip(true)

        if (e.key.toLowerCase() === keyTip.toLowerCase() && !disabled) {
          if (onClick) {
            onClick(e as unknown as React.KeyboardEvent<HTMLButtonElement>)
          }
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setShowKeyTip(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [keyTip, onClick, disabled])

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Button
        onClick={onClick}
        disabled={disabled}
        {...props}
        sx={{ width: '100%', height: '100%' }}
      >
        {children}
      </Button>
      {showKeyTip && !disabled && (
        <Typography
          sx={{
            position: 'absolute',
            top: 10,
            right: 'calc(50% - 20px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            padding: '2px 4px',
            borderRadius: '4px',
            zIndex: 1,
          }}
        >
          Ctrl+{keyTip}
        </Typography>
      )}
    </Box>
  )
}

export default KeyTipButton
