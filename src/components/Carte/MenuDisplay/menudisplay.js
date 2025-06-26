import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import ReactGA from "react-ga4";
import "./menudisplay.scss";
import Selector from "../Selector/selector";
const MenuDisplay = ({ onMenuSelect, showHours = true, onToggleHours, }) => {
    const containerRef = useRef(null);
    const hasTrackedView = useRef(false);
    const [currentStatus, setCurrentStatus] = useState({ isOpen: false, nextChange: "" });
    const [menuSelected, setMenuSelected] = useState("");
    const [internalShowHours, setInternalShowHours] = useState(showHours);
    const isAugustMonth = () => {
        const currentMonth = new Date().getMonth();
        return currentMonth === 7;
    };
    const getFrenchTime = () => {
        return new Date().toLocaleString("fr-FR", {
            timeZone: "Europe/Paris",
            hour12: false,
        });
    };
    const checkOpenStatus = () => {
        const now = new Date();
        const frenchTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
        const currentDay = frenchTime.getDay();
        const currentHour = frenchTime.getHours();
        const currentMinute = frenchTime.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        const isAugust = isAugustMonth();
        let schedule = {};
        if (isAugust) {
            schedule = {
                0: null,
                1: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 21 * 60 + 30] },
                2: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 21 * 60 + 30] },
                3: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 21 * 60 + 30] },
                4: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 21 * 60 + 30] },
                5: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 22 * 60 + 30] },
                6: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 22 * 60 + 30] },
            };
        }
        else {
            schedule = {
                0: null,
                1: null,
                2: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 21 * 60 + 30] },
                3: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 21 * 60 + 30] },
                4: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 21 * 60 + 30] },
                5: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 22 * 60 + 30] },
                6: { lunch: [12 * 60, 14 * 60], dinner: [19 * 60, 22 * 60 + 30] },
            };
        }
        const todaySchedule = schedule[currentDay];
        if (!todaySchedule) {
            return { isOpen: false, nextChange: "Fermé aujourd'hui" };
        }
        const { lunch, dinner } = todaySchedule;
        if (currentTimeInMinutes >= lunch[0] && currentTimeInMinutes < lunch[1]) {
            const closingTime = `${Math.floor(lunch[1] / 60)}h${lunch[1] % 60 === 0 ? "00" : lunch[1] % 60}`;
            return { isOpen: true, nextChange: `Ferme à ${closingTime}` };
        }
        if (currentTimeInMinutes >= dinner[0] && currentTimeInMinutes < dinner[1]) {
            const closingTime = `${Math.floor(dinner[1] / 60)}h${dinner[1] % 60 === 0 ? "00" : dinner[1] % 60}`;
            return { isOpen: true, nextChange: `Ferme à ${closingTime}` };
        }
        if (currentTimeInMinutes < lunch[0]) {
            const openingTime = `${Math.floor(lunch[0] / 60)}h${lunch[0] % 60 === 0 ? "00" : lunch[0] % 60}`;
            return { isOpen: false, nextChange: `Ouvre à ${openingTime}` };
        }
        else if (currentTimeInMinutes >= lunch[1] &&
            currentTimeInMinutes < dinner[0]) {
            const openingTime = `${Math.floor(dinner[0] / 60)}h${dinner[0] % 60 === 0 ? "00" : dinner[0] % 60}`;
            return { isOpen: false, nextChange: `Ouvre à ${openingTime}` };
        }
        else {
            return { isOpen: false, nextChange: "Fermé aujourd'hui" };
        }
    };
    const handleMenuSelect = (menuType) => {
        setMenuSelected(menuType);
        setInternalShowHours(false);
        if (onToggleHours) {
            onToggleHours(false);
        }
        if (onMenuSelect) {
            onMenuSelect(menuType);
        }
        ReactGA.event({
            category: "Menu Interaction",
            action: "Hide Hours on Menu Select",
            label: menuType,
        });
    };
    const handleToggleHours = () => {
        const newShowHours = !internalShowHours;
        setInternalShowHours(newShowHours);
        // Do not clear menuSelected here to allow re-displaying the PDF
        // setMenuSelected("");
        if (onToggleHours) {
            onToggleHours(newShowHours);
        }
        ReactGA.event({
            category: "Hours Toggle",
            action: newShowHours ? "Show Hours" : "Hide Hours",
            label: "Manual Toggle",
        });
    };
    useEffect(() => {
        const updateStatus = () => {
            setCurrentStatus(checkOpenStatus());
        };
        updateStatus();
        const interval = setInterval(updateStatus, 60000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        setInternalShowHours(showHours);
    }, [showHours]);
    useEffect(() => {
        if (!hasTrackedView.current) {
            ReactGA.event({
                category: "Component View",
                action: "View",
                label: "Menu Display Page",
                value: 1,
            });
            hasTrackedView.current = true;
        }
    }, []);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                ReactGA.event({
                    category: "Component Visibility",
                    action: "Scroll Into View",
                    label: "Menu Display Section",
                });
            }
        }, { threshold: 0.3 });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, []);
    const getHoursItems = () => {
        const isAugust = isAugustMonth();
        if (isAugust) {
            ReactGA.event({
                category: "Hours Display",
                action: "Display August Hours",
                label: "Summer Schedule",
            });
            return [
                { day: "Lundi", hours: "12h00 - 14h00 / 19h00 - 21h30", closed: false },
                { day: "Mardi", hours: "12h00 - 14h00 / 19h00 - 21h30", closed: false },
                {
                    day: "Mercredi",
                    hours: "12h00 - 14h00 / 19h00 - 21h30",
                    closed: false,
                },
                { day: "Jeudi", hours: "12h00 - 14h00 / 19h00 - 21h30", closed: false },
                {
                    day: "Vendredi",
                    hours: "12h00 - 14h00 / 19h00 - 22h30",
                    closed: false,
                },
                {
                    day: "Samedi",
                    hours: "12h00 - 14h00 / 19h00 - 22h30",
                    closed: false,
                },
                { day: "Dimanche", hours: "Fermé", closed: true },
            ];
        }
        else {
            return [
                { day: "Lundi", hours: "Fermé", closed: true },
                { day: "Mardi", hours: "12h00 - 14h00 / 19h00 - 21h30", closed: false },
                {
                    day: "Mercredi",
                    hours: "12h00 - 14h00 / 19h00 - 21h30",
                    closed: false,
                },
                { day: "Jeudi", hours: "12h00 - 14h00 / 19h00 - 21h30", closed: false },
                {
                    day: "Vendredi",
                    hours: "12h00 - 14h00 / 19h00 - 22h30",
                    closed: false,
                },
                {
                    day: "Samedi",
                    hours: "12h00 - 14h00 / 19h00 - 22h30",
                    closed: false,
                },
                { day: "Dimanche", hours: "Fermé", closed: true },
            ];
        }
    };
    return (_jsxs("div", { className: "menu-container", ref: containerRef, children: [_jsx(Selector, { onMenuSelect: handleMenuSelect, showPdf: !internalShowHours, selectedMenu: menuSelected }), menuSelected && (_jsxs("div", { className: "hours-toggle-button", onClick: handleToggleHours, children: [_jsx(Calendar, { size: 18 }), _jsx("span", { children: "Voir les horaires" })] })), _jsxs("div", { className: `hours-section ${internalShowHours ? "visible" : "hidden"}`, children: [_jsxs("div", { className: "hours-header", children: [_jsxs("div", { className: "header-left", children: [_jsx(Calendar, { className: "calendar-icon", size: 20 }), _jsx(Clock, { className: "clock-icon", size: 20 }), _jsx("h2", { children: "Nos Horaires" }), isAugustMonth() && (_jsx("span", { className: "august-notice", children: "\uD83C\uDF1E Horaires d'\u00E9t\u00E9" }))] }), _jsxs("div", { className: "header-right", children: [menuSelected && (_jsx("button", { className: "close-hours-button", onClick: handleToggleHours, "aria-label": "Fermer les horaires", children: _jsx(X, { size: 20 }) })), _jsxs("div", { className: `status-indicator ${currentStatus.isOpen ? "open" : "closed"}`, children: [_jsx("div", { className: "status-dot" }), _jsx("div", { className: "status-text", children: currentStatus.isOpen
                                                    ? "Actuellement Ouvert"
                                                    : "Actuellement Fermé" })] })] })] }), _jsx("div", { className: "hours-list", children: getHoursItems().map((item, index) => (_jsxs("div", { className: `hours-item ${item.closed ? "closed" : ""}`, children: [_jsx("span", { children: item.day }), _jsx("span", { children: item.hours })] }, index))) }), _jsx("div", { className: "hours-notice", children: "\u26A0\uFE0F Attention : ces horaires peuvent varier selon les jours f\u00E9ri\u00E9s et \u00E9v\u00E9nements sp\u00E9ciaux" })] })] }));
};
export default MenuDisplay;
