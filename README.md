# SplitEase 🧾💸

SplitEase is a modern bill-splitting and expense management application designed to make sharing expenses with friends, roommates, and groups effortless and transparent.

Track shared bills, see who owes what, settle balances, and stay organized — without the headache.

> 🚧 **This project is currently in active development.**  
> Features, APIs, and documentation are evolving.

---

## ✨ Features (Planned & In Progress)

- 👥 User authentication & secure sessions
- 📂 Group-based expense tracking
- 🧾 Add, split, and manage bills
- 💸 Automatic balance calculation (who owes whom)
- ✅ Settle expenses and track payment history
- 📊 Analytics & spending insights
- 🌗 Light / Dark mode support
- 📱 Responsive, modern UI

---

## 🛠️ Tech Stack

### Frontend

- **React**
- **React Router**
- **Framer Motion**
- **Tailwind CSS**
- **Sonner**
- **Lucide Icons**

### Backend

- **FastAPI**
- **JWT Authentication**
- **RESTful APIs**

### Database

- **PostgreSQL**

### Infrastructure / Tooling

- **NGINX**
- **Git & GitHub**

---

## 🧠 Architecture Overview

- Stateless authentication using **JWT**
- User context fetched via a `/me` endpoint on app load
- No user data stored in localStorage (security-first)
- Relational database schema optimized for:
  - Users
  - Groups
  - Bills
  - Participants
  - Settlements
- Smooth page & layout animations using Framer Motion

---

## 🚀 Getting Started

> ⚠️ This section will be completed once development stabilizes.

### Prerequisites

- Node.js
- PostgreSQL
- Package manager (npm / pnpm / yarn)
- Docker

### Installation

#### Backend

```bash
cd Backend
```

```bash
docker compose up --build
```

#### Frontend

```bash
cd Frontend
```

```bash
npm run dev
```
