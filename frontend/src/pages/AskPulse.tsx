import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Search, Sparkles, Bot, ArrowRight, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';

const CATEGORIES = [
  { icon: Users, label: 'Customer Segmentation', prompt: 'What are the best customer segments to target for high ROI?' },
  { icon: Target, label: 'Mission Strategies', prompt: 'Give me a strategy to re-engage dormant VIP customers.' },
  { icon: TrendingUp, label: 'Analytics & ROI', prompt: 'How do I measure the true ROI of my WhatsApp campaigns?' },
  { icon: Lightbulb, label: 'Growth Ideas', prompt: 'What are some out-of-the-box marketing ideas for holiday sales?' },
];

const AskPulse = () => {
  const [query, setQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState<{ query: string; result: string | null; isLoading: boolean } | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setActiveSearch({ query: searchQuery, result: null, isLoading: true });

    try {
      // We pass an empty history since it's a search engine, not a chat
      const response = await axios.post('/api/chat', { message: searchQuery, history: [] });
      setActiveSearch({ query: searchQuery, result: response.data.reply, isLoading: false });
    } catch (error: any) {
      console.error(error);
      setActiveSearch({ 
        query: searchQuery, 
        result: 'Sorry, I encountered an error connecting to the CRM database. Please ensure GROQ_API_KEY is set.', 
        isLoading: false 
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  if (!activeSearch) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center animate-fadeIn px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 shadow-inner">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            CATALYST <span className="text-blue-600">Search</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            The intelligent search engine for your CRM. Ask questions about growth strategies, customer metrics, or anything else.
          </p>
        </div>

        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search CRM data, e.g. 'How do I reduce churn for VIPs?'"
            className="block w-full pl-14 pr-16 py-4 bg-white border border-gray-200 rounded-full text-lg shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all outline-none"
          />
          <button
            onClick={() => handleSearch(query)}
            disabled={!query.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">Suggested Categories</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(cat.prompt)}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <cat.icon className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 text-center">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col animate-fadeIn pb-12">
      {/* Top Search Bar */}
      <div className="sticky top-0 bg-[#fcfcfc] z-10 pt-4 pb-6 border-b border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => { setQuery(''); setActiveSearch(null); }}
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-bold text-xl tracking-tight mr-4">CATALYST</span>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-full text-sm shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
            />
            <button
              onClick={() => handleSearch(query)}
              disabled={!query.trim() || activeSearch.isLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="px-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          {activeSearch.isLoading ? (
             <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
          ) : (
             <Bot className="w-6 h-6 text-blue-600" />
          )}
          <span className="font-medium text-gray-600">Results for</span> "{activeSearch.query}"
        </h2>

        {activeSearch.isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-md animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/2"></div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="prose prose-blue max-w-none prose-p:leading-relaxed prose-headings:font-bold text-gray-800 text-lg">
              <ReactMarkdown>{activeSearch.result || ''}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AskPulse;
