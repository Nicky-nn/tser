import {Box, styled} from '@mui/system'
import {Span} from "../Typography";
import useSettings from "../../../hooks/useSettings";

const BrandRoot = styled(Box)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 18px 20px 29px',
})) as typeof Box

const StyledSpan = styled(Span)(({theme, mode}) => ({
    fontSize: 18,
    marginLeft: '.5rem',
    display: mode === 'compact' ? 'none' : 'block'
}))

const Brand = ({children}: { children: JSX.Element }) => {
    const {settings} = useSettings()
    const leftSidebar = settings.layout1Settings.leftSidebar
    const {mode} = leftSidebar

    return (
        <BrandRoot>
            <Box display="flex" alignItems="center">
                <img src="/assets/images/logo_dark.png" style={{height: 30}} alt=""/>
                <StyledSpan mode={mode} className="sidenavHoverShow">
                    ISI.INVOICE
                </StyledSpan>
            </Box>
            <Box
                className="sidenavHoverShow"
                sx={{display: mode === 'compact' ? 'none' : 'block'}}
            >
                {children || null}
            </Box>
        </BrandRoot>
    )
}

export default Brand
