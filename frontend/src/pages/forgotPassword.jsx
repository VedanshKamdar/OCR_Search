import { useForm } from 'react-hook-form';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

import DashboardHeader from '../components/dashboardHeader';
import { ENDPOINT_URLS } from '../urls';
import { http } from '../http';
import { useNotification } from '../context/notification';

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await http.post(ENDPOINT_URLS.FORGOT_PASSWORD, formData);
      showNotification('Password reset email sent', 'success');
    } catch (error) {
      showNotification(
        error.response?.data?.message ||
          'Something went wrong. Please try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DashboardHeader />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Forgot Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email address',
                },
              })}
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default ForgotPassword;
