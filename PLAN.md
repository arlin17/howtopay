# HowToPay.me - Product Plan

## Overview

A simple "pay me" link aggregator that shows all your payment methods in one place. Solves the "do you have Venmo?" / "only Zelle" coordination problem.

**Name:** `howtopay.me` (pending availability check)
**Tagline:** "One link. All your payment methods."

---

## Core Value Proposition

- **Pre-payment solution**: Helps people get to the payment, doesn't process payments
- **Payment rails agnostic**: Works with Venmo, CashApp, Zelle, PayPal, tip platforms, crypto
- **Two link types**: Persistent (tip jar) and ephemeral (protect PII)

---

## Target Users

| Persona | Use Case |
|---------|----------|
| Roommates | "Pay your share of rent/utilities" |
| Freelancers | Simple invoicing alternative |
| Service workers | Digital tip jar (baristas, musicians) |
| Side hustlers | Tutors, dog walkers, babysitters |
| Creators | "Buy me a coffee" equivalent |
| Anyone splitting bills | Dinner, group gifts, Airbnb |

---

## MVP Features

### 1. User Accounts
- Account required to create links (prevents squatting)
- Email or Google OAuth signup

### 2. Persistent Pay Page
- Custom URL: `howtopay.me/username`
- Add payment methods (handle-based only for security):
  - Venmo (@username)
  - CashApp ($cashtag)
  - PayPal.me link
  - Buy Me a Coffee
  - Ko-fi
  - GitHub Sponsors
  - Crypto addresses (BTC, ETH)
- Profile photo and display name
- Basic customization (colors?)

### 3. Ephemeral Links
- For sharing PII-based methods (Zelle phone/email)
- Generated on-demand: `howtopay.me/username/x7k9m2`
- **Expiration**: 24 hours OR 3 views (whichever first)
- Can include custom amount and memo
- Security disclaimer shown to creator

### 4. Payment Rails (MVP)

**US Core:**

| Method | Identifier | Link Type |
|--------|-----------|-----------|
| Venmo | @username | Persistent |
| CashApp | $cashtag | Persistent |
| PayPal.me | username | Persistent |
| Zelle | phone/email | **Ephemeral only** (PII) |

**Tip Platforms:**
- Buy Me a Coffee
- Ko-fi
- GitHub Sponsors

**International/Global:**
- PayPal (works globally)
- Crypto (BTC, ETH addresses)

### 5. QR Code
- Downloadable QR code for persistent page
- Use case: tip jars, business cards, physical locations

---

## Security Considerations

### PII Exposure Risk
- **Problem**: Zelle requires phone/email, which exposes personal info
- **Solution**: Ephemeral links for PII-based methods
  - Short-lived (24h or 3 views)
  - Not indexed by search engines
  - Warning shown to creator when generating

### Impersonation Risk
- **Problem**: Someone creates `howtopay.me/apple`
- **Mitigation (future)**: Verified badges, trademark protection, social account linking

### Abuse Prevention
- Rate limiting on link creation
- Report/flag mechanism (future)

---

## Out of Scope (MVP)

- Payment tracking ("did they pay?") - handled by payment rails
- Recurring requests - v2 feature
- Invoice templates - v2 feature
- Analytics - paid tier feature
- Multiple pages per user - paid tier feature
- Custom domains - paid tier feature

---

## Business Model

### Free Tier (Growth Engine)
- 1 persistent pay page
- Unlimited ephemeral links
- All payment methods
- Basic QR code
- "Powered by HowToPay.me" footer

### Paid Tier (~$5/mo) - Future
- Recurring payment requests
- Invoice templates
- Analytics (views, clicks by method)
- Custom domain support
- Multiple pages/workspaces
- Remove branding
- Styled QR codes

**Philosophy**: Core utility is free (drives virality), power features for professionals.

---

## Technical Architecture

### Stack
- **Frontend**: Next.js 14+ (App Router)
- **Database**: Postgres via Supabase
- **Auth**: Supabase Auth (email + Google OAuth)
- **Hosting**: Vercel
- **Domain**: ~$10-15/year

### Database Schema (Draft)

