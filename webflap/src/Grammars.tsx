import { useState, useEffect } from 'react';
import './Grammars.css';

class Production{
  lhs: string
  rhs: string
  constructor(lhs: string, rhs: string){
    this.lhs = lhs
    this.rhs = rhs
  }

  getVariables(): string[]{
    const vars: string[] = []
    const regex = /[A-Z]/g
    let match

    //check the LHS
    while ((match = regex.exec(this.lhs)) !== null){
      if(!vars.includes(match[0])){
        vars.push(match[0])
      }
    }

    //check the RHS
    regex.lastIndex = 0
    while((match = regex.exec(this.rhs)) !== null){
      if(!vars.includes(match[0])){
        vars.push(match[0])
      }
    }

    return vars;
  }

  getTerminals(): string[]{
    const terminals: string[] = []
    const chars = this.rhs.split('')
    chars.forEach(char => {
      if(char !== 'ε' && /[a-z0-9]/.test(char)) {
        if (!terminals.includes(char)){
          terminals.push(char)
        }
      }
    })

    return terminals
  }

  //Combines the left and right strings to output a single producution line
  toString(): string{
    return `${this.lhs}→${this.rhs}`
  }

  equal(other: Production){
    return other.lhs === this.lhs && other.rhs === this.rhs
  }

  isEpsilonProduction(){
    return this.rhs === 'ε' || this.rhs === ''
  }


}


