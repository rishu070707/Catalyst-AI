import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import MissionPlanner from './pages/MissionPlanner';
import Missions from './pages/Missions';
import OpportunityCenter from './pages/OpportunityCenter';
import Segments from './pages/Segments';
import Customers from './pages/Customers';
import CustomerProfile from './pages/CustomerProfile';
import AskPulse from './pages/AskPulse';
import Analytics from './pages/Analytics';
import MissionDetail from './pages/MissionDetail';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Landing page at root */}
          <Route path="/" element={<LandingPage />} />

          {/* CRM App — all nested under Layout with /app prefix */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<OpportunityCenter />} />
            <Route path="opportunities" element={<OpportunityCenter />} />
            <Route path="planner" element={<MissionPlanner />} />
            <Route path="missions" element={<Missions />} />
            <Route path="missions/:id" element={<MissionDetail />} />
            <Route path="segments" element={<Segments />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerProfile />} />
            <Route path="ask" element={<AskPulse />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
