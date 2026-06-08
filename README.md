# PlayFair

A habit-gating gaming tracker that rewards productivity with playtime. Complete daily tasks to unlock gaming minutes — the more you build, the more you play.

## Features

- **Task-based unlock system** — Define daily, weekly, or custom habits. Each completed task earns configurable gaming minutes (default: 30 min/task, 120 min daily cap)
- **Session tracking** — Start/stop timer per game. Sessions are capped to earned time; excess playtime is trimmed automatically
- **IGDB integration** — Search and add real games with cover art, descriptions, and metadata via the IGDB API
- **Smart reminders** — Schedule time-based or session-based reminders with day-of-week targeting
- **Analytics dashboard** — Visualize playtime trends (7d/30d), session history, and task completion rates
- **Push notifications** — Background worker checks for pending reminders and sends Expo push notifications
- **Secure authentication** — JWT-based auth with bcrypt password hashing and rate-limited endpoints

## Tech Stack

### Frontend (Mobile)
| Technology | Purpose |
|---|---|
| React Native 0.81 (Expo SDK 54) | Mobile framework |
| Expo Router 6 | File-based navigation |
| TypeScript | Type safety |
| NativeWind (Tailwind CSS v3) | Styling |
| Axios | HTTP client with interceptors |
| Context API | Global state (Auth, Session, Unlock) |
| expo-secure-store | JWT token storage |
| react-native-chart-kit | Analytics visualizations |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 4 | REST API |
| PostgreSQL 15+ | Relational database (9 tables) |
| Zod | Input validation |
| JWT + bcrypt | Authentication |
| express-rate-limit | Auth endpoint protection |
| Helmet | Security headers |
| IGDB API | Game metadata |
| Expo Push API | Notifications |

## Architecture Overview

```
┌──────────────────┐     ┌───────────────────┐     ┌─────────────┐
│  React Native    │────▶│  Express REST API │────▶│ PostgreSQL  │
│  (Expo SDK 54)   │     │  (Zod, JWT, Helm) │     │ (9 tables)  │
│                  │     │                   │     │             │
│  Context API     │◀────│  Controller →     │     │ IGDB Data   │
│  Axios + JWT     │     │  Service → Pool   │     │             │
└──────────────────┘     └───────────────────┘     └─────────────┘
         │                         │
         │              ┌──────────────────┐
         └──────────────│ Notification     │
                        │ Worker (60s poll)│
                        └──────────────────┘
```

**Data flow:**
1. User completes a task → `PATCH /api/tasks/:id/daily-status`
2. Unlock rule recalculates available minutes (`GET /unlock-rules/available-time`)
3. User starts a game session → `POST /api/games/:id/sessions/start` (creates active session with `started_at`)
4. User stops session → `POST /api/games/:id/sessions/end` (caps duration to available time, updates `playtime_hours`)
5. Analytics queries aggregate sessions and task completion by date range

## Installation & Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your Android/iOS device
- IGDB API credentials (Twitch Developer account)

### Backend Setup

```bash
cd playFair_Backend

# Install dependencies
npm install

# Create the database
createdb playfair_db

# Run the schema
psql -d playfair_db -f database/schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, IGDB credentials

# Start the server
node server.js
# Server runs on http://0.0.0.0:3000
```

### Frontend Setup

```bash
cd playFair_Android

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your backend URL: EXPO_PUBLIC_API_URL=http://<your-ip>:3000

# Start Expo
npm start

# Run on device
npm run android
# Scan the QR code with Expo Go
```

### Environment Variables

