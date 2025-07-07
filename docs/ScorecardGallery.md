# ScorecardGallery Component

The `ScorecardGallery` component provides a comprehensive modal interface for viewing supplier/contractor performance scorecards with interactive visualizations and PDF generation capabilities.

## Features

### 📊 **Radar Chart Visualization**
- **KPI vs Targets**: Visual radar chart showing actual performance vs target values
- **Interactive Legend**: Toggle between actual and target values
- **Dynamic Scaling**: Automatically adjusts scale based on metric types

### 📈 **Performance Analytics**
- **Overall Score**: Weighted performance score with trend indicators
- **Period Comparison**: Quarter-over-quarter performance tracking
- **Trend Analysis**: Line charts showing performance over time
- **KPI Breakdown**: Bar charts for individual metric analysis

### 🤖 **AI-Powered Insights**
- **Generate PDF Brief**: Calls `generate_kpi_summary()` from KPI collector service
- **AI Summary**: OpenAI-generated performance analysis and recommendations
- **Automated Reporting**: Professional PDF reports with charts and insights

### 🎨 **Interactive Interface**
- **Modal Dialog**: Large format view with responsive design
- **Tabbed Layout**: Organized sections for Overview, Radar, Trends, and Details
- **Period Selection**: Filter data by quarter/period
- **Status Indicators**: Color-coded performance status badges

## Usage

### Basic Implementation

```tsx
import ScorecardGallery from '@/components/procurement/ScorecardGallery';

// Simple button trigger
<ScorecardGallery 
  companyId="company-uuid"
  companyName="Company Name"
/>

// Custom trigger element
<ScorecardGallery 
  companyId="company-uuid"
  companyName="Company Name"
  trigger={
    <Button variant="outline">
      View Performance Scorecard
    </Button>
  }
/>
```

### Integration with CompanyProfile

```tsx
import ScorecardGallery from '@/components/procurement/ScorecardGallery';

const CompanyProfile = ({ company }) => {
  return (
    <div>
      {/* Other company info */}
      
      <ScorecardGallery 
        companyId={company.id}
        companyName={company.name}
        trigger={
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Detailed Scorecard
          </Button>
        }
      />
    </div>
  );
};
```

## API Interface

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `companyId` | `string` | Yes | Company UUID for data fetching |
| `companyName` | `string` | Yes | Company name for display |
| `trigger` | `React.ReactNode` | No | Custom trigger element (default: button) |

### Data Dependencies

The component relies on the following APIs:

1. **Performance API** (`/lib/api/performance.ts`)
   - `getCompanyScorecard(companyId, period)`
   - `getKPITemplates()`
   - `getAvailablePeriods()`

2. **KPI Collector Service** (`http://localhost:3001`)
   - `POST /generate-summary/:companyId/:period`

3. **PDF Service** (`/api/generate-pdf`)
   - `POST /api/generate-pdf`

## Component Structure

### Tabs Overview

#### 1. Overview Tab
- **Overall Performance Score**: Large display with trend indicators
- **KPI Summary Grid**: Cards showing key metrics with status indicators
- **Quick Stats**: Current vs previous period comparison

#### 2. KPI Radar Tab
- **Radar Chart**: Multi-axis visualization of KPIs vs targets
- **Interactive Legend**: Toggle actual vs target values
- **Responsive Design**: Adjusts to container size

#### 3. Trends Tab
- **Performance Trends**: Line chart of overall scores over time
- **KPI Breakdown**: Bar chart comparing actual vs target for each metric
- **Historical Data**: Last 4 quarters of performance data

#### 4. Details Tab
- **Individual KPI Cards**: Detailed view of each metric
- **Metadata Display**: Weight, direction, source, description
- **Notes and Context**: Additional context for each KPI

## Data Processing

### Radar Chart Data Transformation

```typescript
interface RadarDataPoint {
  metric: string;      // Human-readable metric name
  value: number;       // Actual KPI value
  target: number;      // Target value for the metric
  maxValue: number;    // Maximum scale value
}

// Transform KPI data for radar chart
const getRadarData = (): RadarDataPoint[] => {
  return scorecard.kpis.map(kpi => {
    const template = kpiTemplates.find(t => t.metric === kpi.metric);
    
    // Calculate appropriate targets and scales
    let target = 100;
    let maxValue = 100;
    
    switch (kpi.metric) {
      case 'safety_incidents':
        target = 0;  // Zero incidents target
        maxValue = Math.max(10, kpi.value * 2);
        break;
      case 'defect_rate':
        target = 5;  // 5% or less target
        maxValue = Math.max(50, kpi.value * 2);
        break;
      default:
        target = 95; // 95% or better for positive metrics
        maxValue = 100;
    }
    
    return {
      metric: formatMetricName(kpi.metric),
      value: kpi.value,
      target,
      maxValue
    };
  });
};
```

