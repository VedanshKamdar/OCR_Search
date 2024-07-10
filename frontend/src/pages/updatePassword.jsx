import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ENDPOINT_URLS } from '../urls';
import DashboardHeader from '../components/dashboardHeader';
import { http } from '../http';
import { useNotification } from '../context/notification';


const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must include one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .notOneOf(
      [Yup.ref('currentPassword')],
      'New password must be different from current password'
    ),
  confirmNewPassword: Yup.string()
    .required('Please confirm your new password')
    .oneOf([Yup.ref('newPassword'), null], 'The passwords do not match'),
});

const UpdatePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await http.post(ENDPOINT_URLS.UPDATE_PASSWORD, data, {});
      showNotification(response.data.message, 'success');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'An error occurred',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibilityCP = useCallback(() => {
    setShowCurrentPassword((prev) => !prev);
  }, []);
  const togglePasswordVisibilityNP = useCallback(() => {
    setShowNewPassword((prev) => !prev);
  }, []);
  const togglePasswordVisibilityNCP = useCallback(() => {
    setShowConfirmNewPassword((prev) => !prev);
  }, []);

  return (
    <>
      <DashboardHeader />
      <Container maxWidth="sm">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{
            minHeight: '91vh',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Grid item xs={12} sm={8} md={6}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: '10px',
                padding: 3,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0px 4px 20px rgba(167, 183, 245, 0.5)',
              }}
            >
              <Typography component="h1" variant="h5" gutterBottom>
                Update Password
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  {...register('currentPassword')}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibilityCP}
                          edge="end"
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  {...register('newPassword')}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibilityNP}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  {...register('confirmNewPassword')}
                  error={!!errors.confirmNewPassword}
                  helperText={errors.confirmNewPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibilityNCP}
                          edge="end"
                        >
                          {showConfirmNewPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ position: 'relative', mt: 3 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default UpdatePassword;
