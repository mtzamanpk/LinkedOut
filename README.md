# DumbedIn: LinkedIn Post Rewriter

DumbedIn is a browser extension that uses the Google Gemini API to automatically rewrite LinkedIn posts into simpler, easier-to-understand language. The goal is to make LinkedIn content more accessible and allow users to quickly grasp the core message of posts.

## Features

*   **Automatic Post Detection:** Identifies LinkedIn posts as you scroll through your feed.
*   **AI-Powered Rewriting:** Leverages the Google Gemini API (`gemini-1.5-flash-latest`) to simplify post text.
*   **On-Page Display:** Shows the rewritten text directly within the LinkedIn interface, replacing the original post content.
*   **Toggle Functionality:** Allows users to easily switch between viewing the original post text and the rewritten (simplified) version via a popup menu.
*   **Persistent Choice:** Remembers the user's preference (original or rewritten) across sessions.
*   **Secure API Key Handling:** Uses a `.env` file (via Vite's `import.meta.env`) to manage the Gemini API key locally.

## How It Works

1.  **Content Script (`content.js`):**
    *   Injects into LinkedIn pages.
    *   Detects post text elements in the DOM.
    *   Sends the original post text to the background script for rewriting.
    *   Receives the rewritten text and stores both original and rewritten versions.
    *   Updates the DOM to display either the original or rewritten text based on user preference.
    *   Listens for messages from the popup to toggle the display mode.

2.  **Background Script (`background.js`):**
    *   Manages communication with the Google Gemini API.
    *   Receives text from the content script.
    *   Constructs a prompt to instruct the Gemini model to simplify the text.
    *   Sends the prompt to the API and returns the rewritten text to the content script.
    *   Handles API errors.

3.  **Popup UI (`src/App.jsx` and `popup.html`):**
    *   Provides a simple user interface accessible via the extension icon.
    *   Allows the user to toggle between viewing original LinkedIn posts and the simplified "DumbedDown" versions.
    *   Persists the user's display mode choice using `chrome.storage.local`.

## Tech Stack

*   **Browser Extension Framework:** Standard WebExtensions APIs (manifest v3)
*   **JavaScript Bundler/Build Tool:** Vite
*   **Popup UI Library:** React
*   **AI Model:** Google Gemini API (`gemini-1.5-flash-latest` via `@google/generative-ai` SDK)

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd DumbedIn
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the project root and add your Gemini API key:
    ```env
    VITE_GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
    ```
    *Obtain your API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).*
4.  **Build the extension:**
    ```bash
    npm run build
    ```
    This will create a `dist` folder with the packaged extension files.
5.  **Load the extension in your browser:**
    *   **Chrome/Edge:**
        1.  Open `chrome://extensions` or `edge://extensions`.
        2.  Enable "Developer mode".
        3.  Click "Load unpacked".
        4.  Select the `dist` folder from this project.

## Usage

1.  Navigate to LinkedIn.
2.  As posts load, they will be automatically rewritten (or displayed according to your last preference).
3.  Click the DumbedIn extension icon in your browser toolbar to open the popup.
4.  Use the toggle button in the popup to switch between viewing the original LinkedIn post text and the simplified version.

## Future Enhancements (from PRD)

*   User-configurable simplification levels (Low, Medium, High).
*   "Dumbify" toggle for more extreme simplification styles.
*   Configurable filler-word frequency.
*   Side-by-side original vs. rewritten comparison.
*   Options to copy rewritten text or report poor rewrites.
*   Functionality to apply rewrites to the LinkedIn post editor.

_This README was last updated on: May 19, 2025._