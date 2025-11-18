# Crabigator Stats - Claude Development Guide

## Project Context

This is a Next.js application that creates a comprehensive statistics dashboard for WaniKani users. WaniKani is a spaced repetition system (SRS) for learning Japanese radicals, kanji, and vocabulary.

## Core Concepts

### WaniKani SRS Stages

Items progress through 9 SRS stages:
- **0**: Locked (not yet available)
- **1-4**: Apprentice (reviews every 4h, 8h, 1d, 2d)
- **5-6**: Guru (reviews every 1w, 2w)
- **7**: Master (reviews every 1mo)
- **8**: Enlightened (reviews every 4mo)
- **9**: Burned (graduated, no more reviews)

### WaniKani Levels

- Users progress through 60 levels
- Each level contains radicals, kanji, and vocabulary
- Levels unlock when 90% of kanji reach Guru (stage 5+)
- Component subjects must be Guru before dependent subjects unlock

### API Best Practices

**Rate Limiting:**
- 60 requests per minute maximum
- Check `RateLimit-Remaining` and `RateLimit-Reset` headers
- Handle 429 responses with exponential backoff
- Queue requests when approaching limit

**Caching Strategy (IndexedDB):**
1. **Subjects** (radicals, kanji, vocabulary): Cache aggressively - these rarely change
2. **Assignments**: Use `updated_after` filter for incremental updates
3. **Review Statistics**: Use `updated_after` filter for incremental updates
4. **Level Progressions**: Cache and update as needed
5. **User**: Check on each session, light caching
6. **Summary**: Don't cache (changes hourly)

Store `data_updated_at` timestamps to efficiently use `updated_after` query parameter.

**Pagination:**
- Subjects: 1000 items per page
- Other endpoints: 500 items per page
- Use `pages.next_url` to fetch remaining pages

## Technical Architecture

### Tech Stack

- **Framework**: Next.js 16+ with App Router and Turbopack
- **React**: 19+
- **Styling**: Tailwind CSS 4+
- **UI**: shadcn/ui + Magic UI
- **Charts**: Recharts
- **State**: Zustand with persist middleware
- **Database**: IndexedDB (via idb or Dexie.js)
- **TypeScript**: Strict mode enabled

### Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── page.tsx                   # Landing page with API key input
│   └── dashboard/
│       ├── layout.tsx             # Dashboard layout with navigation
│       ├── progress/page.tsx      # Progress tracking and charts
│       └── items/page.tsx         # Items browser
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── charts/                    # Recharts wrappers
│   ├── navigation/                # Dock navigation
│   └── items/                     # Item chips and grids
├── lib/
│   ├── wanikani/
│   │   ├── api.ts                 # API client with rate limiting
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── cache.ts               # IndexedDB operations
│   │   └── queue.ts               # Request queue manager
│   └── utils.ts
├── stores/
│   └── index.ts                   # Zustand stores
└── hooks/                         # Custom React hooks
```

### State Management

Zustand store structure:
```typescript
interface AppState {
  // Auth
  apiKey: string | null;
  storagePreference: 'session' | 'local';
  setApiKey: (key: string, storage: 'session' | 'local') => void;
  clearAuth: () => void;

  // User
  user: User | null;
  setUser: (user: User) => void;

  // Data
  isLoading: boolean;
  lastSync: Date | null;

  // Actions
  fetchAllData: () => Promise<void>;
  refreshData: () => Promise<void>;
}
```

## Key Features

### 1. Landing Page (`/`)

- **API Key Input**: Password field with show/hide toggle
- **Storage Preference**: Radio/toggle for "Session only" vs "Remember me"
- **Validation**: Check `/user` endpoint, verify subscription level
- **Demo Carousel**: Rotating charts with mock data (use Magic UI components)
- **Error Handling**: Toast notifications for invalid keys or insufficient subscription

**Validation Flow:**
1. POST to `/user` with API key
2. Check `subscription.max_level_granted >= 60` (full subscription required)
3. Store token based on preference
4. Redirect to `/dashboard/progress`

### 2. Dashboard Layout

**Navigation (Magic UI Dock):**
- Home (back to landing)
- Progress page
- Items page
- Theme toggle (animated)
- User level badge

**Theme:**
- Light/dark mode support
- System preference default
- Persist in localStorage
- Smooth transitions

### 3. Progress Page (`/dashboard/progress`)

**Stats Cards:**
- Current level
- Time on current level
- Average level-up time (excluding pre-reset data)
- Predicted level-up date
- Total learned/available items

**Level Progression Chart:**
- Historical progression: Line chart of `passed_at` from level_progressions
- Projected progression: Dashed line based on average pace
- Handle resets: Only show post-reset data

**Calculations:**
```typescript
// Average level-up time (excluding resets)
const levelTimes = levelProgressions
  .filter(lp => lp.data.passed_at && lp.data.started_at)
  .filter(lp => !isBeforeReset(lp, latestReset))
  .map(lp => new Date(lp.data.passed_at) - new Date(lp.data.started_at));
