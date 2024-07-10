import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const FileDialog = ({ viewFile, onClose }) => {
  return (
    <Dialog open={!!viewFile} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>View PDF</DialogTitle>
      <DialogContent>
        {viewFile && (
          <object
            data={viewFile.pdfUrl}
            type="application/pdf"
            width="100%"
            height="500px"
          >
            <p>
              It appears you don&apos;t have a PDF plugin for this browser. No
              worries, you can{' '}
              <a
                href={viewFile.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
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
