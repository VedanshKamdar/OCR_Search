import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const FileDialog = ({ open, file, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>View PDF</DialogTitle>
      <DialogContent>
        {file && (
          <object
            data={file.pdfUrl}
            type="application/pdf"
            width="100%"
            height="500px"
          >
            <p>
              It appears you don&apos;t have a PDF plugin for this browser. No
              worries, you can{' '}
              <a href={file.pdfUrl} target="_blank" rel="noopener noreferrer">
                click here to download the PDF file.
              </a>
            </p>
          </object>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileDialog;
