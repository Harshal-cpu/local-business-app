# Local Business Support App

A responsive frontend for connecting customers with verified local businesses.

## Features

- 📱 Fully responsive design (mobile, tablet, desktop)
- 🏪 Business listing with categories and filters
- ⭐ Ratings and reviews display
- 📍 Map view for nearby businesses
- 💬 WhatsApp integration for direct messaging
- 💳 UPI payment integration
- ✅ Verified business badges
- 🔍 Search functionality

## Tech Stack

- React 18
- React Router for navigation
- Tailwind CSS for styling
- Vite for fast development
- Lucide React for icons

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Header.jsx
│   ├── BusinessCard.jsx
│   └── FilterBar.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── BusinessDetail.jsx
│   └── MapView.jsx
├── data/            # Mock data
│   └── mockData.js
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Next Steps

- Integrate Google Maps API
- Connect to backend API
- Add authentication
- Implement real payment gateway
- Add more interactive features
