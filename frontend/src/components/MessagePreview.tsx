import React from 'react';
import { CheckCheck, Mail, Smartphone, Zap, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, Share2, ArrowUp, ChevronDown } from 'lucide-react';

/** Splits text on {{variable}} tokens and renders each variable as a styled badge */
export function renderWithVars(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/({{[^}]+}})/g);
  return parts.map((part, i) =>
    /^{{[^}]+}}$/.test(part) ? (
      <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono text-[10px] font-bold mx-0.5 border border-blue-200">
        {part}
      </span>
    ) : part
  );
}

// ─── WhatsApp ────────────────────────────────────────────────────────────────
function WhatsAppPreview({ text }: { text: string }) {
  return (
    <div className="bg-[#ECE5DD] rounded-2xl overflow-hidden shadow-md w-full">
      <div className="bg-[#128C7E] px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">C</div>
        <div>
          <div className="text-white font-semibold text-sm leading-none">Catalyst</div>
          <div className="text-green-200 text-[10px] mt-0.5">Business Account</div>
        </div>
        <div className="ml-auto flex gap-1">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60" />)}
        </div>
      </div>
      <div className="px-4 py-4 min-h-[120px]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b8a2' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
        <div className="max-w-[88%]">
          <div className="bg-white rounded-xl rounded-tl-none shadow-sm px-4 py-3">
            <p className="text-slate-800 text-sm leading-relaxed">{renderWithVars(text)}</p>
            <div className="flex items-center justify-end gap-1 mt-1.5">
              <span className="text-[10px] text-slate-400">10:42 AM</span>
              <CheckCheck size={14} className="text-[#53BDEB]" />
            </div>
          </div>
          <div className="w-3 h-3 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
        </div>
      </div>
      <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2 border-t border-slate-200">
        <div className="flex-1 bg-white rounded-full px-4 py-1.5 text-xs text-slate-400">Type a message</div>
        <div className="w-8 h-8 rounded-full bg-[#128C7E] flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
      </div>
    </div>
  );
}

