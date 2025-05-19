import React, { useState } from 'react';

function App() {
  // State for text areas
  const [originalText, setOriginalText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');

  // State for controls
  const [simplificationLevel, setSimplificationLevel] = useState('Medium');
  const [isDumbifyOn, setIsDumbifyOn] = useState(false);
  const [fillerFrequency, setFillerFrequency] = useState('Rare');

  // Placeholder handlers (will be implemented later)
  const handleRewrite = () => {
    console.log('Rewrite triggered with settings:', {
      originalText,
      simplificationLevel,
      isDumbifyOn,
      fillerFrequency,
    });
    // TODO: Get text from content script, call API, update rewrittenText
    setRewrittenText('// Rewritten text will appear here... (API call needed)');
  };

  const handleApply = () => {
    console.log('Apply clicked');
    // TODO: Send rewrittenText to content script to update editor
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenText)
      .then(() => console.log('Copied to clipboard'))
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <div className="container">
      <h1>Simplify & Dumb-Down</h1>

      <div className="text-areas">
        <label htmlFor="original">Original Text:</label>
        <textarea
          id="original"
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          placeholder="Paste or type LinkedIn post here..."
        />
        <label htmlFor="rewritten">Rewritten Text:</label>
        <textarea
          id="rewritten"
          value={rewrittenText}
          readOnly // Rewritten text comes from API
          placeholder="Simplified text will appear here..."
        />
      </div>

      <div className="controls">
        <label htmlFor="level">
          Simplification Level:
          <select id="level" value={simplificationLevel} onChange={(e) => setSimplificationLevel(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label htmlFor="dumbify">
          Dumbify Toggle:
          <input
            id="dumbify"
            type="checkbox"
            checked={isDumbifyOn}
            onChange={(e) => setIsDumbifyOn(e.target.checked)}
          />
        </label>

        <label htmlFor="filler">
          Filler Frequency:
          <select id="filler" value={fillerFrequency} onChange={(e) => setFillerFrequency(e.target.value)}>
            <option value="None">None</option>
            <option value="Rare">Rare</option>
            <option value="Frequent">Frequent</option>
          </select>
        </label>
      </div>

       {/* Button to trigger the rewrite - might replace with live updates later */}
       <button onClick={handleRewrite}>Rewrite Text</button>

      <div className="actions">
        <button onClick={handleApply}>Apply</button>
        <button onClick={handleCopy}>Copy</button>
      </div>
    </div>
  );
}

export default App;
