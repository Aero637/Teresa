# Teresa – Full-Stack Tracking & Management System

Teresa is a full-stack tracking and management application designed to handle backend routes, database operations via Prisma, and an interactive user interface.

## Tech Stack

* **Backend:** Node.js, Express
* **Database & ORM:** PostgreSQL (Supabase), Prisma ORM
* **Frontend:** HTML5, JavaScript, CSS

---

## Project Structure

```text
Teresa/
├── prisma/
│   └── schema.prisma       # Database schema and models
├── src/
│   ├── routes/             # API route handlers (auth, production, sales)
│   └── index.js            # Express server entry point
├── frontend.js             # Frontend logic and client scripts
├── package.json            # Project dependencies and scripts
└── teresa_tracking_system_ui.html # Main user interface dashboard
Steps:

1. git clone [https://github.com/Aero637/Teresa.git](https://github.com/Aero637/Teresa.git)
cd Teresa

2. npm install

3. DATABASE_URL="your_supabase_postgresql_connection_string"

4. npx prisma db push

5. node src/index.js

6. Once you save this file, you can easily add, commit, and push it to your GitHub repository with these quick terminal commands:

```powershell
git add README.md
git commit -m "Add project README.md"
git push origin main
