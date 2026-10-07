# BriefFlow — AI Meeting to Project CRM

> An AI-powered Meeting-to-Project CRM that turns meeting transcripts into structured projects and tasks, assigns work to the correct team members, and enforces role-based access control.

## Team

* **Team name:** Solo Developer
* **Developer:** Fabiha Hassan
* **Repository:** [Add GitHub repository URL]

## What Works

BriefFlow is a full-stack Meeting-to-Project CRM for NovaWorks Technologies.

The application currently supports:

* JWT-based authentication
* Three user roles:

  * **ADMIN**
  * **MANAGER**
  * **AGENT**
* Role-based navigation and access control
* Admin transcript processing
* AI-powered project and task extraction using Google Gemini
* Server-side transcript validation
* Automatic project and task creation in MongoDB
* Project and task persistence
* Role-filtered project views
* Role-filtered task views
* Project detail pages
* Agent-specific task visibility
* Team directory
* Protection against agents accessing other agents' tasks
* Transcript duplicate prevention using transcript hashing
* Fallback transcript extraction when Gemini is unavailable
* Empty states and error handling
* Responsive dark CRM interface

### Current Demo Flow

An administrator can:

1. Log in.
2. Open **Create from Transcript**.
3. Load or paste the NovaWorks meeting transcript.
4. Submit the transcript.
5. Gemini analyzes the transcript when a valid API key is configured.
6. BriefFlow extracts projects, managers, tasks, assignees, deadlines, and estimated hours.
7. The backend validates the extracted information.
8. Projects and tasks are saved to MongoDB.
9. Managers and agents see only the records allowed by their role.

The supplied meeting transcript produces:

* **3 projects**
* **12 tasks**

The three projects are:

* UrbanCart Website
* QuickServe Mobile App
* HelpDeskPro AI Assistant

## Technology Stack

* **Frontend:** React 19 + Vite
* **Backend:** Node.js + Express
* **Database:** MongoDB + Mongoose
* **AI:** Google Gemini API using `@google/generative-ai`
* **AI model:** Gemini 1.5 Flash
* **Authentication:** JWT-based authentication
* **Authorization:** Server-side role-based access control
* **Styling:** Custom CSS with a dark/mid-tone CRM interface

The Gemini API key is used only on the backend through the `GEMINI_API_KEY` environment variable. It is never placed in frontend/browser code.

## Application Structure

```text
BriefFlow/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## Links

* **Live application:** Not deployed
* **Demo video:** Add recording URL if required
* **Repository:** Add GitHub repository URL

The application is currently intended to be demonstrated locally.

---

# Requirements

Install the following before running BriefFlow:

* Node.js
* npm
* MongoDB
* Git
* A Google Gemini API key

The project contains separate frontend and backend applications.

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/briefflow
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
```

| Variable         | Purpose                          | Where configured |
| ---------------- | -------------------------------- | ---------------- |
| `PORT`           | Backend server port              | Backend          |
| `MONGODB_URI`    | MongoDB connection string        | Backend          |
| `GEMINI_API_KEY` | Google Gemini API authentication | Backend only     |
| `JWT_SECRET`     | JWT signing secret               | Backend          |

### Security

Never commit the real `.env` file.

The real API key, database credentials, and JWT secret should remain private.

