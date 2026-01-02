import { useState } from 'react';
import { SelectUnit } from './components/SelectUnit';
import { Learn } from './components/Learn';
import type { UnitData } from './data/types';

function App() {
  const [currentUnit, setCurrentUnit] = useState<UnitData | null>(null);

  return (
    <div className="w-full h-full bg-slate-900 text-slate-50 overflow-hidden">
      {currentUnit ? (
        <Learn
          unitData={currentUnit}
          onExit={() => setCurrentUnit(null)}
        />
      ) : (
        <SelectUnit
          onSelect={(unit) => setCurrentUnit(unit)}
        />
      )}
    </div>
  );
}

export default App;
