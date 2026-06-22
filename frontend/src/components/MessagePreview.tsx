import React from 'react';
import { CheckCheck, MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, ArrowUp, ChevronDown, Phone, Video, Info, Search, Edit } from 'lucide-react';

/** Renders {{variable}} tokens as styled inline badges */
export function renderWithVars(text: string): React.ReactNode {
  if (!text) return null;
  return text.split(/({{[^}]+}})/g).map((part, i) =>
    /^{{[^}]+}}$/.test(part) ? (
      <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 font-mono text-[10px] font-bold mx-0.5 border border-blue-200 leading-none align-middle">
        {part}
      </span>
    ) : part
  );
}

// ─── iPhone Status Bar ────────────────────────────────────────────────────────
function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? 'text-white' : 'text-[#1a1a1a]';
  return (
    <div className={`flex justify-between items-center px-5 pt-2 pb-1 text-[11px] font-semibold ${c}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="5" width="3" height="7" rx="0.5"/>
          <rect x="4.5" y="3.5" width="3" height="8.5" rx="0.5"/>
          <rect x="9" y="1.5" width="3" height="10.5" rx="0.5"/>
          <rect x="13.5" y="0" width="3" height="12" rx="0.5"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          <path d="M4.93 7.07a4.5 4.5 0 0 1 6.14 0l-1.07 1.07a3 3 0 0 0-4 0L4.93 7.07z"/>
          <path d="M2.1 4.24a8 8 0 0 1 11.8 0L12.83 5.3a6.5 6.5 0 0 0-9.66 0L2.1 4.24z"/>
          <path d="M0 2.1a11 11 0 0 1 16 0L14.93 3.17a9.5 9.5 0 0 0-13.86 0L0 2.1z" opacity="0.3"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
          <rect x="0" y="1" width="21" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35"/>
          <rect x="1.5" y="2.5" width="16" height="7" rx="1"/>
          <path d="M22.5 4.5v3a1.5 1.5 0 0 0 0-3z" opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
function WhatsAppPreview({ text }: { text: string }) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-lg w-full bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <StatusBar />
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2" style={{ background: '#075E54' }}>
        <button className="text-white/80 p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-[#DFD5C3] flex items-center justify-center">
          <span className="text-sm font-bold text-[#075E54]">C</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm leading-tight">Catalyst Offers</div>
          <div className="text-green-200 text-[10px]">online</div>
        </div>
        <div className="flex items-center gap-4 text-white/90">
          <Video size={18} />
          <Phone size={16} />
          <MoreHorizontal size={18} />
        </div>
      </div>

      {/* Chat background */}
      <div
        className="px-3 py-3 min-h-[110px] flex flex-col gap-2"
        style={{
          background: '#E5DDD5',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M 40 0 L 80 0 L 80 40 L 40 40 Z' fill='%23c8b8a2' fill-opacity='0.07'/%3E%3C/svg%3E")`
        }}
      >
        <div className="self-center bg-[#E1F0FA]/80 text-[#4A4A4A] text-[10px] px-3 py-1 rounded-full font-medium shadow-sm">Today</div>

        {/* Business message bubble */}
        <div className="max-w-[82%] self-start">
          <div className="bg-white rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-sm relative">
            {/* tail */}
            <div className="absolute -left-2 top-0 w-2 h-3 overflow-hidden">
              <div className="w-4 h-4 bg-white rounded-full -translate-x-2" />
            </div>
            <p className="text-[#111B21] text-[13px] leading-relaxed">{renderWithVars(text)}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[10px] text-[#667781]">10:42 AM</span>
              <CheckCheck size={14} className="text-[#53BDEB]" />
            </div>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 px-2 py-2 bg-[#F0F0F0]">
        <div className="flex-1 bg-white rounded-full px-4 py-2.5 flex items-center gap-2 shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#8696A0"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
          <span className="text-[12px] text-[#8696A0] flex-1">Message</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#8696A0"><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V22h2v-2.06A9 9 0 0 0 21 11z"/></svg>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00A884' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
  );
}

