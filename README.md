# Crabigator Stats - WaniKani Statistics Dashboard

A beautiful, performant Next.js application that displays comprehensive statistics from the WaniKani API. Built with modern web technologies and following WaniKani API best practices for caching and rate limiting.

## Features

- **Progress Tracking**: Visualize your WaniKani journey with interactive charts showing level progression, average level-up times, and predicted completion dates
- **Item Management**: Browse all your radicals, kanji, and vocabulary with SRS stage color coding and detailed statistics
- **Smart Caching**: Intelligent IndexedDB caching reduces API calls and improves performance
- **Rate Limiting**: Respectful API usage with automatic request queuing and rate limit handling
- **Responsive Design**: Desktop-first with mobile usability
- **Theme Support**: Beautiful light and dark modes with smooth transitions

## Tech Stack

- **Framework**: Next.js 16+ (App Router) with Turbopack
- **React**: 19+
- **Styling**: Tailwind CSS 4+
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Animations**: Magic UI components
- **State Management**: Zustand with persist middleware
- **Local Database**: IndexedDB (idb/Dexie.js)
- **TypeScript**: Strict mode

## Getting Started

### Prerequisites

- Node.js 18+
- A WaniKani account with a full subscription (levels 1-60)
- WaniKani API v2 token ([Get yours here](https://www.wanikani.com/settings/personal_access_tokens))

### Installation

```bash
# Clone the repository
git clone https://github.com/stapletl/crabigator-stats.git
cd crabigator-stats

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setup

1. Navigate to the landing page
2. Enter your WaniKani API token
3. Choose storage preference:
   - **Session only**: Token stored only for current session
   - **Remember me**: Token persisted in localStorage
4. Click submit to validate and enter the dashboard

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Hero/landing page
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout with navigation
│   │   ├── progress/page.tsx       # Level progression and stats
│   │   └── items/page.tsx          # Radicals/kanji/vocab browser
├── components/
│   ├── ui/                         # shadcn components
│   ├── charts/                     # Chart components
│   ├── navigation/                 # Navigation components
│   └── items/                      # Item display components
├── lib/
│   ├── wanikani/
│   │   ├── api.ts                  # API client
│   │   ├── types.ts                # TypeScript types
│   │   ├── cache.ts                # IndexedDB operations
│   │   └── queue.ts                # Rate limiting queue
│   └── utils.ts
├── stores/
│   └── index.ts                    # Zustand stores
└── hooks/                          # Custom React hooks
```

## Features in Detail

### Progress Dashboard

- **Current Level**: Prominent display of your current WaniKani level
- **Level Progression Chart**: Historical data with future projections based on your pace
- **Time Statistics**: Average level-up time, current level duration, predicted level-up date
- **Reset Handling**: Automatically adjusts calculations to exclude pre-reset data

### Items Browser

**View Modes:**
- By Type: Separate sections for Radicals, Kanji, Vocabulary
- By Level: Grouped by WaniKani level (1-60)
- By SRS Stage: Grouped by current SRS stage

**Color Coding:**
- Locked: Gray
- Apprentice (1-4): Pink/Red gradient
- Guru (5-6): Purple
- Master (7): Blue
- Enlightened (8): Light Blue/Cyan
- Burned (9): Gold/Yellow

**Interactions:**
- Hover/click for detailed tooltips showing meanings, readings, accuracy, and next review date
- Search and filter functionality
- Responsive grid layout

### API Integration

The app follows WaniKani API best practices:

- **Authentication**: Bearer token with proper headers
- **Rate Limiting**: 60 requests/minute with automatic queuing
- **Caching Strategy**:
  - Subjects: Aggressive caching (rarely updated)
  - Assignments: Moderate caching with `updated_after` filter
  - Review Statistics: Moderate caching with incremental updates
  - User: Light caching, verified each session
  - Summary: No caching (changes frequently)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### UI Development Guidelines

**Use shadcn/ui Components:**

Whenever possible, use shadcn/ui components instead of inline styling or custom styled divs. This ensures:
- **Consistent theming**: Components automatically adapt to light/dark mode
- **Unified design language**: Consistent spacing, colors, and typography
- **Easier maintenance**: Theme changes propagate throughout the app
- **Accessibility**: Built-in ARIA attributes and keyboard navigation

**Examples:**
- Use `<Button>` instead of styled `<button>` elements
- Use `<Card>`, `<CardHeader>`, `<CardContent>` for containers instead of custom divs
- Use `<Badge>` for labels and status indicators
- Use `<Separator>` instead of custom horizontal rules
- Use shadcn color utilities (`text-primary`, `bg-muted`, etc.) instead of arbitrary colors

Available components can be found at [shadcn/ui](https://ui.shadcn.com/) and added via:
```bash
npx shadcn@latest add [component-name]
```

## Environment Variables

No environment variables required - API token is provided by the user at runtime.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the WaniKani community
- Uses the [WaniKani API v2](https://docs.api.wanikani.com/20170710/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Animations from [Magic UI](https://magicui.design/)

## Disclaimer

This is an unofficial WaniKani statistics dashboard. It is not affiliated with or endorsed by WaniKani/Tofugu. WaniKani is a trademark of Tofugu LLC.

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/stapletl/crabigator-stats/issues) on GitHub.