// ─── Email ───────────────────────────────────────────────────────────────────
function EmailPreview({ text }: { text: string }) {
  let subject = '';
  let body = text;
  if (text.toLowerCase().includes('subject:')) {
    const lines = text.split('\n');
    const idx = lines.findIndex(l => l.toLowerCase().startsWith('subject:'));
    if (idx !== -1) {
      subject = lines[idx].replace(/^subject:\s*/i, '');
      body = lines.slice(idx + 1).join('\n').trim();
    }
  }
  const paragraphs = body.split('\n').filter(l => l.trim() !== '');

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 w-full">
      <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
        <div className="flex gap-1.5">
          {['bg-red-400','bg-yellow-400','bg-green-400'].map(c => <div key={c} className={`w-3 h-3 rounded-full ${c}`} />)}
        </div>
        <div className="flex-1 ml-3 bg-white rounded px-2 py-0.5 text-[10px] text-slate-400 border border-slate-200">mail.catalyst.ai</div>
      </div>
      <div className="px-4 py-3 border-b border-slate-100 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-12 shrink-0">FROM</span>
          <span className="text-xs font-semibold text-slate-800">Catalyst AI &lt;hello@catalyst.ai&gt;</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-12 shrink-0">TO</span>
          <span className="text-xs text-slate-600">{renderWithVars('{{email}}')}</span>
        </div>
        {subject && (
          <div className="flex items-start gap-2">
            <span className="text-[10px] text-slate-400 w-12 shrink-0">SUBJECT</span>
            <span className="text-xs font-semibold text-slate-900 leading-snug">{renderWithVars(subject)}</span>
          </div>
        )}
      </div>
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg px-5 py-4 mb-4 flex items-center justify-between">
          <span className="text-white font-extrabold text-base tracking-tight">CATALYST</span>
          <Mail size={18} className="text-white/70" />
        </div>
        <div className="space-y-2">
          {paragraphs.map((line, i) => (
            <p key={i} className="text-sm text-slate-700 leading-relaxed">{renderWithVars(line)}</p>
          ))}
        </div>
        <div className="mt-5">
          <button className="bg-blue-600 text-white text-xs font-bold px-6 py-2.5 rounded-lg">
            {renderWithVars('{{cta_link}}')} →
          </button>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            You&apos;re receiving this because you opted in at {renderWithVars('{{store_name}}')}. <a href="#" className="text-blue-400 ml-1">Unsubscribe</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SMS ─────────────────────────────────────────────────────────────────────
function SMSPreview({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 w-full">
      <div className="bg-slate-900 px-4 py-1.5 flex items-center justify-between">
        <span className="text-white text-[10px] font-medium">9:41</span>
        <div className="flex gap-1.5 items-center">
          <div className="flex gap-0.5">
            {[1,2,3,4].map(i => <div key={i} className="w-0.5 h-2.5 bg-white rounded-full" style={{ opacity: i <= 3 ? 1 : 0.3 }} />)}
          </div>
          <Smartphone size={10} className="text-white" />
        </div>
      </div>
      <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-2 border-b border-slate-200">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">C</span>
        </div>
        <div>
          <div className="text-slate-900 font-semibold text-xs">CATALYST</div>
          <div className="text-slate-500 text-[10px]">Business Message</div>
        </div>
      </div>
      <div className="bg-slate-50 p-4 min-h-[100px]">
        <div className="max-w-[85%] bg-slate-200 rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-slate-900 text-sm leading-relaxed">{renderWithVars(text)}</p>
          <div className="text-[10px] text-slate-500 mt-1">Now</div>
        </div>
      </div>
      <div className="border-t border-slate-200 px-3 py-2.5 flex items-center gap-2">
        <div className="flex-1 bg-slate-100 rounded-full px-3 py-1.5 text-[11px] text-slate-400">iMessage</div>
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Zap size={10} className="text-white" />
        </div>
      </div>
    </div>
  );
}

// ─── RCS ─────────────────────────────────────────────────────────────────────
function RCSPreview({ text }: { text: string }) {
  const sections: Record<string, string> = {};
  text.split('\n\n').forEach(block => {
    const colon = block.indexOf(':');
    if (colon !== -1) {
      sections[block.slice(0, colon).trim().toLowerCase()] = block.slice(colon + 1).trim();
    }
  });
  const headline = sections['headline'] || '';
  const body = sections['body'] || text;
  const cta = sections['cta'] || 'Shop Now';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 w-full">
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 p-5">
        <div className="text-[10px] font-bold text-purple-200 uppercase tracking-widest mb-2">RCS Rich Card</div>
        {headline && <h3 className="text-white font-bold text-lg leading-tight">{renderWithVars(headline)}</h3>}
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-700 leading-relaxed">{renderWithVars(body)}</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-purple-600 text-white text-xs font-bold py-2.5 rounded-lg">{renderWithVars(cta)}</button>
          <button className="border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-lg">Learn More</button>
        </div>
        <div className="text-[10px] text-slate-400 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          Delivered via RCS
        </div>
      </div>
    </div>
  );
}

// ─── Push Notification ───────────────────────────────────────────────────────
function PushPreview({ text }: { text: string }) {
  const firstLine = text.split('\n')[0] || text;
  const rest = text.split('\n').slice(1).join(' ') || '';
  return (
    <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-md w-full p-3">
      <div className="text-white/40 text-[10px] text-center mb-3 font-medium">LOCK SCREEN</div>
      <div className="bg-white/10 backdrop-blur rounded-xl overflow-hidden">
        <div className="px-4 py-3 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-bold">CATALYST</span>
              <span className="text-white/40 text-[10px]">now</span>
            </div>
            <p className="text-white text-xs font-semibold leading-snug mt-0.5">{renderWithVars(firstLine)}</p>
            {rest && <p className="text-white/70 text-xs leading-snug mt-0.5 line-clamp-2">{renderWithVars(rest)}</p>}
          </div>
        </div>
        <div className="border-t border-white/10 flex">
          <button className="flex-1 py-2.5 text-xs font-semibold text-white/70 text-center">Dismiss</button>
          <div className="w-px bg-white/10" />
          <button className="flex-1 py-2.5 text-xs font-bold text-blue-400 text-center">Open</button>
        </div>
      </div>
    </div>
  );
}

