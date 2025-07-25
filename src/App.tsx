import React, { useEffect } from "react";

import Biographie1 from "./components/Acceuil/Biographie1/biographie1";
import Biographie2 from "./components/Acceuil/Biographie2/biographie2";
import Footer from "./components/Acceuil/Footer/footer";
import HomeSectionVideo from "./components/Acceuil/HomeVideoSection/homevideosection";
import Navbar from "./components/Acceuil/Navbar/navbar";
import VideoPlayer from "./components/Acceuil/VideoPlayer/videoplayer";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import NosValeurs from "./pages/NosValeurs";
import Carte from "./pages/Carte";
import Recrutement from "./pages/Recrutement";
import Contact from "./pages/Contact";
import Page404 from "./pages/Page404";
import SwiperGallery from "./components/Acceuil/SwiperGallery/swipergallery";
import ReviewWidget from "./components/Acceuil/ReviewWidget/reviewwidget";
import CookieManager from "./components/CookieManager/CookieManager";
import "./index.css";

function App(): React.JSX.Element {
  const location = useLocation();

  // Scroll vers le haut à chaque changement de route
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="App">
      <Navbar />

      <Routes>
        {/* Page d'accueil */}
        <Route
          path="/"
          element={
            <>
              <div className="home-video-section">
                <HomeSectionVideo pageName="Accueil" />
              </div>
              <Biographie1 />
              <SwiperGallery pageName="Accueil" />
              <VideoPlayer />

              <Biographie2 />
              <ReviewWidget pageName="Accueil" />
            </>
          }
        />

        {/* Routes principales avec et sans slash final */}
        <Route path="/nos-valeurs/" element={<NosValeurs />} />
        <Route
          path="/nos-valeurs"
          element={<Navigate to="/nos-valeurs/" replace />}
        />

        <Route path="/carte/" element={<Carte />} />
        <Route path="/carte" element={<Navigate to="/carte/" replace />} />

        <Route path="/recrutement/" element={<Recrutement />} />
        <Route
          path="/recrutement"
          element={<Navigate to="/recrutement/" replace />}
        />

        <Route path="/contact/" element={<Contact />} />
        <Route path="/contact" element={<Navigate to="/contact/" replace />} />

        {/* Page 404 pour toutes les autres routes */}
        <Route path="*" element={<Page404 />} />
      </Routes>

      <Footer />
      <CookieManager />
    </div>
  );
}

export default App;
