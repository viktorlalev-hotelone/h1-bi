# HotelOne BI Analytics Web App

A comprehensive business intelligence dashboard for hotel management with advanced analytics, KPI tracking, and financial reporting.

## Features

- **Dashboard Overview**: Real-time KPI cards with revenue, occupancy, and performance metrics
- **Revenue Analytics**: Monthly performance tracking with budget vs actual comparisons
- **Financial Charts**: Account payables/receivables, aging analysis, and operational metrics
- **Rooms Analytics**: Detailed room performance, pickup analysis, and occupancy tracking
- **Unified Analytics**: Consolidated analysis across companies, segments, channels, and more
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Charts**: ECharts and Recharts integration for rich visualizations

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: ECharts, Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── index.css           # Global styles
```

## Key Components

- **KPICard**: Displays key performance indicators with comparisons
- **RevenuePerformanceWidget**: Monthly revenue tracking with forecasts
- **FinancialChartsSection**: Financial analysis charts
- **UnifiedTop10Analysis**: Consolidated analytics across multiple dimensions
- **RoomsKPITable**: Detailed room performance metrics
- **FilterStrip**: Advanced filtering and period selection

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Configuration

The app uses localStorage for:
- Hotel selection preferences
- Campaign/period configurations
- User settings (currency, VAT, commissions)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Private - All rights reserved