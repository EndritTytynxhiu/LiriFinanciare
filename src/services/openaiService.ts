import OpenAI from 'openai';
import { FinancialPlan } from '../types';

// Declare the global constant defined in vite.config.ts
declare const __OPENAI_API_KEY__: string;

// Helper to get the AI client instance securely
const getAIClient = () => {
  // Use the global constant injected by Vite
  const apiKey = __OPENAI_API_KEY__;

  // Debug log (masked)
  if (apiKey && apiKey.length > 0) {
    console.log("🔑 API Key found in service. First 5 chars:", apiKey.substring(0, 5));
  } else {
    console.error("❌ API Key is MISSING in service.");
  }

  if (!apiKey || apiKey.length === 0) {
    throw new Error("API Key is missing (Empty String). The app cannot talk to OpenAI.");
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Allow in browser for client-side usage
  });
};

const SYSTEM_INSTRUCTION_SAFE = `
You are a compassionate, safety-first financial advocate for women potentially facing financial abuse. 
Financial abuse involves controlling a victim's ability to acquire, use, and maintain economic resources.
Your goal is to provide clear, actionable, and discreet advice on banking, credit, legal rights, and safety planning.
ALWAYS prioritize physical safety. If a user indicates immediate danger, advise them to call emergency services.
Be concise, empathetic, and encouraging. Do not be judgmental.

IMPORTANT: You must respond in Albanian (Shqip).
`;

export const chatWithAdvisor = async (history: { role: string; parts: { text: string }[] }[], message: string) => {
  console.log("📡 Attempting to send message to OpenAI...");
  try {
    const openai = getAIClient();

    // Convert history to OpenAI format
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_INSTRUCTION_SAFE },
      ...history.flatMap(h => h.parts.map(part => ({ role: (h.role === 'model' ? 'assistant' : 'user') as 'user' | 'assistant', content: part.text }))),
      { role: 'user' as const, content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use a cost-effective model
      messages,
    });

    console.log("✅ Message received from OpenAI.");
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error("❌ Chat error details:", error);
    throw error;
  }
};

export const generateFinancialPlan = async (situation: string): Promise<FinancialPlan> => {
  try {
    const openai = getAIClient();

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_INSTRUCTION_SAFE },
      { role: 'user', content: `Create a step-by-step financial independence plan for this situation: ${situation}. 
      Focus on discreetly gathering documents, opening safe bank accounts, and building credit.
      Respond in Albanian.` }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'financial_plan',
          schema: {
            type: 'object',
            properties: {
              steps: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    difficulty: { type: 'string', enum: ['Low', 'Medium', 'High'] },
                    estimatedCost: { type: 'string' },
                  },
                  required: ['title', 'description', 'difficulty', 'estimatedCost'],
                },
              },
              advice: { type: 'string' },
            },
            required: ['steps', 'advice'],
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    if (content) {
      return JSON.parse(content) as FinancialPlan;
    }
    throw new Error("No plan generated");
  } catch (error) {
    console.error("Planning error details:", error);
    throw error;
  }
};

export const findLocalResources = async (query: string, location?: { lat: number; lng: number }) => {
  try {
    const openai = getAIClient();

    const locationStr = location ? ` near coordinates ${location.lat}, ${location.lng}` : '';

    const prompt = `Find local support organizations, shelters, or legal aid for women in financial distress near ${query}${locationStr}. 
    Respond in Albanian (Shqip).
    
    For each result, provide:
    1. Organization Name (Formatted as a Heading 3 '### Name')
    2. Brief description.
    3. Phone Number, formatted strictly as a markdown link like this: [Telefono +355 4 222 2222](tel:+35542222222).
    
    Separate each organization with a horizontal rule (---) to clearly distinguish them.`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_INSTRUCTION_SAFE },
      { role: 'user', content: prompt }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    const text = response.choices[0].message.content || '';
    // Since no search tool, sources will be empty
    const sources: any[] = [];

    return { text, sources };
  } catch (error) {
    console.error("Resource search error details:", error);
    throw error;
  }
};

export const getFinancialEducationResources = async () => {
  try {
    const openai = getAIClient();

    const prompt = `
    Provide a list of financial education resources in Albanian.
    
    Your goal is to provide a list of 4-5 high quality video recommendations or articles.
    
    Output Format (in Albanian):
    
    ### [Title]
    **Gjuha:** [Language]
    [Brief Description]
    
    [SHIKO VIDEON](URL)
    
    ---
    `;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_INSTRUCTION_SAFE },
      { role: 'user', content: prompt }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    const text = response.choices[0].message.content || '';
    // Sources empty
    const sources: any[] = [];

    return { text, sources };
  } catch (error) {
    console.error("Education search error details:", error);
    throw error;
  }
};