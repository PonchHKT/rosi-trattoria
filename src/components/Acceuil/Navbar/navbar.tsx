import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Phone } from "lucide-react";
import ReactGA from "react-ga4";
import "./navbar.scss";

// Configuration des événements GA4 pour Navbar
const GA4_EVENTS = {
  MENU_TOGGLE: "navbar_menu_toggle",
  LINK_CLICK: "navbar_link_click",
  PHONE_CLICK: "navbar_phone_click",
  MENU_CLOSE: "navbar_menu_close",
  RESERVATION_CLICK: "navbar_reservation_click",
};

// Composant LoadingBar
const LoadingBar = ({
  isLoading = false,
  progress = 0,
  autoProgress = false,
  duration = 1500,
  color = "pink",
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setCurrentProgress(0);

      if (autoProgress) {
        // Animation automatique avec progression plus fluide
        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progressPercent = Math.min((elapsed / duration) * 100, 100);

          setCurrentProgress(progressPercent);

          if (progressPercent >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsVisible(false);
              setCurrentProgress(0);
            }, 200);
          }
        }, 16); // ~60fps

        return () => clearInterval(interval);
      } else {
        // Progression manuelle
        setCurrentProgress(progress);
      }
    } else {
      // Terminer immédiatement si isLoading devient false
      setCurrentProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setCurrentProgress(0);
      }, 200);
    }
  }, [isLoading, progress, autoProgress, duration]);

  const getColorClass = () => {
    switch (color) {
      case "green":
        return "loading-bar--green";
      case "blue":
        return "loading-bar--blue";
      default:
        return "loading-bar--pink";
    }
  };

  return (
    <div
      className={`loading-bar ${
        !isVisible ? "loading-bar--hidden" : ""
      } ${getColorClass()}`}
    >
      <div
        className="loading-bar__progress"
        style={{ width: `${Math.min(currentProgress, 100)}%` }}
      />
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const lastToggleTime = useRef(0);
  const toggleDebounceMs = 300;

  // Fermer le menu si on change de page
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Empêcher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsAnimating(true);
    } else {
      document.body.style.overflow = "";
      if (isAnimating) {
        const timer = setTimeout(() => setIsAnimating(false), 400);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isAnimating]);

  // Déclencher le loading bar lors des changements de page
  useEffect(() => {
    setIsLoading(true);

    // Simuler un délai de chargement de page
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const toggleNavbar = () => {
    const now = Date.now();
    if (now - lastToggleTime.current < toggleDebounceMs) {
      return;
    }
    lastToggleTime.current = now;

    setIsOpen((prev) => !prev);

    // Track menu events
    ReactGA.event(GA4_EVENTS.MENU_TOGGLE, {
      page_name: location.pathname,
      menu_state: isOpen ? "close" : "open",
    });
  };

  const closeMenu = () => {
    setIsOpen(false);

    ReactGA.event(GA4_EVENTS.MENU_CLOSE, {
      page_name: location.pathname,
    });
  };

  const handleLinkClick = (linkLabel: string, linkPath: string) => {
    setIsOpen(false);
    setIsLoading(true);

    ReactGA.event(GA4_EVENTS.LINK_CLICK, {
      page_name: location.pathname,
      link_label: linkLabel,
      link_path: linkPath,
    });
  };

  const handleReservationClick = () => {
    setIsOpen(false);

    ReactGA.event(GA4_EVENTS.RESERVATION_CLICK, {
      page_name: location.pathname,
      external_url:
        "https://bookings.zenchef.com/results?rid=356394&fullscreen=1",
    });
  };

  const handlePhoneCall = () => {
    ReactGA.event(GA4_EVENTS.PHONE_CLICK, {
      page_name: location.pathname,
      phone_number: "0544314447",
    });

    window.location.href = "tel:0544314447";
  };

  // Fermer le menu si on clique sur l'overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  // Gestion des touches clavier
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      closeMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const navItems = [
    {
      label: "Accueil",
      path: "/",
      title: "Accueil - Rosi Trattoria",
    },
    {
      label: "Carte",
      path: "/carte",
      title: "Notre carte - Disponible à emporter ou à déguster sur place",
    },
    {
      label: "Nos valeurs",
      path: "/nos-valeurs",
      title: "Nos valeurs - Authenticité et Tradition Italienne",
    },
    {
      label: "Recrutement",
      path: "/recrutement",
      title: "Recrutement - Rejoignez l'équipe de Rosi Trattoria",
    },
    {
      label: "Contact",
      path: "/contact",
      title: "Nous contacter - Renseignez-nous vos questions ou demandes",
    },
  ];

  const isActiveLink = (path: string) => {
    // Ne jamais afficher "Accueil" comme actif
    if (path === "/") {
      return false;
    }
    return location.pathname === path;
  };

  return (
    <>
      <header role="banner" className="navbar-header">
        <nav
          className="navbar"
          role="navigation"
          aria-label="Navigation principale du restaurant Rosi Trattoria"
        >
          <div className="navbar__container">
            <div className="navbar__brand-section">
              <div className="navbar__brand-container">
                <Link
                  to="/"
                  className="navbar__brand-link"
                  title="Rosi Trattoria – Pizzeria Italienne Bio, Locale & Fait Maison"
                  aria-label="Retour à l'accueil du restaurant Rosi Trattoria"
                  onClick={() => handleLinkClick("Accueil", "/")}
                >
                  <h1 className="navbar__brand">
                    <span className="navbar__brand-rosi">Rosi</span>
                    <span className="navbar__brand-trattoria">Trattoria</span>
                  </h1>
                </Link>
                <div className="navbar__flag-bar" aria-hidden="true">
                  <div className="navbar__flag--green"></div>
                  <div className="navbar__flag--white"></div>
                  <div className="navbar__flag--red"></div>
                </div>
              </div>
            </div>

            {/* Navigation desktop */}
            <div className="navbar__desktop-nav">
              <ul className="navbar__nav-list" role="menubar">
                {navItems.map((item, index) => (
                  <li key={index} className="navbar__nav-item" role="none">
                    <Link
                      to={item.path}
                      className={`navbar__nav-link ${
                        isActiveLink(item.path)
                          ? "navbar__nav-link--active"
                          : ""
                      }`}
                      onClick={() => handleLinkClick(item.label, item.path)}
                      title={item.title}
                      role="menuitem"
                      aria-current={
                        isActiveLink(item.path) ? "page" : undefined
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contrôles mobiles */}
            <div className="navbar__mobile-controls">
              <button
                className="navbar__phone-btn"
                onClick={handlePhoneCall}
                aria-label="Appeler le restaurant Rosi Trattoria au 05 44 31 44 47"
                title="Téléphoner pour réserver une table"
                type="button"
              >
                <Phone size={18} aria-hidden="true" />
              </button>

              <button
                className={`navbar__burger ${
                  isOpen ? "navbar__burger--open" : ""
                }`}
                onClick={toggleNavbar}
                aria-label={
                  isOpen
                    ? "Fermer le menu de navigation"
                    : "Ouvrir le menu de navigation"
                }
                aria-expanded={isOpen}
                aria-controls="navbar-mobile-menu"
                type="button"
              >
                <span className="navbar__burger-line"></span>
                <span className="navbar__burger-line"></span>
                <span className="navbar__burger-line"></span>
              </button>
            </div>
          </div>
        </nav>

        {/* Barre de chargement - Positionnée en bas de la navbar */}
        <LoadingBar
          isLoading={isLoading}
          autoProgress={true}
          duration={1200}
          color="pink"
        />
      </header>

      {/* Overlay avec effet de flou */}
      <div
        className={`navbar__overlay ${isOpen ? "navbar__overlay--open" : ""}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Menu mobile full-screen */}
      <div
        id="navbar-mobile-menu"
        className={`navbar__mobile-menu ${
          isOpen ? "navbar__mobile-menu--open" : ""
        } ${isAnimating ? "navbar__mobile-menu--animating" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="navbar__mobile-header">
          <h2 id="mobile-menu-title" className="navbar__mobile-title">
            Bio, Locale & Fait Maison
          </h2>
          <button
            className="navbar__close-btn"
            onClick={closeMenu}
            aria-label="Fermer le menu"
            type="button"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <nav className="navbar__mobile-nav" role="navigation">
          <ul className="navbar__mobile-list" role="menubar">
            {navItems.map((item, index) => (
              <li
                key={index}
                className="navbar__mobile-item"
                role="none"
                style={{ "--item-index": index } as React.CSSProperties}
              >
                <Link
                  to={item.path}
                  className={`navbar__mobile-link ${
                    isActiveLink(item.path) ? "navbar__mobile-link--active" : ""
                  } ${
                    item.path === "/carte" ? "navbar__mobile-link--carte" : ""
                  }`}
                  onClick={() => handleLinkClick(item.label, item.path)}
                  title={item.title}
                  role="menuitem"
                  aria-current={isActiveLink(item.path) ? "page" : undefined}
                  tabIndex={isOpen ? 0 : -1}
                  style={
                    item.path === "/carte"
                      ? { backgroundColor: "var(--primary-pink)" }
                      : {}
                  }
                >
                  <span className="navbar__mobile-link-text">{item.label}</span>
                  <span className="navbar__mobile-link-line"></span>
                </Link>
              </li>
            ))}

            {/* Lien Réservation en dernier avec background jaune */}
            <li
              className="navbar__mobile-item"
              role="none"
              style={{ "--item-index": navItems.length } as React.CSSProperties}
            >
              <a
                href="https://bookings.zenchef.com/results?rid=356394&fullscreen=1"
                className="navbar__mobile-link navbar__mobile-link--reservation"
                onClick={handleReservationClick}
                title="Réserver une table en ligne"
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#ffd506" }}
              >
                <span className="navbar__mobile-link-text">Réservation</span>
                <span className="navbar__mobile-link-line"></span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
