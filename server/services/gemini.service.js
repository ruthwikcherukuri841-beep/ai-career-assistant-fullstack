import { ai, DEFAULT_GEMINI_MODEL } from '../config/gemini.js';
import { buildPromptContext } from '../prompts/systemPrompt.js';

/**
 * Stream responses from Google Gemini SDK (@google/genai)
 */
export const generateStreamingResponse = async ({ message, resume, jobDescription, history }, onChunk) => {
  const prompt = buildPromptContext({ message, resume, jobDescription, history });

  try {
    const responseStream = await ai.models.generateContentStream({
      model: DEFAULT_GEMINI_MODEL,
      contents: prompt,
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      const textChunk = chunk.text;
      if (textChunk) {
        fullText += textChunk;
        onChunk(textChunk);
      }
    }
    return fullText;
  } catch (error) {
    console.error('Error generating Gemini content stream:', error.message || error);
    
    // Provide structured fallback message if API key issue or rate limit occurs
    const fallbackMessage = `### 💡 Career Assistant Note\n\nI processed your request: **"${message}"**.\n\n` +
      (resume ? `✅ **Resume Context Loaded** (${resume.length} chars)\n` : `⚠️ **Resume Context**: Not provided.\n`) +
      (jobDescription ? `✅ **Job Description Loaded** (${jobDescription.length} chars)\n` : `⚠️ **Job Description**: Not provided.\n\n`) +
      `*Error Detail: ${error.message || 'Gemini API temporary unavailability.'}*\n\n` +
      `**Quick Tip**: Please make sure a valid \`GEMINI_API_KEY\` is configured in \`server/.env\`.`;

    onChunk(fallbackMessage);
    return fallbackMessage;
  }
};
