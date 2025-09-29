import React, { useState, useEffect, useRef } from "react";
import {
  UtensilsCrossed,
  ShoppingBag,
  ChevronDown,
  Download,
  Calendar,
  Wine,
} from "lucide-react";
import ReactGA from "react-ga4";
import "./selector.scss";

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
  onBackToHours?: () => void;
  wineCardMode?: boolean;
}

const GA4_EVENTS = {
  DROPDOWN_OPEN: "carte_dropdown_open",
  MENU_SELECT: "carte_menu_select",
  PDF_DISPLAY: "carte_pdf_display",
  PDF_DOWNLOAD: "carte_pdf_download",
  PDF_ERROR: "carte_pdf_error",
  BACK_TO_HOURS: "carte_back_to_hours",
  WINE_CARD_VIEW: "wine_card_direct_view",
};

const PAGE_6_REPLACEMENT_CONFIG = {
  startMonth: 10,
  startDay: 6,
  startHour: 23,
  startMinute: 59,
  endMonth: 10,
  endDay: 10,
  endHour: 0,
  endMinute: 0,
  replacementUrl:
    "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/cartesurplace/foiredulivre.pdf",
};

const Selector: React.FC<SelectorProps> = ({
  onMenuSelect,
  className,
  showPdf = true,
  onPdfToggle,
  selectedMenu: parentSelectedMenu,
  pageName = "Unknown Page",
  onBackToHours,
  wineCardMode = false,
}) => {
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [internalShowPdf, setInternalShowPdf] = useState(showPdf);
  const [loadingOffset, setLoadingOffset] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(
    new Set()
  );
  // État pour savoir si on affiche les pages vins uniquement
  const [showWinePagesOnly, setShowWinePagesOnly] = useState(false);

  const lastDropdownTime = useRef<number>(0);
  const dropdownDebounceMs = 1000;
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMobile = () => window.innerWidth < 768;

  const isInReplacementPeriod = (): boolean => {
    const now = new Date();
    const year = now.getFullYear();

    const startDate = new Date(
      year,
      PAGE_6_REPLACEMENT_CONFIG.startMonth,
      PAGE_6_REPLACEMENT_CONFIG.startDay,
      PAGE_6_REPLACEMENT_CONFIG.startHour,
      PAGE_6_REPLACEMENT_CONFIG.startMinute
    );

    const endDate = new Date(
      year,
      PAGE_6_REPLACEMENT_CONFIG.endMonth,
      PAGE_6_REPLACEMENT_CONFIG.endDay,
      PAGE_6_REPLACEMENT_CONFIG.endHour,
      PAGE_6_REPLACEMENT_CONFIG.endMinute
    );

    return now >= startDate && now <= endDate;
  };

  const getMenuImages = (menuType: string) => {
    // Afficher seulement les pages 7 et 8 si showWinePagesOnly est true
    if (showWinePagesOnly && menuType === "sur_place") {
      return [
        `https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/cartesurplace/surplacepage7.jpg`,
        `https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/cartesurplace/surplacepage8.jpg`,
      ];
    }

    if (menuType === "sur_place") {
      const images = Array.from({ length: 11 }, (_, i) => {
        if (i === 5 && isInReplacementPeriod()) {
          return PAGE_6_REPLACEMENT_CONFIG.replacementUrl;
        }
        return `https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/cartesurplace/surplacepage${
          i + 1
        }.jpg`;
      });
      return images;
    } else if (menuType === "a_emporter") {
      return Array.from(
        { length: 2 },
        (_, i) =>
          `https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Images%20Rosi/carteaemporter/emporterpage${
            i + 1
          }.jpg`
      );
    }
    return [];
  };

  const getTotalPages = (menuType: string) => {
    if (showWinePagesOnly && menuType === "sur_place") {
      return 2; // Seulement pages 7-8
    }
    return menuType === "sur_place" ? 11 : 2;
  };

  // Effect pour gérer le mode carte des vins au chargement initial UNIQUEMENT
  useEffect(() => {
    if (wineCardMode) {
      ReactGA.event(GA4_EVENTS.WINE_CARD_VIEW, {
        page_name: pageName,
        source: "qr_code_redirect",
      });

      // Activer le mode pages vins seulement
      setShowWinePagesOnly(true);

      // Charger automatiquement le menu sur place avec les pages vins
      setSelectedMenu("sur_place");
      handleMenuLoad("sur_place", true);
    }
  }, [wineCardMode]);

  const handleBackToHours = () => {
    setSelectedMenu("");
    setInternalShowPdf(false);
    setImagesLoaded(false);
    setIsLoading(false);
    setLoadingOffset(false);
    setDropdownOpen(false);
    setShowWinePagesOnly(false); // Reset le mode pages vins

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    ReactGA.event(GA4_EVENTS.BACK_TO_HOURS, {
      page_name: pageName,
      previous_menu: selectedMenu,
      wine_card_mode: wineCardMode,
    });

    if (onBackToHours) {
      onBackToHours();
    }
    if (onPdfToggle) {
      onPdfToggle(false);
    }
    if (onMenuSelect) {
      onMenuSelect("");
    }
  };

  const handleMenuLoad = (menuType: string, isWineMode: boolean = false) => {
    ReactGA.event(GA4_EVENTS.MENU_SELECT, {
      page_name: pageName,
      menu_type: menuType === "sur_place" ? "dine_in" : "takeaway",
      wine_card_mode: isWineMode,
    });

    setImagesLoaded(false);
    setInternalShowPdf(true);
    setIsLoading(true);
    setLoadingOffset(true);
    setImageLoadErrors(new Set());

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    if (onMenuSelect) {
      onMenuSelect(menuType);
    }

    if (onPdfToggle) {
      onPdfToggle(true);
    }

    const images = getMenuImages(menuType);
    let loadedCount = 0;
    const totalImages = images.length;

    const checkAllLoaded = () => {
      if (loadedCount === totalImages) {
        setIsLoading(false);
        setLoadingOffset(false);
        setImagesLoaded(true);
      }
    };

    images.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        checkAllLoaded();
      };
      img.onerror = () => {
        setImageLoadErrors((prev) => new Set(prev).add(src));
        loadedCount++;
        checkAllLoaded();
      };
      img.src = src;
    });

    const loadingDelay = isMobile() ? 3000 : 2000;
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setLoadingOffset(false);
      setImagesLoaded(true);
    }, loadingDelay);
  };

  const handleMenuSelect = (menuType: string) => {
    setSelectedMenu(menuType);
    setDropdownOpen(false);
    // Quand l'utilisateur sélectionne manuellement, désactiver le mode pages vins
    setShowWinePagesOnly(false);
    handleMenuLoad(menuType, false);
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
        wine_card_mode: wineCardMode,
      });
    }
    setDropdownOpen(!dropdownOpen);
  };

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
        handleMenuLoad(parentSelectedMenu, false);
      } else {
        setImagesLoaded(false);
        setInternalShowPdf(false);
        setIsLoading(false);
        setLoadingOffset(false);
        setShowWinePagesOnly(false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      }
    }
  }, [parentSelectedMenu]);

  useEffect(() => {
    setInternalShowPdf(showPdf);
    if (!showPdf) {
      setImagesLoaded(false);
      setIsLoading(false);
      setLoadingOffset(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  }, [showPdf]);

  useEffect(() => {
    if (imagesLoaded && !isLoading && internalShowPdf && selectedMenu) {
      ReactGA.event(GA4_EVENTS.PDF_DISPLAY, {
        page_name: pageName,
        menu_type: selectedMenu === "sur_place" ? "dine_in" : "takeaway",
        num_pages: getTotalPages(selectedMenu),
        wine_card_mode: showWinePagesOnly,
      });
    }
  }, [imagesLoaded, isLoading, internalShowPdf, selectedMenu, pageName]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const getPdfFile = () => {
    // Si on est en mode carte des vins, retourner le PDF de la carte des vins
    if (showWinePagesOnly && selectedMenu === "sur_place") {
      return "/cartedesvins.pdf";
    }

    if (selectedMenu === "sur_place") {
      return "/carterositrattoria.pdf";
    } else if (selectedMenu === "a_emporter") {
      return "/carterositrattoriaemporter.pdf";
    }
    return null;
  };

  const handleDownloadPdf = () => {
    ReactGA.event(GA4_EVENTS.PDF_DOWNLOAD, {
      page_name: pageName,
      menu_type: selectedMenu === "sur_place" ? "dine_in" : "takeaway",
      wine_card_mode: showWinePagesOnly,
    });

    const pdfFile = getPdfFile();
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;

      // Nom du fichier selon le mode
      if (showWinePagesOnly && selectedMenu === "sur_place") {
        link.download = "Carte-des-Vins.pdf";
      } else if (selectedMenu === "sur_place") {
        link.download = "Carte-Restaurant-Sur-Place.pdf";
      } else {
        link.download = "Carte-Restaurant-A-Emporter.pdf";
      }

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

  const renderAllMenuPages = () => {
    if (!selectedMenu || !imagesLoaded) return null;

    const images = getMenuImages(selectedMenu);

    return (
      <div className="menu-pages-container">
        {images.map((imageSrc, index) => {
          if (imageLoadErrors.has(imageSrc)) {
            return (
              <div key={index} className="menu-page-error">
                <p>Erreur lors du chargement de la page {index + 1}</p>
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`menu-page-wrapper ${
                selectedMenu === "a_emporter" ? "takeaway-menu" : ""
              }`}
            >
              <img
                src={imageSrc}
                alt={`Menu page ${showWinePagesOnly ? index + 7 : index + 1}`}
                className="menu-page-image"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    );
  };

  const selectedMenuInfo = getSelectedMenuInfo();

  return (
    <div
      className={`selector-container ${className || ""} ${
        wineCardMode ? "wine-card-mode" : ""
      }`}
      ref={containerRef}
    >
      <div className="selector-content">
        {selectedMenu && isLoading && (
          <div className="document-loading">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <span className="loading-announcement">
                Chargement{" "}
                {showWinePagesOnly ? "de la carte des vins" : "du menu"} en
                cours...
                <br />
                <small>
                  Nous préparons votre carte, merci de patienter un instant
                </small>
              </span>
            </div>
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
                      {showWinePagesOnly && selectedMenu === "sur_place"
                        ? "Carte des Vins"
                        : selectedMenuInfo.label}
                    </span>
                    <span className="service-description">
                      {showWinePagesOnly && selectedMenu === "sur_place"
                        ? "Notre sélection de vins"
                        : selectedMenuInfo.description}
                    </span>
                  </div>
                  {selectedMenuInfo.hasDiscount && !showWinePagesOnly && (
                    <span className="discount-badge">Tarifs réduits</span>
                  )}
                </>
              ) : (
                <>
                  <div className="service-info">
                    <span className="service-label">
                      Sélectionnez une carte
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

            {selectedMenu && (
              <div
                className="dropdown-option show-hours-option"
                onClick={handleBackToHours}
              >
                <Calendar className="service-icon" size={20} />
                <div className="service-info">
                  <span className="service-label">Afficher les horaires</span>
                  <span className="service-description">
                    Voir nos heures d'ouverture
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedMenu && !isLoading && internalShowPdf && (
          <div className="download-section">
            <button className="download-button" onClick={handleDownloadPdf}>
              <Download className="download-icon" size={18} />
              <span>Télécharger</span>
            </button>
          </div>
        )}
      </div>

      {selectedMenu && internalShowPdf && (
        <div
          className={`menu-section ${loadingOffset ? "loading-offset" : ""}`}
        >
          {renderAllMenuPages()}
        </div>
      )}
    </div>
  );
};

export default Selector;
