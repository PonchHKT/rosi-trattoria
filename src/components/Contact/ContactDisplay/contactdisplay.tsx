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
  const [fichier, setFichier] = useState<File | null>(null);
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

  const gererChangementFichier = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFichier(e.target.files[0]);
    }
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
        attachment: fichier ? fichier.name : "Aucun fichier",
        recaptcha_token: recaptchaToken, // Inclure le token reCAPTCHA
      };

      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams,
        "YOUR_PUBLIC_KEY"
      );

      setMessageStatut("Message envoyé avec succès !");
      setFormData({ nom: "", email: "", telephone: "", message: "" });
      setFichier(null);
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
    <div className="contact-container">
      <div className="contact-content">
        {/* Section informations restaurant */}
        <div className="restaurant-info">
          <div className="logo-container">
            <img
              src="/images/logo/rositrattorialogo.png"
              alt="Rosi Trattoria Logo"
              className="restaurant-logo"
            />
          </div>

          <div className="restaurant-slogan">
            <p>FRAICHEUR • QUALITÉ • AUTHENTICITÉ</p>
            <span>100% ITALIANO</span>
          </div>
        </div>

        {/* Section formulaire */}
        <div className="form-section">
          <div className="form-container">
            <h2 className="form-title">Envoyez-nous un message</h2>
            <p className="form-description">
              Nous vous répondrons dans les plus brefs délais
            </p>

            <form
              ref={formRef}
              onSubmit={envoyerEmail}
              className="contact-form"
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
                  />
                  <label htmlFor="nom">Nom complet *</label>
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
                  />
                  <label htmlFor="email">Email *</label>
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
                />
                <label htmlFor="telephone">Téléphone</label>
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
                />
                <label htmlFor="message">Message *</label>
              </div>

              {/* Section fichier et reCAPTCHA côte à côte */}
              <div className="file-recaptcha-row">
                <div className="file-upload">
                  <input
                    type="file"
                    id="fichier"
                    onChange={gererChangementFichier}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="fichier" className="file-label">
                    📎 {fichier ? fichier.name : "Joindre un fichier"}
                  </label>
                </div>

                <div className="recaptcha-container">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LdPjGgrAAAAAHrHRpF9Y7p4Yd-pUfbqxqksIZcL"
                    onChange={gererRecaptcha}
                    theme="dark"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={envoiEnCours || !recaptchaToken}
                className={`submit-button ${envoiEnCours ? "loading" : ""}`}
              >
                {envoiEnCours ? "Envoi en cours..." : "Envoyer le message"}
              </button>

              {messageStatut && (
                <div
                  className={`status-message ${
                    messageStatut.includes("succès") ? "success" : "error"
                  }`}
                >
                  {messageStatut}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Section carte - maintenant séparée */}
        <div className="map-section">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11252.717959411446!2d1.532797!3d45.1632151!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xdd18d96369f9f106!2srosi%20trattoria!5e0!3m2!1sfr!2sfr!4v1617693056541!5m2!1sfr!2sfr"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation Rosi Trattoria"
          />

          <div className="contact-details">
            <div className="contact-item">
              <svg
                className="contact-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="currentColor"
                />
              </svg>
              <div className="contact-text">
                <span>11 Prom. des Tilleuls</span>
                <span>19100 Brive-la-Gaillarde</span>
              </div>
            </div>

            <div className="contact-item">
              <svg
                className="contact-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  fill="currentColor"
                />
              </svg>
              <div className="contact-text">
                <span>05 44 31 44 47</span>
              </div>
            </div>

            <div className="contact-item">
              <svg
                className="contact-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  fill="currentColor"
                />
              </svg>
              <div className="contact-text">
                <span>rosi.trattoria@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDisplay;