function Grammars() {
  const [productions, setProductions] = useState([
    { id: 1, lhs: '', rhs: '' },
    { id: 2, lhs: '', rhs: '' },
    { id: 3, lhs: '', rhs: '' },
    { id: 4, lhs: '', rhs: '' },
    { id: 5, lhs: '', rhs: '' },
    { id: 6, lhs: '', rhs: '' },
  ]);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // if clicked outside the menu bar, close menus
      if (!target || !target.closest('.menu-bar')) {
        setOpenMenu(null);
        setOpenSubmenu(null);
      }
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const updateProduction = (id: number, field: 'lhs' | 'rhs', value: string) => {
    const updatedProductions = productions.map(prod => 
      prod.id === id ? { ...prod, [field]: value } : prod
    );
    
    setProductions(updatedProductions);
    
    // Auto-add new row if last row is being edited
    const lastProd = updatedProductions[updatedProductions.length - 1];
    if (lastProd.id === id && value.length > 0) {
      setProductions([...updatedProductions, { id: Date.now(), lhs: '', rhs: '' }]);
    }
  };

  return (
    <div className="jflap-container">
      <div className="jflap-title-bar">
        <span>WebFlap: Grammars</span>
      </div>
      
      <div className="menu-bar">
        <div className="menu-item">
          <button 
            className="menu-button"
            onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
          >
            File
          </button>
          {openMenu === 'file' && (
            <div className="dropdown-menu">
              <div
                className="menu-option"
                onClick={() => {
                  const id = `file:New...`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                New...
                {openSubmenu === `file:New...` && (
                  <div className="submenu">
                    <div className="menu-option">From Scratch</div>
                    <div className="menu-option">From Template</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `file:Open...`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Open...
                {openSubmenu === `file:Open...` && (
                  <div className="submenu">
                    <div className="menu-option">Open Local</div>
                    <div className="menu-option">Open URL</div>
                  </div>
                )}
              </div>

              <div className="menu-option">Save</div>
              <div className="menu-option">Save As...</div>
              <div className="menu-option">Close</div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button 
            className="menu-button"
            onClick={() => setOpenMenu(openMenu === 'input' ? null : 'input')}
          >
            Input
          </button>
          {openMenu === 'input' && (
            <div className="dropdown-menu">
              <div
                className="menu-option"
                onClick={() => {
                  const id = `input:Build LL(1) Parse Table`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Build LL(1) Parse Table
                {openSubmenu === `input:Build LL(1) Parse Table` && (
                  <div className="submenu">
                    <div className="menu-option">Show Table</div>
                    <div className="menu-option">Export...</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `input:Build SLR(1) Parse Table`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Build SLR(1) Parse Table
                {openSubmenu === `input:Build SLR(1) Parse Table` && (
                  <div className="submenu">
                    <div className="menu-option">Show Table</div>
                    <div className="menu-option">Export...</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  // Prepare grammar and open brute force parse in a new tab
                  const nonEmpty = productions.filter(p => (p.lhs && p.lhs.trim() !== '') || (p.rhs && p.rhs.trim() !== ''))
                    .map(p => ({ lhs: p.lhs, rhs: p.rhs }));
                  try {
                    localStorage.setItem('webflap:bruteForceGrammar', JSON.stringify(nonEmpty));
                  } catch (err) {
                    console.error('Failed to save grammar to localStorage', err);
                  }
                  // open new tab at route /bruteforce
                  const w = window.open('/bruteforce', '_blank');
                  if (w) w.focus();
                }}
              >
                Brute Force Parse
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `input:Multiple Brute Force Parse`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Multiple Brute Force Parse
                {openSubmenu === `input:Multiple Brute Force Parse` && (
                  <div className="submenu">
                    <div className="menu-option">Start Batch</div>
                    <div className="menu-option">Load Inputs...</div>
                    <div className="menu-option">Cancel</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `input:User Control Parse`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                User Control Parse
                {openSubmenu === `input:User Control Parse` && (
                  <div className="submenu">
                    <div className="menu-option">Start Interactive</div>
                    <div className="menu-option">Instructions</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `input:CYK Parse`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                CYK Parse
                {openSubmenu === `input:CYK Parse` && (
                  <div className="submenu">
                    <div className="menu-option">Start CYK</div>
                    <div className="menu-option">Show Table</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button 
            className="menu-button"
            onClick={() => setOpenMenu(openMenu === 'convert' ? null : 'convert')}
          >
            Convert
          </button>
          {openMenu === 'convert' && (
            <div className="dropdown-menu">
              <div
                className="menu-option"
                onClick={() => {
                  const id = `convert:Convert CFG to PDA (LL)`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Convert CFG to PDA (LL)
                {openSubmenu === `convert:Convert CFG to PDA (LL)` && (
                  <div className="submenu">
                    <div className="menu-option">Open Converter</div>
                    <div className="menu-option">Options...</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `convert:Convert CFG to PDA (LR)`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Convert CFG to PDA (LR)
                {openSubmenu === `convert:Convert CFG to PDA (LR)` && (
                  <div className="submenu">
                    <div className="menu-option">Open Converter</div>
                    <div className="menu-option">Options...</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `convert:Convert Right-Linear Grammar to FA`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Convert Right-Linear Grammar to FA
                {openSubmenu === `convert:Convert Right-Linear Grammar to FA` && (
                  <div className="submenu">
                    <div className="menu-option">Open Converter</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `convert:Transform Grammar`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Transform Grammar
                {openSubmenu === `convert:Transform Grammar` && (
                  <div className="submenu">
                    <div className="menu-option">Left Factoring</div>
                    <div className="menu-option">Eliminate Left Recursion</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button 
            className="menu-button"
            onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
          >
            Help
          </button>
          {openMenu === 'help' && (
            <div className="dropdown-menu">
              <div
                className="menu-option"
                onClick={() => {
                  const id = `help:Help...`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                Help...
                {openSubmenu === `help:Help...` && (
                  <div className="submenu">
                    <div className="menu-option">Documentation</div>
                    <div className="menu-option">Tutorials</div>
                  </div>
                )}
              </div>

              <div
                className="menu-option"
                onClick={() => {
                  const id = `help:About...`;
                  setOpenSubmenu(openSubmenu === id ? null : id);
                }}
              >
                About...
                {openSubmenu === `help:About...` && (
                  <div className="submenu">
                    <div className="menu-option">Version</div>
                    <div className="menu-option">Licenses</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-tab">Editor</div>
        
        <div className="grammar-table">
          <table>
            <thead>
              <tr className="headers-row">
                <th className="lhs-cell header">LHS</th>
                <th className="arrow-cell header"></th>
                <th className="rhs-cell header">RHS</th>
              </tr>
            </thead>
            <tbody>
              {productions.map((prod) => (
                <tr key={prod.id}>
                  <td className="lhs-cell">
                    <input
                      type="text"
                      value={prod.lhs}
                      onChange={(e) => updateProduction(prod.id, 'lhs', e.target.value)}
                      placeholder=""
                    />
                  </td>
                  <td className="arrow-cell">→</td>
                  <td className="rhs-cell">
                    <input
                      type="text"
                      value={prod.rhs}
                      onChange={(e) => updateProduction(prod.id, 'rhs', e.target.value)}
                      placeholder=""
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Grammars;

