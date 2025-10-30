import { useState } from 'react';
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
              <div className="menu-option">New...</div>
              <div className="menu-option">Open...</div>
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
              <div className="menu-option">Build LL(1) Parse Table</div>
              <div className="menu-option">Build SLR(1) Parse Table</div>
              <div className="menu-option">Brute Force Parse</div>
              <div className="menu-option">Multiple Brute Force Parse</div>
              <div className="menu-option">User Control Parse</div>
              <div className="menu-option">CYK Parse</div>
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
              <div className="menu-option">Convert CFG to PDA (LL)</div>
              <div className="menu-option">Convert CFG to PDA (LR)</div>
              <div className="menu-option">Convert Right-Linear Grammar to FA</div>
              <div className="menu-option">Transform Grammar</div>
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
              <div className="menu-option">Help...</div>
              <div className="menu-option">About...</div>
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

