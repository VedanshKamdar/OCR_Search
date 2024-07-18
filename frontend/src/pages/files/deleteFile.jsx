import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { http } from '../../http';
import { ENDPOINT_URLS } from '../../urls';
import { useNotification } from '../../context/notification';

const DeleteFile = ({ file, onDeleteSuccess, onClose }) => {
  const [deleting, setDeleting] = useState(false);
  const { showNotification } = useNotification();

  const handleDelete = async () => {
    if (!file) return;

    setDeleting(true);
    try {
      await http.delete(`${ENDPOINT_URLS.GET_FILES}/${file._id}`);
      onDeleteSuccess(file._id);
      showNotification('File deleted successfully', 'success');
      onClose();
    } catch (error) {
      console.error('Error deleting file:', error);
      showNotification('Failed to delete file', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the file {file?.filename}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={deleting}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="secondary" disabled={deleting}>
          {deleting ? <CircularProgress size={24} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteFile.propTypes = {
  file: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
  }).isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteFile;
