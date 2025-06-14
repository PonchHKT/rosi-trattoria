import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Clock, Calendar, ChevronUp } from "lucide-react";
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
  const [currentTopPage, setCurrentTopPage] = useState<number>(1); // Page actuellement visible en haut
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

  // Intersection Observer optimisé pour le lazy loading et tracking de la page courante
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageNumber = parseInt(
            entry.target.getAttribute("data-page") || "0"
          );

          if (entry.isIntersecting) {
            // Ajouter la page aux pages chargées
            setLoadedPages((prev) => new Set([...prev, pageNumber]));

            // Mettre à jour la page courante si elle est suffisamment visible
            if (entry.intersectionRatio > 0.5) {
              setCurrentTopPage(pageNumber);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "200px", // Augmenté pour précharger plus tôt
        threshold: [0, 0.5], // Ajouter un seuil pour détecter quand la page est à moitié visible
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Fonction améliorée pour détecter la page actuellement visible
  const getCurrentVisiblePage = (): number => {
    let closestPage = 1;
    let minDistance = Infinity;

    Object.entries(pageRefs.current).forEach(([pageNum, element]) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const pageNumber = parseInt(pageNum);

        // Distance du haut de la page au viewport
        const distanceFromTop = Math.abs(rect.top);

        // Si la page est visible dans le viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (distanceFromTop < minDistance) {
            minDistance = distanceFromTop;
            closestPage = pageNumber;
          }
        }
      }
    });

    return closestPage;
  };

  // Fonction pour scroller vers la page précédente - VERSION CORRIGÉE
  const scrollToPreviousPage = () => {
    // Obtenir la page actuellement visible de manière plus précise
    const actualCurrentPage = getCurrentVisiblePage();

    if (actualCurrentPage > 1) {
      const targetPage = actualCurrentPage - 1;
      const targetElement = pageRefs.current[targetPage];

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 20; // 20px de marge

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Mettre à jour immédiatement l'état pour un feedback visuel
        setCurrentTopPage(targetPage);
      }
    } else {
      // Si on est sur la première page, remonter tout en haut
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setCurrentTopPage(1);
    }
  };

  // Ajouter un listener pour mettre à jour la page courante en temps réel
  useEffect(() => {
    const handleScroll = () => {
      const currentPage = getCurrentVisiblePage();
      if (currentPage !== currentTopPage) {
        setCurrentTopPage(currentPage);
      }
    };

    // Throttle la fonction de scroll pour les performances
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentTopPage]);

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
            // Stocker la référence de l'élément
            pageRefs.current[pageNumber] = el;

            // Observer l'élément
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
      {/* Section des horaires - style minimaliste */}
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
      </div>

      {/* Section PDF séparée */}
      <div className="pdf-section">
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
      </div>

      {/* Bouton de remontée d'une page */}
      <button
        className="scroll-to-top"
        onClick={scrollToPreviousPage}
        aria-label="Page précédente"
        title={
          currentTopPage > 1
            ? `Aller à la page ${currentTopPage - 1}`
            : "Retour en haut"
        }
      >
        <ChevronUp size={24} />
      </button>

      {/* Indicateur de page courante */}
      {numPages && (
        <div className="page-indicator">
          Page {currentTopPage} / {numPages}
        </div>
      )}

      {/* Indicateur de progression */}
      <div className="scroll-progress">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

export default MenuDisplay;
