# Uber App Dashboard Code Documentation

## Short Summary

This is a Next.js Uber app admin dashboard for the ride-sharing platform. It connects to the backend admin APIs to manage drivers, riders, payments, customer support, legal content, app pricing configuration, dashboard analytics, and admin authentication.

The dashboard uses the Next.js app router, React client components, Axios API modules, Zustand stores, Tailwind CSS, and icon libraries.

## Technology Stack

- Framework: Next.js app router
- UI: React 19, Tailwind CSS
- State management: Zustand
- HTTP client: Axios
- Rich text editor: Quill / React Quill packages
- Icons: HugeIcons and Lucide React
- Language: TypeScript



## Authentication Flow

The dashboard stores auth state in local storage under:

- `jhirash-admin-session`
- `jhirash-admin-password-reset`

Auth behavior:

- `AuthBootstrap` hydrates local auth state on app load.
- `AuthGuard` protects `/pages/*` routes and redirects unauthenticated users to `/auth/signin`.
- `api/client.ts` attaches `Authorization: Bearer <accessToken>` to protected requests.
- On `401`, the Axios response interceptor attempts `/admin/auth/refresh` using the stored refresh token.
- If refresh fails, local session is cleared and the user is redirected to sign in.

Auth API modules support:

- Sign in
- Forgot password
- Verify reset code
- Set new password
- Change password
- Change admin name
- Logout
- Refresh token

## Route and Screen Map

Protected dashboard pages live under `app/pages`.

Main screens:

- `/pages/dashboard`: monthly revenue breakdown and user overview.
- `/pages/analytics`: yearly revenue metrics and user metrics.
- `/pages/app-configuration`: fare configuration view.
- `/pages/app-configuration/[slug]`: fare configuration edit page.
- `/pages/driver-management`: driver list, filters, status actions, delete.
- `/pages/driver-management/[slug]`: driver profile, documents, trip history, reports.
- `/pages/rider-management`: rider list, filters, delete.
- `/pages/rider-management/[slug]`: rider profile, history, reports.
- `/pages/rider-management/[slug]/[id]`: rider trip detail.
- `/pages/payment-information`: payment list and platform/driver split.
- `/pages/payment-information/[slug]`: payment trip detail.
- `/pages/customer-support`: support tickets and reports list.
- `/pages/customer-support/[slug]`: support/report detail.
- `/pages/terms-conditions`: terms list.
- `/pages/terms-conditions/[slug]`: terms editor.
- `/pages/privacy-policy`: privacy policy list.
- `/pages/privacy-policy/[slug]`: privacy policy editor.
- `/pages/profile`: admin profile page.

Auth pages live under `app/auth`, including sign in, signup, forgot password, OTP, set new password, change password, and welcome screens.

## Sidebar Navigation

The sidebar is implemented in `Components/Sidebar/Sidebar.tsx`.

Menu groups:

- Main: Dashboard, Analytics
- Core: App configuration, Driver Management, Rider Management, Payment Information, Customer Support, Terms & Conditions, Privacy & Policy
- Personal Information: Profile, Logout

The sidebar reads the authenticated admin from the auth store and handles logout through the auth store.

## API Modules

The dashboard separates backend communication by feature:

- `api/auth.ts`: admin auth and password flow.
- `api/dashboard.ts`: dashboard overview and analytics.
- `api/app-config.ts`: fare configuration.
- `api/drivers.ts`: driver list/detail/document review/history/reports/status/delete.
- `api/riders.ts`: rider list/detail/history/reports/delete.
- `api/payments.ts`: rider payment list, share percentages, trip detail.
- `api/customer-support.ts`: support/report list and detail.
- `api/legal-content.ts`: legal content list/detail/create/update/delete.

These API modules use typed response interfaces from `types/*`.

## State Stores

The dashboard uses Zustand stores to keep page data and loading/error states.

Main stores:

- `store/auth-store.ts`: admin session, password reset flow, sign in/out, profile name update.
- `store/dashboard-store.ts`: dashboard overview and analytics metrics.
- `store/app-config-store.ts`: active fare configuration and update action.
- `store/driver-store.ts`: drivers, selected driver profile, documents, document detail, history, reports, document review, status update, delete.
- `store/rider-store.ts`: riders, selected rider profile, history, reports, delete.
- `store/payment-store.ts`: payments, share percentages, selected payment trip detail.
- `store/customer-support-store.ts`: support/report list and selected detail.
- `store/legal-content-store.ts`: legal content list/detail/create/update/delete.

