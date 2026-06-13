import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RefreshCw, Users, TrendingUp, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../utils/formatINR';

interface Opportunity {
  id: string;
  title: string;
  audience: number;
  potentialRevenue: number;
  confidence: number;
  reasoning: string[];
}

const OpportunityCenter = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: opportunities, isLoading, refetch } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const response = await axios.get<Opportunity[]>('/api/opportunities');
      return response.data;
    },
    staleTime: 0,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleLaunch = (opp: Opportunity) => {
    // Navigate to Mission Planner, pre-filling the natural language input
    navigate('/planner', { 
      state: { 
        prompt: `Create a mission for: ${opp.title}. Target audience size is ${opp.audience}. Expected revenue is ${opp.potentialRevenue}.` 
      } 
    });
  };

  return (
    <div className="pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">Opportunity Center</h1>
          <p className="text-gray-500 text-sm mt-1">AI-identified growth segments based on your live CRM data.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-white border border-border-default hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm self-start sm:self-auto whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Insights
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-border-default rounded-xl p-5 h-56 animate-pulse">
              <div className="w-2/3 h-5 bg-gray-200 rounded mb-4"></div>
              <div className="w-1/2 h-7 bg-gray-200 rounded mb-5"></div>
              <div className="space-y-2">
                <div className="w-full h-3 bg-gray-200 rounded"></div>
                <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (Array.isArray(opportunities) ? opportunities.filter(o => o.audience > 0) : []).length === 0 ? (
        <div className="text-center py-12 bg-white border border-border-default rounded-xl">
          <p className="text-gray-500 font-medium">No opportunities found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {(Array.isArray(opportunities) ? opportunities.filter(o => o.audience > 0) : []).map((opp, idx) => (
            <div key={`${opp.id}-${idx}`} className="bg-white border border-border-default rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col animate-fadeIn">
              <div className="flex justify-between items-start mb-3 gap-2">
                <h3 className="font-bold text-gray-900 text-base leading-tight">{opp.title}</h3>
                <div className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-100 whitespace-nowrap shrink-0">
                  {Math.round(opp.confidence <= 1 ? opp.confidence * 100 : opp.confidence)}% Match
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-gray-500 text-xs font-medium mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Audience</div>
                  <div className="font-bold text-gray-900 text-sm">{opp.audience.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="text-green-800 text-xs font-medium mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Est. Revenue</div>
                  <div className="font-bold text-green-700 text-sm">{formatINR(opp.potentialRevenue)}</div>
                </div>
              </div>

              <div className="mb-4 flex-1">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Why this works
                </h4>
                <ul className="space-y-1.5">
                  {opp.reasoning.slice(0, 3).map((reason, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-blue flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleLaunch(opp)}
                className="w-full mt-auto flex items-center justify-center gap-2 bg-primary-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors text-sm"
              >
                Launch Mission <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpportunityCenter;
