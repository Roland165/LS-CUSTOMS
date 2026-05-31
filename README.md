```
     _       ____       ____                 _                             
    | |     / ___|     / ___|  _   _   ___  | |_    ___    _ __ ___    ___ 
    | |     \___ \    | |     | | | | / __| | __|  / _ \  | '_ ` _ \  / __|
    | |___   ___) |   | |___  | |_| | \__ \ | |_  | (_) | | | | | | | \__ \
    |_____| |____/     \____|  \__,_| |___/  \__|  \___/  |_| |_| |_| |___/
```

# BUILD YOUR FUTURE SPORTS CAR

**By Max BORTOLOTTI and Roland FONTANES**

Welcome to Los Santos CUSTOMS, where your dream car comes to life. Born from a passion for performance and esthetics, LS CUSTOMS was founded to build your perfect vehicle. Our goal is to craft your own vision of mechanics and freedom, because each car is a part of you and you deserves the best.

---

## The Project

The project is based on:
- **Brands** — the car manufacturers
- **Cars** — different models from those brands
- **Features** — different extras to customize your car
- **Stores** — different locations where we customize your car and where you can come to retrieve it

**Business rules:**
- A Brand can produce 0 or N Cars (if it is still in development)
- A Car is produced by 1 and only 1 Brand
- A Car is available in 0 or N Stores (sometimes we are waiting for our supplier to bring us one)
- A Car can have 0 or N Features (all Features are not compatible with every car)
- A Feature can be on 0 or N Cars
- A Feature can be in 0 or N Stores (sometimes we are waiting for our supplier)
- A Store can have 0 or N Cars (if all Cars have been already purchased)
- A Store can have 0 or N Features (if all Features have been already purchased)
- The "associated with" entity brings together the Store, the Car and the Features to create the customer's wish

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue.js 2, Bootstrap 5, Axios |
| Backend | Node.js, Express |
| Auth | Passport.js + express-session |
| Database | MySQL (local) / JSON files (Vercel) |
| Deploy | Vercel |

---

## Data Modes

The backend supports two data modes controlled by a single environment variable:

| Mode | `USE_DB` | Description |
|---|---|---|
| **DB mode** | `true` (default) | MySQL database — full read/write, requires local setup |
| **JSON mode** | `false` | Static JSON files — read-only, no database needed, perfect for Vercel |

In JSON mode, browsing cars, features and stores, and the full purchase/customization flow all work. Admin write operations (add/edit/delete) are disabled and return an error message.

---
## Option A — Go on Vercel (no database needed)

https://ls-customs.vercel.app

Log-in :
=> admin admin
or
=> user user

---
## Option B — Run locally with a MySQL database

### Requirements
- [Node.js](https://nodejs.org/) >= 6
- [MySQL](https://dev.mysql.com/downloads/) or [MariaDB](https://mariadb.org/download/)

### 1. Clone the repository

```bash
git clone https://github.com/Roland165/LS-CUSTOMS.git
cd LS-CUSTOMS
```

### 2. Set up the database

Open your MySQL client (MySQL Workbench, DBeaver, command line...) and run the three SQL scripts in order:

```sql
-- 1. Create the schema and all tables
source back-end/lscustoms_create.sql

-- 2. Drop everything if you need a clean reset (optional)
source back-end/lscustoms_drop.sql

-- 3. Insert all the data (brands, cars, features, stores...)
source back-end/lscustoms_insert.sql
```

Or from the command line:

```bash
mysql -u root -p < back-end/lscustoms_create.sql
mysql -u root -p < back-end/lscustoms_insert.sql
```

### 3. Configure the backend environment

Create a `.env` file inside `front-end/webapp_serverside/`:

```env
USE_DB=true

DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_DATABASE=lscustoms

WEB_PORT=9000
SESSION_SECRET=your_random_secret_string
CORS_ORIGIN=http://localhost:8081
```

### 4. Install dependencies and start the backend

```bash
cd front-end/webapp_serverside
npm install
npm start
```

The API server starts on `http://localhost:9000`.

### 5. Install dependencies and start the frontend

Open a second terminal:

```bash
cd front-end/webapp_clientside
npm install
npm run dev
```

The app opens at `http://localhost:8081`.

### Default accounts

| Username | Password | Role |
|---|---|---|
| `admin` | `admin` | Admin (full access) |
| `user` | `user` | User |

> Note: passwords are hashed with SHA-224 in the database. To add more users run the INSERT in `back-end/lscustoms_insert.sql` or use the registration form.

---

## Project Structure

```
LS-CUSTOMS/
├── back-end/
│   ├── lscustoms_create.sql       -- creates the schema and all tables
│   ├── lscustoms_insert.sql       -- inserts all the initial data
│   └── lscustoms_drop.sql         -- drops everything (clean reset)
│
├── front-end/
│   ├── webapp_clientside/         -- Vue.js frontend
│   │   └── src/components/        -- Vue components (Home, Purchase, Auth, Admin...)
│   │
│   └── webapp_serverside/         -- Express.js backend
│       ├── controllers/           -- API routes (cars, brands, features, stores, auth)
│       ├── utils/
│       │   ├── config.js          -- USE_DB toggle (single source of truth)
│       │   ├── db.include.js      -- MySQL connection pool
│       │   ├── cars.repository.js
│       │   ├── brands.repository.js
│       │   ├── features.repository.js
│       │   ├── store.repository.js
│       │   ├── users.repository.js
│       │   └── users.auth.js      -- Passport.js configuration
│       ├── data/                  -- Static JSON files used when USE_DB=false
│       │   ├── brands.json
│       │   ├── cars.json
│       │   ├── features.json
│       │   ├── stores.json
│       │   ├── conn_c_s.json      -- car <-> store links
│       │   ├── conn_cs_f.json     -- car+store <-> feature links
│       │   └── users.json         -- demo users (plain-text passwords, JSON mode only)
│       └── server.js
│
├── diagrams/                      -- UML and architecture diagrams
├── vercel.json                    -- Vercel deployment configuration
└── README.md
```

---

## Diagrams

The `diagrams/` folder contains:
- ER diagram
- Class diagram
- UML sequence / activity / component diagrams
- Wireframes
- Gantt chart
