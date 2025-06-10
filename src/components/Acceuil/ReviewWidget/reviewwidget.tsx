import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./reviewwidget.scss";

interface Review {
  reviewer: string;
  rating: number;
  date: string;
  title: string;
  text: string;
}

const reviews: Review[] = [
  {
    reviewer: "Connector49161720724",
    rating: 5,
    date: "Mai 2025",
    title: "Super moment",
    text: "Les fesses de Lucas sont incroyables, les pizzas sont excellentes et le service est au top ! Merci à Isaure pour son accueil chaleureux et sa bonne humeur. Nous avons passé un super moment en famille.",
  },
  {
    reviewer: "Famille P",
    rating: 5,
    date: "Juin 2025",
    title: "2 eme avis toujours enthousiaste!!!",
    text: "2eme visite pour nous, et toujours un accueil aussi chaleureux et sympathique malgré une arrivée tardive (21:15). Nous avons été bien reçus, et servis rapidement. Les pizzas sont savoureuses et généreuses, le personnel souriant et agréable !",
  },
  {
    reviewer: "Lauryla",
    rating: 5,
    date: "Avril 2025",
    title: "MERCI !",
    text: "Cadre très agréable et chaleureux, accueil sympathique, service impeccable, pizza et pâtes délicieuses, sans oublier les beignets de fleurs de courgettes. Cerise sur le gâteau : les toilettes disco 🪩. Merci à toute l'équipe! Nous reviendrons !",
  },
  {
    reviewer: "Josie Grassett",
    rating: 5,
    date: "Mai 2025",
    title: "FAVORABLE, J'AIME LES GENS ET LA GENTILLESSE",
    text: "Endroit sympa. Venue plusieurs fois Trés bonnes pizzas. Super tiramissu. Uhuh. Trés bonne restauration certes mais aussi lsaure est particulièrement dans son élément, compétente, gentillesse, humour à gogo, sourire 😊 qu'est-ce que fait du bien! Josie.",
  },
  {
    reviewer: "Sylvie P",
    rating: 4,
    date: "Mai 2025",
    title: "Très bon restaurant italien",
    text: "Excellente pizza 🍕 très bon accueil et un grand merci à Isaure qui est de très bon conseil et très agréable 😊 je recommande",
  },
];

const ReviewWidget: React.FC = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 0,
    },
    range: {
      min: -50,
      max: 50,
    },
    rubberband: false,
  });

  return (
    <div className="review-widget">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/02/TripAdvisor_Logo.svg"
        alt="TripAdvisor Logo"
        className="logo"
      />
      <h2>Composant "Simulé" en attente du widget officiel </h2>
      <div className="review-cta">
        <a
          href="https://www.tripadvisor.fr/UserReviewEdit-g196612-d23792112-Rosi_Trattoria-Brive_la_Gaillarde_Correze_Nouvelle_Aquitaine.html"
          target="_blank"
          rel="noopener noreferrer"
          className="review-button"
        >
          ⭐ Laisser un avis sur TripAdvisor
        </a>
      </div>
      <div ref={sliderRef} className="keen-slider">
        {reviews.map((review, index) => (
          <div key={index} className="keen-slider__slide review-item">
            <div className="rating">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span className="dot" key={i} />
              ))}
            </div>
            <div className="reviewer-info">
              <span className="reviewer-name">{review.reviewer}</span>
              <span className="review-date">Visité en {review.date}</span>
            </div>
            <h3 className="review-title">{review.title}</h3>
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewWidget;
