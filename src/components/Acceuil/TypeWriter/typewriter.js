import { jsx as _jsx } from "react/jsx-runtime";
// components/Typewriter/Typewriter.tsx
import { useState, useEffect } from "react";
export const Typewriter = ({ text, speed = 100, delay = 0, className = "", onComplete, }) => {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    useEffect(() => {
        const startTimer = setTimeout(() => {
            setIsStarted(true);
        }, delay);
        return () => clearTimeout(startTimer);
    }, [delay]);
    useEffect(() => {
        if (!isStarted)
            return;
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayText(text.slice(0, currentIndex + 1));
                setCurrentIndex(currentIndex + 1);
            }, speed);
            return () => clearTimeout(timer);
        }
        else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, isStarted, onComplete]);
    return _jsx("span", { className: className, children: displayText });
};
