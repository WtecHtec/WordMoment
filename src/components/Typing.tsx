import React, { useEffect, useRef } from 'react';
import useSound from 'use-sound';
import type { Word } from '../data/types';

interface TypingProps {
    word: Word;
    inputVal: string;
    onInput: (val: string) => void;
    onSubmit: () => boolean;
}

export const Typing: React.FC<TypingProps> = ({ word, inputVal, onInput, onSubmit }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${word.en}&type=2`;

    // useSound hook might fail if the URL is cross-origin without CORS, but YouDao usually works.
    // Alternatively, we can use standard Audio.
    // Let's try useSound first.
    const [play] = useSound(audioUrl, {
        format: ['mp3'],
        html5: true // Force HTML5 Audio to avoid loading full buffer for streams/external URLs
    });

    useEffect(() => {
        inputRef.current?.focus();
    }, [word]);

    const [isError, setIsError] = React.useState(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (e.nativeEvent.isComposing) return;

            const success = onSubmit();
            if (!success) {
                setIsError(true);
                setTimeout(() => setIsError(false), 500);
            }
        } else if (e.key === ' ') {
            e.preventDefault();
            play();
        }
    };

    return (
        <div className="typing-container">
            {/* English Word Display */}
            <div className="typing-word-display">
                {word.block ? (
                    word.block.map((part, index) => {
                        const blockColors = ['#38bdf8', '#f472b6', '#4ade80', '#fbbf24'];
                        const color = blockColors[index % blockColors.length];
                        return (
                            <span key={index} style={{ color }}>
                                {part}
                            </span>
                        );
                    })
                ) : (
                    word.en
                )}
            </div>

            {/* Phonetic & Meaning */}
            <div className="flex flex-col items-center space-y-2 mb-8 animate-fade-in">
                {word.phonetic && (
                    <span className="text-xl text-gray-400 font-mono tracking-wide">
                        {word.phonetic}
                    </span>
                )}
                <span className="text-2xl text-gray-200 font-light">
                    {word.zh}
                </span>
            </div>

            {/* Input Field */}
            <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => onInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`typing-input ${isError ? 'shake-screen border-red-500 text-red-500' : ''}`}
                placeholder="Type here..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
            />

            <div className="instruction-text">Click speaker to listen, then type the word</div>

            {/* Audio Button */}
            <button
                onClick={() => play()}
                className="audio-btn"
                aria-label="Play pronunciation"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="audio-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            </button>
        </div>
    );
};
