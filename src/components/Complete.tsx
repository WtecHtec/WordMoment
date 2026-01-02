import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CompleteProps {
    onRestart: () => void;
    onHome: () => void;
}

export const Complete: React.FC<CompleteProps> = ({ onRestart, onHome }) => {
    useEffect(() => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#38bdf8', '#f472b6', '#4ade80']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#38bdf8', '#f472b6', '#4ade80']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    return (
        <div className="complete-container">
            <h1 className="complete-title">
                Unit Complete!
            </h1>

            <p className="complete-subtitle">You've mastered this set.</p>

            <div className="action-buttons">
                <button
                    onClick={onRestart}
                    className="btn-primary"
                >
                    Restart Unit
                </button>
                <button
                    onClick={onHome}
                    className="btn-secondary"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};
