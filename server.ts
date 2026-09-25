import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Root health check endpoint as requested in Milestone 3 (page 11)
  app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to LegalEase AI Legal Document Generator API' });
  });

  // POST /api/generate - Document Generation
  app.post('/api/generate', async (req, res) => {
    try {
      const {
        document_type = 'Contract',
        parties = '',
        terms = '',
        dates = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        jurisdiction = 'State of Delaware, United States',
        custom_instructions = '',
      } = req.body;

      if (!document_type || !parties) {
        return res.status(400).json({ error: 'document_type and parties are required.' });
      }

      if (ai) {
        const prompt = `You are an expert corporate legal counsel drafting a formal, comprehensive, and legally enforceable legal document.

Document Details:
- Document Type: ${document_type}
- Involved Parties: ${parties}
- Effective Date: ${dates}
- Jurisdiction / Governing Law: ${jurisdiction}
- Key Terms & Conditions: ${terms || 'Standard mutually agreed commercially reasonable terms'}
${custom_instructions ? `- Special Custom Clauses / Instructions: ${custom_instructions}` : ''}

Drafting Requirements:
1. Title: Create a prominent, formal title matching "${document_type}".
2. Recitals: Include introductory preamble and formal recitals (WHEREAS, NOW THEREFORE).
3. Structure: Provide well-organized, sequentially numbered sections with clear headings:
   - Section 1: Definitions & Scope of Agreement
   - Section 2: Roles, Responsibilities & Deliverables
   - Section 3: Consideration, Fees & Payment Terms
   - Section 4: Term and Termination (including notice requirements and cause vs convenience)
   - Section 5: Confidentiality & Non-Disclosure
   - Section 6: Intellectual Property & Ownership Rights
   - Section 7: Representations and Warranties
   - Section 8: Limitation of Liability & Indemnification
   - Section 9: Governing Law and Dispute Resolution (${jurisdiction})
   - Section 10: General Provisions (Severability, Entire Agreement, Amendments, Counterparts)
4. Key Terms Integration: Directly incorporate and expand upon the provided terms (${terms}) into the corresponding sections.
5. Execution & Signature Block: Conclude with formal signature lines for each party identified in "${parties}", including lines for Authorized Representative Signature, Printed Name, Title, and Date.

Format your response in clean Markdown with appropriate headings (## and ###) and numbered points. Do not include markdown code block backticks around the entire document.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are LegalEase AI, a senior legal document drafting engine. You produce meticulous, balanced, legally structured agreements with clean markdown formatting.',
            temperature: 0.2,
          },
        });

        const generatedText = response.text || '';
        return res.json({ document: generatedText });
      } else {
        // Fallback high-quality template generator if no API key is set
        const fallbackDoc = generateFallbackLegalDoc(document_type, parties, terms, dates, jurisdiction);
        return res.json({ document: fallbackDoc });
      }
    } catch (error: any) {
      console.error('Error generating document:', error);
      // If AI call failed, provide a structured fallback so user flow is uninterrupted
      const {
        document_type = 'Contract',
        parties = 'Parties',
        terms = '',
        dates = 'Current Date',
        jurisdiction = 'Governing Jurisdiction',
      } = req.body;
      const fallbackDoc = generateFallbackLegalDoc(document_type, parties, terms, dates, jurisdiction);
      return res.json({
        document: fallbackDoc,
        warning: 'AI generation service encountered an issue; generated standard structured legal agreement as fallback.',
      });
    }
  });

  // POST /api/analyze - Plain English Summarizer & Risk Analysis (Milestone 2 & Page 25)
  app.post('/api/analyze', async (req, res) => {
    try {
      const { document_text, document_type = 'Legal Document' } = req.body;

      if (!document_text) {
        return res.status(400).json({ error: 'document_text is required.' });
      }

      if (ai) {
        const prompt = `Analyze this ${document_type} and provide a plain-language executive summary, key clause breakdown, and risk assessment for a non-lawyer.

Document:
${document_text.slice(0, 12000)}

Return a structured JSON with:
1. "summary": A 2-3 paragraph plain-English explanation of what this agreement does.
2. "keyObligations": Array of objects [{ "party": string, "obligations": [string] }]
3. "criticalClauses": Array of objects [{ "clauseName": string, "summary": string, "impactLevel": "High" | "Medium" | "Low" }]
4. "riskFlags": Array of strings highlighting potential legal traps or items requiring attention.
5. "termsTable": Array of objects [{ "term": string, "detail": string }] for quick reference.
6. "completenessScore": Number from 1 to 100 assessing clarity and completeness.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json(parsed);
      } else {
        // Fallback analysis
        return res.json({
          summary: `This is a binding ${document_type} establishing formal rights, duties, and responsibilities between the designated parties. It establishes operational scopes, payment and deliverable terms, confidentiality safeguards, and dispute resolution mechanisms.`,
          keyObligations: [
            { party: 'First Party / Service Provider', obligations: ['Deliver specified work according to agreed timeline', 'Maintain strict confidentiality of proprietary data', 'Adhere to quality standards'] },
            { party: 'Second Party / Client', obligations: ['Provide timely compensation per invoiced schedule', 'Supply necessary project materials and feedback', 'Honor intellectual property boundaries'] },
          ],
          criticalClauses: [
            { clauseName: 'Term & Termination', summary: 'Defines how and when either party can end the agreement, including required written notice.', impactLevel: 'High' },
            { clauseName: 'Confidentiality', summary: 'Prevents unauthorized disclosure of proprietary technical and business data.', impactLevel: 'High' },
            { clauseName: 'Governing Law', summary: 'Specifies the jurisdiction and courts having authority over any legal disputes.', impactLevel: 'Medium' },
          ],
          riskFlags: [
            'Ensure payment milestone dates match realistic deliverable completions.',
            'Confirm whether notice periods for convenience termination are mutually acceptable.',
            'Verify governing state/country jurisdiction reflects your entity registration.',
          ],
          termsTable: [
            { term: 'Document Type', detail: document_type },
            { term: 'Enforceability', detail: 'Formal written instrument with dual signatory execution' },
            { term: 'Notice Standard', detail: 'Written notice via electronic mail or registered postal carrier' },
          ],
          completenessScore: 92,
        });
      }
    } catch (error: any) {
      console.error('Error analyzing document:', error);
      res.status(500).json({ error: 'Failed to analyze document.' });
    }
  });

  // POST /api/refine - Refine specific clause or add terms
  app.post('/api/refine', async (req, res) => {
    try {
      const { document_text, instructions } = req.body;

      if (!document_text || !instructions) {
        return res.status(400).json({ error: 'document_text and instructions are required.' });
      }

      if (ai) {
        const prompt = `You are a legal document specialist.
Modify the following legal contract according to the requested instruction, preserving formal legal syntax, numbering, and structure.

Requested Modification:
"${instructions}"

Current Document:
${document_text}

Output the complete revised legal document in clean Markdown.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        return res.json({ document: response.text || document_text });
      } else {
        return res.json({
          document: `${document_text}\n\n### Additional Agreed Addendum\n**Modification Request:** ${instructions}\n*Both parties hereby covenant to incorporate the aforementioned specification into this Agreement, effective immediately upon joint endorsement.*`,
        });
      }
    } catch (error: any) {
      console.error('Error refining document:', error);
      res.status(500).json({ error: 'Failed to refine document.' });
    }
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LegalEase Server running at http://0.0.0.0:${PORT}`);
  });
}

