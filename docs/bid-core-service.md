# Bid-Core Service Documentation

## Overview

The bid-core service is a comprehensive bidding and procurement management system built on Supabase with PostgreSQL, providing REST & GraphQL APIs with role-based access control and SNS event publishing.

## Architecture

### Database Schema (7 Core Tables)

1. **`bids`** - Main bid process table with timeline, requirements, and evaluation criteria
2. **`submissions`** - Vendor bid submissions with pricing and compliance tracking
3. **`leveling`** - Bid leveling/normalization data with adjustments and recommendations
4. **`scorecards`** - Evaluation scoring matrix with technical and commercial scores
5. **`bafo_requests`** - Best and Final Offer requests and responses
6. **`awards`** - Contract award tracking and vendor acceptance
7. **`bid_events`** - Audit trail and event log for all bid activities

### Role-Based Access Control

#### BID_ADMIN
- **Full access** to all tables and operations
- Can create, read, update, delete all bid-related data
- Can publish bids, manage evaluations, issue awards

#### BID_REVIEWER  
- **Read access** to bids, submissions, awards, events
- **Full access** to leveling and scorecards (evaluation functions)
- Cannot create bids or awards

#### VENDOR
- **Read access** to open/published bids only
- **Create/read access** to their own submissions
- **No access** to internal evaluation data (leveling, scorecards, BAFO, awards, events)
- Internal cost fields are hidden from vendor responses

## API Endpoints

### REST API (`/functions/v1/bid-core-api`)

#### Bids
- `GET /bids` - List bids (filtered by role)
- `GET /bids/{id}` - Get specific bid
- `POST /bids` - Create bid (BID_ADMIN only)
- `PATCH /bids/{id}` - Update bid (BID_ADMIN only)
- `DELETE /bids/{id}` - Delete bid (BID_ADMIN only)

#### Submissions
- `GET /submissions` - List submissions (filtered by role)
- `GET /submissions/{id}` - Get specific submission
- `POST /submissions` - Create submission (VENDOR + BID_ADMIN)
- `PATCH /submissions/{id}` - Update submission

#### Leveling
- `GET /leveling` - List leveling data (BID_ADMIN + BID_REVIEWER)
- `POST /leveling` - Create leveling (BID_ADMIN + BID_REVIEWER)
- `PATCH /leveling/{id}` - Update leveling (BID_ADMIN + BID_REVIEWER)

#### Scorecards
- `GET /scorecards` - List scorecards (BID_ADMIN + BID_REVIEWER)
- `POST /scorecards` - Create scorecard (BID_ADMIN + BID_REVIEWER)
- `PATCH /scorecards/{id}` - Update scorecard (BID_ADMIN + BID_REVIEWER)

#### BAFO Requests
- `GET /bafo-requests` - List BAFO requests (BID_ADMIN + BID_REVIEWER read)
- `POST /bafo-requests` - Create BAFO request (BID_ADMIN only)
- `PATCH /bafo-requests/{id}` - Update BAFO request (BID_ADMIN only)

#### Awards
- `GET /awards` - List awards (BID_ADMIN + BID_REVIEWER read)
- `POST /awards` - Create award (BID_ADMIN only)
- `PATCH /awards/{id}` - Update award (BID_ADMIN only)

#### Events
- `GET /events` - List bid events (BID_ADMIN + BID_REVIEWER read)

### GraphQL API (`/functions/v1/bid-core-graphql`)

Complete GraphQL schema with:
- **Types**: Bid, Submission, Leveling, Scorecard, BafoRequest, Award, BidEvent
- **Queries**: Individual and list queries for all entities
- **Mutations**: Create/update operations with role-based permissions
- **Subscriptions**: Real-time updates via Supabase channels

## SNS Event Publishing

### Supported Events (`/functions/v1/bid-sns-publisher`)

1. **`bid.opened`** - Triggered when bid status changes to 'open'
2. **`bid.leveling.completed`** - Triggered when all leveling is complete
3. **`bid.bafo.requested`** - Triggered when BAFO request is created
4. **`bid.award.issued`** - Triggered when award status changes to 'awarded'

