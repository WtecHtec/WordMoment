import { useState, useEffect, useCallback } from 'react';
import type { Word, UnitData } from '../data/types';

export type Phase = 'typing' | 'reinforcement' | 'complete';

interface UseWordEngineProps {
    unitData: UnitData;
    wordsPerGroup?: number; // Not used in v0.1 strict flow but good for future
}

export const useWordEngine = ({ unitData }: UseWordEngineProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>('typing');
    const [inputVal, setInputVal] = useState('');

    // Reinforcement state
    const [queue, setQueue] = useState<Word[]>([]);
    const [currentReinforcementIndex, setCurrentReinforcementIndex] = useState(0);

    const currentWord = unitData.words[currentIndex];

    const handleInput = useCallback((val: string) => {
        if (phase !== 'typing') return;
        setInputVal(val);
    }, [phase]);

    const submitInput = useCallback((): boolean => {
        if (phase !== 'typing') return false;

        // Case insensitive check
        if (inputVal.trim().toLowerCase() === currentWord.en.toLowerCase()) {
            // Correct!
            // Build queue: 0 to currentIndex (inclusive)
            const newQueue = unitData.words.slice(0, currentIndex + 1);
            setQueue(newQueue);
            setCurrentReinforcementIndex(0);
            setPhase('reinforcement');
            setInputVal(''); // Clear for next time
            return true;
        } else {
            // Shake effect or error feedback could be added here
            console.log('Incorrect');
            return false;
        }
    }, [phase, inputVal, currentWord, currentIndex, unitData.words]);

    const advanceReinforcement = useCallback(() => {
        if (phase !== 'reinforcement') return;

        if (currentReinforcementIndex < queue.length - 1) {
            // Move to next word in queue
            setCurrentReinforcementIndex(prev => prev + 1);
        } else {
            // Queue finished
            // Check if unit is complete
            if (currentIndex < unitData.words.length - 1) {
                // Next new word
                setCurrentIndex(prev => prev + 1);
                setPhase('typing');
            } else {
                // Unit complete
                setPhase('complete');
            }
        }
    }, [phase, currentReinforcementIndex, queue.length, currentIndex, unitData.words.length]);

    // Load progress from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('wordmoment_progress');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Simple restoration logic for v0.1
                // We only restore if it matches the current unit
                if (parsed[unitData.level]?.[unitData.unit]) {
                    const { currentIndex: savedIndex, finished } = parsed[unitData.level][unitData.unit];
                    if (finished) {
                        setPhase('complete');
                        setCurrentIndex(unitData.words.length - 1);
                    } else {
                        setCurrentIndex(savedIndex);
                    }
                }
            } catch (e) {
                console.error('Failed to load progress', e);
            }
        }
    }, [unitData.level, unitData.unit, unitData.words.length]);

    // Save progress
    useEffect(() => {
        const saveProgress = () => {
            const currentProgress = {
                [unitData.level]: {
                    [unitData.unit]: {
                        currentIndex,
                        finished: phase === 'complete'
                    }
                }
            };

            // Merge with existing
            const existing = localStorage.getItem('wordmoment_progress');
            let final = currentProgress;
            if (existing) {
                try {
                    const parsed = JSON.parse(existing);
                    final = {
                        ...parsed,
                        [unitData.level]: {
                            ...parsed[unitData.level],
                            [unitData.unit]: {
                                currentIndex,
                                finished: phase === 'complete'
                            }
                        }
                    };
                } catch (e) {
                    // ignore
                }
            }

            localStorage.setItem('wordmoment_progress', JSON.stringify(final));
        };

        saveProgress();
    }, [currentIndex, phase, unitData.level, unitData.unit]);

    const resetProgress = useCallback(() => {
        setCurrentIndex(0);
        setPhase('typing');
        setQueue([]);
        setCurrentReinforcementIndex(0);

        // Update local storage to remove finished state
        const saved = localStorage.getItem('wordmoment_progress');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const newData = {
                    ...parsed,
                    [unitData.level]: {
                        ...parsed[unitData.level],
                        [unitData.unit]: {
                            currentIndex: 0,
                            finished: false
                        }
                    }
                };
                localStorage.setItem('wordmoment_progress', JSON.stringify(newData));
            } catch (e) {
                console.error(e);
            }
        }
    }, [unitData.level, unitData.unit]);

    return {
        currentWord,
        phase,
        inputVal,
        handleInput,
        submitInput,
        queue,
        currentReinforcementIndex,
        currentReinforcementWord: queue[currentReinforcementIndex],
        advanceReinforcement,
        totalWords: unitData.words.length,
        progress: currentIndex + 1,
        resetProgress
    };
};
