# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js version warning

This project runs **Next.js 16.2.6**, which has breaking changes vs. older Next.js knowledge/training data — APIs, conventions, and file structure may differ from what you expect. Before writing route/middleware/config code, check the relevant guide under `node_modules/next/dist/docs/` and heed deprecation notices.

The most relevant instance of this: **route middleware now lives in `proxy.ts` at the project root, not `middleware.ts`** (see `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`). This repo's `proxy.ts` exports a `proxy()` function and a `config.matcher`, mirroring the old middleware API.

## Commands

```bash
npm run dev        # start dev server (Next.js)
npm run build       # production build
npm run start       # run production build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run format      # prettier --write "**/*.{ts,tsx}"
```

There is no test runner configured in this repo.

## Architecture

This is a Next.js App Router real-estate site (marketing/user site + auth, with an admin area stubbed out) using MongoDB/Mongoose, JWT cookie auth, and shadcn/ui.

### Route groups (`app/`)

- `app/(user)/(auth)/` — login, register, forgotpassword, newpassword/[token]. Has its own `layout.tsx` (no header/footer).
- `app/(user)/(home)/` — public marketing pages (home, aboutus, services, contactus, profile, accountverify). Its `layout.tsx` wraps children with `Header`/`Footer` from `components/user/common/`.
- `app/(user)/store/authStore.ts` — a Zustand store (`useAuth`) holding the client-side auth snapshot (`userId`, `username`, `email`, `avatar`, `role`). Populated after calling `getme`; not itself a source of truth for auth (the JWT cookie is).
- `app/admin/` — currently just a stub page; no admin API routes exist yet.
- `app/api/user/auth/*` — auth endpoints: register, login, logout, getme, accountverify/[token], forgotpassword, newpassword, passworresetverify/[token] (note the typo is intentional/existing, not a mistake to "fix" opportunistically without checking callers).
- `app/api/user/contactus/` — contact form submission endpoint.

### Auth flow

- Passwords hashed with `bcryptjs`. JWTs signed/verified via `lib/jwt.ts` (`createToken(userId, rememberme)`, `verifyToken(token)`), secret from `process.env.JWT_SECRET`.
- Session token is stored in an **httpOnly `token` cookie** (see `app/api/user/auth/login/route.ts`), not in client-readable storage.
- `proxy.ts` currently only guards `/api/user/auth/getme` (see `config.matcher`) — it verifies the cookie JWT and injects `x-user-id` into request headers for the downstream route handler. Any new protected route must be added to that matcher (or given its own auth check) — protection is not automatic.
- Email verification and password reset both work via random tokens (`crypto.randomBytes`) stored on the `User` document with expiry timestamps, emailed via `lib/mailer.ts` (nodemailer, SMTP configured through env vars).

### Data layer

- `lib/database.ts` exports `connectDB()`, a Mongoose connection helper (db name hardcoded as `"realestate"`). It manually pins DNS resolvers (`1.1.1.1`, `8.8.8.8`) — do not remove without understanding why (likely a DNS-resolution workaround for the hosting environment). Call `connectDB()` at the top of any route handler that touches the DB; there is no global connection bootstrap.
- `models/index.ts` re-exports all Mongoose models (`User`, `ContactUs`, `Favorite`, `Inquiry`, `VisitBooking`, `Property`, `Order`) from a single barrel — import models from `@/models`, not from individual model files, for consistency with existing code.
- All schemas use `models.X || model("X", Schema)` to avoid recompilation errors under Next.js hot reload.
- Sensitive/internal user fields (`password`, verification/reset tokens) are declared `select: false` in `UserSchema` — must be explicitly `.select("+password")` (or similar) when needed, as done in the login route.
- `Property` has a `2dsphere` geo index on `location` and a text index across `title`/`description`/`address.city`/`address.state` for search — keep these in mind if adding property search/filter features.

### API route conventions

Route handlers under `app/api/**/route.ts` consistently:
- Destructure/validate the JSON body first, returning `{ success: false, message }` with a 400 on missing fields.
- Call `connectDB()` before any Mongoose query.
- Return a uniform JSON shape: `{ success: boolean, message: string, ...data }`, with an appropriate HTTP status.
- Wrap the whole handler body in try/catch, returning a generic 500 `{ success: false, message: "Internal Server Error" }` on unexpected errors.

New API routes should follow this same shape for consistency.

### UI/components

- shadcn/ui is configured via `components.json` (style `radix-nova`, base color `neutral`, icon library `lucide`). Add components with `npx shadcn@latest add <component>` — they land in `components/ui/`.
- Path alias `@/*` maps to the repo root (see `tsconfig.json`), e.g. `@/components/ui/button`, `@/lib/utils`.
- `components/user/common/` holds shared chrome (`header.tsx`, `footer.tsx`, `logo.tsx`) and a `design1.tsx`. `components/theme/` holds the `next-themes` provider/toggle wired up in the root layout (`ThemeProvider` with class-based dark mode).
- Two font families are loaded in every layout: `Playfair` (`--font-playfair`) and `Inter` (`--font-inter`, applied via `font-sans`).
- Brand/contact constants (name, phone, email, office hours) live in `lib/contant.ts` (note: filename is `contant.ts`, not `constant.ts`) — reuse these instead of hardcoding brand strings.

### Environment variables (`.env`, not committed)

`MONGO_URI`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_PASSWORD`, `CLIENT_URL` (used to build links in verification/reset emails).
