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
    // Create a unique ID for the post if it doesn't have one, or use an existing stable attribute
    // For now, we'll rely on the element reference for the Set, but a stable ID is better.
    if (processedPosts.has(postElement)) {
      return; // Skip already processed posts
    }

    const textElement = postElement.querySelector(POST_TEXT_SELECTOR);

    if (textElement) {
      const originalText = textElement.innerText;
      console.log(`Processing post ${index + 1} text: "${originalText.substring(0, 100)}..."`);

      // Mark as processing to avoid race conditions if observer fires quickly
      processedPosts.add(postElement); 

      // Send the text to the background script for rewriting
      chrome.runtime.sendMessage({ type: 'rewriteText', text: originalText, postId: `post-${index}` }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message to background:', chrome.runtime.lastError.message);
          processedPosts.delete(postElement); // Allow reprocessing if sending failed
          return;
        }
        if (response && response.rewrittenText) {
          console.log(`Rewritten text for post-${index}: "${response.rewrittenText.substring(0, 100)}..."`);
          // TODO: Implement DOM manipulation to display the rewritten text
          // For example, replace the content of textElement or add a new element
          // textElement.innerText = response.rewrittenText; // Simple replacement for now
          const newTextNode = document.createTextNode(` (DumbedIn: ${response.rewrittenText})`);
          textElement.parentNode.insertBefore(newTextNode, textElement.nextSibling);

        } else {
          console.log(`No response or no rewritten text for post-${index}`);
          // If no rewrite, perhaps remove from processed if we want to retry later under different conditions
          // For now, we keep it in processedPosts to avoid repeatedly trying to rewrite something that failed.
        }
      });
    } else {
      console.log(`Post ${index + 1} does not contain the text selector "${POST_TEXT_SELECTOR}" or is empty.`);
    }
  });
}

// Initial scan
findAndProcessPosts();

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

console.log('DumbedIn Content Script Setup Complete.');
