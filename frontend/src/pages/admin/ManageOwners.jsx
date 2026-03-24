import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const ManageOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    try {
      const res = await API.get('/admin/owners');
      setOwners(res.data.data);
    } catch (err) {
      toast.error('Failed to load owners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleStatus = async (owner_id, status) => {
    try {
      await API.put(`/admin/owners/${owner_id}/status`, { status });
      toast.success(`Owner ${status} successfully.`);
      setOwners((prev) =>
        prev.map((o) =>
          o.owner_id === owner_id ? { ...o, status } : o
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-10">

        <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Owners</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : owners.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No owners found.</div>
        ) : (
          <div className="space-y-3">
            {owners.map((owner) => (
              <div
                key={owner.owner_id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{owner.owner_name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{owner.email} • {owner.phone_no}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block font-medium capitalize ${STATUS_STYLES[owner.status]}`}>
                    {owner.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  {owner.status !== 'approved' && (
                    <button
                      onClick={() => handleStatus(owner.owner_id, 'approved')}
                      className="text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100"
                    >
                      Approve
                    </button>
                  )}
                  {owner.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatus(owner.owner_id, 'rejected')}
                      className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100"
                    >
                      Reject
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ManageOwners;