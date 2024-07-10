import { useState, useEffect, useCallback, useMemo } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import DashboardHeader from '../../components/dashboardHeader';
import SearchAndUpload from '../../components/searchAndUpload';
import FileCard from './fileCard';
import FileDialog from './fileDialog';

import './files.css';

import { ENDPOINT_URLS } from '../../urls';
import { http } from '../../http';
import { useNotification } from '../../context/notification';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [viewFile, setViewFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await http.get(ENDPOINT_URLS.FILES);
        setFiles(response.data.files || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching files:', error);
        setError('Failed to load files.');
        setLoading(false);
        showNotification('Failed to load files.', 'error');
      }
    };
    fetchFiles();
  }, [showNotification]);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!fileToDelete) return;

    setDeleting(true);
    try {
      await http.delete(`${ENDPOINT_URLS.FILES}/${fileToDelete._id}`);
      setFiles(files.filter((file) => file._id !== fileToDelete._id));
      setOpenDialog(false);
      setDeleting(false);
      showNotification('File deleted successfully', 'success');
    } catch (error) {
      setError('Failed to delete file.');
      setDeleting(false);
      showNotification('Failed to delete file', 'error');
    }
  }, [fileToDelete, files, showNotification]);

  const handleView = useCallback(
    async (file) => {
      try {
        const response = await http.get(
          `${ENDPOINT_URLS.AZURE_SAS}/${file.pdfName}`
        );
        const { sasUrl } = response.data;
        setViewFile({ ...file, pdfUrl: sasUrl });
      } catch (error) {
        console.error('Error generating SAS URL:', error);
        showNotification('Failed to generate SAS URL', 'error');
      }
    },
    [showNotification]
  );

  const handleUploadSuccess = useCallback(
    (newFile) => {
      setFiles((prevFiles) => [
        ...prevFiles,
        { ...newFile, uploadStatus: 'uploaded' },
      ]);
      showNotification('File uploaded successfully', 'success');

      pollFileStatus(newFile._id);
    },
    [showNotification]
  );

  const pollFileStatus = useCallback(
    (fileId) => {
      const interval = setInterval(async () => {
        try {
          const response = await http.get(`${ENDPOINT_URLS.FILES}/${fileId}`);
          const updatedFile = response.data.file;
          setFiles((prevFiles) =>
            prevFiles.map((file) => (file._id === fileId ? updatedFile : file))
          );

          if (updatedFile.status === 'processing') {
            showNotification('File is being processed', 'info');
          } else if (updatedFile.status === 'processed') {
            showNotification('File processed successfully', 'success');
            clearInterval(interval);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } catch (error) {
          console.error('Error polling file status:', error);
          clearInterval(interval);
        }
      }, 3000);
    },
    [showNotification]
  );

  const filteredFiles = useMemo(
    () =>
      files.filter((file) =>
        file.filename.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [files, searchTerm]
  );

  return (
    <div className="files-root">
      <DashboardHeader />
      <SearchAndUpload
        onUploadSuccess={handleUploadSuccess}
        onSearch={handleSearchChange}
      />
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredFiles.length === 0 ? (
        <Typography
          variant="h6"
          align="center"
          style={{ margin: '20px 0', color: 'white' }}
        >
          Sorry, No files to display!
        </Typography>
      ) : (
        <div className="files-grid">
          {filteredFiles.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              onView={handleView}
              onDelete={() => {
                setFileToDelete(file);
                setOpenDialog(true);
              }}
            />
          ))}
        </div>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the file &quot;
            {fileToDelete?.filename}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" disabled={deleting}>
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <FileDialog
        open={!!viewFile}
        file={viewFile}
        onClose={() => setViewFile(null)}
      />
    </div>
  );
};

export default Files;
