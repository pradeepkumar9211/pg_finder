import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const OwnerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const listRes = await API.get('/pg/owner/my-listings');
                const listings = listRes.data.data;

                const bookingPromises = listings.map((pg) =>
                    API.get(`/bookings/pg/${pg.pg_id}`)
                );
                const bookingResults = await Promise.all(bookingPromises);
                const allBookings = bookingResults.flatMap((r) => r.data.data);

                const reviewPromises = listings.map((pg) =>
                    API.get(`/feedback/pg/${pg.pg_id}`)
                );
                const reviewResults = await Promise.all(reviewPromises);
                const allReviews = reviewResults.flatMap((r) => r.data.data);

                setStats({
                    listings: listings.length,
                    bookings: allBookings.length,
                    pending: allBookings.filter((b) => b.status === 'pending').length,
                    approved: allBookings.filter((b) => b.status === 'approved').length,
                });
                setReviews(allReviews);
            } catch (err) {
                toast.error('Failed to load dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const statCards = [
        { label: 'My Listings', value: stats?.listings, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Bookings', value: stats?.bookings, color: 'bg-purple-50 text-purple-600' },
        { label: 'Pending Bookings', value: stats?.pending, color: 'bg-amber-50 text-amber-600' },
        { label: 'Approved Bookings', value: stats?.approved, color: 'bg-green-50 text-green-600' },
    ];

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-6 py-10">

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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                            <Link to="/my-listings" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                                <h3 className="font-semibold text-gray-800 mb-1">My Listings</h3>
                                <p className="text-sm text-gray-500">View and manage your PG listings</p>
                            </Link>
                            <Link to="/manage-bookings" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                                <h3 className="font-semibold text-gray-800 mb-1">Manage Bookings</h3>
                                <p className="text-sm text-gray-500">Verify and approve booking requests</p>
                            </Link>
                            <Link to="/manage-faqs" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                                <h3 className="font-semibold text-gray-800 mb-1">Manage FAQs</h3>
                                <p className="text-sm text-gray-500">Answer questions from tenants</p>
                            </Link>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Reviews on your PGs
                            </h3>
                            {reviews.length === 0 ? (
                                <p className="text-gray-400 text-sm">No reviews yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((r) => (
                                        <div key={r.feed_id} className="border-b border-gray-50 pb-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {r.tenant_name}
                                                </p>
                                                <span className="text-yellow-500 text-sm">
                                                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{r.comment}</p>
                                        </div>
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

export default OwnerDashboard;