**Backend (`.env`):**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/playfair_db
JWT_SECRET=your-secret-key
TWITCH_CLIENT_ID=your-twitch-client-id
TWITCH_CLIENT_SECRET=your-twitch-client-secret
PORT=3000
```

**Frontend (`.env`):**
```
EXPO_PUBLIC_API_URL=http://<your-local-ip>:3000
```

## Usage

1. **Sign up** — Create an account with email/password. A default unlock rule (30 min/task, 120 min daily) is created automatically.
2. **Add tasks** — Create daily, weekly, or custom-schedule habits from the Dashboard tab.
3. **Add games** — Search IGDB for real games or add manually from the Games tab.
4. **Complete tasks** — Check off tasks on the dashboard. Each completion adds minutes to your gaming pool.
5. **Start a session** — Tap a game card to begin a timed session. The timer tracks real playtime.
6. **End a session** — Stop the session. Duration is capped to your available minutes; any excess is discarded.
7. **Track progress** — View playtime charts, session history, and task completion rates in Analytics.

## Folder Structure

```
playFair_Backend/
├── config/           # Database connection pool
├── controllers/      # Request/response handlers
├── services/         # Business logic and DB queries
├── routes/           # Express route definitions
├── middleware/       # Auth, validation, error handling
├── validators/       # Zod schemas for input validation
├── utils/            # Shared helpers (ApiError, date utils)
├── workers/          # Background notification worker
├── database/         # Schema SQL and migrations
├── tests/            # Jest test files
├── app.js            # Express app configuration
└── server.js         # Entry point

playFair_Android/
├── app/              # Expo Router screens (file-based)
│   ├── (auth)/       # Sign in / Sign up
│   └── (tabs)/       # Dashboard, Games, Analytics, Profile
├── features/         # Domain modules (auth, dashboard, games, reminders, tracking)
├── components/       # Shared UI components
├── context/          # React Context providers (Session, Unlock)
├── hooks/            # Custom React hooks
├── lib/              # API client, token store, utilities
└── assets/           # App icons and splash screens
```

## API Endpoints

### Authentication
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | No | Register new user |
| POST | `/auth/signin` | No | Login, returns JWT |
| POST | `/auth/push-token` | Yes | Save Expo push token |

### Tasks
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/tasks` | Yes | Create task |
| GET | `/api/tasks` | Yes | List tasks (`?active=true`) |
| GET | `/api/tasks/daily-status` | Yes | Get daily status summary (`?date=YYYY-MM-DD`) |
| PATCH | `/api/tasks/:id` | Yes | Update task |
| PATCH | `/api/tasks/:id/daily-status` | Yes | Toggle daily completion |
| DELETE | `/api/tasks/:id` | Yes | Soft delete task |

### Games
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/games` | Yes | List user games |
| POST | `/games` | Yes | Create game manually |
| PATCH | `/games/:id` | Yes | Update game |
| DELETE | `/games/:id` | Yes | Delete game |
| POST | `/games/igdb` | Yes | Add game from IGDB |
| GET | `/igdb/search` | Yes | Search IGDB (`?q=query`) |

### Sessions
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/games/:id/sessions/start` | Yes | Start gaming session |
| POST | `/api/games/:id/sessions/end` | Yes | End active session |
| GET | `/api/games/:id/sessions` | Yes | Session history by game |
| GET | `/api/sessions/active` | Yes | Get current active session |

### Reminders
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/reminders` | Yes | Create reminder |
| GET | `/api/reminders` | Yes | List reminders |
| PATCH | `/api/reminders/:id` | Yes | Update reminder |
| DELETE | `/api/reminders/:id` | Yes | Delete reminder |

### Analytics & Unlock Rules
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/analytics/playtime` | Yes | Playtime stats (`?range=7d/30d`) |
| GET | `/api/analytics/sessions` | Yes | Session statistics |
| GET | `/api/analytics/tasks` | Yes | Task completion rate |
| GET | `/unlock-rules` | Yes | Get user unlock rule |
| POST | `/unlock-rules` | Yes | Create/update unlock rule |
| GET | `/unlock-rules/available-time` | Yes | Get available gaming minutes |

## Database Schema

9 tables with cascade-delete foreign keys:

```
users ──┬── gameList ── games ── game_sessions
        │                       │
        ├── tasks ── task_daily_status
        ├── unlock_rules
        ├── reminders ──────────┘
        └── notification_queue
```

Key constraints:
- One `gameList` per user (unique FK)
- One `unlock_rules` per user (unique FK)
- One active session per user (partial unique index: `WHERE ended_at IS NULL`)
- One `task_daily_status` per task per date (unique constraint)

## Screenshots




## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

## License

This project is for personal/educational use. No license file is included.
