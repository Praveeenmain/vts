import React, { useState, useRef } from 'react';
import './MicButton.css';

const MicButton = ({ onTranscription }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Web Speech API not supported in this browser.');
      return;
    }
    if (!listening) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        onTranscription(transcript);
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } else {
      recognitionRef.current && recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <button
      onClick={handleMicClick}
      className={`mic-btn${listening ? ' listening' : ''}`}
      aria-label={listening ? 'Stop recording' : 'Start recording'}
    >
      {listening ? '🎤 (Stop)' : '🎤 (Start)'}
    </button>
  );
};

export default MicButton; 