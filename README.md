# FakeStore Direct

A high-performance modern e-commerce web application built with **Next.js 16 (App Router + Turbopack)**, **React 19**, **Tailwind CSS v4**, **shadcn/ui**, and **Zustand**.

---

## Overview

FakeStore Direct delivers a seamless shopping experience modeled after modern retail interfaces. It features instant catalog filtering, dynamic URL synchronization, zero-CLS skeleton loading, an interactive cart system with persistent local state, detailed product showcases with JSON-LD structured data, and light/dark theme support.

---

## Key Features

- **Next.js 16 App Router & React 19**: Server Component architecture by default for optimal First Contentful Paint (FCP) and minimal client bundle size, with interactive leaf Client Components.
- **Fast Product Catalog & Filters**:
  - **Live Search**: Debounced search by title, description, and keywords.
  - **Category Navigation**: Fast filtering across Electronics, Jewelery, Men's Clothing, and Women's Clothing.
  - **Price Range Filter**: Custom Min/Max inputs with quick price presets.
  - **Sort Ordering**: Default order, featured, newest arrivals, and price (low to high / high to low).
  - **Grid / List Views**: Switchable catalog presentation layout.
  - **Responsive Mobile Filter Drawer**: Bottom sheet filter drawer for mobile screens.
  - **URL Synchronization**: All active filters, search queries, pagination, and sorting are reflected in the URL for bookmarking and sharing.
- **Zero-CLS Skeleton Placeholders**: Custom loading skeletons matching the exact page geometry and components, eliminating Cumulative Layout Shift.
- **Shopping Cart with Persistent State**:
  - Global state managed via **Zustand** with `localStorage` persistence.
  - Real-time cart quantity badges in the header and mobile navigation.
  - Quantity adjustments, item removal, and order price calculations (subtotal, shipping, estimated tax).
- **Product Details (`/products/[id]`)**:
  - High-resolution product image presentation.
  - Breadcrumb trail navigation.
  - Star ratings, review counts, and stock indicators.
  - Search engine optimization with dynamic OpenGraph metadata and JSON-LD schema (`schema.org/Product`).
- **Authentication & User Session**:
  - Mock authentication with FakeStore API user credentials.
  - Client-side session management with user dropdown menu.
  - Protected route wrapper (`<AuthGuard />`).
- **Resilient API Architecture**:
  - Built-in timeout detection and fallback data cache (`mock-products.ts`) if the remote FakeStore API experiences downtime or network latency.
- **Dark & Light Mode**: Seamless theme switching with `next-themes` and Tailwind CSS variables.
- **Design System (`components/shared`)**: Suite of 12 reusable shared components built on Radix UI and Base UI primitives.

---

## Project Structure

