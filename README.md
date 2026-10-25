# ProcureFlow — Purchase Requisition Assessment

A React + TypeScript + Tailwind CSS implementation of the visible Force Intellect Purchase Requisition requirements.

## Features
- Requisition listing with search, status filter, date range, pagination, detail view, empty state and a manually triggerable error state.
- Create requisition with generated read-only PR number, request metadata and dynamic material rows.
- Add, remove and duplicate material rows.
- Validation for required fields, positive quantity, at least one material and duplicate material codes.
- Save as Draft and Submit for Approval (sets status to Pending Approval).
- React Context for shared state and LocalStorage persistence.
- Responsive layout and accessible labels/focus states.

## Run locally

Requirements: Node.js 20+ recommended.

```bash
npm install
npm run dev

npm i --save-dev @types/react
```

Open the URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Notes
- This assessment brief does not provide backend API details, so data is persisted locally in the browser. This is a frontend demonstration, not a real server integration.
- Demo records are included to make listing filters and status cards easy to review. Use the listing page's “Simulate error state” link to demonstrate the error UI.
- If the employer provides additional pages/API contracts, adapt the implementation to those requirements instead of assuming a backend contract.
