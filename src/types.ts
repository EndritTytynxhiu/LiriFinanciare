export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ResourceItem {
  name: string;
  description: string;
  link: string;
}

export interface PlanStep {
  title: string;
  description: string;
  difficulty: 'Low' | 'Medium' | 'High';
  estimatedCost: string;
}

export interface FinancialPlan {
  steps: PlanStep[];
  advice: string;
}

export enum ViewState {
  HOME = 'HOME',
  CHAT = 'CHAT',
  PLANNER = 'PLANNER',
  RESOURCES = 'RESOURCES',
  COURSES = 'COURSES',
  TOOLS = 'TOOLS',
  DIGITAL_SAFETY = 'DIGITAL_SAFETY', 
  CALCULATOR = 'CALCULATOR'
}