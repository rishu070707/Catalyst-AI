# Catalyst-AI

Catalyst-AI is an intelligent platform designed for customer engagement, mission planning, and analytics. It features a modern React frontend, an Express-based Node.js backend integrating with Prisma and the Groq SDK, and a dedicated simulator service for webhook events and data generation.

## Architecture

![Architecture Diagram](./architectural%20diagram.png)

The repository is structured as a workspace with the following packages:

- **`frontend`**: A React application built with Vite, utilizing Tailwind CSS for styling, TanStack Query for data fetching, and Recharts for analytics visualization.
- **`backend`**: An Express server handling API requests, business logic, and database operations via Prisma. It interacts with the Groq API for AI-driven features.
- **`simulator`**: A standalone Express service that simulates external events, webhooks, and customer interactions to test system capabilities and populate data.
- **`shared`**: Shared TypeScript types, events, and interfaces used across the workspace.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm
- A PostgreSQL database
- A Groq API Key

## Getting Started

### 1. Installation

Install the dependencies from the root directory:

```bash
npm install
```

This will automatically bootstrap the dependencies for all workspace packages (`backend`, `frontend`, `simulator`, and `shared`).

### 2. Environment Configuration

Navigate to the `backend` directory and configure your environment variables. You will need a `.env` file containing at least the following:

```env
DATABASE_URL="your_postgresql_connection_string"
PORT=3000
GROQ_API_KEY="your_groq_api_key"
```

### 3. Database Setup

Navigate to the backend directory to generate the Prisma client and push the schema to your database:

```bash
cd backend
npx prisma generate
npx prisma db push
```

If you have a seed script available, you can also run it to populate initial data:
```bash
npm run prisma db seed
```

### 4. Running the Services

Start each service from its respective directory. It is recommended to run these in separate terminal windows.

**Backend Server:**
```bash
cd backend
npm run dev
```

**Frontend Application:**
```bash
cd frontend
npm run dev
```

**Simulator Service:**
```bash
cd simulator
npm run dev
```

## Stack Overview

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Recharts.
- **Backend**: Node.js, Express, TypeScript, Prisma (ORM), Groq SDK.
- **Simulator**: Node.js, Express, Axios.
