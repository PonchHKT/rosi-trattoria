import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./reviewpopup.scss";
const ReviewPopup = ({ isOpen, onClose }) => {
    if (!isOpen)
        return null;
    const handleTripAdvisorClick = () => {
        window.open("https://www.tripadvisor.fr/Restaurant_Review-g196612-d23792112-Reviews-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html", "_blank");
        onClose();
    };
    const handleGoogleClick = () => {
        window.open("https://www.google.com/maps/place/Rosi+Trattoria/@45.1632341,1.5304252,16z/data=!3m1!5s0x47f897d9258e5ed5:0x3732e7ea5011b941!4m8!3m7!1s0x47f897e00d125fe3:0xdd18d96369f9f106!8m2!3d45.1632303!4d1.5330001!9m1!1b1!16s%2Fg%2F11pb_g8cpr?entry=ttu&g_ep=EgoyMDI1MDYxNS4wIKXMDSoASAFQAw%3D%3D", "_blank");
        onClose();
    };
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (_jsx("div", { className: "review-popup-overlay", onClick: handleBackgroundClick, children: _jsxs("div", { className: "review-popup-container", children: [_jsxs("div", { className: "review-popup-header", children: [_jsx("h2", { children: "Laissez-nous un avis !" }), _jsx("p", { children: "Choisissez votre plateforme pr\u00E9f\u00E9r\u00E9e pour partager votre exp\u00E9rience" })] }), _jsxs("div", { className: "review-popup-options", children: [_jsx("button", { className: "review-option google", onClick: handleGoogleClick, children: _jsx("div", { className: "google-logo", children: _jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })] }) }) }), _jsx("button", { className: "review-option tripadvisor", onClick: handleTripAdvisorClick, children: _jsx("img", { src: "/images/logo/tripadvisor_white.png", alt: "TripAdvisor", className: "option-logo" }) })] }), _jsx("div", { className: "review-popup-footer", children: _jsx("p", { children: "Votre avis nous aide \u00E0 am\u00E9liorer notre service" }) })] }) }));
};
export default ReviewPopup;