// ─── Instagram DM ────────────────────────────────────────────────────────────
function InstagramPreview({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 w-full">
      {/* Instagram-style top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        {/* IG gradient avatar */}
        <div
          className="w-8 h-8 rounded-full p-[2px] flex-shrink-0"
          style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <span className="text-xs font-bold bg-gradient-to-br from-orange-400 to-pink-600 bg-clip-text text-transparent">C</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-slate-900 font-semibold text-xs">catalyst.ai</div>
          <div className="text-slate-400 text-[10px]">Active now</div>
        </div>
        {/* IG icons */}
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
          </svg>
          <MoreHorizontal size={16} className="text-slate-700" />
        </div>
      </div>

      {/* Chat area */}
      <div className="px-4 py-4 bg-white min-h-[120px] space-y-3">
        {/* Date stamp */}
        <div className="text-center text-[10px] text-slate-400 font-medium">Today 10:42 AM</div>

        {/* Incoming DM bubble */}
        <div className="flex items-end gap-2">
          <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)' }}>
          </div>
          <div
            className="max-w-[82%] px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-slate-900 leading-relaxed"
            style={{ background: '#F0F0F0' }}
          >
            <p className="text-[13px]">{renderWithVars(text)}</p>
          </div>
        </div>

        {/* Reaction / seen */}
        <div className="flex items-center justify-end gap-1 pr-2">
          <span className="text-[10px] text-slate-400">Seen</span>
          <div className="w-3.5 h-3.5 rounded-full" style={{ background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)' }} />
        </div>
      </div>

      {/* Instagram DM input */}
      <div className="border-t border-slate-100 px-3 py-2.5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)' }} />
        <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-[11px] text-slate-400">Message…</div>
        <div className="flex items-center gap-3">
          {/* Voice + Like */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-500 fill-current"><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V22h2v-2.06A9 9 0 0 0 21 11z"/></svg>
          <Heart size={20} className="text-slate-500" />
        </div>
      </div>
    </div>
  );
}

// ─── Facebook Messenger ──────────────────────────────────────────────────────
function FacebookPreview({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 w-full">
      {/* Messenger header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #0099FF 0%, #A033FF 100%)' }}
      >
        {/* FB Messenger logo-ish */}
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.688 7.193V22l3.36-1.87c.9.25 1.857.386 2.952.386 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm.99 12.437l-2.545-2.72-4.97 2.72 5.47-5.82 2.607 2.72 4.906-2.72-5.468 5.82z"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">Catalyst Business</div>
          <div className="text-blue-100 text-[10px]">Typically replies instantly</div>
        </div>
        <MoreHorizontal size={18} className="text-white/80" />
      </div>

      {/* Chat area */}
      <div className="px-4 py-4 bg-white min-h-[130px] space-y-3">
        <div className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-wider">Today · 10:42 AM</div>

        {/* Incoming bubble */}
        <div className="flex items-end gap-2">
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #0099FF, #A033FF)' }}>C</div>
          <div
            className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-slate-900 leading-relaxed"
            style={{ background: '#F0F2F5' }}
          >
            <p className="text-[13px]">{renderWithVars(text)}</p>
          </div>
        </div>

        {/* CTA button card */}
        <div className="ml-9 border border-slate-200 rounded-xl overflow-hidden max-w-[80%]">
          <div className="h-16 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-tight">CATALYST</span>
          </div>
          <div className="px-3 py-2">
            <button
              className="w-full text-center text-xs font-bold py-1.5 rounded-lg border-2 mt-1"
              style={{ color: '#1877F2', borderColor: '#1877F2' }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Messenger input */}
      <div className="border-t border-slate-100 px-3 py-2.5 flex items-center gap-2">
        <div className="flex gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" style={{ color: '#0099FF' }}><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.688 7.193V22l3.36-1.87c.9.25 1.857.386 2.952.386 5.523 0 10-4.145 10-9.243S17.523 2 12 2z"/></svg>
        </div>
        <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-[11px] text-slate-400">Aa</div>
        <div className="flex gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ color: '#0099FF' }} fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
          <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ color: '#0099FF' }} fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
  );
}

