/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Plus, Tag, Users,
  Trash2, X, AlertCircle, RefreshCw, Search
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

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');

  const [discoveredSegment, setDiscoveredSegment] = useState<{
    filters: any;
    estimated_count: number;
    reasoning: string;
  } | null>(null);

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
      setSaveName(`${nlQuery.slice(0, 30)}${nlQuery.length > 30 ? '...' : ''}`);
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
    <div className="max-w-7xl mx-auto pb-12 pt-2 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center shadow-soft">
            <Tag size={18} className="text-brand-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight">Segment Discovery</h1>
        </div>
        <p className="text-text-secondary ml-12">Build customer cohorts using natural language — no SQL needed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* AI Segment Builder */}
          <div className="bg-white border-2 border-brand-100 rounded-2xl p-6 shadow-soft relative overflow-hidden">
            {/* Subtle blue accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-t-2xl" />

            <div className="flex items-center gap-3 mb-5 mt-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-blue flex-shrink-0">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-text-primary text-sm">AI-Powered Segment Discovery</h3>
                <p className="text-xs text-text-secondary">Describe your audience in plain English</p>
              </div>
            </div>

            <form onSubmit={handleDiscover} className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  placeholder="e.g., 'Customers with over 5 orders who spent more than ₹10,000'"
                  className="w-full bg-surface-secondary border-2 border-brand-100 rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-white transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={discoverMutation.isPending}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-2 transition-all shadow-blue hover:shadow-glow disabled:opacity-50 flex-shrink-0"
              >
                {discoverMutation.isPending
                  ? <><RefreshCw size={16} className="animate-spin" /> Analyzing...</>
                  : <><Plus size={18} /> Discover</>
                }
              </button>
            </form>

            {/* Discovery Result */}
            {discoveredSegment && (
              <div className="mt-5 p-5 rounded-xl border-2 border-brand-200 bg-brand-50 flex flex-col gap-4 animate-fadeIn">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-brand-600" />
                      <h4 className="text-sm font-bold text-brand-900 uppercase tracking-wide">AI Segment Found</h4>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{discoveredSegment.reasoning}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-text-muted font-bold uppercase block mb-1">Estimated Match</span>
                    <div className="text-2xl font-display font-bold text-brand-700 font-mono">
                      {discoveredSegment.estimated_count.toLocaleString()}
                      <span className="text-sm text-text-secondary font-normal ml-1">users</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-brand-100 p-4 shadow-soft">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Generated Query Logic</span>
                  <pre className="text-xs text-text-secondary font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(discoveredSegment.filters, null, 2)}
                  </pre>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDiscoveredSegment(null)}
                    className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={() => setIsSaveModalOpen(true)}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all flex items-center gap-2 shadow-blue hover:shadow-glow"
                  >
                    <Plus size={16} /> Save Segment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Segments */}
          <div className="bg-white border-2 border-brand-100 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <Users size={18} className="text-brand-500" />
                <h3 className="font-display font-bold text-text-primary text-sm">Active Target Cohorts</h3>
              </div>
              {segmentsData && (
                <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
                  {segmentsData.segments.length} segments
                </span>
              )}
            </div>

            {isListLoading ? (
              <div className="flex justify-center p-10">
                <RefreshCw className="w-6 h-6 text-brand-500 animate-spin" />
              </div>
            ) : !segmentsData || segmentsData.segments.length === 0 ? (
              <div className="text-center py-14 text-sm text-text-muted font-medium">
                <Tag size={28} className="mx-auto mb-3 text-brand-200" />
                No segments yet. Create one above to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segmentsData.segments.map((seg) => (
                  <div
                    key={seg.id}
                    className={`p-5 rounded-xl border-2 cursor-pointer flex flex-col justify-between gap-3 transition-all duration-200 hover:-translate-y-0.5 ${
                      selectedSegmentId === seg.id
                        ? 'border-brand-500 bg-brand-50 shadow-card'
                        : 'border-brand-100 bg-white hover:border-brand-300 hover:shadow-soft'
                    }`}
                    onClick={() => setSelectedSegmentId(seg.id)}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="font-display font-bold text-text-primary text-sm leading-tight">
                        {seg.name.replace(/^AI Segment:\s*/i, '')}
                      </h4>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 flex-shrink-0">
                        {seg.customer_count.toLocaleString()} users
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 mt-1 border-t border-brand-50 text-xs text-text-muted">
                      <span>Created {new Date(seg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmToast(`Delete segment "${seg.name}"?`, () => {
                            deleteSegmentMutation.mutate(seg.id);
                          });
                        }}
                        className="p-1.5 text-text-muted hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete segment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-4 bg-white border-2 border-brand-100 rounded-2xl p-6 shadow-soft h-[700px] sticky top-24 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-4 border-b-2 border-brand-50">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-brand-500" />
              <h3 className="font-display font-bold text-text-primary text-sm">Cohort Preview</h3>
            </div>
            {selectedSegmentId && (
              <button
                onClick={() => setSelectedSegmentId(null)}
                className="p-1.5 bg-surface-secondary border border-border-default rounded-lg text-text-secondary hover:text-text-primary hover:border-brand-200 transition-all"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {!selectedSegmentId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center mb-4">
                <Users size={24} className="text-brand-300" />
              </div>
              <p className="text-sm font-semibold text-text-primary mb-1">No Segment Selected</p>
              <p className="text-xs text-text-secondary leading-relaxed max-w-[180px]">
                Click a cohort card on the left to preview its members.
              </p>
            </div>
          ) : isCustLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-brand-500" />
            </div>
          ) : !segmentCustomers || segmentCustomers.customers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <AlertCircle size={28} className="mb-3 text-red-400" />
              <p className="text-sm font-medium text-text-secondary">No customers match this segment.</p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col gap-2.5 overflow-y-auto hide-scrollbar">
              <div className="text-xs text-text-muted font-bold uppercase tracking-wider pb-1">
                Profiles ({segmentCustomers.customers.length})
              </div>
              {segmentCustomers.customers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-3.5 rounded-xl border-2 border-brand-50 bg-surface-secondary hover:border-brand-200 hover:shadow-soft transition-all"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-bold text-text-primary truncate">{customer.name}</span>
                    <span className="text-xs font-bold text-brand-700 font-mono flex-shrink-0 ml-2">
                      ₹{customer.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-text-secondary">
                    <span>{customer.city || 'N/A'}</span>
                    <span className="bg-white border border-brand-100 px-2 py-0.5 rounded-md font-medium">{customer.orderCount} orders</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Segment Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-brand-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 flex flex-col gap-5 relative shadow-premium border-2 border-brand-100 animate-fadeIn">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-t-3xl" />
            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-text-secondary hover:bg-surface-secondary hover:text-text-primary rounded-xl transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-display font-bold text-text-primary flex items-center gap-2.5 mt-1">
              <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center">
                <Tag size={16} className="text-brand-600" />
              </div>
              Save Discovered Cohort
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-text-primary text-sm">Segment Name</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="bg-surface-secondary border-2 border-brand-100 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-text-primary text-sm">Description</label>
                <textarea
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  rows={3}
                  className="bg-surface-secondary border-2 border-brand-100 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t-2 border-brand-50">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface-secondary rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSegment}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-blue hover:shadow-glow"
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