// ─── Email (Gmail-style) ──────────────────────────────────────────────────────
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
    <div className="rounded-3xl overflow-hidden shadow-lg w-full bg-white border border-slate-200">
      {/* Gmail-style top chrome */}
      <div className="bg-[#F6F8FC] border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm border border-slate-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#5F6368"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span className="text-xs text-[#5F6368] flex-1">mail.catalyst.ai</span>
          <Search size={14} className="text-[#5F6368]" />
        </div>
      </div>

      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        {subject && <h3 className="text-sm font-semibold text-[#202124] mb-3 leading-snug">{renderWithVars(subject)}</h3>}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-bold text-[11px]">C</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#202124]">Catalyst AI</span>
              <span className="text-[10px] text-[#5F6368]">hello@catalyst.ai</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#5F6368]">
              <span>to</span> <span className="font-medium text-[#202124]">{renderWithVars('{{email}}')}</span>
            </div>
          </div>
          <span className="text-[10px] text-[#5F6368] flex-shrink-0">10:42 AM</span>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Brand banner */}
        <div className="rounded-xl overflow-hidden mb-4 bg-gradient-to-r from-brand-600 to-brand-800 px-5 py-3.5 flex items-center justify-between">
          <span className="text-white font-black text-base tracking-wider">CATALYST</span>
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
          </div>
        </div>
        <div className="space-y-2.5">
          {paragraphs.map((line, i) => (
            <p key={i} className="text-[13px] text-[#3C4043] leading-relaxed">{renderWithVars(line)}</p>
          ))}
        </div>
        <div className="mt-5">
          <button className="bg-brand-600 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-brand-700 transition-colors">
            Claim Your Offer →
          </button>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[10px] text-[#9AA0A6] leading-relaxed">
            You're receiving this because you opted in. <span className="text-brand-500 cursor-pointer">Unsubscribe</span> · <span className="text-brand-500 cursor-pointer">Manage preferences</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Instagram DM ─────────────────────────────────────────────────────────────
function InstagramPreview({ text }: { text: string }) {
  const igGradient = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg w-full bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <StatusBar />

      {/* IG header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#DBDBDB]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#262626"><path d="M15.5 3H8.5A5.5 5.5 0 0 0 3 8.5v7A5.5 5.5 0 0 0 8.5 21h7a5.5 5.5 0 0 0 5.5-5.5v-7A5.5 5.5 0 0 0 15.5 3zm3.5 12.5a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 4.5 15.5v-7A3.5 3.5 0 0 1 8 5h7a3.5 3.5 0 0 1 3.5 3.5v7z"/><path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 7a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm4.75-7.75a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0z"/></svg>
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          {/* IG avatar ring */}
          <div className="w-8 h-8 rounded-full p-[1.5px] flex-shrink-0" style={{ background: igGradient }}>
            <div className="w-full h-full rounded-full bg-white p-[1px]">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">C</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[#262626] font-semibold text-[12px] leading-tight">catalyst.ai</div>
            <div className="text-[#8E8E8E] text-[10px]">Active now</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#262626]">
          <Phone size={18} strokeWidth={1.5} />
          <Video size={18} strokeWidth={1.5} />
          <Info size={18} strokeWidth={1.5} />
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white px-4 py-4 min-h-[130px] space-y-3">
        <div className="text-center text-[10px] text-[#8E8E8E] font-medium">Today 10:42 AM</div>

        <div className="flex items-end gap-2">
          {/* small avatar */}
          <div className="w-5 h-5 rounded-full flex-shrink-0 mb-0.5" style={{ background: igGradient }} />
          <div
            className="max-w-[78%] px-4 py-3 rounded-[22px] rounded-bl-[6px] text-[13px] text-[#262626] leading-relaxed"
            style={{ background: '#EFEFEF' }}
          >
            {renderWithVars(text)}
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 pr-1">
          <span className="text-[10px] text-[#8E8E8E]">Seen</span>
          <div className="w-3 h-3 rounded-full" style={{ background: igGradient }} />
        </div>
      </div>

      {/* IG Input */}
      <div className="border-t border-[#DBDBDB] px-3 py-3 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full flex-shrink-0" style={{ background: igGradient }} />
        <div className="flex-1 bg-white border border-[#DBDBDB] rounded-full px-3.5 py-2 text-[12px] text-[#8E8E8E]">Message…</div>
        <div className="flex items-center gap-3 text-[#262626]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" opacity="0.7"/><path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V22h2v-2.06A9 9 0 0 0 21 11z" opacity="0.7"/></svg>
          <Heart size={20} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

// ─── Facebook Messenger ───────────────────────────────────────────────────────
function FacebookPreview({ text }: { text: string }) {
  const messengerGrad = 'linear-gradient(135deg, #0099FF 0%, #A033FF 100%)';

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg w-full bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <StatusBar />

      {/* Messenger header */}
      <div className="px-3 py-2.5 flex items-center gap-2.5 border-b border-[#E4E6EB]">
        <button className="text-[#1877F2] font-semibold text-xs flex items-center gap-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ background: messengerGrad }}>C</div>
        <div className="flex-1">
          <div className="text-[#050505] font-bold text-[13px] leading-tight">Catalyst Business</div>
          <div className="text-[#65676B] text-[10px]">Typically replies instantly · <span className="text-[#1877F2]">See more</span></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center">
            <Phone size={15} className="text-[#1877F2]" />
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center">
            <Video size={15} className="text-[#1877F2]" />
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center">
            <Info size={15} className="text-[#1877F2]" />
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="bg-white px-4 py-4 min-h-[140px] space-y-3">
        <div className="text-center text-[10px] text-[#65676B] font-medium uppercase tracking-wider">Today · 10:42 AM</div>

        <div className="flex items-end gap-2">
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ background: messengerGrad }}>C</div>
          <div className="max-w-[76%]">
            <div className="px-4 py-3 rounded-[18px] rounded-bl-[4px] text-[13px] text-[#050505] leading-relaxed" style={{ background: '#F0F2F5' }}>
              {renderWithVars(text)}
            </div>
          </div>
        </div>

        {/* CTA card */}
        <div className="ml-9 rounded-xl overflow-hidden border border-[#E4E6EB] max-w-[76%]">
          <div className="h-16 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1877F2, #A033FF)' }}>
            <span className="text-white font-black text-base tracking-wide">CATALYST</span>
          </div>
          <div className="px-3 py-2.5 bg-white flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] text-[#65676B]">catalyst.ai</div>
              <div className="text-xs font-semibold text-[#050505]">AI-Powered CRM</div>
            </div>
            <button className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 flex-shrink-0" style={{ color: '#1877F2', borderColor: '#1877F2' }}>
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Messenger input */}
      <div className="border-t border-[#E4E6EB] px-3 py-2.5 flex items-center gap-2">
        <div className="flex gap-2 text-[#1877F2]">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.688 7.193V22l3.36-1.87c.9.25 1.857.386 2.952.386 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm.99 12.437-2.545-2.72-4.97 2.72 5.47-5.82 2.607 2.72 4.906-2.72-5.468 5.82z"/></svg>
        </div>
        <div className="flex-1 bg-[#F0F2F5] rounded-full px-4 py-2 text-[12px] text-[#65676B]">Aa</div>
        <div className="flex gap-2.5 text-[#1877F2]">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/></svg>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
  );
}

