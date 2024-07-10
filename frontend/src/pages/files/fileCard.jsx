import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const FileCard = ({ file, onView, onDelete }) => {
  return (
    <Card className="file-card">
      <CardContent className="file-card-content">
        <Typography variant="h6">
          {file.pdfName
            ? file.pdfName.replace(/\.pdf$/, '')
            : file.filename.replace(/\.[^/.]+$/, '')}
        </Typography>
        <Typography variant="body2">
          {file.uploadStatus === 'processing'
            ? 'Processing...'
            : file.uploadStatus === 'uploaded'
            ? 'Uploaded'
            : 'Processed'}
        </Typography>
      </CardContent>
      <CardActions className="file-card-actions">
        <Button
          size="small"
          className="view-button"
          onClick={() => onView(file)}
        >
          View
        </Button>
        <Button
          size="small"
          color="error"
          variant="contained"
          onClick={() => onDelete(file)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default FileCard;
