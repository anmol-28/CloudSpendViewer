# CloudSpendViewer - Project Deliverables

## 1. Source Code

**GitHub Repository:** https://github.com/anmol-28/CloudSpendViewer

The complete source code is available in this repository.

---

## 2. How to Run the Application

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anmol-28/CloudSpendViewer.git
   cd CloudSpendViewer
   ```

2. **Navigate to the project directory:**
   ```bash
   cd root
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - The application will be available at `http://localhost:5173` (or the port shown in terminal)
   - The app will automatically reload when you make changes

### Build for Production

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

---

## 3. Tech Stack Used

### Frontend Framework & Build Tools
- **React 19.2.0** - Modern UI library with latest features
- **Vite (Rolldown)** - Fast build tool and development server
- **JavaScript (ES6+)** - Modern JavaScript with modules

### Development Tools
- **ESLint** - Code linting and quality checks
- **PropTypes** - Runtime type checking for React props

### Styling
- **Custom CSS** - Vanilla CSS with CSS variables for theming
- **Responsive Design** - Mobile-first approach with media queries

### Data Management
- **React Hooks** - useState, useEffect, useMemo, useCallback for state management
- **Custom Hooks** - useSpendData for centralized data logic
- **Static JSON** - Data served from `/public/data/spend.json`

### Key Libraries
- `react` & `react-dom` - Core React libraries
- `prop-types` - Type validation
- `@vitejs/plugin-react` - React support for Vite

---

## 4. Assumptions Made

### Data Structure
- The spend data is provided as a static JSON file in `/public/data/spend.json`
- Each record contains: `_id`, `date`, `service`, `team`, `env`, `cost_usd`, and provider-specific fields (`aws_*` or `gcp_*`)
- Provider is determined by the presence of `aws_account_id` (AWS) or `gcp_project_id` (GCP)

### Business Logic
- Date filtering supports both full dates (YYYY-MM-DD) and month-only (YYYY-MM) formats
- Valid year range is 2000-2025 for date filtering
- Cost values are in USD and displayed with 2 decimal places
- Default sorting is by date in descending order (newest first)

### User Experience
- Users want to see summary metrics at a glance (total spend, provider count, record count)
- Pagination is necessary for large datasets (default 10 rows per page)
- Users need to filter by cloud provider, team, environment, and date
- Row details should be accessible via click interaction
- The application should work without a backend server (static hosting)

### Technical Assumptions
- Modern browser support (ES6+, CSS Grid, Flexbox)
- No authentication/authorization required
- No real-time data updates (manual refresh via button)
- Client-side filtering and sorting is sufficient for the dataset size
- No data persistence needed (filters reset on page reload)

---

## 5. What Parts Were Completed

### ✅ Fully Implemented Features

1. **Data Loading & Service Layer**
   - Fetch spend data from static JSON
   - Error handling for failed requests
   - Loading states

2. **Summary Dashboard**
   - Total spend calculation across all providers
   - Provider count display
   - Total records count
   - Real-time updates based on filters

3. **Advanced Filtering System**
   - Cloud provider filter (AWS/GCP)
   - Team filter (Web/Data/Core)
   - Environment filter (prod/staging/dev)
   - Date filter with validation (YYYY-MM-DD or YYYY-MM)
   - Filter reset functionality

4. **Sorting Capabilities**
   - Sort by date (ascending/descending)
   - Sort by cost (ascending/descending)
   - Maintains sort state across filter changes

5. **Data Table with Pagination**
   - Responsive table layout
   - Configurable page size (10/25/50/100)
   - Page navigation (previous/next)
   - Row count display
   - Click-to-view row details

6. **Provider Breakdown Visualization**
   - AWS vs GCP spend comparison
   - Visual bar chart representation
   - Percentage calculations

7. **Row Detail Modal**
   - Detailed view of individual spend records
   - All metadata displayed
   - Close functionality

