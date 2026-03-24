import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import PGDetails from './pages/PGDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MyBookings from './pages/tenant/MyBookings';
import MyListings from './pages/owner/MyListings';
import AddPG from './pages/owner/AddPG';
import EditPG from './pages/owner/EditPG';
import ManageBookings from './pages/owner/ManageBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageOwners from './pages/admin/ManageOwners';
import ManagePGs from './pages/admin/ManagePGs';
import AdminBookings from './pages/admin/ManageBookings';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/pg/:pg_id" element={<PGDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Tenant routes */}
          <Route path="/my-bookings" element={
            <ProtectedRoute role="tenant">
              <MyBookings />
            </ProtectedRoute>
          } />

          {/* Owner routes */}
          <Route path="/my-listings" element={
            <ProtectedRoute role="owner">
              <MyListings />
            </ProtectedRoute>
          } />
          <Route path="/add-pg" element={
            <ProtectedRoute role="owner">
              <AddPG />
            </ProtectedRoute>
          } />
          <Route path="/edit-pg/:pg_id" element={
            <ProtectedRoute role="owner">
              <EditPG />
            </ProtectedRoute>
          } />
          <Route path="/manage-bookings" element={
            <ProtectedRoute role="owner">
              <ManageBookings />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/owners" element={
            <ProtectedRoute role="admin">
              <ManageOwners />
            </ProtectedRoute>
          } />
          <Route path="/admin/pgs" element={
            <ProtectedRoute role="admin">
              <ManagePGs />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute role="admin">
              <AdminBookings />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;