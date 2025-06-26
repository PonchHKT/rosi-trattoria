import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import "./App.css";
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
import { useEffect } from "react";
import SwiperGallery from "./components/Acceuil/SwiperGallery/swipergallery";
import ReviewWidget from "./components/Acceuil/ReviewWidget/reviewwidget";
import CookieManager from "./components/CookieManager/CookieManager";
function App() {
    const location = useLocation();
    // Gestion du scroll uniquement
    useEffect(() => {
        // Scroll vers le haut à chaque changement de route
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [location.pathname]);
    return (_jsxs("div", { className: "App", children: [_jsx(Navbar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsxs(_Fragment, { children: [_jsx(HomeSectionVideo, {}), _jsx(Biographie1, {}), _jsx(VideoPlayer, {}), _jsx(Biographie2, {}), _jsx(SwiperGallery, {}), _jsx(ReviewWidget, {})] }) }), _jsx(Route, { path: "/nos-valeurs/", element: _jsx(NosValeurs, {}) }), _jsx(Route, { path: "/nos-valeurs", element: _jsx(Navigate, { to: "/nos-valeurs/", replace: true }) }), _jsx(Route, { path: "/carte/", element: _jsx(Carte, {}) }), _jsx(Route, { path: "/carte", element: _jsx(Navigate, { to: "/carte/", replace: true }) }), _jsx(Route, { path: "/recrutement/", element: _jsx(Recrutement, {}) }), _jsx(Route, { path: "/recrutement", element: _jsx(Navigate, { to: "/recrutement/", replace: true }) }), _jsx(Route, { path: "/contact/", element: _jsx(Contact, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Navigate, { to: "/contact/", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Page404, {}) })] }), _jsx(Footer, {}), _jsx(CookieManager, {})] }));
}
export default App;
