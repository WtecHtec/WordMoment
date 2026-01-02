import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import type { Word } from '../data/types';

interface ReinforcementProps {
    word: Word;
    onComplete: () => void;
}

export const Reinforcement: React.FC<ReinforcementProps> = ({ word, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTypingDone, setIsTypingDone] = useState(false);

    const [waitingForSpace, setWaitingForSpace] = useState(false);

    // Animation States
    const [showMeaning, setShowMeaning] = useState(false);
    const [meaningPos, setMeaningPos] = useState({ top: '50%', left: '50%' });
    const [meaningColor, setMeaningColor] = useState('#f8fafc'); // Default text color

    const colors = [
        '#38bdf8', // Sky
        '#f472b6', // Pink
        '#4ade80', // Green
        '#fbbf24', // Amber
        '#a78bfa', // Violet
        '#f87171', // Red
    ];

    const [play] = useSound(`https://dict.youdao.com/dictvoice?audio=${word.en}&type=2`, {
        format: ['mp3'],
        html5: true
    });

    useEffect(() => {
        // Reset state
        setDisplayedText('');
        setIsTypingDone(false);
        setWaitingForSpace(false);
        setShowMeaning(false);
        setMeaningPos({ top: '60%', left: '50%' }); // Initial position below word
        setMeaningColor('#f8fafc');

        let charIndex = 0;
        const typeSpeed = 100;

        // 1. Typewriter Sequence
        const typeInterval = setInterval(() => {
            if (charIndex < word.en.length) {
                charIndex++;
                setDisplayedText(word.en.slice(0, charIndex));
            } else {
                clearInterval(typeInterval);
                setIsTypingDone(true);

                // Play audio immediately after typing
                play();

                // Wait for space instead of auto-starting
                setWaitingForSpace(true);
            }
        }, typeSpeed);

        return () => clearInterval(typeInterval);
    }, [word, play]);

    // Handle Spacebar press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (waitingForSpace && e.code === 'Space') {
                e.preventDefault();
                setWaitingForSpace(false);
                startSmashSequence();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [waitingForSpace]);

    const startSmashSequence = () => {
        // 1. Show Meaning immediately
        // Always center the meaning horizontally, but move it down to avoid overlap
        setMeaningPos({ top: '65%', left: '50%' });

        // Random Color
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setMeaningColor(randomColor);

        setShowMeaning(true);

        // 2. Wait for animation (e.g., 3 seconds for a few breaths) then complete
        setTimeout(onComplete, 3000);
    };

    return (
        <div className="reinforcement-container relative">
            {/* English Word */}
            <div
                className={`word-display ${isTypingDone ? 'done' : 'typing'}`}
            >
                {displayedText}
                {!isTypingDone && <span className="typing-cursor">|</span>}
            </div>

            {/* Space Prompt */}
            {waitingForSpace && (
                <div className="absolute bottom-20 text-slate-400 text-sm animate-pulse">
                    Press <span className="font-bold text-sky-400 border border-sky-400/30 px-2 py-1 rounded mx-1">Space</span> to continue
                </div>
            )}

            {/* Chinese Meaning */}
            {showMeaning && (
                <div
                    style={{
                        position: 'absolute',
                        top: meaningPos.top,
                        left: meaningPos.left,
                        transform: 'translate(-50%, -50%)', // Center on the coordinate
                        width: '100%',
                        pointerEvents: 'none',
                        zIndex: 10
                    }}
                >
                    <div
                        className="meaning-display smash"
                        style={{
                            position: 'static',
                            color: meaningColor
                        }}
                    >
                        {word.zh}
                    </div>
                </div>
            )}
        </div>
    );
};
