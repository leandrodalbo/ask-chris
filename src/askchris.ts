import dotenv from 'dotenv';
import { AiConf, OpenAIResponse } from './types';

dotenv.config();
 
const loadConf = () => {
    const {
        OPEN_AI_API_KEY,
        OPEN_AI_API_URL,
        OPEN_AI_API_MODEL,
        OPEN_AI_API_USER_ROLE
      } = process.env;
    
      if(!OPEN_AI_API_KEY || !OPEN_AI_API_URL || !OPEN_AI_API_MODEL || !OPEN_AI_API_USER_ROLE)
        throw new Error("Open AI Configuration Missing!!!");

       return {
            key: OPEN_AI_API_KEY ,
            url: OPEN_AI_API_URL ,
            model: OPEN_AI_API_MODEL,
            role: OPEN_AI_API_USER_ROLE        
        } as AiConf; 
} 

export const askChris = async (question: string): Promise<string> => {
    const {key, url, model, role} = loadConf();

    try {
      const response = await axios.post<OpenAIResponse>(
        url,
        {
          model: model ,
          messages: [{ role, content: question }],
        },
        {
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      return "Sorry, I couldn't process your question.";
    }
  }
  