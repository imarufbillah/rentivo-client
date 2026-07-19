# Rentivo Client

Frontend for Rentivo — an AI-powered property rental platform. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and shadcn/ui.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, shadcn/ui, Tailwind CSS v4 |
| State | TanStack React Query, React Hook Form |
| Auth | Better Auth client |
| Animation | Framer Motion |
| Charts | Recharts |
| AI Chat | Groq SDK (client-side streaming) |
| Validation | Zod 4 |
| Theming | next-themes (light/dark) |
| Icons | Lucide React, React Icons |
| Testing | Vitest, Testing Library |

## Features

- **19 routes** — landing, properties, details, auth, dashboard, profile, saved, history, add/edit/manage, rental flow, about, contact, privacy, terms, upgrade
- **AI Chat Widget** — floating assistant with tool calling, SSE streaming, suggested follow-ups
- **AI Recommendations** — personalized property suggestions based on interaction history
- **Property Search** — full-text search, 8+ filter dimensions, sort, pagination (12/page)
- **Property Details** — 6-section layout with image gallery, info grid, pricing, rules, owner card
- **Property Management** — add/edit properties with 20+ fields, drag-to-reorder images, amenity picker
- **Reviews & Ratings** — star ratings, comments, average display
- **Rental Flow** — Stripe checkout, success/cancel pages, rental lifecycle
- **Owner Analytics** — bar charts for views/saves per property
- **Dark Mode** — full light/dark theme with warm neutral palette
- **Responsive** — mobile, tablet, desktop layouts
- **Error Handling** — error boundaries, not-found page, loading skeletons

## Design System

| Token | Light | Dark |
|-------|-------|------|
| Background | `oklch(0.975 0.004 80)` | `oklch(0.16 0.01 80)` |
| Surface | `oklch(0.995 0.002 80)` | `oklch(0.22 0.01 80)` |
| Border | `oklch(0.90 0.008 80)` | `oklch(0.30 0.01 80)` |
| Ink | `oklch(0.18 0.01 80)` | `oklch(0.95 0.004 80)` |
| Accent | `oklch(0.62 0.16 35)` (terracotta) | `oklch(0.72 0.14 40)` |

**Typography:** Plus Jakarta Sans (headings) + DM Sans (body) + Geist Mono (code)

## Project Structure

```
rentivo-client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout (fonts, providers, nav, footer)
│   │   ├── providers.tsx       # React Query + theme providers
│   │   ├── globals.css         # Tailwind v4 + design tokens
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── properties/
│   │   │   ├── page.tsx        # Property listing (search, filter, sort)
│   │   │   ├── [id]/page.tsx   # Property details
│   │   │   ├── [id]/edit/      # Edit property
│   │   │   ├── add/            # Add property
│   │   │   └── manage/         # Owner management table
│   │   ├── profile/            # User profile
│   │   ├── saved/              # Saved properties
│   │   ├── history/            # Interaction history
│   │   ├── dashboard/          # Owner dashboard (analytics)
│   │   ├── upgrade/            # Role upgrade page
│   │   ├── rental/
│   │   │   ├── success/        # Stripe success callback
│   │   │   └── cancel/         # Stripe cancel callback
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── privacy/            # Privacy policy
│   │   ├── terms/              # Terms of service
│   │   └── api/auth/[...all]/  # Better Auth API route
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, ThemeToggle
│   │   ├── properties/         # PropertyCard, PropertyDetails, PropertyForm, etc.
│   │   ├── recommendations/    # RecommendationFeed, RecommendationCard
│   │   ├── chat/               # ChatWidget, ChatMessage
│   │   ├── reviews/            # ReviewList, ReviewForm, RatingDisplay
│   │   ├── ProfileForm.tsx
│   │   ├── AvatarUpload.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleGuard.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useProperties.ts
│   │   ├── useRecommendations.ts
│   │   ├── useRentals.ts
│   │   ├── useInteractions.ts
│   │   └── useReviews.ts
│   ├── lib/                    # Utilities
│   │   ├── api.ts              # API client
│   │   ├── imgbb.ts            # Image upload utility
│   │   └── utils.ts            # cn() helper, formatters
│   └── types/                  # TypeScript types (mirrors server types)
├── public/                     # Static assets
├── next.config.ts              # Image domains config
├── tailwind.config.ts          # Tailwind v4 config
└── package.json
```

## Environment Variables

Create `.env.local` in the project root:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Groq (client-side AI chat)
NEXT_PUBLIC_GROQ_API_KEY=gsk_...

# imgbb (image uploads)
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-key
```

## Setup & Development

```bash
# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

The dev server runs on `http://localhost:3000`.

## Pages & Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | No | Landing page (8 sections) |
| `/login` | No | Email/password + Google OAuth login |
| `/register` | No | Registration with role selection |
| `/properties` | No | Property listing with search/filter/sort |
| `/properties/[id]` | No | Property details (6 sections) |
| `/properties/add` | Owner | Add new property |
| `/properties/[id]/edit` | Owner | Edit property |
| `/properties/manage` | Owner | Manage listings (table + analytics) |
| `/profile` | Yes | User profile & settings |
| `/saved` | Yes | Saved properties |
| `/history` | Yes | Interaction history (views, saves, rentals) |
| `/dashboard` | Owner | Owner analytics dashboard |
| `/upgrade` | Yes | Upgrade to owner role |
| `/rental/success` | Yes | Stripe checkout success |
| `/rental/cancel` | Yes | Stripe checkout cancel |
| `/about` | No | About Rentivo |
| `/contact` | No | Contact page |
| `/privacy` | No | Privacy policy |
| `/terms` | No | Terms of service |

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Vercel auto-detects Next.js — no configuration needed
4. Set environment variables in the Vercel dashboard
5. Deploy

### Environment Variables on Vercel

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://<your-render-url>` |
| `NEXT_PUBLIC_GROQ_API_KEY` | Your Groq API key |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Your imgbb API key |

## License

ISC
