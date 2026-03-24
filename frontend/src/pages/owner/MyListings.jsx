import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchListings = async () => {
    try {
      const res = await API.get('/pg/owner/my-listings');
      setListings(res.data.data);
    } catch (err) {
      toast.error('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (pg_id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/pg/${pg_id}`);
      toast.success('Listing deleted.');
      fetchListings();
    } catch (err) {
      toast.error('Failed to delete listing.');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Listings</h2>
          <Link
            to="/add-pg"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + Add New PG
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            You have no listings yet.
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((pg) => (
              <div
                key={pg.pg_id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{pg.pg_name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {pg.city} • {pg.room_type} • ₹{pg.rent}/mo
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block font-medium ${pg.availability_status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {pg.availability_status ? 'Available' : 'Not Available'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/pg/${pg.pg_id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit-pg/${pg.pg_id}`}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(pg.pg_id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
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

export default MyListings;