const avgTime = levelTimes.reduce((a, b) => a + b, 0) / levelTimes.length;

// Predicted level-up
const timeOnCurrentLevel = Date.now() - new Date(currentLevelStart);
const predictedDate = new Date(Date.now() + (avgTime - timeOnCurrentLevel));
```

### 4. Items Page (`/dashboard/items`)

**View Modes:**
- By Type (Radicals/Kanji/Vocabulary)
- By Level (1-60)
- By SRS Stage

**Display:**
- Responsive grid of chips
- Character display (or radical image for non-UTF8)
- Color coding by SRS stage:
  - Locked: Gray
  - Apprentice: Pink/Red
  - Guru: Purple
  - Master: Blue
  - Enlightened: Cyan
  - Burned: Gold
- Border color by type:
  - Radicals: Blue
  - Kanji: Pink
  - Vocabulary: Purple

**Interactions:**
- Hover tooltips with meanings, readings, SRS stage, next review, accuracy
- Search by meaning/reading
- Filter by SRS stage and type

## API Integration Details

### Required Endpoints

```
GET /user
GET /level_progressions
GET /assignments
GET /subjects
GET /review_statistics
GET /summary
```

### Headers

All requests must include:
```
Authorization: Bearer {api_token}
Wanikani-Revision: 20170710
```

### Error Handling

- **401**: Session expired → Clear token, redirect to home, toast message
- **429**: Rate limited → Queue handles retry, show loading indicator
- **500/503**: WaniKani issues → Toast error message
- **Network**: Connection error → Toast message

### Data Fetching Flow

1. Validate API key with `/user`
2. Check subscription level
3. Query IndexedDB for cached data
4. Fetch updates using `updated_after` where applicable
5. Handle pagination (follow `pages.next_url`)
6. Update IndexedDB cache
7. Update Zustand store

## Important Implementation Notes

### Subjects Data

- **Large dataset**: ~9000+ items across all levels
- **Pagination**: 1000 items per request
- **Show progress**: Display loading progress for multi-page fetches
- **Hidden subjects**: Filter where `hidden_at` is not null
- **Radical images**: Some radicals use images instead of UTF-8 characters

### Level Progression

- **Reset handling**: Users can reset to earlier levels
- **Calculations**: Exclude data before `confirmed_at` of latest reset
- **Level unlock**: 90% of kanji must reach Guru (stage 5+)

### Assignment Availability

Items available for lessons when:
- Component subjects passed (SRS stage 5+)
- User level >= subject level

### Burned Items

- SRS stage 9
- No longer appear in reviews
- Consider "graduated" or "completed"

## Development Commands

```bash
# Initialize project
npx create-next-app@latest crabigator-stats --typescript --tailwind --eslint --app --turbopack
cd crabigator-stats

# Add shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button input card toast sonner

# Install dependencies
npm install zustand recharts idb

# Add Magic UI components manually from magicui.design
```

## UI/UX Guidelines

**Loading States:**
- Full-page skeleton on initial load
- Subtle loading bar on refresh
- Component skeletons for individual sections

**Animations:**
- Page transitions (subtle fade/slide)
- Chart animations on data load
- Smooth theme transitions
- Magic UI effects on landing page

**Responsive Design:**
- Desktop-first approach
- Mobile-usable with collapsible dock
- Scrollable/zoomable charts on small screens
- Responsive grid columns for items

**Error States:**
- Toast notifications (using sonner)
- Empty states with helpful messages
- Graceful handling of null/undefined data

## API Documentation Reference

The complete WaniKani API v2 documentation is available at:
- Official docs: https://docs.api.wanikani.com/20170710/
- Project reference: `/mnt/project/Wanikani_Api_Docs.docx`

Refer to these for:
- Exact response structures
- All available query parameters
- SRS stage intervals
- Subscription details

## Code Style

- **TypeScript**: Use strict mode, avoid `any`
- **Components**: Prefer function components with hooks
- **Naming**: PascalCase for components, camelCase for functions/variables
- **File structure**: One component per file
- **Imports**: Group by external, internal, relative
- **Comments**: JSDoc for complex functions

## Testing Considerations

- Validate API responses match expected types
- Test rate limiting queue behavior
- Test IndexedDB cache operations
- Test reset handling in calculations
- Mock API responses for UI testing

## Security

- API token stored client-side only (session or localStorage)
- No server-side token storage
- HTTPS only for API requests
- Input validation on API key field

## Performance

- Lazy load dashboard components
- Virtual scrolling for large item lists
- Debounce search/filter inputs
- Memoize expensive calculations
- Use IndexedDB for offline capability
