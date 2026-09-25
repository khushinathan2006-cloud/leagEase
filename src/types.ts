export interface DocumentRequest {
  document_type: string;
  parties: string;
  terms: string;
  dates: string;
  jurisdiction: string;
  custom_instructions?: string;
}

export interface DocumentAnalysis {
  summary: string;
  keyObligations: {
    party: string;
    obligations: string[];
  }[];
  criticalClauses: {
    clauseName: string;
    summary: string;
    impactLevel: 'High' | 'Medium' | 'Low';
  }[];
  riskFlags: string[];
  termsTable: {
    term: string;
    detail: string;
  }[];
  completenessScore: number;
}

export interface DocumentTemplatePreset {
  id: string;
  title: string;
  category: 'Employment' | 'Freelance' | 'Property' | 'Corporate' | 'IP & Confidentiality';
  docType: string;
  parties: string;
  terms: string;
  dates: string;
  jurisdiction: string;
  description: string;
}

export interface SignatoryDetails {
  firstPartyName: string;
  firstPartyTitle: string;
  secondPartyName: string;
  secondPartyTitle: string;
  customOrgName: string;
  includeWatermark: boolean;
}

export interface DocumentHistoryEntry {
  id: string;
  title: string;
  documentType: string;
  documentText: string;
  timestamp: number;
  parties: string;
  dates: string;
  terms: string;
  jurisdiction: string;
  version: number;
  source: 'generated' | 'refined' | 'edited';
}
