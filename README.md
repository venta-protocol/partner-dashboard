## Install

Install all dependency and run development server.

```bash
npm install
npm run dev
# or
yarn install
yarn dev
```

## Built with these

- Framework: Next.js 14
- ORM: Supabase (Postgresql)
- Charts: Tremor
- CSS: Tailwind
- Icon: Heroicons and Lucide React

## Frontend Entry point

- Main dashboard: `src/app/(dashboard)/overview/page.tsx`

## Dump main DB to dev DB

```bash
npx tsx src/lib/db/dump.ts
```

## TODO

### Important
-

### Major

- Analytics Dashboard

### Minor

- Support Discount by Category & Tag
- Support Product Add on
- Upgrade to edge functions
- Add cache to static assets

- Remove fee_wallet_secret from staffShopInfo prop

### Final

- Remove unused components
- Reduce DB round trip
- Rename discount to campaign
- Encrypt password on FE
