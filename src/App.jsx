import { useState, useEffect } from 'react';
import './App.css'; // We'll create this next

function App() {
  // Default to 'rewritten' as content.js now shows rewritten text by default
  const [currentMode, setCurrentMode] = useState('rewritten'); 

  // Load initial mode from storage when popup opens
  useEffect(() => {
    chrome.storage.local.get(['displayMode'], (result) => {
      if (result.displayMode) {
        setCurrentMode(result.displayMode);
        // Ensure content script is also in sync if popup is reopened
        // This is a bit redundant if content.js always starts in rewritten,
        // but good for consistency if that default changes.
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'SET_DISPLAY_MODE', mode: result.displayMode });
            }
        });
      }
    });
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleToggleMode = () => {
    const newMode = currentMode === 'original' ? 'rewritten' : 'original';
    setCurrentMode(newMode);
    chrome.storage.local.set({ displayMode: newMode }); // Save preference

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'SET_DISPLAY_MODE', mode: newMode },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending SET_DISPLAY_MODE message:', chrome.runtime.lastError.message);
            } else {
              console.log('Popup: Display mode message sent, response:', response);
            }
          }
        );
      } else {
        console.error("Popup: Could not find active tab to send message.");
      }
    });
  };

  return (
    <div className="app-container">
      <h1>DumbedIn Toggle</h1>
      <button onClick={handleToggleMode} className="toggle-button">
        Show {currentMode === 'original' ? 'Simplified Text' : 'Original Text'}
      </button>
      <p className="current-mode-text">
        Currently displaying: {currentMode === 'original' ? 'Original LinkedIn Posts' : 'Simplified (DumbedDown) Posts'}
      </p>
    </div>
  );
}

export default App;