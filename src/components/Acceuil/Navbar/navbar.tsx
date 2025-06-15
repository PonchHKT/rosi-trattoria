import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Ensure NavLink is imported
import { X, Menu } from "lucide-react";
import "./navbar.scss";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (index: number) => {
    setActiveIndex(index);
    setIsOpen(false);
  };

  const navItems = [
    { label: "Accueil", path: "/" },
    { label: "Nos valeurs", path: "/nos-valeurs" },
    { label: "Carte", path: "/carte" },
    { label: "Recrutement", path: "/recrutement" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar" aria-label="Navigation principale">
      <div className="navbar__container">
        <div className="navbar__left-section">
          <div className="navbar__brand">
            <span className="navbar__brand-rosi">Rosi</span>{" "}
            <span className="navbar__brand-trattoria">Trattoria</span>
          </div>
        </div>

        <div className="navbar__right-section">
          <button
            className="navbar__toggle"
            onClick={toggleNavbar}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X size={28} color="white" />
            ) : (
              <Menu size={28} color="white" />
            )}
          </button>

          <ul
            className={`navbar__links ${isOpen ? "navbar__links--open" : ""}`}
          >
            {navItems.map((item, index) => (
              <li className="navbar__item" key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `navbar__link ${
                      isActive || activeIndex === index
                        ? "navbar__link--active"
                        : ""
                    }`
                  }
                  onClick={() => handleLinkClick(index)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="navbar__flag-bar" aria-hidden="true">
        <span className="navbar__flag--green"></span>
        <span className="navbar__flag--white"></span>
        <span className="navbar__flag--red"></span>
      </div>
    </nav>
  );
};

export default Navbar;
