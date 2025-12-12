export type Language = 'en' | 'pt-br' | 'es';

export type AiModel = 'gemini-3-pro-preview' | 'gemini-2.5-flash';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: 'draft' | 'completed';
  questions?: string[];
  answers?: Record<number, string>;
  documentation?: Documentation;
  language?: Language;
}

export interface Documentation {
  prd: string;
  techStack: string;
  projectStructure: string;
  schemaDesign: string;
  userFlow: string;
  stylingGuidelines: string;
}

export interface QuestionResponse {
  questions: string[];
}

export interface DocumentationResponse {
  prd: string;
  techStack: string;
  projectStructure: string;
  schemaDesign: string;
  userFlow: string;
  stylingGuidelines: string;
}

export type ViewState = 
  | { type: 'DASHBOARD' }
  | { type: 'WIZARD' }
  | { type: 'PROJECT_VIEW'; projectId: string };