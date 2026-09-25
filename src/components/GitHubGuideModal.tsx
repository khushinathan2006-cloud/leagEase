import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Terminal,
  FolderTree,
  GitBranch,
  FileText,
  ExternalLink,
  Code2,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface GitHubGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubGuideModal: React.FC<GitHubGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'commands' | 'structure' | 'code' | 'readme'>('prompt');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const copyPastePrompt = `Role: You are an expert software developer and developer advocate.
Goal: Help me create a complete project from scratch in Visual Studio Code and publish it to a new public repository on my GitHub account.
Please guide me step-by-step through the following process:
1. Project Setup in VS Code:
* How to create the project directory and open it in VS Code.
* Recommended project structure (folders, files, .gitignore, README.md, and environment configuration if needed).
* Basic setup for the core code files so I have a working boilerplate.

2. Local Git Initialization:
* Commands to initialize Git locally (git init).
* How to stage and commit the initial files (git add, git commit).
* Setting the default branch to main.

3. GitHub Repository Creation & Push:
* How to create a new repository on GitHub (via GitHub website or VS Code GitHub extension / GitHub CLI).
* How to link the local repository to the remote GitHub repository (git remote add origin ...).
* How to push the code up (git push -u origin main).

4. Writing a Professional README:
* Give me a clean, structured README.md template including project title, description, features, installation, usage instructions, and tech stack used.

Formatting Instructions:
* Keep each step clear, concise, and easy to follow.
* Provide exact terminal commands to run in the VS Code integrated terminal.
* Ask me what type of project/technology stack I am building before providing language-specific starter files (e.g., Python, Node.js/React, HTML/CSS/JS, FastAPI).`;

  const pythonRequirements = `# LegalEase Requirements
fastapi==0.110.0
uvicorn==0.28.0
streamlit==1.32.2
google-generativeai==0.4.1
python-docx==1.1.0
fpdf2==2.7.8
Pillow==10.2.0
requests==2.31.0
python-dotenv==1.0.1
pydantic==2.6.4`;

  const pythonMainPy = `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from legalEaseAPI.routes import router

app = FastAPI(
    title="LegalEase - AI Legal Document Generator",
    description="FastAPI Backend for AI-powered legal contract generation",
    version="1.0.0"
)

# Enable CORS for local Streamlit frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include document generation router
app.include_router(router)

@app.get("/")
def home():
    return {"message": "Welcome to LegalEase AI Legal Document Generator API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("legalEaseAPI.main:app", host="0.0.0.0", port=8000, reload=True)`;

  const pythonRoutesPy = `from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ai_core.gemini_generator import GeminiDocumentGenerator

router = APIRouter()
gemini_generator = GeminiDocumentGenerator()

class DocumentRequest(BaseModel):
    document_type: str
    parties: str
    terms: str
    dates: str

@router.post("/generate")
def generate_legal_document(request: DocumentRequest):
    try:
        response = gemini_generator.generate_document(
            document_type=request.document_type,
            parties=request.parties,
            terms=request.terms,
            dates=request.dates
        )
        return {"document": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))`;

  const pythonGeminiGenerator = `import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class GeminiDocumentGenerator:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set in .env")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def generate_document(self, document_type: str, parties: str, terms: str, dates: str) -> str:
        prompt = f"""Generate a comprehensive legal document titled '{document_type}'
Involved parties: {parties}
Effective Date: {dates}
Terms and conditions: {terms}

Ensure formal legal structure with multiple sections and legal clauses, including recitals, operational obligations, termination rules, governing law, and dual signature blocks.
"""
        response = self.model.generate_content(prompt)
        return response.text`;

  const pythonStreamlitApp = `import streamlit as st
import requests
import os
from docx import Document
from fpdf import FPDF
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(page_title="LegalEase", layout="centered", page_icon="⚖")

# Center Logo / Header
col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    st.markdown("<h1 style='text-align: center;'>⚖ LegalEase</h1>", unsafe_allow_html=True)
    st.markdown("<h3 style='text-align: center; color: #94a3b8;'>AI Legal Document Generator</h3>", unsafe_allow_html=True)

st.markdown("---")

# User inputs
doc_type = st.text_input("Document Type", placeholder="e.g. Freelance Work Contract, NDA, Residential Lease")
parties = st.text_area("Parties Involved", placeholder="e.g. Jane Doe (Service Provider), TechNova Inc. (Client)")
terms = st.text_area("Terms & Conditions (Use semicolons for bullet points)", placeholder="Payment within 7 days; Confidentiality preserved; 14 days notice")
dates = st.text_input("Effective Date", placeholder="e.g. April 15, 2025")

if st.button("Generate Document", type="primary"):
    with st.spinner("LegalEase AI is generating your document..."):
        try:
            payload = {
                "document_type": doc_type,
                "parties": parties,
                "terms": terms,
                "dates": dates
            }
            res = requests.post("http://localhost:8000/generate", json=payload)
            if res.status_code == 200:
                st.session_state["generated_text"] = res.json()["document"]
                st.success("Document Generated Successfully!")
            else:
                st.error("Backend error: " + res.text)
        except Exception as e:
            st.error(f"Could not connect to FastAPI backend: {e}")

if "generated_text" in st.session_state:
    st.markdown("### Preview")
    st.markdown(st.session_state["generated_text"])
    
    if st.checkbox("Click to Edit Document"):
        st.session_state["generated_text"] = st.text_area("Edit Document Below:", st.session_state["generated_text"], height=350)
    
    st.download_button(
        "Download as .TXT",
        data=st.session_state["generated_text"],
        file_name=f"{doc_type.lower().replace(' ', '_')}.txt",
        mime="text/plain"
    )`;

  const readmeContent = `# LegalEase: AI-Powered Legal Document Generator ⚖️

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Streamlit](https://img.shields.io/badge/Frontend-Streamlit-FF4B4B.svg?logo=streamlit)](https://streamlit.io)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4.svg?logo=google)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**LegalEase** leverages state-of-the-art Generative AI to simplify the creation of legal documents by providing customizable, accurate, and editable templates for contracts, NDAs, lease agreements, and employment contracts.

---

## 🚀 Key Features

- **Automated AI Drafting:** Generate formal legal documents tailored to specific parties, dates, covenants, and jurisdictions.
- **Customizable Clauses:** Semicolon-delimited terms parser dynamically inserts enforceable operational clauses.
- **Interactive In-line Editor:** Real-time editing and text sanitization before finalizing.
- **Multi-Format Export:** Instant export to **.PDF**, **.DOCX** (Word with formatted tables & logo), and **.TXT**.
- **Plain-English Explainer:** Translates legal jargon into actionable summaries for non-lawyers.

---

## 🏗️ System Architecture

\`\`\`
[ Streamlit Frontend (app.py) ] 
            ↓ HTTP POST /generate
[ FastAPI Backend (main.py, routes.py) ]
            ↓ SDK Prompt
[ Google Gemini AI Engine ]
            ↓ Generated Legal Clauses
[ Formatting Modules (.docx, .pdf, .txt) ]
\`\`\`

---

## 📁 Project Directory Structure

\`\`\`
LegalEase/
├── ai_core/
│   ├── __init__.py
│   └── gemini_generator.py
├── legalEaseAPI/
│   ├── __init__.py
│   ├── main.py
│   └── routes.py
├── frontend/
│   └── app.py
├── image/
│   ├── logo.png
│   └── inverseLogo.png
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
\`\`\`

---

## ⚡ Quickstart Guide

### 1. Clone & Set Up Virtual Environment

\`\`\`bash
git clone https://github.com/<YOUR_USERNAME>/LegalEase.git
cd LegalEase

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 3. Configure Gemini API Key

Create a \`.env\` file in the root directory:
\`\`\`env
GEMINI_API_KEY="your_google_gemini_api_key_here"
\`\`\`

### 4. Run Backend & Frontend

**Terminal 1 (FastAPI Backend):**
\`\`\`bash
uvicorn legalEaseAPI.main:app --reload --port 8000
\`\`\`

**Terminal 2 (Streamlit Frontend):**
\`\`\`bash
streamlit run frontend/app.py
\`\`\`

Open your browser to \`http://localhost:8501\`!

---

## 📄 License
Distributed under the MIT License. See \`LICENSE\` for more information.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                VS Code & GitHub Publishing Guide
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  SmartInternz / SmartBridge
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Complete copy-paste prompt, local Git initialization, Python project tree, and repository guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'prompt'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Copy-Paste AI Prompt
          </button>

          <button
            onClick={() => setActiveTab('commands')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'commands'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Git & VS Code Commands
          </button>

          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'structure'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            Directory Tree (Page 7)
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'code'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Python Starter Files
          </button>

          <button
            onClick={() => setActiveTab('readme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'readme'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Professional README.md
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm text-slate-300">
          {/* TAB 1: COPY-PASTE PROMPT */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-amber-200 text-sm">
                    Original Prompt Template for AI Assistants
                  </h3>
                  <p className="text-xs text-amber-300/80 mt-1">
                    Paste this exact prompt into Gemini, ChatGPT, Claude, or GitHub Copilot to walk through any project build. When prompted, reply with <code className="bg-amber-950/80 px-1.5 py-0.5 rounded text-amber-100">"Python FastAPI backend with Streamlit frontend"</code> or our LegalEase spec!
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(copyPastePrompt, 'prompt')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium text-xs shrink-0 transition"
                >
                  {copiedKey === 'prompt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedKey === 'prompt' ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>

              <div className="relative rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {copyPastePrompt}
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  How to Use This Prompt:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                  <li>Click <strong>Copy Prompt</strong> above.</li>
                  <li>Paste into your preferred AI chat (Gemini, Claude, Copilot).</li>
                  <li>When asked, specify: <em className="text-amber-200">"Building LegalEase: Python FastAPI + Streamlit + Google Gemini SDK"</em>.</li>
                  <li>Follow the returned step-by-step terminal commands directly inside your VS Code terminal!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: GIT & VS CODE COMMANDS */}
          {activeTab === 'commands' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                Run these commands directly inside your <strong>VS Code Integrated Terminal</strong> (Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white">Ctrl + `</kbd> or <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white">Cmd + `</kbd>).
              </div>

              {/* Step 1 */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">1</span>
                    Create Project & Virtual Environment
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `mkdir LegalEase\ncd LegalEase\npython -m venv venv\n# On Windows:\nvenv\\Scripts\\activate\n# On macOS/Linux:\nsource venv/bin/activate`,
                        'cmd1'
                      )
                    }
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-xs font-mono text-emerald-400 overflow-x-auto">
{`mkdir LegalEase
cd LegalEase
python -m venv venv

# Activate Virtual Environment:
# On Windows (PowerShell/CMD):
venv\\Scripts\\activate

# On macOS / Linux:
source venv/bin/activate`}
                </pre>
              </div>

              {/* Step 2 */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">2</span>
                    Install Dependencies (Milestone 1, Page 2 & 7)
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `pip install fastapi uvicorn streamlit python-docx fpdf2 Pillow requests google-generativeai python-dotenv`,
                        'cmd2'
                      )
                    }
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'cmd2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-xs font-mono text-emerald-400 overflow-x-auto">
{`pip install fastapi uvicorn streamlit python-docx fpdf2 Pillow requests google-generativeai python-dotenv`}
                </pre>
              </div>

              {/* Step 3 */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">3</span>
                    Initialize Git Locally & Commit
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `git init\ngit branch -M main\ngit add .\ngit commit -m "feat: initial commit for LegalEase AI document generator"`,
                        'cmd3'
                      )
                    }
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'cmd3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-xs font-mono text-emerald-400 overflow-x-auto">
{`git init
git branch -M main
git add .
git commit -m "feat: initial commit for LegalEase AI document generator"`}
                </pre>
              </div>

              {/* Step 4 */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">4</span>
                    Create GitHub Repository & Push to Remote
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `# Create repo on https://github.com/new (Name: LegalEase)\ngit remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/LegalEase.git\ngit push -u origin main`,
                        'cmd4'
                      )
                    }
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'cmd4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-xs font-mono text-emerald-400 overflow-x-auto">
{`# 1. Create a new repository on https://github.com/new named "LegalEase"
# 2. Link your local repo and push:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/LegalEase.git
git push -u origin main`}
                </pre>
              </div>

              {/* Step 5 */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">5</span>
                    Running Locally (Milestone 5, Page 17)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-semibold text-white block mb-1">Terminal 1: FastAPI Backend</span>
                    <code className="text-emerald-400 font-mono">uvicorn legalEaseAPI.main:app --reload --port 8000</code>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-semibold text-white block mb-1">Terminal 2: Streamlit Frontend</span>
                    <code className="text-emerald-400 font-mono">streamlit run frontend/app.py</code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DIRECTORY TREE */}
          {activeTab === 'structure' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                This exact directory structure is taken directly from <strong>Page 7 (Activity 1.3: Set Up Application Structure)</strong> of the SmartBridge / SmartInternz project specification.
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
                <pre>{`LEGALEASE/
├── ai_core/
│   ├── __init__.py
│   ├── gemini_generator.py      # Google Gemini 1.5/flash prompt & model caller
│   └── generator.py             # Export helper functions (format_docx, format_pdf)
├── frontend/
│   └── app.py                   # Streamlit interactive UI & download buttons
├── image/
│   ├── logo.png                 # LegalEase scale icon (for Word/PDF headers)
│   └── inverseLogo.png          # Dark mode logo variant
├── legalEaseAPI/
│   ├── __init__.py
│   ├── main.py                  # FastAPI initialization & CORS config
│   └── routes.py                # POST /generate endpoint & Pydantic models
├── venv/                        # Python virtual environment (ignored in git)
├── .env                         # GEMINI_API_KEY="AIzaSy..."
├── .gitignore                   # venv/, .env, __pycache__/
├── config.py                    # App configuration
├── requirements.txt             # Project dependencies
└── run.sh                       # One-click startup script`}</pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 text-xs">
                <h4 className="font-semibold text-white mb-2">Recommended .gitignore:</h4>
                <pre className="p-3 rounded-lg bg-slate-950 font-mono text-slate-400">
{`venv/
.env
__pycache__/
*.pyc
.DS_Store
*.docx
*.pdf
!image/*.png`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: PYTHON STARTER FILES */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                Copy these pre-written Python files directly into your VS Code files if you are building or testing the local Python/FastAPI/Streamlit version!
              </div>

              {/* legalEaseAPI/routes.py */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-purple-300">
                    legalEaseAPI/routes.py
                  </span>
                  <button
                    onClick={() => copyToClipboard(pythonRoutesPy, 'routesPy')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'routesPy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56">
                  {pythonRoutesPy}
                </pre>
              </div>

              {/* ai_core/gemini_generator.py */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-purple-300">
                    ai_core/gemini_generator.py
                  </span>
                  <button
                    onClick={() => copyToClipboard(pythonGeminiGenerator, 'geminiPy')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'geminiPy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56">
                  {pythonGeminiGenerator}
                </pre>
              </div>

              {/* frontend/app.py */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-purple-300">
                    frontend/app.py (Streamlit UI)
                  </span>
                  <button
                    onClick={() => copyToClipboard(pythonStreamlitApp, 'appPy')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'appPy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56">
                  {pythonStreamlitApp}
                </pre>
              </div>

              {/* requirements.txt */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-purple-300">
                    requirements.txt
                  </span>
                  <button
                    onClick={() => copyToClipboard(pythonRequirements, 'reqTxt')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'reqTxt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-[11px] font-mono text-slate-300 overflow-x-auto">
                  {pythonRequirements}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: PROFESSIONAL README */}
          {activeTab === 'readme' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Ready-to-commit <code className="text-cyan-300">README.md</code> with architecture diagram, badge shields, installation steps, and API docs.
                </p>
                <button
                  onClick={() => copyToClipboard(readmeContent, 'readme')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-medium text-xs transition"
                >
                  {copiedKey === 'readme' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'readme' ? 'Copied README!' : 'Copy README.md'}
                </button>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                {readmeContent}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>SmartInternz LegalEase AI Project Blueprint</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
