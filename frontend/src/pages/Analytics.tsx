import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/formatINR';

interface AnalyticsData {
  totalRevenue: number;
  targetRevenue: number;
  funnel: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    purchased: number;
  };
  chartData: { date: string; revenue: number }[];
}

interface AIRecommendation {
  recommendation: string;
  confidence: number;
  reasoning: string[];
}

const Analytics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await axios.get<AnalyticsData>('/api/analytics');
      return res.data;
    },
    refetchInterval: 30000,
  });

  const { data: aiRec, isLoading: isRecLoading } = useQuery({
    queryKey: ['analytics_rec'],
    queryFn: async () => {
      const res = await axios.get<AIRecommendation>('/api/analytics/recommendations');
      return res.data;
    },
    staleTime: 600000, // 10 minutes
  });

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-pulse text-slate-400 font-medium">Loading analytics...</div>
      </div>
    );
  }

  const funnelData = [
    { name: 'Sent', value: data.funnel.sent },
    { name: 'Delivered', value: data.funnel.delivered },
    { name: 'Opened', value: data.funnel.opened },
    { name: 'Clicked', value: data.funnel.clicked },
    { name: 'Converted', value: data.funnel.purchased },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fadeIn">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Analytics & ROI</h1>
        <p className="text-slate-600 mt-2">Measure the impact of your Catalyst-AI growth missions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-border-default rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 font-medium mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" /> Total Revenue Generated
          </div>
          <div className="text-3xl font-bold text-slate-900">{formatINR(data.totalRevenue)}</div>
          <div className="text-sm text-slate-400 mt-1">vs target {formatINR(data.targetRevenue)}</div>
        </div>
        
        <div className="bg-white border border-border-default rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 font-medium mb-2">
            <Target className="w-5 h-5 text-blue-500" /> Overall Conversion Rate
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {data.funnel.sent > 0 ? ((data.funnel.purchased / data.funnel.sent) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-sm text-slate-400 mt-1">From total sent messages</div>
        </div>

        <div className="bg-white border border-border-default rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 font-medium mb-2">
            <Activity className="w-5 h-5 text-purple-500" /> Messages Sent
          </div>
          <div className="text-3xl font-bold text-slate-900">{data.funnel.sent.toLocaleString()}</div>
          <div className="text-sm text-slate-400 mt-1">Across all active missions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-border-default rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value: any) => formatINR(value as number)} labelStyle={{ color: '#374151' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-border-default rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Mission Funnel</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={13} fontWeight="500" tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: any) => (value as number).toLocaleString()} cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* EXPLAINABLE AI SECTION */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6 shadow-sm animate-fadeIn">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-blue" />
          Explainable AI Insights
        </h3>
        {isRecLoading ? (
           <div className="animate-pulse space-y-2">
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              <div className="h-4 bg-blue-200 rounded w-1/2"></div>
           </div>
        ) : aiRec ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="text-blue-900 font-semibold mb-2">Recommendation:</div>
              <p className="text-blue-800 bg-white px-4 py-3 rounded border border-blue-200 shadow-sm">{aiRec.recommendation}</p>
              
              <div className="mt-4">
                <div className="text-sm font-semibold text-blue-900 mb-2">Confidence Score</div>
                <div className="flex items-center gap-3">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-primary-blue h-2 rounded-full" style={{ width: `${aiRec.confidence}%` }}></div>
                  </div>
                  <span className="font-bold text-primary-blue">{aiRec.confidence}%</span>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="text-blue-900 font-semibold mb-2">Reasoning Checklist:</div>
              <ul className="space-y-2">
                {aiRec.reasoning.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                    <CheckCircle2 className="w-4 h-4 text-primary-blue flex-shrink-0 mt-0.5" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

    </div>
  );
};

export default Analytics;
