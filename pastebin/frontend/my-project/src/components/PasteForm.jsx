import { useState } from 'react';

export default function PasteForm() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setError('');

    try {
      const body = { content };
      if (ttl) body.ttl_seconds = parseInt(ttl);
      if (maxViews) body.max_views = parseInt(maxViews);

      const res = await fetch('http://localhost:3001/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error creating paste');
        return;
      }
      setResult(data.url);
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Create a Paste</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Paste content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          style={{ width: '100%', marginBottom: 10 }}
          required
        />
        <input
          type="number"
          placeholder="TTL (optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          style={{ width: '48%', marginRight: '4%' }}
          min={1}
        />
        <input
          type="number"
          placeholder="Max views (optional)"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
          style={{ width: '48%' }}
          min={1}
        />

        <button type="submit" style={{ marginTop: 10, marginLeft: 25 }}>Create</button>
      </form>

      {result && (
        <div style={{ marginTop: 10 }}>
          <strong>Paste URL:</strong> <a href={result}>{result}</a>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 10, color: 'red' }}>{error}</div>
      )}
    </div>
  );
}
