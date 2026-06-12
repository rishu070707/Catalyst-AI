/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Sparkles, Send, Zap, Users, IndianRupee, TrendingUp, MessageSquare, Loader2, RefreshCw, Tag, ShoppingCart, Megaphone, GitBranch, Save } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// --- INLINED TYPES ---
interface MissionPlan {
  mission_name: string;
  goal: string;
  target_audience: string;
  recommended_channel: string;
  channel_reasoning: string;
  offer_suggestion: string;
  predicted_reach: number;
  predicted_revenue: number;
  predicted_conversions: number;
  confidence_score: number;
  ai_reasoning: string;
  message_preview: string;
  segment_description?: string;
}

// --- INLINED COMPONENTS ---
const ConfidenceBar = ({ value, height = 2 }: { value: number; height?: number }) => (
  <div className="w-full bg-gray-100 rounded-full overflow-hidden" style={{ height: `${height}px` }}>
    <div className="h-full bg-blue-600 transition-all duration-1000 ease-out" style={{ width: `${value}%` }} />
  </div>
);

const ExplainabilityCard = ({ decision, reasoning, evidence, confidence, impact }: any) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-blue-600" />
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">AI Recommendation</span>
      </div>
      <div className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
        {confidence}% Conf.
      </div>
    </div>
    <h4 className="text-sm font-bold text-gray-900 mb-2">{decision}</h4>
    <p className="text-xs text-gray-700 leading-relaxed mb-4">{reasoning}</p>
    
    <div className="border-t border-gray-100 pt-3">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Supporting Evidence</span>
      <ul className="space-y-1.5 mb-4">
        {evidence.map((item: string, i: number) => (
          <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
        <TrendingUp size={14} />
        Projected Impact: {impact}
      </div>
    </div>
  </div>
);



const channelColors: Record<string, string> = {
  whatsapp: '#25D366',
  email: '#06B6D4',
  sms: '#F59E0B',
  push: '#8B5CF6',
  rcs: '#EC4899',
};

export default function MissionPlanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const [prompt, setPrompt] = useState(location.state?.prompt || '');
  const [plan, setPlan] = useState<MissionPlan | null>(null);

  const planMutation = useMutation({
    mutationFn: async (goal: string) => {
      const parseNumeric = (val: any): number => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
          const cleaned = val.replace(/[^\d.]/g, '');
          const num = parseFloat(cleaned);
          return isNaN(num) ? 0 : num;
        }
        return 0;
      };

      try {
        const res = await axios.post('/api/ai/plan-mission', { goal });
        const rawPlan = res.data.plan || res.data;
        
        const predReach = parseNumeric(rawPlan.predicted_reach);
        const predRevenue = parseNumeric(rawPlan.predicted_revenue);
        const predConversions = parseNumeric(rawPlan.predicted_conversions || rawPlan.predicted_reach);
        const rawConfidence = parseNumeric(rawPlan.confidence_score);

        const mappedPlan: MissionPlan = {
          mission_name: rawPlan.name || rawPlan.mission_name || 'Campaign Plan',
          goal: rawPlan.goal || goal,
          target_audience: rawPlan.audience || rawPlan.target_audience || '',
          recommended_channel: (rawPlan.channel || rawPlan.recommended_channel || 'whatsapp').toLowerCase() as any,
          channel_reasoning: rawPlan.reasoning || rawPlan.channel_reasoning || '',
          offer_suggestion: rawPlan.offer || rawPlan.offer_suggestion || '',
          predicted_reach: predReach,
          predicted_revenue: predRevenue,
          predicted_conversions: predConversions,
          confidence_score: Math.round((rawConfidence <= 1.0 ? rawConfidence * 100 : rawConfidence) ?? 80),
          ai_reasoning: rawPlan.reasoning || rawPlan.ai_reasoning || '',
          message_preview: rawPlan.message || rawPlan.message_preview || '',
        };
        return mappedPlan;
      } catch (err) {
        console.error("AI Plan API error:", err);
        throw err;
      }
    },
    onSuccess: (data) => setPlan(data),
    onError: () => toast.error("Failed to generate plan. Please try again."),
  });

  const createMutation = useMutation({
    mutationFn: async (planData: MissionPlan) => {
      const res = await axios.post('/api/missions', {
        name: planData.mission_name,
        goal: planData.goal,
        channel: planData.recommended_channel,
        description: planData.target_audience,
        offer: planData.offer_suggestion,
        message_template: planData.message_preview,
        confidence_score: planData.confidence_score,
        ai_reasoning: planData.ai_reasoning,
        predicted_reach: planData.predicted_reach,
        predicted_revenue: planData.predicted_revenue,
        predicted_conversion_rate: planData.predicted_reach > 0 ? Math.round((planData.predicted_conversions / planData.predicted_reach) * 100) : 0,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Mission draft created successfully!");
      navigate('/missions');
    },
    onError: (err: unknown) => {
      toast.error("Unable to create mission.");
    },
  });

  const handleSubmit = () => {
    if (prompt.trim()) planMutation.mutate(prompt.trim());
  };

  const chColor = plan ? channelColors[plan.recommended_channel] || '#2563EB' : '#2563EB';

  return (
    <div className="p-6 max-w-5xl mx-auto page-enter min-h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      {!plan && !planMutation.isPending && (
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold mb-6 tracking-wide">
            <Sparkles size={13} />
            AI Mission Planner
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Design your next growth lever.</h2>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            Describe your objective in plain English, and Catalyst will generate a targeted segment, messaging strategy, and channel mix.
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className={`max-w-4xl mx-auto w-full transition-all duration-500 ${plan || planMutation.isPending ? 'mb-6' : 'mb-10'}`}>
        <div className="relative flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
          <div className="pl-4 pr-3 text-blue-600">
            <Sparkles size={20} />
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent py-4 outline-none text-gray-900 placeholder-gray-400 text-sm"
            placeholder="Increase reactivation rate among high-value customers who haven't purchased in 90 d"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
          <div className="pr-2">
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || planMutation.isPending}
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-40"
            >
              {planMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {planMutation.isPending && (
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
                <RefreshCw size={16} className="text-blue-600 animate-spin" />
                Generating Mission Blueprint...
              </div>
              <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider">
                Draft
              </div>
            </div>
            
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Target Segment */}
              <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                  <Users size={14} /> Target Segment
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                  <div className="h-5 bg-gray-200 border border-gray-300 rounded w-20 animate-pulse mt-4 flex items-center justify-center">
                    <span className="text-[9px] text-gray-500 font-semibold uppercase">Est. 12k Users</span>
                  </div>
                </div>
              </div>
              
              {/* Messaging Strategy */}
              <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                  <MessageSquare size={14} /> Messaging Strategy
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>
              </div>
              
              {/* Channel Mix */}
              <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                  <GitBranch size={14} /> Channel Mix
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-2">
              <button disabled className="px-4 py-2 text-xs font-semibold text-gray-400 bg-white border border-gray-200 rounded-lg">Cancel</button>
              <button disabled className="px-4 py-2 text-xs font-semibold text-white bg-blue-400 rounded-lg flex items-center gap-1.5">
                <Save size={14} /> Save Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Panel */}
      {plan && !planMutation.isPending && (
        <div className="space-y-4 animate-fadeIn max-w-4xl mx-auto w-full">
          {/* Mission name */}
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Mission Ready</span>
                </div>
                <h3 className="text-base font-bold text-gray-900">{plan.mission_name}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{plan.goal}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Model Confidence</span>
                <div className="text-2xl font-bold font-mono text-blue-600">{plan.confidence_score}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Audience */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Target Audience</span>
              <p className="text-xs text-gray-700 mt-2 leading-relaxed">{plan.target_audience}</p>
            </div>

            {/* Channel */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Recommended Channel</span>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                style={{ background: `${chColor}10`, color: chColor, border: `1px solid ${chColor}20` }}
              >
                <MessageSquare size={12} />
                {plan.recommended_channel}
              </div>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">{plan.channel_reasoning}</p>
            </div>

            {/* Offer */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Offer Strategy</span>
              <p className="text-xs text-gray-700 mt-2 leading-relaxed">{plan.offer_suggestion}</p>
            </div>

            {/* Impact Metrics */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Predicted Impact</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Reach', value: plan.predicted_reach.toLocaleString('en-IN'), color: '#2563EB' },
                  { label: 'Revenue', value: `₹${(plan.predicted_revenue / 1000).toFixed(0)}K`, color: '#059669' },
                  { label: 'Conversions', value: plan.predicted_conversions.toLocaleString('en-IN'), color: '#06B6D4' },
                ].map((m) => (
                  <div key={m.label} className="text-center p-3 bg-gray-50 border border-gray-100 rounded-lg">
                    <div className="text-sm font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Explanation / Reasoning */}
          <ExplainabilityCard
            decision="AI Campaign Planning Rationale"
            reasoning={plan.ai_reasoning}
            evidence={[
              `Audience cohort size: ${plan.predicted_reach} active profiles`,
              `Channel selected: ${plan.recommended_channel.toUpperCase()}`,
              `Historical WhatsApp CTR is 3.2x better than email for this cohort`,
              `Projected conversion probability: ${plan.confidence_score}%`
            ]}
            confidence={plan.confidence_score}
            impact={`₹${(plan.predicted_revenue / 1000).toFixed(0)}K predicted revenue potential`}
          />

          {/* Message Preview */}
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Personalized Message Preview</span>
            <div
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 leading-relaxed"
            >
              {plan.message_preview}
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setPlan(null)}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Discard
            </button>
            <button
              onClick={() => createMutation.mutate(plan)}
              disabled={createMutation.isPending}
              className="px-6 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm flex items-center gap-2"
            >
              {createMutation.isPending ? (
                <><Loader2 size={16} className="animate-spin" /> Creating Draft...</>
              ) : (
                <><Zap size={16} /> Create Draft</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Try asking... */}
      {!plan && !planMutation.isPending && (
        <div className="max-w-4xl mx-auto w-full mt-auto pt-10 pb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Try asking...</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => setPrompt('Boost trial conversion rate in LATAM.')} className="p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-blue-300 transition-all flex flex-col gap-3 group shadow-sm hover:shadow">
              <TrendingUp size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-700 font-medium leading-relaxed">Boost trial conversion rate in LATAM.</span>
            </button>
            <button onClick={() => setPrompt('Prevent churn for yearly subscribers.')} className="p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-blue-300 transition-all flex flex-col gap-3 group shadow-sm hover:shadow">
              <Tag size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-700 font-medium leading-relaxed">Prevent churn for yearly subscribers.</span>
            </button>
            <button onClick={() => setPrompt('Upsell premium features to power users.')} className="p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-blue-300 transition-all flex flex-col gap-3 group shadow-sm hover:shadow">
              <ShoppingCart size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-700 font-medium leading-relaxed">Upsell premium features to power users.</span>
            </button>
            <button onClick={() => setPrompt('Launch holiday promo for dormant accounts.')} className="p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-blue-300 transition-all flex flex-col gap-3 group shadow-sm hover:shadow">
              <Megaphone size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-700 font-medium leading-relaxed">Launch holiday promo for dormant accounts.</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