function generateFallbackLegalDoc(
  docType: string,
  parties: string,
  terms: string,
  date: string,
  jurisdiction: string
): string {
  const parsedTerms = terms
    ? terms.split(';').map(t => t.trim()).filter(Boolean)
    : [
        'Payment to be remitted within 30 days of valid invoice receipt',
        'Confidentiality must be strictly preserved during and after the term',
        'Either party may terminate upon 15 days prior written notification',
        'All work products created shall remain or transfer as agreed in writing',
      ];

  const termsList = parsedTerms.map((t, idx) => `   ${idx + 1}. **Clause ${idx + 1}:** ${t}`).join('\n');

  return `## ${docType.toUpperCase()}

**Effective Date:** ${date}

**Parties to this Agreement:**
${parties}

---

### RECITALS
**WHEREAS**, the parties identified above desire to establish a formal and legally binding understanding governing their business relationship and obligations; and
**WHEREAS**, the parties acknowledge receipt and sufficiency of good and valuable consideration;

**NOW, THEREFORE**, in consideration of the mutual covenants, representations, and warranties contained herein, the parties agree as follows:

---

### 1. Purpose and Scope
This ${docType} ("Agreement") governs the duties, rights, and obligations between the involved stakeholders. The parties shall act in good faith and conduct all operations in full compliance with applicable statutory and regulatory requirements.

### 2. Key Terms and Conditions
The parties specifically covenant and agree to the following operational parameters:
${termsList}

### 3. Term and Termination
This Agreement shall commence on the Effective Date (${date}) and shall continue in full force and effect until terminated by either party upon fifteen (15) days written notice, or immediately upon material breach which remains uncured for ten (10) business days following written notice thereof.

### 4. Confidentiality & Non-Disclosure
Each party agrees that all confidential, proprietary, or non-public information received in connection with this Agreement shall be kept in strict confidence and shall not be disclosed to any third party without prior written consent, except as required by operation of law.

### 5. Intellectual Property
Unless expressly specified otherwise in writing, all materials, developments, inventions, and works produced pursuant to this Agreement shall be governed strictly by the agreed terms of assignment and license.

### 6. Limitation of Liability & Indemnification
Neither party shall be liable for indirect, incidental, consequential, special, or punitive damages arising out of this Agreement. Each party shall indemnify, defend, and hold harmless the other party from third-party claims arising from gross negligence or willful misconduct.

### 7. Governing Law and Jurisdiction
This Agreement shall be governed by, construed, and enforced in accordance with the laws of **${jurisdiction}**, without giving effect to any principles of conflicts of law.

### 8. Entire Agreement & Severability
This Agreement constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior agreements, oral or written. If any provision is deemed invalid or unenforceable, the remaining provisions shall continue in full force and effect.

---

### EXECUTION AND SIGNATURES

**IN WITNESS WHEREOF**, the parties hereto have caused this ${docType} to be duly executed by their authorized representatives as of the Effective Date.

\`\`\`
____________________________________          ____________________________________
Authorized Representative Signature            Authorized Representative Signature

Print Name: [Signatory 1]                     Print Name: [Signatory 2]
Title:                                         Title:
Date: ${date}                                 Date: ${date}
\`\`\`
`;
}

startServer();
