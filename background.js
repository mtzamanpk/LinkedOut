import { GoogleGenerativeAI } from "@google/generative-ai";

console.log('DumbedIn Background Script Loaded');

// Access your API key from the environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("Gemini API key not found. Make sure VITE_GEMINI_API_KEY is set in your .env file.");
}

// Initialize the GoogleGenerativeAI client with the API key
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"}); // Or your preferred model

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Background] Message received:', request);
  console.log('[Background] Sender details:', sender);

  if (request.type === 'rewriteText') {
    const { text, postId } = request;
    console.log(`[Background] Received text to rewrite for ${postId}: "${text.substring(0, 100)}..."`);

    if (!apiKey) {
      console.error("[Background] Gemini API key not configured. Cannot rewrite text.");
      sendResponse({ error: "API key not configured", originalPostId: postId });
      return false; // No async response will be sent
    }

    // Make the actual API call
    async function rewriteTextWithGemini() {
      try {
        const prompt = `Rewrite the following LinkedIn post using extremely simple words, like you're talking to a very young child who knows very few words. Make sentences very short. Use the absolute simplest vocabulary possible. Focus only on the main idea. Original post: "${text}"`;
        console.log(`[Background] Sending prompt to Gemini for ${postId}: "${prompt.substring(0, 200)}..."`);
        
        const result = await model.generateContent(prompt);
        const responseFromAPI = result.response;
        const rewrittenText = responseFromAPI.text();

        console.log(`[Background] Rewritten text from Gemini for ${postId}: "${rewrittenText.substring(0, 100)}..."`);
        sendResponse({ rewrittenText: rewrittenText, originalPostId: postId });
      } catch (error) {
        console.error(`[Background] Error calling Gemini API for ${postId}:`, error);
        sendResponse({ error: `Gemini API Error: ${error.message}`, originalPostId: postId });
      }
    }

    rewriteTextWithGemini();
    return true; // Indicates that the response will be sent asynchronously

  } else {
    console.log(`[Background] Received unhandled message type: ${request.type}`);
    // sendResponse({ error: 'Unknown message type' }); // Optional: send error for unhandled types
  }
  return false; // Explicitly return false if not handling this message type or not sending async response
});

console.log('DumbedIn Background Script Setup Complete.');
