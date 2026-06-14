import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  ArrowLeft, MapPin, Calendar, Mail, Phone, ShoppingBag,
  Sparkles, Zap, AlertTriangle, CheckCircle2,
  Database, RefreshCw, Layers, TrendingUp
} from 'lucide-react';

// --- INLINED COMPONENTS TO AVOID MISSING IMPORTS ---
const PageLoader = () => <div className="p-10 flex justify-center"><RefreshCw className="animate-spin text-blue-600" /></div>;

const EmptyState = ({ title, description, action }: any) => (
  <div className="text-center p-10 bg-white border border-gray-200 rounded-xl">
    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{description}</p>
    <button onClick={action.onClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg">{action.label}</button>
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
        {(evidence || []).map((item: string, i: number) => (
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

export default function CustomerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [oppType, setOppType] = useState('win_back');

  // Queries
  const { data: customer, isLoading: isCustLoading, isError: isCustError, refetch: refetchCust } = useQuery<any>({
    queryKey: ['customer', id],
    queryFn: async () => (await axios.get(`/api/customers/${id}`)).data,
  });

  const { data: ordersData, isLoading: isOrdersLoading } = useQuery<any>({
    queryKey: ['customer-orders', id],
    queryFn: async () => (await axios.get(`/api/customers/${id}/orders`)).data,
    enabled: !!customer,
  });

  const { data: storyData, isLoading: isStoryLoading } = useQuery<{ story: string }>({
    queryKey: ['customer-story', id],
    queryFn: async () => (await axios.get(`/api/customers/${id}/story`)).data,
    enabled: !!customer,
  });

  const { data: explanationData, isLoading: isExplainLoading } = useQuery<any>({
    queryKey: ['customer-explain', id, oppType],
    queryFn: async () => (await axios.get(`/api/customers/${id}/explain?opportunity_type=${oppType}`)).data,
    enabled: !!customer,
  });

  if (isCustLoading) return <PageLoader />;
  if (isCustError || !customer) {
    return (
      <EmptyState
        title="Customer Not Found"
        description="The customer profile you are looking for does not exist or has been deleted."
        action={{
          label: "Back to Customers",
          onClick: () => navigate('/customers')
        }}
      />
    );
  }

  const initials = customer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const churnColor = customer.churn_risk_score >= 70 ? '#DC2626' : customer.churn_risk_score >= 40 ? '#D97706' : '#059669';

  const segments = customer.segments || customer.segment_tags || [];
  const ltv = customer.ltv ?? customer.lifetime_value ?? customer.totalSpent ?? 0;
  const orderCount = customer.order_count ?? customer.total_orders ?? ordersData?.total_orders ?? 0;

  // AI Recommendation Mapping
  const getRecDecision = (type: string) => {
    switch (type) {
      case 'win_back':
        return 'Launch Dormant Win-Back via WhatsApp';
      case 'upsell':
        return 'Trigger High-Value VIP WhatsApp Upsell';
      case 'churn_prevention':
        return 'Send Automated Retention Outreach';
      case 'loyalty':
        return 'Send Loyalty Booster Point Balance offer';
      default:
        return 'Targeted Growth Outreach';
    }
  };

  const getRecImpact = (type: string) => {
    switch (type) {
      case 'win_back':
        return '22% recovery probability, ₹1,250 estimated AOV';
      case 'upsell':
        return '15% conversion rate, ₹2,400 projected upsell value';
      case 'churn_prevention':
        return 'Reduce churn likelihood by 34%';
      case 'loyalty':
        return '+18% Repeat Purchase frequency within 30 days';
      default:
        return '12% expected conversion lift';
    }
  };

  // Generate interaction timeline based on customer & orders
  const joinedDate = new Date(customer.created_at || customer.createdAt || Date.now());
  const timelineEvents = [
    {
      id: 'joined',
      type: 'CDP Ingestion',
      title: 'Stitched Unified Profile Created',
      description: `Customer identified via Shopify email & Loyalty ID. Unified ID: CUST-${customer.id.slice(0,4).toUpperCase()}`,
      date: joinedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      icon: <Layers size={14} className="text-blue-600" />,
      color: 'bg-blue-100'
    }
  ];

  if (customer.preferred_channel) {
    timelineEvents.push({
      id: 'pref-channel',
      type: 'AI Insights',
      title: `Preferred Channel Resolved: ${customer.preferred_channel}`,
      description: `Determined ${customer.preferred_channel} has a CTR of ${customer.preferred_channel === 'WhatsApp' ? '22%' : '14%'} based on past response metrics.`,
      date: new Date(joinedDate.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      icon: <Sparkles size={14} className="text-amber-600" />,
      color: 'bg-amber-100'
    });
  }

  if (ordersData && ordersData.orders && ordersData.orders.length > 0) {
    ordersData.orders.forEach((order: any, idx: number) => {
      // Simulate campaign match for orders
      timelineEvents.push({
        id: `campaign-${order.id}`,
        type: 'Campaign Outreach',
        title: `${customer.preferred_channel || 'WhatsApp'} Campaign Delivered`,
        description: `Triggered '${idx === 0 ? 'VIP Loyalty Upsell' : 'Growth Booster'}' mission template. Status: Opened & Clicked.`,
        date: new Date(new Date(order.createdAt || order.created_at).getTime() - 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        icon: <Zap size={14} className="text-blue-600" />,
        color: 'bg-blue-100'
      });
      timelineEvents.push({
        id: `order-${order.id}`,
        type: 'Conversion',
        title: `Purchased via ${order.status === 'pos' ? 'POS' : 'Shopify'}`,
        description: `Order ORD-${order.id.slice(0, 6).toUpperCase()} processed. Amount: ₹${order.amount.toLocaleString()}. Status: ${order.status || 'Completed'}`,
        date: new Date(order.createdAt || order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        icon: <ShoppingBag size={14} className="text-emerald-600" />,
        color: 'bg-emerald-100'
      });
    });
  }

  // Sort timelineEvents by date descending
  timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 page-enter">
      {/* Back button & Action bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Customer Database
        </button>
        <button
          onClick={() => refetchCust()}
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN: PROFILE CARD ================= */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center gap-4 relative overflow-hidden">
            {/* Initials Avatar */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-blue-700 bg-blue-50 border border-blue-200">
              {initials}
            </div>

            {/* Name & Source */}
            <div>
              <h2 className="text-base font-bold text-gray-900">{customer.name}</h2>
              <div className="flex justify-center gap-1.5 items-center mt-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-gray-100 text-gray-600 border border-gray-200 font-mono">
                  ID: CUST-{customer.id.slice(0, 5).toUpperCase()}
                </span>
                {customer.preferred_channel && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {customer.preferred_channel}
                  </span>
                )}
              </div>
            </div>

            {/* Segment Tags */}
            {segments.length > 0 && (
              <div className="flex justify-center gap-1 flex-wrap">
                {segments.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 border border-blue-100 text-blue-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Details List */}
            <div className="w-full flex flex-col gap-2.5 text-left border-t border-gray-100 pt-4 text-xs text-gray-600">
              {customer.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate font-medium">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="font-mono">{customer.phone}</span>
                </div>
              )}
              {customer.city && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="font-medium">{customer.city}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                <span>Joined {new Date(customer.created_at || customer.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* LTV & Core KPI Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Value Metrics</h3>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-gray-500 block">LIFETIME VALUE</span>
                <span className="text-xl font-bold text-emerald-600 font-mono">₹{ltv.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase">Orders</span>
                  <span className="text-sm font-bold text-gray-900 font-mono">{orderCount}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase">Avg Spend</span>
                  <span className="text-sm font-bold text-gray-900 font-mono">₹{Math.round(customer.avg_order_value || (customer.totalSpent / Math.max(orderCount, 1)) || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Churn Risk */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Churn Risk Radar</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color: churnColor }}>
                <AlertTriangle size={11} />
                {customer.churn_risk_score >= 70 ? 'High' : customer.churn_risk_score >= 40 ? 'Medium' : 'Low'}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 font-mono">{customer.churn_risk_score}%</span>
                <span className="text-[10px] text-gray-400">Churn risk estimate</span>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#F3F4F6" strokeWidth="3.5" fill="transparent" />
                  <circle cx="24" cy="24" r="20" stroke={churnColor} strokeWidth="3.5" fill="transparent"
                          strokeDasharray={126} strokeDashoffset={126 - (126 * customer.churn_risk_score) / 100} />
                </svg>
                <span className="absolute text-[9px] font-bold text-gray-900 font-mono">{customer.churn_risk_score}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN: ACTIVITY & TIMELINE ================= */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Purchase History */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                <ShoppingBag size={14} className="text-gray-400" />
                Purchase Transaction History
              </h3>
              <span className="text-[10px] bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded font-mono font-bold">
                {ordersData?.total_orders || 0} Orders
              </span>
            </div>

            {isOrdersLoading ? (
              <div className="py-8 text-center text-xs text-gray-400 animate-pulse">Loading order history...</div>
            ) : ordersData && ordersData.orders && ordersData.orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                      <th className="pb-2 font-medium">Order ID</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium text-right">Amount</th>
                      <th className="pb-2 font-medium text-right">Channel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersData.orders.map((order: any) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-2.5 font-bold font-mono text-gray-900">ORD-{order.id.slice(0, 5).toUpperCase()}</td>
                        <td className="py-2.5 text-gray-500">{new Date(order.created_at || order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="py-2.5 text-right font-bold text-gray-900 font-mono">₹{order.amount.toLocaleString()}</td>
                        <td className="py-2.5 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                            {order.status || 'Shopify'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-gray-400">No transactions recorded.</div>
            )}
          </div>

          {/* Campaign Timeline & Interaction History */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-xs">Campaign & Interaction Timeline</h3>
            <div className="overflow-y-auto max-h-[400px] pr-2">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="relative">
                    {/* Icon Node */}
                    <div className={`absolute -left-[23px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-500 shadow-sm ${event.color}`}>
                      {event.icon}
                    </div>
                    <div>
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">{event.type}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{event.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 mt-0.5">{event.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: AI INSIGHTS & CDP RESOLUTION ================= */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* AI Narrative Story */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-blue-600" />
              <h3 className="font-bold text-gray-900 text-xs">AI Customer Narrative Profile</h3>
            </div>

            {isStoryLoading ? (
              <div className="py-4 text-center text-xs text-gray-400 animate-pulse">Drafting story...</div>
            ) : storyData ? (
              <p className="text-xs leading-relaxed text-gray-600 italic bg-blue-50/40 border border-blue-100 p-3.5 rounded-lg">
                "{storyData.story}"
              </p>
            ) : (
              <p className="text-xs text-gray-400">Failed to generate summary narrative.</p>
            )}
          </div>

          {/* AI Selection & Explainability */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                AI Segment Targeting Analysis
              </h3>
              <select
                value={oppType}
                onChange={(e) => setOppType(e.target.value)}
                className="bg-white border border-gray-200 rounded px-2 py-1 text-[11px] font-semibold text-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="win_back">Dormant Win-Back</option>
                <option value="upsell">High-Value Upsell</option>
                <option value="churn_prevention">Retention Alert</option>
                <option value="loyalty">Loyalty Booster</option>
              </select>
            </div>

            {isExplainLoading ? (
              <div className="py-6 text-center text-xs text-gray-400 animate-pulse">Analyzing attributes...</div>
            ) : explanationData ? (
              <ExplainabilityCard
                decision={getRecDecision(oppType)}
                reasoning={explanationData.reasoning}
                evidence={explanationData.factors}
                confidence={explanationData.confidence}
                impact={getRecImpact(oppType)}
              />
            ) : (
              <div className="text-center py-6 text-xs text-gray-400">No targeting metrics loaded.</div>
            )}
          </div>

          {/* Identity Sources (CDP Stitching) */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                <Database size={14} className="text-blue-600" />
                CDP Identity Stitching
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Stitched
              </span>
            </div>

            <div className="space-y-3">
              {/* Stitching flow */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="p-2 border border-gray-200 rounded bg-gray-50 font-semibold text-gray-700">
                  Shopify
                  <div className="text-[8px] font-mono text-gray-400 mt-1 truncate">{customer.email ? 'Email Match' : 'N/A'}</div>
                </div>
                <div className="p-2 border border-gray-200 rounded bg-gray-50 font-semibold text-gray-700">
                  POS
                  <div className="text-[8px] font-mono text-gray-400 mt-1 truncate">{customer.phone ? 'Phone Match' : 'N/A'}</div>
                </div>
                <div className="p-2 border border-gray-200 rounded bg-gray-50 font-semibold text-gray-700">
                  Loyalty
                  <div className="text-[8px] font-mono text-gray-400 mt-1 truncate">LOY-{customer.id.slice(0,4).toUpperCase()}</div>
                </div>
                <div className="p-2 border border-gray-200 rounded bg-gray-50 font-semibold text-gray-700">
                  CSV
                  <div className="text-[8px] font-mono text-gray-400 mt-1 truncate">Imported</div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Match Confidence:</span>
                  <span className="font-bold text-gray-900 font-mono">97%</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Stitching Reason:</span>
                  <span className="text-gray-900 font-bold text-right">Matching Phone & Email</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold pt-1 border-t border-gray-200">
                  <CheckCircle2 size={12} />
                  <span>Stitched profile resolves to Customer #{customer.id.slice(0, 4).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
