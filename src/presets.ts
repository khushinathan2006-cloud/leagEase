import { DocumentTemplatePreset } from './types';

export const DOCUMENT_PRESETS: DocumentTemplatePreset[] = [
  {
    id: 'freelance-contract',
    title: 'Freelance Work Contract',
    category: 'Freelance',
    docType: 'Freelance Work Contract',
    parties: 'Jane Doe (Service Provider), TechNova Inc. (Client)',
    terms: 'Work must be delivered by May 15, 2025; Payment will be made within 7 days of invoice; The client retains intellectual property rights; Either party may terminate with 14 days written notice; Confidentiality must be maintained during and after the project',
    dates: 'April 15, 2025',
    jurisdiction: 'State of California, United States',
    description: 'Contract for independent contractors, freelancers, and creative service providers with deliverables and milestone payment terms.',
  },
  {
    id: 'nda',
    title: 'Mutual Non-Disclosure Agreement (NDA)',
    category: 'IP & Confidentiality',
    docType: 'Non-Disclosure Agreement',
    parties: 'Apex Innovations LLC (Disclosing Party), Quantum Systems Corp (Receiving Party)',
    terms: 'Confidential information includes proprietary source code, business logic, customer records, and trade secrets; Receiving party agrees not to disclose or reverse engineer; Duration of non-disclosure obligation shall be three (3) years from disclosure; Excludes information already publicly known without breach; Return or destruction of all materials upon request within 10 days',
    dates: 'May 1, 2025',
    jurisdiction: 'State of Delaware, United States',
    description: 'Bilateral agreement protecting trade secrets, business methods, and proprietary technical data during partnerships or negotiations.',
  },
  {
    id: 'employment-contract',
    title: 'Executive Employment Contract',
    category: 'Employment',
    docType: 'Employment Contract',
    parties: 'Aura Software Inc. (Employer), David Vance (Employee)',
    terms: 'Role title shall be Lead Systems Architect reporting to Chief Technology Officer; Annual base compensation of $145,000 paid bi-weekly plus standard healthcare benefits; Standard 40 hours work week with hybrid flexibility; 20 days paid annual leave and standard holidays; 30 days prior written notice required for voluntary termination; Non-solicitation of clients and staff for 12 months post-employment; Inventions made during employment assigned to employer',
    dates: 'June 1, 2025',
    jurisdiction: 'State of New York, United States',
    description: 'Full-time employment agreement covering roles, compensation, benefits, non-solicitation, and intellectual property assignment.',
  },
  {
    id: 'lease-agreement',
    title: 'Residential Lease Agreement',
    category: 'Property',
    docType: 'Residential Lease Agreement',
    parties: 'Alice Smith (Tenant), XYZ Realty Management LLC (Landlord)',
    terms: 'Lease premises located at 742 Evergreen Terrace, Suite 3B; Lease duration of 12 consecutive months; Monthly rental payment of $2,200 due on the first day of each calendar month; Security deposit of $2,200 refundable within 21 days after tenancy conclusion; Tenant responsible for electric and internet utilities, Landlord provides water and waste management; No subletting without prior written consent from landlord; 60 days advance notice required for lease non-renewal',
    dates: 'July 1, 2025',
    jurisdiction: 'State of Texas, United States',
    description: 'Standard residential lease defining property address, monthly rent, security deposit terms, maintenance duties, and rules.',
  },
  {
    id: 'software-ip-assignment',
    title: 'Software Development & IP Assignment',
    category: 'IP & Confidentiality',
    docType: 'Software Development Agreement',
    parties: 'CodeCraft Studio LLC (Developer), Global HealthTech Inc. (Customer)',
    terms: 'Developer shall engineer a HIPAA-compliant telehealth patient portal; Work to be delivered in three iterative sprints according to technical specification Exhibit A; Total contract sum of $45,000 payable upon milestone demo acceptance; All source code, designs, and patentable assets irrevocably assigned to Customer as Work Made For Hire; Developer provides 90-day warranty against reproducible software bugs; Developer warrants that code does not infringe third-party patents or licenses',
    dates: 'August 15, 2025',
    jurisdiction: 'State of Washington, United States',
    description: 'Comprehensive software engineering agreement with milestones, strict IP assignment, and bug warranty terms.',
  },
  {
    id: 'partnership-agreement',
    title: 'General Commercial Partnership Agreement',
    category: 'Corporate',
    docType: 'Partnership Agreement',
    parties: 'Marcus Sterling (Partner A), Elena Rostova (Partner B)',
    terms: 'Partnership trade name shall be Sterling & Rostova Ventures; Initial capital contribution of $50,000 per partner representing 50/50 profit and loss distribution; Capital calls require mutual unanimous written approval; Major business decisions and expenditures over $5,000 require dual signature; Right of first refusal on partner buyout at fair market valuation; Dissolution requires 90 days written notification',
    dates: 'September 1, 2025',
    jurisdiction: 'State of Delaware, United States',
    description: 'Business partnership deed establishing capital contributions, voting rights, profit sharing, and dissolution terms.',
  },
];

export const QUICK_CLAUSE_TEMPLATES = [
  {
    name: 'Payment (Net 30)',
    clause: 'Payment shall be remitted within thirty (30) days of receiving an undisputed invoice',
  },
  {
    name: 'Confidentiality',
    clause: 'Strict confidentiality regarding all proprietary and business data must be maintained at all times',
  },
  {
    name: 'Termination (15 Days)',
    clause: 'Either party may terminate this agreement with fifteen (15) days prior written notice',
  },
  {
    name: 'IP Assignment',
    clause: 'All intellectual property rights developed under this agreement shall vest solely with the client',
  },
  {
    name: 'Indemnification',
    clause: 'Each party agrees to indemnify and hold harmless the other from third-party breach claims',
  },
  {
    name: 'Non-Compete / Non-Solicit',
    clause: 'Neither party shall solicit the employees or clients of the other for a period of twelve (12) months',
  },
  {
    name: 'Force Majeure',
    clause: 'Neither party shall be liable for delay caused by acts of God, strikes, or government regulations',
  },
  {
    name: 'Dispute Resolution',
    clause: 'Disputes shall be submitted to confidential binding arbitration prior to initiating civil litigation',
  },
];
