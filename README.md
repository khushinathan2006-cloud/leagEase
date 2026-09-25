# LegalEase: AI-Powered Legal Document Generator ⚖️

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB.svg?logo=react)](https://react.dev)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4.svg?logo=google)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**LegalEase** leverages state-of-the-art Generative AI to simplify the creation of legal documents by providing customizable, accurate, and editable templates for contracts, NDAs, lease agreements, and employment contracts.

Developed as part of the **SmartBridge / SmartInternz** project specification.

---

## 🚀 Key Features

- **Automated AI Drafting:** Generate formal legal documents tailored to specific parties, dates, covenants, and jurisdictions.
- **Clause Library:** Browse and insert standard legal boilerplate provisions (Confidentiality, Indemnification, Liability Caps, IP Assignment, Arbitration, Force Majeure).
- **Document History & Versioning:** Switch seamlessly between drafts, rollback changes, or take manual snapshots.
- **Live Metrics:** Real-time word count, character count (with/without spaces), line count, and reading time estimation.
- **Plain-English Explainer & Risk Analysis:** Translates legal jargon into actionable summaries and flags critical clauses.
- **Multi-Format Export:** Instant export to **.PDF** (branded with headers/footers), **.DOCX** (Word with formatted tables & logo), and **.TXT**.

---

## 📁 Repository Structure

```
LegalEase/
├── ai_core/                    # Gemini AI prompt & model configuration
│   ├── __init__.py
│   └── gemini_generator.py
├── frontend/                   # Frontend app / components
│   └── app.py
├── legalEaseAPI/               # FastAPI endpoints & Pydantic models
│   ├── __init__.py
│   ├── main.py
│   └── routes.py
├── src/                        # Full web application (React, TypeScript, Tailwind)
│   ├── components/             # DocumentViewer, Form, History, ClauseLibrary
│   ├── utils/                  # PDF and DOCX export engines
│   ├── types.ts
│   └── presets.ts
├── server.ts                   # Express + Gemini backend server
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚡ Quickstart Guide

### 1. Clone & Set Up

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/LegalEase.git
cd LegalEase
```

### 2. Configure Environment

Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="your_google_gemini_api_key_here"
PORT=3000
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to start drafting legal agreements!

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
