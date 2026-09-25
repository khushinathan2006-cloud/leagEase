export interface BoilerplateClause {
  id: string;
  name: string;
  category: 'Confidentiality' | 'Liability & Risk' | 'Dispute & Law' | 'Termination' | 'Intellectual Property' | 'Operations & Payment' | 'General Boilerplate';
  summary: string;
  recommendedPosition: 'append' | 'before_signatures' | 'section';
  fullClauseText: string;
  tags: string[];
}

export const CLAUSE_LIBRARY_DATA: BoilerplateClause[] = [
  {
    id: 'confidentiality-nda',
    name: 'Mutual Non-Disclosure & Confidentiality',
    category: 'Confidentiality',
    summary: 'Standard 3-year mutual confidentiality protection preventing unauthorized disclosure or commercial misuse.',
    recommendedPosition: 'section',
    tags: ['NDA', 'Trade Secrets', 'Proprietary Info', 'Privacy'],
    fullClauseText: `### Confidentiality & Non-Disclosure
1. **Confidential Information:** Each party ("Receiving Party") agrees that all business, technical, operational, financial, and strategic information disclosed by the other party ("Disclosing Party"), whether in writing, orally, or electronically, constitutes proprietary "Confidential Information".
2. **Standard of Care:** The Receiving Party shall protect such information with at least the same degree of care it uses for its own confidential data, and in no event less than a reasonable standard of care.
3. **Exclusions:** Confidential Information does not include information that: (a) is or becomes publicly known through no breach of this Agreement; (b) was already rightfully known without restriction prior to disclosure; or (c) is independently developed without reference to the Disclosing Party's Confidential Information.
4. **Duration:** The obligations of confidentiality shall remain binding during the term of this Agreement and for a period of three (3) years following its expiration or termination.`,
  },
  {
    id: 'indemnification-bilateral',
    name: 'Mutual Indemnification',
    category: 'Liability & Risk',
    summary: 'Shields each party from third-party lawsuits, damages, legal defense fees, and judgments arising from breach or negligence.',
    recommendedPosition: 'section',
    tags: ['Indemnification', 'Hold Harmless', 'Third-Party Claims', 'Defense'],
    fullClauseText: `### Indemnification & Hold Harmless
1. **Indemnity Obligations:** Each party ("Indemnifying Party") covenants to defend, indemnify, and hold harmless the other party, its corporate affiliates, officers, directors, employees, and authorized agents ("Indemnified Parties") from and against any and all third-party claims, demands, liabilities, damages, fines, and reasonable attorneys' fees arising out of or resulting from:
   (a) Any material breach or default of representations, warranties, or covenants herein;
   (b) Gross negligence, willful misconduct, or intentional fraud by the Indemnifying Party;
   (c) Allegations that deliverables or materials provided infringe upon or misappropriate any patent, copyright, trademark, or trade secret of any third party.
2. **Indemnification Procedure:** The Indemnified Party shall promptly provide written notice of any covered claim and grant the Indemnifying Party control over defense and settlement negotiations, provided no settlement imposing financial liability or admission of guilt on the Indemnified Party shall be agreed to without prior written consent.`,
  },
  {
    id: 'limitation-of-liability',
    name: 'Limitation of Liability & Consequential Damages Waiver',
    category: 'Liability & Risk',
    summary: 'Disclaims punitive, consequential, and indirect damages and caps total liability at contract value.',
    recommendedPosition: 'section',
    tags: ['Liability Cap', 'Consequential Damages', 'Risk Mitigation'],
    fullClauseText: `### Limitation of Liability
1. **Waiver of Consequential Damages:** IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY SPECIAL, INDIRECT, INCIDENTAL, PUNITIVE, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, DATA CORRUPTION, OR BUSINESS INTERRUPTION) ARISING OUT OF OR RELATING TO THIS AGREEMENT, REGARDLESS OF THE LEGAL THEORY (TORT, CONTRACT, OR STRICT LIABILITY) AND EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
2. **Aggregate Liability Cap:** Except for claims arising from gross negligence, willful misconduct, or breach of confidentiality obligations, each party's maximum cumulative aggregate liability under this Agreement shall not exceed the total fees paid or payable by Client in the twelve (12) months immediately preceding the event giving rise to liability.`,
  },
  {
    id: 'ip-work-made-for-hire',
    name: 'Intellectual Property & Work-Made-For-Hire Assignment',
    category: 'Intellectual Property',
    summary: 'Assigns all created assets, software code, copyrights, and inventions fully to the paying client.',
    recommendedPosition: 'section',
    tags: ['IP Assignment', 'Work For Hire', 'Copyright', 'Ownership'],
    fullClauseText: `### Intellectual Property & Proprietary Rights
1. **Work Made for Hire:** All deliverables, software applications, designs, technical documentation, models, and creative assets produced pursuant to this Agreement shall be deemed "Work Made for Hire" to the fullest extent permitted by applicable law.
2. **Irrevocable Assignment:** To the extent any deliverable does not qualify as a work made for hire, Service Provider hereby irrevocably assigns, transfers, and conveys to Client all right, title, and interest worldwide, including all patents, copyrights, trademarks, moral rights, and trade secret protections.
3. **Pre-Existing IP:** Service Provider retains ownership of its pre-existing tools, libraries, and frameworks, but grants Client an irrevocable, perpetual, royalty-free, transferable worldwide license to use, modify, and distribute such pre-existing materials embedded within the deliverables.`,
  },
  {
    id: 'termination-convenience-cause',
    name: 'Termination for Convenience & Material Cause',
    category: 'Termination',
    summary: 'Defines orderly contract termination protocols, cure periods for breach, and payment of accrued fees.',
    recommendedPosition: 'section',
    tags: ['Termination', 'Breach', 'Cure Period', 'Notice'],
    fullClauseText: `### Term and Termination
1. **Termination for Convenience:** Either party may terminate this Agreement without cause by giving the other party at least thirty (30) days prior written notice.
2. **Termination for Cause:** Either party may immediately terminate this Agreement upon written notice if:
   (a) The other party commits a material breach of this Agreement and fails to cure such breach within fifteen (15) days of receiving written notice specifying the breach;
   (b) The other party becomes insolvent, enters receivership, makes an assignment for the benefit of creditors, or files for bankruptcy protection.
3. **Effect of Termination:** Upon termination, Client shall pay Service Provider for all approved work completed up to the effective termination date. Service Provider shall immediately deliver all completed works, working files, and return all Confidential Information.`,
  },
  {
    id: 'dispute-resolution-arbitration',
    name: 'Binding Arbitration & Dispute Resolution',
    category: 'Dispute & Law',
    summary: 'Requires private, confidential American Arbitration Association (AAA) arbitration instead of lengthy court litigation.',
    recommendedPosition: 'section',
    tags: ['Arbitration', 'AAA', 'Dispute Resolution', 'Mediation'],
    fullClauseText: `### Dispute Resolution & Binding Arbitration
1. **Informal Negotiation:** Prior to initiating formal dispute proceedings, the parties agree to conduct good-faith executive negotiations for a period of not less than twenty (20) business days.
2. **Binding Arbitration:** Any controversy, dispute, or claim arising out of or relating to this Agreement that cannot be resolved amicably shall be settled exclusively by final and binding confidential arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules.
3. **Location & Arbitrator:** Arbitration shall occur before a single neutral arbitrator in the designated governing jurisdiction. The prevailing party shall be entitled to recover its reasonable legal fees, expert witness costs, and arbitration fees.`,
  },
  {
    id: 'force-majeure',
    name: 'Force Majeure (Excused Non-Performance)',
    category: 'Operations & Payment',
    summary: 'Excuses delays or performance defaults caused by unforeseeable acts of God, pandemics, wars, or cyber disasters.',
    recommendedPosition: 'section',
    tags: ['Force Majeure', 'Act of God', 'Pandemic', 'Emergency'],
    fullClauseText: `### Force Majeure
Neither party shall be held liable or responsible to the other party, nor be deemed to have defaulted under or breached this Agreement, for any failure or delay in fulfilling or performing any term of this Agreement, when and to the extent such failure or delay is caused by or results from acts beyond the impacted party's reasonable control, including, without limitation: acts of God; flood, fire, earthquake, or explosion; war, invasion, hostilities, terrorist threats or acts; riots or other civil unrest; government orders, epidemic, pandemic; or national or regional interruption of telecommunications, electrical power, or major transportation infrastructure. The affected party shall provide prompt written notice and exercise reasonable commercial diligence to resume performance as soon as practicable.`,
  },
  {
    id: 'non-solicitation',
    name: 'Non-Solicitation of Employees & Clients',
    category: 'Confidentiality',
    summary: 'Prohibits poaching of personnel or actively soliciting the other party’s clients for 12 months.',
    recommendedPosition: 'section',
    tags: ['Non-Solicitation', 'Poaching', 'Staff Protection'],
    fullClauseText: `### Non-Solicitation of Personnel
During the term of this Agreement and for a period of twelve (12) months following its expiration or termination, neither party shall, directly or indirectly, solicit, recruit, induce, or attempt to hire any employee, contractor, or key executive of the other party who was directly involved in the performance of this Agreement, without obtaining the prior express written authorization of the other party. General public advertisements or recruitment postings not specifically targeted at the other party's workforce shall not constitute a violation of this provision.`,
  },
  {
    id: 'severability-entire-agreement',
    name: 'Entire Agreement, Severability & Amendments',
    category: 'General Boilerplate',
    summary: 'Integrates complete understanding, cancels oral representations, and preserves valid clauses if one is voided.',
    recommendedPosition: 'before_signatures',
    tags: ['Entire Agreement', 'Severability', 'Counterparts', 'Integration'],
    fullClauseText: `### Entire Agreement, Severability & Construction
1. **Entire Agreement:** This Agreement constitutes the complete and exclusive statement of agreement between the parties regarding its subject matter and supersedes all prior proposals, understandings, negotiations, and agreements, whether oral or written.
2. **Severability:** If any provision or portion of this Agreement is held to be invalid, illegal, or unenforceable by any court of competent jurisdiction, such invalidity shall not affect the remaining terms, which shall remain in full force and effect.
3. **Amendments & Modifications:** No amendment, modification, or waiver of any provision of this Agreement shall be effective unless set forth in writing and signed by authorized representatives of both parties.
4. **Counterparts & Electronic Signatures:** This Agreement may be executed in counterparts, each of which shall be deemed an original, and electronic signatures shall carry the same legal weight as original ink signatures.`,
  },
  {
    id: 'payment-net-30-interest',
    name: 'Payment Terms, Net 30 & Late Interest',
    category: 'Operations & Payment',
    summary: 'Specifies 30-day payment invoicing terms and sets statutory late fee interest on delinquent accounts.',
    recommendedPosition: 'section',
    tags: ['Payment', 'Invoicing', 'Net 30', 'Late Fees'],
    fullClauseText: `### Invoicing & Payment Terms
1. **Invoice Issuance:** Invoices shall be submitted electronically upon milestone delivery or on a regular monthly basis as agreed.
2. **Payment Schedule:** All undisputed amounts set forth in each invoice shall be paid in full within thirty (30) days of the invoice date ("Net 30").
3. **Late Payments:** Delinquent balances not disputed in good faith within fifteen (15) days of receipt shall accrue interest at the rate of 1.5% per month (or the maximum legal statutory rate, whichever is lower) from the due date until paid in full. Client shall reimburse Service Provider for reasonable legal and collection costs incurred in collecting past-due balances.`,
  },
  {
    id: 'data-privacy-gdpr-security',
    name: 'Data Privacy, Security & GDPR/CCPA Compliance',
    category: 'Confidentiality',
    summary: 'Enforces strict technical data safeguards and adherence to global data privacy statutes.',
    recommendedPosition: 'section',
    tags: ['Data Privacy', 'GDPR', 'CCPA', 'Cybersecurity', 'Compliance'],
    fullClauseText: `### Data Privacy & Cybersecurity Compliance
1. **Security Measures:** Each party agrees to maintain robust administrative, physical, and technical safeguards designed to protect personal data and customer information against unauthorized access, loss, destruction, alteration, or disclosure.
2. **Statutory Adherence:** Each party shall process any personal data received in strict compliance with applicable data protection laws, including where relevant the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and applicable state privacy statutes.
3. **Breach Notification:** In the event of a confirmed security incident compromising the other party's data, the impacted party shall notify the other party within seventy-two (72) hours of confirmation and cooperate in remedial mitigation.`,
  },
];
