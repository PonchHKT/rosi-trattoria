import React from "react";
import MenuDisplay from "../components/Carte/MenuDisplay/menudisplay";
import Swipergallery from "../components/Acceuil/SwiperGallery/swipergallery";

const Carte: React.FC = () => {
  return (
    <>
      <MenuDisplay />
      <Swipergallery />
    </>
  );
};

export default Carte;
