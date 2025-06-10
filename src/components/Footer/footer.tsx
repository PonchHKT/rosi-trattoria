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
import "./Footer.scss";

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
}

interface FacebookResponse {
  data: FacebookPost[];
  error?: any;
}

const Footer: React.FC = () => {
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState(true);

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
          setFacebookPosts([
            {
              id: "1",
              message:
                "Découvrez notre nouvelle carte de printemps avec des ingrédients frais et locaux ! 🌱",
              created_time: "2025-01-15T10:00:00Z",
              likes: { summary: { total_count: 47 } },
            },
            {
              id: "2",
              message: "Soirée spéciale pasta fraîche ce vendredi ! 🍝",
              created_time: "2025-01-14T15:30:00Z",
              likes: { summary: { total_count: 32 } },
            },
            {
              id: "3",
              message:
                "Merci à tous nos clients fidèles部分: fidèles pour cette magnifique soirée ! ❤️",
              created_time: "2025-01-13T20:00:00Z",
              likes: { summary: { total_count: 28 } },
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
    <footer className="footer">
      <div className="footer__top-border"></div>

      <div className="footer__container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__brand-content">
              <img
                src="/images/logo/rositrattorialogo.png"
                alt="Rosi Trattoria"
                className="footer__logo"
              />
              <div className="footer__rating">
                <Star className="footer__star" />
                <Star className="footer__star" />
                <Star className="footer__star" />
                <Star className="footer__star" />
                <Star className="footer__star" />
              </div>
            </div>

            <p className="footer__slogan">Rosi Trattoria</p>

            <p className="footer__description">
              Une expérience culinaire authentique où chaque plat raconte
              l'histoire de la tradition italienne avec une touche de modernité.
            </p>

            <div className="footer__social">
              <h4 className="footer__social-title">Suivez-nous</h4>
              <div className="footer__social-buttons">
                <a
                  href="https://www.facebook.com/ROSI.TRATTORIA/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-btn footer__social-btn--facebook"
                  aria-label="Facebook"
                >
                  <Facebook />
                </a>
                <a
                  href="https://www.instagram.com/rosi.trattoria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-btn footer__social-btn--instagram"
                  aria-label="Instagram"
                >
                  <Instagram />
                </a>
              </div>
            </div>
          </div>

          <div className="footer__contact">
            <h4 className="footer__section-title">Contact</h4>
            <div className="footer__contact-list">
              <div className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--location">
                  <MapPin />
                </div>
                <div className="footer__contact-details">
                  <a
                    href="https://maps.google.com/?q=11+Prom.+des+Tilleuls,+19100+Brive-la-Gaillarde"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    11 Prom. des Tilleuls
                    <br />
                    19100 Brive-la-Gaillarde
                  </a>
                </div>
              </div>

              <div className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--phone">
                  <Phone />
                </div>
                <div className="footer__contact-details">
                  <a href="tel:0544314447">05 44 31 44 47</a>
                </div>
              </div>

              <div className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--email">
                  <Mail />
                </div>
                <div className="footer__contact-details">
                  <a href="mailto:rosi.trattoria@gmail.com">
                    rosi.trattoria@gmail.com
                  </a>
                </div>
              </div>

              <div className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--hours">
                  <Clock />
                </div>
                <div className="footer__contact-details">
                  <div className="footer__hours-list">
                    <div className="footer__hours-item">
                      <span className="footer__hours-day">Mardi-Jeudi</span>
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
                      <span className="footer__hours-day">Lundi, Dimanche</span>
                      <span className="footer__hours-closed">Fermé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer__navigation">
            <h4 className="footer__section-title">Navigation</h4>
            <nav className="footer__nav-links">
              <a href="/" className="footer__nav-link">
                Accueil
              </a>
              <a href="/nosvaleurs" className="footer__nav-link">
                Nos valeurs
              </a>
              <a href="/carte" className="footer__nav-link">
                Carte
              </a>
              <a href="/recrutement" className="footer__nav-link">
                Recrutement
              </a>
              <a href="/contact" className="footer__nav-link">
                Contact
              </a>
            </nav>
          </div>

          <div className="footer__facebook">
            <h4 className="footer__section-title footer__facebook-title">
              <Facebook />
              <span>Derniers posts</span>
            </h4>

            <div className="footer__facebook-posts">
              {loading ? (
                <div className="footer__facebook-loading">
                  Chargement des posts...
                </div>
              ) : (
                facebookPosts.map((post) => (
                  <div key={post.id} className="footer__facebook-post">
                    {getPostImage(post) && (
                      <img
                        src={getPostImage(post)}
                        alt=""
                        className="footer__facebook-image"
                      />
                    )}
                    <p className="footer__facebook-content">
                      {getPostContent(post)}
                    </p>
                    <div className="footer__facebook-meta">
                      <span className="footer__facebook-date">
                        {formatDate(post.created_time)}
                      </span>
                      <div className="footer__facebook-likes">
                        <Heart />
                        <span>{post.likes?.summary?.total_count || 0}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <a
                href="https://www.facebook.com/ROSI.TRATTORIA/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__facebook-link"
              >
                <span>Voir plus sur Facebook</span>
                <Facebook />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © {new Date().getFullYear()} Rosi Trattoria. Tous droits réservés.
            </p>

            <div className="footer__legal-links">
              <a
                href="https://carte.rosi-trattoria.com/info/legal-notice"
                className="footer__legal-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mentions légales
              </a>
              <a
                href="https://carte.rosi-trattoria.com/info/terms"
                className="footer__legal-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                CGV
              </a>
              <a
                href="https://carte.rosi-trattoria.com/info/privacy-policy"
                className="footer__legal-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gestion des cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
