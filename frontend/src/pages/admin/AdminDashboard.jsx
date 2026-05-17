import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ownersRes, tenantsRes, pgsRes, bookingsRes] = await Promise.all([
          API.get('/admin/owners'),
          API.get('/admin/tenants'),
          API.get('/admin/pg'),
          API.get('/admin/bookings'),
        ]);
        setStats({
          owners: ownersRes.data.count,
          tenants: tenantsRes.data.count,
          pgs: pgsRes.data.count,
          bookings: bookingsRes.data.count,
        });
      } catch (err) {
        toast.error('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Owners', value: stats?.owners, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Tenants', value: stats?.tenants, color: 'bg-green-50 text-green-600' },
    { label: 'Total PGs', value: stats?.pgs, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Bookings', value: stats?.bookings, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-10">

        <h2 className="text-xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
        <p className="text-gray-500 text-sm mb-8">Overview of the entire platform</p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className={`rounded-xl p-6 ${card.color}`}
              >
                <p className="text-3xl font-bold mb-1">{card.value}</p>
                <p className="text-sm font-medium">{card.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick links */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <a href="/admin/owners" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-1">Owners</h3>
            <p className="text-sm text-gray-500">Approve or reject owners</p>
          </a>
          <a href="/admin/tenants" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-1">Tenants</h3>
            <p className="text-sm text-gray-500">View all registered tenants</p>
          </a>
          <a href="/admin/pgs" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-1">PG Listings</h3>
            <p className="text-sm text-gray-500">View and remove listings</p>
          </a>
          <a href="/admin/bookings" className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-1">Bookings</h3>
            <p className="text-sm text-gray-500">View all bookings</p>
          </a>
        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;