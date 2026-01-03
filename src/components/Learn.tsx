import React from 'react';
import { useWordEngine } from '../hooks/useWordEngine';
import { Typing } from './Typing';
import { Reinforcement } from './Reinforcement';
import { Complete } from './Complete';
import type { UnitData } from '../data/types';

interface LearnProps {
    unitData: UnitData;
    onExit: () => void;
}

export const Learn: React.FC<LearnProps> = ({ unitData, onExit }) => {
    const {
        currentWord,
        phase,
        inputVal,
        handleInput,
        submitInput,
        currentReinforcementWord,
        advanceReinforcement,
        progress,
        totalWords,
        resetProgress
    } = useWordEngine({ unitData });

    // Handle Escape to exit
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onExit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onExit]);

    return (
        <div className="learn-container">
            {/* Progress Bar */}
            {phase !== 'complete' && (
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${(progress / totalWords) * 100}%` }}
                    />
                </div>
            )}

            {/* Exit Button */}
            <button
                onClick={onExit}
                className="exit-btn"
            >
                ✕ Exit
            </button>

            {/* Main Content */}
            <div className="learn-content">
                {phase === 'typing' && (
                    <Typing
                        key={currentWord.en}
                        word={currentWord}
                        inputVal={inputVal}
                        onInput={handleInput}
                        onSubmit={submitInput}
                    />
                )}

                {phase === 'reinforcement' && currentReinforcementWord && (
                    <Reinforcement
                        key={currentReinforcementWord.en}
                        word={currentReinforcementWord}
                        onComplete={advanceReinforcement}
                    />
                )}

                {phase === 'complete' && (
                    <Complete
                        onRestart={resetProgress}
                        onHome={onExit}
                    />
                )}
            </div>
        </div>
    );
};
