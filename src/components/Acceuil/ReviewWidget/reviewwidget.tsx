import React, { useEffect, useState, useCallback } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./reviewwidget.scss";

interface TripAdvisorUser {
  userId: string;
  name: string;
  contributions: {
    totalContributions: number;
    helpfulVotes: number;
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
  helpfulVotes: number;
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
  helpfulVotes: number;
  contributions: number;
  url: string;
  userProfileUrl?: string;
}

const ReviewWidget: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  // New state to track AFK status
  const [isAfk, setIsAfk] = useState(false);

  // Debounce utility to limit frequent height updates
  const debounce = useCallback(
    (func: (...args: any[]) => void, wait: number) => {
      let timeout: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    },
    []
  );

  const updateSliderHeight = useCallback(() => {
    if (!instanceRef.current) return;

    const currentSlide = instanceRef.current.track.details.abs;
    const slideElement = document.querySelector(
      `.keen-slider__slide:nth-child(${currentSlide + 1}) .review-item`
    ) as HTMLElement;

    if (slideElement) {
      const sliderContainer = document.querySelector(
        ".keen-slider"
      ) as HTMLElement;
      if (sliderContainer) {
        // Reset height to auto to recalculate
        slideElement.style.height = "auto";
        sliderContainer.style.height = "auto";

        // Force DOM reflow
        void slideElement.offsetHeight;

        // Calculate height including padding
        const slideHeight = slideElement.getBoundingClientRect().height;
        sliderContainer.style.height = `${slideHeight + 10}px`; // Small buffer
      }
    }
  }, []);

