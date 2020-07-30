import React, {useState} from 'react';

const nRows= 50, nCols = 50

const App : React.FC = () => {
  const [ grid, setGrid ] = useState(() => {
    const rows = [];
    for(let i = 0; i < nRows; i++) {
      rows.push(Array.from(Array(nCols), () => 0));
    }
    return rows;
  });

  return (
    <div style ={{
      display: 'grid',
      gridTemplateColumns: `repeat(${nCols}, 20px)`,
    }}>
      {
        grid.map((rows, i) => 
          rows.map((cols, j) => (
          <div 
            key={`${i} - ${j}`} 
            style={{
              width: 20,
              height : 20,
              backgroundColor : grid[i][j] ? 'blue' : undefined,
              border : "solid 0.5px grey"
            }} 
          />
        )))
      }
    </div>
  )
}

export default App;
