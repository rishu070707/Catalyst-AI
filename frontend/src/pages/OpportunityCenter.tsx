import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RefreshCw, Users, TrendingUp, AlertCircle, ArrowRight, CheckCircle2, Sparkles, LayoutDashboard } from 'lucide-react';
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
      const response = await axios.get<Opportunity[]>(`/api/opportunities${isRefreshing ? '?force=true' : ''}`);
      return response.data;
    },
    staleTime: 0,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
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

  const filteredOpportunities = Array.isArray(opportunities) ? opportunities.filter(o => o.audience > 0) : [];

  return (
    <div className="max-w-6xl mx-auto pb-12 pt-2 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center shadow-soft">
              <LayoutDashboard size={18} className="text-brand-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight">Opportunity Center</h1>
          </div>
          <p className="text-text-secondary ml-12">AI-identified growth segments based on your live CRM data.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-white border-2 border-brand-100 hover:bg-brand-50 hover:border-brand-300 text-text-primary px-5 py-2.5 rounded-xl font-semibold transition-all shadow-soft hover:shadow-card self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-600' : 'text-text-secondary'}`} />
          Refresh Insights
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border-2 border-brand-100 rounded-2xl p-7 h-72 animate-pulse shadow-soft">
              <div className="w-2/3 h-5 bg-brand-50 rounded-lg mb-4" />
              <div className="w-1/2 h-7 bg-brand-50 rounded-lg mb-6" />
              <div className="space-y-2.5">
                <div className="w-full h-3.5 bg-brand-50 rounded" />
                <div className="w-5/6 h-3.5 bg-brand-50 rounded" />
                <div className="w-4/6 h-3.5 bg-brand-50 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-brand-100 rounded-2xl shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} className="text-brand-300" />
          </div>
          <p className="text-text-secondary font-medium">No opportunities found. Click Refresh Insights to scan your CRM.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp, idx) => (
            <div
              key={`${opp.id}-${idx}`}
              className="bg-white border-2 border-brand-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col animate-fadeIn"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              {/* Card top accent + confidence */}
              <div className="h-1.5 bg-gradient-to-r from-brand-500 to-brand-700" />

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="font-display font-bold text-text-primary text-base leading-tight pr-3">{opp.title}</h3>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex-shrink-0 ${
                    opp.confidence >= 0.85
                      ? 'bg-green-50 text-green-700 border-green-100'
                      : opp.confidence >= 0.65
                      ? 'bg-brand-50 text-brand-700 border-brand-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {Math.round(opp.confidence <= 1 ? opp.confidence * 100 : opp.confidence)}% Match
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-surface-secondary rounded-xl p-3.5 border-2 border-brand-50">
                    <div className="flex items-center gap-1.5 text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
                      <Users className="w-3.5 h-3.5" /> Audience
                    </div>
                    <div className="font-display font-bold text-text-primary text-xl">{opp.audience.toLocaleString()}</div>
                  </div>
                  <div className="bg-brand-50 rounded-xl p-3.5 border-2 border-brand-100">
                    <div className="flex items-center gap-1.5 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-2">
                      <TrendingUp className="w-3.5 h-3.5" /> Revenue
                    </div>
                    <div className="font-display font-bold text-brand-700 text-xl">{formatINR(opp.potentialRevenue)}</div>
                  </div>
                </div>

                {/* Why this works */}
                <div className="mb-6 flex-1">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Why this works
                  </h4>
                  <ul className="space-y-2">
                    {opp.reasoning.map((reason, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleLaunch(opp)}
                  className="w-full mt-auto flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold transition-all shadow-blue hover:shadow-glow"
                >
                  Launch Mission <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpportunityCenter;
