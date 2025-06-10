import React, { useState } from "react";
import "./ReviewWidget.scss";

interface Review {
  reviewer: string;
  rating: number;
  date: string;
  title: string;
  text: string;
}

const ReviewWidget: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews: Review[] = [
    {
      reviewer: "Connector49161720724",
      rating: 5,
      date: "Mai 2025",
      title: "Super moment",
      text: "Super expérience au restaurant Rosi ! La cuisine est excellente, le cadre agréable…mais le vrai coup de cœur, c’est la serveuse Isaure ! TOPISSIME du début à la fin : accueillante, souriante, ultra pro et super attentionnée. Elle a clairement rendu notre repas encore plus agréable. Merci ..",
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
      title: "FAVORABLE, J’AIME LES GENS ET LA GENTILLESSE",
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

  const nextSlide = () => {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="review-widget">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/02/TripAdvisor_Logo.svg"
        alt="TripAdvisor Logo"
        className="logo"
      />
      <h2>TRIPADVISOR TEST</h2>
      <div className="carousel"
        <div
          className="reviews-container"
          style={{ transform: `translateX(-${currentIndex * 70}vw)` }}
        >
          {reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="rating">
                {Array.from({ length: review.rating }, (_, i) => (
                  <div key={i} className="dot"></div>
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
        <div className="arrows">
          <button
            className="prev"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            ❮
          </button>
          <button
            className="next"
            onClick={nextSlide}
            disabled={currentIndex === reviews.length - 1}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewWidget;