Several stores fetch all backend pages by first loading page 1 and then requesting remaining pages in parallel.

## Feature Analysis

### Dashboard and Analytics

Dashboard pages call:

- `GET /admin/dashboard/overview`
- `GET /admin/dashboard/analytics`

Displayed data includes:

- Monthly income by regular vehicles
- Monthly income by premium vehicles
- Total platform income
- Yearly rider/driver registrations
- Yearly revenue chart

### App Configuration

App configuration calls:

- `GET /admin/config/`
- `PATCH /admin/config/`

The UI displays and edits:

- Base fare by vehicle type/tier/size
- Price per minute
- Driver share percentage

The backend model also supports `pricePerMile`, but the current edit UI focuses on base fares, per-minute pricing, and driver share.

### Driver Management

Driver management calls:

- `GET /admin/drivers`
- `GET /admin/drivers/:driverId`
- `GET /admin/drivers/:driverId/documents`
- `GET /admin/drivers/:driverId/documents/:type`
- `PATCH /admin/drivers/:driverId/documents/:type/review`
- `GET /admin/drivers/:driverId/history`
- `GET /admin/drivers/:driverId/reports`
- `PATCH /admin/drivers/:driverId/account-status`
- `DELETE /admin/drivers/:driverId`
- `DELETE /admin/drivers/:driverId/hard-delete`

Supported workflows:

- List and filter drivers.
- View driver profile and risk/status metrics.
- Review driver license, vehicle info, insurance, and registration.
- Approve or reject documents.
- View trip history and reports.
- Update driver account status.
- Permanently delete a driver.

### Rider Management

Rider management calls:

- `GET /admin/riders`
- `GET /admin/riders/:riderId`
- `GET /admin/riders/:riderId/history`
- `GET /admin/riders/:riderId/reports`
- `DELETE /admin/riders/:riderId`
- `DELETE /admin/riders/:riderId/hard-delete`

Supported workflows:

- List and filter riders.
- View rider profile, saved places count, trip count, ratings, and reports.
- View rider trip history.
- Permanently delete riders.

The backend also exposes rider account status update and restore endpoints; the current dashboard API/store does not wire those actions into the UI.

### Payments

Payment screens call:

- `GET /admin/riders/payments`
- `GET /admin/config/payment-share`
- `GET /admin/riders/:riderId/history/:tripId`

Displayed data includes:

- Driver name
- Total fare
- Driver earnings
- Platform received amount
- Payment status
- Trip detail, pickup/dropoff, distance, duration, reviews

### Customer Support

Customer support calls:

- `GET /admin/customer-support`
- `GET /admin/customer-support/:entryId`

Displayed data includes:

- Reporting party
- User type
- Email/contact
- Ticket/report status
- Complaint flag
- Ticket message
- Reported party
- Trip payload and admin action metadata

The backend supports taking actions and deleting support entries, but the current dashboard API only implements list/detail reads.

### Legal Content

Legal content calls:

- `GET /admin/legal-content/:type`
- `GET /admin/legal-content/:type/:contentId`
- `POST /admin/legal-content/:type`
- `PATCH /admin/legal-content/:type/:contentId`
- `DELETE /admin/legal-content/:type/:contentId`

Supported content types:

- `terms-and-conditions`
- `privacy-policy`

The dashboard uses shared legal content configuration to render both terms and privacy workflows.


## Operational Notes

- The `package.json` uses Next `^16.1.6`, while `eslint-config-next` is `15.5.6`; confirm compatibility before upgrading/building in production.
- `api/auth.ts` calls admin change password with `POST /admin/auth/change-password`, but the backend route is `PATCH /admin/auth/change-password`; this should be aligned before relying on that screen.
- Many pages are client components, which is appropriate because most screens depend on browser local storage auth state.
- The dashboard currently uses frontend-side pagination after loading all backend pages for several lists. That is acceptable for small datasets but can become expensive as records grow.
- The UI base API defaults to `https://api.ma3llc.co`; local development should set `NEXT_PUBLIC_API_BASE_URL`.
- Some page routes use placeholder dynamic segment names like `[slug]` even when the value is an id.
- There is no automated test setup beyond linting.
