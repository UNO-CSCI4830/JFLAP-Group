import { useEffect, useState } from 'react';
import './Grammars.css';

type Prod = { lhs: string; rhs: string };

function BruteForceParse() {
  const [productions, setProductions] = useState<Prod[]>([]);
  const [inputString, setInputString] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('webflap:bruteForceGrammar');
      if (raw) {
        const parsed = JSON.parse(raw) as Prod[];
        setProductions(parsed);
      }
    } catch (err) {
      console.error('Failed to load grammar from localStorage', err);
    }
  }, []);

  const startParse = () => {
    // Placeholder: currently just logs to console. Replace with real parse invocation.
    console.log('Starting brute force parse with grammar:', productions, 'and input:', inputString);
    alert(`Would start brute force parse for input: "${inputString}"\nSee console for grammar.`);
  };

  return (
    <div className="jflap-container">
      <div className="jflap-title-bar">WebFlap: Brute Force Parse</div>

      <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 900 }}>
          <h3>Grammar</h3>
          <div style={{ width: '100%', background: '#fff', border: '1px solid #e5e7eb', padding: 12, borderRadius: 6 }}>
          {productions.length === 0 && <div style={{ color: '#6b7280' }}>No grammar found. Go to the Grammars tab and save a grammar before opening this page.</div>}
          {productions.map((p, i) => (
            <div key={i} style={{ fontFamily: 'monospace', padding: '6px 0' }}>{p.lhs} → {p.rhs}</div>
          ))}
        </div>

          <h3 style={{ marginTop: 20 }}>Input to parse</h3>
        <input
          type="text"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          placeholder="Enter string to parse (e.g. aaab)"
          style={{ padding: '10px 12px', width: '60%', borderRadius: 6, border: '1px solid #e5e7eb' }}
        />

        <div style={{ marginTop: 16 }}>
          <button onClick={startParse} style={{ padding: '8px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Start Parse</button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default BruteForceParse;
