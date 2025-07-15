import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network/standalone';
import './AIEnhancer.css'; // For button styling

function getNodeLabel(content) {
  // Use first sentence or up to 40 chars
  const firstSentence = content.split(/[.!?\n]/)[0];
  return firstSentence.length > 40 ? firstSentence.slice(0, 37) + '...' : firstSentence;
}

function buildGraphData(notes) {
  const nodes = notes.map(note => ({
    id: note.id,
    label: getNodeLabel(note.content),
    title: note.content,
  }));
  const edges = [];
  // Track node degree for coloring
  const degree = {};
  notes.forEach(note => { degree[note.id] = 0; });
  for (let i = 0; i < notes.length; i++) {
    for (let j = i + 1; j < notes.length; j++) {
      if (notes[i].keywords.some(k => notes[j].keywords.includes(k))) {
        edges.push({ from: notes[i].id, to: notes[j].id });
        degree[notes[i].id]++;
        degree[notes[j].id]++;
      }
    }
  }
  // Color nodes by degree
  nodes.forEach(node => {
    if (degree[node.id] > 2) node.color = '#f59e42'; // orange for highly connected
    else if (degree[node.id] > 0) node.color = '#2563eb'; // blue for connected
    else node.color = '#b0b0b0'; // gray for isolated
  });
  return { nodes, edges };
}

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};
const cardStyle = {
  background: '#fff',
  borderRadius: '1rem',
  padding: '2rem',
  minWidth: 350,
  minHeight: 400,
  maxWidth: 700,
  maxHeight: 600,
  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
};

const sampleNotes = [
  {
    content: 'AI is transforming voice recognition technology.',
    keywords: ['AI', 'voice recognition', 'technology'],
    created: new Date().toISOString(),
    id: 'sample1',
  },
  {
    content: 'Voice recognition is used in smart assistants like Alexa.',
    keywords: ['voice recognition', 'smart assistants', 'Alexa'],
    created: new Date().toISOString(),
    id: 'sample2',
  },
  {
    content: 'AI and machine learning are key for smart assistants.',
    keywords: ['AI', 'machine learning', 'smart assistants'],
    created: new Date().toISOString(),
    id: 'sample3',
  },
  {
    content: 'Handwriting recognition is another application of AI.',
    keywords: ['handwriting recognition', 'AI', 'application'],
    created: new Date().toISOString(),
    id: 'sample4',
  },
  {
    content: 'I use this notepad to save my ideas about technology.',
    keywords: ['notepad', 'ideas', 'technology'],
    created: new Date().toISOString(),
    id: 'sample5',
  },
];

export default function KnowledgeMapModal({ notes, open, onClose, onAddSamples }) {
  const container = useRef();
  const [selected, setSelected] = useState(null);
  const [graphEmpty, setGraphEmpty] = useState(false);

  useEffect(() => {
    if (!open) return;
    const { nodes, edges } = buildGraphData(notes);
    setGraphEmpty(nodes.length === 0);
    if (nodes.length === 0) return;
    const network = new Network(container.current, { nodes, edges }, {
      nodes: { shape: 'dot', size: 18, font: { size: 16 } },
      edges: { color: '#2563eb', width: 2 },
      physics: { enabled: true },
      height: '350px',
    });
    network.on('click', params => {
      if (params.nodes.length) {
        const nodeId = params.nodes[0];
        setSelected(notes.find(n => n.id === nodeId));
      } else {
        setSelected(null);
      }
    });
    return () => network.destroy();
  }, [notes, open]);

  if (!open) return null;
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={cardStyle} onClick={e => e.stopPropagation()}>
        <button className="ai-enhancer-btn" style={{position:'absolute',top:12,right:12}} onClick={onClose}>Close</button>
        <h2 style={{marginBottom:12}}>Knowledge Map</h2>
        {onAddSamples && (
          <button className="ai-enhancer-btn" style={{marginBottom:8}} onClick={() => onAddSamples(sampleNotes)}>Add Sample Notes</button>
        )}
        <div ref={container} style={{ height: 350, width: '100%', background: '#f3f4f6', borderRadius: 8, marginBottom: 8 }} />
        {graphEmpty && (
          <div style={{marginTop: 16, color: '#888', textAlign: 'center'}}>
            {'No notes yet. Save some notes or add samples to see the knowledge map!'}
          </div>
        )}
        {selected && !graphEmpty && (
          <div style={{marginTop:16, background:'#f3f4f6', borderRadius:8, padding:12}}>
            <b>Note:</b> {selected.content}
            <div style={{fontSize:12, color:'#888', marginTop:4}}>Keywords: {selected.keywords.join(', ')}</div>
          </div>
        )}
      </div>
    </div>
  );
} 