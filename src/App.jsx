import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Requests from './pages/Requests';
import Technicians from './pages/Technicians';
import Login from './pages/Login';

import { UserManagementProvider } from './hooks/useUserManagement';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <>
            <SignedIn>
              <Navigate to="/" replace />
            </SignedIn>
            <SignedOut>
              <Login />
            </SignedOut>
          </>
        } />
        <Route path="/" element={
          <>
            <SignedIn>
              <UserManagementProvider>
                <Layout />
              </UserManagementProvider>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }>
          <Route index element={<Dashboard />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="requests" element={<Requests />} />
          <Route path="technicians" element={<Technicians />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
