/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Plus, Tag, Users, 
  Trash2, X, AlertCircle, RefreshCw 
} from 'lucide-react';
import { confirmToast } from '../utils/toastConfirm';

interface Segment {
  id: string;
  name: string;
  description?: string;
  segment_type: string;
  nl_query?: string;
  filters?: string;
  customer_count: number;
  created_at: string;
}

interface Customer {
  id: string;
  name: string;
  city: string;
  totalSpent: number;
  orderCount: number;
}

export default function Segments() {
  const _navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nlQuery, setNlQuery] = useState('');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  
  // Save segment modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');

  // Discovered segment details from AI
  const [discoveredSegment, setDiscoveredSegment] = useState<{
    filters: any;
    estimated_count: number;
    reasoning: string;
  } | null>(null);

  // Queries
  const { data: segmentsData, isLoading: isListLoading } = useQuery<{
    segments: Segment[];
    total: number;
  }>({
    queryKey: ['segments'],
    queryFn: async () => {
      const res = await axios.get('/api/segments');
      return res.data;
    },
  });

  const { data: segmentCustomers, isLoading: isCustLoading } = useQuery<{
    customers: Customer[];
    total: number;
  }>({
    queryKey: ['segment-customers', selectedSegmentId],
    queryFn: async () => {
      const res = await axios.get(`/api/segments/${selectedSegmentId}/customers`);
      return res.data;
    },
    enabled: !!selectedSegmentId,
  });

  // Mutations
  const discoverMutation = useMutation<
    { filters: any; estimated_count: number; reasoning: string },
    Error,
    string
  >({
    mutationFn: async (nl_query: string) => {
      const res = await axios.post('/api/segments/discover', { nl_query });
      return res.data;
    },
    onSuccess: (data) => {
      setDiscoveredSegment(data);
      setSaveName(`AI Segment: ${nlQuery.slice(0, 20)}...`);
      setSaveDescription(nlQuery);
    },
  });

  const createSegmentMutation = useMutation<Segment, Error, any>({
    mutationFn: async (newSegment) => {
      const res = await axios.post('/api/segments', newSegment);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      setIsSaveModalOpen(false);
      setDiscoveredSegment(null);
      setNlQuery('');
    },
  });

  const deleteSegmentMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/segments/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      if (selectedSegmentId) setSelectedSegmentId(null);
    },
  });

  const handleDiscover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;
    discoverMutation.mutate(nlQuery);
  };

  const handleSaveSegment = () => {
    if (!saveName.trim() || !discoveredSegment) return;
    createSegmentMutation.mutate({
      name: saveName,
      description: saveDescription,
      segment_type: 'nl_query',
      nl_query: nlQuery,
      filters: discoveredSegment.filters,
      customer_count: discoveredSegment.estimated_count,
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fadeIn pt-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Segment Discovery Engine</h1>
        <p className="text-gray-500 mt-2">
          Define customer cohorts using natural language AI segmentation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Columns: Discovery Panel & Segment List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* NL Segment Builder */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-blue-600" />
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">AI-Powered NL Segment Discovery</h3>
            </div>
            
            <form onSubmit={handleDiscover} className="flex gap-2">
              <input
                type="text"
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                placeholder="Find customer segments, e.g., 'Customers with over 5 orders who spent more than ₹10,000'..."
                className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={discoverMutation.isPending}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {discoverMutation.isPending ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={16} />}
                {discoverMutation.isPending ? 'Analyzing...' : 'Discover Cohort'}
              </button>
            </form>

            {/* Suggested prompts chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                "VIP customers with churn risk score above 50%",
                "Loyalty members who haven't ordered in 90 days",
                "Customers in Mumbai with high LTV",
                "New customers with 3+ orders",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setNlQuery(chip)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Discovery Results Panel */}
            {discoveredSegment && (
              <div className="mt-6 p-5 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col gap-4 animate-fadeIn">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Segment Suggestion Summary</h4>
                    <p className="text-sm text-gray-600 mt-1">{discoveredSegment.reasoning}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 font-bold uppercase block">Estimated Match</span>
                    <div className="text-xl font-bold text-green-600 font-mono mt-0.5">
                      {discoveredSegment.estimated_count} <span className="text-sm text-gray-500 font-normal">users</span>
                    </div>
                  </div>
                </div>

                {/* Filters preview */}
                <div className="flex flex-col gap-2 bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Generated Query Logic</span>
                  <pre className="text-xs text-gray-700 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(discoveredSegment.filters, null, 2)}
                  </pre>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={() => setDiscoveredSegment(null)}
                    className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={() => setIsSaveModalOpen(true)}
                    className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Plus size={16} /> Save Segment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Segment Lists */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-2 mb-4">
              <Users size={16} className="text-gray-400" />
              Active Target Cohorts
            </h3>

            {isListLoading ? (
              <div className="flex justify-center p-8"><RefreshCw className="w-6 h-6 text-blue-500 animate-spin" /></div>
            ) : !segmentsData || segmentsData.segments.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-400 font-medium">No segments defined. Create one above to get started.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segmentsData.segments.map((seg) => (
                  <div
                    key={seg.id}
                    className={`p-5 rounded-xl border cursor-pointer flex flex-col justify-between gap-3 transition-all shadow-sm hover:shadow-md ${
                      selectedSegmentId === seg.id 
                        ? 'border-blue-300 bg-blue-50/30 ring-1 ring-blue-100' 
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setSelectedSegmentId(seg.id)}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-sm truncate pr-4">{seg.name}</h4>
                        <span className="px-2 py-1 rounded text-xs font-bold font-mono bg-green-50 text-green-700 border border-green-100">
                          {seg.customer_count} Profile{seg.customer_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {seg.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100 text-xs text-gray-400 font-medium">
                      <span>Created {new Date(seg.created_at).toLocaleDateString()}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmToast(`Delete segment "${seg.name}"?`, () => {
                             deleteSegmentMutation.mutate(seg.id);
                          });
                        }}
                        className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                        title="Delete segment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Segment Audience Preview */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-[700px] sticky top-6 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Cohort Preview</h3>
            {selectedSegmentId && (
              <button
                onClick={() => setSelectedSegmentId(null)}
                className="p-1.5 bg-gray-50 rounded text-gray-400 hover:text-gray-900"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {!selectedSegmentId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <Users size={32} className="mb-3 text-gray-300" />
              <p className="text-sm font-semibold text-gray-900">No Segment Selected</p>
              <p className="text-xs mt-2 leading-relaxed max-w-[200px]">
                Click a target cohort card to load active member profiles.
              </p>
            </div>
          ) : isCustLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-blue-600" />
            </div>
          ) : !segmentCustomers || segmentCustomers.customers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <AlertCircle size={28} className="mb-3 text-red-400" />
              <p className="text-sm font-medium">No active customers match this segment criteria.</p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col gap-3 overflow-y-auto pr-1">
              <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase pb-2">
                <span>Profiles ({segmentCustomers.customers.length})</span>
              </div>
              {segmentCustomers.customers.map((customer) => {
                const ltv = customer.totalSpent;
                const orderCount = customer.orderCount;
                return (
                  <div
                    key={customer.id}
                    className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col gap-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-900 truncate">{customer.name}</span>
                      <span className="text-xs font-bold text-green-600 font-mono">
                        ₹{ltv.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                      <span>{customer.city || 'Standard'}</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-gray-200">{orderCount} Orders</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Save Segment Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-7 flex flex-col gap-5 relative shadow-xl animate-fadeIn">
            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Tag size={20} className="text-blue-600" />
              Save Discovered Cohort
            </h3>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-600 text-sm">Segment Name</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-600 text-sm">Description</label>
                <textarea
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  rows={3}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-5 border-t border-gray-100">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSegment}
                className="px-6 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
              >
                Save & Deploy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