// ─── Reddit ───────────────────────────────────────────────────────────────────
function RedditPreview({ text }: { text: string }) {
  const lines = text.split('\n').filter(l => l.trim());
  const title = lines[0] || text;
  const body = lines.slice(1).join(' ') || '';

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg w-full font-sans" style={{ background: '#DAE0E6' }}>
      {/* Reddit app header */}
      <div className="bg-white px-4 py-2.5 flex items-center gap-2 border-b border-[#EDEFF1]">
        <svg viewBox="0 0 20 20" width="22" height="22" fill="#FF4500"><path d="M16.67 10.02c.13-.27.21-.57.21-.88 0-1.16-.94-2.1-2.1-2.1-.56 0-1.07.22-1.44.57-.9-.56-2.09-.93-3.41-.99l.69-3.26 2.24.5c.03.56.5 1.01 1.07 1.01.59 0 1.07-.48 1.07-1.07s-.48-1.07-1.07-1.07c-.44 0-.82.27-.99.65l-2.5-.56c-.06-.02-.13 0-.17.04s-.07.11-.05.17l-.77 3.63c-1.35.04-2.57.41-3.49.98-.38-.36-.89-.58-1.46-.58-1.16 0-2.1.94-2.1 2.1 0 .31.07.61.2.88A2.72 2.72 0 0 0 2 11.85c0 2.77 3.13 5.01 7 5.01s7-2.24 7-5.01c0-.67-.22-1.3-.33-1.83zM6.5 11.5c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm5.56 2.64c-.53.53-1.58.73-2.06.73s-1.53-.2-2.06-.73a.26.26 0 0 1 0-.37.26.26 0 0 1 .37 0c.38.38 1.1.55 1.69.55s1.31-.17 1.69-.55a.26.26 0 0 1 .37 0 .26.26 0 0 1 0 .37zm-.06-1.64c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
        <div className="flex-1 bg-[#F6F7F8] rounded-full px-3 py-1.5 text-[11px] text-[#878A8C] flex items-center gap-1">
          <Search size={11} className="text-[#878A8C]" />
          <span>Search Reddit</span>
        </div>
        <Edit size={18} className="text-[#1C1C1C]" />
      </div>

      {/* Post card */}
      <div className="bg-white mx-2 my-2 rounded-2xl overflow-hidden">
        {/* Subreddit row */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <div className="w-6 h-6 rounded-full bg-[#FF4500] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 20 20" width="14" height="14" fill="white"><path d="M16.67 10.02c.13-.27.21-.57.21-.88 0-1.16-.94-2.1-2.1-2.1-.56 0-1.07.22-1.44.57-.9-.56-2.09-.93-3.41-.99l.69-3.26 2.24.5c.03.56.5 1.01 1.07 1.01.59 0 1.07-.48 1.07-1.07s-.48-1.07-1.07-1.07c-.44 0-.82.27-.99.65l-2.5-.56c-.06-.02-.13 0-.17.04s-.07.11-.05.17l-.77 3.63c-1.35.04-2.57.41-3.49.98-.38-.36-.89-.58-1.46-.58-1.16 0-2.1.94-2.1 2.1 0 .31.07.61.2.88A2.72 2.72 0 0 0 2 11.85c0 2.77 3.13 5.01 7 5.01s7-2.24 7-5.01c0-.67-.22-1.3-.33-1.83z"/></svg>
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold text-[#1C1C1C]">r/deals</span>
            <span className="text-[#878A8C] text-[10px] ml-1.5">• Promoted</span>
          </div>
          <MoreHorizontal size={16} className="text-[#878A8C]" />
        </div>

        <div className="px-4 pb-3">
          <h3 className="text-sm font-bold text-[#1C1C1C] mb-1.5 leading-snug">{renderWithVars(title)}</h3>
          {body && <p className="text-xs text-[#3C3C3C] leading-relaxed mb-3 line-clamp-2">{renderWithVars(body)}</p>}

          {/* Link preview */}
          <div className="border border-[#EDEFF1] rounded-xl overflow-hidden mb-3">
            <div className="h-20 bg-gradient-to-br from-[#FF6314] to-[#FF4500] flex items-center justify-center">
              <span className="text-white font-black text-xl tracking-wider">CATALYST</span>
            </div>
            <div className="px-3 py-2 bg-[#F8F9FA] flex items-center justify-between gap-2">
              <div>
                <div className="text-[9px] text-[#878A8C] uppercase tracking-wide">catalyst.ai</div>
                <div className="text-[11px] font-semibold text-[#1C1C1C]">AI-Powered CRM Platform</div>
              </div>
              <button className="bg-[#FF4500] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex-shrink-0">
                Learn More
              </button>
            </div>
          </div>

          {/* Reddit action bar */}
          <div className="flex items-center gap-1 text-[#878A8C]">
            <div className="flex items-center gap-0.5 bg-[#F6F7F8] rounded-full px-2.5 py-1">
              <ArrowUp size={13} className="text-[#FF4500]" />
              <span className="text-[11px] font-bold text-[#1C1C1C]">2.4k</span>
              <ChevronDown size={11} />
            </div>
            <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full hover:bg-[#F6F7F8]">
              <MessageCircle size={13} /> 342
            </button>
            <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full hover:bg-[#F6F7F8]">
              <Share2 size={13} /> Share
            </button>
            <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full hover:bg-[#F6F7F8] ml-auto">
              <Bookmark size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Channel metadata ─────────────────────────────────────────────────────────
const channelMeta: Record<string, { label: string; color: string; bg: string }> = {
  whatsapp:  { label: 'WhatsApp',            color: '#25D366', bg: '#F0FDF4' },
  email:     { label: 'Email',               color: '#2563EB', bg: '#EFF6FF' },
  sms:       { label: 'SMS',                 color: '#F59E0B', bg: '#FFFBEB' },
  instagram: { label: 'Instagram DM',        color: '#E1306C', bg: '#FFF0F6' },
  facebook:  { label: 'Facebook Messenger',  color: '#1877F2', bg: '#EFF6FF' },
  reddit:    { label: 'Reddit Sponsored',    color: '#FF4500', bg: '#FFF4F0' },
};

const knownChannels = ['whatsapp', 'email', 'sms', 'instagram', 'facebook', 'reddit'];

// ─── Main export ──────────────────────────────────────────────────────────────
interface MessagePreviewProps {
  channel: string;
  message: string;
  label?: string;
}

export default function MessagePreview({ channel, message, label }: MessagePreviewProps) {
  const ch = channel.toLowerCase();
  const meta = channelMeta[ch] || channelMeta['email'];
  if (!message) return null;

  return (
    <div className="space-y-2.5">
      {/* Channel badge */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
        style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}25` }}
      >
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: meta.color }} />
        {label || meta.label} — Live Preview
      </div>

      {/* Preview */}
      <div className="w-full">
        {ch === 'whatsapp'  && <WhatsAppPreview  text={message} />}
        {ch === 'email'     && <EmailPreview      text={message} />}
        {ch === 'instagram' && <InstagramPreview  text={message} />}
        {ch === 'facebook'  && <FacebookPreview   text={message} />}
        {ch === 'reddit'    && <RedditPreview      text={message} />}
        {!knownChannels.includes(ch) && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 leading-relaxed">
            {renderWithVars(message)}
          </div>
        )}
      </div>
    </div>
  );
}
