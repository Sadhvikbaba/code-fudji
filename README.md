# 🧠 Code Fudji

**Code Fudji** is a real-time collaborative coding platform that enables multiple users to edit code, communicate via video calls, and chat — all within the same workspace. It’s designed for team coding, pair programming, teaching, and interviews.



---

## 🚀 Features

### 🧩 Real-Time Collaboration
- Live collaborative code editing with Monaco Editor
- Shared file system synced across all users in a room
- Conflict-free syncing using WebSockets and LiveKit

### 🎥 WebRTC Video Calling
- Peer-to-peer video/audio chat via LiveKit
- Auto connects when users join the same room
- Participants viewable in a floating UI

### 💬 Integrated Chat
- Live text chat beside the editor
- See who is typing and when messages were sent
- Supports markdown syntax

### 📁 File & Folder System
- Create, rename, delete files and folders
- Syncs in real-time with all users
- Tree structure with recursive folders

### 🌐 Room-Based Workspace
- Unique room ID for each coding session
- Participants who join the same room collaborate in real-time
- Join via room link or enter a room code manually

---

## 🛠 Tech Stack

| Layer     | Tech Used                              |
|-----------|----------------------------------------|
| Frontend  | React, TypeScript, Tailwind CSS        |
| Editor    | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| Backend   | Node.js, Express                       |
| Syncing   | LiveKit, WebRTC, WebSockets            |
| State     | Redux Toolkit                          |
| Auth/User | Basic room-based identity or login     |
| Hosting   | Vercel / Netlify / Render (your choice) |




