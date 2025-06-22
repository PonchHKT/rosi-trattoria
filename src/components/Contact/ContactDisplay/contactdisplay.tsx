import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import "./contactdisplay.scss";

const ContactDisplay: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
  });
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [messageStatut, setMessageStatut] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const gererChangementInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const gererRecaptcha = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const envoyerEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification du reCAPTCHA
    if (!recaptchaToken) {
      setMessageStatut("Veuillez compléter le reCAPTCHA.");
      return;
    }

    setEnvoiEnCours(true);
    setMessageStatut("");

    try {
      const templateParams = {
        from_name: formData.nom,
        from_email: formData.email,
        phone: formData.telephone,
        message: formData.message,
        recaptcha_token: recaptchaToken, // Inclure le token reCAPTCHA
      };

      await emailjs.send(
        "service_ztf35le",
        "template_4w4gtfs",
        templateParams,
        "r_5JMJ3LhgcI_AKOW"
      );

      setMessageStatut("Message envoyé avec succès !");
      setFormData({ nom: "", email: "", telephone: "", message: "" });
      setRecaptchaToken(null);

      // Reset du formulaire et du reCAPTCHA
      if (formRef.current) {
        formRef.current.reset();
      }
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (error) {
      setMessageStatut("Erreur lors de l'envoi. Veuillez réessayer.");
      console.error("Erreur EmailJS:", error);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <main className="contact-container" role="main">
      <div className="contact-content">
        {/* Section informations restaurant */}
        <header
          className="restaurant-info"
          itemScope
          itemType="https://schema.org/Restaurant"
        >
          <div className="logo-container">
            <img
              src="/images/logo/rositrattorialogo.png"
              alt="Logo du restaurant italien Rosi Trattoria à Brive-la-Gaillarde"
              className="restaurant-logo"
              itemProp="logo"
              width="150"
              height="150"
              loading="eager"
            />
          </div>

          <div className="restaurant-slogan">
            <p itemProp="slogan">FRAICHEUR • QUALITÉ • AUTHENTICITÉ</p>
            <span itemProp="servesCuisine" content="Italian">
              100% ITALIANO
            </span>
          </div>

          {/* Données structurées invisibles pour le restaurant */}
          <div
            style={{ display: "none" }}
            itemScope
            itemType="https://schema.org/Restaurant"
          >
            <span itemProp="name">Rosi Trattoria</span>
            <span itemProp="servesCuisine">Italian</span>
            <div
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <span itemProp="streetAddress">11 Promenade des Tilleuls</span>
              <span itemProp="addressLocality">Brive-la-Gaillarde</span>
              <span itemProp="postalCode">19100</span>
              <span itemProp="addressCountry">FR</span>
            </div>
            <span itemProp="telephone">05 44 31 44 47</span>
            <span itemProp="email">rosi.trattoria@gmail.com</span>
          </div>
        </header>

        {/* Section formulaire */}
        <section className="form-section" aria-labelledby="contact-form-title">
          <div className="form-container">
            <h1 id="contact-form-title" className="form-title">
              Envoyez-nous un message
            </h1>
            <p className="form-description">
              Nous vous répondrons dans les plus brefs délais
            </p>

            <form
              ref={formRef}
              onSubmit={envoyerEmail}
              className="contact-form"
              role="form"
              aria-label="Formulaire de contact restaurant Rosi Trattoria"
              noValidate
            >
              <div className="form-row">
                <div className="input-group">
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={gererChangementInput}
                    required
                    placeholder=" "
                    aria-describedby="nom-help"
                    autoComplete="name"
                  />
                  <label htmlFor="nom">Nom complet *</label>
                  <div id="nom-help" className="sr-only">
                    Saisissez votre nom complet pour la réservation
                  </div>
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={gererChangementInput}
                    required
                    placeholder=" "
                    aria-describedby="email-help"
                    autoComplete="email"
                  />
                  <label htmlFor="email">Email *</label>
                  <div id="email-help" className="sr-only">
                    Votre adresse email pour vous répondre
                  </div>
                </div>
              </div>

              <div className="input-group">
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={gererChangementInput}
                  placeholder=" "
                  aria-describedby="tel-help"
                  autoComplete="tel"
                />
                <label htmlFor="telephone">Téléphone</label>
                <div id="tel-help" className="sr-only">
                  Numéro de téléphone optionnel pour vous contacter
                </div>
              </div>

              <div className="input-group">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={gererChangementInput}
                  required
                  rows={5}
                  placeholder=" "
                  aria-describedby="message-help"
                />
                <label htmlFor="message">Message *</label>
                <div id="message-help" className="sr-only">
                  Votre message : réservation, question ou demande spéciale
                </div>
              </div>

              {/* Section reCAPTCHA */}
              <div
                className="recaptcha-container"
                role="group"
                aria-label="Vérification de sécurité"
              >
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LdPjGgrAAAAAHrHRpF9Y7p4Yd-pUfbqxqksIZcL"
                  onChange={gererRecaptcha}
                  theme="dark"
                  aria-label="Captcha de vérification anti-spam"
                />
              </div>

              <button
                type="submit"
                disabled={envoiEnCours || !recaptchaToken}
                className={`submit-button ${envoiEnCours ? "loading" : ""}`}
                aria-describedby="submit-help"
              >
                {envoiEnCours ? "Envoi en cours..." : "Envoyer le message"}
              </button>
              <div id="submit-help" className="sr-only">
                Envoyer votre message à Rosi Trattoria. Réponse sous 2 heures en
                période d'ouverture.
              </div>

              {messageStatut && (
                <div
                  className={`status-message ${
                    messageStatut.includes("succès") ? "success" : "error"
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {messageStatut}
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Section carte - maintenant séparée */}
        <section className="map-section" aria-labelledby="location-title">
          <h2 id="location-title" className="sr-only">
            Localisation et informations de contact
          </h2>

          <div
            role="application"
            aria-label="Carte interactive de localisation Rosi Trattoria"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11252.717959411446!2d1.532797!3d45.1632151!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xdd18d96369f9f106!2srosi%20trattoria!5e0!3m2!1sfr!2sfr!4v1617693056541!5m2!1sfr!2sfr"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte de localisation de Rosi Trattoria à Brive-la-Gaillarde, 11 Promenade des Tilleuls"
              aria-label="Carte Google Maps montrant l'emplacement de Rosi Trattoria"
            />
          </div>

          <address
            className="contact-details"
            itemScope
            itemType="https://schema.org/Restaurant"
          >
            <h3 className="sr-only">Coordonnées de contact</h3>

            <div
              className="contact-item"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <svg
                className="contact-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="currentColor"
                />
              </svg>
              <div className="contact-text">
                <span itemProp="streetAddress">11 Prom. des Tilleuls</span>
                <span>
                  <span itemProp="postalCode">19100</span>{" "}
                  <span itemProp="addressLocality">Brive-la-Gaillarde</span>
                </span>
                <meta itemProp="addressCountry" content="FR" />
              </div>
            </div>

            <div className="contact-item">
              <svg
                className="contact-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  fill="currentColor"
                />
              </svg>
              <div className="contact-text">
                <a
                  href="tel:+33544314447"
                  itemProp="telephone"
                  aria-label="Appeler Rosi Trattoria au 05 44 31 44 47 pour réserver"
                >
                  05 44 31 44 47
                </a>
              </div>
            </div>

            <div className="contact-item">
              <svg
                className="contact-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  fill="currentColor"
                />
              </svg>
              <div className="contact-text">
                <a
                  href="mailto:rosi.trattoria@gmail.com"
                  itemProp="email"
                  aria-label="Envoyer un email à Rosi Trattoria"
                >
                  rosi.trattoria@gmail.com
                </a>
              </div>
            </div>

            {/* Métadonnées cachées pour le SEO */}
            <meta itemProp="name" content="Rosi Trattoria" />
            <meta itemProp="servesCuisine" content="Italian" />
            <meta itemProp="priceRange" content="€€" />
            <div
              itemProp="geo"
              itemScope
              itemType="https://schema.org/GeoCoordinates"
            >
              <meta itemProp="latitude" content="45.1632151" />
              <meta itemProp="longitude" content="1.532797" />
            </div>
          </address>
        </section>
      </div>
    </main>
  );
};

export default ContactDisplay;
