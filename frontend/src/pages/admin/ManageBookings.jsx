import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';

const STATUS_STYLES = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const VERIFY_STYLES = {
  not_verified: 'bg-gray-100 text-gray-600',
  verified:     'bg-blue-100 text-blue-700',
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/admin/bookings');
        setBookings(res.data.data);
      } catch (err) {
        toast.error('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-10">

        <h2 className="text-xl font-bold text-gray-800 mb-6">All Bookings</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No bookings found.</div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{booking.pg_name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Tenant: {booking.tenant_name} • Owner: {booking.owner_name}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Booked on: {new Date(booking.booking_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ID: {booking.booking_id}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[booking.status]}`}>
                      {booking.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${VERIFY_STYLES[booking.verification_status]}`}>
                      {booking.verification_status === 'verified' ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ManageBookings;