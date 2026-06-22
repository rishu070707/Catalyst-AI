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
      // Pass force=true if we're actively refreshing
      const response = await axios.get<Opportunity[]>(`/api/opportunities${isRefreshing ? '?force=true' : ''}`);
      return response.data;
    },
    staleTime: 0,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Force a re-render so isRefreshing is true when refetch calls queryFn
    setTimeout(async () => {
      await refetch();
      setIsRefreshing(false);
    }, 0);
  };

  const handleLaunch = (opp: Opportunity) => {
    navigate('/app/planner', { 
      state: { 
        prompt: `Create a mission for: ${opp.title}. Target audience size is ${opp.audience}. Expected revenue is ${opp.potentialRevenue}.` 
      } 
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fadeIn">
      <div className="flex flex-col items-center justify-center mb-10 gap-4 relative text-center animate-fadeIn">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Opportunity Center</h1>
          <p className="text-text-secondary mt-2">AI-identified growth segments based on your live CRM data.</p>
        </div>
        <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 mt-4 md:mt-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-white border border-border-default hover:bg-surface-secondary text-text-primary px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-soft"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary-blue' : ''}`} />
            Refresh Insights
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-border-default rounded-2xl p-6 h-64 animate-pulse shadow-soft">
              <div className="w-2/3 h-6 bg-surface-secondary rounded mb-4"></div>
              <div className="w-1/2 h-8 bg-surface-secondary rounded mb-6"></div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-surface-secondary rounded"></div>
                <div className="w-5/6 h-4 bg-surface-secondary rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (Array.isArray(opportunities) ? opportunities.filter(o => o.audience > 0) : []).length === 0 ? (
        <div className="text-center py-16 bg-white border border-border-default rounded-2xl shadow-soft">
          <p className="text-text-secondary font-medium">No opportunities found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(opportunities) ? opportunities.filter(o => o.audience > 0) : []).map((opp, idx) => (
            <div key={`${opp.id}-${idx}`} className="bg-white border border-border-default rounded-2xl p-6 shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all flex flex-col animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex justify-between items-start mb-5">
                <h3 className="font-display font-bold text-text-primary text-lg leading-tight">{opp.title}</h3>
                <div className="bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold border border-green-100 whitespace-nowrap shadow-sm">
                  {Math.round(opp.confidence <= 1 ? opp.confidence * 100 : opp.confidence)}% Match
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-secondary rounded-xl p-3 border border-border-default">
                  <div className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Audience</div>
                  <div className="font-bold text-text-primary text-lg">{opp.audience.toLocaleString()}</div>
                </div>
                <div className="bg-primary-blue/5 rounded-xl p-3 border border-primary-blue/20">
                  <div className="text-primary-indigo text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Est. Revenue</div>
                  <div className="font-bold text-primary-indigo text-lg">{formatINR(opp.potentialRevenue)}</div>
                </div>
              </div>

              <div className="mb-6 flex-1">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Why this works
                </h4>
                <ul className="space-y-2">
                  {opp.reasoning.map((reason, i) => (
                    <li key={i} className="text-sm text-text-primary flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary-violet flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleLaunch(opp)}
                className="w-full mt-auto flex items-center justify-center gap-2 bg-primary-blue hover:bg-primary-indigo text-white py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-glow"
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
