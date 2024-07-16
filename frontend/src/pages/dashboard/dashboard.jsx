import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FileCard from './fileCard';
import FileDialog from './fileDialog';

import './dashboard.css';

import { ENDPOINT_URLS } from '../../urls';
import { http } from '../../http';
import { useNotification } from '../../context/notification';
import Page from '../../components/page';

const CenteredContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 300px)',
});

const SearchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
  width: '100%',
  maxWidth: '1000px',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '80%',
  borderRadius: '32px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  height: '80%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled('input')(({ theme }) => ({
  color: 'inherit',
  padding: theme.spacing(1.5),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create('width'),
  width: '100%',
  borderRadius: '32px',
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: '1.2rem',
  fontFamily: 'Montserrat, sans-serif',
  '&::placeholder': {
    color: 'white',
    opacity: 0.8,
    fontSize: '1rem',
  },
}));

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewFile, setViewFile] = useState(null);

  const { showNotification } = useNotification();

  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.trim() === '') {
        setFiles([]);
        showNotification('Please enter a search term', 'error');
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await http.get(ENDPOINT_URLS.FILES_SEARCH, {
          params: {
            q: term,
          },
        });
        setFiles(response.data.files || []);
        showNotification(
          response.data.files.length > 0
            ? `Files containing "${term}" found.`
            : `No files containing "${term}" found.`,
          response.data.files.length > 0 ? 'success' : 'error'
        );
      } catch (error) {
        setFiles([]);
        showNotification('Failed to search files', 'error');
      } finally {
        setLoading(false);
      }
    }, 1000),
    [showNotification]
  );

  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setSearchTerm(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        debouncedSearch.flush();
      }
    },
    [debouncedSearch]
  );

  const handleView = useCallback(
    async (file) => {
      try {
        const response = await http.get(
          `${ENDPOINT_URLS.AZURE_SAS}/${file.pdfName}`
        );
        const { sasUrl } = response.data;
        setViewFile({ ...file, pdfUrl: sasUrl });
      } catch (error) {
        showNotification('Failed to generate SAS URL', 'error');
      }
    },
    [showNotification]
  );

  const handleCloseViewFile = useCallback(() => {
    setViewFile(null);
  }, []);

  return (
    <Page>
      <div className="dashboard">
        <CenteredContainer>
          <Typography variant="h3" className="title">
            Explore and find your files easily through keywords...
          </Typography>
          <SearchContainer>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search..."
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </Search>
          </SearchContainer>
        </CenteredContainer>

        {!loading && files.length > 0 && searchTerm.trim() !== '' && (
          <div className="file-list">
            {files.map((file) => (
              <FileCard key={file._id} file={file} onViewClick={handleView} />
            ))}
          </div>
        )}

        {loading && (
          <div className="loading-spinner">
            <CircularProgress />
          </div>
        )}

        <FileDialog viewFile={viewFile} onClose={handleCloseViewFile} />
      </div>
    </Page>
  );
};

export default Dashboard;