  const debouncedUpdateSliderHeight = useCallback(
    debounce(updateSliderHeight, 5),
    [updateSliderHeight]
  );

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    initial: 0,
    created: () => {
      setTimeout(debouncedUpdateSliderHeight, 200);
    },
    slideChanged: () => {
      debouncedUpdateSliderHeight();
    },
    mode: "free-snap",
    range: {
      min: -Infinity,
      max: Infinity,
    },
  });

  // New: AFK detection logic
  useEffect(() => {
    let afkTimeout: NodeJS.Timeout;
    const resetStyles = () => {
      // Force reset critical font styles to prevent browser overrides
      document
        .querySelectorAll(".review-widget, .review-widget *")
        .forEach((el) => {
          (el as HTMLElement).style.fontSize = "";
          (el as HTMLElement).style.fontFamily = "";
        });
      debouncedUpdateSliderHeight(); // Recalculate slider height
    };

    const handleUserActivity = () => {
      setIsAfk(false);
      clearTimeout(afkTimeout);
      afkTimeout = setTimeout(() => {
        setIsAfk(true);
        resetStyles();
      }, 300000); // 5 minutes AFK threshold
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      clearTimeout(afkTimeout);
    };
  }, [debouncedUpdateSliderHeight]);

  useEffect(() => {
    if (reviews.length > 0 && instanceRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (!isAfk) {
          debouncedUpdateSliderHeight();
        }
      });

      const slides = document.querySelectorAll(".review-item");
      slides.forEach((slide) => {
        resizeObserver.observe(slide);
      });

      // Initial height calculation
      setTimeout(debouncedUpdateSliderHeight, 300);

      // Add interaction event listeners to pause auto-slide
      const handleInteraction = () => {
        setIsPaused(true);
        // Resume auto-slide after 10 seconds of inactivity
        setTimeout(() => {
          setIsPaused(false);
        }, 10000);
      };

      slides.forEach((slide) => {
        slide.addEventListener("click", handleInteraction);
        slide.addEventListener("touchstart", handleInteraction);
      });

      return () => {
        resizeObserver.disconnect();
        slides.forEach((slide) => {
          slide.removeEventListener("click", handleInteraction);
          slide.removeEventListener("touchstart", handleInteraction);
        });
      };
    }
  }, [reviews, debouncedUpdateSliderHeight, isAfk]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused && reviews.length > 1 && !isAfk) {
      interval = setInterval(() => {
        if (instanceRef.current) {
          instanceRef.current.next();
        }
      }, 6000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [reviews.length, isPaused, isAfk]);

  const getRandomReviews = (reviewsArray: Review[], count: number = 5) => {
    const shuffled = [...reviewsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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
            helpfulVotes: review.helpfulVotes,
            contributions: review.user.contributions.totalContributions,
            url: review.url,
            userProfileUrl: userProfileUrl,
          };
        });

      setReviews(getRandomReviews(transformedReviews, 5));
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

  const handleRefreshReviews = () => {
    loadReviews();
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
                  src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
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
            <div className="header-buttons">
              <button
                className="refresh-reviews-btn"
                onClick={handleRefreshReviews}
                disabled={loading}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z"
                    fill="currentColor"
                  />
                </svg>
                Rafraîchir les avis
              </button>
              <a
                href="https://www.tripadvisor.fr/UserReviewEdit-g196612-d23792112-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html"
                target="_blank"
                rel="noopener noreferrer"
                className="write-review-btn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                    fill="currentColor"
                  />
                </svg>
                Laisser un avis
              </a>
            </div>
          </div>
          <div className="loading-shimmer">
            <div className="shimmer-line"></div>
            <div className="shimmer-line short"></div>
          </div>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des avis...</p>
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
                  src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
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
            <div className="header-buttons">
              <button
                className="refresh-reviews-btn"
                onClick={handleRefreshReviews}
                disabled={loading}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z"
                    fill="currentColor"
                  />
                </svg>
                Rafraîchir les avis
              </button>
              <a
                href="https://www.tripadvisor.fr/UserReviewEdit-g196612-d23792112-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html"
                target="_blank"
                rel="noopener noreferrer"
                className="write-review-btn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                    fill="currentColor"
                  />
                </svg>
                Laisser un avis
              </a>
            </div>
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
                  src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
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
            <div className="header-buttons">
              <button
                className="refresh-reviews-btn"
                onClick={handleRefreshReviews}
                disabled={loading}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z"
                    fill="currentColor"
                  />
                </svg>
                Rafraîchir les avis
              </button>
              <a
                href="https://www.tripadvisor.fr/UserReviewEdit-g196612-d23792112-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html"
                target="_blank"
                rel="noopener noreferrer"
                className="write-review-btn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                    fill="currentColor"
                  />
                </svg>
                Laisser un avis
              </a>
            </div>
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
                src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
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
          <div className="header-buttons">
            <button
              className="refresh-reviews-btn"
              onClick={handleRefreshReviews}
              disabled={loading}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z"
                  fill="currentColor"
                />
              </svg>
              Rafraîchir les avis
            </button>
            <a
              href="https://www.tripadvisor.fr/UserReviewEdit-g196612-d23792112-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html"
              target="_blank"
              rel="noopener noreferrer"
              className="write-review-btn"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                  fill="currentColor"
                />
              </svg>
              Laisser un avis
            </a>
          </div>
        </div>
      </div>

      <div className="slider-container">
        <div ref={sliderRef} className="keen-slider">
          {reviews.map((review) => (
            <div key={review.id} className="keen-slider__slide">
              <div className="review-item">
                <div className="review-content">
                  <div className="review-header">
                    <div className="rating-section">
                      <div className="rating">
                        {renderRatingDots(review.rating)}
                      </div>
                    </div>
                    <div className="review-meta">
                      <span className="review-date">
                        Visité en {review.date}
                      </span>
                      {review.tripType && (
                        <span className="trip-type">{review.tripType}</span>
                      )}
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
                  {review.helpfulVotes > 0 && (
                    <div className="helpful-votes">
                      👍 {review.helpfulVotes} vote
                      {review.helpfulVotes > 1 ? "s" : ""} utile
                      {review.helpfulVotes > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="widget-footer">
        <p className="powered-by">Avis vérifiés • TripAdvisor</p>
      </div>
    </div>
  );
};

export default ReviewWidget;
