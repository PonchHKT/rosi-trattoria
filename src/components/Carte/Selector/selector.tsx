import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  UtensilsCrossed,
  ShoppingBag,
  ChevronDown,
  Download,
} from "lucide-react";
import ReactGA from "react-ga4";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./selector.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MenuOption {
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  hasDiscount?: boolean;
}

interface SelectorProps {
  onMenuSelect?: (menuType: string) => void;
  className?: string;
  showPdf?: boolean;
  onPdfToggle?: (show: boolean) => void;
  selectedMenu?: string;
  pageName?: string;
}

const GA4_EVENTS = {
  DROPDOWN_OPEN: "carte_dropdown_open",
  MENU_SELECT: "carte_menu_select",
  PDF_DISPLAY: "carte_pdf_display",
  PDF_DOWNLOAD: "carte_pdf_download",
  PDF_ERROR: "carte_pdf_error",
};

const Selector: React.FC<SelectorProps> = ({
  onMenuSelect,
  className,
  showPdf = true,
  onPdfToggle,
  selectedMenu: parentSelectedMenu,
  pageName = "Unknown Page",
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState(800);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [internalShowPdf, setInternalShowPdf] = useState(showPdf);
  const [loadingOffset, setLoadingOffset] = useState(false);
  const lastDropdownTime = useRef<number>(0);
  const dropdownDebounceMs = 1000; // 1 second debounce
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMobile = () => window.innerWidth < 768;

  const getLoadingDelay = () => {
    return isMobile() ? 7000 : 9000;
  };

  const handleMenuLoad = (menuType: string) => {
    const startTime = Date.now();

    ReactGA.event(GA4_EVENTS.MENU_SELECT, {
      page_name: pageName,
      menu_type: menuType === "sur_place" ? "dine_in" : "takeaway",
    });

    setNumPages(null);
    setPdfLoaded(false);
    setInternalShowPdf(true);
    setIsLoading(true);
    setLoadingOffset(true);

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    if (onMenuSelect) {
      onMenuSelect(menuType);
    }

    if (onPdfToggle) {
      onPdfToggle(true);
    }

    if (menuType === "a_emporter") {
      setIsLoading(false);
      setLoadingOffset(false);
    } else {
      const loadingDelay = getLoadingDelay();
      loadingTimeoutRef.current = setTimeout(() => {
        const loadTime = Date.now() - startTime;
        setIsLoading(false);
        setLoadingOffset(false);
      }, loadingDelay);
    }
  };

  const handleMenuSelect = (menuType: string) => {
    setSelectedMenu(menuType);
    setDropdownOpen(false);
    handleMenuLoad(menuType);
  };

  const handleDropdownToggle = () => {
    const now = Date.now();
    if (now - lastDropdownTime.current < dropdownDebounceMs) {
      return;
    }
    lastDropdownTime.current = now;

    if (!dropdownOpen) {
      ReactGA.event(GA4_EVENTS.DROPDOWN_OPEN, {
        page_name: pageName,
      });
    }
    setDropdownOpen(!dropdownOpen);
  };

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

  useEffect(() => {
    if (
      parentSelectedMenu !== undefined &&
      parentSelectedMenu !== selectedMenu
    ) {
      setSelectedMenu(parentSelectedMenu);
      if (parentSelectedMenu) {
        handleMenuLoad(parentSelectedMenu);
      } else {
        setNumPages(null);
        setPdfLoaded(false);
        setInternalShowPdf(false);
        setIsLoading(false);
        setLoadingOffset(false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      }
    }
  }, [parentSelectedMenu]);

  useEffect(() => {
    setInternalShowPdf(showPdf);
    if (!showPdf) {
      setNumPages(null);
      setPdfLoaded(false);
      setIsLoading(false);
      setLoadingOffset(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  }, [showPdf]);

  useEffect(() => {
    if (pdfLoaded && !isLoading && internalShowPdf && selectedMenu) {
      ReactGA.event(GA4_EVENTS.PDF_DISPLAY, {
        page_name: pageName,
        menu_type: selectedMenu === "sur_place" ? "dine_in" : "takeaway",
        num_pages: numPages || 0,
      });
    }
  }, [pdfLoaded, isLoading, internalShowPdf, selectedMenu, numPages, pageName]);

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
    ReactGA.event(GA4_EVENTS.PDF_DOWNLOAD, {
      page_name: pageName,
      menu_type: selectedMenu === "sur_place" ? "dine_in" : "takeaway",
    });

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

  const getMenuOptions = (): MenuOption[] => [
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
  };

  const handleDocumentError = (error: Error) => {
    ReactGA.event(GA4_EVENTS.PDF_ERROR, {
      page_name: pageName,
      menu_type: selectedMenu === "sur_place" ? "dine_in" : "takeaway",
      error_message: error.message,
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
            />
          </div>
        ))}
      </div>
    );
  };

  const selectedMenuInfo = getSelectedMenuInfo();

  return (
    <div className={`selector-container ${className || ""}`} ref={containerRef}>
      <div className="selector-header">
        <UtensilsCrossed className="header-icon" size={24} />
        <h2>Notre Carte</h2>
      </div>

      <div className="selector-content">
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

        {selectedMenu && !isLoading && internalShowPdf && (
          <div className="download-section">
            <span className="download-link" onClick={handleDownloadPdf}>
              <Download className="download-icon" size={18} />
              <span>Télécharger en PDF</span>
            </span>
          </div>
        )}

        <div className="dropdown-container" ref={dropdownRef}>
          <div
            className={`dropdown-trigger ${selectedMenu ? "selected" : ""}`}
            onClick={handleDropdownToggle}
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
                  <div className="service-info">
                    <span className="service-label">Choisissez une carte</span>
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

      {selectedMenu && internalShowPdf && (
        <div className={`pdf-section ${loadingOffset ? "loading-offset" : ""}`}>
          <Document
            key={`${selectedMenu}-${Date.now()}`}
            file={getPdfFile()}
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={handleDocumentError}
            loading={null}
          >
            {renderPages()}
          </Document>
        </div>
      )}

      {numPages && pdfLoaded && !isMobile() && internalShowPdf && (
        <div className="page-indicator">
          {numPages} page{numPages > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default Selector;
