import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import ReactGA from "react-ga4"; // Import Google Analytics
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
  const [recaptchaError, setRecaptchaError] = useState<string>("");

  // États pour la protection anti-spam
  const [dernierEnvoi, setDernierEnvoi] = useState<number>(0);
  const [nombreEnvois, setNombreEnvois] = useState<number>(0);
  const [tempsAttente, setTempsAttente] = useState<number>(0);
  const [honeypot, setHoneypot] = useState<string>("");
  const [tempsDebutFormulaire, setTempsDebutFormulaire] = useState<number>(0);

  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Configuration anti-spam - Modifiée pour 1 message toutes les 30 minutes
  const DELAI_MINIMUM = 1800000; // 30 minutes entre chaque envoi (30 * 60 * 1000)
  const LIMITE_ENVOIS_HEURE = 1; // Max 1 envoi par 30 minutes
  const TEMPS_MIN_REMPLISSAGE = 10000; // Minimum 10 secondes pour remplir le formulaire

  // Configuration reCAPTCHA - Fixed for client-side
  const RECAPTCHA_SITE_KEY =
    import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
    "6Lci8WkrAAAAANN_t2CvAUffkWLACJl73-PfAKCD";

  useEffect(() => {
    // Google Analytics - Track page view for contact page
    ReactGA.send({
      hitType: "pageview",
      page: "/contact",
      title: "Contact - Rosi Trattoria",
    });

    // Récupérer les données de limitation depuis localStorage
    try {
      const dernierEnvoiStocke = localStorage.getItem("dernierEnvoiContact");
      const envoissStockes = localStorage.getItem("envoissContact");

      if (dernierEnvoiStocke) {
        setDernierEnvoi(parseInt(dernierEnvoiStocke));
      }

      if (envoissStockes) {
        const envois = JSON.parse(envoissStockes);
        // Filtrer les envois des dernières 30 minutes
        const maintenant = Date.now();
        const envoisDernieres30Min = envois.filter(
          (timestamp: number) => maintenant - timestamp < DELAI_MINIMUM
        );
        setNombreEnvois(envoisDernieres30Min.length);
        localStorage.setItem(
          "envoissContact",
          JSON.stringify(envoisDernieres30Min)
        );
      }
    } catch (error) {
      console.warn("Erreur lors de la lecture du localStorage:", error);
    }

    // Marquer le début du remplissage du formulaire
    setTempsDebutFormulaire(Date.now());

    // Décompte pour le délai d'attente
    const interval = setInterval(() => {
      const maintenant = Date.now();
      const tempsRestant = Math.max(
        0,
        DELAI_MINIMUM - (maintenant - dernierEnvoi)
      );
      setTempsAttente(tempsRestant);
    }, 1000);

    return () => clearInterval(interval);
  }, [dernierEnvoi]);

  const gererChangementInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Google Analytics - Track form interaction
    ReactGA.event({
      action: "form_interact",
      category: "Contact Form",
      label: e.target.name,
    });
  };

  const gererRecaptcha = (token: string | null) => {
    setRecaptchaToken(token);
    setRecaptchaError("");

    // Google Analytics - Track reCAPTCHA completion
    if (token) {
      ReactGA.event({
        action: "recaptcha_completed",
        category: "Contact Form",
        label: "reCAPTCHA Success",
      });
    }
  };

  const gererErreurRecaptcha = () => {
    setRecaptchaError(
      "Erreur lors du chargement du reCAPTCHA. Veuillez recharger la page."
    );
    setRecaptchaToken(null);

    // Google Analytics - Track reCAPTCHA error
    ReactGA.event({
      action: "recaptcha_error",
      category: "Contact Form",
      label: "reCAPTCHA Error",
    });
  };

  const gererExpirationRecaptcha = () => {
    setRecaptchaToken(null);
    setRecaptchaError("Le reCAPTCHA a expiré. Veuillez le refaire.");

    // Google Analytics - Track reCAPTCHA expiration
    ReactGA.event({
      action: "recaptcha_expired",
      category: "Contact Form",
      label: "reCAPTCHA Expired",
    });
  };

  const gererHoneypot = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoneypot(e.target.value);
  };

  const validerAntiSpam = (): { valide: boolean; message: string } => {
    const maintenant = Date.now();

    // Vérifier le honeypot (champ caché)
    if (honeypot.length > 0) {
      // Google Analytics - Track spam attempt
      ReactGA.event({
        action: "spam_detected",
        category: "Contact Form",
        label: "Honeypot Triggered",
      });
      return {
        valide: false,
        message: "Détection de spam - formulaire rejeté.",
      };
    }

    // Vérifier le temps minimum de remplissage
    if (maintenant - tempsDebutFormulaire < TEMPS_MIN_REMPLISSAGE) {
      return {
        valide: false,
        message:
          "Veuillez prendre le temps de remplir correctement le formulaire.",
      };
    }

    // Vérifier le délai entre les envois (30 minutes)
    if (maintenant - dernierEnvoi < DELAI_MINIMUM) {
      const tempsRestantMin = Math.ceil(
        (DELAI_MINIMUM - (maintenant - dernierEnvoi)) / 60000
      );
      return {
        valide: false,
        message: `Veuillez patienter ${tempsRestantMin} minute(s) avant d'envoyer un nouveau message.`,
      };
    }

    // Vérifier la limite d'envois (1 par 30 minutes)
    if (nombreEnvois >= LIMITE_ENVOIS_HEURE) {
      return {
        valide: false,
        message:
          "Limite d'envois atteinte. Veuillez réessayer dans 30 minutes.",
      };
    }

    // Vérifications de contenu basiques
    const messageWords = formData.message.toLowerCase().split(" ");
    const spamKeywords = [
      "viagra",
      "casino",
      "loan",
      "credit",
      "money",
      "bitcoin",
      "crypto",
    ];
    const hasSpamKeywords = spamKeywords.some((keyword) =>
      messageWords.some((word) => word.includes(keyword))
    );

    if (hasSpamKeywords) {
      // Google Analytics - Track spam content
      ReactGA.event({
        action: "spam_detected",
        category: "Contact Form",
        label: "Spam Keywords",
      });
      return {
        valide: false,
        message: "Contenu détecté comme potentiellement indésirable.",
      };
    }

    // Vérifier la répétition excessive de caractères
    const hasExcessiveRepetition = /(.)\1{4,}/.test(formData.message);
    if (hasExcessiveRepetition) {
      return { valide: false, message: "Format de message non valide." };
    }

    // Vérifier si le message est trop court ou trop générique
    if (formData.message.trim().length < 10) {
      return {
        valide: false,
        message: "Veuillez écrire un message plus détaillé.",
      };
    }

    return { valide: true, message: "" };
  };

  const envoyerEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    // Google Analytics - Track form submission attempt
    ReactGA.event({
      action: "form_submit_attempt",
      category: "Contact Form",
      label: "Form Submission Started",
    });

    // Vérification du reCAPTCHA
    if (!recaptchaToken) {
      setMessageStatut("Veuillez compléter le reCAPTCHA.");
      ReactGA.event({
        action: "form_submit_failed",
        category: "Contact Form",
        label: "Missing reCAPTCHA",
      });
      return;
    }

    // Vérifications anti-spam
    const validationAntiSpam = validerAntiSpam();
    if (!validationAntiSpam.valide) {
      setMessageStatut(validationAntiSpam.message);
      ReactGA.event({
        action: "form_submit_failed",
        category: "Contact Form",
        label: "Anti-spam Validation Failed",
      });
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
        "g-recaptcha-response": recaptchaToken, // Clé spécifique pour EmailJS
        timestamp: new Date().toISOString(), // Horodatage pour traçabilité
      };

      await emailjs.send(
        "service_21e0t58",
        "template_p6yid04",
        templateParams,
        "d0C2DCxhev8b3vXks"
      );

      // Mettre à jour les données anti-spam
      const maintenant = Date.now();
      setDernierEnvoi(maintenant);

      try {
        localStorage.setItem("dernierEnvoiContact", maintenant.toString());

        const envoissStockes = localStorage.getItem("envoissContact");
        const envois = envoissStockes ? JSON.parse(envoissStockes) : [];
        envois.push(maintenant);
        localStorage.setItem("envoissContact", JSON.stringify(envois));
        setNombreEnvois(envois.length);
      } catch (error) {
        console.warn("Erreur lors de la sauvegarde dans localStorage:", error);
      }

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

      // Redémarrer le compteur de temps de remplissage
      setTempsDebutFormulaire(Date.now());

      // Google Analytics - Track successful form submission
      ReactGA.event({
        action: "form_submit_success",
        category: "Contact Form",
        label: "Message Sent Successfully",
        value: 1,
      });

      // Google Analytics - Track conversion
      ReactGA.event({
        action: "contact_conversion",
        category: "Conversions",
        label: "Contact Form Submission",
        value: 1,
      });
    } catch (error) {
      setMessageStatut("Erreur lors de l'envoi. Veuillez réessayer.");
      console.error("Erreur EmailJS:", error);

      // Google Analytics - Track form submission error
      ReactGA.event({
        action: "form_submit_error",
        category: "Contact Form",
        label: "EmailJS Error",
      });
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const peutEnvoyer =
    recaptchaToken && tempsAttente === 0 && nombreEnvois < LIMITE_ENVOIS_HEURE;

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

            {/* Affichage des limitations actives */}
            {(tempsAttente > 0 || nombreEnvois >= LIMITE_ENVOIS_HEURE) && (
              <div className="rate-limit-info" role="alert">
                {tempsAttente > 0 && (
                  <p>
                    ⏱️ Prochain envoi possible dans{" "}
                    {Math.ceil(tempsAttente / 60000)} minute(s)
                  </p>
                )}
                {nombreEnvois >= LIMITE_ENVOIS_HEURE && (
                  <p>⚠️ Limite d'envois atteinte (1 message par 30 minutes)</p>
                )}
              </div>
            )}

            <form
              ref={formRef}
              onSubmit={envoyerEmail}
              className="contact-form"
              role="form"
              aria-label="Formulaire de contact restaurant Rosi Trattoria"
              noValidate
            >
              {/* Honeypot - champ caché pour piéger les bots */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={gererHoneypot}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  opacity: 0,
                  pointerEvents: "none",
                }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

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
                  (minimum 10 caractères)
                </div>
              </div>

              {/* Section reCAPTCHA avec gestion d'erreur améliorée */}
              <div
                className="recaptcha-container"
                role="group"
                aria-label="Vérification de sécurité"
              >
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={gererRecaptcha}
                  onErrored={gererErreurRecaptcha}
                  onExpired={gererExpirationRecaptcha}
                  theme="dark"
                  aria-label="Captcha de vérification anti-spam"
                />
                {recaptchaError && (
                  <div className="recaptcha-error" role="alert">
                    {recaptchaError}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={envoiEnCours || !peutEnvoyer}
                className={`submit-button ${envoiEnCours ? "loading" : ""} ${
                  !peutEnvoyer ? "disabled" : ""
                }`}
                aria-describedby="submit-help"
              >
                {envoiEnCours ? "Envoi en cours..." : "Envoyer le message"}
                {nombreEnvois > 0 && nombreEnvois < LIMITE_ENVOIS_HEURE && (
                  <span className="send-count"> ({nombreEnvois}/1)</span>
                )}
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

        {/* Section carte avec iframe mise à jour */}
        <section className="map-section" aria-labelledby="location-title">
          <h2 id="location-title" className="sr-only">
            Localisation et informations de contact
          </h2>

          <div
            role="application"
            aria-label="Carte interactive de localisation Rosi Trattoria"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2885.1497959411446!2d1.530847!3d45.1632151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47fb23c72d5c6f01%3A0xdd18d96369f9f106!2sRosi%20Trattoria!5e0!3m2!1sfr!2sfr!4v1640995200000!5m2!1sfr!2sfr"
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
                  onClick={() => {
                    // Google Analytics - Track phone click
                    ReactGA.event({
                      action: "phone_click",
                      category: "Contact",
                      label: "Phone Number Clicked",
                    });
                  }}
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
                  onClick={() => {
                    // Google Analytics - Track email click
                    ReactGA.event({
                      action: "email_click",
                      category: "Contact",
                      label: "Email Address Clicked",
                    });
                  }}
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
