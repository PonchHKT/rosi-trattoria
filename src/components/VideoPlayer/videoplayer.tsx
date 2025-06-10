import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import "./videoplayer.scss";

interface Video {
  title: string;
  url: string;
}

const VideoPlayer: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const videos: Video[] = [
    { title: "La focaccia chez Rosi", url: "/video/videoacceuil.mp4" },
    { title: "Les pâtes fraiche de Rosi", url: "/video/videoacceuil.mp4" },
    { title: "Les secrets de la pâte Rosi", url: "/video/videoacceuil.mp4" },
    { title: "La téglia et Focaccia de Rosi", url: "/video/videoacceuil.mp4" },
    { title: "Une journée chez Rosi", url: "/video/videoacceuil.mp4" },
    { title: "Capri c'est fini", url: "/video/videoacceuil.mp4" },
    { title: "Les Tiramisu de Rosi", url: "/video/videoacceuil.mp4" },
    { title: "Vidéo 8", url: "/video/videoacceuil.mp4" },
  ];

  // Génération de couleurs de fond pour les thumbnails
  const getThumbnailGradient = (index: number): string => {
    const gradients = [
      "linear-gradient(135deg, #449df0, #ec008c)",
      "linear-gradient(135deg, #ec008c, #449df0)",
      "linear-gradient(135deg, #449df0, #6366f1)",
      "linear-gradient(135deg, #ec008c, #f59e0b)",
      "linear-gradient(135deg, #449df0, #10b981)",
      "linear-gradient(135deg, #ec008c, #8b5cf6)",
      "linear-gradient(135deg, #449df0, #ef4444)",
      "linear-gradient(135deg, #ec008c, #06b6d4)",
    ];
    return gradients[index % gradients.length];
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const changeVideo = (index: number) => {
    setCurrentVideo(index);
    setIsPlaying(false);
    setCurrentTime(0);

    // Force le rechargement de la vidéo
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const nextVideo = () => {
    const next = (currentVideo + 1) % videos.length;
    changeVideo(next);
  };

  const prevVideo = () => {
    const prev = (currentVideo - 1 + videos.length) % videos.length;
    changeVideo(prev);
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Effet pour recharger la vidéo quand l'index change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentVideo]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Auto-show playlist on desktop only
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && !showPlaylist) {
        setShowPlaylist(true);
      } else if (window.innerWidth < 1024) {
        setShowPlaylist(false);
      }
    };

    // Show playlist by default on desktop only
    if (window.innerWidth >= 1024) {
      setShowPlaylist(true);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="video-player">
      <div className="video-player__content">
        {/* Lecteur vidéo principal */}
        <div
          className={`video-player__main ${
            showPlaylist ? "video-player__main--with-playlist" : ""
          }`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={videos[currentVideo].url}
            className="video-player__video"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={nextVideo}
            onClick={togglePlay}
            preload="metadata"
          />

          {/* Overlay de suggestion playlist */}

          {/* Contrôles vidéo */}
          <div
            className={`video-player__controls ${
              showControls ? "video-player__controls--visible" : ""
            }`}
          >
            {/* Titre de la vidéo */}
            <h2 className="video-player__current-title">
              {videos[currentVideo].title}
            </h2>

            {/* Barre de progression */}
            <div className="video-player__progress" onClick={handleSeek}>
              <div
                className="video-player__progress-bar"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="video-player__progress-handle"></div>
              </div>
            </div>

            {/* Contrôles */}
            <div className="video-player__controls-row">
              <div className="video-player__controls-left">
                <button
                  onClick={prevVideo}
                  className="video-player__btn video-player__btn--icon"
                >
                  <SkipBack size={24} />
                </button>

                <button
                  onClick={togglePlay}
                  className="video-player__btn video-player__btn--play"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button
                  onClick={nextVideo}
                  className="video-player__btn video-player__btn--icon"
                >
                  <SkipForward size={24} />
                </button>

                <div className="video-player__volume">
                  <button
                    onClick={toggleMute}
                    className="video-player__btn video-player__btn--small"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="video-player__volume-slider"
                  />
                </div>

                <span className="video-player__time">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="video-player__controls-right">
                <button
                  onClick={toggleFullscreen}
                  className="video-player__btn video-player__btn--small"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist */}
        <div
          className={`video-player__playlist ${
            showPlaylist ? "video-player__playlist--visible" : ""
          } `}
        >
          <div className="video-player__playlist-header">
            <h3 className="video-player__playlist-title">
              Vidéos ({videos.length})
            </h3>
          </div>

          <div className="video-player__playlist-content">
            {videos.map((video, index) => (
              <div
                key={index}
                onClick={() => {
                  changeVideo(index);
                }}
                className={`video-player__playlist-item ${
                  currentVideo === index
                    ? "video-player__playlist-item--active"
                    : ""
                }`}
              >
                {/* Thumbnail personnalisé */}
                <div
                  className="video-player__thumbnail"
                  style={{ background: getThumbnailGradient(index) }}
                >
                  <div className="video-player__thumbnail-overlay"></div>
                  <div className="video-player__thumbnail-number">
                    {index + 1}
                  </div>
                  {currentVideo === index && (
                    <div className="video-player__thumbnail-playing">
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </div>
                  )}
                </div>

                <div className="video-player__playlist-item-content">
                  <h4 className="video-player__playlist-item-title">
                    {video.title}
                  </h4>
                  <p className="video-player__playlist-item-meta">
                    Rosi Trattoria
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Playlist toggle pour mobile */}
      <div className="video-player__mobile-toggle">
        <button
          onClick={togglePlaylist}
          className="video-player__btn video-player__btn--mobile"
        >
          {showPlaylist ? "Masquer la playlist" : "Afficher la playlist"}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
