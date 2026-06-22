import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, MapPin, Mail, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../utils/formatINR';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  type: string;
  totalSpent: number;
  orderCount: number;
  lastPurchaseDate: string;
  churnRisk: string;
  engagementScore: number;
}

interface CustomersResponse {
  customers: Customer[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const Customers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['customers', search, page],
    queryFn: async () => {
      const response = await axios.get<CustomersResponse>('/api/customers', {
        params: { search: search || undefined, page, limit: 10 }
      });
      return response.data;
    },
    staleTime: 60000,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  const _toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col items-center justify-center mb-8 gap-4 relative text-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Customer Intelligence</h1>
          <p className="text-slate-600 mt-2">Unified view of your retail customer base.</p>
        </div>
        <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 relative w-full md:w-auto mt-4 md:mt-0">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="AI Segment Query (e.g. 'VIP Delhi')"
            value={search}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-border-default rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
          />
        </div>
      </div>

      <div className="bg-white border border-border-default rounded-lg shadow-sm overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-surface-secondary text-xs uppercase text-slate-500 font-semibold border-b border-border-default">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Location & Contact</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Segment & Risk</th>
                <th className="px-6 py-4 text-right">Story</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading customers...</td>
                </tr>
              ) : (Array.isArray(data) ? data.length === 0 : data?.customers?.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No customers match that segment.</td>
                </tr>
              ) : (
                (Array.isArray(data) ? data : (data?.customers || [])).map((customer) => (
                  <React.Fragment key={customer.id}>
                    <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/app/customers/${customer.id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{customer.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">ID: {customer.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {customer.city}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Mail className="w-3 h-3" /> {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-green-600">{formatINR(customer.totalSpent)}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{customer.orderCount} Orders</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-100 inline-block mb-1">
                          {customer.type}
                        </span>
                        <div className={`text-xs font-medium mt-1 ${customer.churnRisk === 'HIGH' ? 'text-red-500' : customer.churnRisk === 'MEDIUM' ? 'text-yellow-600' : 'text-green-500'}`}>
                          {customer.churnRisk} Churn Risk
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary-blue hover:text-blue-700 p-2">
                          {expandedId === customer.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === customer.id && (
                      <tr>
                        <td colSpan={5} className="bg-blue-50/30 p-0 border-t-0">
                          <CustomerStory customerId={customer.id} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-default bg-slate-50">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium">{(data.currentPage - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(data.currentPage * 10, data.totalCount)}</span> of <span className="font-medium">{data.totalCount}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={data.currentPage === 1}
                className="px-3 py-1.5 border border-border-default rounded text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="text-sm font-medium text-slate-700 px-2">
                Page {data.currentPage} of {data.totalPages}
              </div>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={data.currentPage === data.totalPages}
                className="px-3 py-1.5 border border-border-default rounded text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomerStory = ({ customerId }: { customerId: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['customerStory', customerId],
    queryFn: async () => {
      const response = await axios.get<{ story: string }>(`/api/customers/${customerId}/story`);
      return response.data.story;
    },
    staleTime: Infinity,
  });

  return (
    <div className="p-6 text-sm text-slate-700">
      <div className="flex items-start gap-3">
        <div className="mt-0.5"><Sparkles className="w-5 h-5 text-blue-500" /></div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 mb-2">AI Customer Narrative</h4>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ) : error ? (
            <p className="text-red-500">Failed to generate narrative.</p>
          ) : (
            <p className="leading-relaxed">{data}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
