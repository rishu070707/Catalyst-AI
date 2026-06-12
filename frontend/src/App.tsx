import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import OpportunityCenter from './pages/OpportunityCenter';

const queryClient = new QueryClient();

// Placeholder pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full">
    <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<OpportunityCenter />} />
            <Route path="planner" element={<Placeholder title="Mission Planner" />} />
            <Route path="control" element={<Placeholder title="Mission Control" />} />
            <Route path="customers" element={<Placeholder title="Customers" />} />
            <Route path="ask" element={<Placeholder title="Ask Catalyst" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
