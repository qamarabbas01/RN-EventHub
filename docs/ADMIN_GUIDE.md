# EventHub Admin Guide

This guide is for maintaining the project locally.

## Prerequisites

- Node.js (recommended: latest LTS)
- Expo CLI (via `npx expo` is fine)

## Running the app

```bash
npm install
npm run ios
# or: npm run android
# or: npm run web
```

## Firebase configuration

Firebase is configured in `firebase.ts` (Auth + Firestore).

- **Auth**: Email/password authentication
- **Firestore**: `events` collection is read for Home/Events and read/delete on Event Details

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

