# Payout Management Platform - Frontend

The frontend React application for the Payout Management Platform. Built with Next.js 15 (App Router), Tailwind CSS, TypeScript, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS + PostCSS
- **UI Components:** shadcn/ui framework (Lucide React Icons)
- **Data Fetching:** React Query (TanStack V5) + Axios
- **Forms & Validation:** React Hook Form + Zod
- **State/Routing:** Next.js App Router hooks

## Features

- **Role-Based Access Control (RBAC):** UI dynamically routes/shields `OPS` and `FINANCE` workflows.
- **Premium Dashboard:** Dynamic vendor pipelines and metric overviews.
- **Interactive UI:** Smooth transitions, premium micro-animations, loading spinners, and toast notifications (Sonner).

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Build / Production

To build an optimized production bundle:

```bash
npm run build
npm start
```
