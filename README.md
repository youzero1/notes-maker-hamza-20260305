# Notes Maker

A clean and simple Todo/Notes management app built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- ✅ Create, Read, Update, and Delete notes
- ✅ Toggle completion status
- ✅ Priority levels (Low, Medium, High) with color coding
- ✅ Category / tag support
- ✅ Search by title or description
- ✅ Filter by status (All, Pending, Completed) and priority
- ✅ Sort by creation date, title, or priority
- ✅ Mobile-responsive card-based layout
- ✅ Toast notifications for all operations
- ✅ SQLite database with TypeORM

## Project Structure

```
notes-maker/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/notes/
│   │       ├── route.ts          # GET all, POST
│   │       └── [id]/route.ts     # GET one, PUT, DELETE
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── NoteCard.tsx
│   │   ├── NoteForm.tsx
│   │   └── NoteList.tsx
│   ├── entities/Note.ts
│   ├── lib/database.ts
│   └── types/index.ts
├── data/                         # SQLite database (auto-created)
├── Dockerfile
├── docker-compose.yml
└── ...
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Install dependencies
npm i

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```bash
# Build and start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The application will be available at [http://localhost:3000](http://localhost:3000).

The SQLite database is persisted in a Docker volume named `notes_data`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/notes.db` | Path to the SQLite database file |
| `NEXT_PUBLIC_APP_NAME` | `Notes Maker` | App name shown in the UI |
| `NODE_ENV` | `development` | Node environment |
| `PORT` | `3000` | Server port |

## API Documentation

### GET /api/notes
Fetch all notes with optional filtering.

**Query Parameters:**
- `search` – Search in title and description
- `priority` – Filter by priority (`low`, `medium`, `high`)
- `status` – Filter by status (`all`, `pending`, `completed`)
- `sortBy` – Sort field (`createdAt`, `title`, `priority`)
- `sortOrder` – Sort direction (`asc`, `desc`)

**Response:** `{ data: Note[] }`

### POST /api/notes
Create a new note.

**Body:**
```json
{
  "title": "My Note",
  "description": "Optional description",
  "priority": "medium",
  "category": "Work"
}
```
**Response:** `{ data: Note, message: string }`

### GET /api/notes/:id
Fetch a single note by ID.

**Response:** `{ data: Note }`

### PUT /api/notes/:id
Update a note by ID.

**Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "high",
  "category": "Personal",
  "isCompleted": true
}
```
**Response:** `{ data: Note, message: string }`

### DELETE /api/notes/:id
Delete a note by ID.

**Response:** `{ message: string }`

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Tech Stack

- **Next.js 14** – React framework with App Router
- **TypeScript** – Type safety
- **TypeORM** – ORM for database operations
- **better-sqlite3** – Fast SQLite driver
- **CSS Modules** – Scoped component styles
