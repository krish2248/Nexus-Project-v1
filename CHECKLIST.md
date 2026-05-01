# Nexus Project - Build Checklist

> **Version**: v1.0
> **Status**: In Progress
> **Last Updated**: 2026-05-02

---

## Phase 1: Foundation (Days 1-42)

### 1.1 Initial Setup
- [x] Create GitHub repository
- [x] Add .gitignore for Node/Next.js
- [x] Add README.md with project overview
- [x] Add API.md documentation
- [x] Create initial UI mockup (Nexus.html)
- [x] Create comprehensive CHECKLIST.md
- [ ] Set up pnpm workspaces monorepo
- [ ] Configure Turborepo (turbo.json)
- [ ] Set up Docker environment (docker-compose.yml)
- [ ] Add .env.example with all variables

### 1.2 Database Schema (Prisma)
- [ ] Initialize Prisma in packages/db
- [ ] Design User model
- [ ] Design Account model
- [ ] Design Session model (NextAuth compatible)
- [ ] Design Workspace model
- [ ] Design WorkspaceMember model with Role enum
- [ ] Design Space model
- [ ] Design Channel model
- [ ] Design Note model
- [ ] Design NoteVersion model (FILO cap)
- [ ] Design Project model
- [ ] Design ProjectFile model
- [ ] Design FileVersion model (FILO cap)
- [ ] Design Message model
- [ ] Design DirectMessage model
- [ ] Design GroupDM model
- [ ] Design GroupDMMessage model
- [ ] Design VoiceRoom model
- [ ] Design VoiceSession model
- [ ] Design Notification model
- [ ] Design Subscription model
- [ ] Design WorkspaceFeatureGate model
- [ ] Design FileLibraryItem model
- [ ] Run first migration: `prisma migrate dev --name init`
- [ ] Create seed.ts with test data

### 1.3 Authentication (NextAuth.js)
- [ ] Install NextAuth v4
- [ ] Configure CredentialsProvider with email/password
- [ ] Set up bcrypt password hashing
- [ ] Configure PrismaAdapter
- [ ] Set up JWT strategy with session callback
- [ ] Create /api/auth/register endpoint
- [ ] Test: register → login → session → logout cycle

### 1.4 Invite System
- [ ] Design invite token flow
- [ ] POST /workspaces/:id/invites endpoint
- [ ] GET /invites/:token endpoint
- [ ] POST /invites/:token/accept endpoint
- [ ] Set up email delivery (Resend/Nodemailer)
- [ ] Handle expired token edge case
- [ ] Handle replay attack prevention
- [ ] Handle already-member edge case

### 1.5 Role-Based Access Control
- [ ] Build requireAuth middleware
- [ ] Build requireWorkspaceMember middleware
- [ ] Build requireRole middleware
- [ ] Apply middleware to all workspace routes
- [ ] Test role-level access control
- [ ] Add rate limiting on auth endpoints

### 1.6 Workspace CRUD
- [ ] Create workspace API endpoints
- [ ] Update workspace API endpoints
- [ ] Delete workspace API endpoints
- [ ] List workspaces API endpoint
- [ ] Workspace creation page UI
- [ ] Workspace switcher UI
- [ ] Create space modal UI
- [ ] Create channel modal UI
- [ ] Left sidebar with nested navigation

### 1.7 Basic Notes
- [ ] Set up Tiptap basic editor
- [ ] Auto-save with debounce (2s)
- [ ] POST /notes endpoint
- [ ] PATCH /notes endpoint
- [ ] GET /notes endpoint
- [ ] Optimistic UI ("Saving..." / "Saved")
- [ ] Nested folder sidebar
- [ ] Drag-and-drop folder reordering
- [ ] Emoji icons on notes/folders
- [ ] CRUD for folders

### 1.8 Basic Chat (REST Polling)
- [ ] POST /channels/:id/messages endpoint
- [ ] GET /channels/:id/messages endpoint (cursor pagination)
- [ ] Chat UI - message list
- [ ] Chat UI - input and send
- [ ] Poll every 3s (temporary)

### 1.9 File Uploads
- [ ] Presigned URL flow (POST /files/upload-url)
- [ ] Direct upload to R2/S3
- [ ] POST /files/confirm endpoint
- [ ] File preview modal
- [ ] Inline preview for images, PDFs, audio, video

### 1.10 UI/UX Improvements (Nexus.html Refactor)
- [x] Analyze current Nexus.html structure
- [x] Add working search/filter functionality
- [x] Add fully functional task management system
- [x] Add working notes system with localStorage
- [x] Add working chat messages with timestamps
- [x] Add working music player with progress bar
- [x] Add notification panel/dropdown
- [x] Add settings modal
- [x] Add sidebar navigation with page switching
- [x] Add keyboard shortcuts (Cmd+K)
- [x] Add responsive mobile support
- [x] Add localStorage persistence for all data

