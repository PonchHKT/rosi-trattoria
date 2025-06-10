import React, { useState } from "react";
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

  return (
    <nav className="navbar" aria-label="Navigation principale">
      <div className="navbar__container">
        <div className="navbar__brand">
          <span className="navbar__brand-rosi">Rosi</span> -{" "}
          <span className="navbar__brand-trattoria">Trattoria</span>
        </div>

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

        <ul className={`navbar__links ${isOpen ? "navbar__links--open" : ""}`}>
          {["Accueil", "Nos valeurs", "Carte", "Recrutement", "Contact"].map(
            (label, index) => (
              <li className="navbar__item" key={index}>
                <a
                  href={`#${label.toLowerCase().replace(/\s/g, "")}`}
                  className={`navbar__link ${
                    activeIndex === index ? "navbar__link--active" : ""
                  }`}
                  onClick={() => handleLinkClick(index)}
                >
                  {label}
                </a>
              </li>
            )
          )}
        </ul>
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
