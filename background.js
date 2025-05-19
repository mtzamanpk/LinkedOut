console.log('DumbedIn Background Script Loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Background] Message received:', request);
  console.log('[Background] Sender details:', sender);

  if (request.type === 'rewriteText') {
    const { text, postId } = request;
    console.log(`[Background] Received text to rewrite for ${postId}: "${text.substring(0, 100)}..."`);

    // Placeholder for Gemini API call
    // For now, simulate a rewrite and a delay
    setTimeout(() => {
      const rewrittenText = `DUMBED DOWN: ${text.substring(0, 50)}... (simulated)`;
      console.log(`[Background] Sending rewritten text for ${postId}: "${rewrittenText.substring(0, 100)}..."`);
      sendResponse({ rewrittenText: rewrittenText, originalPostId: postId });
    }, 1000);

    return true; // Indicates that the response will be sent asynchronously
  } else {
    console.log(`[Background] Received unhandled message type: ${request.type}`);
    sendResponse({ error: 'Unknown message type' });
  }
});

console.log('DumbedIn Background Script Setup Complete.');
