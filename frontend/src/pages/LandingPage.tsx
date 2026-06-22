import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Zap, BarChart3, Users, MessageSquare, Target,
  CheckCircle, ArrowRight, Menu, X, Star, TrendingUp,
  Shield, Clock, Globe, ChevronDown, Play, ChevronLeft, ChevronRight
} from 'lucide-react';
import MessagePreview from '../components/MessagePreview';

// ─── Animated Counter ──────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let startTime: number;
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}


// ─── FeatureCard ────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, color }: { icon: any; title: string; description: string; color: string }) {
  return (
    <div className="group glass-dark rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} shadow-glow`}>
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-text-darkPrimary font-display font-bold text-lg mb-2 group-hover:text-primary-blue transition-colors">{title}</h3>
      <p className="text-text-darkSecondary text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Testimonial Card ───────────────────────────────────────────────────
function TestimonialCard({ name, role, company, quote, avatar }: { name: string; role: string; company: string; quote: string; avatar: string }) {
  return (
    <div className="glass-dark rounded-2xl p-6 hover:shadow-premium transition-shadow">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-text-darkSecondary text-sm leading-relaxed mb-5 italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-violet flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-glow">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-text-darkPrimary text-sm">{name}</div>
          <div className="text-xs text-text-darkSecondary">{role} · {company}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeChannel, setActiveChannel] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: 'AI Mission Planner',
      description: 'Describe your goal in plain English. Catalyst builds the entire campaign — segment, message, channel, and offer — in seconds.',
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
    },
    {
      icon: Users,
      title: 'Smart Segmentation',
      description: 'Dynamically build audience segments from 50+ behavioral signals. Zero SQL required. Reach exactly the right customers.',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    },
    {
      icon: MessageSquare,
      title: 'Omnichannel Delivery',
      description: 'Personalized messages across WhatsApp, Email, SMS, RCS & Push. Each message feels hand-crafted, delivered at scale.',
      color: 'bg-gradient-to-br from-sky-500 to-sky-700',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Live funnel metrics, revenue attribution, and AI-powered autopsy reports for every campaign you run.',
      color: 'bg-gradient-to-br from-blue-600 to-cyan-600',
    },
    {
      icon: Target,
      title: 'Opportunity Engine',
      description: 'AI continuously scans your CRM data and surfaces high-value growth opportunities before you even think to look.',
      color: 'bg-gradient-to-br from-blue-700 to-indigo-600',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant, GDPR-ready infrastructure with role-based access and full audit logs for peace of mind.',
      color: 'bg-gradient-to-br from-slate-600 to-slate-800',
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
    { label: 'Revenue Driven', value: 240, prefix: '₹', suffix: 'Cr+' },
    { label: 'Messages Sent', value: 180, suffix: 'M+' },
    { label: 'Avg. Conversion Lift', value: 34, suffix: '%' },
    { label: 'Brands Trust Us', value: 850, suffix: '+' },
  ];

  const channels = [
    { id: 'whatsapp',  label: 'WhatsApp',  color: '#25D366', emoji: '💬',
      msg: 'Hey {{first_name}}! 👋 Your exclusive VIP offer is ready — 15% OFF your next order + free delivery. Valid 48 hours only! 🛍️ Shop Now →' },
    { id: 'email',     label: 'Email',     color: '#2563EB', emoji: '📧',
      msg: 'Subject: {{first_name}}, your VIP reward expires tonight 🎁\n\nHi {{first_name}}, we noticed you haven\'t shopped in a while — come back and get 20% off your next purchase, just for you.' },
    { id: 'instagram', label: 'Instagram', color: '#E1306C', emoji: '📸',
      msg: 'Hey {{first_name}}! ✨ Exclusive VIP deal just for you — 15% off + free shipping. Tap to grab it before it\'s gone! 🛍️' },
    { id: 'facebook',  label: 'Facebook',  color: '#1877F2', emoji: '💬',
      msg: 'Hi {{first_name}}! 🎉 We have a special offer waiting for you — 20% off on your next order. Limited time only. Click below to claim!' },
    { id: 'reddit',    label: 'Reddit',    color: '#FF4500', emoji: '🔺',
      msg: '{{first_name}}, exclusive early access to our VIP sale\n\nJoin 50,000+ smart shoppers saving big with Catalyst-powered personalized deals. Use code VIP15 for 15% off — valid today only.' },
  ];

  const prevChannel = () => setActiveChannel(i => (i - 1 + channels.length) % channels.length);
  const nextChannel = () => setActiveChannel(i => (i + 1) % channels.length);

  return (
    <div className="min-h-screen bg-surface-dark font-sans text-text-darkPrimary selection:bg-primary-blue/30 overflow-hidden">
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-blue to-primary-violet rounded-lg flex items-center justify-center shadow-glow">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-xl font-display font-bold text-text-darkPrimary tracking-tight">CATALYST</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing', 'Customers', 'Docs'].map(item => (
                <a key={item} href="#" className="text-sm font-medium text-text-darkSecondary hover:text-text-darkPrimary transition-colors">{item}</a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate('/app/opportunities')}
                className="text-sm font-semibold text-text-darkSecondary hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/app/opportunities')}
                className="text-sm font-bold text-white bg-primary-blue hover:bg-primary-indigo px-5 py-2.5 rounded-xl transition-all shadow-glow hover:shadow-primary-blue/50"
              >
                Start Free Trial
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 text-text-darkSecondary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-dark border-t border-white/10 px-4 py-4 space-y-3 shadow-premium">
            {['Features', 'Pricing', 'Customers', 'Docs'].map(item => (
              <a key={item} href="#" className="block text-sm font-medium text-text-darkPrimary py-2">{item}</a>
            ))}
            <button
              onClick={() => navigate('/app/opportunities')}
              className="w-full mt-2 bg-primary-blue hover:bg-primary-indigo text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
              Get Started Free →
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-indigo/10 via-surface-dark to-surface-dark pointer-events-none" />
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-violet/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Copy */}
            <div className="flex-1 text-center lg:text-left animate-fadeIn">
              <div className="inline-flex items-center gap-2 glass-dark text-primary-blue text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide border border-primary-blue/20">
                <Sparkles size={12} className="text-primary-violet" />
                AI-Powered CRM Automation
                <span className="bg-primary-blue text-white text-[10px] px-1.5 py-0.5 rounded font-bold">NEW</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight tracking-tight mb-6">
                Turn Customer Data Into
                <span className="relative ml-3">
                  <span className="text-gradient">Revenue</span>
                </span>
                <br />with AI Campaigns.
              </h1>

              <p className="text-text-darkSecondary text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Catalyst uses generative AI to plan, personalize, and execute omnichannel campaigns across WhatsApp, Email & SMS — automatically, in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <button
                  onClick={() => navigate('/app/opportunities')}
                  className="flex items-center justify-center gap-2 bg-primary-blue hover:bg-primary-indigo text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start for Free <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/app/opportunities')}
                  className="flex items-center justify-center gap-2 glass-dark text-text-darkPrimary hover:bg-white/5 font-semibold px-8 py-4 rounded-xl text-base transition-all"
                >
                  <Play size={16} className="fill-current text-primary-blue" /> Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-4 justify-center lg:justify-start flex-wrap">
                <div className="flex -space-x-2">
                  {['AS', 'VN', 'PM', 'RK'].map((initials, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-blue to-primary-violet border border-white/20 flex items-center justify-center text-white text-[10px] font-bold">
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-text-darkSecondary">
                  <span className="font-bold text-white">850+ brands</span> trust Catalyst
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                  <span className="text-xs text-text-darkSecondary ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Right: Live Channel Carousel */}
            <div className="flex-1 flex flex-col items-center gap-4 w-full max-w-sm animate-float">
              {/* Channel tabs — scrollable pill row */}
              <div className="flex gap-1.5 flex-wrap justify-center">
                {channels.map((ch, i) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(i)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      activeChannel === i
                        ? 'bg-white/10 shadow-glow border-primary-blue/30 text-white scale-[1.04]'
                        : 'glass-dark border-transparent text-text-darkSecondary hover:text-white'
                    }`}
                  >
                    <span>{ch.emoji}</span>
                    {ch.label}
                  </button>
                ))}
              </div>

              {/* Preview card with prev/next arrows */}
              <div className="w-full relative">
                <button
                  onClick={prevChannel}
                  className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 glass-dark rounded-full shadow-premium flex items-center justify-center text-text-darkSecondary hover:text-white transition-colors border border-white/10"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="w-full animate-fadeIn glass-dark rounded-[2rem] overflow-hidden border border-white/10" key={activeChannel}>
                  <MessagePreview
                    channel={channels[activeChannel].id}
                    message={channels[activeChannel].msg}
                  />
                </div>

                <button
                  onClick={nextChannel}
                  className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 glass-dark rounded-full shadow-premium flex items-center justify-center text-text-darkSecondary hover:text-white transition-colors border border-white/10"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Dot indicators */}
              <div className="flex gap-2">
                {channels.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveChannel(i)}
                    className={`rounded-full transition-all ${
                      activeChannel === i ? 'w-6 h-2 bg-primary-blue shadow-glow' : 'w-2 h-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* AI badge */}
              <div className="glass-dark border border-primary-blue/20 rounded-xl px-4 py-3 w-full">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-primary-blue animate-pulse" />
                  <span className="text-xs font-bold text-primary-blue uppercase tracking-wider">AI Generated</span>
                  <span className="ml-auto text-xs font-bold text-primary-violet bg-primary-violet/10 border border-primary-violet/20 px-2 py-0.5 rounded-full">94% Conf.</span>
                </div>
                <p className="text-xs text-text-darkSecondary">Personalized for <strong className="text-white">Priya</strong> using purchase history &amp; signals across <strong className="text-white">{channels.length} channels</strong>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-white/30 animate-bounce">
          <span className="text-xs font-medium">Scroll to explore</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-12 border-y border-white/10 glass-dark relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-extrabold text-white font-mono mb-1">
                  <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-primary-blue text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass-dark text-primary-blue text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide border border-primary-blue/20">
              <Zap size={12} /> Everything you need
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight mb-4">
              The complete CRM automation platform
            </h2>
            <p className="text-text-darkSecondary max-w-xl mx-auto leading-relaxed">
              From intelligent segmentation to AI-written messages to real-time analytics — Catalyst is your entire growth stack in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 lg:py-28 relative border-t border-white/5">
        <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight mb-4">
              From idea to campaign in 3 steps
            </h2>
            <p className="text-text-darkSecondary max-w-md mx-auto">No complex setup. No weeks of onboarding. Just describe your goal and Catalyst does the rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary-blue/10 via-primary-violet/50 to-primary-blue/10" />

            {[
              { step: '01', icon: MessageSquare, title: 'Describe your goal', desc: "Type your campaign objective in plain English. 'Re-engage customers who haven't bought in 60 days'." },
              { step: '02', icon: Sparkles, title: 'AI builds the plan', desc: 'Catalyst creates the target segment, crafts personalized messages, selects the best channel, and predicts outcomes.' },
              { step: '03', icon: Zap, title: 'Launch & watch it work', desc: 'Deploy with one click. Real-time metrics and AI autopsy reports surface immediately after launch.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-blue to-primary-indigo flex items-center justify-center shadow-glow border border-white/20">
                    <item.icon size={28} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-surface-dark border border-white/20 rounded-full flex items-center justify-center text-[11px] font-extrabold text-primary-blue shadow-premium">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-text-darkPrimary font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-text-darkSecondary text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 lg:py-28 bg-[#F8FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Loved by marketing teams across India
            </h2>
            <p className="text-slate-500">Real results from real businesses running on Catalyst.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => <TestimonialCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── Channel Showcase ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wide">
                <Globe size={12} /> Omnichannel
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-5">
                Every message, perfectly personalized across every channel
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Catalyst doesn&apos;t just send messages — it crafts hyper-personalized communications using each customer&apos;s unique journey, preferences, and behavioral signals.
              </p>
              <ul className="space-y-3">
                {[
                  { label: 'WhatsApp',  desc: 'Conversational, rich-media messages', color: '#25D366' },
                  { label: 'Email',     desc: 'Beautiful HTML templates, personalized', color: '#2563EB' },
                  { label: 'SMS',       desc: 'High-open-rate text campaigns', color: '#F59E0B' },
                  { label: 'Instagram DM', desc: 'Personal, story-driven outreach', color: '#E1306C' },
                  { label: 'Facebook Messenger', desc: 'CTA-rich cards and chatbots', color: '#1877F2' },
                  { label: 'Reddit Sponsored', desc: 'Community-native promoted posts', color: '#FF4500' },
                  { label: 'RCS & Push', desc: 'Rich cards and in-app notifications', color: '#8B5CF6' },
                ].map((ch) => (
                  <li key={ch.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: ch.color + '15', border: `1px solid ${ch.color}30` }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: ch.color }} />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 text-sm">{ch.label}</span>
                      <span className="text-slate-500 text-sm ml-2">{ch.desc}</span>
                    </div>
                    <CheckCircle size={16} className="text-emerald-500 ml-auto flex-shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
            {/* Side-by-side: Instagram + Facebook previews */}
            <div className="flex gap-4 justify-center flex-col">
              <MessagePreview
                channel="instagram"
                message="Hey {{first_name}}! ✨ Exclusive VIP deal — 15% off + free shipping just for you. Tap to grab it! 🛍️"
              />
              <MessagePreview
                channel="facebook"
                message="Hi {{first_name}}! 🎉 Special offer — 20% off on your next order. Limited time only. Click below to claim!"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust / Integrations Row ── */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Works with your existing stack</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {['Salesforce', 'HubSpot', 'Shopify', 'Razorpay', 'Segment', 'Mixpanel', 'Twilio', 'Sendgrid'].map((brand) => (
              <span key={brand} className="text-sm font-bold text-slate-700 tracking-tight">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Teaser ── */}
      <section className="py-20 lg:py-28 relative border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-text-darkSecondary">Start free, scale as you grow. No surprise fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: '₹0',
                period: '/month',
                desc: 'For small teams getting started',
                features: ['Up to 5,000 contacts', '3 AI missions/month', 'WhatsApp + Email', 'Basic analytics'],
                cta: 'Start Free',
                highlight: false,
              },
              {
                name: 'Growth',
                price: '₹4,999',
                period: '/month',
                desc: 'For scaling marketing teams',
                features: ['Up to 50,000 contacts', 'Unlimited AI missions', 'All channels', 'Advanced analytics', 'Priority support'],
                cta: 'Start Trial',
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                desc: 'For large-scale operations',
                features: ['Unlimited contacts', 'Custom AI models', 'Dedicated CSM', 'SLA & compliance', 'White-label option'],
                cta: 'Contact Sales',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-primary-indigo/20 to-primary-violet/20 border-primary-blue/30 shadow-glow scale-[1.02]'
                    : 'glass-dark border-white/10 hover:border-white/20 hover:shadow-premium'
                }`}
              >
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.highlight ? 'text-primary-blue' : 'text-text-darkSecondary'}`}>{plan.name}</div>
                <div className={`text-3xl font-extrabold mb-0.5 ${plan.highlight ? 'text-white' : 'text-white'}`}>
                  {plan.price}<span className={`text-sm font-medium ${plan.highlight ? 'text-white/60' : 'text-white/40'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-5 ${plan.highlight ? 'text-white/80' : 'text-text-darkSecondary'}`}>{plan.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={15} className={plan.highlight ? 'text-primary-blue' : 'text-primary-violet'} />
                      <span className={plan.highlight ? 'text-white' : 'text-text-darkSecondary'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/app/opportunities')}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    plan.highlight
                      ? 'bg-primary-blue text-white hover:bg-primary-indigo'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary-indigo/30 via-primary-blue/20 to-primary-violet/30 relative overflow-hidden border-y border-white/10">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-grid-white" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 glass-dark border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide">
            <Clock size={12} className="text-primary-blue" /> Setup in under 5 minutes
          </div>
          <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-5 leading-tight">
            Ready to 10x your<br />campaign ROI?
          </h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            Join 850+ brands using Catalyst to drive growth with AI-powered CRM automation. Free to start, no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/app/opportunities')}
              className="flex items-center justify-center gap-2 bg-white text-primary-indigo font-extrabold px-10 py-4 rounded-xl text-base transition-all shadow-glow hover:scale-[1.03] active:scale-[0.98]"
            >
              Launch Your First Campaign <ArrowRight size={18} />
            </button>
            <button
              className="flex items-center justify-center gap-2 glass-dark border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:bg-white/10"
            >
              <TrendingUp size={16} /> View Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">CATALYST</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
                The AI-powered CRM automation platform built for modern marketing teams.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Resources', links: ['Docs', 'API Reference', 'Blog', 'Status'] },
              { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs">© 2025 Catalyst AI. All rights reserved.</span>
            <div className="flex items-center gap-1 text-xs">
              <Shield size={12} className="text-emerald-400" />
              <span>SOC 2 Certified · GDPR Ready · 99.9% SLA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
