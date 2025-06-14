import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./menudisplay.scss";

// Configuration du worker pour react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MenuDisplay: React.FC = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(800);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([1, 5])); // Précharger les 2 premières pages
  const [loadProgress, setLoadProgress] = useState(0); // État pour la progression du chargement
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Erreur lors du chargement du PDF:", error);
  };

  // Gestion responsive de la largeur
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setPageWidth(Math.min(containerWidth - 40, 800));
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Intersection Observer optimisé pour le lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNumber = parseInt(
              entry.target.getAttribute("data-page") || "0"
            );
            setLoadedPages((prev) => new Set([...prev, pageNumber]));
          }
        });
      },
      {
        root: null,
        rootMargin: "200px", // Augmenté pour précharger plus tôt
        threshold: 0,
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Fonction pour scroller vers le haut
  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Rendu optimisé des pages avec lazy loading intelligent
  const renderPages = () => {
    if (!numPages) return null;

    return Array.from({ length: numPages }, (_, index) => {
      const pageNumber = index + 1;
      const shouldLoad = loadedPages.has(pageNumber);

      return (
        <div
          key={pageNumber}
          className="pdf-page-container"
          data-page={pageNumber}
          ref={(el) => {
            if (el && observerRef.current) {
              observerRef.current.observe(el);
            }
          }}
        >
          {shouldLoad ? (
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false} // Désactivé pour de meilleures performances
              renderAnnotationLayer={false} // Désactivé pour de meilleures performances
              className="pdf-page"
              loading={
                <div className="page-loading">
                  <div className="loading-spinner"></div>
                </div>
              }
            />
          ) : (
            <div className="page-placeholder">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="menu-container" ref={containerRef}>
      <div className="pdf-header"></div>

      <Document
        file="/carterositrattoria.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        onLoadProgress={({ loaded, total }) => {
          if (total) {
            setLoadProgress((loaded / total) * 100);
          }
        }}
        loading={
          <div className="document-loading">
            <div className="loading-spinner large"></div>
            <span>Chargement... {loadProgress.toFixed(0)}%</span>
          </div>
        }
        className="pdf-document"
      >
        <div className="pdf-pages-container">{renderPages()}</div>
      </Document>

      {/* Bouton de retour en haut */}
      <button
        className="scroll-to-top"
        onClick={scrollToTop}
        aria-label="Retour en haut"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>

      {/* Indicateur de progression */}
      <div className="scroll-progress">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

export default MenuDisplay;
