import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';

import { useProfile } from '../context/profileContext';
import { useNotification } from '../context/notification';
import Page from '../components/page';
import profileImage from './profile.jpg';

const Profile = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { showNotification } = useNotification();

  const onChangePassword = useCallback(() => {
    navigate('/update-password');
  }, [navigate]);

  const onLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/signin');
    showNotification('Logged out successfully', 'success');
  }, [navigate, showNotification]);

  return (
    <>
      <Page>
        <Box
          sx={{
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#041d32c2',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
          }}
        >
          <CssBaseline />
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              background: 'linear-gradient(270deg, #1F618D, #D4E6F1)',
              backgroundSize: '400% 400%',
              animation: 'gradientAnimation 4s ease infinite',
              '@keyframes gradientAnimation': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
              width: 380,
              height: 600,
              textAlign: 'center',
              padding: 3,
              borderRadius: 3,
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Avatar
                alt="Bitmoji"
                src={profileImage}
                sx={{ width: 150, height: 150, margin: '0 auto 8px' }}
              />
              <Typography component="h1" variant="h5">
                Hey, {`${profile.first_name} ${profile.last_name}`}!!
              </Typography>
              <Typography component="h2" variant="h6">
                Welcome to our OCR File Upload System—your gateway to easy and
                efficient document processing.
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Your email is: {profile.email}
              </Typography>
            </CardContent>
            <Box sx={{ paddingBottom: 2 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: '#203274', color: '#ffffff' }}
                onClick={onChangePassword}
              >
                Change Password
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, bgcolor: '#203274', color: '#ffffff' }}
                onClick={onLogout}
              >
                Logout
              </Button>
            </Box>
          </Card>
        </Box>
      </Page>
    </>
  );
};

export default Profile;