---

## Phase 2: Core Features (Days 43-98)

### 2.1 Block-Based Note Editor
- [ ] Migrate to Tiptap full block editor
- [ ] Heading, bullet, numbered lists
- [ ] Checklists, quotes, dividers, callouts
- [ ] Toggle blocks
- [ ] Code blocks with syntax highlighting
- [ ] Tables support
- [ ] Inline images and drag-and-drop media
- [ ] Markdown shortcuts
- [ ] Export to Markdown
- [ ] Export to PDF

### 2.2 Note Version History (FILO)
- [ ] Snapshot on every save
- [ ] FILO cap enforcement (5 for free)
- [ ] Diff viewer (what changed, when, by whom)
- [ ] Restore previous version
- [ ] Premium cap configuration

### 2.3 Real-Time Collaborative Editing
- [ ] Set up Yjs + y-websocket
- [ ] Presence cursors with names/colors
- [ ] Conflict-free editing
- [ ] Real-time sync

### 2.4 Inline Comments
- [ ] Block-level comment threads
- [ ] @mentions in comments
- [ ] Resolve/unresolve comments

### 2.5 Code/Project Management
- [ ] Monaco Editor integration
- [ ] File tree browser
- [ ] Edit files in browser
- [ ] Upload files
- [ ] Delete files
- [ ] Version history per file (FILO)
- [ ] Activity feed (who changed what, when)
- [ ] Contributor attribution
- [ ] Review/approval toggle

### 2.6 File Comments
- [ ] Line-level file comments
- [ ] Thread replies

---

## Phase 3: Real-Time Features (Days 99-154)

### 3.1 Socket.io Integration
- [ ] Set up Socket.io server
- [ ] Real-time chat (no more polling)
- [ ] Real-time presence
- [ ] Real-time notifications
- [ ] Typing indicators
- [ ] Online/offline status

### 3.2 Chat Features
- [ ] Emoji reactions
- [ ] Thread replies
- [ ] Message pinning
- [ ] @mentions with notifications
- [ ] Link previews
- [ ] Message editing (with "edited" label)
- [ ] Message deletion
- [ ] Read receipts

### 3.3 Voice/Video (LiveKit)
- [ ] Set up LiveKit
- [ ] Persistent voice channels
- [ ] Join/leave freely (Discord-style)
- [ ] Mute/unmute
- [ ] Deafen
- [ ] Push-to-talk
- [ ] Screen sharing
- [ ] Video toggle
- [ ] Music sharing in voice channels
- [ ] Direct voice/video calls via DMs
- [ ] Call history log

### 3.4 Search
- [ ] PostgreSQL full-text search
- [ ] Search across notes, messages, files
- [ ] Workspace-scoped search
- [ ] Search filters

---

## Phase 4: Premium & Polish (Days 155-196)

### 4.1 Stripe Integration
- [ ] Set up Stripe
- [ ] Per-workspace subscription
- [ ] Monthly/annual billing
- [ ] Webhook handling
- [ ] Premium feature gates
- [ ] Billing portal

### 4.2 Premium Features
- [ ] Extended version history
- [ ] Expanded file storage (50GB+)
- [ ] Call recording (with consent)
- [ ] Advanced permissions
- [ ] Priority support
- [ ] Workspace activity analytics

### 4.3 Notifications
- [ ] In-app push notifications
- [ ] Email notifications
- [ ] Notification preferences
- [ ] @mention notifications
- [ ] Task assignment notifications

### 4.4 Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright/Cypress)
- [ ] Load testing

### 4.5 Deployment
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Fly.io
- [ ] Set up managed PostgreSQL
- [ ] Configure Cloudflare R2
- [ ] Set up CI/CD pipeline
- [ ] Environment variables in production
- [ ] SSL certificates
- [ ] Domain configuration

### 4.6 Final Polish
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Mobile responsive final check
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Empty states
- [ ] Onboarding flow
- [ ] Documentation finalization

---

## Design System (Nexus UI)
- [x] Dark theme with GitHub-inspired colors
- [x] CSS custom properties
- [x] DM Sans + IBM Plex Sans fonts
- [x] Grid/Flexbox layouts
- [x] Responsive design
- [x] Smooth animations
- [x] Custom scrollbar
- [ ] Syne font for headings
- [ ] Grid overlay background
- [ ] Ambient glow blobs
- [ ] Card hover effects with backdrop-filter

---

## Legend
- `[x]` - Completed
- `[~]` - In Progress
- `[ ]` - Not Started
- `[-]` - Cancelled/Not Needed
