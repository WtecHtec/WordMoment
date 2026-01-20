import React from 'react';
import zhData from '../data/zh_data.json';
import jaData from '../data/ja_data.json';
import { useTranslation, type Language } from '../i18n';
import type { UnitData } from '../data/types';

interface SelectUnitProps {
    onSelect: (data: UnitData) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const WORD_DATA: Record<'zh' | 'ja', UnitData[]> = {
    zh: zhData,
    ja: jaData,
};
export const SelectUnit: React.FC<SelectUnitProps> = ({ onSelect, language, setLanguage }) => {
    const t = useTranslation(language);
    const currentData = WORD_DATA[language as 'zh'] || WORD_DATA['zh'];
    // Check completion status
    const isUnitComplete = (level: string, unit: string) => {
        try {
            const saved = localStorage.getItem('wordmoment_progress');
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed[level]?.[unit]?.finished;
            }
        } catch (e) {
            return false;
        }
        return false;
    };

    return (
        <div className="select-unit-container overflow-auto h-full">
            <div className="title-section relative">
                <div className="absolute right-0 top-0 flex gap-2">
                    <button
                        onClick={() => setLanguage('zh')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${language === 'zh'
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        {t.languageZh}
                    </button>
                     <button
                        onClick={() => setLanguage('ja')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${language === 'ja'
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        {t.languageJa}
                    </button> 
                </div>
                <h1 className="app-title">
                    {t.title}
                </h1>
                <p className="app-subtitle">
                    {t.subtitle}
                </p>
            </div>

            {/* Effect Selector */}
            <div className="w-full max-w-md px-6 mb-8">
                <div className="relative">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 ml-1">
                        {t.animationStyle}
                    </label>
                    <div className="relative group">
                        <select
                            className="w-full appearance-none bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/50 text-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 block p-4 pr-10 transition-all duration-200 cursor-pointer outline-none shadow-lg backdrop-blur-sm"
                            defaultValue="smash"
                        >
                            <option value="smash">{t.animationSmash}</option>
                            <option value="standard" disabled>{t.animationStandard}</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-sky-400 transition-colors">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="unit-grid">
                {currentData.map((unitData, index) => {
                    const isComplete = isUnitComplete(unitData.level, unitData.unit);
                    return (
                        <button
                            key={`${unitData.level}-${unitData.unit}-${index}`}
                            onClick={() => onSelect(unitData as UnitData)}
                            className="unit-card group"
                        >
                            <div className="unit-card-indicator" />
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="unit-title">{unitData.level} {unitData.unit}</h3>
                                    <p className="unit-desc">{unitData.words.length} {t.words} • {t.basicVocabulary}</p>
                                </div>
                                {isComplete && (
                                    <div className="bg-green-500/20 text-green-400 p-1.5 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}

                {/* Placeholder for more units */}
                <div className="unit-card" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    {t.moreComingSoon}
                </div>
            </div>
        </div>
    );
};