// ─── Reddit Sponsored Post / Ad ──────────────────────────────────────────────
function RedditPreview({ text }: { text: string }) {
  const lines = text.split('\n').filter(l => l.trim());
  const title = lines[0] || text;
  const body = lines.slice(1).join(' ') || '';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 w-full font-sans">
      {/* Reddit-style top bar */}
      <div className="bg-[#FF4500] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" className="w-5 h-5 fill-white">
            <path d="M16.67 10.02c.13-.27.21-.57.21-.88 0-1.16-.94-2.1-2.1-2.1-.56 0-1.07.22-1.44.57-.9-.56-2.09-.93-3.41-.99l.69-3.26 2.24.5c.03.56.5 1.01 1.07 1.01.59 0 1.07-.48 1.07-1.07s-.48-1.07-1.07-1.07c-.44 0-.82.27-.99.65l-2.5-.56c-.06-.02-.13 0-.17.04s-.07.11-.05.17l-.77 3.63c-1.35.04-2.57.41-3.49.98-.38-.36-.89-.58-1.46-.58-1.16 0-2.1.94-2.1 2.1 0 .31.07.61.2.88A2.72 2.72 0 0 0 2 11.85c0 2.77 3.13 5.01 7 5.01s7-2.24 7-5.01c0-.67-.22-1.3-.33-1.83zM6.5 11.5c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm5.56 2.64c-.53.53-1.58.73-2.06.73s-1.53-.2-2.06-.73a.26.26 0 0 1 0-.37.26.26 0 0 1 .37 0c.38.38 1.1.55 1.69.55s1.31-.17 1.69-.55a.26.26 0 0 1 .37 0 .26.26 0 0 1 0 .37zm-.06-1.64c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
          </svg>
          <span className="text-white font-bold text-sm tracking-tight">reddit</span>
        </div>
        <span className="text-white/80 text-[10px] font-semibold border border-white/50 px-2 py-0.5 rounded-full">Promoted</span>
      </div>

      {/* Post content */}
      <div className="p-4">
        {/* Subreddit + author row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#FF4500] flex items-center justify-center">
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-white">
              <path d="M16.67 10.02c.13-.27.21-.57.21-.88 0-1.16-.94-2.1-2.1-2.1-.56 0-1.07.22-1.44.57-.9-.56-2.09-.93-3.41-.99l.69-3.26 2.24.5c.03.56.5 1.01 1.07 1.01.59 0 1.07-.48 1.07-1.07s-.48-1.07-1.07-1.07c-.44 0-.82.27-.99.65l-2.5-.56c-.06-.02-.13 0-.17.04s-.07.11-.05.17l-.77 3.63c-1.35.04-2.57.41-3.49.98-.38-.36-.89-.58-1.46-.58-1.16 0-2.1.94-2.1 2.1 0 .31.07.61.2.88A2.72 2.72 0 0 0 2 11.85c0 2.77 3.13 5.01 7 5.01s7-2.24 7-5.01c0-.67-.22-1.3-.33-1.83z"/>
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">r/catalyst_ai</span>
            <span className="text-slate-400 text-[10px] ml-1.5">• Sponsored</span>
          </div>
        </div>

        {/* Post title */}
        <h3 className="text-sm font-semibold text-slate-900 mb-2 leading-snug">{renderWithVars(title)}</h3>

        {/* Post body */}
        {body && (
          <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">{renderWithVars(body)}</p>
        )}

        {/* Link preview card */}
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
          <div className="h-20 bg-gradient-to-br from-orange-400 via-red-500 to-[#FF4500] flex items-center justify-center">
            <span className="text-white font-extrabold text-lg tracking-tight">CATALYST</span>
          </div>
          <div className="px-3 py-2 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">catalyst.ai</div>
              <div className="text-xs font-semibold text-slate-800 truncate">AI-Powered CRM Automation</div>
            </div>
            <button className="bg-[#FF4500] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex-shrink-0 ml-2">
              Learn More
            </button>
          </div>
        </div>

        {/* Reddit vote + action row */}
        <div className="flex items-center gap-4 text-slate-500">
          {/* Upvote cluster */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-full px-2 py-1">
            <ArrowUp size={14} className="text-[#FF4500]" />
            <span className="text-xs font-bold text-slate-800">2.4k</span>
            <ChevronDown size={12} className="text-slate-400" />
          </div>
          <button className="flex items-center gap-1.5 text-xs font-semibold hover:bg-slate-100 rounded-full px-2 py-1 transition-colors">
            <MessageCircle size={14} />
            <span>342</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold hover:bg-slate-100 rounded-full px-2 py-1 transition-colors">
            <Share2 size={14} />
            <span>Share</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold hover:bg-slate-100 rounded-full px-2 py-1 transition-colors ml-auto">
            <Bookmark size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Channel metadata ────────────────────────────────────────────────────────
const channelMeta: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  whatsapp:  { label: 'WhatsApp',           color: '#25D366', bg: '#F0FDF4', icon: '💬' },
  email:     { label: 'Email',              color: '#2563EB', bg: '#EFF6FF', icon: '📧' },
  sms:       { label: 'SMS',               color: '#F59E0B', bg: '#FFFBEB', icon: '📱' },
  rcs:       { label: 'RCS',               color: '#EC4899', bg: '#FDF4FF', icon: '🃏' },
  push:      { label: 'Push Notification', color: '#8B5CF6', bg: '#F5F3FF', icon: '🔔' },
  instagram: { label: 'Instagram DM',      color: '#E1306C', bg: '#FFF0F6', icon: '📸' },
  facebook:  { label: 'Facebook Messenger',color: '#1877F2', bg: '#EFF6FF', icon: '💬' },
  reddit:    { label: 'Reddit Promoted',   color: '#FF4500', bg: '#FFF4F0', icon: '🔺' },
};

const knownChannels = ['whatsapp','email','sms','rcs','push','instagram','facebook','reddit'];

// ─── Main exported component ──────────────────────────────────────────────────
interface MessagePreviewProps {
  channel: string;
  message: string;
  label?: string;
}

export default function MessagePreview({ channel, message, label }: MessagePreviewProps) {
  const ch = channel.toLowerCase();
  const meta = channelMeta[ch] || channelMeta['sms'];

  if (!message) return null;

  return (
    <div className="space-y-3">
      {/* Channel badge */}
      <div className="flex items-center gap-2">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30` }}
        >
          <span className="text-sm">{meta.icon}</span>
          {label || meta.label} — Message Preview
        </div>
      </div>

      {/* Preview renderer */}
      <div className="w-full">
        {ch === 'whatsapp'  && <WhatsAppPreview  text={message} />}
        {ch === 'email'     && <EmailPreview      text={message} />}
        {ch === 'sms'       && <SMSPreview        text={message} />}
        {ch === 'rcs'       && <RCSPreview        text={message} />}
        {ch === 'push'      && <PushPreview       text={message} />}
        {ch === 'instagram' && <InstagramPreview  text={message} />}
        {ch === 'facebook'  && <FacebookPreview   text={message} />}
        {ch === 'reddit'    && <RedditPreview     text={message} />}
        {!knownChannels.includes(ch) && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 leading-relaxed">
            {renderWithVars(message)}
          </div>
        )}
      </div>
    </div>
  );
}
