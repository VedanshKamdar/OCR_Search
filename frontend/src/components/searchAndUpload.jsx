import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FileUpload from './fileUpload';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  fontFamily: 'Montserrat',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 25,
  backgroundColor: alpha('#ffffff', 0.15), // Light grey background
  '&:hover': {
    backgroundColor: alpha('#ffffff', 0.25), // Lighten on hover if needed
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '30ch', // Adjusted width for larger search bar
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary, // Icon color
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#B7D1E7', // Text color
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    fontFamily: 'Montserrat', // Font family
    '&::placeholder': {
      color: '#B7D1E7', // Placeholder color
      opacity: 1, // Ensure placeholder is fully visible
      fontFamily: 'Montserrat', // Font family
    },
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#B7D1E7', // Button background color
  fontWeight: 'bold',
  marginRight: theme.spacing(3),
  width: '30ch',
  color: '#041d32c2', // Button text color
  borderRadius: 25, // Rounded borders
  '&:hover': {
    backgroundColor: '#ec7063', // Hover background color (mauve)
  },
}));

const SearchAndUpload = ({ onUploadSuccess, onSearch }) => {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUploadClick = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Search>
        <div style={{ flexGrow: 1 }} />{' '}
        {/* Ensures UploadButton stays on the right */}
        <UploadButton variant="contained" onClick={handleUploadClick}>
          Upload File
        </UploadButton>
      </Toolbar>

      <Dialog
        open={openUploadDialog}
        onClose={handleCloseUploadDialog}
        aria-labelledby="upload-dialog-title"
      >
        <DialogTitle id="upload-dialog-title">Upload File</DialogTitle>
        <DialogContent>
          <FileUpload
            onClose={handleCloseUploadDialog}
            onUploadSuccess={onUploadSuccess}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </StyledAppBar>
  );
};

export default SearchAndUpload;
