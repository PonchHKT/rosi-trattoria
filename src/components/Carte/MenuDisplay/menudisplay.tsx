import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Clock,
  Calendar,
  ChevronUp,
  ChevronDown,
  ShoppingBag,
  UtensilsCrossed,
  Menu,
} from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./menudisplay.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MenuDisplay: React.FC = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState(800);
  const [loadedPages, setLoadedPages] = useState(new Set([1]));
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle responsive page width with devicePixelRatio
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const pixelRatio = window.devicePixelRatio || 1;
        const containerWidth = containerRef.current.offsetWidth - 40;
        setPageWidth(Math.min(containerWidth * pixelRatio, 1200));
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
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Intersection Observer for lazy loading and page tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageNumber = Number(entry.target.getAttribute("data-page"));
          if (entry.isIntersecting) {
            setLoadedPages((prev) => new Set([...prev, pageNumber]));
            if (entry.intersectionRatio > 0.5) {
              setCurrentPage(pageNumber);
            }
          }
        });
      },
      { rootMargin: "1000px", threshold: [0, 0.5] }
    );

    Object.values(pageRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [numPages]);

  // Scroll to previous page
  const scrollToPreviousPage = () => {
    const targetPage = currentPage > 1 ? currentPage - 1 : 1;
    const targetElement = pageRefs.current[targetPage];
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 20,
        behavior: "smooth",
      });
      setCurrentPage(targetPage);
    }
  };

  // Handle menu selection
  const handleMenuSelect = (menuType: string) => {
    setSelectedMenu(menuType);
    setIsDropdownOpen(false);
    setNumPages(null);
    setLoadedPages(new Set([1]));
    setCurrentPage(1);
  };

  // Get menu option details
  const getMenuOption = (type: string) => {
    switch (type) {
      case "sur_place":
        return {
          icon: UtensilsCrossed,
          label: "Sur place",
          description: "Service à table",
        };
      case "a_emporter":
        return {
          icon: ShoppingBag,
          label: "À emporter",
          description: "Tarifs réduits",
        };
      default:
        return null;
    }
  };

  // Determine PDF file based on selection
  const getPdfFile = () => {
    if (selectedMenu === "sur_place") return "/carterositrattoria.pdf";
    if (selectedMenu === "a_emporter") return "/carterositrattoriaemporter.pdf";
    return null;
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
              scale={window.devicePixelRatio || 1}
              renderTextLayer={true}
              renderAnnotationLayer={false}
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

  const selectedOption = selectedMenu ? getMenuOption(selectedMenu) : null;

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
          <h3 className="service-title">Type de service</h3>

          <div className="dropdown-container" ref={dropdownRef}>
            <button
              className={`dropdown-trigger ${selectedMenu ? "selected" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <div className="dropdown-trigger-content">
                {selectedOption ? (
                  <>
                    <selectedOption.icon className="service-icon" size={20} />
                    <div className="service-info">
                      <span className="service-label">
                        {selectedOption.label}
                      </span>
                      <span className="service-description">
                        {selectedOption.description}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Menu className="service-icon" size={20} />
                    <div className="service-info">
                      <span className="service-label">Choisir une carte</span>
                      <span className="service-description">
                        Sélectionnez votre option
                      </span>
                    </div>
                  </>
                )}
              </div>
              <ChevronDown
                className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
                size={20}
              />
            </button>

            <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
              <div
                className="dropdown-option"
                onClick={() => handleMenuSelect("sur_place")}
              >
                <UtensilsCrossed className="service-icon" size={20} />
                <div className="service-info">
                  <span className="service-label">Sur place</span>
                  <span className="service-description">Service à table</span>
                </div>
              </div>

              <div
                className="dropdown-option"
                onClick={() => handleMenuSelect("a_emporter")}
              >
                <ShoppingBag className="service-icon" size={20} />
                <div className="service-info">
                  <span className="service-label">À emporter</span>
                  <span className="service-description"></span>
                </div>
                <span className="discount-badge">Tarifs réduits</span>
              </div>
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
            loading={
              <div className="document-loading">Chargement du menu...</div>
            }
          >
            <div className="pdf-pages-container">{renderPages()}</div>
          </Document>
        </div>
      )}

      <button
        className="scroll-to-top"
        onClick={scrollToPreviousPage}
        aria-label="Page précédente"
        title={
          currentPage > 1
            ? `Aller à la page ${currentPage - 1}`
            : "Retour en haut"
        }
      >
        <ChevronUp size={24} />
      </button>

      {numPages && (
        <div className="page-indicator">
          Page {currentPage} / {numPages}
        </div>
      )}
    </div>
  );
};

export default MenuDisplay;
