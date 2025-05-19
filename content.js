console.log('DumbedIn Content Script Loaded');

// Selector for the main container of a LinkedIn post.
// Targets divs with data-urn attributes starting with 'urn:li:activity:' (standard posts)
// or 'urn:li:share:' (shared posts).
const POST_CONTAINER_SELECTOR = 'div[data-urn^="urn:li:activity:"], div[data-urn^="urn:li:share:"]';
const POST_TEXT_SELECTOR = 'span.break-words'; // Selector for the main text content within a post

let processedPosts = new Set(); // Keep track of processed posts

function findAndProcessPosts() {
  console.log(`Attempting to find posts with container selector: "${POST_CONTAINER_SELECTOR}"`);
  const postElements = document.querySelectorAll(POST_CONTAINER_SELECTOR);
  console.log(`Found ${postElements.length} potential post(s) with current container selector.`);

  postElements.forEach((postElement, index) => {
    console.log(`[Loop Start] Processing post container #${index + 1}. Element:`, postElement);

    // Create a unique ID for the post if it doesn't have one, or use an existing stable attribute
    // For now, we'll rely on the element reference for the Set, but a stable ID is better.
    if (processedPosts.has(postElement)) {
      console.log(`[Loop Skip] Post container #${index + 1} already processed or being processed.`);
      return; // Skip already processed posts
    }

    const textElement = postElement.querySelector(POST_TEXT_SELECTOR);
    console.log(`[Debug] Post #${index + 1}: textElement (using "${POST_TEXT_SELECTOR}"):`, textElement);

    if (textElement) {
      console.log(`[Debug] Post #${index + 1}: textElement.innerText: "${textElement.innerText}"`);
      const originalText = textElement.innerText.trim();
      console.log(`[Debug] Post #${index + 1}: originalText (after trim): "${originalText}"`);
      console.log(`[Debug] Post #${index + 1}: typeof originalText: ${typeof originalText}, length: ${originalText.length}`);

      if (originalText && originalText.length > 0) {
        console.log(`Processing post ${index + 1} text: "${originalText.substring(0, 100)}..."`);

        // Send the text to the background script for rewriting
        processedPosts.add(postElement); // Mark as processing to avoid race conditions if observer fires quickly
        const postId = `post-${index}`;
        console.log(`[Content] Attempting to send message for ${postId}...`);
        chrome.runtime.sendMessage({ type: 'rewriteText', text: originalText, postId: postId }, (response) => {
          // Check for errors when the response is received (or not received)
          if (chrome.runtime.lastError) {
            console.error(`[Content] Error receiving response for ${postId}:`, chrome.runtime.lastError.message);
            // Optionally remove from processedPosts to allow reprocessing if sending/response failed
            // processedPosts.delete(postElement); 
            return;
          }
          
          console.log(`[Content] Received response for ${postId}:`, response);
          if (response && response.rewrittenText) {
            console.log(`[Content] Rewritten text for ${response.originalPostId}: "${response.rewrittenText.substring(0, 100)}..."`);
            
            // Store original text if not already stored, and mark as processed
            if (!textElement.dataset.originalText) {
              textElement.dataset.originalText = originalText; // originalText from the outer scope
            }
            textElement.dataset.rewrittenText = response.rewrittenText;
            textElement.classList.add('dumbedin-processed');

            // Display rewritten text by default (or based on a stored preference later)
            textElement.innerText = response.rewrittenText;

          } else {
            console.log(`[Content] No response or no rewritten text for ${response ? response.originalPostId : postId}`);
            if (response && response.error) {
              // Optionally, display a small error indicator if rewriting failed
              if (!textElement.dataset.originalText) { // Ensure original is still there
                textElement.dataset.originalText = originalText;
              }
              textElement.classList.add('dumbedin-processed', 'dumbedin-error');
              // textElement.innerText = textElement.dataset.originalText + " (Rewrite Error)"; // Or keep original
            }
          }
        });
        console.log(`[Content] Message sent for ${postId} (or at least, the call to sendMessage was made).`);

      } else {
        console.log(`Post ${index + 1}: Found text element with selector "${POST_TEXT_SELECTOR}", but it is empty or contains only whitespace.`);
      }
    } else {
      console.log(`Post ${index + 1}: Text element with selector "${POST_TEXT_SELECTOR}" NOT FOUND within this post container.`);
    }
  });
}

// Listen for messages from the popup to change display mode
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SET_DISPLAY_MODE') {
    console.log(`[Content] Received SET_DISPLAY_MODE request:`, request.mode);
    const processedElements = document.querySelectorAll('.dumbedin-processed');
    processedElements.forEach(element => {
      if (request.mode === 'original') {
        if (element.dataset.originalText) {
          element.innerText = element.dataset.originalText;
        }
      } else if (request.mode === 'rewritten') {
        if (element.dataset.rewrittenText) {
          element.innerText = element.dataset.rewrittenText;
        } else if (element.classList.contains('dumbedin-error') && element.dataset.originalText) {
          // If error and trying to show rewritten, show original with error or just original
          element.innerText = element.dataset.originalText + " (Rewrite N/A)";
        }
      }
    });
    sendResponse({ status: 'Display mode updated', mode: request.mode });
    return true; // Indicate async response if needed, though this is sync for now
  }
});

function setupObserver() {
  // Observe DOM changes to detect new posts (e.g., infinite scroll)
  const observer = new MutationObserver((mutationsList, observer) => {
    // For simplicity, re-scan for posts on any significant DOM change in the body.
    // More specific observation targets could improve performance.
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if added nodes could be new posts or containers of posts
        // A more sophisticated check could look at the class/structure of addedNodes
        console.log('DOM changed, checking for new posts...');
        findAndProcessPosts();
        break; // No need to check other mutations if we already decided to re-scan
      }
    }
  });

  // Start observing the document body for added nodes
  observer.observe(document.body, { childList: true, subtree: true });
}

// Initial scan
findAndProcessPosts();
// Set up the observer for dynamic content
setupObserver();

console.log('DumbedIn Content Script Setup Complete.');
