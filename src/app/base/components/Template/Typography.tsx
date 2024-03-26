import { Box, BoxProps, styled, Theme } from '@mui/material'
import clsx from 'clsx'
import { FC, ReactNode } from 'react'

interface StyledBoxProps extends BoxProps {
  theme?: Theme
  textTransformStyle?: any
  ellipsis?: boolean
}

const StyledBox = styled(Box)<StyledBoxProps>(
  ({ theme, textTransformStyle, ellipsis }: any) => ({
    textTransform: textTransformStyle || 'none',
    whiteSpace: ellipsis ? 'nowrap' : 'normal',
    overflow: ellipsis ? 'hidden' : '',
    textOverflow: ellipsis ? 'ellipsis' : '',
  }),
)

interface H1Props extends StyledBoxProps {
  children: ReactNode
  className?: string
  textTransform?: any
}

export const H1: FC<H1Props> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: H1Props) => {
  return (
    <StyledBox
      // textTransformStyle={textTransform}
      className={clsx({ [className || '']: true })}
      component="h1"
      mb={0}
      mt={0}
      fontSize="28px"
      fontWeight="500"
      lineHeight="1.5"
      ellipsis={ellipsis}
      {...props}
    >
      {children}
    </StyledBox>
  )
}

interface H2Props extends StyledBoxProps {
  children: ReactNode
  className?: string
  ellipsis?: any
  textTransform?: any
}

export const H2: FC<H2Props> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: H2Props) => {
  return (
    <StyledBox
      // textTransformStyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="h2"
      mb={0}
      mt={0}
      fontSize="24px"
      fontWeight="500"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  )
}

type H3Props = {
  children: ReactNode
  className?: string
  ellipsis?: any
  textTransform?: any
}

export const H3 = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: H3Props) => {
  return (
    <StyledBox
      // textTransformStyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="h3"
      mb={0}
      mt={0}
      fontSize="18px"
      fontWeight="500"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  )
}

type H4Props = {
  children: ReactNode
  className?: string
  ellipsis?: any
  textTransform?: any
}
export const H4 = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: H4Props) => {
  return (
    <StyledBox
      // textTransformStyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({
        [className || '']: true,
      })}
      component="h4"
      mb={0}
      mt={0}
      fontSize="16px"
      fontWeight="500"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  )
}

interface H5Props extends StyledBoxProps {
  children: ReactNode
  className?: string
  textTransform?: any
}

export const H5: FC<H5Props> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: H5Props) => {
  return (
    <StyledBox
      // textTransformStyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({
        [className || '']: true,
      })}
      component="h5"
      mb={0}
      mt={0}
      fontSize="14px"
      fontWeight="500"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  )
}

interface H6Props extends StyledBoxProps {
  children: ReactNode
  className?: string
  textTransform?: any
}

export const H6: FC<any> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: H6Props) => {
  return (
    <StyledBox
      // textTransformStyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({
        [className || '']: true,
      })}
      component="h6"
      mb={0}
      mt={0}
      fontSize="13px"
      fontWeight="500"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  )
}

interface ParagraphProps extends StyledBoxProps {
  children: ReactNode
  className?: string
  textTransform?: any
}

export const Paragraph: FC<any> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: ParagraphProps) => {
  return (
    <StyledBox
      // textTransformStyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({
        [className || '']: true,
      })}
      component="p"
      mb={0}
      mt={0}
      fontSize="14px"
      {...props}
    >
      {children}
    </StyledBox>
  )
}

interface SmallProps extends StyledBoxProps {
  children: ReactNode
  className?: string
  textTransform?: any
}

export const Small: FC<any> = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: SmallProps) => {
  return (
    <StyledBox
      // textTransformStyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({
        [className || '']: true,
      })}
      component="small"
      fontSize="12px"
      fontWeight="500"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  )
}

/**
 * @description Contenido Heading
 */
export const Heading = styled('h6')(({ theme }) => ({
  margin: 0,
  marginTop: '4px',
  fontSize: '14px',
  fontWeight: '500',
  color: theme.palette.primary.dark,
}))

interface SpanProps extends StyledBoxProps {
  children?: ReactNode
  className?: string
  textTransform?: any
}

export const Span: any = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: SpanProps) => {
  return (
    <StyledBox
      // textTransformStyle={textTransform || 'none'}
      ellipsis={ellipsis}
      className={clsx({
        [className || '']: true,
      })}
      component="span"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  ) as any
}

interface TinyProps extends StyledBoxProps {
  children: ReactNode
  className?: string
  textTransform?: any
}

export const Tiny = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: TinyProps) => {
  return (
    <StyledBox
      // textTransformStyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({
        [className || '']: true,
      })}
      component="small"
      fontSize="10px"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  )
}
