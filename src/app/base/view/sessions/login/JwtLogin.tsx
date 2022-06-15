import {Button, Card, Checkbox, CircularProgress, FormControlLabel, Grid, TextField,} from '@mui/material'
import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Box, styled, useTheme} from '@mui/system'
import {Paragraph} from "../../../components/Template/Typography";
import useAuth from "../../../hooks/useAuth";
import {object, string} from "yup";
import {useFormik} from "formik";

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'center',
    padding: '15px 15px 5px 15px',
}))

const ContentBox = styled(Box)(() => ({
    height: '100%',
    padding: '20px',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.01)',
}))

const IMG = styled('img')(() => ({
    width: '100%',
    maxHeight: '90px',
}))

const JWTRoot = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100% !important',
    '& .card': {
        maxWidth: 400,
        borderRadius: 12,
        margin: '1rem',
    },
}))

const StyledProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '6px',
    left: '25px',
}))

const validationSchema = object({
    shop: string().required('Url de la tienda es requerido'),
    email: string()
        .email('Debe registrar un email válido')
        .required('Email es requerido'),
    password: string()
        .min(7, 'Password debe contener al menos 7 caracteres')
        .required('Password es requerido'),
});

const JwtLogin = () => {
    const {palette} = useTheme()
    const textError = palette.error.main
    const textPrimary = palette.primary.main
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const {login}: any = useAuth()
    const formik = useFormik({
        initialValues: {
            shop: 'base.integrate.com.bo',
            email: 'richi617@gmail.com',
            password: '6176816'
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            const {shop, email, password} = values
            try {
                await login(shop, email, password)
                navigate('/')
            } catch (e: any) {
                console.log(e)
                setMessage(e.message)
                setLoading(false)
            }
        },
    })
    const [userInfo, setUserInfo]: any = useState({
        store: 'base.integrate.com.bo',
        email: 'richi617@gmail.com',
        password: '6176816',
    })


    const handleChange = ({target: {name, value}}: any) => {
        let temp: any = {...userInfo}
        temp[name] = value
        setUserInfo(temp)
    }


    return (
        <JWTRoot>
            <Card className="card">
                <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <JustifyBox p={4} height="100%">
                            <IMG
                                src="/assets/images/logo-isiinvoice.png"
                                alt="Gestión de ventas y servicios"
                                style={{paddingTop: '20px'}}
                            />
                        </JustifyBox>
                    </Grid>
                    <Grid item lg={12} md={12} sm={7} xs={12}>
                        <ContentBox>
                            <form onSubmit={formik.handleSubmit} onError={() => null}>
                                <Grid container spacing={5}>
                                    <Grid item lg={12} md={12} sm={12} xs={12} sx={{mt: 2}}>
                                        <TextField
                                            label="Url Tienda"
                                            size={"small"}
                                            sx={{mb: 3, width: '100%'}}
                                            type="text"
                                            name="shop"
                                            value={formik.values.shop}
                                            onChange={formik.handleChange}
                                            error={formik.touched.shop && Boolean(formik.errors.shop)}
                                            helperText={formik.touched.shop && formik.errors.shop}
                                        />

                                        <TextField
                                            label="Correo Electrónico"
                                            size={"small"}
                                            sx={{mb: 3, width: '100%'}}
                                            id="email"
                                            name="email"
                                            type="text"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                        />

                                        <TextField
                                            label="Contraseña"
                                            size={"small"}
                                            sx={{mb: 2, width: '100%'}}
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            error={formik.touched.password && Boolean(formik.errors.password)}
                                            helperText={formik.touched.password && formik.errors.password}
                                        />

                                        <FormControlLabel
                                            sx={{mb: '12px', maxWidth: 288}}
                                            name="agreement"
                                            onChange={handleChange}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    onChange={({
                                                                   target: {checked},
                                                               }) =>
                                                        handleChange({
                                                            target: {
                                                                name: 'agreement',
                                                                value: checked,
                                                            },
                                                        })
                                                    }
                                                    checked={userInfo.agreement || true}
                                                />
                                            }
                                            label="Recordarme"
                                        />
                                    </Grid>

                                </Grid>

                                {message && (
                                    <Paragraph sx={{color: textError}}>
                                        {message}
                                    </Paragraph>
                                )}

                                <FlexBox mb={2} flexWrap="wrap">
                                    <Box position="relative">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={loading}
                                            type="submit"
                                        >
                                            Iniciar Sesión
                                        </Button>
                                        {loading && (
                                            <StyledProgress
                                                size={24}
                                                className="buttonProgress"
                                            />
                                        )}
                                    </Box>
                                </FlexBox>
                                <Button
                                    sx={{color: textPrimary}}
                                    onClick={() =>
                                        navigate('/session/forgot-password')
                                    }
                                >
                                    ¿Olvidaste tu contraseña?
                                </Button>
                            </form>
                        </ContentBox>
                    </Grid>
                </Grid>
            </Card>
        </JWTRoot>
    )
}

export default JwtLogin
