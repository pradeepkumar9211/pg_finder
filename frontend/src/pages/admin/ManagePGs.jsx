import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';

const ManagePGs = () => {
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPGs = async () => {
    try {
      const res = await API.get('/admin/pg');
      setPGs(res.data.data);
    } catch (err) {
      toast.error('Failed to load PGs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPGs();
  }, []);

  const handleDelete = async (pg_id) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) return;
    try {
      await API.delete(`/admin/pg/${pg_id}`);
      toast.success('PG removed successfully.');
      setPGs((prev) => prev.filter((pg) => pg.pg_id !== pg_id));
    } catch (err) {
      toast.error('Failed to remove PG.');
    }
  };

  const handleToggle = async (pg_id, current) => {
    try {
      await API.put(`/admin/pg/${pg_id}/status`, {
        availability_status: current ? 0 : 1,
      });
      toast.success('PG status updated.');
      setPGs((prev) =>
        prev.map((pg) =>
          pg.pg_id === pg_id
            ? { ...pg, availability_status: current ? 0 : 1 }
            : pg
        )
      );
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-10">

        <h2 className="text-xl font-bold text-gray-800 mb-6">Manage PGs</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : pgs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No PGs found.</div>
        ) : (
          <div className="space-y-3">
            {pgs.map((pg) => (
              <div
                key={pg.pg_id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{pg.pg_name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {pg.city} • {pg.room_type} • ₹{pg.rent}/mo
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Owner: {pg.owner_name} ({pg.owner_email})
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block font-medium ${pg.availability_status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {pg.availability_status ? 'Available' : 'Not Available'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(pg.pg_id, pg.availability_status)}
                    className="text-sm bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100"
                  >
                    {pg.availability_status ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(pg.pg_id)}
                    className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ManagePGs;