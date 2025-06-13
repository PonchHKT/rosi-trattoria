import "./App.css";
import Biographie1 from "./components/Acceuil/Biographie1/biographie1";
import Biographie2 from "./components/Acceuil/Biographie2/biographie2";
import Footer from "./components/Acceuil/Footer/footer";
import HomeSectionVideo from "./components/Acceuil/HomeVideoSection/homevideosection";
import Navbar from "./components/Acceuil/Navbar/navbar";
import ReviewWidget from "./components/Acceuil/ReviewWidget/reviewwidget";
import VideoPlayer from "./components/Acceuil/VideoPlayer/videoplayer";
import { Routes, Route, useLocation } from "react-router-dom";
import NosValeurs from "./pages/NosValeurs";
import Carte from "./pages/Carte";
import Recrutement from "./pages/Recrutement";
import Contact from "./pages/Contact";
import { useEffect } from "react";
import SwiperGallery from "./components/Acceuil/SwiperGallery/swipergallery";

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // Trigger effect when pathname changes

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomeSectionVideo />
              <Biographie1 />

              <VideoPlayer />

              <Biographie2 />
              <SwiperGallery />
              <ReviewWidget />
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
