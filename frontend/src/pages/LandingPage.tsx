import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Zap, BarChart3, Users, MessageSquare, Target,
  CheckCircle, ArrowRight, Menu, X, Star, TrendingUp,
  Shield, Clock, Globe, ChevronDown, Play, ChevronLeft, ChevronRight, Mail
} from 'lucide-react';
import MessagePreview from '../components/MessagePreview';

// ─── Brand SVG Icons ────────────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const RedditIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const ChannelIcon = ({ id, size = 15 }: { id: string; size?: number }) => {
  switch (id) {
    case 'whatsapp':  return <WhatsAppIcon size={size} />;
    case 'email':     return <Mail size={size} />;
    case 'instagram': return <InstagramIcon size={size} />;
    case 'facebook':  return <FacebookIcon size={size} />;
    case 'reddit':    return <RedditIcon size={size} />;
    default:          return null;
  }
};

const channelColors: Record<string, string> = {
  whatsapp:  '#25D366',
  email:     '#2563EB',
  instagram: '#E1306C',
  facebook:  '#1877F2',
  reddit:    '#FF4500',
};

// ─── Animated Counter ──────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: {
  end: number; suffix?: string; prefix?: string; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let startTime: number;
        const step = (ts: number) => {
          if (!startTime) startTime = ts;
          const p = Math.min((ts - startTime) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, gradient }: {
  icon: any; title: string; description: string; gradient: string;
}) {
  return (
    <div className="group bg-white rounded-2xl p-7 border border-brand-100 shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-blue relative z-10 ${gradient}`}>
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-text-primary font-display font-bold text-lg mb-2 group-hover:text-brand-700 transition-colors relative z-10">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed relative z-10">{description}</p>
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({ name, role, company, quote, avatar }: {
  name: string; role: string; company: string; quote: string; avatar: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-7 border border-brand-100 shadow-soft hover:shadow-premium transition-all duration-300">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-text-secondary text-sm leading-relaxed mb-6 italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-blue">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-text-primary text-sm">{name}</div>
          <div className="text-xs text-text-secondary">{role} · {company}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeChannel, setActiveChannel] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight active nav link based on scroll position
  useEffect(() => {
    const ids = ['features', 'how-it-works', 'customers', 'pricing'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI Mission Planner',
      description: 'Describe your goal in plain English. Catalyst builds the entire campaign — segment, message, channel, and offer — in seconds.',
      gradient: 'bg-gradient-to-br from-brand-500 to-brand-700',
    },
    {
      icon: Users,
      title: 'Smart Segmentation',
      description: 'Dynamically build audience segments from 50+ behavioral signals. Zero SQL required. Reach exactly the right customers.',
      gradient: 'bg-gradient-to-br from-brand-600 to-brand-800',
    },
    {
      icon: MessageSquare,
      title: 'Omnichannel Delivery',
      description: 'Personalized messages across WhatsApp, Email, SMS, RCS & Push. Each message feels hand-crafted, delivered at scale.',
      gradient: 'bg-gradient-to-br from-brand-500 to-brand-700',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Live funnel metrics, revenue attribution, and AI-powered autopsy reports for every campaign you run.',
      gradient: 'bg-gradient-to-br from-brand-600 to-brand-900',
    },
    {
      icon: Target,
      title: 'Opportunity Engine',
      description: 'AI continuously scans your CRM data and surfaces high-value growth opportunities before you even think to look.',
      gradient: 'bg-gradient-to-br from-brand-700 to-brand-900',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant, GDPR-ready infrastructure with role-based access and full audit logs for peace of mind.',
      gradient: 'bg-gradient-to-br from-brand-800 to-brand-900',
    },
  ];

  const testimonials = [
    {
      name: 'Anika Sharma',
      role: 'Head of Growth',
      company: 'RetailMax India',
      quote: 'Catalyst helped us run 3x more campaigns with half the team. The AI mission planner is genuinely magical — it understands our business.',
      avatar: 'AS',
    },
    {
      name: 'Vikram Nair',
      role: 'VP Marketing',
      company: 'NovaPay',
      quote: "We recovered ₹42L in dormant customer revenue in the first month. The WhatsApp personalization is unlike anything we've seen.",
      avatar: 'VN',
    },
    {
      name: 'Priyanka Mehta',
      role: 'CRM Director',
      company: 'FreshCart',
      quote: "Finally a CRM tool that our marketers actually love using. Catalyst's segmentation engine saves us 20 hours every week.",
      avatar: 'PM',
    },
  ];

  const stats = [
    { label: 'Revenue Driven',       value: 240, prefix: '₹', suffix: 'Cr+' },
    { label: 'Messages Sent',         value: 180, suffix: 'M+' },
    { label: 'Avg. Conversion Lift',  value: 34,  suffix: '%' },
    { label: 'Brands Trust Us',       value: 850, suffix: '+' },
  ];

  const channels = [
    { id: 'whatsapp',  label: 'WhatsApp',
      msg: 'Hey {{first_name}}! 👋 Your exclusive VIP offer is ready — 15% OFF your next order + free delivery. Valid 48 hours only! 🛍️ Shop Now →' },
    { id: 'email',     label: 'Email',
      msg: 'Subject: {{first_name}}, your VIP reward expires tonight 🎁\n\nHi {{first_name}}, we noticed you haven\'t shopped in a while — come back and get 20% off your next purchase, just for you.' },
    { id: 'instagram', label: 'Instagram',
      msg: 'Hey {{first_name}}! ✨ Exclusive VIP deal just for you — 15% off + free shipping. Tap to grab it before it\'s gone! 🛍️' },
    { id: 'facebook',  label: 'Facebook',
      msg: 'Hi {{first_name}}! 🎉 We have a special offer waiting for you — 20% off on your next order. Limited time only. Click below to claim!' },
    { id: 'reddit',    label: 'Reddit',
      msg: '{{first_name}}, exclusive early access to our VIP sale\n\nJoin 50,000+ smart shoppers saving big. Use code VIP15 for 15% off — valid today only.' },
  ];

  const prevChannel = () => setActiveChannel(i => (i - 1 + channels.length) % channels.length);
  const nextChannel = () => setActiveChannel(i => (i + 1) % channels.length);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-brand-100 shadow-soft'
          : 'bg-white/60 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px] gap-6">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <span className="text-[19px] font-display font-extrabold tracking-tight">
                <span className="text-brand-700">Catalyst</span>
                <span className="text-brand-400 text-[9px] font-bold ml-0.5 align-super">AI</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {[
                { label: 'Features',  id: 'features'    },
                { label: 'Pricing',   id: 'pricing'     },
                { label: 'Customers', id: 'customers'   },
                { label: 'Docs',      id: 'docs-footer' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.id)}
                  className={`relative group px-4 py-2 text-sm font-semibold transition-colors rounded-lg ${
                    activeSection === item.id
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-text-secondary hover:text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-brand-500 rounded-full transition-transform origin-center duration-200 ${
                    activeSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate('/app/opportunities')}
                className="text-sm font-semibold text-text-secondary hover:text-brand-700 transition-colors px-4 py-2 rounded-lg hover:bg-brand-50"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/app/opportunities')}
                className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-blue hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started <ArrowRight size={13} />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-brand-100 px-4 py-4 space-y-1 shadow-card">
            {[
              { label: 'Features',  id: 'features'    },
              { label: 'Pricing',   id: 'pricing'     },
              { label: 'Customers', id: 'customers'   },
              { label: 'Docs',      id: 'docs-footer' },
            ].map(item => (
              <button key={item.label} onClick={() => scrollTo(item.id)} className="w-full text-left flex items-center text-sm font-semibold text-text-primary py-2.5 px-3 rounded-xl hover:bg-brand-50 hover:text-brand-700 transition-colors">
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-brand-50 flex flex-col gap-2">
              <button
                onClick={() => navigate('/app/opportunities')}
                className="w-full text-sm font-semibold text-brand-700 py-2.5 rounded-xl border-2 border-brand-100 hover:bg-brand-50 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/app/opportunities')}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-blue"
              >
                Get Started Free <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-50/30 pointer-events-none" />
        {/* Dot grid */}
        <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-300/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Copy */}
            <div className="flex-1 text-center lg:text-left animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-wide shadow-soft">
                <Sparkles size={12} className="text-brand-600" />
                AI-Powered CRM Automation
                <span className="bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">NEW</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-text-primary leading-[1.06] tracking-tight mb-7">
                Turn Customer Data
                <br />
                <span className="text-gradient">Into Revenue.</span>
              </h1>

              <p className="text-text-secondary text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                Catalyst uses generative AI to plan, personalize, and execute omnichannel campaigns across WhatsApp, Email & SMS — automatically, in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <button
                  onClick={() => navigate('/app/opportunities')}
                  className="btn-primary text-base px-8 py-4"
                >
                  Start for Free <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/app/opportunities')}
                  className="btn-secondary text-base px-8 py-4"
                >
                  <Play size={16} className="fill-current text-brand-600" /> Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-5 justify-center lg:justify-start flex-wrap">
                <div className="flex -space-x-2.5">
                  {['AS', 'VN', 'PM', 'RK'].map((initials, i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-text-secondary">
                  <span className="font-bold text-text-primary">850+ brands</span> trust Catalyst
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
                  <span className="text-xs text-text-secondary ml-1 font-medium">4.9 / 5</span>
                </div>
              </div>
            </div>

            {/* Right: Channel Carousel */}
            <div className="flex-1 flex flex-col items-center gap-5 w-full max-w-sm animate-float">
              {/* Tabs */}
              <div className="flex gap-2 flex-wrap justify-center">
                {channels.map((ch, i) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(i)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border ${
                      activeChannel === i
                        ? 'bg-white border-2 shadow-card scale-[1.06]'
                        : 'bg-white border-brand-100 text-text-secondary hover:text-text-primary hover:border-brand-200 hover:shadow-soft'
                    }`}
                    style={activeChannel === i ? {
                      borderColor: channelColors[ch.id],
                      color: channelColors[ch.id],
                      boxShadow: `0 4px 12px ${channelColors[ch.id]}30`
                    } : {}}
                  >
                    <span style={{ color: activeChannel === i ? channelColors[ch.id] : channelColors[ch.id] + 'CC' }}>
                      <ChannelIcon id={ch.id} size={14} />
                    </span>
                    {ch.label}
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="w-full relative">
                <button
                  onClick={prevChannel}
                  className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-brand-100 rounded-full shadow-soft flex items-center justify-center text-text-secondary hover:text-brand-600 hover:border-brand-300 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="w-full animate-fadeIn rounded-3xl overflow-hidden border-2 border-brand-100 shadow-premium" key={activeChannel}>
                  <MessagePreview
                    channel={channels[activeChannel].id}
                    message={channels[activeChannel].msg}
                  />
                </div>

                <button
                  onClick={nextChannel}
                  className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-brand-100 rounded-full shadow-soft flex items-center justify-center text-text-secondary hover:text-brand-600 hover:border-brand-300 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Dots */}
              <div className="flex gap-2">
                {channels.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveChannel(i)}
                    className={`rounded-full transition-all ${activeChannel === i ? 'w-6 h-2 bg-brand-600 shadow-blue' : 'w-2 h-2 bg-brand-200'}`}
                  />
                ))}
              </div>

              {/* AI Badge */}
              <div className="bg-brand-50 border border-brand-200 rounded-2xl px-5 py-4 w-full shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-brand-600 animate-pulseGlow" />
                  <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">AI Generated</span>
                  <span className="ml-auto text-xs font-bold text-brand-700 bg-brand-100 border border-brand-200 px-2 py-0.5 rounded-full">94% Conf.</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Personalized for <strong className="text-brand-700">Priya</strong> using purchase history & {channels.length} channel signals.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-brand-300 animate-bounce">
          <span className="text-xs font-medium">Scroll to explore</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-14 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-5xl font-display font-extrabold text-white font-mono mb-1.5">
                  <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-brand-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-24 bg-surface-secondary scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold px-4 py-2 rounded-full mb-5 tracking-wide shadow-soft">
              <Zap size={12} /> Everything you need
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-text-primary tracking-tight mb-5">
              The complete CRM platform
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
              From intelligent segmentation to AI-written messages to real-time analytics — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-text-primary tracking-tight mb-5">
              From idea to campaign in 3 steps
            </h2>
            <p className="text-text-secondary text-lg max-w-md mx-auto">No complex setup. No weeks of onboarding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-[40px] left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-500 to-brand-200" />

            {[
              { step: '01', icon: MessageSquare, title: 'Describe your goal', desc: "Type your campaign objective in plain English. 'Re-engage customers who haven't bought in 60 days'." },
              { step: '02', icon: Sparkles, title: 'AI builds the plan', desc: 'Catalyst creates the target segment, crafts personalized messages, selects the best channel, and predicts outcomes.' },
              { step: '03', icon: Zap, title: 'Launch & watch it work', desc: 'Deploy with one click. Real-time metrics and AI autopsy reports surface immediately after launch.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="relative mb-7">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-premium">
                    <item.icon size={28} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-brand-500 rounded-full flex items-center justify-center text-[11px] font-extrabold text-brand-600 shadow-soft">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-text-primary font-display font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="customers" className="py-24 bg-surface-secondary scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-text-primary tracking-tight mb-5">
              Loved by marketing teams
            </h2>
            <p className="text-text-secondary text-lg">Real results from real businesses running on Catalyst.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => <TestimonialCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── Channel Showcase ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-wide shadow-soft">
                <Globe size={12} /> Omnichannel
              </div>
              <h2 className="text-4xl font-display font-extrabold text-text-primary tracking-tight mb-5">
                Every message, perfectly personalized
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8 text-lg">
                Catalyst crafts hyper-personalized communications using each customer's unique journey, preferences, and behavioral signals.
              </p>
              <ul className="space-y-3.5">
                {[
                  { label: 'WhatsApp',           desc: 'Conversational, rich-media messages',    dot: 'bg-green-500' },
                  { label: 'Email',              desc: 'Beautiful HTML templates, personalized', dot: 'bg-brand-600' },
                  { label: 'SMS',                desc: 'High-open-rate text campaigns',          dot: 'bg-amber-500' },
                  { label: 'Instagram DM',       desc: 'Personal, story-driven outreach',        dot: 'bg-pink-500'  },
                  { label: 'Facebook Messenger', desc: 'CTA-rich cards and chatbots',            dot: 'bg-blue-500'  },
                  { label: 'RCS & Push',         desc: 'Rich cards and in-app notifications',    dot: 'bg-brand-800' },
                ].map((ch) => (
                  <li key={ch.label} className="flex items-center gap-3 group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border border-brand-100 shadow-soft group-hover:shadow-card transition-all`}>
                      <div className={`w-3 h-3 rounded-full ${ch.dot}`} />
                    </div>
                    <div>
                      <span className="font-semibold text-text-primary text-sm">{ch.label}</span>
                      <span className="text-text-secondary text-sm ml-2">{ch.desc}</span>
                    </div>
                    <CheckCircle size={16} className="text-brand-500 ml-auto flex-shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <div className="rounded-3xl overflow-hidden border-2 border-brand-100 shadow-premium">
                <MessagePreview channel="whatsapp" message="Hey {{first_name}}! ✨ Exclusive VIP deal — 15% off + free shipping just for you. Tap to grab it! 🛍️" />
              </div>
              <div className="rounded-3xl overflow-hidden border-2 border-brand-100 shadow-card">
                <MessagePreview channel="email" message="Hi {{first_name}}! 🎉 Special offer — 20% off on your next order. Limited time only. Click below to claim!" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="py-12 bg-surface-secondary border-y border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-text-muted uppercase tracking-widest mb-7">Works with your existing stack</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {['Salesforce', 'HubSpot', 'Shopify', 'Razorpay', 'Segment', 'Mixpanel', 'Twilio', 'Sendgrid'].map((brand) => (
              <span key={brand} className="text-sm font-bold text-text-muted tracking-tight hover:text-brand-600 transition-colors">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-text-primary tracking-tight mb-5">Simple, transparent pricing</h2>
            <p className="text-text-secondary text-lg">Start free, scale as you grow. No surprise fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                name: 'Starter',  price: '₹0',     period: '/month',
                desc: 'For small teams getting started',
                features: ['Up to 5,000 contacts', '3 AI missions/month', 'WhatsApp + Email', 'Basic analytics'],
                cta: 'Start Free', highlight: false,
              },
              {
                name: 'Growth',   price: '₹4,999', period: '/month',
                desc: 'For scaling marketing teams',
                features: ['Up to 50,000 contacts', 'Unlimited AI missions', 'All channels', 'Advanced analytics', 'Priority support'],
                cta: 'Start Trial', highlight: true,
              },
              {
                name: 'Enterprise', price: 'Custom', period: '',
                desc: 'For large-scale operations',
                features: ['Unlimited contacts', 'Custom AI models', 'Dedicated CSM', 'SLA & compliance', 'White-label option'],
                cta: 'Contact Sales', highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border-2 transition-all duration-300 relative overflow-hidden ${
                  plan.highlight
                    ? 'bg-brand-600 border-brand-600 shadow-premium scale-[1.02]'
                    : 'bg-white border-brand-100 hover:border-brand-300 hover:shadow-premium'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-4 right-4 bg-white text-brand-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${plan.highlight ? 'text-brand-200' : 'text-text-muted'}`}>{plan.name}</div>
                <div className={`text-4xl font-display font-extrabold mb-1 ${plan.highlight ? 'text-white' : 'text-text-primary'}`}>
                  {plan.price}<span className={`text-sm font-medium ${plan.highlight ? 'text-brand-200' : 'text-text-secondary'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-brand-200' : 'text-text-secondary'}`}>{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle size={15} className={plan.highlight ? 'text-brand-200' : 'text-brand-500'} />
                      <span className={plan.highlight ? 'text-white' : 'text-text-primary'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/app/opportunities')}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                    plan.highlight
                      ? 'bg-white text-brand-700 hover:bg-brand-50 shadow-sm'
                      : 'bg-brand-600 text-white hover:bg-brand-700 shadow-blue hover:shadow-glow'
                  }`}
                >
                  {plan.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-7 tracking-wide">
            <Clock size={12} /> Setup in under 5 minutes
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-5 leading-tight">
            Ready to 10x your<br />campaign ROI?
          </h2>
          <p className="text-brand-200 text-xl mb-10 leading-relaxed">
            Join 850+ brands using Catalyst to drive growth with AI-powered CRM automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button
              onClick={() => navigate('/app/opportunities')}
              className="flex items-center justify-center gap-2 bg-white text-brand-700 font-extrabold px-10 py-4 rounded-xl text-base transition-all shadow-glow hover:scale-[1.03] active:scale-[0.98] hover:bg-brand-50"
            >
              Launch Your First Campaign <ArrowRight size={18} />
            </button>
            <button
              className="flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:bg-white/10 hover:border-white/50"
            >
              <TrendingUp size={16} /> View Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="docs-footer" className="bg-brand-900 text-brand-300 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-white font-display font-bold text-lg tracking-tight">CATALYST</span>
              </div>
              <p className="text-sm leading-relaxed text-brand-400 max-w-xs">
                The AI-powered CRM automation platform built for modern marketing teams.
              </p>
            </div>
            {[
              { title: 'Product',   links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Resources', links: ['Docs', 'API Reference', 'Blog', 'Status'] },
              { title: 'Company',   links: ['About', 'Careers', 'Privacy', 'Terms'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-brand-800 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs">© 2025 Catalyst AI. All rights reserved.</span>
            <div className="flex items-center gap-1.5 text-xs">
              <Shield size={12} className="text-brand-400" />
              <span>SOC 2 Certified · GDPR Ready · 99.9% SLA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
