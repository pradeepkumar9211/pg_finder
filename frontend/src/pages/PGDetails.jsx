import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const PGDetails = () => {
  const { pg_id }     = useParams();
  const { user }      = useAuth();

  const [pg, setPG]             = useState(null);
  const [faqs, setFaqs]         = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [booking, setBooking]   = useState(false);

  const [question, setQuestion] = useState('');
  const [comment, setComment]   = useState('');
  const [rating, setRating]     = useState(5);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pgRes, faqRes, feedRes] = await Promise.all([
          API.get(`/pg/${pg_id}`),
          API.get(`/faqs/pg/${pg_id}`),
          API.get(`/feedback/pg/${pg_id}`),
        ]);
        setPG(pgRes.data.data);
        setFaqs(faqRes.data.data);
        setFeedback(feedRes.data.data);
      } catch (err) {
        toast.error('Failed to load PG details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [pg_id]);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book this PG.');
      return;
    }
    try {
      setBooking(true);
      await API.post('/bookings', { pg_id });
      toast.success('Booking request sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    } finally {
      setBooking(false);
    }
  };

  const handleQuestion = async (e) => {
    e.preventDefault();
    if (!question) return;
    try {
      await API.post('/faqs', { pg_id, question });
      toast.success('Question submitted!');
      setQuestion('');
      const res = await API.get(`/faqs/pg/${pg_id}`);
      setFaqs(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit question.');
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    if (!comment) return;
    try {
      await API.post('/feedback', { pg_id, comment, rating });
      toast.success('Feedback submitted!');
      setComment('');
      setRating(5);
      const res = await API.get(`/feedback/pg/${pg_id}`);
      setFeedback(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20 text-gray-400">Loading...</div>
      </Layout>
    );
  }

  if (!pg) {
    return (
      <Layout>
        <div className="text-center py-20 text-gray-400">PG not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Images */}
        {pg.images && pg.images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto mb-8">
            {pg.images.map((img) => (
              <img
                key={img.image_id}
                src={`http://localhost:5000/${img.image_url}`}
                alt={pg.pg_name}
                className="h-56 w-80 object-cover rounded-xl flex-shrink-0"
              />
            ))}
          </div>
        )}

        {/* PG Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{pg.pg_name}</h1>
              <p className="text-gray-500 text-sm">{pg.address}, {pg.city} — {pg.pincode}</p>
            </div>
            <span className="text-blue-600 font-bold text-xl">₹{pg.rent}/mo</span>
          </div>

          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <span>Room type: <span className="capitalize font-medium">{pg.room_type}</span></span>
            <span>Owner: <span className="font-medium">{pg.owner_name}</span></span>
            <span>Contact: <span className="font-medium">{pg.owner_phone}</span></span>
          </div>

          <div className="mt-4">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${pg.availability_status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {pg.availability_status ? 'Available' : 'Not Available'}
            </span>
          </div>

          {/* Book Now button — only for tenants */}
          {user?.role === 'tenant' && pg.availability_status === 1 && (
            <button
              onClick={handleBooking}
              disabled={booking}
              className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {booking ? 'Sending request...' : 'Book Now'}
            </button>
          )}
        </div>

        {/* FAQs section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">FAQs</h2>

          {faqs.length === 0 ? (
            <p className="text-gray-400 text-sm">No questions yet.</p>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.ques_id} className="border-b border-gray-50 pb-4">
                  <p className="text-sm font-medium text-gray-800">Q: {faq.question}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {faq.answer ? `A: ${faq.answer}` : 'No answer yet.'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Asked by {faq.tenant_name}</p>
                </div>
              ))}
            </div>
          )}

          {/* Ask a question — tenants only */}
          {user?.role === 'tenant' && (
            <form onSubmit={handleQuestion} className="mt-5 flex gap-2">
              <input
                type="text"
                placeholder="Ask a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Ask
              </button>
            </form>
          )}
        </div>

        {/* Feedback section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reviews</h2>

          {feedback.length === 0 ? (
            <p className="text-gray-400 text-sm">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {feedback.map((fb) => (
                <div key={fb.feed_id} className="border-b border-gray-50 pb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">{fb.tenant_name}</p>
                    <span className="text-yellow-500 text-sm">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{fb.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Submit feedback — tenants only */}
          {user?.role === 'tenant' && (
            <form onSubmit={handleFeedback} className="mt-5 space-y-3">
              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default PGDetails;