```sql
-- Users
users (
  id uuid primary key,
  email text unique,
  username text unique,  -- the slug: howtopay.me/{username}
  display_name text,
  avatar_url text,
  created_at timestamp
)

-- Payment methods for persistent page
payment_methods (
  id uuid primary key,
  user_id uuid references users,
  type text,  -- 'venmo', 'cashapp', 'paypal', 'zelle', 'buymeacoffee', etc.
  handle text,  -- @username, $cashtag, email, etc.
  display_order int,
  is_pii boolean default false,  -- true for zelle
  created_at timestamp
)

-- Ephemeral links
ephemeral_links (
  id uuid primary key,
  user_id uuid references users,
  slug text unique,  -- random string: x7k9m2
  amount decimal,
  memo text,
  view_count int default 0,
  max_views int default 3,
  expires_at timestamp,
  created_at timestamp
)

-- Payment methods included in ephemeral link
ephemeral_link_methods (
  ephemeral_link_id uuid references ephemeral_links,
  payment_method_id uuid references payment_methods
)
```

### Deep Links

| Platform | Deep Link Format |
|----------|------------------|
| Venmo | `venmo://paycharge?txn=pay&recipients=USERNAME&amount=X&note=Y` |
| CashApp | `https://cash.app/$CASHTAG` (or `cash.app/$CASHTAG/AMOUNT`) |
| PayPal | `https://paypal.me/USERNAME/AMOUNT` |
| Zelle | No universal link (display info to copy) |
| Buy Me a Coffee | `https://buymeacoffee.com/USERNAME` |
| Ko-fi | `https://ko-fi.com/USERNAME` |
| GitHub Sponsors | `https://github.com/sponsors/USERNAME` |

### Key Routes

```
/                     - Landing page
/login                - Auth
/signup               - Auth
/dashboard            - Manage your page + methods
/dashboard/ephemeral  - Generate ephemeral links
/{username}           - Public pay page (persistent)
/{username}/{slug}    - Public pay page (ephemeral)
```

---

## Go-to-Market

### Launch Channels
1. **ProductHunt** - perfect audience (creators, freelancers, indie hackers)
2. **Twitter/X** - viral potential, share your own link
3. **Reddit** - r/freelance, r/sidehustle, r/venmo, r/personalfinance
4. **Hacker News** - Show HN
5. **TikTok** - "life hack" format

### Viral Loop
- Every pay page has "Create your own → howtopay.me" footer
- Every link shared is free marketing

---

## Success Metrics

- Users signed up
- Pay pages created
- Ephemeral links generated
- Click-through to payment methods
- Organic shares (pages viewed by non-creators)

---

## Implementation Roadmap

### Phase 1: Core MVP
1. [x] Initialize Next.js project with TypeScript
2. [ ] Set up Supabase (auth + database schema)
3. [ ] Build auth flow (signup/login)
4. [ ] Build dashboard (manage payment methods)
5. [ ] Build public pay page viewer
6. [ ] Deploy to Vercel

### Phase 2: Ephemeral Links
7. [ ] Add ephemeral link generation UI
8. [ ] Implement expiration logic (24h OR 3 views)
9. [ ] Add amount/memo to ephemeral links

### Phase 3: Polish
10. [ ] Add QR code generation/download
11. [ ] Mobile-responsive design
12. [ ] SEO optimization
13. [ ] "Powered by" footer with link

### Phase 4: Launch
14. [ ] Write ProductHunt copy
15. [ ] Create demo video/GIF
16. [ ] Launch

---

## Open Questions

- [ ] Exact domain name (pending availability check)
- [ ] Color scheme / branding
- [ ] Which payment methods to show by default vs. "add more"
- [ ] Mobile app (future) vs. PWA vs. web-only

---

## Competitive Landscape

| Competitor | What it does | Gap |
|------------|--------------|-----|
| CashWith.app | Same concept | Early stage, low visibility |
| Splitwise | Tracks IOUs | Doesn't help collect payment |
| Venmo requests | Individual payment requests | Single method, no aggregation |
| Linktree + manual links | Workaround | Not purpose-built |
| QuickBooks/Wave | Full invoicing | Overkill for simple payments |

**Our wedge**: Simple, free, payment-method agnostic, with PII protection via ephemeral links.