Create a `.env.example` file containing placeholders:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/briefflow
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
```

Do not place `GEMINI_API_KEY` in the React frontend or expose it through Vite environment variables.

---

# Demo Login Accounts

All accounts below are fictional demo identifiers used by the application.

| Role    | Name        | Demo email                                                  | Password |
| ------- | ----------- | ----------------------------------------------------------- | -------- |
| Admin   | Admin       | [admin@novaworks.example](mailto:admin@novaworks.example)   | Demo123! |
| Manager | Ayesha Khan | [ayesha@novaworks.example](mailto:ayesha@novaworks.example) | Demo123! |
| Manager | Bilal Ahmed | [bilal@novaworks.example](mailto:bilal@novaworks.example)   | Demo123! |
| Manager | Hina Malik  | [hina@novaworks.example](mailto:hina@novaworks.example)     | Demo123! |
| Agent   | Ali Raza    | [ali@novaworks.example](mailto:ali@novaworks.example)       | Demo123! |
| Agent   | Hamza Shah  | [hamza@novaworks.example](mailto:hamza@novaworks.example)   | Demo123! |
| Agent   | Sara Noor   | [sara@novaworks.example](mailto:sara@novaworks.example)     | Demo123! |
| Agent   | Usman Tariq | [usman@novaworks.example](mailto:usman@novaworks.example)   | Demo123! |
| Agent   | Zain Abbas  | [zain@novaworks.example](mailto:zain@novaworks.example)     | Demo123! |
| Agent   | Maryam Asif | [maryam@novaworks.example](mailto:maryam@novaworks.example) | Demo123! |

The project includes a seeder for creating the ten demo users.

Re-running the seed process is designed to avoid duplicating the demo users.

---

# Run Locally

## 1. Clone the repository

```sh
git clone [YOUR_GITHUB_REPOSITORY_URL]
cd BriefFlow
```

Replace the repository URL with the actual GitHub repository URL.

## 2. Install backend dependencies

Open a terminal:

```sh
cd server
npm install
```

## 3. Install frontend dependencies

Open another terminal:

```sh
cd client
npm install
```

## 4. Configure MongoDB

Start MongoDB locally.

The default local database connection is:

```text
mongodb://localhost:27017/briefflow
```

If using MongoDB Atlas instead, replace `MONGODB_URI` with the Atlas connection string.

## 5. Configure environment variables

Inside:

```text
server/.env
```

add:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/briefflow
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
```

Replace the Gemini placeholder with your actual API key.

## 6. Seed the demo users

From the `server` directory:

```sh
npm run seed
```

This creates the ten demo accounts listed above.

## 7. Start the backend

From the `server` directory:

```sh
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

The API health endpoint is:

```text
http://localhost:5000/api/health
```

## 8. Start the frontend

In a second terminal:

```sh
cd client
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

Keep both the backend and frontend terminals running.

---

# How Judges Can Test

## 1. Admin Transcript Flow

Log in using:

```text
Email: admin@novaworks.example
Password: Demo123!
```

Open:

**Create from Transcript**

Use the supplied NovaWorks meeting transcript.

You can either:

* Paste the transcript manually, or
* Use **Load Official Meeting Transcript** if the button is available in the application.

Click:

**Create from Transcript**

When Gemini is available, the backend sends the transcript to Gemini for structured extraction.

The expected result is:

```text
3 Projects
12 Tasks
```

The projects are:

```text
UrbanCart Website
QuickServe Mobile App
HelpDeskPro AI Assistant
```

---

## 2. Inspect UrbanCart

Open:

**Projects → UrbanCart Website**

Expected:

* Manager: Ayesha Khan
* Client: UrbanCart Clothing
* Deadline: 20 October 2026
* Tasks: 4

The tasks include:

* Product catalog UI
* Demo cart UI
* Product and cart APIs
* Website integration and testing

---

## 3. Test Manager Access

Log out and log in as:

```text
Email: ayesha@novaworks.example
Password: Demo123!
```

Ayesha should only see projects she manages.

She should see:

```text
UrbanCart Website
```

She should not be able to access projects managed by Bilal or Hina.

---

## 4. Test Agent Access

Log in as:

```text
Email: ali@novaworks.example
Password: Demo123!
```

Ali should see:

* UrbanCart Website
* Only his assigned tasks

His tasks include:

* Product catalog UI
* Demo cart UI
* Website integration and testing

Ali should not see Hamza's tasks even though Hamza works on the same project.

---

## 5. Test Cross-Agent Protection

While logged in as Ali, attempting to directly request another agent's task ID must return:

```text
404 Not Found
```

This prevents an agent from obtaining another agent's task simply by changing the ID in the URL.

The same server-side RBAC rules apply to project access.

---

## 6. Test Hamza

Log in as:

```text
Email: hamza@novaworks.example
Password: Demo123!
```

Hamza's tasks span multiple projects.

He should see his assigned tasks from:

* UrbanCart Website
* QuickServe Mobile App

---

## 7. Test Persistence

Refresh the browser after creating the projects.

The generated projects and tasks should remain available because they are stored in MongoDB.

---

## 8. Test Modified Transcript

Modify a transcript value such as:

```text
10 hours
```

to:

```text
12 hours
```

or change a deadline.

Submit the modified transcript.

The extraction pipeline is designed to process the changed input rather than relying exclusively on a fixed output.