```text
vrit-task/
├── app/                                # Next.js App Router routes & layouts
│   ├── layout.tsx                      # Root layout (Theme provider, Cart/Auth providers, Header, Footer)
│   ├── page.tsx                        # Root page (redirects to /products)
│   ├── globals.css                     # Tailwind CSS v4 directives & theme variable tokens
│   ├── not-found.tsx                   # Global 404 page
│   ├── sitemap.ts                      # Dynamic XML sitemap generator
│   ├── cart/                           # Shopping Cart Route
│   │   ├── page.tsx                    # Cart page
│   │   ├── loading.tsx                 # Cart loading skeleton
│   │   └── _components/                # Cart route components (summary, item row, empty state)
│   ├── login/                          # Authentication Route
│   │   ├── page.tsx                    # Login page
│   │   └── _components/                # Login form & credential autofill
│   └── products/                       # Product Catalog Routes
│       ├── page.tsx                    # Server component fetching products & categories
│       ├── loading.tsx                 # Full-page skeleton placeholder
│       ├── error.tsx                   # Error boundary
│       ├── _components/                # Catalog UI components
│       │   ├── amazon-results-header.tsx  # Search bar, results count, sort selector, view toggle
│       │   ├── amazon-sidebar.tsx         # Desktop sticky filter sidebar
│       │   ├── amazon-filter-drawer.tsx   # Mobile responsive filter drawer
│       │   ├── product-grid.tsx           # Grid/List renderer & state coordinator
│       │   ├── product-list-skeleton.tsx  # Layout-matching skeleton loader
│       │   ├── pagination-controls.tsx    # Pagination buttons & item counter
│       │   └── sort-selector.tsx          # Sorting select dropdown
│       └── [id]/                       # Product Details Route
│           ├── page.tsx                # Server component fetching specific product details
│           ├── loading.tsx             # Detail loading skeleton
│           ├── error.tsx               # Route error boundary
│           └── _components/            # Detail UI (image gallery, info, add-to-cart, JSON-LD)
│
├── components/                         # Component Library
│   ├── common/                         # Shared composite UI elements
│   │   ├── header.tsx                  # Top navigation bar & brand logo
│   │   ├── header-nav.tsx              # Category navigation links
│   │   ├── footer.tsx                  # Site footer
│   │   ├── mobile-nav.tsx              # Mobile drawer navigation
│   │   ├── product-card.tsx            # Universal product card (grid & list layouts)
│   │   ├── quick-add-to-cart.tsx       # Quick add button with quantity stepper
│   │   ├── cart-badge.tsx              # Animated item count indicator
│   │   ├── auth-guard.tsx              # Route protection component
│   │   ├── star-rating.tsx             # Reusable star rating visualization
│   │   ├── theme-toggle.tsx            # Light/Dark mode switcher
│   │   ├── user-menu.tsx               # Account & profile dropdown
│   │   └── empty-state.tsx             # Reusable empty results state
│   ├── shared/                         # Reusable design system components
│   │   ├── alert/                      # Dismissible alerts with status variants
│   │   ├── avatar/                     # User avatar with fallback initials
│   │   ├── badge/                      # Status and category badges
│   │   ├── breadcrumb/                 # Breadcrumb navigation with collapsible items
│   │   ├── button/                     # Interactive buttons with loading spinners & icons
│   │   ├── drawer/                     # Multi-placement modal drawer
│   │   ├── dropdown/                   # Contextual dropdown menus
│   │   ├── input/                      # Text/number inputs with icons & SQL sanitize
│   │   ├── label/                      # Accessible form labels with required markers
│   │   ├── pagination/                 # Full-featured pagination component
│   │   ├── select/                     # Single and multi-select combobox with chips
│   │   ├── tooltip/                    # Floating tooltips with directional placement
│   │   └── index.ts                    # Central barrel export
│   └── ui/                             # Headless shadcn/ui & Radix primitive components
│
├── hooks/                              # Custom React Hooks
│   ├── use-product-filters.ts          # Catalog filtering, sorting, pagination & URL sync
│   ├── use-cart.ts                     # Cart store selector & helper actions
│   ├── use-auth.ts                     # Authentication store actions & status
│   ├── use-debounce.ts                 # Value debouncing hook for search inputs
│   └── use-mobile.ts                   # Responsive screen breakpoint detector
│
├── stores/                             # Zustand Client State Stores
│   ├── cart-store.ts                   # Persistent shopping cart state & calculations
│   └── auth-store.ts                   # Persistent user session & auth tokens
│
├── lib/                                # Utilities & API Services
│   ├── constants.ts                    # Global configurations, site metadata & defaults
│   ├── utils.ts                        # Tailwind class merger (`cn`)
│   └── api/                            # Data access layer
│       ├── client.ts                   # Fetch wrapper with timeout & error handling
│       ├── products.ts                 # Product endpoints (getProducts, getProductById, getCategories)
│       ├── auth.ts                     # FakeStore authentication endpoints
│       └── mock-products.ts            # Local fallback dataset for offline/resilience
│
└── types/                              # TypeScript Type Definitions
    ├── product.ts                      # Product, Category, and Rating interfaces
    ├── cart.ts                         # Cart item & store state interfaces
    ├── auth.ts                         # User, Credentials, and Session interfaces
    └── api.ts                          # Generic API response contracts
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v18.18.0` or higher (Node `v20+` recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd vrit-task
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or with pnpm
   pnpm install
   ```

3. **Environment Configuration (Optional):**
   Create a `.env.local` file in the project root if you want to override default endpoints:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://fakestoreapi.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
   *(If omitted, sensible defaults are configured automatically in `lib/constants.ts`)*.

---

## Development & Build Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Compiles the TypeScript application and creates an optimized production build |
| `npm run start` | Runs the compiled production build locally |
| `npm run lint` | Runs ESLint to check for code quality and convention issues |
| `npm run typecheck`| Runs TypeScript compiler (`tsc --noEmit`) to validate all types |
| `npm run format` | Runs Prettier across all `.ts` and `.tsx` source files |

---

## Demo Credentials

For testing authentication on the `/login` route:

- **Username**: `mor_2314`
- **Password**: `83r5^_`

*(A one-click demo login button is also provided directly on the login page for convenience).*

---

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI & Components**: [React 19](https://react.dev/), [Radix UI](https://www.radix-ui.com/), [Base UI](https://base-ui.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with `persist` middleware
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
