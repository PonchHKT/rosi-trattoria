import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Clock,
  Heart,
  Star,
} from "lucide-react";
import "./footer.scss";

interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  likes?: {
    summary: {
      total_count: number;
    };
  };
  attachments?: {
    data: Array<{
      media?: {
        image?: {
          src: string;
        };
      };
    }>;
  };
  isApiWaiting?: boolean; // Nouveau champ pour identifier les posts en attente
}

interface FacebookResponse {
  data: FacebookPost[];
  error?: any;
}

const Footer: React.FC = () => {
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailCopied, setEmailCopied] = useState(false);

  // Détection du mois d'août
  const isAugust = () => {
    const currentMonth = new Date().getMonth();
    return currentMonth === 7; // Août = index 7 (0-indexed)
  };

  // Fonction pour copier l'email
  const copyEmailToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    const email = "rosi.trattoria@gmail.com";

    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);

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
      setTimeout(() => {
        setEmailCopied(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const initFacebookSDK = () => {
      if (typeof window !== "undefined" && (window as any).FB) {
        (window as any).FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });

        loadFacebookPosts();
      }
    };

    if (!(window as any).FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/fr_FR/sdk.js";
      script.async = true;
      script.defer = true;
      script.onload = initFacebookSDK;
      document.head.appendChild(script);
    } else {
      initFacebookSDK();
    }
  }, []);

  const loadFacebookPosts = () => {
    if (!(window as any).FB) return;

    const pageId = "ROSI.TRATTORIA";

    (window as any).FB.api(
      `/${pageId}/feed`,
      "GET",
      {
        fields:
          "id,message,story,created_time,likes.summary(true),attachments{media}",
        limit: 3,
        access_token: import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN,
      },
      (response: FacebookResponse) => {
        if (response && !response.error) {
          setFacebookPosts(response.data || []);
        } else {
          console.error(
            "Erreur lors du chargement des posts Facebook:",
            response.error
          );
          // Posts avec animation de chargement
          setFacebookPosts([
            {
              id: "1",
              message: "Awaiting API Request TOKEN...",
              created_time: "2025-06-11T10:00:00Z",
              likes: { summary: { total_count: 0 } },
              isApiWaiting: true,
            },
            {
              id: "2",
              message: "Awaiting API Request TOKEN...",
              created_time: "2025-06-11T15:30:00Z",
              likes: { summary: { total_count: 0 } },
              isApiWaiting: true,
            },
            {
              id: "3",
              message: "Awaiting API Request TOKEN...",
              created_time: "2025-06-11T20:00:00Z",
              likes: { summary: { total_count: 0 } },
              isApiWaiting: true,
            },
          ]);
        }
        setLoading(false);
      }
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const getPostContent = (post: FacebookPost) => {
    return post.message || post.story || "Nouveau post sur notre page Facebook";
  };

  const getPostImage = (post: FacebookPost) => {
    return post.attachments?.data?.[0]?.media?.image?.src;
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
                    href="https://maps.google.com/?q=11+Prom.+des+Tilleuls,+19100+Brive-la-Gaillarde"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Localiser Rosi Trattoria sur Google Maps"
                    aria-label="Adresse du restaurant : 11 Promenade des Tilleuls, Brive-la-Gaillarde"
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
                    <div className="footer__hours-item">
                      <span className="footer__hours-day">
                        {isAugust()
                          ? "Lun-Mar-Mer-Jeu"
                          : "Mardi-Mercredi-Jeudi"}
                      </span>
                      <span className="footer__hours-time">
                        12h-14h / 19h-21h30
                      </span>
                    </div>
                    <div className="footer__hours-item">
                      <span className="footer__hours-day">Vendredi-Samedi</span>
                      <span className="footer__hours-time">
                        12h-14h / 19h-22h30
                      </span>
                    </div>
                    <div className="footer__hours-item">
                      <span className="footer__hours-day">
                        {isAugust() ? "Dimanche" : "Lundi, Dimanche"}
                      </span>
                      <span className="footer__hours-closed">Fermé</span>
                    </div>
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
              >
                Accueil
              </a>
              <a
                href="/nos-valeurs"
                className="footer__nav-link"
                title="Découvrez nos valeurs et nos engagements qualité"
              >
                Nos valeurs
              </a>
              <a
                href="/carte"
                className="footer__nav-link"
                title="Consultez notre carte de spécialités italiennes"
              >
                Carte
              </a>
              <a
                href="/recrutement"
                className="footer__nav-link"
                title="Rejoignez l'équipe du restaurant Rosi Trattoria"
              >
                Recrutement
              </a>
              <a
                href="/contact"
                className="footer__nav-link"
                title="Contactez-nous pour des renseignements"
              >
                Contact
              </a>
            </nav>
          </div>

          <aside className="footer__facebook">
            <h3 className="footer__section-title footer__facebook-title">
              <Facebook aria-hidden="true" />
              <span>Derniers posts Facebook</span>
            </h3>

            <div className="footer__facebook-posts">
              {loading ? (
                <div className="footer__facebook-loading" aria-live="polite">
                  Chargement des dernières actualités...
                </div>
              ) : (
                facebookPosts.map((post) => (
                  <article
                    key={post.id}
                    className={`footer__facebook-post ${
                      post.isApiWaiting
                        ? "footer__facebook-post--api-waiting"
                        : ""
                    }`}
                  >
                    {getPostImage(post) && (
                      <img
                        src={getPostImage(post)}
                        alt="Publication Facebook de Rosi Trattoria"
                        className="footer__facebook-image"
                        loading="lazy"
                      />
                    )}
                    <p
                      className={`footer__facebook-content ${
                        post.isApiWaiting
                          ? "footer__facebook-content--loading"
                          : ""
                      }`}
                    >
                      {getPostContent(post)}
                    </p>
                    <div className="footer__facebook-meta">
                      <time
                        className={`footer__facebook-date ${
                          post.isApiWaiting
                            ? "footer__facebook-date--loading"
                            : ""
                        }`}
                        dateTime={post.created_time}
                      >
                        {formatDate(post.created_time)}
                      </time>
                      <div
                        className={`footer__facebook-likes ${
                          post.isApiWaiting
                            ? "footer__facebook-likes--loading"
                            : ""
                        }`}
                        aria-label={`${
                          post.likes?.summary?.total_count || 0
                        } j'aime`}
                      >
                        <Heart aria-hidden="true" />
                        <span>{post.likes?.summary?.total_count || 0}</span>
                      </div>
                    </div>
                  </article>
                ))
              )}

              <a
                href="https://www.facebook.com/ROSI.TRATTORIA/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__facebook-link"
                title="Voir toutes nos publications sur Facebook"
                aria-label="Accéder à la page Facebook complète de Rosi Trattoria"
              >
                <span>Voir plus sur Facebook</span>
                <Facebook aria-hidden="true" />
              </a>
            </div>
          </aside>
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
              >
                Mentions légales
              </a>
              <a
                href="https://carte.rosi-trattoria.com/info/terms"
                className="footer__legal-link"
                target="_blank"
                rel="noopener noreferrer"
                title="Conditions générales de vente"
              >
                CGV
              </a>
              <a
                href="https://carte.rosi-trattoria.com/info/privacy-policy"
                className="footer__legal-link"
                target="_blank"
                rel="noopener noreferrer"
                title="Politique de confidentialité et gestion des cookies"
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