### Performance Status Calculation

```typescript
const getKpiStatus = (kpi: PerformanceKPI, template?: KPITemplate) => {
  if (!template) return 'neutral';
  
  const isGoodDirection = template.target_direction === 'up' 
    ? kpi.value >= 80 
    : kpi.value <= 20;
  
  if (isGoodDirection) return 'good';
  if (template.target_direction === 'up' ? kpi.value >= 60 : kpi.value <= 40) 
    return 'warning';
  return 'poor';
};
```

## PDF Generation

### Workflow

1. **User Clicks "Generate PDF Brief"**
2. **Call KPI Collector Service**:
   ```typescript
   const summaryResponse = await fetch(
     `http://localhost:3001/generate-summary/${companyId}/${selectedPeriod}`,
     { method: 'POST' }
   );
   ```

3. **Call PDF Service**:
   ```typescript
   const pdfResponse = await fetch('/api/generate-pdf', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       type: 'performance-brief',
       data: {
         companyName,
         period: selectedPeriod,
         summary,        // AI-generated summary
         scorecard,      // Performance data
         radarData,      // Chart data
         trendData       // Historical trends
       }
     })
   });
   ```

4. **Download PDF**: Automatically triggers browser download

### PDF Content Structure

- **Header**: Company name and period
- **Executive Summary**: Overall score and key highlights
- **KPI Section**: Individual metric breakdown
- **AI Analysis**: GPT-4 generated insights and recommendations
- **Trends**: Historical performance data
- **Footer**: Generation timestamp and branding

## Styling and Theming

### Color Coding

- **Good Performance**: Green (`text-green-600`, `bg-green-100`)
- **Warning Performance**: Yellow (`text-yellow-600`, `bg-yellow-100`)
- **Poor Performance**: Red (`text-red-600`, `bg-red-100`)
- **Neutral/Unknown**: Blue (`text-blue-600`, `bg-blue-100`)

### Responsive Design

- **Desktop**: Full 6xl modal with multi-column layouts
- **Tablet**: Stacked layouts with maintained functionality
- **Mobile**: Single-column with optimized touch targets

## Error Handling

### Loading States
- **Skeleton Loading**: Spinner while fetching data
- **Empty States**: Helpful messages when no data available
- **Error Boundaries**: Graceful degradation on API failures

### Fallbacks
- **Missing Data**: Shows "N/A" or default values
- **API Failures**: Toast notifications with error messages
- **PDF Generation**: Disables button and shows error state

## Performance Considerations

### Data Fetching
- **Lazy Loading**: Data only loads when modal opens
- **Caching**: 5-minute stale time for performance data
- **Batch Requests**: Efficient API usage with parallel requests

### Chart Rendering
- **Responsive Containers**: Charts scale with container size
- **Optimized Re-renders**: Memoized data transformations
- **Progressive Loading**: Charts render as data becomes available

## Accessibility

### Keyboard Navigation
- **Modal Focus**: Proper focus management for modal dialog
- **Tab Order**: Logical tab sequence through interface
- **Escape Key**: Closes modal on ESC key press

### Screen Readers
- **ARIA Labels**: Descriptive labels for charts and interactive elements
- **Semantic HTML**: Proper heading hierarchy and landmark roles
- **Status Announcements**: Loading and error state announcements

## Dependencies

### Required Packages
- `recharts`: Chart visualization library
- `lucide-react`: Icon components
- `@/components/ui/*`: UI component library (shadcn/ui)
- `@/lib/api/performance`: Performance data API client

### Optional Enhancements
- `puppeteer`: For real PDF generation
- `jspdf`: Alternative PDF generation
- `@react-pdf/renderer`: React-based PDF components

## Future Enhancements

### Planned Features
- **Export Options**: Excel, CSV export capabilities
- **Custom Periods**: Support for custom date ranges
- **Comparison Mode**: Side-by-side company comparisons
- **Real-time Updates**: Live data refresh capabilities
- **Advanced Filters**: Filter by metric categories or performance thresholds

### Integration Opportunities
- **Email Integration**: Send PDF reports via email
- **Calendar Integration**: Schedule automated report generation
- **Notification System**: Alerts for performance threshold breaches
- **Dashboard Widgets**: Embedded scorecard summary views