The fallback extraction engine also contains dynamic handling for the QuickServe integration hours and deadline.

---

# Role-Based Access Control

BriefFlow enforces authorization on the backend rather than relying only on frontend visibility.

## ADMIN

Admin can:

* View all projects
* View all tasks
* View the team directory
* Process meeting transcripts
* Create projects and tasks from transcripts

## MANAGER

A manager can:

* View projects they manage
* View tasks belonging to their projects
* View the team directory

A manager cannot access another manager's project through a direct API request.

## AGENT

An agent can:

* View projects containing their assigned tasks
* View only their own tasks
* View the team directory

An agent cannot access another agent's task by changing the task ID in the URL.

---

# API Endpoints

## Authentication

```text
POST /api/auth/login
GET  /api/auth/me
```

## Projects

```text
GET /api/projects
GET /api/projects/:id
```

## Tasks

```text
GET /api/tasks
GET /api/tasks/:id
```

## Team

```text
GET /api/team
```

## Transcript Processing

```text
POST /api/transcript/process
```

Transcript processing is restricted to authenticated administrators.

## Health

```text
GET /api/health
```

---

# AI Transcript Processing

The transcript processing pipeline is implemented on the backend.

The flow is:

```text
Meeting Transcript
        ↓
Admin submits transcript
        ↓
Authentication + ADMIN authorization
        ↓
Team directory loaded
        ↓
Gemini extraction
        ↓
Structured JSON
        ↓
Server-side validation
        ↓
Projects + Tasks
        ↓
MongoDB
```

The Gemini API key is read from:

```js
process.env.GEMINI_API_KEY
```

and passed to the Gemini client on the server.

If the Gemini API is unavailable, not configured, or encounters an API/network error, BriefFlow falls back to a deterministic extraction engine so that the demo flow can still operate.

---

# Transcript Validation

Before records are saved, the backend validates:

* Project manager exists
* Project manager has the `MANAGER` role
* Task assignee exists
* Task assignee has the `AGENT` role
* Estimated hours are positive
* Task deadline does not exceed the project deadline
* Required transcript content is present

The transcript processor also uses a SHA-256 transcript hash to prevent accidental duplicate processing of the same transcript.

If saving fails partway through processing, created records are removed to prevent partial project/task data.

---

# Deployment Details

## Deployment Status

**Local only — not deployed.**

There is currently no live application URL or hosted backend/database.

## Frontend

```text
Vite development server
http://localhost:5173
```

## Backend

```text
Express development server
http://localhost:5000
```

## Database

```text
MongoDB
mongodb://localhost:27017/briefflow
```

The application has been tested locally with MongoDB.

## AI

Google Gemini API is accessed from the backend using the configured `GEMINI_API_KEY`.

Because the project is local-only, the Gemini API key must be configured in the local backend `.env` file.

---

# How We Run the Project

### Terminal 1 — Backend

```sh
cd server
npm install
npm run dev
```

### Terminal 2 — Frontend

```sh
cd client
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

MongoDB must also be running.

---

# Known Limitations

* The application is not currently deployed.
* Judges need to run the project locally.
* MongoDB must be available locally or through a configured MongoDB connection string.
* A valid Gemini API key is required for live Gemini extraction.
* If Gemini is unavailable, the application uses the built-in fallback extraction engine.
* There is no production hosting configuration.
* There is no hosted database.
* There is no email verification or password-reset flow because the supplied demo accounts are used directly.
* The current project focuses on the core Meeting-to-Project CRM workflow rather than additional CRM features such as billing, notifications, analytics, or advanced search.

---

# Submission Summary

* **Project:** BriefFlow — AI Meeting to Project CRM
* **Source repository:** [Add GitHub repository URL]
* **Live application:** Not deployed
* **Demo video:** [Add recording URL if required]
* **Database:** MongoDB
* **AI:** Google Gemini
* **Authentication:** JWT
* **Roles:** ADMIN, MANAGER, AGENT
* **Demo users:** 10 seeded accounts
* **Transcript automation:** Implemented
* **Project creation:** Implemented
* **Task creation:** Implemented
* **Role-based filtering:** Implemented
* **Project details:** Implemented
* **Agent task view:** Implemented
* **Team directory:** Implemented
* **Persistence:** Implemented
* **Server-side RBAC:** Implemented
* **Local demo:** Working
* **Deployment:** Not completed
