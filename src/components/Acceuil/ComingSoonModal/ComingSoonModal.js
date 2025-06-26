import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import "./ComingSoonModal.scss";
const ComingSoonModal = ({ isOpen, onClose, }) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "modal-overlay", onClick: onClose, children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsx("h2", { children: "Bient\u00F4t disponible" }), _jsx("p", { children: "Le distributeur de pizza sera bient\u00F4t disponible. Restez \u00E0 l'\u00E9coute !" }), _jsx("button", { className: "modal-confirm-button", onClick: onClose, children: "OK" })] }) }));
};
export default ComingSoonModal;
