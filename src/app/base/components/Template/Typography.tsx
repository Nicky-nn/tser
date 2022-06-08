import clsx from 'clsx'
import {Box, styled, Theme} from '@mui/material'
import {FC} from "react";

type StyledBoxProps = {
    theme: Theme, textTransformStyle: any, ellipsis: boolean
}
const StyledBox: FC<StyledBoxProps | any> = styled(Box)(({theme, textTransformStyle, ellipsis}: StyledBoxProps) => ({
    textTransform: textTransformStyle || 'none',
    whiteSpace: ellipsis ? 'nowrap' : 'normal',
    overflow: ellipsis ? 'hidden' : '',
    textOverflow: ellipsis ? 'ellipsis' : '', // color: theme.palette.primary.contrastText,
}))

type H1Props = {
    children: JSX.Element, className: string, ellipsis: any, textTransform: any,
}

export const H1 = ({
                       children, className, ellipsis, textTransform, ...props
                   }: H1Props) => {
    return (<StyledBox
        textTransformStyle={textTransform}
        ellipsis={ellipsis}
        className={clsx({[className || '']: true})}
        component="h1"
        mb={0}
        mt={0}
        fontSize="28px"
        fontWeight="500"
        lineHeight="1.5"
        {...props}
    >
        {children}
    </StyledBox>)
}

type H2Props = {
    children: JSX.Element, className: string, ellipsis: any, textTransform: any,
}
export const H2 = ({
                       children, className, ellipsis, textTransform, ...props
                   }: H2Props) => {
    return (<StyledBox
        textTransformStyle={textTransform}
        ellipsis={ellipsis}
        className={clsx({[className || '']: true})}
        component="h2"
        mb={0}
        mt={0}
        fontSize="24px"
        fontWeight="500"
        lineHeight="1.5"
        {...props}
    >
        {children}
    </StyledBox>)
}

type H3Props = {
    children: JSX.Element, className: string, ellipsis: any, textTransform: any,
}

export const H3 = ({
                       children, className, ellipsis, textTransform, ...props
                   }: H3Props) => {
    return (<StyledBox
        textTransformStyle={textTransform}
        ellipsis={ellipsis}
        className={clsx({[className || '']: true})}
        component="h3"
        mb={0}
        mt={0}
        fontSize="18px"
        fontWeight="500"
        lineHeight="1.5"
        {...props}
    >
        {children}
    </StyledBox>)
}

type H4Props = {
    children: JSX.Element, className: string, ellipsis: any, textTransform: any,
}
export const H4 = ({
                       children, className, ellipsis, textTransform, ...props
                   }: H4Props) => {
    return (<StyledBox
        textTransformStyle={textTransform}
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
    </StyledBox>)
}

type H5Props = {
    children: JSX.Element, className: string, ellipsis: any, textTransform: any,
}
export const H5: FC<any> = ({
                       children, className, ellipsis, textTransform, ...props
                   }: H5Props) => {
    return (<StyledBox
        textTransformStyle={textTransform}
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
    </StyledBox>)
}

type H6Props = {
    children: JSX.Element, className: string, ellipsis: any, textTransform: any,
}
export const H6 = ({
                       children, className, ellipsis, textTransform, ...props
                   }: H6Props) => {
    return (<StyledBox
        textTransformStyle={textTransform}
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
    </StyledBox>)
}

type ParagraphProps = {
    children: JSX.Element, className: string, ellipsis: any, textTransform: any,
}
export const Paragraph: FC<any> = ({
                              children, className, ellipsis, textTransform, ...props
                          }: ParagraphProps) => {
    return (<StyledBox
        textTransformStyle={textTransform}
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
    </StyledBox>)
}

type SmallProps = {
    children: JSX.Element, className: string, ellipsis: any, textTransform: any,
}
export const Small: FC<any> = ({
                          children, className, ellipsis, textTransform, ...props
                      }: SmallProps) => {
    return (<StyledBox
        textTransformStyle={textTransform}
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
    </StyledBox>)
}

type SpanProps = {
    children: JSX.Element, className: string, ellipsis: any, textTransform: any,
}
export const Span: FC<any> = ({
                         children, className, ellipsis, textTransform, ...props
                     }: SpanProps) => {
    return (<StyledBox
        textTransformStyle={textTransform}
        ellipsis={ellipsis}
        className={clsx({
            [className || '']: true,
        })}
        component="span"
        lineHeight="1.5"
        {...props}
    >
        {children}
    </StyledBox>)
}

type TinyProps = {
    children: JSX.Element, className: string, ellipsis: any, textTransform: any,
}
export const Tiny = ({
                         children, className, ellipsis, textTransform, ...props
                     }: TinyProps) => {
    return (<StyledBox
        textTransformStyle={textTransform}
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
    </StyledBox>)
}
