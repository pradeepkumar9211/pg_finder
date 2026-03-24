import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <Link to="/" className="text-xl font-bold text-blue-600">
          RoomConnect
        </Link>

        <div className="flex items-center gap-6">

          {/* Guest links */}
          {!user && (
            <>
              <Link to="/search" className="text-gray-600 hover:text-blue-600 text-sm">
                Find PG
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                Register
              </Link>
            </>
          )}

          {/* Tenant links */}
          {user?.role === 'tenant' && (
            <>
              <Link to="/search" className="text-gray-600 hover:text-blue-600 text-sm">
                Find PG
              </Link>
              <Link to="/my-bookings" className="text-gray-600 hover:text-blue-600 text-sm">
                My Bookings
              </Link>
            </>
          )}

          {/* Owner links */}
          {user?.role === 'owner' && (
            <>
              <Link to="/my-listings" className="text-gray-600 hover:text-blue-600 text-sm">
                My Listings
              </Link>
              <Link to="/add-pg" className="text-gray-600 hover:text-blue-600 text-sm">
                Add PG
              </Link>
              <Link to="/manage-bookings" className="text-gray-600 hover:text-blue-600 text-sm">
                Bookings
              </Link>
            </>
          )}

          {/* Admin links */}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 text-sm">
                Dashboard
              </Link>
              <Link to="/admin/owners" className="text-gray-600 hover:text-blue-600 text-sm">
                Owners
              </Link>
              <Link to="/admin/pgs" className="text-gray-600 hover:text-blue-600 text-sm">
                PGs
              </Link>
              <Link to="/admin/bookings" className="text-gray-600 hover:text-blue-600 text-sm">
                Bookings
              </Link>
            </>
          )}

          {/* Logged in — show name + logout */}
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;