import React from 'react';
import './TranscriptionBox.css';

const TranscriptionBox = ({ text }) => (
  <div className="transcription-box">
    {text ? text : <span className="transcription-placeholder">Start speaking to see transcription...</span>}
  </div>
);

export default TranscriptionBox; 