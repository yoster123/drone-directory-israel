# MVP Scope

## In Scope

### Pages
- Homepage — hero search, featured categories, featured listings
- Service category pages — `/services/[service-slug]`
- City pages — `/cities/[city-slug]`
- Service × city combination pages — `/services/[service-slug]/[city-slug]`
- Individual listing pages — `/listings/[listing-slug]`
- Static pages — About, Contact, Terms, Privacy

### Listing Features
- Name, description, services offered, cities covered
- Phone number and/or website link (contact info visible directly — no gating)
- Logo / profile image
- Featured badge (manual flag in data)
- Sponsored placement (manual flag in data)

### Search & Filter
- Filter by service type
- Filter by city
- Combined service + city landing pages (primary SEO surface)

### SEO
- Static generation for all category, city, and combination pages
- Hebrew `<title>` and `<meta description>` per page
- Structured data (LocalBusiness / Service schema)
- `noindex` on pages with fewer than 3 listings
- XML sitemap
- Canonical tags

### Admin / Data Management
- No admin UI in MVP — data managed via Google Sheets → JSON pipeline

## Out of Scope (MVP)

- User registration / login
- Payment processing
- In-app messaging or contact forms that route through the app
- Reviews, ratings, or testimonials
- Map view
- Mobile app
- Multi-language (English version deferred)
- API for third-party integrations
- Analytics dashboard for businesses

## Tech Constraints

- Next.js 16 App Router, static generation preferred
- Data source: flat JSON files generated from Google Sheets pipeline
- Hosting: Vercel (assumed)
- No database in MVP — redeployment triggers data refresh
