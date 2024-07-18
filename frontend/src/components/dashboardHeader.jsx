import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const pages = [];

const clickAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

function DashboardHeader() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Profile',
      route: '/profile',
    },
    {
      name: 'Change Password',
      route: '/update-password',
    },
    {
      name: 'Logout',
      onClick: () => {
        localStorage.removeItem('token');
        navigate('/');
      },
    },
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (menuItem) => {
    setAnchorElUser(null);

    if (menuItem.route) {
      navigate(menuItem.route);
    } else if (menuItem.onClick) {
      menuItem.onClick();
    }
  };

  const handlePageClick = (page) => {
    if (page === 'File Upload') {
      navigate('/files');
    } else if (page === 'Dashboard') {
      navigate('/dashboard');
    }
    handleCloseNavMenu();
  };

  const handleFileUploadClick = () => {
    navigate('/files');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#041d42', top: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/dashboard"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Segoe UI',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'underline',
              '&:hover': {
                color: '#EC7063',
              },
            }}
          >
            OCR File Upload System
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handlePageClick(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/dashboard"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'sans-serif',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            OCR File Upload System
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handlePageClick}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#B7D1E7',
                color: '#041d42',
                marginRight: 2,
                '&:hover': {
                  bgcolor: '#EC7063',
                  transform: 'scale(1.1)',
                },
                animation: `${clickAnimation} 1s ease`,
              }}
              onClick={handleFileUploadClick}
            >
              Files
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#B7D1E7',
                color: '#041d42',
                marginRight: 2,
                '&:hover': {
                  bgcolor: '#EC7063',
                  transform: 'scale(1.1)',
                },
                animation: `${clickAnimation} 1s ease`,
              }}
              onClick={() => handlePageClick('Dashboard')}
            >
              Dashboard
            </Button>
            <Tooltip title="Profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ m: 1, bgcolor: '#041d42' }}>
                  <AccountCircleTwoToneIcon sx={{ color: '#B7D1E7' }} />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {menuItems.map((menuItem) => (
                <MenuItem
                  key={menuItem.name}
                  onClick={() => handleMenuClick(menuItem)}
                >
                  <Typography textAlign="center">{menuItem.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default DashboardHeader;
