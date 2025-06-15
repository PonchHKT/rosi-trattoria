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
  const [pageDimensions, setPageDimensions] = useState<
    { width: number; height: number }[]
  >([]);
  const [pageWidth, setPageWidth] = useState(800);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Handle scroll to update current page
  useEffect(() => {
    const handleScroll = () => {
      if (!numPages) return;
      const pageElements = document.querySelectorAll(".pdf-page-container");
      let newCurrentPage = currentPage;

      pageElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
          newCurrentPage = index + 1;
        }
      });

      if (newCurrentPage !== currentPage) {
        setCurrentPage(newCurrentPage);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [numPages, currentPage]);

  // Handle menu selection with conditional loading timer
  const handleMenuSelect = (menuType: string) => {
    setSelectedMenu(menuType);
    setDropdownOpen(false);
    setNumPages(null);
    setPageDimensions([]);
    setCurrentPage(1);
    setIsLoading(true);

    // Only set timer for "sur_place" menu (7 seconds)
    if (menuType === "sur_place") {
      setTimeout(() => {
        setIsLoading(false);
      }, 7000);
    }
    // For "a_emporter", loading will be handled by PDF load success
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

  // Handle PDF load success to get page dimensions
  const handleDocumentLoadSuccess = async ({
    numPages,
  }: {
    numPages: number;
  }) => {
    setNumPages(numPages);

    // For "a_emporter", stop loading immediately when PDF loads
    if (selectedMenu === "a_emporter") {
      setIsLoading(false);
    }

    const pdfFile = getPdfFile();
    if (!pdfFile) return;
    const pdf = await pdfjs.getDocument(pdfFile).promise;
    const dimensions = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      dimensions.push({ width: viewport.width, height: viewport.height });
    }
    setPageDimensions(dimensions);
  };

  // Render PDF pages
  const renderPages = () => {
    if (!numPages || !pageDimensions.length) return null;

    const mobile = isMobile();

    return (
      <div className="pdf-page-grid">
        {Array.from({ length: numPages }, (_, i) => {
          const pageNumber = i + 1;
          const isLandscape =
            pageDimensions[i]?.width > pageDimensions[i]?.height;
          const adjustedWidth =
            mobile && isLandscape ? pageWidth * 1.2 : pageWidth;

          const containerStyle = mobile
            ? {
                minHeight: isLandscape ? "400px" : "500px",
                maxHeight: isLandscape ? "600px" : "700px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible",
              }
            : {
                minHeight: "600px",
              };

          return (
            <div
              key={pageNumber}
              className={`pdf-page-container ${
                mobile ? "mobile-optimized" : ""
              } ${isLandscape ? "landscape" : ""}`}
              data-page={pageNumber}
              style={containerStyle}
            >
              <Page
                pageNumber={pageNumber}
                width={adjustedWidth}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                renderMode="canvas"
                className="pdf-page"
                loading={
                  <div
                    className="page-loading"
                    style={{
                      minHeight: mobile
                        ? isLandscape
                          ? "400px"
                          : "600px"
                        : "500px",
                    }}
                  >
                    Chargement...
                  </div>
                }
                onLoadError={(error) => {
                  console.warn(`Erreur chargement page ${pageNumber}:`, error);
                }}
              />
            </div>
          );
        })}
      </div>
    );
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
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={(error) => console.error("PDF load error:", error)}
            loading={null}
          >
            {isLoading || !numPages ? (
              <div className="document-loading">
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  <span className="loading-announcement">
                    Chargement du menu en cours...
                    <br />
                    <small>
                      Veuillez patienter le temps que le navigateur traite le
                      PDF
                    </small>
                  </span>
                </div>
              </div>
            ) : (
              renderPages()
            )}
          </Document>
        </div>
      )}

      {numPages && !isLoading && (
        <div className="page-indicator">
          Page {currentPage} / {numPages}
        </div>
      )}
    </div>
  );
};

export default MenuDisplay;
