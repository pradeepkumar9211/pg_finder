import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Home = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!city && !pincode) return;
    navigate(`/search?city=${city}&pincode=${pincode}`);
  };

  return (
    <Layout>

      {/* Hero section */}
      <div className="bg-blue-600 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Find your perfect PG room
          </h1>
          <p className="text-blue-100 text-lg mb-10">
            Search verified PG accommodations by city or pincode
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="City (e.g. Pune)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-4 py-2.5 text-gray-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Pincode (e.g. 411001)"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="flex-1 px-4 py-2.5 text-gray-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              Search
            </button>
          </form>

        </div>
      </div>

      {/* Features section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
          Why RoomConnect?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-800 mb-2">Easy Search</h3>
            <p className="text-gray-500 text-sm">
              Find PGs by city, pincode or room type in seconds
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-semibold text-gray-800 mb-2">Verified Listings</h3>
            <p className="text-gray-500 text-sm">
              All PGs are verified by our admin before going live
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-800 mb-2">Secure Booking</h3>
            <p className="text-gray-500 text-sm">
              Physical verification required before every booking is confirmed
            </p>
          </div>

        </div>
      </div>

    </Layout>
  );
};

export default Home;