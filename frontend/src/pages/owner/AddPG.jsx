import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';

const AddPG = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pg_name:   '',
    room_type: 'single',
    rent:      '',
    address:   '',
    pincode:   '',
    city:      '',
  });

  const [images, setImages]   = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pg_name || !formData.rent || !formData.address || !formData.pincode || !formData.city) {
      toast.error('All fields are required.');
      return;
    }

    try {
      setLoading(true);

      // Step 1 — create the PG
      const res = await API.post('/pg', formData);
      const pg_id = res.data.pg_id;

      // Step 2 — upload images if any
      if (images.length > 0) {
        const imageData = new FormData();
        images.forEach((img) => imageData.append('images', img));
        await API.post(`/pg/${pg_id}/images`, imageData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('PG listed successfully!');
      navigate('/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-10">

        <h2 className="text-xl font-bold text-gray-800 mb-6">Add New PG</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PG Name</label>
            <input
              type="text"
              name="pg_name"
              value={formData.pg_name}
              onChange={handleChange}
              placeholder="e.g. Sharma PG"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <select
              name="room_type"
              value={formData.room_type}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rent (per month)</label>
            <input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              placeholder="e.g. 8000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 12 MG Road"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Pune"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="e.g. 411001"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images (optional, max 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files))}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating listing...' : 'Create Listing'}
          </button>

        </form>
      </div>
    </Layout>
  );
};

export default AddPG;