import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Menu, Phone } from "lucide-react";
import ReactGA from "react-ga4";
import "./navbar.scss";

// Configuration des événements GA4 pour Navbar
const GA4_EVENTS = {
  MENU_TOGGLE: "navbar_menu_toggle",
  LINK_CLICK: "navbar_link_click",
  PHONE_CLICK: "navbar_phone_click",
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const lastToggleTime = useRef<number>(0);
  const toggleDebounceMs = 1000; // 1 second debounce for menu toggle

  const toggleNavbar = () => {
    const now = Date.now();
    // Debounce to prevent spamming toggle events
    if (now - lastToggleTime.current < toggleDebounceMs) {
      return;
    }
    lastToggleTime.current = now;

    setIsOpen((prev) => !prev);

    // Track only menu open event
    if (!isOpen) {
      ReactGA.event(GA4_EVENTS.MENU_TOGGLE, {
        page_name: location.pathname,
        menu_state: "open",
      });
    }
  };

  const handleLinkClick = (linkLabel: string, linkPath: string) => {
    setIsOpen(false);

    // Track navigation link clicks with detailed parameters
    ReactGA.event(GA4_EVENTS.LINK_CLICK, {
      page_name: location.pathname,
      link_label: linkLabel,
      link_path: linkPath,
    });
  };

  const handlePhoneCall = () => {
    // Track phone call clicks
    ReactGA.event(GA4_EVENTS.PHONE_CLICK, {
      page_name: location.pathname,
      phone_number: "0544314447",
    });

    window.location.href = "tel:0544314447";
  };

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

  // Fonction pour vérifier si le lien est actif (exclut la page d'accueil)
  const isActiveLink = (path: string) => {
    if (path === "/") {
      return false;
    }
    return location.pathname === path;
  };

  return (
    <header role="banner">
      <nav
        className="navbar"
        role="navigation"
        aria-label="Navigation principale du restaurant Rosi Trattoria"
      >
        <div className="navbar__container">
          <div className="navbar__left-section">
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

          <div className="navbar__right-section">
            <ul
              className={`navbar__links ${isOpen ? "navbar__links--open" : ""}`}
              role="menubar"
              aria-label="Menu de navigation"
            >
              {navItems.map((item, index) => (
                <li key={index} className="navbar__item" role="none">
                  <Link
                    to={item.path}
                    className={`navbar__link ${
                      isActiveLink(item.path) ? "navbar__link--active" : ""
                    }`}
                    onClick={() => handleLinkClick(item.label, item.path)}
                    title={item.title}
                    role="menuitem"
                    aria-current={isActiveLink(item.path) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="navbar__mobile-controls">
              <button
                className="navbar__phone-button"
                onClick={handlePhoneCall}
                aria-label="Appeler le restaurant Rosi Trattoria au 05 44 31 44 47"
                title="Téléphoner pour réserver une table"
                type="button"
              >
                <Phone size={20} aria-hidden="true" />
                <span className="sr-only">05 44 31 44 47</span>
              </button>

              <button
                className="navbar__toggle"
                onClick={toggleNavbar}
                aria-label={
                  isOpen
                    ? "Fermer le menu de navigation"
                    : "Ouvrir le menu de navigation"
                }
                aria-expanded={isOpen}
                aria-controls="navbar-menu"
                type="button"
              >
                {isOpen ? (
                  <X size={22} aria-hidden="true" />
                ) : (
                  <Menu size={22} aria-hidden="true" />
                )}
                <span className="sr-only">
                  {isOpen ? "Fermer le menu" : "Ouvrir le menu"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
