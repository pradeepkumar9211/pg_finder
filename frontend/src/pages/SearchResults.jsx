import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import Layout from '../components/Layout';
import PGCard from '../components/PGCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const city     = searchParams.get('city')    || '';
  const pincode  = searchParams.get('pincode') || '';

  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/pg/search?city=${city}&pincode=${pincode}`);
        console.log(res.data.data)
        setResults(res.data.data);
      } catch (err) {
        toast.error('Failed to fetch results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [city, pincode]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Search Results
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {city && `City: ${city}`} {pincode && `• Pincode: ${pincode}`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No PGs found for your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((pg) => (
              <PGCard key={pg.pg_id} pg={pg} />
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default SearchResults;