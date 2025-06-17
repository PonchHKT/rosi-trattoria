import "./App.css";
import Biographie1 from "./components/Acceuil/Biographie1/biographie1";
import Biographie2 from "./components/Acceuil/Biographie2/biographie2";
import Footer from "./components/Acceuil/Footer/footer";
import HomeSectionVideo from "./components/Acceuil/HomeVideoSection/homevideosection";
import Navbar from "./components/Acceuil/Navbar/navbar";
import VideoPlayer from "./components/Acceuil/VideoPlayer/videoplayer";
import { Routes, Route, useLocation } from "react-router-dom";
import NosValeurs from "./pages/NosValeurs";
import Carte from "./pages/Carte";
import Recrutement from "./pages/Recrutement";
import Contact from "./pages/Contact";
import { useEffect } from "react";
import SwiperGallery from "./components/Acceuil/SwiperGallery/swipergallery";
import ReviewWidget from "./components/Acceuil/ReviewWidget/reviewwidget";
import AnimatedSection from "./components/Acceuil/AnimatedSection/AnimatedSection";

import React from "react";

function App(): React.JSX.Element {
  const location = useLocation();

  // Solution robuste pour le scroll au top
  useEffect(() => {
    // Méthode 1: Scroll immédiat sur tous les éléments possibles
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Méthode 2: Forcer après le rendu des composants
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto" as ScrollBehavior,
      });

      // Au cas où il y aurait un container avec overflow
      const appElement = document.querySelector(".App") as HTMLElement;
      if (appElement) {
        appElement.scrollTop = 0;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomeSectionVideo />

              <AnimatedSection
                animationType="bio-slide-left"
                delay={150}
                threshold={0.15}
              >
                <Biographie1 />
              </AnimatedSection>

              <AnimatedSection
                animationType="fade-in-scale"
                delay={200}
                threshold={0.3}
              >
                <VideoPlayer />
              </AnimatedSection>

              <AnimatedSection
                animationType="bio-slide-right"
                delay={150}
                threshold={0.15}
              >
                <Biographie2 />
              </AnimatedSection>

              <AnimatedSection
                animationType="card-animate"
                delay={100}
                threshold={0.3}
              >
                <ReviewWidget />
              </AnimatedSection>

              <AnimatedSection
                animationType="scroll-animate"
                delay={250}
                threshold={0.2}
                staggerDelay={2}
              >
                <SwiperGallery />
              </AnimatedSection>
            </>
          }
        />
        <Route path="/nos-valeurs" element={<NosValeurs />} />
        <Route path="/carte" element={<Carte />} />
        <Route path="/recrutement" element={<Recrutement />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
