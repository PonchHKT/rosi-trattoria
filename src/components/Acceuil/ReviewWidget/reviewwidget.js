import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./reviewwidget.scss";
import ReviewPopup from "../ReviewPopup/reviewpopup";
import ReactGA from "react-ga4";
// Configuration des événements GA4 pour ReviewWidget
const GA4_EVENTS = {
    WIDGET_INITIALIZED: "avis_widget_initialized",
    REVIEWS_LOADED: "avis_reviews_loaded",
    SLIDER_NAVIGATION: "avis_slider_navigation",
    EXTERNAL_LINK_CLICK: "avis_external_link_click",
    LEAVE_REVIEW_CLICK: "avis_leave_review_click",
    POPUP_CLOSE: "avis_popup_close",
    REVIEW_CLICK: "avis_review_click",
    ERROR: "avis_error",
};
const ReviewWidget = ({ pageName = "Accueil", }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [reviewsViewed, setReviewsViewed] = useState(new Set());
    const [totalSlideChanges, setTotalSlideChanges] = useState(0);
    const autoSlideInterval = useRef(null);
    const [sliderRef, instanceRef] = useKeenSlider({
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
        created(slider) {
            ReactGA.event(GA4_EVENTS.WIDGET_INITIALIZED, {
                page_name: pageName,
                review_count: slider.track.details.slides.length,
            });
        },
        slideChanged(slider) {
            const currentSlide = slider.track.details.rel;
            const totalSlides = slider.track.details.slides.length;
            setTotalSlideChanges((prev) => prev + 1);
            if (reviews[currentSlide]) {
                setReviewsViewed((prev) => new Set([...prev, reviews[currentSlide].id]));
            }
            if (totalSlideChanges % 3 === 0) {
                ReactGA.event(GA4_EVENTS.SLIDER_NAVIGATION, {
                    page_name: pageName,
                    slide_index: currentSlide + 1,
                    total_slides: totalSlides,
                    review_source: reviews[currentSlide]?.source || "unknown",
                    reviews_viewed: reviewsViewed.size,
                });
            }
        },
    });
    // Fonction pour vérifier si c'est un avis TripAdvisor
    const isTripAdvisorReview = (review) => {
        return "user" in review && "travelDate" in review;
    };
    // Fonction pour mélanger un tableau (Fisher-Yates shuffle)
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };
    // Fonction pour générer le JSON-LD Schema.org
    const generateSchemaJsonLd = () => {
        if (!reviews.length)
            return null;
        const aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: "4.85",
            reviewCount: "2177",
            bestRating: "5",
            worstRating: "1",
        };
        const reviewsSchema = reviews.slice(0, 20).map((review) => ({
            "@type": "Review",
            itemReviewed: {
                "@type": "Restaurant",
                name: "Rosi Trattoria",
                url: "https://www.rosi-trattoria.com/",
                address: {
                    "@type": "PostalAddress",
                    streetAddress: "11 Prom. des Tilleuls",
                    addressLocality: "Brive-la-Gaillarde",
                    postalCode: "19100",
                    addressCountry: "FR",
                },
                telephone: "+33544314447",
                servesCuisine: "Italian",
            },
            author: {
                "@type": "Person",
                name: review.reviewer,
            },
            reviewRating: {
                "@type": "Rating",
                ratingValue: review.rating.toString(),
                bestRating: "5",
                worstRating: "1",
            },
            reviewBody: review.text,
            datePublished: new Date().toISOString().split("T")[0],
            publisher: {
                "@type": "Organization",
                name: review.source === "google" ? "Google" : "TripAdvisor",
            },
        }));
        const schema = {
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Rosi Trattoria",
            description: "Rosi Trattoria propose des pizzas napolitaines artisanales, faites maison avec des produits bio et locaux, dans un cadre chaleureux à Brive-la-Gaillarde.",
            url: "https://www.rosi-trattoria.com/",
            telephone: "+33544314447",
            address: {
                "@type": "PostalAddress",
                streetAddress: "11 Prom. des Tilleuls",
                addressLocality: "Brive-la-Gaillarde",
                postalCode: "19100",
                addressCountry: "FR",
            },
            geo: {
                "@type": "GeoCoordinates",
                latitude: "45.1632303",
                longitude: "1.5330001",
            },
            aggregateRating: aggregateRating,
            review: reviewsSchema,
            servesCuisine: ["Italian"],
            priceRange: "€€",
            openingHours: [
                "Tu-Th 12:00-14:00",
                "Tu-Th 19:00-21:30",
                "Fr-Sa 12:00-14:00",
                "Fr-Sa 19:00-22:30",
            ],
            image: "/images/logo/og-image.jpg",
            hasMenu: "https://www.rosi-trattoria.com/carte",
            acceptsReservations: true,
        };
        return JSON.stringify(schema);
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
        }, 4000);
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
            const response = await fetch("/googlereviews.json");
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load reviews JSON file`);
            }
            const jsonData = await response.json();
            console.log("Données JSON chargées:", jsonData);
            const transformedReviews = jsonData
                .filter((review) => {
                if (isTripAdvisorReview(review)) {
                    return review.text && review.user.name && review.rating >= 4;
                }
                return (review.text &&
                    review.name &&
                    review.stars >= 4);
            })
                .map((review, index) => {
                const isTripAdvisor = isTripAdvisorReview(review);
                // Générer une date aléatoire récente (6 derniers mois)
                const now = new Date();
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(now.getMonth() - 6);
                const randomTime = sixMonthsAgo.getTime() +
                    Math.random() * (now.getTime() - sixMonthsAgo.getTime());
                const randomDate = new Date(randomTime);
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
                const formattedDate = `${months[randomDate.getMonth()]} ${randomDate.getFullYear()}`;
                if (isTripAdvisor) {
                    return {
                        id: review.url || `tripadvisor-review-${index}`,
                        reviewer: review.user.name.trim(),
                        rating: review.rating,
                        date: formattedDate,
                        text: review.text.trim(),
                        reviewCount: review.user.contributions.totalContributions,
                        profilePhotoUrl: undefined,
                        source: "tripadvisor",
                    };
                }
                return {
                    id: review.reviewUrl ||
                        `google-review-${index}`,
                    reviewer: review.name.trim(),
                    rating: review.stars,
                    date: formattedDate,
                    text: review.text.trim(),
                    reviewCount: Math.floor(Math.random() * 50) + 1,
                    profilePhotoUrl: undefined,
                    source: "google",
                };
            });
            // Mélanger les avis avant de les afficher
            const shuffledReviews = shuffleArray(transformedReviews);
            setReviews(shuffledReviews);
            setLoading(false);
            ReactGA.event(GA4_EVENTS.REVIEWS_LOADED, {
                page_name: pageName,
                review_count: shuffledReviews.length,
            });
        }
        catch (fetchError) {
            console.error("Error loading reviews JSON file:", fetchError);
            setError("Impossible de charger les avis");
            setLoading(false);
            ReactGA.event(GA4_EVENTS.ERROR, {
                page_name: pageName,
                error_message: "Échec du chargement des avis",
            });
        }
    };
    useEffect(() => {
        loadReviews();
    }, []);
    // Ajouter le JSON-LD au document quand les avis sont chargés
    useEffect(() => {
        if (reviews.length > 0) {
            const schemaScript = document.createElement("script");
            schemaScript.type = "application/ld+json";
            schemaScript.id = "reviews-schema";
            schemaScript.textContent = generateSchemaJsonLd();
            // Supprimer l'ancien script s'il existe
            const existingScript = document.getElementById("reviews-schema");
            if (existingScript) {
                existingScript.remove();
            }
            document.head.appendChild(schemaScript);
            // Nettoyage au démontage du composant
            return () => {
                const scriptToRemove = document.getElementById("reviews-schema");
                if (scriptToRemove) {
                    scriptToRemove.remove();
                }
            };
        }
    }, [reviews]);
    // Démarrer l'auto-slide quand les avis sont chargés
    useEffect(() => {
        if (reviews.length > 0 && !loading) {
            startAutoSlide();
        }
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
        setTimeout(() => {
            setIsPaused(false);
        }, 2000);
    };
    // Gestionnaire pour les clics sur les liens externes
    const handleExternalLinkClick = (platform, action) => {
        ReactGA.event(GA4_EVENTS.EXTERNAL_LINK_CLICK, {
            page_name: pageName,
            platform: platform,
            action_type: action,
        });
    };
    // Gestionnaire pour le bouton "Laisser un avis"
    const handleLeaveReviewClick = () => {
        setIsPopupOpen(true);
        ReactGA.event(GA4_EVENTS.LEAVE_REVIEW_CLICK, {
            page_name: pageName,
        });
    };
    // Gestionnaire pour la fermeture de la popup
    const handlePopupClose = () => {
        setIsPopupOpen(false);
        ReactGA.event(GA4_EVENTS.POPUP_CLOSE, {
            page_name: pageName,
        });
    };
    // Tracking de l'engagement sur les avis individuels
    const handleReviewClick = (review, index) => {
        ReactGA.event(GA4_EVENTS.REVIEW_CLICK, {
            page_name: pageName,
            review_source: review.source,
            review_rating: review.rating,
            slide_index: index + 1,
        });
    };
    const renderGoogleStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (_jsx("span", { className: `google-star ${i < rating ? "filled" : "empty"}`, "aria-label": `${i + 1} étoile${i > 0 ? "s" : ""}`, children: "\u2605" }, i)));
    };
    const renderTripAdvisorStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (_jsx("span", { className: `tripadvisor-star ${i < rating ? "filled" : "empty"}`, "aria-label": `${i + 1} étoile${i > 0 ? "s" : ""}`, children: "\u25CF" }, i)));
    };
    const renderReviewStars = (rating, source) => {
        if (source === "tripadvisor") {
            return (_jsx("div", { className: "tripadvisor-stars", role: "img", "aria-label": `${rating} étoiles sur 5`, children: renderTripAdvisorStars(rating) }));
        }
        else {
            return (_jsx("div", { className: "google-stars", role: "img", "aria-label": `${rating} étoiles sur 5`, children: renderGoogleStars(rating) }));
        }
    };
    const renderHeader = () => (_jsxs("header", { className: "widget-header", children: [_jsxs("div", { className: "brand-section", children: [_jsx("div", { className: "google-section", children: _jsxs("a", { href: "https://www.google.com/maps/place/Rosi+Trattoria/@45.1632341,1.5304252,16z/data=!3m1!5s0x47f897d9258e5ed5:0x3732e7ea5011b941!4m8!3m7!1s0x47f897e00d125fe3:0xdd18d96369f9f106!8m2!3d45.1632303!4d1.5330001!9m1!1b1!16s%2Fg%2F11pb_g8cpr?entry=ttu&g_ep=EgoyMDI1MDYxNS4wIKXMDSoASAFQAw%3D%3D", target: "_blank", rel: "noopener noreferrer", className: "brand-link", "aria-label": "Voir nos avis Google (4,9 \u00E9toiles)", onClick: () => handleExternalLinkClick("google", "view_reviews"), children: [_jsxs("div", { className: "google-logo", children: [_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })] }), _jsx("span", { children: "Google" })] }), _jsxs("div", { className: "rating-display", children: [_jsx("span", { className: "rating-number", children: "4,9" }), _jsx("div", { className: "google-stars", children: renderGoogleStars(5) })] })] }) }), _jsx("div", { className: "tripadvisor-section", children: _jsxs("a", { href: "https://www.tripadvisor.fr/Restaurant_Review-g196612-d23792112-Reviews-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html", target: "_blank", rel: "noopener noreferrer", className: "brand-link", "aria-label": "Voir nos avis TripAdvisor (4,8 \u00E9toiles)", onClick: () => handleExternalLinkClick("tripadvisor", "view_reviews"), children: [_jsx("img", { src: "/images/logo/tripadvisor_white.png", alt: "TripAdvisor", className: "tripadvisor-logo" }), _jsxs("div", { className: "rating-display", children: [_jsx("span", { className: "rating-number", children: "4,8" }), _jsx("div", { className: "tripadvisor-stars", children: renderTripAdvisorStars(5) })] })] }) })] }), _jsxs("div", { className: "header-content", children: [_jsx("h2", { children: "\"D\u00E9couvrez les mots qui nous motivent chaque jour\"" }), loading && (_jsxs("div", { className: "loading-shimmer", "aria-label": "Chargement des avis", children: [_jsx("div", { className: "shimmer-line" }), _jsx("div", { className: "shimmer-line short" })] }))] })] }));
    if (loading) {
        return (_jsxs("section", { className: "review-widget", "aria-label": "Avis clients du restaurant Rosi Trattoria", children: [renderHeader(), _jsx("div", { className: "loading-container", role: "status", "aria-live": "polite", children: _jsx("div", { className: "loading-shimmer", "aria-label": "Chargement des avis clients", children: _jsxs("div", { className: "shimmer-card", children: [_jsx("div", { className: "shimmer-line shimmer-rating" }), _jsx("div", { className: "shimmer-line shimmer-text long" }), _jsx("div", { className: "shimmer-line shimmer-text medium" }), _jsx("div", { className: "shimmer-line shimmer-author" })] }) }) }), _jsx(ReviewPopup, { isOpen: isPopupOpen, onClose: handlePopupClose })] }));
    }
    if (error) {
        return (_jsxs("section", { className: "review-widget", "aria-label": "Avis clients du restaurant Rosi Trattoria", children: [renderHeader(), _jsxs("div", { className: "error", role: "alert", children: [_jsx("div", { className: "error-icon", children: "\u26A0\uFE0F" }), _jsx("p", { children: error })] }), _jsx(ReviewPopup, { isOpen: isPopupOpen, onClose: handlePopupClose })] }));
    }
    if (reviews.length === 0) {
        return (_jsxs("section", { className: "review-widget", "aria-label": "Avis clients du restaurant Rosi Trattoria", children: [renderHeader(), _jsxs("div", { className: "no-reviews", children: [_jsx("div", { className: "empty-icon", children: "\uD83D\uDCDD" }), _jsx("p", { children: "Aucun avis disponible" })] }), _jsx(ReviewPopup, { isOpen: isPopupOpen, onClose: handlePopupClose })] }));
    }
    return (_jsxs("section", { className: "review-widget", "aria-label": "Avis clients du restaurant Rosi Trattoria", children: [renderHeader(), _jsx("div", { className: "slider-container", children: _jsx("div", { ref: sliderRef, className: "keen-slider", onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd, role: "region", "aria-label": "Carrousel d'avis clients", children: reviews.map((review, index) => (_jsxs("article", { className: "keen-slider__slide", itemScope: true, itemType: "https://schema.org/Review", onClick: () => handleReviewClick(review, index), children: [_jsxs("div", { itemProp: "itemReviewed", itemScope: true, itemType: "https://schema.org/Restaurant", style: { display: "none" }, children: [_jsx("meta", { itemProp: "name", content: "Rosi Trattoria" }), _jsx("meta", { itemProp: "url", content: "https://www.rosi-trattoria.com/" }), _jsxs("div", { itemProp: "address", itemScope: true, itemType: "https://schema.org/PostalAddress", children: [_jsx("meta", { itemProp: "streetAddress", content: "11 Prom. des Tilleuls" }), _jsx("meta", { itemProp: "addressLocality", content: "Brive-la-Gaillarde" }), _jsx("meta", { itemProp: "postalCode", content: "19100" }), _jsx("meta", { itemProp: "addressCountry", content: "FR" }), _jsx("meta", { itemProp: "addressRegion", content: "Nouvelle-Aquitaine" })] }), _jsx("meta", { itemProp: "telephone", content: "+33544314447" }), _jsx("meta", { itemProp: "servesCuisine", content: "Italian" }), _jsxs("div", { itemProp: "geo", itemScope: true, itemType: "https://schema.org/GeoCoordinates", children: [_jsx("meta", { itemProp: "latitude", content: "45.1632303" }), _jsx("meta", { itemProp: "longitude", content: "1.5330001" })] })] }), _jsxs("div", { className: "review-item", children: [_jsxs("div", { className: "review-content", children: [_jsxs("div", { className: "review-header", children: [_jsx("div", { className: "review-meta", children: _jsxs("time", { className: "review-date", dateTime: new Date().toISOString(), itemProp: "datePublished", children: ["Visit\u00E9 en ", review.date] }) }), _jsxs("div", { className: "rating-section", itemProp: "reviewRating", itemScope: true, itemType: "https://schema.org/Rating", children: [_jsx("meta", { itemProp: "ratingValue", content: review.rating.toString() }), _jsx("meta", { itemProp: "bestRating", content: "5" }), _jsx("meta", { itemProp: "worstRating", content: "1" }), renderReviewStars(review.rating, review.source)] })] }), _jsx("blockquote", { className: "review-text", itemProp: "reviewBody", cite: review.source === "google"
                                                    ? "Google Reviews"
                                                    : "TripAdvisor", children: review.text })] }), _jsxs("div", { className: "reviewer-info", children: [_jsxs("div", { className: "reviewer-details", children: [_jsx("cite", { className: "reviewer-name", itemProp: "author", itemScope: true, itemType: "https://schema.org/Person", children: _jsx("span", { itemProp: "name", children: review.reviewer }) }), _jsxs("small", { className: "review-source", children: ["Avis v\u00E9rifi\u00E9", " ", review.source === "google" ? "Google" : "TripAdvisor"] })] }), _jsx("button", { className: "leave-review-btn", onClick: handleLeaveReviewClick, "aria-label": "Laisser un avis sur notre restaurant", children: "Laisser un avis" })] })] })] }, review.id))) }) }), _jsx("div", { className: "seo-reviews-section", children: _jsxs("div", { className: "seo-content", children: [_jsx("p", { className: "seo-text", children: "Restaurant italien Brive-la-Gaillarde - Rosi Trattoria, pizzas napolitaines artisanales. Avis v\u00E9rifi\u00E9s clients : cuisine italienne authentique, produits bio et locaux, ambiance chaleureuse. R\u00E9servations 05 44 31 44 47." }), _jsx("div", { className: "seo-reviews-hidden", children: reviews.map((review) => (_jsxs("div", { className: "seo-review-compact", itemScope: true, itemType: "https://schema.org/Review", children: [_jsxs("div", { itemProp: "itemReviewed", itemScope: true, itemType: "https://schema.org/Restaurant", children: [_jsx("span", { itemProp: "name", children: "Rosi Trattoria" }), _jsx("meta", { itemProp: "url", content: "https://www.rosi-trattoria.com/" }), _jsxs("div", { itemProp: "address", itemScope: true, itemType: "https://schema.org/PostalAddress", children: [_jsx("meta", { itemProp: "streetAddress", content: "11 Prom. des Tilleuls" }), _jsx("meta", { itemProp: "addressLocality", content: "Brive-la-Gaillarde" }), _jsx("meta", { itemProp: "postalCode", content: "19100" }), _jsx("meta", { itemProp: "addressCountry", content: "FR" }), _jsx("meta", { itemProp: "addressRegion", content: "Nouvelle-Aquitaine" })] }), _jsx("meta", { itemProp: "telephone", content: "+33544314447" }), _jsx("meta", { itemProp: "servesCuisine", content: "Italian" })] }), _jsx("cite", { itemProp: "author", itemScope: true, itemType: "https://schema.org/Person", children: _jsx("span", { itemProp: "name", children: review.reviewer }) }), _jsxs("div", { itemProp: "reviewRating", itemScope: true, itemType: "https://schema.org/Rating", children: [_jsx("meta", { itemProp: "ratingValue", content: review.rating.toString() }), _jsx("meta", { itemProp: "bestRating", content: "5" }), _jsx("meta", { itemProp: "worstRating", content: "1" })] }), _jsx("time", { itemProp: "datePublished", dateTime: new Date().toISOString(), children: review.date }), _jsx("span", { itemProp: "reviewBody", children: review.text })] }, `seo-${review.id}`))) })] }) }), _jsx(ReviewPopup, { isOpen: isPopupOpen, onClose: handlePopupClose })] }));
};
export default ReviewWidget;
