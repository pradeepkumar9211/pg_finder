import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';

const ManageFAQs = () => {
    const [listings, setListings] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const listRes = await API.get('/pg/owner/my-listings');
                const allListings = listRes.data.data;
                setListings(allListings);

                const faqPromises = allListings.map((pg) =>
                    API.get(`/faqs/pg/${pg.pg_id}`)
                );
                const faqResults = await Promise.all(faqPromises);
                const allFaqs = faqResults.flatMap((res) => res.data.data);
                setFaqs(allFaqs);
            } catch (err) {
                toast.error('Failed to load FAQs.');
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const handleAnswer = async (ques_id) => {
        const answer = answers[ques_id];
        if (!answer) {
            toast.error('Answer cannot be empty.');
            return;
        }
        try {
            await API.put(`/faqs/${ques_id}/answer`, { answer });
            toast.success('Answer submitted!');
            setFaqs((prev) =>
                prev.map((f) =>
                    f.ques_id === ques_id ? { ...f, answer } : f
                )
            );
            setAnswers((prev) => ({ ...prev, [ques_id]: '' }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit answer.');
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-10">

                <h2 className="text-xl font-bold text-gray-800 mb-6">Manage FAQs</h2>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : faqs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        No questions asked yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div
                                key={faq.ques_id}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
                            >
                                <p className="text-sm font-medium text-gray-800">
                                    Q: {faq.question}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 mb-3">
                                    Asked by {faq.tenant_name}
                                </p>

                                {faq.answer ? (
                                    <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                                        A: {faq.answer}
                                    </p>
                                ) : (
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            placeholder="Type your answer..."
                                            value={answers[faq.ques_id] || ''}
                                            onChange={(e) =>
                                                setAnswers((prev) => ({
                                                    ...prev,
                                                    [faq.ques_id]: e.target.value,
                                                }))
                                            }
                                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={() => handleAnswer(faq.ques_id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                                        >
                                            Answer
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default ManageFAQs;