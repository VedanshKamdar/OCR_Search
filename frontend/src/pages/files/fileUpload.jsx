import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { ENDPOINT_URLS } from '../../urls';
import { http } from '../../http';

const ModalContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#041d32c2',
  color: '#ffffff',
  padding: theme.spacing(10),
  borderRadius: theme.spacing(2),
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const UploadInput = styled('input')({
  display: 'none',
});

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#B7D1E7',
  color: '#041d32c2',
  fontWeight: 'bold',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 3),
  margin: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#ec7063',
  },
}));

const FileUpload = ({ onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const authToken = localStorage.getItem('token');

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    if (file && file.size > 5 * 1024 * 1024) {
      setSnackbarMessage('File size should not exceed 5MB.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setSnackbarMessage('Please select a file first.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setSnackbarMessage('Please select an image file.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const uploadResponse = await http.post(ENDPOINT_URLS.FILES, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSnackbarMessage('File uploaded successfully.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      onUploadSuccess(uploadResponse.data.file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setSnackbarMessage(
        error.response?.data?.message ||
          'Error uploading file. Please try again.'
      );
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
      onClose();
    }
  }, [selectedFile, authToken, onClose, onUploadSuccess]);

  const handleSnackbarClose = useCallback(() => {
    setOpenSnackbar(false);
  }, []);

  return (
    <ModalContainer>
      <h2
        style={{
          marginBottom: '1rem',
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
        }}
      >
        Upload an Image
      </h2>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '8px',
            objectFit: 'cover',
            marginBottom: '1rem',
          }}
        />
      )}
      <UploadInput
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div style={{ display: 'flex' }}>
        <UploadButton
          variant="contained"
          disabled={!selectedFile || isLoading}
          onClick={handleUpload}
        >
          {isLoading ? <CircularProgress size={20} /> : 'Upload'}
        </UploadButton>
        <UploadButton htmlFor="file-upload" component="label">
          Select File
        </UploadButton>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          aria-live="assertive"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </ModalContainer>
  );
};

FileUpload.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUploadSuccess: PropTypes.func.isRequired,
};

export default FileUpload;
