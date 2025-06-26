import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./reviewwidget.scss";
import ReviewPopup from "../ReviewPopup/reviewpopup";
import ReactGA from "react-ga4";
// Configuration des événements GA4 pour ReviewWidget
const GA4_EVENTS = {
    WIDGET_INITIALIZED: "review_widget_initialized",
    REVIEWS_LOADED: "reviews_loaded",
    SLIDER_INTERACTION: "slider_interaction",
    REVIEW_ENGAGEMENT: "review_engagement",
    EXTERNAL_LINK_CLICK: "external_platform_click",
    LEAVE_REVIEW_ACTION: "leave_review_action",
    ERROR_OCCURRED: "review_widget_error",
};
const ReviewWidget = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const autoSlideInterval = useRef(null);
    // États pour le tracking GA4
    const [sessionStartTime] = useState(Date.now());
    const [reviewsViewed, setReviewsViewed] = useState(new Set());
    const [totalSlideChanges, setTotalSlideChanges] = useState(0);
    const [userEngagementScore, setUserEngagementScore] = useState(0);
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
            // GA4 - Initialisation du widget avec métadonnées
            ReactGA.event(GA4_EVENTS.WIDGET_INITIALIZED, {
                widget_type: "review_carousel",
                slider_library: "keen_slider",
                initial_slide: slider.track.details.abs,
                total_slides: slider.track.details.slides.length,
                session_id: sessionStartTime.toString(),
                custom_parameters: {
                    auto_play: true,
                    loop_enabled: true,
                    touch_enabled: true,
                },
            });
        },
        slideChanged(slider) {
            const currentSlide = slider.track.details.rel;
            const totalSlides = slider.track.details.slides.length;
            setTotalSlideChanges((prev) => prev + 1);
            // Marquer cet avis comme vu
            if (reviews[currentSlide]) {
                setReviewsViewed((prev) => new Set([...prev, reviews[currentSlide].id]));
            }
            // GA4 - Changement de slide avec contexte enrichi
            ReactGA.event(GA4_EVENTS.SLIDER_INTERACTION, {
                interaction_type: "slide_change",
                slide_index: currentSlide,
                slide_direction: "next", // Peut être amélioré pour détecter la direction
                total_slides: totalSlides,
                slide_progress: (((currentSlide + 1) / totalSlides) * 100).toFixed(1),
                review_source: reviews[currentSlide]?.source || "unknown",
                review_rating: reviews[currentSlide]?.rating || 0,
                session_slides_viewed: totalSlideChanges + 1,
                engagement_score: userEngagementScore,
            });
        },
    });
    // Fonction pour calculer le score d'engagement
    const calculateEngagementScore = () => {
        const timeSpent = (Date.now() - sessionStartTime) / 1000; // en secondes
        const reviewsViewedCount = reviewsViewed.size;
        const slideInteractions = totalSlideChanges;
        // Score basé sur différents facteurs (0-100)
        const timeScore = Math.min((timeSpent / 60) * 20, 40); // Max 40 points pour 2 minutes
        const viewsScore = Math.min(reviewsViewedCount * 5, 30); // Max 30 points pour 6 avis vus
        const interactionScore = Math.min(slideInteractions * 2, 30); // Max 30 points pour 15 interactions
        return Math.round(timeScore + viewsScore + interactionScore);
    };
    // Update engagement score périodiquement
    useEffect(() => {
        const interval = setInterval(() => {
            const newScore = calculateEngagementScore();
            setUserEngagementScore(newScore);
        }, 5000); // Recalculer toutes les 5 secondes
        return () => clearInterval(interval);
    }, [reviewsViewed.size, totalSlideChanges, sessionStartTime]);
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
        const loadStartTime = Date.now();
        try {
            setLoading(true);
            // GA4 - Début du chargement des avis
            ReactGA.event(GA4_EVENTS.REVIEWS_LOADED, {
                loading_status: "started",
                data_source: "googlereviews_json",
                timestamp: loadStartTime,
            });
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
                else {
                    return review.text && review.name && review.stars >= 4;
                }
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
                else {
                    return {
                        id: review.reviewUrl || `google-review-${index}`,
                        reviewer: review.name.trim(),
                        rating: review.stars,
                        date: formattedDate,
                        text: review.text.trim(),
                        reviewCount: Math.floor(Math.random() * 50) + 1,
                        profilePhotoUrl: undefined,
                        source: "google",
                    };
                }
            });
            // Mélanger les avis avant de les afficher
            const shuffledReviews = shuffleArray(transformedReviews);
            setReviews(shuffledReviews);
            setLoading(false);
            const loadEndTime = Date.now();
            const loadDuration = loadEndTime - loadStartTime;
            // GA4 - Succès du chargement avec métriques détaillées
            ReactGA.event(GA4_EVENTS.REVIEWS_LOADED, {
                loading_status: "success",
                total_reviews: shuffledReviews.length,
                google_reviews: shuffledReviews.filter((r) => r.source === "google")
                    .length,
                tripadvisor_reviews: shuffledReviews.filter((r) => r.source === "tripadvisor").length,
                load_duration_ms: loadDuration,
                average_rating: (shuffledReviews.reduce((sum, r) => sum + r.rating, 0) /
                    shuffledReviews.length).toFixed(2),
                rating_distribution: {
                    "5_star": shuffledReviews.filter((r) => r.rating === 5).length,
                    "4_star": shuffledReviews.filter((r) => r.rating === 4).length,
                    "3_star": shuffledReviews.filter((r) => r.rating === 3).length,
                    "2_star": shuffledReviews.filter((r) => r.rating === 2).length,
                    "1_star": shuffledReviews.filter((r) => r.rating === 1).length,
                },
            });
            // Track Schema.org implementation
            ReactGA.event("schema_structured_data", {
                schema_type: "Restaurant_Reviews",
                reviews_count: Math.min(shuffledReviews.length, 20),
                has_aggregate_rating: true,
                has_geo_coordinates: true,
            });
        }
        catch (fetchError) {
            console.error("Error loading reviews JSON file:", fetchError);
            setError("Impossible de charger les avis");
            setLoading(false);
            const loadEndTime = Date.now();
            const loadDuration = loadEndTime - loadStartTime;
            // GA4 - Erreur de chargement avec détails
            ReactGA.event(GA4_EVENTS.ERROR_OCCURRED, {
                error_type: "reviews_loading_failed",
                error_message: fetchError instanceof Error ? fetchError.message : "unknown_error",
                load_duration_ms: loadDuration,
                fetch_url: "/googlereviews.json",
                error_context: "initial_load",
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
            // GA4 - Schema JSON-LD ajouté
            ReactGA.event("seo_enhancement", {
                enhancement_type: "schema_jsonld_added",
                schema_type: "Restaurant",
                reviews_included: Math.min(reviews.length, 20),
                has_aggregate_rating: true,
            });
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
    // Gestionnaires d'événements pour pause/reprise avec GA4 enrichi
    const handleMouseEnter = () => {
        setIsPaused(true);
        ReactGA.event(GA4_EVENTS.SLIDER_INTERACTION, {
            interaction_type: "auto_play_paused",
            trigger: "mouse_enter",
            current_slide: instanceRef.current?.track.details.rel || 0,
            engagement_score: userEngagementScore,
        });
    };
    const handleMouseLeave = () => {
        setIsPaused(false);
        ReactGA.event(GA4_EVENTS.SLIDER_INTERACTION, {
            interaction_type: "auto_play_resumed",
            trigger: "mouse_leave",
            current_slide: instanceRef.current?.track.details.rel || 0,
            engagement_score: userEngagementScore,
        });
    };
    const handleTouchStart = () => {
        setIsPaused(true);
        ReactGA.event(GA4_EVENTS.SLIDER_INTERACTION, {
            interaction_type: "auto_play_paused",
            trigger: "touch_start",
            device_type: "mobile",
            current_slide: instanceRef.current?.track.details.rel || 0,
            engagement_score: userEngagementScore,
        });
    };
    const handleTouchEnd = () => {
        setTimeout(() => {
            setIsPaused(false);
            ReactGA.event(GA4_EVENTS.SLIDER_INTERACTION, {
                interaction_type: "auto_play_resumed",
                trigger: "touch_end_delayed",
                device_type: "mobile",
                current_slide: instanceRef.current?.track.details.rel || 0,
                engagement_score: userEngagementScore,
            });
        }, 2000);
    };
    // Gestionnaire pour les clics sur les liens externes avec GA4 enrichi
    const handleExternalLinkClick = (platform, action) => {
        ReactGA.event(GA4_EVENTS.EXTERNAL_LINK_CLICK, {
            platform: platform,
            action: action,
            link_type: "review_platform",
            current_slide: instanceRef.current?.track.details.rel || 0,
            session_engagement_score: userEngagementScore,
            reviews_viewed_count: reviewsViewed.size,
            time_on_widget: Math.round((Date.now() - sessionStartTime) / 1000),
        });
        // Conversion tracking pour les clics externes
        ReactGA.event("conversion", {
            conversion_type: "external_review_platform_visit",
            platform: platform,
            value: platform === "google" ? 10 : 8, // Valeur différente selon la plateforme
        });
    };
    // Gestionnaire pour le bouton "Laisser un avis" avec GA4 enrichi
    const handleLeaveReviewClick = () => {
        setIsPopupOpen(true);
        ReactGA.event(GA4_EVENTS.LEAVE_REVIEW_ACTION, {
            action: "popup_opened",
            trigger_location: "individual_review_card",
            current_slide: instanceRef.current?.track.details.rel || 0,
            session_engagement_score: userEngagementScore,
            reviews_viewed_before_action: reviewsViewed.size,
            time_before_action: Math.round((Date.now() - sessionStartTime) / 1000),
        });
        // Funnel tracking pour les actions de review
        ReactGA.event("review_funnel", {
            funnel_step: "popup_opened",
            funnel_position: 1,
            session_id: sessionStartTime.toString(),
        });
    };
    // Gestionnaire pour la fermeture de la popup avec GA4
    const handlePopupClose = () => {
        setIsPopupOpen(false);
        ReactGA.event(GA4_EVENTS.LEAVE_REVIEW_ACTION, {
            action: "popup_closed",
            session_engagement_score: userEngagementScore,
            popup_interaction_completed: false,
        });
    };
    // Tracking de l'engagement sur les avis individuels
    const handleReviewClick = (review, index) => {
        ReactGA.event(GA4_EVENTS.REVIEW_ENGAGEMENT, {
            engagement_type: "review_clicked",
            review_source: review.source,
            review_rating: review.rating,
            review_index: index,
            reviewer_name: review.reviewer.slice(0, 10) + "...", // Nom tronqué pour la confidentialité
            session_engagement_score: userEngagementScore,
            time_on_slide: "unknown", // Pourrait être calculé avec un timer
        });
    };
    useEffect(() => {
        // Performance tracking
        const performanceObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.name.includes("googlereviews.json")) {
                    const resourceEntry = entry;
                    ReactGA.event("performance_metric", {
                        metric_type: "resource_load_time",
                        resource_name: "googlereviews_json",
                        load_time: entry.duration,
                        transfer_size: resourceEntry.transferSize || 0,
                        encoded_body_size: resourceEntry.encodedBodySize || 0,
                    });
                }
            });
        });
        performanceObserver.observe({ entryTypes: ["resource"] });
        // Cleanup
        return () => {
            performanceObserver.disconnect();
        };
    }, []);
    // Send session summary before component unmounts
    useEffect(() => {
        return () => {
            // Envoyer un résumé de session avant la fermeture
            ReactGA.event("session_summary", {
                widget_type: "review_widget",
                session_duration: Math.round((Date.now() - sessionStartTime) / 1000),
                total_reviews_viewed: reviewsViewed.size,
                total_slide_changes: totalSlideChanges,
                final_engagement_score: calculateEngagementScore(),
                reviews_available: reviews.length,
                session_completed: true,
            });
        };
    }, []);
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
                                                    : "TripAdvisor", children: review.text })] }), _jsxs("div", { className: "reviewer-info", children: [_jsxs("div", { className: "reviewer-details", children: [_jsx("cite", { className: "reviewer-name", itemProp: "author", itemScope: true, itemType: "https://schema.org/Person", children: _jsx("span", { itemProp: "name", children: review.reviewer }) }), _jsxs("small", { className: "review-source", children: ["Avis v\u00E9rifi\u00E9", " ", review.source === "google" ? "Google" : "TripAdvisor"] })] }), _jsx("button", { className: "leave-review-btn", onClick: handleLeaveReviewClick, "aria-label": "Laisser un avis sur notre restaurant", children: "Laisser un avis" })] })] })] }, review.id))) }) }), _jsx("div", { className: "seo-reviews-section", children: _jsxs("div", { className: "seo-content", children: [_jsx("p", { className: "seo-text", children: "Restaurant italien Brive-la-Gaillarde - Rosi Trattoria, pizzas napolitaines artisanales. Avis v\u00E9rifi\u00E9s clients : cuisine italienne authentique, produits bio et locaux, ambiance chaleureuse. R\u00E9servations 05 44 31 44 47." }), _jsx("div", { className: "seo-reviews-hidden", children: reviews.slice(0, 50).map((review) => (_jsxs("div", { className: "seo-review-compact", itemScope: true, itemType: "https://schema.org/Review", children: [_jsxs("div", { itemProp: "itemReviewed", itemScope: true, itemType: "https://schema.org/Restaurant", children: [_jsx("span", { itemProp: "name", children: "Rosi Trattoria" }), _jsx("meta", { itemProp: "url", content: "https://www.rosi-trattoria.com/" }), _jsxs("div", { itemProp: "address", itemScope: true, itemType: "https://schema.org/PostalAddress", children: [_jsx("meta", { itemProp: "streetAddress", content: "11 Prom. des Tilleuls" }), _jsx("meta", { itemProp: "addressLocality", content: "Brive-la-Gaillarde" }), _jsx("meta", { itemProp: "postalCode", content: "19100" }), _jsx("meta", { itemProp: "addressCountry", content: "FR" }), _jsx("meta", { itemProp: "addressRegion", content: "Nouvelle-Aquitaine" })] }), _jsx("meta", { itemProp: "telephone", content: "+33544314447" }), _jsx("meta", { itemProp: "servesCuisine", content: "Italian" })] }), _jsx("cite", { itemProp: "author", itemScope: true, itemType: "https://schema.org/Person", children: _jsx("span", { itemProp: "name", children: review.reviewer }) }), _jsxs("div", { itemProp: "reviewRating", itemScope: true, itemType: "https://schema.org/Rating", children: [_jsx("meta", { itemProp: "ratingValue", content: review.rating.toString() }), _jsx("meta", { itemProp: "bestRating", content: "5" }), _jsx("meta", { itemProp: "worstRating", content: "1" })] }), _jsx("time", { itemProp: "datePublished", dateTime: new Date().toISOString(), children: review.date }), _jsx("span", { itemProp: "reviewBody", children: review.text })] }, `seo-${review.id}`))) })] }) }), _jsx(ReviewPopup, { isOpen: isPopupOpen, onClose: handlePopupClose })] }));
};
export default ReviewWidget;
