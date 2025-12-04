# CloudSpendViewer

A Cloud cost intelligence platform to help companies understand and optimize their AWS/GCP spend.

## 🚀 How to Run the App

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anmol-28/CloudSpendViewer.git
cd CloudSpendViewer
```

2. Navigate to the project directory:
```bash
cd root
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **React 19.2.0** - Modern UI library
- **Vite (Rolldown)** - Fast build tool and dev server
- **JavaScript (ES6+)** - Modern JavaScript with modules
- **Custom CSS** - Responsive design with CSS variables
- **React Hooks** - useState, useEffect, useMemo, useCallback
- **PropTypes** - Runtime type checking

## 📋 Assumptions Made

### Data
- Spend data is served from static JSON (`/public/data/spend.json`)
- Provider determined by `aws_account_id` or `gcp_project_id` fields
- Cost values are in USD

### Business Logic
- Date filtering supports YYYY-MM-DD or YYYY-MM formats
- Valid year range: 2000-2025
- Default sorting: date descending (newest first)

### User Experience
- Client-side filtering/sorting sufficient for dataset size
- No authentication required
- Manual refresh via button (no real-time updates)
- Modern browser support (ES6+, CSS Grid, Flexbox)

## ✅ Completed Features

- **Data Loading** - Fetch from JSON with error handling
- **Summary Dashboard** - Total spend, provider count, record count
- **Advanced Filtering** - Cloud provider, team, environment, date
- **Sorting** - By date or cost (ascending/descending)
- **Pagination** - Configurable page size (10/25/50/100)
- **Provider Breakdown** - AWS vs GCP visualization
- **Row Details** - Click-to-view modal with full record info
- **Responsive Design** - Mobile-friendly adaptive layout
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support

## 🔮 Future Enhancements

### High Priority
- **Backend Integration** - Real API, authentication, real-time updates
- **Advanced Analytics** - Trend charts, forecasting, anomaly detection
- **Export & Reporting** - CSV/Excel export, PDF reports
- **Enhanced Filtering** - Date ranges, multi-select, saved presets
- **Data Visualization** - Interactive charts (D3.js/Chart.js)

### Medium Priority
- **Performance** - Virtual scrolling, caching, code splitting
- **User Preferences** - Save filters, customizable dashboard
- **Testing** - Unit, component, E2E tests
- **Additional Features** - Budget tracking, cost optimization tips

### Lower Priority
- **DevOps** - CI/CD, Docker, monitoring
- **Documentation** - API docs, Storybook
- **i18n** - Multi-language, currency conversion

## 📁 Project Structure

```
root/
├── public/data/spend.json
├── src/
│   ├── components/      # UI components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Data fetching
│   ├── utils/           # Helper functions
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 📄 License

See LICENSE file for details.

## 🔗 Repository

https://github.com/anmol-28/CloudSpendViewer
