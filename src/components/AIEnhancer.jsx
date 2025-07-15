import React, { useState } from 'react';
import './AIEnhancer.css';

const AIEnhancer = ({ text, onClear }) => {
  const [loading, setLoading] = useState(false);
  const [enhanced, setEnhanced] = useState('');
  const [error, setError] = useState('');

  const handleEnhance = async () => {
    setLoading(true);
    setError('');
    setEnhanced('');
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Voice to Text AI Notepad',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'moonshotai/kimi-k2:free',
          messages: [
            { role: 'user', content: `Format this into clean, structured writing:\n${text}` },
          ],
        }),
      });
      const data = await response.json();
      setEnhanced(data.choices?.[0]?.message?.content || '');
    } catch (e) {
      setError('Failed to enhance text.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhanced || text);
  };

  const handleDownload = () => {
    const blob = new Blob([enhanced || text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notepad.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ai-enhancer">
      <button
        className="ai-enhancer-btn"
        onClick={handleEnhance}
        disabled={!text || loading}
      >
        {loading ? 'Enhancing...' : 'Enhance with AI'}
      </button>
      {error && <div className="ai-enhancer-error">{error}</div>}
      {enhanced && (
        <div className="ai-enhancer-output">
          {enhanced}
        </div>
      )}
      <div className="ai-enhancer-row">
        <button className="ai-enhancer-btn" onClick={handleCopy} disabled={!(enhanced || text)}>Copy</button>
        <button className="ai-enhancer-btn" onClick={onClear}>Clear</button>
        <button className="ai-enhancer-btn" onClick={handleDownload} disabled={!(enhanced || text)}>Download as .txt</button>
      </div>
    </div>
  );
};

export default AIEnhancer; 