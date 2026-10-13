# RentNest API - Rental Marketplace Backend

Backend for RentNest, an end-to-end rental marketplace for tenants and landlords in Bangladesh. It covers the full leasing flow from listing to request to lease to payment.

**Live API:** https://rentnestapi.vercel.app/api | **Client repo:** [rentnest](https://github.com/rockychowdhury/rentnest)

## Why this exists

Renting runs on scattered chats, offline negotiation, and insecure payments. Tenants sift through irrelevant listings, landlords lose track of units and requests. RentNest gives both sides one shared pipeline.

## What it does (business workflow)

- Turns tenant requests into payable leases on landlord approval, replacing offline back-and-forth with one trackable flow.
- Filters rentals by Division-District-Area with per-unit pricing and live availability, so tenants only see relevant homes.
- Syncs Stripe payments to leases via verified webhooks, so tenancy and billing never drift apart.

## Tech

Node.js, Express, TypeScript, PostgreSQL, Prisma, Stripe, Zod

- Modular Prisma schema: properties, units, pricing, geography, rental requests, leases, payments
- Zod validation on all inputs, type-safe query selections to avoid over-fetching
- Stripe Checkout + webhook listener with signature check and transactional lease activation
- Seeded geo data (divisions, districts, upazilas), categories, and amenities

## Core flows

```
Property (multi-unit + pricing) -> published listing
  -> Tenant requests a unit -> Landlord approves or rejects
  -> Approval creates lease in PENDING_PAYMENT
  -> Stripe Checkout -> webhook -> lease ACTIVE + payment ledger
  -> Review after stay
```

## Run locally

```bash
git clone https://github.com/rockychowdhury/rentnest-api.git
cd rentnest-api
npm install
cp .env.example .env
# set DATABASE_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, JWT_*
npx prisma migrate dev
npm run seed:all
npm run dev
```

API runs on `http://localhost:5000/api`.

Postman collection: `docs/RentNestAPI.postman_collection.json`

## Structure

```
src/modules/   # auth, property, propertyUnit, pricing, rentalRequest, lease, payment, review, geo
prisma/schema/ # modular models
scripts/       # seed-geo, seed-categories, seed-amenities, seed-properties
```

## Author

Rocky Chowdhury, Backend Developer, Dhaka, Bangladesh
Portfolio: https://rockychowdhury.vercel.app | LinkedIn: https://linkedin.com/in/rockychowdhury1
