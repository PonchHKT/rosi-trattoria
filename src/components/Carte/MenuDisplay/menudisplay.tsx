import React, { useRef, useEffect, useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import ReactGA from "react-ga4";
import "./menudisplay.scss";
import Selector from "../Selector/selector";

interface CarteDisplayProps {
  onMenuSelect?: (menuType: string) => void;
  showHours?: boolean;
  onToggleHours?: (show: boolean) => void;
  pageName?: string;
}

const GA4_EVENTS = {
  HOURS_TOGGLE: "carte_hours_toggle",
  MENU_SELECT: "carte_menu_select",
};

const CarteDisplay: React.FC<CarteDisplayProps> = ({
  onMenuSelect,
  showHours = true,
  onToggleHours,
  pageName = "Unknown Page",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastToggleTime = useRef<number>(0);
  const toggleDebounceMs = 1000; // 1 second debounce
  const [currentStatus, setCurrentStatus] = useState<{
    isOpen: boolean;
    nextChange: string;
  }>({ isOpen: false, nextChange: "" });
  const [menuSelected, setMenuSelected] = useState<string>("");
  const [internalShowHours, setInternalShowHours] = useState(showHours);

  const isAugustMonth = () => {
    const forceAugustSchedule = false;
    if (forceAugustSchedule) {
      return true; // Force August schedule
    }
    const currentMonth = new Date().getMonth();
    return currentMonth === 7;
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
        0: {
          lunch: [12 * 60, 13 * 60 + 30],
          dinner: [18 * 60 + 30, 21 * 60 + 30],
        },
        1: {
          lunch: [12 * 60, 13 * 60 + 30],
          dinner: [18 * 60 + 30, 21 * 60 + 30],
        },
        2: {
          lunch: [12 * 60, 13 * 60 + 30],
          dinner: [18 * 60 + 30, 21 * 60 + 30],
        },
        3: {
          lunch: [12 * 60, 13 * 60 + 30],
          dinner: [18 * 60 + 30, 21 * 60 + 30],
        },
        4: { lunch: [12 * 60, 13 * 60 + 30], dinner: [18 * 60 + 30, 22 * 60] },
        5: { lunch: [12 * 60, 13 * 60 + 30], dinner: [18 * 60 + 30, 22 * 60] },
        6: null,
      };
    } else {
      schedule = {
        0: null,
        1: null,
        2: { lunch: [12 * 60, 14 * 60], dinner: [18 * 60 + 30, 21 * 60 + 30] },
        3: { lunch: [12 * 60, 14 * 60], dinner: [18 * 60 + 30, 21 * 60 + 30] },
        4: { lunch: [12 * 60, 14 * 60], dinner: [18 * 60 + 30, 21 * 60 + 30] },
        5: { lunch: [12 * 60, 14 * 60], dinner: [18 * 60 + 30, 22 * 60] },
        6: { lunch: [12 * 60, 14 * 60], dinner: [18 * 60 + 30, 22 * 60] },
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

    ReactGA.event(GA4_EVENTS.MENU_SELECT, {
      page_name: pageName,
      menu_type: menuType === "sur_place" ? "dine_in" : "takeaway",
    });

    if (onToggleHours) {
      onToggleHours(false);
    }
    if (onMenuSelect) {
      onMenuSelect(menuType);
    }
  };

  const handleToggleHours = () => {
    const now = Date.now();
    if (now - lastToggleTime.current < toggleDebounceMs) {
      return;
    }
    lastToggleTime.current = now;

    const newShowHours = !internalShowHours;
    setInternalShowHours(newShowHours);

    if (newShowHours) {
      ReactGA.event(GA4_EVENTS.HOURS_TOGGLE, {
        page_name: pageName,
        hours_state: "visible",
        is_august: isAugustMonth(),
      });
    }

    if (onToggleHours) {
      onToggleHours(newShowHours);
    }
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

  const getHoursItems = () => {
    const isAugust = isAugustMonth();

    return isAugust
      ? [
          {
            day: "Lundi",
            hours: "12h00 - 13h30 / 18h30 - 21h30",
            closed: false,
          },
          {
            day: "Mardi",
            hours: "12h00 - 13h30 / 18h30 - 21h30",
            closed: false,
          },
          {
            day: "Mercredi",
            hours: "12h00 - 13h30 / 18h30 - 21h30",
            closed: false,
          },
          {
            day: "Jeudi",
            hours: "12h00 - 13h30 / 18h30 - 21h30",
            closed: false,
          },
          {
            day: "Vendredi",
            hours: "12h00 - 13h30 / 18h30 - 22h00",
            closed: false,
          },
          {
            day: "Samedi",
            hours: "12h00 - 13h30 / 18h30 - 22h00",
            closed: false,
          },
          { day: "Dimanche", hours: "Fermé", closed: true },
        ]
      : [
          { day: "Lundi", hours: "Fermé", closed: true },
          {
            day: "Mardi",
            hours: "12h00 - 14h00 / 18h30 - 21h30",
            closed: false,
          },
          {
            day: "Mercredi",
            hours: "12h00 - 14h00 / 18h30 - 21h30",
            closed: false,
          },
          {
            day: "Jeudi",
            hours: "12h00 - 14h00 / 18h30 - 21h30",
            closed: false,
          },
          {
            day: "Vendredi",
            hours: "12h00 - 14h00 / 18h30 - 22h00",
            closed: false,
          },
          {
            day: "Samedi",
            hours: "12h00 - 14h00 / 18h30 - 22h00",
            closed: false,
          },
          { day: "Dimanche", hours: "Fermé", closed: true },
        ];
  };

  return (
    <div className="menu-container" ref={containerRef}>
      <Selector
        onMenuSelect={handleMenuSelect}
        showPdf={!internalShowHours}
        selectedMenu={menuSelected}
        pageName={pageName}
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

export default CarteDisplay;
