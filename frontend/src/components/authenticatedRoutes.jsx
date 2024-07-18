import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useProfile } from '../context/profile';
import { ENDPOINT_URLS } from '../urls';
import { http } from '../http';

const AuthenticatedRoutes = ({ component: Component }) => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [isLoading, setLoading] = useState(true);

  const getProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User token not found');
      }
      const response = await http.get(ENDPOINT_URLS.PROFILE);
      if (response.status === 200) {
        updateProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      navigate('/signin');
    } finally {
      setLoading(false);
    }
  }, [navigate, updateProfile]);

  useEffect(() => {
    if (!profile) {
      getProfile();
    }
  }, [updateProfile, profile, navigate, getProfile]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#041d32c2',
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return <Component />;
};

AuthenticatedRoutes.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default AuthenticatedRoutes;
