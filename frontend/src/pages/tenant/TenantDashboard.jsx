import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import BookingCard from '../../components/BookingCard';

const TenantDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await API.get('/bookings/my');
                setBookings(res.data.data);
            } catch (err) {
                toast.error('Failed to load dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const stats = {
        total: bookings.length,
        pending: bookings.filter((b) => b.status === 'pending').length,
        approved: bookings.filter((b) => b.status === 'approved').length,
        rejected: bookings.filter((b) => b.status === 'rejected').length,
    };

    const statCards = [
        { label: 'Total Bookings', value: stats.total, color: 'bg-blue-50 text-blue-600' },
        { label: 'Pending', value: stats.pending, color: 'bg-amber-50 text-amber-600' },
        { label: 'Approved', value: stats.approved, color: 'bg-green-50 text-green-600' },
        { label: 'Rejected', value: stats.rejected, color: 'bg-red-50 text-red-600' },
    ];

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-10">

                <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Welcome, {user?.name.split(' ')[0]}
                </h2>
                <p className="text-gray-500 text-sm mb-8">Here's your overview</p>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                            {statCards.map((card) => (
                                <div key={card.label} className={`rounded-xl p-5 ${card.color}`}>
                                    <p className="text-3xl font-bold mb-1">{card.value}</p>
                                    <p className="text-sm font-medium">{card.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Quick links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            <Link to="/search" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                                <h3 className="font-semibold text-gray-800 mb-1">Find a PG</h3>
                                <p className="text-sm text-gray-500">Search PGs by city or pincode</p>
                            </Link>
                            <Link to="/my-bookings" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                                <h3 className="font-semibold text-gray-800 mb-1">My Bookings</h3>
                                <p className="text-sm text-gray-500">View all your booking requests</p>
                            </Link>
                        </div>

                        {/* Recent bookings */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Recent Bookings</h3>
                            {bookings.length === 0 ? (
                                <p className="text-gray-400 text-sm">You have no bookings yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.slice(0, 3).map((booking) => (
                                        <BookingCard key={booking.booking_id} booking={booking} />
                                    ))}
                                </div>
                            )}
                        </div>

                    </>
                )}

            </div>
        </Layout>
    );
};

export default TenantDashboard;