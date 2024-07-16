import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(() => ({
  width: '150px',
  margin: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
    cursor: 'pointer',
  },
  backgroundColor: '#B7D1E7C2',
  textAlign: 'center',
}));

const ViewButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  backgroundColor: '#041d32',
  fontFamily: 'Montserrat, sans-serif',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#20AB1E',
  },
}));

const FileCard = ({ file, onViewClick }) => {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6">
          {file.pdfName.split('.').slice(0, -1).join('.')}
        </Typography>
      </CardContent>
      <CardActions>
        <ViewButton size="small" onClick={onViewClick}>
          View
        </ViewButton>
      </CardActions>
    </StyledCard>
  );
};

FileCard.propTypes = {
  file: PropTypes.shape({
    pdfName: PropTypes.string.isRequired,
  }).isRequired,
  onViewClick: PropTypes.func.isRequired,
};

export default FileCard;