### Event Data Structure
```typescript
{
  topic: string;
  bid_id: string;
  rfp_number: string;
  title: string;
  // Event-specific data...
}
```

## Database Features

### Automatic Triggers
- **Updated_at timestamps** - Auto-updated on record changes
- **Event logging** - Automatic bid_events creation for key state changes
- **SNS publishing** - Automatic event publishing via database triggers

### Row Level Security (RLS)
- All tables have RLS enabled
- Role-based policies enforce access control at database level
- User roles stored in `user_roles` table

### Indexes
- Performance-optimized indexes on frequently queried fields
- Composite indexes for complex queries
- Foreign key indexes for joins

## Frontend Integration

### React Hooks (`src/hooks/useBidCore.ts`)

```typescript
// Basic CRUD operations
const { getBids, createBid, updateBid } = useBidCore();

// Reactive hooks with loading states
const { data: bids, loading, error } = useBids();
const { data: submissions } = useSubmissions(bidId);

// Real-time subscriptions
const events = useBidSubscription(bidId);
const submission = useSubmissionSubscription(submissionId);
```

### TypeScript Types
Complete type definitions in `src/types/bid-core.ts`:
- Entity interfaces (Bid, Submission, etc.)
- Request/response types
- Enum definitions
- SNS event types

## Usage Examples

### Creating a Bid (BID_ADMIN)
```typescript
const bidData = {
  title: "Office Building Construction",
  rfp_number: "RFP-2025-001",
  submission_deadline: "2025-08-01T17:00:00Z",
  estimated_value: 2500000,
  technical_weight: 60,
  commercial_weight: 40
};

const newBid = await createBid(bidData);
```

### Vendor Submission
```typescript
const submissionData = {
  bid_id: "bid-uuid",
  vendor_name: "Construction Corp",
  base_price: 2400000,
  technical_proposal_url: "https://...",
  bond_submitted: true
};

const submission = await createSubmission(submissionData);
```

### Bid Evaluation (BID_REVIEWER)
```typescript
const levelingData = {
  bid_id: "bid-uuid",
  submission_id: "submission-uuid",
  leveled_total_price: 2450000,
  recommended_for_shortlist: true,
  recommendation_notes: "Strong technical proposal"
};

const leveling = await createLeveling(levelingData);
```

## Environment Variables

```bash
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AWS SNS (optional)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
BID_SNS_TOPIC_ARN=arn:aws:sns:region:account:bid-events
```

## Security Features

- **JWT Authentication** - All API calls require valid Supabase JWT
- **Role-based Authorization** - Granular permissions based on user roles
- **Data Isolation** - Vendors only see their own data
- **Audit Trail** - Complete event logging for compliance
- **Field-level Security** - Internal cost fields hidden from vendors

## Deployment

1. **Database Migration**
   ```bash
   supabase db push
   ```

2. **Edge Functions**
   ```bash
   supabase functions deploy bid-core-api
   supabase functions deploy bid-core-graphql
   supabase functions deploy bid-sns-publisher
   ```

3. **Environment Setup**
   - Configure secrets in Supabase dashboard
   - Set up SNS topic in AWS (optional)
   - Configure user roles in `user_roles` table

## Performance Considerations

- **Database Indexes** - Optimized for common query patterns
- **Connection Pooling** - Supabase handles connection management
- **Caching** - Consider implementing Redis for frequently accessed data
- **Pagination** - Large result sets should use limit/offset parameters

## Monitoring & Observability

- **Database Metrics** - Built-in Supabase monitoring
- **Function Logs** - Edge function execution logs
- **Event Tracking** - SNS message delivery metrics
- **Performance Metrics** - Query execution times and response latencies

## Future Enhancements

- **Document Management** - File upload/storage for proposals
- **Advanced Scoring** - Weighted criteria and custom evaluation matrices
- **Workflow Engine** - Automated approval processes
- **Reporting Dashboard** - Analytics and bid performance metrics
- **Mobile API** - Optimized endpoints for mobile applications

## Compliance & Auditing

- **SOX Compliance** - Complete audit trail via bid_events table
- **Data Retention** - Configurable retention policies
- **Export Capabilities** - Data export for legal/audit purposes
- **Change Tracking** - All modifications logged with user attribution
