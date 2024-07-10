import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { http } from '../http';
import { useNotification } from '../context/notification';
import { ENDPOINT_URLS } from '../urls';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const validationSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .required('First name is required')
    .matches(/^[a-zA-Z ]+$/, 'Cannot contain special characters or numbers')
    .test(
      'multipleSpaces',
      'Cannot contain multiple consecutive spaces',
      (value) => !/\s{2,}/.test(value)
    ),
  last_name: Yup.string()
    .trim()
    .required('Last name is required')
    .matches(/^[a-zA-Z ]+$/, 'Cannot contain special characters or numbers')
    .test(
      'multipleSpaces',
      'Cannot contain multiple consecutive spaces',
      (value) => !/\s{2,}/.test(value)
    ),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must have at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).*$/,
      'Password must be a combination of at least 1 Uppercase letter, 1 Lowercase letter, 1 Special character, and should not contain spaces'
    ),
});

const SignUp = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        await http.post(ENDPOINT_URLS.SIGNUP, data);
        showNotification('Signup successful');
        navigate('/signin');
      } catch (error) {
        showNotification(
          error.response?.data?.msg || 'Server error. Please try again later.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate, showNotification]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={8}
        sx={{
          backgroundImage: `url(/authentication.jpeg)`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#203274' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 5 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  {...register('first_name')}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
                {errors.first_name && (
                  <Typography color="error">
                    {errors.first_name.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="family-name"
                  {...register('last_name')}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                />
                {errors.last_name && (
                  <Typography color="error">
                    {errors.last_name.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="email"
                  {...register('email')}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                />
                {errors.email && (
                  <Typography color="error">{errors.email.message}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="new-password"
                  {...register('password')}
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.password && (
                  <Typography color="error">
                    {errors.password.message}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#203274' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUp;
