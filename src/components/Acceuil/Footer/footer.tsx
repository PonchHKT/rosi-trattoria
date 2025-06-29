import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Clock,
  Star,
} from "lucide-react";
import ReactGA from "react-ga4";
import "./footer.scss";

const Footer: React.FC = () => {
  const [emailCopied, setEmailCopied] = useState(false);

  // Détection du mois d'août
  const isAugust = () => {
    const forceAugustSchedule = false; // Temporary flag to force August schedule
    if (forceAugustSchedule) {
      return true; // Force August schedule
    }
    const currentMonth = new Date().getMonth();
    return currentMonth === 7; // Août = index 7 (0-indexed)
  };

  // Fonction pour tracker les événements GA
  const trackEvent = (action: string, label?: string, value?: number) => {
    ReactGA.event({
      category: "Footer",
      action: action,
      label: label,
      value: value,
    });
  };

  // Fonction pour copier l'email avec tracking
  const copyEmailToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    const email = "rosi.trattoria@gmail.com";

    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);

      // Track l'événement de copie d'email
      trackEvent("Email Copy", "Footer Email Copied");

      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setEmailCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de la copie de l'email:", err);
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setEmailCopied(true);
      trackEvent("Email Copy", "Footer Email Copied (Fallback)");

      setTimeout(() => {
        setEmailCopied(false);
      }, 3000);
    }
  };

  // Handler pour les liens sociaux
  const handleSocialClick = (platform: string) => {
    trackEvent("Social Media Click", `Footer ${platform}`);
  };

  // Handler pour les liens de contact
  const handleContactClick = (contactType: string) => {
    trackEvent("Contact Click", `Footer ${contactType}`);
  };

  // Handler pour les liens de navigation
  const handleNavClick = (page: string) => {
    trackEvent("Navigation Click", `Footer Nav - ${page}`);
  };

  // Handler pour les liens légaux
  const handleLegalClick = (linkType: string) => {
    trackEvent("Legal Link Click", `Footer ${linkType}`);
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top-border" aria-hidden="true"></div>

      <div className="footer__container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__brand-content">
              <img
                src="/images/logo/rositrattorialogo.png"
                alt="Logo Rosi Trattoria - Restaurant italien authentique à Brive-la-Gaillarde"
                className="footer__logo"
                width="120"
                height="80"
              />
              <div
                className="footer__rating"
                role="img"
                aria-label="5 étoiles sur 5"
              >
                <Star className="footer__star" aria-hidden="true" />
                <Star className="footer__star" aria-hidden="true" />
                <Star className="footer__star" aria-hidden="true" />
                <Star className="footer__star" aria-hidden="true" />
                <Star className="footer__star" aria-hidden="true" />
              </div>
            </div>

            <h2 className="footer__slogan">Rosi Trattoria</h2>

            <p className="footer__description">
              Une expérience culinaire authentique où chaque plat raconte
              l'histoire de la tradition italienne avec une touche de modernité.
            </p>

            <div className="footer__social">
              <h3 className="footer__social-title">Suivez-nous</h3>
              <div className="footer__social-buttons">
                <a
                  href="https://www.facebook.com/ROSI.TRATTORIA/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-btn footer__social-btn--facebook"
                  aria-label="Suivez Rosi Trattoria sur Facebook"
                  title="Page Facebook du restaurant Rosi Trattoria"
                  onClick={() => handleSocialClick("Facebook")}
                >
                  <Facebook aria-hidden="true" />
                </a>
                <a
                  href="https://www.instagram.com/rosi.trattoria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-btn footer__social-btn--instagram"
                  aria-label="Suivez Rosi Trattoria sur Instagram"
                  title="Compte Instagram du restaurant Rosi Trattoria"
                  onClick={() => handleSocialClick("Instagram")}
                >
                  <Instagram aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <address className="footer__contact">
            <h3 className="footer__section-title">Contact & Informations</h3>
            <div className="footer__contact-list">
              <div className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--location">
                  <MapPin aria-hidden="true" />
                </div>
                <div className="footer__contact-details">
                  <a
                    href="https://maps.google.com/?q=11asteroid:11+Prom.+des+Tilleuls,+19100+Brive-la-Gaillarde"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Localiser Rosi Trattoria sur Google Maps"
                    aria-label="Adresse du restaurant : 11 Promenade des Tilleuls, Brive-la-Gaillarde"
                    onClick={() => handleContactClick("Address")}
                  >
                    <span itemProp="streetAddress">11 Prom. des Tilleuls</span>
                    <br />
                    <span itemProp="postalCode">19100</span>{" "}
                    <span itemProp="addressLocality">Brive-la-Gaillarde</span>
                  </a>
                </div>
              </div>

              <div className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--phone">
                  <Phone aria-hidden="true" />
                </div>
                <div className="footer__contact-details">
                  <a
                    href="tel:0544314447"
                    title="Appeler pour réserver une table au restaurant Rosi Trattoria"
                    aria-label="Téléphone : 05 44 31 44 47"
                    itemProp="telephone"
                    onClick={() => handleContactClick("Phone")}
                  >
                    05 44 31 44 47
                  </a>
                </div>
              </div>

              <div className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--email">
                  <Mail aria-hidden="true" />
                </div>
                <div className="footer__contact-details">
                  <div className="footer__email-container">
                    <a
                      href="#"
                      onClick={copyEmailToClipboard}
                      className="footer__email-link"
                      title="Cliquer pour copier l'adresse email du restaurant"
                      aria-label="Email : rosi.trattoria@gmail.com - Cliquer pour copier"
                    >
                      <span itemProp="email">rosi.trattoria@gmail.com</span>
                    </a>
                    {emailCopied && (
                      <div
                        className="footer__email-notification"
                        role="status"
                        aria-live="polite"
                      >
                        <span>Copié dans le presse-papiers</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--hours">
                  <Clock aria-hidden="true" />
                </div>
                <div className="footer__contact-details">
                  <div className="footer__hours-list" itemProp="openingHours">
                    {isAugust() ? (
                      <>
                        <div className="footer__hours-item">
                          <span className="footer__hours-day">Lundi-Jeudi</span>
                          <span className="footer__hours-time">
                            12h00-13h30 / 18h30-21h30
                          </span>
                        </div>
                        <div className="footer__hours-item">
                          <span className="footer__hours-day">
                            Vendredi-Samedi
                          </span>
                          <span className="footer__hours-time">
                            12h00-13h30 / 18h30-22h00
                          </span>
                        </div>
                        <div className="footer__hours-item">
                          <span className="footer__hours-day">Dimanche</span>
                          <span className="footer__hours-closed">Fermé</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="footer__hours-item">
                          <span className="footer__hours-day">Mardi-Jeudi</span>
                          <span className="footer__hours-time">
                            12h00-14h00 / 18h30-21h30
                          </span>
                        </div>
                        <div className="footer__hours-item">
                          <span className="footer__hours-day">
                            Vendredi-Samedi
                          </span>
                          <span className="footer__hours-time">
                            12h00-14h00 / 18h30-22h30
                          </span>
                        </div>
                        <div className="footer__hours-item">
                          <span className="footer__hours-day">
                            Lundi, Dimanche
                          </span>
                          <span className="footer__hours-closed">Fermé</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </address>

          <div className="footer__navigation">
            <h3 className="footer__section-title">Navigation</h3>
            <nav
              className="footer__nav-links"
              aria-label="Navigation secondaire"
            >
              <a
                href="/"
                className="footer__nav-link"
                title="Retour à l'accueil du restaurant Rosi Trattoria"
                onClick={() => handleNavClick("Accueil")}
              >
                Accueil
              </a>
              <a
                href="/nos-valeurs"
                className="footer__nav-link"
                title="Découvrez nos valeurs et nos engagements qualité"
                onClick={() => handleNavClick("Nos valeurs")}
              >
                Nos valeurs
              </a>
              <a
                href="/carte"
                className="footer__nav-link"
                title="Consultez notre carte de spécialités italiennes"
                onClick={() => handleNavClick("Carte")}
              >
                Carte
              </a>
              <a
                href="/recrutement"
                className="footer__nav-link"
                title="Rejoignez l'équipe du restaurant Rosi Trattoria"
                onClick={() => handleNavClick("Recrutement")}
              >
                Recrutement
              </a>
              <a
                href="/contact"
                className="footer__nav-link"
                title="Contactez-nous pour des renseignements"
                onClick={() => handleNavClick("Contact")}
              >
                Contact
              </a>
            </nav>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © {new Date().getFullYear()} Rosi Trattoria - Restaurant italien à
              Brive-la-Gaillarde. Tous droits réservés.
            </p>

            <nav className="footer__legal-links" aria-label="Liens légaux">
              <a
                href="https://carte.rosi-trattoria.com/info/legal-notice"
                className="footer__legal-link"
                target="_blank"
                rel="noopener noreferrer"
                title="Consulter les mentions légales"
                onClick={() => handleLegalClick("Mentions légales")}
              >
                Mentions légales
              </a>
              <a
                href="https://carte.rosi-trattoria.com/info/terms"
                className="footer__legal-link"
                target="_blank"
                rel="noopener noreferrer"
                title="Conditions générales de vente"
                onClick={() => handleLegalClick("CGV")}
              >
                CGV
              </a>
              <a
                href="https://carte.rosi-trattoria.com/info/privacy-policy"
                className="footer__legal-link"
                target="_blank"
                rel="noopener noreferrer"
                title="Politique de confidentialité et gestion des cookies"
                onClick={() => handleLegalClick("Gestion des cookies")}
              >
                Gestion des cookies
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
