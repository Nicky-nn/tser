import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, CircularProgress, Grid, TextField } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { object, string } from 'yup';

import { isEmptyValue } from '../../../../utils/helper';
import { Paragraph } from '../../../components/Template/Typography';
import useAuth from '../../../hooks/useAuth';

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: 'center',
  padding: '15px 15px 5px 15px',
}));

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '20px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const IMG = styled('img')(() => ({
  width: '100%',
  maxHeight: '90px',
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh',
  '& .card': {
    maxWidth: 400,
    borderRadius: 12,
    margin: '1rem',
  },
}));

const StyledProgress = styled(CircularProgress)(() => ({
  position: 'absolute',
  top: '6px',
  left: '25px',
}));

const validationSchema = object({
  shop: string().required('Url de la tienda es requerido'),
  email: string().email('Debe registrar un email válido').required('Email es requerido'),
  password: string()
    .min(6, 'Password debe contener al menos 6 caracteres')
    .required('Password es requerido'),
});

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login }: any = useAuth();

  const [message, setMessage] = useState('');
  const formik = useFormik({
    initialValues: {
      shop: '',
      email: '',
      password: '',
      remember: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const { shop, email, password, remember } = values;
      try {
        if (remember) {
          localStorage.setItem('shop', shop);
        } else {
          localStorage.removeItem('shop');
        }
        await login(shop, email, password);
        navigate('/');
      } catch (e: any) {
        console.log(e);
        setMessage(e.message);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!isEmptyValue(localStorage.getItem('shop'))) {
      formik.setFieldValue('shop', localStorage.getItem('shop'));
    }
  }, []);

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={12} xs={12}>
            <JustifyBox p={4} height="100%">
              <IMG
                src="/assets/images/logo-isiinvoice.png"
                alt="Gestión de ventas y servicios"
                style={{ paddingTop: '20px' }}
              />
            </JustifyBox>
          </Grid>
          <Grid item sm={12} xs={12}>
            <ContentBox>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={5}>
                  <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                    <TextField
                      label="URL Comercio"
                      size={'small'}
                      sx={{ mb: 3, width: '100%' }}
                      type="text"
                      name="shop"
                      value={formik.values.shop}
                      onChange={formik.handleChange}
                      error={formik.touched.shop && Boolean(formik.errors.shop)}
                      helperText={formik.touched.shop && formik.errors.shop}
                    />

                    <TextField
                      label="Correo Electrónico"
                      size={'small'}
                      sx={{ mb: 3, width: '100%' }}
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
                      size={'small'}
                      sx={{ mb: 2, width: '100%' }}
                      id="password"
                      name="password"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={formik.handleChange}
                          checked={formik.values.remember}
                          sx={{ padding: 0 }}
                        />

                        <Paragraph>Recordarme</Paragraph>
                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        ¿Olvidaste tu contraseña?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Iniciar Sesión
                    </LoadingButton>
                  </Grid>
                </Grid>

                {message && <Paragraph sx={{ color: 'red' }}>{message}</Paragraph>}
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  );
};

export default JwtLogin;
