import { jsx as _jsx } from "react/jsx-runtime";
import useScrollAnimation from "../../../hooks/useScrollAnimation";
const AnimatedSection = ({ children, animationType = "scroll-animate", delay = 0, threshold = 0.1, className = "", staggerDelay = 0, rootMargin = "0px 0px -50px 0px", }) => {
    const [ref, isVisible] = useScrollAnimation({
        threshold,
        delay,
        rootMargin,
    });
    const staggerClass = staggerDelay > 0 ? `stagger-delay-${staggerDelay}` : "";
    const animationClass = `${animationType} ${staggerClass} ${isVisible ? "visible" : ""}`;
    return (_jsx("div", { ref: ref, className: `${animationClass} ${className}`.trim(), children: children }));
};
export default AnimatedSection;
