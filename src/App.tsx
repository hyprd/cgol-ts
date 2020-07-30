import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';

const nRows = 25, nCols = 25

// Directional operations for neighbours
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

const generateEmptyGrid = () => {
  const rows = [];
  for(let i = 0; i < nRows; i++) {

    rows.push(Array.from(Array(nCols), () => 0));
  }
  return rows;
}

const App : React.FC = () => {
  const [ grid, setGrid ] = useState(() => {
    return generateEmptyGrid()
  });

  const [running, setRunning] = useState(false)

  // ref in order for runSimulation to have current context of 'running'
  const runningRef = useRef(running);
  runningRef.current = running;

  // useCallback -> don't recreate every render
  const runSimulation = useCallback(() => {
    // Breaking conditional
    if(!runningRef.current) {
      return;
    }

    // Simulation ;ogic
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < nRows; i++) {
          for(let j = 0; j < nCols; j++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x
              const newJ = j + y
              // Boundary check for nodes on the edge of the grid
              if(newI >= 0 && newI < nRows && newJ >= 0 && newJ < nCols) {
                neighbours += g[newI][newJ]
              }
            });
            // Grid node updating logic
            if(neighbours < 2 || neighbours > 3) {
              gridCopy[i][j] = 0;
            } else if(g[i][j] === 0 && neighbours === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    // Repeating conditional
    setTimeout(runSimulation, 100)
  }, [])

  return (
    <div>
      <button onClick={() => { 
        setRunning(!running) 
        if(!running) {
          // Prevent race conditions if state update doesn't happen in time
          runningRef.current = true;
          runSimulation()
        } 
      }}>
        { running ? 'stop simulation' : 'start simulation' } 
      </button>
      <button onClick={() => { setGrid(generateEmptyGrid()) }}>clear</button>
      <button onClick={() => {
        const rows = [];
        for(let i = 0; i < nRows; i++) {
  
          rows.push(Array.from(Array(nCols), () => (Math.random() > 0.7 ? 1 : 0)));
        }
        setGrid(rows);
      }}>randomize</button>
      <div style ={{
        display: 'grid',
        gridTemplateColumns: `repeat(${nCols}, 20px)`,
      }}>
        {
          grid.map((rows, i) => 
            rows.map((cols, j) => (
            <div 
              key={`${i} - ${j}`} 
              onClick={() => {
                // Generate an immutable copy of grid
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = 1;
                })
                setGrid(newGrid)
              }}
              style={{
                width: 20,
                height : 20,
                backgroundColor : grid[i][j] ? 'black' : undefined,
                border : "solid 1px grey"
              }} 
            />
          )))
        }
      </div>
    </div>
  )
}

export default App;
