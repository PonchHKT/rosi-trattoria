import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Snowfall from "react-snowfall";
import MenuDisplay from "../components/Carte/MenuDisplay/menudisplay";
const Carte = () => {
    return (_jsxs(_Fragment, { children: [_jsx(Snowfall, { color: "#75b9f9", snowflakeCount: 30, speed: [0.3, 0.8], wind: [-0.3, 0.3], radius: [0.5, 1.5], style: {
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    zIndex: 100,
                    opacity: 0.6,
                } }), _jsx(Snowfall, { color: "rgb(236, 0, 140)", snowflakeCount: 20, speed: [0.4, 1.0], wind: [-0.2, 0.4], radius: [0.3, 1.0], style: {
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    zIndex: 100,
                    opacity: 0.4,
                } }), _jsx(Snowfall, { color: "#ffffff", snowflakeCount: 15, speed: [0.2, 0.6], wind: [-0.1, 0.2], radius: [0.8, 2.0], style: {
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    zIndex: 100,
                    opacity: 0.3,
                } }), _jsx(MenuDisplay, {})] }));
};
export default Carte;
