import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Clock,
  Calendar,
  UtensilsCrossed,
  ShoppingBag,
  ChevronDown,
  Download,
} from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./menudisplay.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MenuDisplay: React.FC = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState(800);
  const [loadedPages, setLoadedPages] = useState(new Set<number>());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle responsive page width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 40;
        setPageWidth(containerWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Close dropdown when clicking outside
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

  // Intersection Observer for lazy loading and page tracking
  useEffect(() => {
    const rootMargin = window.innerWidth < 768 ? "50px" : "500px";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageNumber = Number(entry.target.getAttribute("data-page"));
          if (entry.isIntersecting) {
            setLoadedPages((prev) => new Set(prev).add(pageNumber));
            if (entry.intersectionRatio > 0.1) {
              setCurrentPage(pageNumber);
            }
          } else {
            setLoadedPages((prev) => {
              const newSet = new Set(prev);
              newSet.delete(pageNumber);
              return newSet;
            });
          }
        });
      },
      { rootMargin, threshold: 0.1 }
    );

    Object.values(pageRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [numPages]);

  // Handle menu selection
  const handleMenuSelect = (menuType: string) => {
    setSelectedMenu(menuType);
    setDropdownOpen(false);
    setNumPages(null);
    setLoadedPages(new Set());
    setCurrentPage(1);
  };

  // Determine PDF file based on selection
  const getPdfFile = () => {
    if (selectedMenu === "sur_place") return "/carterositrattoria.pdf";
    if (selectedMenu === "a_emporter") return "/carterositrattoriaemporter.pdf";
    return null;
  };

  // Handle PDF download
  const handleDownloadPdf = () => {
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

  // Get menu options
  const getMenuOptions = () => [
    {
      value: "sur_place",
      label: "Carte sur place",
      description: "Service à table",
      icon: UtensilsCrossed,
    },
    {
      value: "a_emporter",
      label: "À emporter",
      description: "",
      icon: ShoppingBag,
      hasDiscount: true,
    },
  ];

  // Get selected menu info
  const getSelectedMenuInfo = () => {
    const options = getMenuOptions();
    return options.find((option) => option.value === selectedMenu);
  };

  // Render PDF pages
  const renderPages = () => {
    if (!numPages) return null;
    return Array.from({ length: numPages }, (_, i) => {
      const pageNumber = i + 1;
      return (
        <div
          key={pageNumber}
          className="pdf-page-container"
          data-page={pageNumber}
          ref={(el) => {
            pageRefs.current[pageNumber] = el;
          }}
        >
          {loadedPages.has(pageNumber) ? (
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={true}
              renderAnnotationLayer={false}
              renderMode="canvas"
              className="pdf-page"
              loading={<div className="page-loading">Chargement...</div>}
            />
          ) : (
            <div className="page-placeholder" />
          )}
        </div>
      );
    });
  };

  const selectedMenuInfo = getSelectedMenuInfo();

  return (
    <div className="menu-container" ref={containerRef}>
      <div className="hours-section">
        <div className="hours-header">
          <Calendar className="calendar-icon" size={20} />
          <Clock className="clock-icon" size={20} />
          <h2>Nos horaires</h2>
        </div>
        <div className="hours-list">
          <div className="hours-item">
            <span>Mar - Jeu</span>
            <span>12h-14h / 19h-21h30</span>
          </div>
          <div className="hours-item">
            <span>Ven - Sam</span>
            <span>12h-14h / 19h-22h30</span>
          </div>
          <div className="hours-item closed">
            <span>Lun - Dim</span>
            <span>Fermé</span>
          </div>
        </div>

        <div className="menu-selection">
          <h3 className="service-title"></h3>

          {/* Bouton de téléchargement PDF */}
          {selectedMenu && (
            <div className="download-section">
              <span className="download-link" onClick={handleDownloadPdf}>
                <Download className="download-icon" size={18} />
                <span>Télécharger le PDF</span>
              </span>
            </div>
          )}

          <div className="dropdown-container" ref={dropdownRef}>
            <div
              className={`dropdown-trigger ${selectedMenu ? "selected" : ""}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
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
                    <UtensilsCrossed className="service-icon" size={20} />
                    <div className="service-info">
                      <span className="service-label">
                        Sélectionnez une carte
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
          <Document
            file={getPdfFile()}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(error) => console.error("PDF load error:", error)}
            loading={<div className="document-loading">Chargement...</div>}
          >
            <div className="pdf-pages-container">{renderPages()}</div>
          </Document>
        </div>
      )}

      {numPages && (
        <div className="page-indicator">
          Page {currentPage} / {numPages}
        </div>
      )}
    </div>
  );
};

export default MenuDisplay;
