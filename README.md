☁️ Vaultify: Your Private, Decentralized Cloud

Vaultify is a Next.js + Filebase-powered decentralized cloud app that lets users upload, view, and manage their files through a modern, Apple-inspired interface — all without centralized servers.

It simulates a zero-knowledge storage model using Filebase’s decentralized S3-compatible layer (built on IPFS & Storj).

🚀 Tech Stack
Category	Technology	Purpose
Framework	Next.js 14 (App Router)	Modern React framework
Styling	Tailwind CSS	Clean, minimal Apple-style UI
Language	TypeScript	Safer, type-based JS
Storage	Filebase (S3-compatible)	Decentralized file persistence
Icons	Lucide React	Premium open-source icon set
Package Manager	pnpm	Fast, modern dependency manager
🧩 Core Features
Feature	Description
Decentralized File Storage	Files are uploaded directly to Filebase (IPFS network)
No Local Dependencies	Everything runs client-side + minimal Next.js backend routes
Zero-Backend Simulation	Uses Next.js API routes for S3 operations
Beautiful UI	Apple-like clean dashboard built with Tailwind
File Management	Upload, list, preview, download, and delete files easily
⚙️ Project Setup
1️⃣ Clone the repository
git clone https://github.com/<your-username>/vaultify.git
cd vaultify

2️⃣ Install dependencies
pnpm install

3️⃣ Add environment variables

Create .env.local in the project root:

NEXT_PUBLIC_FILEBASE_ACCESS_KEY=your_access_key_here
NEXT_PUBLIC_FILEBASE_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_FILEBASE_BUCKET_NAME=your_bucket_name_here

4️⃣ Run the development server
pnpm dev


Then open:
👉 http://localhost:3000

🧱 Filebase Integration Overview
Function	API Route	Purpose
Upload File	/api/upload	Uploads file to Filebase
List Files	/api/list-files	Lists all files in your Filebase bucket
Delete File	/api/delete-file	Removes selected file from Filebase
🧾 Folder Structure
app/
├── api/
│   ├── upload/route.ts
│   ├── list-files/route.ts
│   ├── delete-file/route.ts
│
├── dashboard/page.tsx      ← main UI
├── login/page.tsx
├── signup/page.tsx
├── layout.tsx
└── page.tsx

🛡️ Security Notes

Your .env.local contains private keys — it must never be uploaded to GitHub.

.gitignore already excludes it.

Filebase keys have limited scope for safe testing.

🧠 Development Notes

To deploy later, replace Filebase with your preferred backend or S3.

You can easily extend Vaultify to support:

Folder creation

User authentication with MongoDB or Firebase

File size & type validation

Dark mode

🧰 Commands Summary
Action	Command
Install dependencies	pnpm install
Start dev server	pnpm dev
Build for production	pnpm build
Lint code	pnpm lint
🏁 License

MIT License © 2025 — Built with ❤️ by Shameem Muhammed.
