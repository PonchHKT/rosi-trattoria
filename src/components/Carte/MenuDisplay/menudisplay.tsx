import React, { useRef, useEffect, useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import ReactGA from "react-ga4";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./menudisplay.scss";
import Selector from "../Selector/selector";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CarteDisplayProps {
  onMenuSelect?: (menuType: string) => void;
  showHours?: boolean;
  onToggleHours?: (show: boolean) => void;
  pageName?: string;
}

const GA4_EVENTS = {
  HOURS_TOGGLE: "carte_hours_toggle",
  MENU_SELECT: "carte_menu_select",
  FESTIVAL_PDF_DISPLAY: "festival_pdf_display",
  FESTIVAL_PDF_ERROR: "festival_pdf_error",
  WINE_CARD_MODE: "wine_card_mode_detected",
};

const CarteDisplay: React.FC<CarteDisplayProps> = ({
  onMenuSelect,
  showHours = true,
  onToggleHours,
  pageName = "Unknown Page",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastToggleTime = useRef<number>(0);
  const toggleDebounceMs = 1000;
  const [currentStatus, setCurrentStatus] = useState<{
    isOpen: boolean;
    nextChange: string;
  }>({ isOpen: false, nextChange: "" });
  const [menuSelected, setMenuSelected] = useState<string>("");
  const [internalShowHours, setInternalShowHours] = useState(showHours);
  const [wineCardMode, setWineCardMode] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(-1);

  const [festivalNumPages, setFestivalNumPages] = useState<number | null>(null);
  const [festivalPageWidth, setFestivalPageWidth] = useState(800);

  const isMobile = () => window.innerWidth < 768;

  const getCurrentDayIndex = () => {
    const now = new Date();
    const frenchTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Paris" })
    );
    return frenchTime.getDay();
  };

  const isJanuaryClosure = () => {
    const now = new Date();
    const frenchTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Paris" })
    );
    const year = frenchTime.getFullYear();
    const month = frenchTime.getMonth();
    const date = frenchTime.getDate();
    const hours = frenchTime.getHours();

    // Janvier 2026 = month 0, année 2026
    if (year === 2026 && month === 0) {
      // Du 4 au 26 janvier inclus
      if (date >= 4 && date <= 26) {
        return true;
      }
      // Le 27 janvier avant 18h
      if (date === 27 && hours < 18) {
        return true;
      }
    }

    return false;
  };

  const isFestivalPeriod = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();

    if (currentMonth === 7) {
      return currentDate >= 23 && currentDate <= 24;
    }

    if (currentMonth === 10) {
      return currentDate >= 7 && currentDate <= 9;
    }

    return false;
  };

  const isAugustMonth = () => {
    const currentMonth = new Date().getMonth();
    return currentMonth === 7;
  };

  const checkOpenStatus = () => {
    // Vérifier d'abord la fermeture de janvier
    if (isJanuaryClosure()) {
      const now = new Date();
      const frenchTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/Paris" })
      );
      const date = frenchTime.getDate();
      const hours = frenchTime.getHours();

      // Si on est le 27 janvier avant 18h
      if (date === 27 && hours < 18) {
        return {
          isOpen: false,
          nextChange: "Réouverture le 27 janvier à 18h00",
        };
      }

      // Sinon, du 4 au 26 janvier
      return { isOpen: false, nextChange: "Réouverture le 27 janvier à 18h00" };
    }

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

    if (menuType) {
      setInternalShowHours(false);
    }

    ReactGA.event(GA4_EVENTS.MENU_SELECT, {
      page_name: pageName,
      menu_type: menuType === "sur_place" ? "dine_in" : "takeaway",
    });

    if (onToggleHours) {
      onToggleHours(menuType === "");
    }
    if (onMenuSelect) {
      onMenuSelect(menuType);
    }
  };

  const handleBackToHours = () => {
    setMenuSelected("");
    setInternalShowHours(true);

    ReactGA.event(GA4_EVENTS.HOURS_TOGGLE, {
      page_name: pageName,
      hours_state: "visible",
      is_august: isAugustMonth(),
      source: "selector_back_button",
    });

    if (onToggleHours) {
      onToggleHours(true);
    }
    if (onMenuSelect) {
      onMenuSelect("");
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
        source: "toggle_button",
      });
    }

    if (onToggleHours) {
      onToggleHours(newShowHours);
    }
  };

  const handleFestivalDocumentLoadSuccess = ({
    numPages,
  }: {
    numPages: number;
  }) => {
    setFestivalNumPages(numPages);

    ReactGA.event(GA4_EVENTS.FESTIVAL_PDF_DISPLAY, {
      page_name: pageName,
      num_pages: numPages,
    });
  };

  const handleFestivalDocumentError = (error: Error) => {
    ReactGA.event(GA4_EVENTS.FESTIVAL_PDF_ERROR, {
      page_name: pageName,
      error_message: error.message,
    });
    console.error("Festival PDF loading error:", error);
  };

  const renderFestivalPages = () => {
    const mobile = isMobile();
    const pagesToRender = festivalNumPages || 10;

    return (
      <div className="pdf-page-grid">
        {Array.from({ length: pagesToRender }, (_, i) => (
          <div key={i + 1} className="pdf-page-container" data-page={i + 1}>
            <Page
              pageNumber={i + 1}
              width={festivalPageWidth}
              renderTextLayer={!mobile}
              renderAnnotationLayer={false}
              renderMode="canvas"
              className="pdf-page"
              loading=""
            />
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const updateStatus = () => {
      setCurrentStatus(checkOpenStatus());
      setCurrentDayIndex(getCurrentDayIndex());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setInternalShowHours(showHours);
  }, [showHours]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setFestivalPageWidth(containerRef.current.offsetWidth - 40);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const getHoursItems = () => {
    const isAugust = isAugustMonth();
    const januaryClosure = isJanuaryClosure();

    // Si on est pendant la fermeture de janvier, tous les jours sont fermés
    if (januaryClosure) {
      return [
        {
          day: "Lun",
          fullDay: "Lundi",
          lunch: "",
          dinner: "",
          closed: true,
          dayIndex: 1,
        },
        {
          day: "Mar",
          fullDay: "Mardi",
          lunch: "",
          dinner: "",
          closed: true,
          dayIndex: 2,
        },
        {
          day: "Mer",
          fullDay: "Mercredi",
          lunch: "",
          dinner: "",
          closed: true,
          dayIndex: 3,
        },
        {
          day: "Jeu",
          fullDay: "Jeudi",
          lunch: "",
          dinner: "",
          closed: true,
          dayIndex: 4,
        },
        {
          day: "Ven",
          fullDay: "Vendredi",
          lunch: "",
          dinner: "",
          closed: true,
          dayIndex: 5,
        },
        {
          day: "Sam",
          fullDay: "Samedi",
          lunch: "",
          dinner: "",
          closed: true,
          dayIndex: 6,
        },
        {
          day: "Dim",
          fullDay: "Dimanche",
          lunch: "",
          dinner: "",
          closed: true,
          dayIndex: 0,
        },
      ];
    }

    return isAugust
      ? [
          {
            day: "Lun",
            fullDay: "Lundi",
            lunch: "12h00 - 13h30",
            dinner: "18h30 - 21h30",
            closed: false,
            dayIndex: 1,
          },
          {
            day: "Mar",
            fullDay: "Mardi",
            lunch: "12h00 - 13h30",
            dinner: "18h30 - 21h30",
            closed: false,
            dayIndex: 2,
          },
          {
            day: "Mer",
            fullDay: "Mercredi",
            lunch: "12h00 - 13h30",
            dinner: "18h30 - 21h30",
            closed: false,
            dayIndex: 3,
          },
          {
            day: "Jeu",
            fullDay: "Jeudi",
            lunch: "12h00 - 13h30",
            dinner: "18h30 - 21h30",
            closed: false,
            dayIndex: 4,
          },
          {
            day: "Ven",
            fullDay: "Vendredi",
            lunch: "12h00 - 13h30",
            dinner: "18h30 - 22h00",
            closed: false,
            dayIndex: 5,
          },
          {
            day: "Sam",
            fullDay: "Samedi",
            lunch: "12h00 - 13h30",
            dinner: "18h30 - 22h00",
            closed: false,
            dayIndex: 6,
          },
          {
            day: "Dim",
            fullDay: "Dimanche",
            lunch: "",
            dinner: "",
            closed: true,
            dayIndex: 0,
          },
        ]
      : [
          {
            day: "Lun",
            fullDay: "Lundi",
            lunch: "",
            dinner: "",
            closed: true,
            dayIndex: 1,
          },
          {
            day: "Mar",
            fullDay: "Mardi",
            lunch: "12h00 - 14h00",
            dinner: "18h30 - 21h30",
            closed: false,
            dayIndex: 2,
          },
          {
            day: "Mer",
            fullDay: "Mercredi",
            lunch: "12h00 - 14h00",
            dinner: "18h30 - 21h30",
            closed: false,
            dayIndex: 3,
          },
          {
            day: "Jeu",
            fullDay: "Jeudi",
            lunch: "12h00 - 14h00",
            dinner: "18h30 - 21h30",
            closed: false,
            dayIndex: 4,
          },
          {
            day: "Ven",
            fullDay: "Vendredi",
            lunch: "12h00 - 14h00",
            dinner: "18h30 - 22h00",
            closed: false,
            dayIndex: 5,
          },
          {
            day: "Sam",
            fullDay: "Samedi",
            lunch: "12h00 - 14h00",
            dinner: "18h30 - 22h00",
            closed: false,
            dayIndex: 6,
          },
          {
            day: "Dim",
            fullDay: "Dimanche",
            lunch: "",
            dinner: "",
            closed: true,
            dayIndex: 0,
          },
        ];
  };

  const showFestivalMenu = isFestivalPeriod();
  const januaryClosure = isJanuaryClosure();

  return (
    <div className="menu-container" ref={containerRef}>
      <Selector
        onMenuSelect={handleMenuSelect}
        showPdf={!!menuSelected}
        selectedMenu={menuSelected}
        pageName={pageName}
        onBackToHours={handleBackToHours}
        wineCardMode={wineCardMode}
      />

      {internalShowHours && showFestivalMenu && (
        <div className="festival-pdf-section">
          <Document
            file="/menufestival.pdf"
            onLoadSuccess={handleFestivalDocumentLoadSuccess}
            onLoadError={handleFestivalDocumentError}
            loading=""
          >
            {renderFestivalPages()}
          </Document>
        </div>
      )}

      <div
        className={`hours-section ${internalShowHours ? "visible" : "hidden"}`}
      >
        <div className="hours-hero">
          <h2 className="hours-title">Horaires</h2>
        </div>

        <div className="hours-grid">
          {getHoursItems().map((item, index) => (
            <div
              key={index}
              className={`day-card ${item.closed ? "closed" : ""} ${
                item.dayIndex === currentDayIndex ? "current-day" : ""
              }`}
            >
              <div className="day-header">
                <span className="day-name">{item.day}</span>
                <span className="day-full">{item.fullDay}</span>
              </div>
              {item.closed ? (
                <div className="day-closed">Fermé</div>
              ) : (
                <div className="day-times">
                  <div className="time-slot">
                    <span className="time-icon">☀️</span>
                    <span className="time-range">{item.lunch}</span>
                  </div>
                  <div className="time-divider"></div>
                  <div className="time-slot">
                    <span className="time-icon">🌙</span>
                    <span className="time-range">{item.dinner}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hours-footnote">
          <div className="hours-footnote-icon">ⓘ</div>
          <div className="hours-footnote-content">
            <p className="hours-footnote-title">Information</p>
            <p className="hours-footnote-text">
              Les horaires peuvent être modifiés en cas de jours fériés ou
              événements spéciaux.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarteDisplay;
