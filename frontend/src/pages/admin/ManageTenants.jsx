import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Layout from '../../components/Layout';

const ManageTenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const res = await API.get('/admin/tenants');
                setTenants(res.data.data);
            } catch (err) {
                toast.error('Failed to load tenants.');
            } finally {
                setLoading(false);
            }
        };

        fetchTenants();
    }, []);

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-6 py-10">

                <h2 className="text-xl font-bold text-gray-800 mb-6">All Tenants</h2>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : tenants.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No tenants found.</div>
                ) : (
                    <div className="space-y-3">
                        {tenants.map((tenant) => (
                            <div
                                key={tenant.tenant_id}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-800">{tenant.tenant_name}</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {tenant.email} • {tenant.phone_no}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Joined: {new Date(tenant.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                                    Tenant
                                </span>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default ManageTenants;