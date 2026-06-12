import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Users, TrendingUp, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { formatINR } from '../utils/formatINR';

interface Opportunity {
  id: string;
  title: string;
  audience: number;
  potentialRevenue: number;
  confidence: number;
  reasoning: string[];
  action: string;
}

const OpportunityCenter = () => {
  const navigate = useNavigate();


  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeAgo, setTimeAgo] = useState<string>('just now');
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);

  const { data: opportunities, isLoading, error, refetch } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const response = await axios.get<Opportunity[]>('/api/opportunities');
      setLastUpdated(new Date());
      setRefreshVersion(v => v + 1); // bump version → triggers fade-in animation
      return response.data;
    },
    staleTime: 0,
    refetchInterval: 60000,
  });

  // Update "X seconds ago" label every 10 seconds
  useEffect(() => {
    const tick = () => setTimeAgo(formatDistanceToNow(lastUpdated, { addSuffix: true }));
    tick();
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch(); // awaiting refetch() keeps spinner alive for the full round-trip
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const handleCreateMission = (opp: Opportunity) => {
    navigate('/planner', { state: { opportunity: opp } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-primary-blue animate-pulse font-medium">Analyzing growth opportunities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Failed to load opportunities. Ensure the CRM Backend is running.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header row */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Opportunity Center</h1>
          <button
            onClick={handleRefresh}
            disabled={isManualRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-border-default rounded-md hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isManualRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <p className="text-gray-600 mt-2">Here are the best actions you can take right now to grow revenue.</p>
        <p className="text-xs text-gray-400 mt-1">Last updated {timeAgo}</p>
      </div>

      <div key={refreshVersion} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
        {opportunities?.map((opp) => (
          <div key={opp.id} className="bg-surface-bg border border-border-default rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 border-b border-border-default">
              <h3 className="text-lg font-semibold text-text-primary mb-4">{opp.title}</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-secondary p-3 rounded-lg">
                  <div className="text-xs text-gray-500 font-medium mb-1 uppercase">Audience</div>
                  <div className="text-xl font-bold text-text-primary flex items-center">
                    <Users className="w-4 h-4 mr-1.5 text-primary-blue" />
                    {opp.audience.toLocaleString()}
                  </div>
                </div>
                <div className="bg-surface-secondary p-3 rounded-lg">
                  <div className="text-xs text-gray-500 font-medium mb-1 uppercase">Est. Revenue</div>
                  <div className="text-xl font-bold text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1.5" />
                    {formatINR(opp.potentialRevenue)}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Success Probability</span>
                  <span className="font-bold text-primary-blue">{opp.confidence}%</span>
                </div>
                <div className="w-full bg-surface-secondary rounded-full h-2">
                  <div
                    className="bg-primary-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${opp.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col bg-gray-50/50">
              <div className="text-sm font-medium text-gray-700 mb-3">Why this opportunity?</div>
              <ul className="space-y-2 mb-6 flex-1">
                {opp.reasoning.map((reason, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-border-default">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recommended Action</div>
                <button
                  onClick={() => handleCreateMission(opp)}
                  className="w-full flex items-center justify-between bg-primary-blue hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <span>{opp.action}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunityCenter;
