import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Menu, Phone } from "lucide-react";
import "./navbar.scss";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:0544314447";
  };

  const navItems = [
    { label: "Accueil", path: "/" },
    { label: "Carte", path: "/carte" },
    { label: "Nos valeurs", path: "/nos-valeurs" },
    { label: "Recrutement", path: "/recrutement" },
    { label: "Contact", path: "/contact" },
  ];

  // Fonction pour vérifier si le lien est actif
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left-section">
          <div className="navbar__brand-container">
            <h1 className="navbar__brand">
              <span className="navbar__brand-rosi">Rosi</span>
              <span className="navbar__brand-trattoria">Trattoria</span>
            </h1>
            <div className="navbar__flag-bar">
              <div className="navbar__flag--green"></div>
              <div className="navbar__flag--white"></div>
              <div className="navbar__flag--red"></div>
            </div>
          </div>
        </div>

        <div className="navbar__right-section">
          <ul
            className={`navbar__links ${isOpen ? "navbar__links--open" : ""}`}
          >
            {navItems.map((item, index) => (
              <li key={index} className="navbar__item">
                <Link
                  to={item.path}
                  className={`navbar__link ${
                    isActiveLink(item.path) ? "navbar__link--active" : ""
                  }`}
                  onClick={handleLinkClick}
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
              aria-label="Appeler le restaurant"
            >
              <Phone size={20} />
            </button>

            <button
              className="navbar__toggle"
              onClick={toggleNavbar}
              aria-label="Toggle navigation"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
