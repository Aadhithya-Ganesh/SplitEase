# SplitEase 🧾💸

SplitEase is an intelligent expense management platform that simplifies how groups track, split, and settle shared costs. Designed for real-world scenarios like trips, roommates, and group spending, it combines automated expense tracking with clear balance calculations to eliminate confusion.

With features like smart bill splitting, real-time balance updates, and seamless settlement tracking, SplitEase ensures everyone knows exactly who owes what — making shared finances transparent, accurate, and stress-free.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🧠 Architecture Overview](#-architecture-overview)
- [🚀 Getting Started](#-getting-started)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [📧 Contact](#-contact)

## ✨ Features

- 👥 User authentication & secure sessions
- 📂 Group-based expense tracking
- 🧾 Add (Manually or Scanned), split, and manage bills
- 💸 Automatic balance calculation (who owes whom)
- ✅ Settle expenses and track payment history
- 📊 Analytics & spending insights
- 🌗 Light / Dark mode support
- 📱 Responsive, modern UI

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

### Deployments

- **Docker**
- **Kubernetes**

### AI Tools

- **OpenAI**
- **Llamaparse**

## 🧠 Architecture Overview

- Stateless authentication with **JWT**, ensuring scalable and decoupled session management
- Centralized user context via /me endpoint, fetched on app initialization for consistent state hydration
- Security-first design with no sensitive user data stored in localStorage
- Normalized relational database schema modeling core entities:
  - Users
  - Groups
  - Bills
  - Participants
  - Settlements
- Efficient data relationships enabling accurate balance computation and transaction tracking
- Smooth, declarative UI transitions powered by Framer Motion for enhanced user experience

## 🚀 Getting Started

### ✅ Prerequisites

Ensure you have Docker installed before proceeding. You can download it here:

🔗 [Docker install Guide](https://www.docker.com/get-started/)

### Installation

#### 1. Github

```bash
git clone https://github.com/Aadhithya-Ganesh/SplitEase.git
```

```bash
cd SplitEase
```

#### 2. Run the application

```bash
docker compose up --build
```

### Visit the website at "localhost"

## 🤝 Contributing

We welcome contributions! 🎉 To contribute, follow these steps:

1. **Fork the repository.**
2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "Add your awesome feature"
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a pull request.** 🚀

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE.txt) file for details. 🐜

---

## 📧 Contact

For questions or feedback, feel free to reach out:

- **Email**: aadhithyag2000@gmail.com 📩
- **GitHub Issues**: [Open an Issue](https://github.com/Aadhithya-Ganesh/SplitEase/issues) 🐛

---
