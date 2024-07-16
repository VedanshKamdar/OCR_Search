import { useState, useEffect, useCallback, useMemo } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import SearchAndUpload from './searchAndUpload';
import FileCard from './fileCard';
import FileDialog from './fileDialog';

import './files.css';

import { ENDPOINT_URLS } from '../../urls';
import { http } from '../../http';
import { useNotification } from '../../context/notification';
import Page from '../../components/page';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileViewDelete, setFileViewDelete] = useState({
    open: false,
    fileToDelete: null,
  });
  const [deleting, setDeleting] = useState(false);
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
        showNotification('Failed to load files.', 'error');
        setLoading(false);
      }
    };
    fetchFiles();
  }, [showNotification]);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!fileViewDelete.fileToDelete) return;

    setDeleting(true);
    try {
      await http.delete(
        `${ENDPOINT_URLS.FILES}/${fileViewDelete.fileToDelete._id}`
      );
      setFiles(
        files.filter((file) => file._id !== fileViewDelete.fileToDelete._id)
      );
      showNotification('File deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete file', 'error');
    } finally {
      setFileViewDelete({ ...fileViewDelete, open: false });
      setDeleting(false);
    }
  }, [fileViewDelete, files, showNotification]);

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
      <Page>
        <SearchAndUpload
          onUploadSuccess={handleUploadSuccess}
          onSearch={handleSearchChange}
        />
        {loading ? (
          <CircularProgress />
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
                  setFileViewDelete({ open: true, fileToDelete: file });
                }}
              />
            ))}
          </div>
        )}
        <Dialog
          open={fileViewDelete.open}
          onClose={() => setFileViewDelete({ ...fileViewDelete, open: false })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the file &quot;
              {fileViewDelete.fileToDelete?.filename}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setFileViewDelete({ ...fileViewDelete, open: false })
              }
              color="primary"
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="secondary"
              disabled={deleting}
            >
              {deleting ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
        <FileDialog
          open={!!viewFile}
          file={viewFile}
          onClose={() => setViewFile(null)}
        />
      </Page>
    </div>
  );
};

export default Files;
