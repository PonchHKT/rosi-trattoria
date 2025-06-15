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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const updateTimeoutRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  // Detect if device is mobile
  const isMobile = () => window.innerWidth < 768;

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

  // Intersection Observer optimisé pour mobile - VERSION FIXÉE
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!numPages) return;

    const mobile = isMobile();

    // Configuration optimisée pour mobile
    const config = mobile
      ? {
          rootMargin: "50px", // Réduit pour mobile
          threshold: [0.3], // Un seul seuil pour éviter les changements fréquents
          throttleDelay: 300, // Délai plus long pour mobile
        }
      : {
          rootMargin: "200px",
          threshold: [0.1, 0.3, 0.5],
          throttleDelay: 100,
        };

    // Fonction throttlée pour les updates
    const throttledUpdate = (entries: IntersectionObserverEntry[]) => {
      const now = Date.now();

      // Sur mobile, ignore les updates trop fréquentes
      if (mobile && now - lastUpdateTimeRef.current < config.throttleDelay) {
        return;
      }

      lastUpdateTimeRef.current = now;

      // Clear timeout précédent
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Delay l'update pour éviter les saccades
      updateTimeoutRef.current = setTimeout(
        () => {
          const pagesToLoad = new Set(loadedPages);
          let newCurrentPage = currentPage;
          let maxVisiblePage = 0;

          entries.forEach((entry) => {
            const pageNumber = Number(entry.target.getAttribute("data-page"));

            if (entry.isIntersecting) {
              pagesToLoad.add(pageNumber);

              // Sur mobile, seulement mettre à jour la page courante si vraiment visible
              if (mobile) {
                if (entry.intersectionRatio > 0.5) {
                  maxVisiblePage = Math.max(maxVisiblePage, pageNumber);
                }
              } else {
                if (entry.intersectionRatio > 0.3) {
                  newCurrentPage = pageNumber;
                }
              }
            } else {
              // Sur mobile, garder plus de pages chargées pour éviter les rechargements
              if (!mobile || entry.intersectionRatio < 0.05) {
                pagesToLoad.delete(pageNumber);
              }
            }
          });

          // Sur mobile, utiliser la page la plus visible
          if (mobile && maxVisiblePage > 0) {
            newCurrentPage = maxVisiblePage;
          }

          // Batch updates pour éviter les re-renders multiples
          if (
            pagesToLoad.size !== loadedPages.size ||
            Array.from(pagesToLoad).some((p) => !loadedPages.has(p))
          ) {
            setLoadedPages(new Set(pagesToLoad));
          }

          if (newCurrentPage !== currentPage) {
            setCurrentPage(newCurrentPage);
          }
        },
        mobile ? 150 : 50
      );
    };

    observerRef.current = new IntersectionObserver(throttledUpdate, {
      rootMargin: config.rootMargin,
      threshold: config.threshold,
      root: null,
    });

    // Observer les éléments de page
    Object.values(pageRefs.current).forEach((el) => {
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [numPages, currentPage, loadedPages]);

  // Handle menu selection
  const handleMenuSelect = (menuType: string) => {
    setSelectedMenu(menuType);
    setDropdownOpen(false);
    setNumPages(null);
    setLoadedPages(new Set());
    setCurrentPage(1);

    // Clean up observer when switching menus
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
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

  // Render PDF pages - VERSION OPTIMISÉE POUR MOBILE
  const renderPages = () => {
    if (!numPages) return null;

    const mobile = isMobile();

    return Array.from({ length: numPages }, (_, i) => {
      const pageNumber = i + 1;
      const shouldLoad = loadedPages.has(pageNumber);

      // Sur mobile, hauteur fixe pour éviter les layout shifts
      const containerStyle = mobile
        ? {
            minHeight: "700px", // Hauteur fixe plus grande
            maxHeight: "700px", // Hauteur maximale pour contrôler
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden", // Évite les débordements
          }
        : {
            minHeight: "600px",
          };

      return (
        <div
          key={pageNumber}
          className={`pdf-page-container ${mobile ? "mobile-optimized" : ""}`}
          data-page={pageNumber}
          style={containerStyle}
          ref={(el) => {
            pageRefs.current[pageNumber] = el;
          }}
        >
          {shouldLoad ? (
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false} // Désactivé sur mobile ET desktop pour les performances
              renderAnnotationLayer={false}
              renderMode="canvas"
              className="pdf-page"
              loading={
                <div
                  className="page-loading"
                  style={{ minHeight: mobile ? "600px" : "500px" }}
                >
                  Chargement...
                </div>
              }
              onLoadSuccess={() => {
                // Vide pour éviter les re-renders
              }}
              onLoadError={(error) => {
                console.warn(`Erreur chargement page ${pageNumber}:`, error);
              }}
            />
          ) : (
            <div
              className="page-placeholder"
              style={{
                minHeight: mobile ? "600px" : "500px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                backgroundColor: "rgba(15, 23, 42, 0.3)",
                borderRadius: "16px",
                border: "1px solid rgba(148, 163, 184, 0.1)",
              }}
            >
              Page {pageNumber}
            </div>
          )}
        </div>
      );
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

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
