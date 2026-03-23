# FinTrack – Real-Time Stock Portfolio Dashboard

FinTrack is a full-stack MERN application that simulates a personal investment dashboard.
It allows users to virtually buy and sell stocks, track portfolio performance in real time,
and visualize investment analytics through an interactive dashboard.

The goal of this project was to understand how modern portfolio tracking platforms work
and implement a scalable full-stack architecture using real market data and secure authentication.

---

## Features

* Secure user authentication using JWT
* Virtual stock buying and selling with live price auto-fetch
* Real-time stock price integration via Finnhub API with in-memory caching
* Portfolio analytics — investment value, current value, profit/loss, return percentage
* Interactive allocation chart with stock distribution breakdown
* Full transaction history with BUY/SELL filter and stats
* Input validation on all forms with inline error messages
* Quick-select stock chips in Buy modal (AAPL, MSFT, TSLA, GOOGL etc.)
* Sell modal shows your current holdings and prevents overselling
* Redesigned dark theme UI with Syne + DM Sans fonts
* Protected routes and persistent login sessions


---

## Tech Stack

### Frontend
* React (Vite)
* TailwindCSS v4
* Axios
* Recharts
* Lucide React (icons)

### Backend
* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication

### External API
* Finnhub Stock API (real-time stock prices with 60s in-memory cache)

---

## Project Structure
```
fintrack/
├── server/
│   ├── config/           # Database config
│   ├── controllers/      # Route logic (auth, portfolio)
│   ├── middleware/        # JWT auth middleware
│   ├── models/           # Mongoose models (User, Portfolio, Transaction)
│   ├── routes/           # API routes
│   ├── services/         # Finnhub price fetching + cache
│   └── index.js
│
└── client/
    └── src/
        ├── api/          # Axios instance with auth interceptor
        ├── app/          # App router
        ├── components/
        │   ├── dashboard/    # SummaryCards, PortfolioTable, AllocationChart
        │   ├── layout/       # Sidebar, Navbar, Layout
        │   └── portfolio/    # BuyModal, SellModal, ActionButtons
        ├── context/      # Auth context
        ├── hooks/        # usePortfolio hook
        ├── pages/        # Dashboard, Login, Register, Transactions
        └── styles/       # Auth CSS
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/portfolio` | Get holdings | Private |
| GET | `/api/portfolio/summary` | Get live P/L summary | Private |
| GET | `/api/portfolio/price/:symbol` | Get live price for symbol | Private |
| GET | `/api/portfolio/transactions` | Get transaction history | Private |
| POST | `/api/portfolio/buy` | Buy a stock | Private |
| POST | `/api/portfolio/sell` | Sell a stock | Private |

---

## How to Run the Project Locally

### 1. Clone the Repository
```
git clone https://github.com/RishabhAgni2/fintrack-stock-portfolio.git
cd fintrack
```

### 2. Setup Backend
```
cd server
npm install
```

Create a `.env` file inside the **server** directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FINNHUB_API_KEY=your_finnhub_api_key
```

Start the backend:
```
npm run start
```

Backend runs at `http://localhost:5000`

---

### 3. Setup Frontend

Open a new terminal:
```
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## How It Works

1. Register an account and log in
2. On the Buy modal — select a stock from quick-select chips or type any symbol
3. The live price is automatically fetched from Finnhub API
4. Enter quantity — total investment is calculated instantly
5. On the Sell modal — your current holdings are shown as chips, live price auto-loads
6. All transactions are recorded and viewable on the Transactions page with filters
7. Dashboard shows real-time portfolio metrics and allocation chart

---

## Key Implementation Details

* **Price caching** — Finnhub prices are cached in memory for 60 seconds to avoid rate limiting
* **Average price tracking** — buying the same stock multiple times correctly updates the weighted average price
* **JWT persistence** — token stored in localStorage, attached to every request via Axios interceptor
* **Validation** — both frontend and backend validate quantity, symbol, and share ownership before any transaction