import "./App.css";
import Biographie1 from "./components/Biographie1/biographie1";
import Biographie2 from "./components/Biographie2/biographie2";
import HomeSectionVideo from "./components/HomeVideoSection/homevideosection";
import Navbar from "./components/Navbar/navbar";
import ReviewWidget from "./components/ReviewWidget/reviewwidget";
import VideoPlayer from "./components/VideoPlayer/videoplayer";

function App() {
  return (
    <>
      <div className="App">
        <Navbar />
        <HomeSectionVideo />
        <Biographie1 />
        <VideoPlayer />
        <Biographie2 />
        <ReviewWidget />
      </div>
    </>
  );
}

export default App;