8. **Responsive Design**
   - Mobile-friendly layout
   - Adaptive table (converts to cards on mobile)
   - Touch-friendly controls

9. **Accessibility Features**
   - ARIA labels and roles
   - Keyboard navigation support
   - Screen reader friendly
   - Semantic HTML

10. **Code Organization**
    - Modular component structure
    - Custom hooks for business logic
    - Utility functions for reusable logic
    - Service layer for data access

---

## 6. What I'd Do Next With More Time

### High Priority Enhancements

1. **Backend Integration**
   - Connect to a real API endpoint instead of static JSON
   - Implement server-side pagination and filtering for better performance
   - Add authentication and user management
   - Real-time data updates via WebSockets or polling

2. **Advanced Analytics**
   - Cost trend charts (line/area charts over time)
   - Month-over-month comparison
   - Cost forecasting based on historical data
   - Anomaly detection for unusual spending patterns
   - Budget alerts and notifications

3. **Export & Reporting**
   - Export filtered data to CSV/Excel
   - Generate PDF reports
   - Scheduled email reports
   - Custom report builder

4. **Enhanced Filtering**
   - Date range picker (from-to dates)
   - Multi-select filters (multiple teams, services)
   - Saved filter presets
   - Advanced search with regex support
   - Cost range filter (min-max)

5. **Data Visualization**
   - Interactive charts using D3.js or Chart.js
   - Pie charts for service breakdown
   - Stacked bar charts for team spending
   - Heat maps for spending patterns
   - Drill-down capabilities

### Medium Priority

6. **Performance Optimization**
   - Implement virtual scrolling for large datasets
   - Add data caching with React Query or SWR
   - Code splitting and lazy loading
   - Service worker for offline support

7. **User Preferences**
   - Save filter preferences to localStorage
   - Customizable dashboard layout
   - Theme customization (dark/light mode toggle)
   - Column visibility controls

8. **Testing**
   - Unit tests with Jest/Vitest
   - Component tests with React Testing Library
   - E2E tests with Playwright or Cypress
   - Visual regression testing

9. **Additional Features**
   - Cost allocation tags
   - Budget management and tracking
   - Cost optimization recommendations
   - Service-level cost breakdown
   - Resource tagging and categorization

### Lower Priority

10. **DevOps & Deployment**
    - CI/CD pipeline setup
    - Docker containerization
    - Kubernetes deployment configs
    - Monitoring and logging integration
    - Performance monitoring (Sentry, DataDog)

11. **Documentation**
    - API documentation
    - Component storybook
    - Architecture diagrams
    - User guide and tutorials

12. **Internationalization**
    - Multi-language support
    - Currency conversion
    - Timezone handling

---

## Project Structure

```
CloudSpendViewer/
├── root/
│   ├── public/
│   │   ├── data/
│   │   │   └── spend.json          # Static spend data
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── FiltersPanel.jsx    # Filter controls
│   │   │   ├── HeaderHero.jsx      # App header
│   │   │   ├── ProviderBreakdown.jsx # AWS vs GCP chart
│   │   │   ├── RowDetail.jsx       # Detail modal
│   │   │   ├── SpendTable.jsx      # Main data table
│   │   │   └── SummaryBar.jsx      # Summary metrics
│   │   ├── hooks/
│   │   │   └── useSpendData.js     # Data management hook
│   │   ├── services/
│   │   │   └── spendService.js     # Data fetching
│   │   ├── utils/
│   │   │   ├── aggregates.js       # Calculation utilities
│   │   │   └── provider.js         # Provider detection
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
├── LICENSE
└── README.md
```

---

## Screenshots

Screenshots of the application UI are available in the repository. Key views include:
- Dashboard with summary metrics
- Filtered data table with pagination
- Provider breakdown visualization
- Row detail modal
- Mobile responsive layout

---

## Contact & Support

For questions or issues, please open an issue on the GitHub repository.

**Repository:** https://github.com/anmol-28/CloudSpendViewer
