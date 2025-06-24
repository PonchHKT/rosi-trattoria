import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Clock,
  Calendar,
  UtensilsCrossed,
  ShoppingBag,
  ChevronDown,
  Download,
  Menu,
} from "lucide-react";
import ReactGA from "react-ga4";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./menudisplay.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MenuDisplay: React.FC = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState(800);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [showPdf, setShowPdf] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTrackedView = useRef(false);

  // Fonction pour détecter si on est en août
  const isAugustMonth = () => {
    const currentMonth = new Date().getMonth(); // 0 = janvier, 7 = août
    return currentMonth === 7;
  };

  const isMobile = () => window.innerWidth < 768;

  const getLoadingDelay = () => {
    return isMobile() ? 7000 : 9000;
  };

  // Track component view - seulement une fois
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

  // Track dropdown opening
  const trackDropdownOpen = () => {
    ReactGA.event({
      category: "Menu Interaction",
      action: "Dropdown Open",
      label: "Menu Selection Dropdown",
    });
  };

  // Track menu selection
  const trackMenuSelection = (menuType: string) => {
    ReactGA.event({
      category: "Menu Selection",
      action: "Select Menu Type",
      label: menuType === "sur_place" ? "Carte Sur Place" : "Carte À Emporter",
    });
  };

  // Track PDF loading start
  const trackPdfLoadingStart = (menuType: string) => {
    ReactGA.event({
      category: "PDF Loading",
      action: "Start Loading",
      label:
        menuType === "sur_place"
          ? "Carte Sur Place PDF"
          : "Carte À Emporter PDF",
    });
  };

  // Track PDF loading success
  const trackPdfLoadingSuccess = (menuType: string, loadTime: number) => {
    ReactGA.event({
      category: "PDF Loading",
      action: "Loading Success",
      label:
        menuType === "sur_place"
          ? "Carte Sur Place PDF"
          : "Carte À Emporter PDF",
      value: Math.round(loadTime / 1000), // temps en secondes
    });
  };

  // Track PDF download
  const trackPdfDownload = (menuType: string) => {
    ReactGA.event({
      category: "PDF Download",
      action: "Download PDF",
      label:
        menuType === "sur_place"
          ? "Carte Sur Place PDF"
          : "Carte À Emporter PDF",
    });
  };

  // Track page visibility (scroll into view)
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

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth - 40);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuSelect = (menuType: string) => {
    const startTime = Date.now();

    // Track menu selection
    trackMenuSelection(menuType);

    setSelectedMenu(menuType);
    setDropdownOpen(false);
    setNumPages(null);
    setCurrentPage(1);
    setPdfLoaded(false);
    setShowPdf(false);

    // Pas de chargement pour la carte à emporter
    if (menuType === "a_emporter") {
      setIsLoading(false);
      setShowPdf(true);
      // Track immediate display
      ReactGA.event({
        category: "PDF Display",
        action: "Immediate Display",
        label: "Carte À Emporter PDF",
      });
    } else {
      // Track loading start
      trackPdfLoadingStart(menuType);

      // Chargement uniquement pour la carte sur place
      setIsLoading(true);
      const loadingDelay = getLoadingDelay();
      loadingTimeoutRef.current = setTimeout(() => {
        const loadTime = Date.now() - startTime;
        trackPdfLoadingSuccess(menuType, loadTime);
        setIsLoading(false);
        setShowPdf(true);
      }, loadingDelay);
    }
  };

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const getPdfFile = () => {
    if (selectedMenu === "sur_place") return "/carterositrattoria.pdf";
    if (selectedMenu === "a_emporter") return "/carterositrattoriaemporter.pdf";
    return null;
  };

  const handleDownloadPdf = () => {
    // Track download
    trackPdfDownload(selectedMenu);

    const pdfFile = getPdfFile();
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download =
        selectedMenu === "sur_place"
          ? "Carte-Restaurant-Sur-Place.pdf"
          : "Carte-Restaurant-A-Emporter.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getMenuOptions = () => [
    {
      value: "sur_place",
      label: "Carte sur place",
      description: "Ambiance conviviale et service à table",
      icon: UtensilsCrossed,
    },
    {
      value: "a_emporter",
      label: "Carte à emporter",
      description: "À savourer où vous voulez",
      icon: ShoppingBag,
      hasDiscount: true,
    },
  ];

  const getSelectedMenuInfo = () => {
    return getMenuOptions().find((option) => option.value === selectedMenu);
  };

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfLoaded(true);

    // Track PDF render success
    ReactGA.event({
      category: "PDF Render",
      action: "Render Success",
      label:
        selectedMenu === "sur_place"
          ? "Carte Sur Place PDF"
          : "Carte À Emporter PDF",
      value: numPages,
    });
  };

  const handleDocumentError = (error: Error) => {
    // Track PDF loading errors
    ReactGA.event({
      category: "PDF Loading",
      action: "Loading Error",
      label:
        selectedMenu === "sur_place"
          ? "Carte Sur Place PDF"
          : "Carte À Emporter PDF",
    });
    console.error("PDF loading error:", error);
  };

  const renderPages = () => {
    if (!numPages) return null;
    const mobile = isMobile();

    return (
      <div className="pdf-page-grid">
        {Array.from({ length: numPages }, (_, i) => (
          <div key={i + 1} className="pdf-page-container" data-page={i + 1}>
            <Page
              pageNumber={i + 1}
              width={pageWidth}
              renderTextLayer={!mobile}
              renderAnnotationLayer={false}
              renderMode="canvas"
              className="pdf-page"
              loading={<div className="page-loading">Chargement...</div>}
              onLoadSuccess={() => {
                // Track individual page render (optionnel)
                if (i === 0) {
                  // Seulement pour la première page
                  ReactGA.event({
                    category: "PDF Page",
                    action: "First Page Rendered",
                    label:
                      selectedMenu === "sur_place"
                        ? "Carte Sur Place"
                        : "Carte À Emporter",
                  });
                }
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  // Fonction pour obtenir les horaires selon le mois
  const getHoursItems = () => {
    const isAugust = isAugustMonth();

    if (isAugust) {
      // Track August hours display
      ReactGA.event({
        category: "Hours Display",
        action: "Display August Hours",
        label: "Summer Schedule",
      });

      // Horaires d'août avec lundi ouvert
      return [
        {
          days: "Lun - Mar - Mer - Jeu",
          hours: "12h-14h / 19h-21h30",
          closed: false,
        },
        {
          days: "Ven - Sam",
          hours: "12h-14h / 19h-22h30",
          closed: false,
        },
        {
          days: "Dim",
          hours: "Fermé",
          closed: true,
        },
      ];
    } else {
      // Horaires normaux
      return [
        {
          days: "Mar - Mer - Jeu",
          hours: "12h-14h / 19h-21h30",
          closed: false,
        },
        {
          days: "Ven - Sam",
          hours: "12h-14h / 19h-22h30",
          closed: false,
        },
        {
          days: "Lun - Dim",
          hours: "Fermé",
          closed: true,
        },
      ];
    }
  };

  const selectedMenuInfo = getSelectedMenuInfo();

  return (
    <div className="menu-container" ref={containerRef}>
      <div className="hours-section">
        <div className="hours-header">
          <Calendar className="calendar-icon" size={20} />
          <Clock className="clock-icon" size={20} />
          <h2>Nos horaires</h2>
          {isAugustMonth() && (
            <span className="august-notice">🌞 Horaires d'été</span>
          )}
        </div>
        <div className="hours-list">
          {getHoursItems().map((item, index) => (
            <div
              key={index}
              className={`hours-item ${item.closed ? "closed" : ""}`}
            >
              <span>{item.days}</span>
              <span>{item.hours}</span>
            </div>
          ))}
        </div>

        {selectedMenu && isLoading && (
          <div className="document-loading">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <span className="loading-announcement">
                Chargement en cours...
                <br />
                <small>
                  Nous optimisons la qualité du fichier, merci de patienter un
                  instant
                </small>
              </span>
            </div>
          </div>
        )}

        <div className="menu-selection">
          <h3 className="service-title"></h3>

          {selectedMenu && (
            <div className="download-section">
              <span className="download-link" onClick={handleDownloadPdf}>
                <Download className="download-icon" size={18} />
                <span>Télécharger la carte</span>
              </span>
            </div>
          )}

          {/* Image des méthodes de paiement */}
          <div
            className={`payment-methods-image ${selectedMenu ? "hidden" : ""}`}
          >
            <img
              src="/images/logo/methode-paiement.png"
              alt="Méthodes de paiement acceptées"
            />
          </div>

          <div className="dropdown-container" ref={dropdownRef}>
            <div
              className={`dropdown-trigger ${selectedMenu ? "selected" : ""}`}
              onClick={() => {
                if (!dropdownOpen) {
                  trackDropdownOpen();
                }
                setDropdownOpen(!dropdownOpen);
              }}
            >
              <div className="dropdown-trigger-content">
                {selectedMenu && selectedMenuInfo ? (
                  <>
                    <selectedMenuInfo.icon className="service-icon" size={20} />
                    <div className="service-info">
                      <span className="service-label">
                        {selectedMenuInfo.label}
                      </span>
                      <span className="service-description">
                        {selectedMenuInfo.description}
                      </span>
                    </div>
                    {selectedMenuInfo.hasDiscount && (
                      <span className="discount-badge">Tarifs réduits</span>
                    )}
                  </>
                ) : (
                  <>
                    <Menu className="service-icon" size={20} />
                    <div className="service-info">
                      <span className="service-label">
                        Sélectionner une carte
                      </span>
                      <span className="service-description">
                        Choisir le type de service
                      </span>
                    </div>
                  </>
                )}
              </div>
              <ChevronDown
                className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}
                size={20}
              />
            </div>

            <div className={`dropdown-menu ${dropdownOpen ? "open" : ""}`}>
              {getMenuOptions().map((option) => (
                <div
                  key={option.value}
                  className="dropdown-option"
                  onClick={() => handleMenuSelect(option.value)}
                >
                  <option.icon className="service-icon" size={20} />
                  <div className="service-info">
                    <span className="service-label">{option.label}</span>
                    <span className="service-description">
                      {option.description}
                    </span>
                  </div>
                  {option.hasDiscount && (
                    <span className="discount-badge">Tarifs réduits</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedMenu && (
        <div className="pdf-section">
          <div
            style={{
              position: "relative",
              transform: showPdf ? "translateY(0)" : "translateY(100vh)",
              transition: "transform 0.5s ease-in-out",
            }}
          >
            <Document
              file={getPdfFile()}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentError}
              loading={null}
            >
              {renderPages()}
            </Document>
          </div>
        </div>
      )}

      {numPages && pdfLoaded && !isMobile() && (
        <div className="page-indicator">
          Page {currentPage} / {numPages}
        </div>
      )}
    </div>
  );
};

export default MenuDisplay;
