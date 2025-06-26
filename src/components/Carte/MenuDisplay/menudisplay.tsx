import React, { useRef, useEffect, useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import ReactGA from "react-ga4";
import "./menudisplay.scss";
import Selector from "../Selector/selector";

interface MenuDisplayProps {
  onMenuSelect?: (menuType: string) => void;
  showHours?: boolean;
  onToggleHours?: (show: boolean) => void;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({
  onMenuSelect,
  showHours = true,
  onToggleHours,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);
  const [currentStatus, setCurrentStatus] = useState<{
    isOpen: boolean;
    nextChange: string;
  }>({ isOpen: false, nextChange: "" });
  const [menuSelected, setMenuSelected] = useState<string>("");
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
    const frenchTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Paris" })
    );
    const currentDay = frenchTime.getDay();
    const currentHour = frenchTime.getHours();
    const currentMinute = frenchTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const isAugust = isAugustMonth();

    let schedule: {
      [key: number]: {
        lunch: [number, number];
        dinner: [number, number];
      } | null;
    } = {};

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
    } else {
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
      const closingTime = `${Math.floor(lunch[1] / 60)}h${
        lunch[1] % 60 === 0 ? "00" : lunch[1] % 60
      }`;
      return { isOpen: true, nextChange: `Ferme à ${closingTime}` };
    }

    if (currentTimeInMinutes >= dinner[0] && currentTimeInMinutes < dinner[1]) {
      const closingTime = `${Math.floor(dinner[1] / 60)}h${
        dinner[1] % 60 === 0 ? "00" : dinner[1] % 60
      }`;
      return { isOpen: true, nextChange: `Ferme à ${closingTime}` };
    }

    if (currentTimeInMinutes < lunch[0]) {
      const openingTime = `${Math.floor(lunch[0] / 60)}h${
        lunch[0] % 60 === 0 ? "00" : lunch[0] % 60
      }`;
      return { isOpen: false, nextChange: `Ouvre à ${openingTime}` };
    } else if (
      currentTimeInMinutes >= lunch[1] &&
      currentTimeInMinutes < dinner[0]
    ) {
      const openingTime = `${Math.floor(dinner[0] / 60)}h${
        dinner[0] % 60 === 0 ? "00" : dinner[0] % 60
      }`;
      return { isOpen: false, nextChange: `Ouvre à ${openingTime}` };
    } else {
      return { isOpen: false, nextChange: "Fermé aujourd'hui" };
    }
  };

  const handleMenuSelect = (menuType: string) => {
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ReactGA.event({
            category: "Component Visibility",
            action: "Scroll Into View",
            label: "Menu Display Section",
          });
        }
      },
      { threshold: 0.3 }
    );

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
    } else {
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

  return (
    <div className="menu-container" ref={containerRef}>
      <Selector
        onMenuSelect={handleMenuSelect}
        showPdf={!internalShowHours}
        selectedMenu={menuSelected} // Pass the selected menu to Selector
      />

      {menuSelected && (
        <div className="hours-toggle-button" onClick={handleToggleHours}>
          <Calendar size={18} />
          <span>Voir les horaires</span>
        </div>
      )}

      <div
        className={`hours-section ${internalShowHours ? "visible" : "hidden"}`}
      >
        <div className="hours-header">
          <div className="header-left">
            <Calendar className="calendar-icon" size={20} />
            <Clock className="clock-icon" size={20} />
            <h2>Nos Horaires</h2>
            {isAugustMonth() && (
              <span className="august-notice">🌞 Horaires d'été</span>
            )}
          </div>

          <div className="header-right">
            {menuSelected && (
              <button
                className="close-hours-button"
                onClick={handleToggleHours}
                aria-label="Fermer les horaires"
              >
                <X size={20} />
              </button>
            )}

            <div
              className={`status-indicator ${
                currentStatus.isOpen ? "open" : "closed"
              }`}
            >
              <div className="status-dot"></div>
              <div className="status-text">
                {currentStatus.isOpen
                  ? "Actuellement Ouvert"
                  : "Actuellement Fermé"}
              </div>
            </div>
          </div>
        </div>

        <div className="hours-list">
          {getHoursItems().map((item, index) => (
            <div
              key={index}
              className={`hours-item ${item.closed ? "closed" : ""}`}
            >
              <span>{item.day}</span>
              <span>{item.hours}</span>
            </div>
          ))}
        </div>

        <div className="hours-notice">
          ⚠️ Attention : ces horaires peuvent varier selon les jours fériés et
          événements spéciaux
        </div>
      </div>
    </div>
  );
};

export default MenuDisplay;
