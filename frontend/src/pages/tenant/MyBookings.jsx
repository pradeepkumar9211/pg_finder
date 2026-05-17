import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';
import BookingCard from '../../components/BookingCard';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings/my');
      setBookings(res.data.data);
    } catch (err) {
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (booking_id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${booking_id}/cancel`);
      toast.success('Booking cancelled.');
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === booking_id ? { ...b, status: 'cancelled' } : b
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">

        <h2 className="text-xl font-bold text-gray-800 mb-6">My Bookings</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            You have no bookings yet.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.booking_id} booking={booking}>
                {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                  <button
                    onClick={() => handleCancel(booking.booking_id)}
                    className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100"
                  >
                    Cancel Booking
                  </button>
                )}
              </BookingCard>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default MyBookings;