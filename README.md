# Kaizen Tech — College Tech Club Website

A production-ready full-stack website for **Kaizen Tech**, built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, and Firebase.

## Features

- Premium dark UI with glassmorphism, neon accents, and animated gradients
- Firebase Authentication (email/password + Google)
- Firestore for events, registrations, comments, members, and users
- Firebase Storage for event banners
- Real-time comments with threaded replies
- Role-based admin dashboard (`user` · `admin` · `superadmin`)
- Protected `/dashboard` routes via middleware + client guard
- CSV export for registrations
- Recharts analytics on dashboard overview

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Auth | Firebase Authentication |
| Database | Firestore |
| Storage | Firebase Storage |
| Analytics | Firebase Analytics |

## Getting Started

### 1. Clone and install

```bash
cd "Coding club"
npm install
```

### 2. Firebase setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** → Email/Password and Google sign-in
3. Create a **Firestore** database
4. Enable **Storage**
5. Copy web app config into `.env.local` (see `.env.local.example`)

```bash
cp .env.local.example .env.local
# Fill in your Firebase config values
```

### 3. Deploy Firestore rules

```bash
firebase deploy --only firestore:rules
```

Or paste `firestore.rules` into the Firebase Console → Firestore → Rules.

### 4. Seed data (optional)

Add documents manually or via Firebase Console:

**`members`** — team profiles:

```json
{
  "name": "Alex Chen",
  "role": "President",
  "category": "core",
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username"
}
```

Categories: `core` | `developers` | `designers` | `coordinators`

**`settings/stats`** — visitor counter:

```json
{ "visitors": 0 }
```

**First admin** — after signing up, set your user doc role in Firestore:

```
users/{your-uid} → role: "superadmin"
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/app              Pages (home, events, members, auth, dashboard)
/components       UI, layout, home, events, members, comments, dashboard
/lib              Firebase, auth, firestore, storage helpers
/hooks            useAuth, useRole, useFirestore
/context          AuthContext
/middleware.ts    Dashboard route protection
```

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all `NEXT_PUBLIC_FIREBASE_*` environment variables
4. Deploy

Ensure Firebase Auth authorized domains include your Vercel URL.

## Role Capabilities

| Action | User | Admin | Super Admin |
|--------|------|-------|-------------|
| Browse site | ✓ | ✓ | ✓ |
| Register for events | ✓ | ✓ | ✓ |
| Post comments | ✓ | ✓ | ✓ |
| Create/edit events | ✗ | ✓ | ✓ |
| Delete comments | ✗ | ✓ | ✓ |
| Manage admins | ✗ | ✗ | ✓ |
| View analytics | ✗ | ✓ | ✓ |

## License

MIT — built for Kaizen Tech.
