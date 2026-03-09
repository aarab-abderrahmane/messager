<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/3/30/MSN_Messenger_logo.svg/1200px-MSN_Messenger_logo.svg.png" width="80" alt="DOT Messenger Logo"/>
</p>

<h1 align="center">DOT Messenger</h1>

<p align="center">
  <strong>The classic messenger. Reimagined as a full-stack web application.</strong>
</p>


<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-Express_5-green?logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/WebSocket-Native-orange?logo=websocket" alt="WebSocket"/>
  <img src="https://img.shields.io/badge/License-Proprietary-red" alt="License"/>
</p>

<p align="center">
  A modern full-stack web app that faithfully recreates the Windows Live Messenger 7 experience with real-time WebSocket communication, built with React 19, TypeScript, and Node.js.
</p>

---

## 🎯 Project Goal

This project was created to solve a real problem at school.

During computer science classes, the internet connection is often unstable or completely unavailable for long periods. Because of this, it becomes difficult for students to share exercises, summaries, or files with each other.

**DOT Messenger** is designed to work inside a **local network (LAN)**. As long as all users are connected to the same local network (for example the school's network), they can:

- Share exercises and summaries
- Send images or files
- Communicate in real time
- Receive announcements from the class

This means the platform **does not require an internet connection**. It only needs a local server running on the same network.

### Additional Features for School Usage

- **News / Announcements Panel (in development)**  
  Teachers or students can post important information such as:
  - Upcoming exams
  - Assignment deadlines
  - Class announcements

- **Account Registration**
  - Each email can only be registered once
  - Each IP address can only create one account
  - This helps prevent spam or multiple fake accounts

- **Basic Server Protection**
  The server includes validation, rate limiting, and other protections to prevent common attacks.

The project is still under active development and more features will be added in future versions.


## ✨ Features

| Feature | Description |
|---|---|
| 💬 **Real-time Messaging** | Instant delivery via native WebSocket with typing indicators & message history |
| 📸 **Photo Sharing** | Send images with fullscreen preview, zoom controls, and 2MB server-side validation |
| 🎙️ **Voice Messages** | Record & send voice clips with Web Audio API and server-validated 1MB limit |
| 📄 **PDF Sharing** | Send up to 3 PDFs with inline previews, header validation & filename sanitization |
| 🎭 **GIFs & Stickers** | Giphy API integration + curated local sticker collection |
| 😍 **Reactions & Replies** | Emoji reactions (one per user, toggle) and threaded replies — all real-time |
| 🎨 **Themes** | Multiple WLM-inspired themes with font, color & size customization |
| 👥 **Online Contacts** | Live online/offline status sidebar via server-side USER_STATUS_UPDATE |
| 👤 **User Profiles** | Editable profile with 30+ classic avatars, creation date & user info |
| 🎁 **Gifts** | Animated gift messages — a modern take on MSN Winks |
| ✏️ **Text Formatting** | Rich text toolbar with bold, italic, and more styling |
| 📰 **Breaking News** | Live news panel with expandable cards, cover images & attachments |

---
<img width="1366" height="768" alt="Screenshot_2026-03-07_21_14_40" src="https://github.com/user-attachments/assets/aeeeaeec-ae1d-4502-b9df-198254119dbf" />
<img width="1366" height="768" alt="Screenshot_2026-03-07_21_16_32" src="https://github.com/user-attachments/assets/2276b417-71ef-488b-94a1-e29b9c735b2b" />
<img width="1366" height="768" alt="Screenshot_2026-03-07_21_17_14" src="https://github.com/user-attachments/assets/19a19869-f92e-4082-9a37-7e7a2829ca18" />
<img width="1366" height="768" alt="Screenshot_2026-03-07_21_17_28" src="https://github.com/user-attachments/assets/d3b6f069-9ca8-4e87-836c-711650971134" />


---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| ⚛️ React 19 | UI framework |
| 🔷 TypeScript | Type safety |
| 🎨 Tailwind CSS v4 | Styling |
| 🎞 Motion (Framer) | Animations |
| 🔶 Lucide React | Icons |
| ⚡ Vite | Build tool & dev server |

### Backend
| Technology | Purpose |
|---|---|
| 🟢 Node.js | Runtime |
| 🚂 Express 5 | HTTP server & REST API |
| 🔌 WebSocket (`ws`) | Real-time communication |
| 🛡️ Zod | Schema validation |
| 🔑 UUID | Token generation |
| 🔧 dotenv | Environment config |

---

## 🏗️ Architecture

```
Client (React) ──► WS Server ──► Handlers ──► Memory Store
                   │                │              │
                   ├─ Rate Limiter  ├─ Auth         ├─ userStore
                   └─ Auth Check    ├─ Message      └─ chatStore
                                    └─ Reaction
```

**Message Types:** `text` · `image` · `voice` · `pdf` · `sticker` · `gif` · `gift` · `nudge`

**Middleware Pipeline:** Auth → Token Rate Limiter → Validation → XSS Sanitization → Broadcast

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)

### 1. Clone the repository

```bash
git clone https://github.com/aarab-abderrahmane/messager.git
cd messager
```

### 2. Backend setup

```bash
cd server
npm install
cp .example.env .env
```

Configure `server/.env`:
```env
PORT=5000               # Express + WS server port
MAX_TOKENS=10           # Rate limiter token bucket size
JWT_SECRET=mysecretkey  # Auth secret
```

### 3. Frontend setup

```bash
cd ../frontEnd
npm install
```

### 4. Run both servers

```bash
# Terminal 1 — Backend
cd server && npm run dev     # http://localhost:5000

# Terminal 2 — Frontend
cd frontEnd && npm run dev   # http://localhost:3000
```

### 5. Open the app

- **Landing page:** [http://localhost:3000/landing.html](http://localhost:3000/landing.html)
- **Application:** [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
messager/
├── server/                        # Backend
│   ├── package.json
│   └── server/
│       ├── server.js              # Express + HTTP entry point
│       ├── config/socket.js       # WebSocket server setup
│       ├── controllers/           # signup, GIF proxy
│       ├── handlers/              # auth, message, reaction handlers
│       ├── memory/                # In-memory userStore & chatStore
│       ├── middleware/            # auth, rateLimiter, validation
│       ├── routes/chatRoutes.js   # REST API endpoints (/Dot)
│       └── services/              # broadcast, messageFactory
│
└── frontEnd/                      # Frontend
    ├── public/                    # Static assets, avatars, stickers
    │   └── landing.html           # Landing/documentation page
    └── src/
        ├── App.tsx                # Root — SignupPage or ChatPage
        ├── types.ts               # Message, UserData, NewsItem
        ├── constants.ts           # Avatars, stickers, emojis
        └── components/
            ├── common/            # TitleBar, Toast
            ├── signup/            # SignupPage
            └── chat/              # ChatPage + all dialogs
```

---

## 👤 Author

**Aarab Abderrahmane**

- GitHub: [@aarab-abderrahmane](https://github.com/aarab-abderrahmane)
- LinkedIn: [Aarab Abderrahmane](https://www.linkedin.com/in/aarab-abderrahmane-2b9509336/)

---

## 📄 License

This project is **proprietary software**. All rights reserved.  
See [LICENSE](./LICENSE) for full details.

**© 2026 Aarab Abderrahmane — Morocco**  
No part of this software may be copied, modified, distributed, or used without explicit written permission from the author.
