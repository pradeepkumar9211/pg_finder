import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';
import BookingCard from '../../components/BookingCard';

const ManageBookings = () => {
  const [listings, setListings]   = useState([]);
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const listRes = await API.get('/pg/owner/my-listings');
        const allListings = listRes.data.data;
        setListings(allListings);

        // Fetch bookings for all PGs owned by this owner
        const bookingPromises = allListings.map((pg) =>
          API.get(`/bookings/pg/${pg.pg_id}`)
        );
        const bookingResults = await Promise.all(bookingPromises);
        const allBookings = bookingResults.flatMap((res) => res.data.data);
        setBookings(allBookings);
      } catch (err) {
        toast.error('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleVerify = async (booking_id) => {
    try {
      await API.put(`/bookings/${booking_id}/verify`);
      toast.success('Tenant verified successfully!');
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === booking_id
            ? { ...b, verification_status: 'verified' }
            : b
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    }
  };

  const handleStatus = async (booking_id, status) => {
    try {
      await API.put(`/bookings/${booking_id}/status`, { status });
      toast.success(`Booking ${status} successfully!`);
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === booking_id ? { ...b, status } : b
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">

        <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Bookings</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No booking requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.booking_id} booking={booking}>

                {/* Verify button — only if not verified yet */}
                {booking.verification_status === 'not_verified' && (
                  <button
                    onClick={() => handleVerify(booking.booking_id)}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100"
                  >
                    Mark as Verified
                  </button>
                )}

                {/* Approve/Reject — only if verified and still pending */}
                {booking.verification_status === 'verified' && booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatus(booking.booking_id, 'approved')}
                      className="text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatus(booking.booking_id, 'rejected')}
                      className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </>
                )}

              </BookingCard>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ManageBookings;