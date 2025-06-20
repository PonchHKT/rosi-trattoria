import React, { useEffect, useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./reviewwidget.scss";

interface TripAdvisorUser {
  userId: string;
  name: string;
  contributions: {
    totalContributions: number;
  };
  username?: string;
  link?: string;
}

interface TripAdvisorReview {
  id: string;
  url: string;
  title: string;
  lang: string;
  locationId: string;
  publishedDate: string;
  publishedPlatform: string;
  rating: number;
  text: string;
  roomTip: string | null;
  travelDate: string;
  tripType: string;
  user: TripAdvisorUser;
}

interface Review {
  id: string;
  reviewer: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  tripType: string;
  contributions: number;
  url: string;
  userProfileUrl?: string;
}

const ReviewWidget: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideInterval = useRef<NodeJS.Timeout | null>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 1,
      spacing: 16,
    },
    loop: true,
    mode: "free-snap",
    vertical: false,
    defaultAnimation: {
      duration: 500,
    },
    created() {},
    slideChanged() {},
  });

  // Fonction pour mélanger un tableau (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fonction pour démarrer l'auto-slide
  const startAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }

    autoSlideInterval.current = setInterval(() => {
      if (!isPaused && instanceRef.current) {
        instanceRef.current.next();
      }
    }, 4000); // Change de slide toutes les 4 secondes
  };

  // Fonction pour arrêter l'auto-slide
  const stopAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
      autoSlideInterval.current = null;
    }
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/tripadvisor.json");
      if (!response.ok) {
        throw new Error("Failed to load reviews JSON file");
      }
      const jsonData: TripAdvisorReview[] = await response.json();
      const transformedReviews: Review[] = jsonData
        .filter(
          (review: TripAdvisorReview) =>
            review.text && review.user?.name && review.rating >= 4
        )
        .map((review: TripAdvisorReview) => {
          let formattedDate = "2025";

          if (review.travelDate) {
            try {
              const [yearStr, monthStr] = review.travelDate.split("-");
              const year = parseInt(yearStr) || 2025;
              const month = parseInt(monthStr) || 1;

              const months = [
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Septembre",
                "Octobre",
                "Novembre",
                "Décembre",
              ];
              if (month >= 1 && month <= 12) {
                formattedDate = `${months[month - 1]} ${year}`;
              }
            } catch {
              formattedDate = review.travelDate;
            }
          }

          const tripTypeTranslations: { [key: string]: string } = {
            COUPLES: "En couple",
            FAMILY: "En famille",
            FRIENDS: "Entre amis",
            SOLO: "Solo",
            BUSINESS: "Voyage d'affaires",
          };

          const translatedTripType =
            review.tripType && review.tripType.toLowerCase() !== "none"
              ? tripTypeTranslations[review.tripType] || review.tripType
              : "";

          let userProfileUrl = "";
          if (review.user.link) {
            userProfileUrl = review.user.link.startsWith("www.")
              ? `https://${review.user.link}`
              : review.user.link;
          } else if (review.user.username) {
            userProfileUrl = `https://www.tripadvisor.com/Profile/${review.user.username}`;
          }

          return {
            id: review.id,
            reviewer: review.user.name.trim(),
            rating: review.rating,
            date: formattedDate,
            title: review.title.trim(),
            text: review.text.trim(),
            tripType: translatedTripType,
            contributions: review.user.contributions.totalContributions,
            url: review.url,
            userProfileUrl: userProfileUrl,
          };
        });

      // Mélanger les avis avant de les afficher
      const shuffledReviews = shuffleArray(transformedReviews);
      setReviews(shuffledReviews);
      setLoading(false);
    } catch (fetchError) {
      console.error("Error loading JSON file:", fetchError);
      setError("Impossible de charger les avis");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Démarrer l'auto-slide quand les avis sont chargés
  useEffect(() => {
    if (reviews.length > 0 && !loading) {
      startAutoSlide();
    }

    // Nettoyer l'intervalle au démontage du composant
    return () => {
      stopAutoSlide();
    };
  }, [reviews, loading, isPaused]);

  // Gestionnaires d'événements pour pause/reprise
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    // Reprendre après un délai pour permettre la lecture
    setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  const renderRatingDots = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`rating-dot ${i < rating ? "filled" : "empty"}`}>
        ●
      </span>
    ));
  };

  const renderGoogleStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`google-star ${i < rating ? "filled" : "empty"}`}
      >
        ★
      </span>
    ));
  };

  const renderTripAdvisorStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`tripadvisor-star ${i < rating ? "filled" : "empty"}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="review-widget">
        <div className="widget-header">
          <div className="brand-section">
            <div className="tripadvisor-section">
              <a
                href="https://www.tripadvisor.fr/Restaurant_Review-g196612-d23792112-Reviews-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-link"
              >
                <img
                  src="/images/logo/tripadvisor_white.png"
                  alt="TripAdvisor"
                  className="tripadvisor-logo"
                />
                <div className="rating-display">
                  <span className="rating-number">4,8</span>
                  <div className="tripadvisor-stars">
                    {renderTripAdvisorStars(5)}
                  </div>
                  <span className="review-count">(326 avis)</span>
                </div>
              </a>
            </div>
            <div className="google-section">
              <a
                href="https://www.google.com/maps/place/Rosi+Trattoria/@45.1632341,1.5304252,16z/data=!3m1!5s0x47f897d9258e5ed5:0x3732e7ea5011b941!4m8!3m7!1s0x47f897e00d125fe3:0xdd18d96369f9f106!8m2!3d45.1632303!4d1.5330001!9m1!1b1!16s%2Fg%2F11pb_g8cpr?entry=ttu&g_ep=EgoyMDI1MDYxNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-link"
              >
                <div className="google-logo">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Google</span>
                </div>
                <div className="rating-display">
                  <span className="rating-number">4,9</span>
                  <div className="google-stars">{renderGoogleStars(5)}</div>
                  <span className="review-count">(1,851 avis)</span>
                </div>
              </a>
            </div>
          </div>
          <div className="header-content">
            <h2>Avis de nos clients</h2>
            <div className="loading-shimmer">
              <div className="shimmer-line"></div>
              <div className="shimmer-line short"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-widget">
        <div className="widget-header">
          <div className="brand-section">
            <div className="tripadvisor-section">
              <a
                href="https://www.tripadvisor.fr/Restaurant_Review-g196612-d23792112-Reviews-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-link"
              >
                <img
                  src="/images/logo/tripadvisor_white.png"
                  alt="TripAdvisor"
                  className="tripadvisor-logo"
                />
                <div className="rating-display">
                  <span className="rating-number">4,8</span>
                  <div className="tripadvisor-stars">
                    {renderTripAdvisorStars(5)}
                  </div>
                  <span className="review-count">(326 avis)</span>
                </div>
              </a>
            </div>
            <div className="google-section">
              <a
                href="https://www.google.com/maps/place/Rosi+Trattoria/@45.1632341,1.5304252,16z/data=!3m1!5s0x47f897d9258e5ed5:0x3732e7ea5011b941!4m8!3m7!1s0x47f897e00d125fe3:0xdd18d96369f9f106!8m2!3d45.1632303!4d1.5330001!9m1!1b1!16s%2Fg%2F11pb_g8cpr?entry=ttu&g_ep=EgoyMDI1MDYxNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-link"
              >
                <div className="google-logo">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Google</span>
                </div>
                <div className="rating-display">
                  <span className="rating-number">4,9</span>
                  <div className="google-stars">{renderGoogleStars(5)}</div>
                  <span className="review-count">(1,851 avis)</span>
                </div>
              </a>
            </div>
          </div>
          <div className="header-content">
            <h2>Avis de nos clients</h2>
          </div>
        </div>
        <div className="error">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="review-widget">
        <div className="widget-header">
          <div className="brand-section">
            <div className="tripadvisor-section">
              <a
                href="https://www.tripadvisor.fr/Restaurant_Review-g196612-d23792112-Reviews-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-link"
              >
                <img
                  src="/images/logo/tripadvisor_white.png"
                  alt="TripAdvisor"
                  className="tripadvisor-logo"
                />
                <div className="rating-display">
                  <span className="rating-number">4,8</span>
                  <div className="tripadvisor-stars">
                    {renderTripAdvisorStars(5)}
                  </div>
                  <span className="review-count">(326 avis)</span>
                </div>
              </a>
            </div>
            <div className="google-section">
              <a
                href="https://www.google.com/maps/place/Rosi+Trattoria/@45.1632341,1.5304252,16z/data=!3m1!5s0x47f897d9258e5ed5:0x3732e7ea5011b941!4m8!3m7!1s0x47f897e00d125fe3:0xdd18d96369f9f106!8m2!3d45.1632303!4d1.5330001!9m1!1b1!16s%2Fg%2F11pb_g8cpr?entry=ttu&g_ep=EgoyMDI1MDYxNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-link"
              >
                <div className="google-logo">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Google</span>
                </div>
                <div className="rating-display">
                  <span className="rating-number">4,9</span>
                  <div className="google-stars">{renderGoogleStars(5)}</div>
                  <span className="review-count">(1,851 avis)</span>
                </div>
              </a>
            </div>
          </div>
          <div className="header-content">
            <h2>Avis de nos clients</h2>
          </div>
        </div>
        <div className="no-reviews">
          <div className="empty-icon">📝</div>
          <p>Aucun avis disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-widget">
      <div className="widget-header">
        <div className="brand-section">
          <div className="tripadvisor-section">
            <a
              href="https://www.tripadvisor.fr/Restaurant_Review-g196612-d23792112-Reviews-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html"
              target="_blank"
              rel="noopener noreferrer"
              className="brand-link"
            >
              <img
                src="/images/logo/tripadvisor_white.png"
                alt="TripAdvisor"
                className="tripadvisor-logo"
              />
              <div className="rating-display">
                <span className="rating-number">4,8</span>
                <div className="tripadvisor-stars">
                  {renderTripAdvisorStars(5)}
                </div>
                <span className="review-count">(326 avis)</span>
              </div>
            </a>
          </div>
          <div className="google-section">
            <a
              href="https://www.google.com/maps/place/Rosi+Trattoria/@45.1632341,1.5304252,16z/data=!3m1!5s0x47f897d9258e5ed5:0x3732e7ea5011b941!4m8!3m7!1s0x47f897e00d125fe3:0xdd18d96369f9f106!8m2!3d45.1632303!4d1.5330001!9m1!1b1!16s%2Fg%2F11pb_g8cpr?entry=ttu&g_ep=EgoyMDI1MDYxNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="brand-link"
            >
              <div className="google-logo">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="google-svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </div>
              <div className="rating-display">
                <span className="rating-number">4,9</span>
                <div className="google-stars">{renderGoogleStars(5)}</div>
                <span className="review-count">(1,851 avis)</span>
              </div>
            </a>
          </div>
        </div>
        <div className="header-content">
          <h2>Avis de nos clients</h2>
        </div>
      </div>

      <div className="slider-container">
        <div
          ref={sliderRef}
          className="keen-slider"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {reviews.map((review) => (
            <div key={review.id} className="keen-slider__slide">
              <div className="review-item">
                <div className="review-content">
                  <div className="review-header">
                    <div className="review-meta">
                      <span className="review-date">
                        Visité en {review.date}
                      </span>
                      {review.tripType && (
                        <span className="trip-type">{review.tripType}</span>
                      )}
                    </div>
                    <div className="rating-section">
                      <div className="rating">
                        {renderRatingDots(review.rating)}
                      </div>
                    </div>
                  </div>
                  <h3 className="review-title">{review.title}</h3>
                  <div className="review-text">{review.text}</div>
                </div>
                <div className="reviewer-info">
                  <div className="reviewer-details">
                    {review.userProfileUrl ? (
                      <a
                        href={review.userProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reviewer-name clickable"
                      >
                        {review.reviewer}
                      </a>
                    ) : (
                      <span className="reviewer-name">{review.reviewer}</span>
                    )}
                    <span className="contributions">
                      {review.contributions} contribution
                      {review.contributions > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewWidget;
