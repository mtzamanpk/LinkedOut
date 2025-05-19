console.log('DumbedIn Background Script Loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message in background:', request);

  if (request.type === "REWRITE_TEXT") {
    const originalText = request.text;
    const postId = request.postId;
    console.log(`Background: Received text to rewrite for ${postId}:`, originalText.substring(0, 100) + '...');

    // Placeholder for Gemini API call
    // For now, simulate a rewrite and a delay
    setTimeout(() => {
      const rewrittenText = `DUMBED DOWN: ${originalText.substring(0, 50)}... (simulated)`;
      console.log(`Background: Sending rewritten text for ${postId}:`, rewrittenText);
      sendResponse({ rewrittenText: rewrittenText, originalPostId: postId });
    }, 1000);

    return true; // Indicates that the response will be sent asynchronously
  } else {
    sendResponse({ error: 'Unknown message type' });
  }
});

console.log('DumbedIn Background Script Setup Complete.');
