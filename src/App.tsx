import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';

// Simple placeholder component for skeleton pages
const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Under Construction</h3>
        <p className="text-gray-600 mb-4">This page is part of the skeleton structure.</p>
        <div className="text-sm text-gray-500">
          Navigation and layout are functional - content coming soon
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explorer/rooms" element={<PlaceholderPage title="Rooms Analytics" description="Detailed room performance metrics and occupancy analysis" />} />
          <Route path="explorer/hotels" element={<PlaceholderPage title="Hotels Performance" description="Multi-hotel performance comparison and analysis" />} />
          <Route path="analytics/blocks" element={<PlaceholderPage title="Blocks Analytics" description="Analyze room blocks, group reservations and pickup rates by company" />} />
          <Route path="analytics/fb-revenue" element={<PlaceholderPage title="F&B Revenue" description="Food & Beverage revenue analysis and performance metrics" />} />
          <Route path="analytics/other-revenue" element={<PlaceholderPage title="Other Revenue" description="Additional revenue streams and ancillary services analysis" />} />
          <Route path="analytics/account-receivables" element={<PlaceholderPage title="Account Receivables" description="Track outstanding payments and customer credit management" />} />
          <Route path="analytics/rooms-out-of-sales" element={<PlaceholderPage title="Rooms out of Sales" description="Monitor rooms unavailable for sale due to maintenance or other reasons" />} />
          <Route path="analytics/cancelations" element={<PlaceholderPage title="Cancelations" description="Track and analyze booking cancellations and patterns" />} />
          <Route path="analytics/companies" element={<PlaceholderPage title="Companies" description="Analyze performance by tour operators and booking companies" />} />
          <Route path="analytics/marketing-segments" element={<PlaceholderPage title="Marketing Segments" description="Guest categories and market segment analysis" />} />
          <Route path="analytics/marketing-sources" element={<PlaceholderPage title="Marketing Sources" description="Primary booking channels and source analysis" />} />
          <Route path="analytics/marketing-channels" element={<PlaceholderPage title="Marketing Channels" description="Specific booking platforms and channel performance" />} />
          <Route path="analytics/guest-nationalities" element={<PlaceholderPage title="Guest Nationalities" description="Analysis by guest countries of origin" />} />
          <Route path="analytics/room-types" element={<PlaceholderPage title="Room Types" description="Performance analysis by accommodation categories" />} />
          <Route path="analytics/guest-mix" element={<PlaceholderPage title="Guest Mix" description="Guest composition and demographic analysis" />} />
          <Route path="analytics/meal-plans" element={<PlaceholderPage title="Meal Plans" description="Dining packages and meal plan performance" />} />
          <Route path="analytics/booking-windows" element={<PlaceholderPage title="Booking Windows" description="Time between booking and stay analysis" />} />
          <Route path="analytics/length-of-stay" element={<PlaceholderPage title="Length of Stay" description="Duration of guest stays analysis" />} />
          <Route path="analytics/days-of-week" element={<PlaceholderPage title="Days of Week" description="Performance analysis by days of the week" />} />
          <Route path="reports/operation-statement" element={<PlaceholderPage title="Operation Statement" description="Monthly Custom P&L Report with detailed financial breakdown" />} />
          <Route path="reports/bob-vs-budget-forecast" element={<PlaceholderPage title="BOB Vs Budget/Forecast" description="Compare Books on Books performance against budget and forecast projections" />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;