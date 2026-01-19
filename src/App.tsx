import { useState, useEffect } from 'react';
import { SelectUnit } from './components/SelectUnit';
import { Learn } from './components/Learn';
import type { UnitData } from './data/types';
import type { Language } from './i18n';

function App() {
  const [currentUnit, setCurrentUnit] = useState<UnitData | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('wordmoment_language');
    return (saved === 'zh' || saved === 'ja') ? saved : 'zh';
  });

  useEffect(() => {
    localStorage.setItem('wordmoment_language', language);
  }, [language]);

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
          language={language}
          setLanguage={setLanguage}
        />
      )}
    </div>
  );
}

export default App;
