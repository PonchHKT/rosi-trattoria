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

// Note: Ensure your HTML <head> includes the following viewport meta tag for consistent rendering across devices:
// <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

interface Video {
  title: string;
  url: string;
  thumbnail: string;
}

const VideoPlayer: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0.02);
  const [duration, setDuration] = useState<number>(0);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const videos: Video[] = [
    {
      title: "La focaccia chez Rosi",
      url: "https://res.cloudinary.com/dc5jx2yo7/video/upload/q_auto,f_mp4/v1749570162/egp8n38xx3wmpyg42jnx.mp4",
      thumbnail: "/images/thumbnails/la-forracia-chez-rosi.png",
    },
    {
      title: "Les pâtes fraiche de Rosi",
      url: "https://res.cloudinary.com/dc5jx2yo7/video/upload/q_auto,f_mp4/v1749570162/egp8n38xx3wmpyg42jnx.mp4",
      thumbnail: "/images/thumbnails/pates-fraiche-rosi.png",
    },
    {
      title: "Les secrets de la pâte Rosi",
      url: "https://res.cloudinary.com/dc5jx2yo7/video/upload/q_auto,f_mp4/v1749570162/egp8n38xx3wmpyg42jnx.mp4",
      thumbnail: "/images/thumbnails/secrets-de-la-pate-rosi.png",
    },
    {
      title: "La téglia et Focaccia de Rosi",
      url: "https://res.cloudinary.com/dc5jx2yo7/video/upload/q_auto,f_mp4/v1749570162/egp8n38xx3wmpyg42jnx.mp4",
      thumbnail: "/images/thumbnails/teglia-et-foraccia-de-rosi.png",
    },
    {
      title: "Capri c'est fini",
      url: "https://res.cloudinary.com/dc5jx2yo7/video/upload/q_auto,f_mp4/v1749570162/egp8n38xx3wmpyg42jnx.mp4",
      thumbnail: "/images/thumbnails/rosi-capri.png",
    },
    {
      title: "Les Tiramisu de Rosi",
      url: "https://res.cloudinary.com/dc5jx2yo7/video/upload/q_auto,f_mp4/v1749570162/egp8n38xx3wmpyg42jnx.mp4",
      thumbnail: "/images/thumbnails/tiramisu-de-rosi.png",
    },
    {
      title: "Présentation de Rosi Trattoria",
      url: "https://res.cloudinary.com/dc5jx2yo7/video/upload/q_auto,f_mp4/v1749570162/egp8n38xx3wmpyg42jnx.mp4",
      thumbnail: "/images/thumbnails/presentation-rosi-trattoria.png",
    },
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Play failed:", error);
        });
        setIsPlaying(true);
      }
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
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
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
      if (!isInitialized) {
        videoRef.current.currentTime = 0.02;
        setCurrentTime(0.02);
        setIsInitialized(true);
      }
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
    setCurrentTime(0.02);
    setIsInitialized(false);
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

  // Fonction plein écran améliorée pour mobile
  const toggleFullscreen = async () => {
    try {
      const video = videoRef.current;
      const player = playerRef.current;

      if (!video) return;

      // Vérifier si on est déjà en plein écran
      const isCurrentlyFullscreen =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;

      if (isCurrentlyFullscreen) {
        // Sortir du plein écran
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      } else {
        // Entrer en plein écran
        // Essayer d'abord avec la vidéo elle-même (meilleur pour mobile)
        try {
          if (video.requestFullscreen) {
            await video.requestFullscreen();
          } else if ((video as any).webkitRequestFullscreen) {
            (video as any).webkitRequestFullscreen();
          } else if ((video as any).webkitEnterFullscreen) {
            // Spécifique à iOS Safari
            (video as any).webkitEnterFullscreen();
          } else if ((video as any).mozRequestFullScreen) {
            (video as any).mozRequestFullScreen();
          } else if ((video as any).msRequestFullscreen) {
            (video as any).msRequestFullscreen();
          }
        } catch (videoError) {
          // Si le plein écran sur la vidéo échoue, essayer avec le conteneur
          if (player) {
            if (player.requestFullscreen) {
              await player.requestFullscreen();
            } else if ((player as any).webkitRequestFullscreen) {
              (player as any).webkitRequestFullscreen();
            } else if ((player as any).mozRequestFullScreen) {
              (player as any).mozRequestFullScreen();
            } else if ((player as any).msRequestFullscreen) {
              (player as any).msRequestFullscreen();
            }
          }
        }
      }
    } catch (error) {
      console.warn("Fullscreen not supported or failed:", error);

      // Fallback pour les appareils qui ne supportent pas le plein écran
      // On peut implémenter un plein écran "simulé" en CSS
      setIsFullscreen(!isFullscreen);
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

  // Détecter les changements de plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  // Gestion des événements vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedData = () => {
      if (!isInitialized && video.readyState >= 2) {
        video.currentTime = 0.02;
        setCurrentTime(0.02);
        setIsInitialized(true);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadeddata", handleLoadedData);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [currentVideo, isInitialized]);

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

    if (window.innerWidth >= 1024) {
      setShowPlaylist(true);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={playerRef}
      className={`video-player ${
        isFullscreen ? "video-player--fullscreen" : ""
      }`}
    >
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
            playsInline
            muted={isMuted}
            // Attributs pour un meilleur support mobile
            webkit-playsinline="true"
            x-webkit-airplay="allow"
          >
            <source src={videos[currentVideo].url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

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
                  title="Plein écran"
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
                {/* Thumbnail avec image */}
                <div className="video-player__thumbnail">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="video-player__thumbnail-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.add(
                        "video-player__thumbnail-fallback"
                      );
                    }}
                  />
                  <div className="video-player__thumbnail-overlay"></div>

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
