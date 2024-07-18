import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Signup from './pages/signup';
import SignIn from './pages/signin';
import Dashboard from './pages/dashboard';
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword';
import Profile from './pages/profile';
import UpdatePassword from './pages/updatePassword';
import Files from './pages/files/files';
import FileUpload from './pages/files/fileUpload';
import AuthenticatedRoutes from './components/authenticatedRoutes';
import { NotificationProvider } from './context/notification';
import { ProfileProvider } from './context/profile';

const App = () => (
  <ThemeProvider theme={createTheme()}>
    <NotificationProvider>
      <ProfileProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={<AuthenticatedRoutes component={Dashboard} />}
            />
            <Route
              path="/profile"
              element={<AuthenticatedRoutes component={Profile} />}
            />
            <Route
              path="/update-password"
              element={<AuthenticatedRoutes component={UpdatePassword} />}
            />
            <Route
              path="/file-upload"
              element={<AuthenticatedRoutes component={FileUpload} />}
            />
            <Route
              path="/files"
              element={<AuthenticatedRoutes component={Files} />}
            />
          </Routes>
        </Router>
      </ProfileProvider>
    </NotificationProvider>
  </ThemeProvider>
);

export default App;
