import { useEffect, useState } from 'react';

export default function PasteView({ pasteId }) {
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPaste() {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE_URL}/api/pastes/${pasteId}`);
        if (!res.ok) {
          setError('Paste not found or unavailable');
          return;
        }
        const data = await res.json();
        setPaste(data);
      } catch {
        setError('Server error');
      }
    }

    fetchPaste();
  }, [pasteId]);

  if (error) {
    return (
      <div style={{ padding: 20, color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!paste) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      {paste.content}
    </div>
  );
}