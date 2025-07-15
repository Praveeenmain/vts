import React, { useState, useEffect } from 'react';
import MicButton from '../components/MicButton';
import TranscriptionBox from '../components/TranscriptionBox';
import AIEnhancer from '../components/AIEnhancer';
import './Notepad.css';

// Add these imports for the new features
import KnowledgeMapModal from '../components/KnowledgeMapModal';
import nlp from 'compromise';

const LOCAL_STORAGE_KEY = 'notepad_notes';

const extractKeywords = (text) => {
  return nlp(text).nouns().out('array');
};

const Notepad = () => {
  const [transcription, setTranscription] = useState('');
  const [notes, setNotes] = useState([]);
  const [showMap, setShowMap] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const handleClear = () => setTranscription('');

  const handleSaveNote = () => {
    if (!transcription.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      content: transcription,
      keywords: extractKeywords(transcription),
      created: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setTranscription('');
  };

  const handleAddSamples = (samples) => {
    // Avoid duplicate IDs
    const existingIds = new Set(notes.map(n => n.id));
    const filtered = samples.filter(s => !existingIds.has(s.id));
    setNotes([...filtered, ...notes]);
  };

  return (
    <div className="notepad-bg">
      <div className="notepad-card">
        <header className="notepad-header">
          <h1 className="notepad-title">Voice to Text AI Notepad</h1>
          <p className="notepad-subtitle">Transcribe and enhance your thoughts with AI</p>
        </header>
        <div>
          <MicButton onTranscription={setTranscription} />
          <TranscriptionBox text={transcription} />
          <button className="ai-enhancer-btn" onClick={handleSaveNote} disabled={!transcription.trim()} style={{marginTop:8}}>Save Note</button>
        </div>
        <AIEnhancer text={transcription} onClear={handleClear} />
        <button className="ai-enhancer-btn" onClick={() => setShowMap(true)} style={{marginTop:16}}>Knowledge Map</button>
        <ul style={{marginTop:16}}>
          {notes.map(note => (
            <li key={note.id} style={{marginBottom:8, textAlign:'left'}}>
              <b>{new Date(note.created).toLocaleString()}:</b> {note.content}
            </li>
          ))}
        </ul>
      </div>
      <KnowledgeMapModal notes={notes} open={showMap} onClose={() => setShowMap(false)} onAddSamples={handleAddSamples} />
      <footer className="notepad-footer">&copy; {new Date().getFullYear()} Voice to Text AI Notepad</footer>
    </div>
  );
};

export default Notepad; 