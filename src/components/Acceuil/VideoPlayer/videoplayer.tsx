import { useState, useRef, useEffect, useCallback } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import ReactGA from "react-ga4";
import "./videoplayer.scss";

interface Video {
  title: string;
  url: string;
  thumbnail: string;
}

// Optimized GA4 events with snake_case convention
const GA4_EVENTS = {
  // User engagement events
  VIDEO_PLAY_START: "videoplayer_play_start",
  VIDEO_COMPLETION: "videoplayer_completion",
  VIDEO_ENGAGEMENT: "videoplayer_engagement",

  // Significant user actions
  VIDEO_SWITCH: "videoplayer_switch",
  PLAYLIST_TOGGLE: "videoplayer_playlist_toggle",
  FULLSCREEN_TOGGLE: "videoplayer_fullscreen_toggle",

  // Critical technical errors
  VIDEO_LOAD_ERROR: "videoplayer_load_error",
};

const VideoPlayer: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState<boolean>(false);
  const [hasTrackedEngagement, setHasTrackedEngagement] =
    useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const engagementTimerRef = useRef<NodeJS.Timeout | null>(null);

  const videos: Video[] = [
    {
      title: "Présentation de Rosi Trattoria",
      url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosipresentation.mp4",
      thumbnail: "/images/thumbnails/presentation-rosi-trattoria.png",
    },
    {
      title: "La focaccia chez Rosi",
      url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosifocaccia.mp4",
      thumbnail: "/images/thumbnails/la-forracia-chez-rosi.png",
    },
    {
      title: "Les pâtes fraiche de Rosi",
      url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosipatefraiche.mp4",
      thumbnail: "/images/thumbnails/pates-fraiche-rosi.png",
    },
    {
      title: "Les secrets de la pâte Rosi",
      url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosisecretspates.mp4",
      thumbnail: "/images/thumbnails/secrets-de-la-pate-rosi.png",
    },
    {
      title: "La téglia et Focaccia de Rosi",
      url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rositegliafoccacia.mp4",
      thumbnail: "/images/thumbnails/teglia-et-foraccia-de-rosi.png",
    },
    {
      title: "Capri c'est fini",
      url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosicapri.mp4",
      thumbnail: "/images/thumbnails/rosi-capri.png",
    },
    {
      title: "Les Tiramisu de Rosi",
      url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rositiramistu.mp4",
      thumbnail: "/images/thumbnails/tiramisu-de-rosi.png",
    },
    {
      title: "Les cocktails de Rosi",
      url: "https://pub-c0cb6a1e942a4d729260f30a324399ae.r2.dev/Vid%C3%A9o%20Rosi/rosicocktail.mp4",
      thumbnail: "/images/thumbnails/les-cocktails-rosi.png",
    },
  ];

  const isMobile = useCallback(() => {
    return (
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            ReactGA.event(GA4_EVENTS.VIDEO_PLAY_START, {
              video_title: videos[currentVideo].title,
              video_index: currentVideo,
              device_type: isMobile() ? "mobile" : "desktop",
              page_name: "video_player",
            });
            if (!hasTrackedEngagement) {
              engagementTimerRef.current = setTimeout(() => {
                ReactGA.event(GA4_EVENTS.VIDEO_ENGAGEMENT, {
                  video_title: videos[currentVideo].title,
                  video_index: currentVideo,
                  engagement_duration: 10000,
                  device_type: isMobile() ? "mobile" : "desktop",
                  page_name: "video_player",
                });
                setHasTrackedEngagement(true);
              }, 10000);
            }
            activateFullscreenOnMobile();
          })
          .catch((error) => {
            console.error("Play failed:", error);
            ReactGA.event(GA4_EVENTS.VIDEO_LOAD_ERROR, {
              video_title: videos[currentVideo].title,
              video_index: currentVideo,
              device_type: isMobile() ? "mobile" : "desktop",
              error_type: "play_failed",
              page_name: "video_player",
            });
          });
      }
    }
  }, [isPlaying, currentVideo, hasTrackedEngagement, videos, isMobile]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        videoRef.current.muted = newVolume === 0;
        setIsMuted(newVolume === 0);
      }
    },
    []
  );

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleVideoError = useCallback(() => {
    ReactGA.event(GA4_EVENTS.VIDEO_LOAD_ERROR, {
      video_title: videos[currentVideo].title,
      video_index: currentVideo,
      device_type: isMobile() ? "mobile" : "desktop",
      error_type: "video_load_failed",
      page_name: "video_player",
    });
  }, [currentVideo, videos, isMobile]);

  const setStartTime = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      try {
        videoRef.current.currentTime = 0.01;
        setCurrentTime(0.01);
        setIsInitialized(true);

        if (shouldAutoPlay) {
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              ReactGA.event(GA4_EVENTS.VIDEO_PLAY_START, {
                video_title: videos[currentVideo].title,
                video_index: currentVideo,
                device_type: isMobile() ? "mobile" : "desktop",
                page_name: "video_player",
              });
              activateFullscreenOnMobile();
            })
            .catch((error) => {
              console.error("Autoplay failed:", error);
              ReactGA.event(GA4_EVENTS.VIDEO_LOAD_ERROR, {
                video_title: videos[currentVideo].title,
                video_index: currentVideo,
                device_type: isMobile() ? "mobile" : "desktop",
                error_type: "autoplay_failed",
                page_name: "video_player",
              });
            })
            .finally(() => {
              setShouldAutoPlay(false);
            });
        }
      } catch (error) {
        console.warn("Could not set start time:", error);
        videoRef.current.currentTime = 0;
        setCurrentTime(0);
        setIsInitialized(true);

        if (shouldAutoPlay) {
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              ReactGA.event(GA4_EVENTS.VIDEO_PLAY_START, {
                video_title: videos[currentVideo].title,
                video_index: currentVideo,
                device_type: isMobile() ? "mobile" : "desktop",
                page_name: "video_player",
              });
              activateFullscreenOnMobile();
            })
            .catch((error) => {
              console.error("Autoplay failed:", error);
              ReactGA.event(GA4_EVENTS.VIDEO_LOAD_ERROR, {
                video_title: videos[currentVideo].title,
                video_index: currentVideo,
                device_type: isMobile() ? "mobile" : "desktop",
                error_type: "autoplay_failed",
                page_name: "video_player",
              });
            })
            .finally(() => {
              setShouldAutoPlay(false);
            });
        }
      }
    }
  }, [shouldAutoPlay, currentVideo, videos, isMobile]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    },
    [duration]
  );

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const activateFullscreenOnMobile = useCallback(async () => {
    if (!isMobile()) return;

    try {
      const video = videoRef.current;
      if (!video) return;

      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      } else if ((video as any).webkitEnterFullscreen) {
        (video as any).webkitEnterFullscreen();
      } else if ((video as any).mozRequestFullScreen) {
        (video as any).mozRequestFullScreen();
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen();
      }
    } catch (error) {
      console.warn("Mobile fullscreen failed:", error);
    }
  }, [isMobile]);

  const changeVideo = useCallback(
    (index: number, autoPlay: boolean = false) => {
      setCurrentVideo(index);
      setCurrentTime(0);
      setIsInitialized(false);
      setIsPlaying(false);
      setShouldAutoPlay(autoPlay);
      setHasTrackedEngagement(false);

      ReactGA.event(GA4_EVENTS.VIDEO_SWITCH, {
        video_title: videos[index].title,
        video_index: index,
        device_type: isMobile() ? "mobile" : "desktop",
        page_name: "video_player",
        switch_trigger: autoPlay ? "auto" : "user",
      });

      if (videoRef.current) {
        videoRef.current.load();
        const handleCanPlay = () => {
          if (videoRef.current) {
            setStartTime();
            videoRef.current.removeEventListener("canplay", handleCanPlay);
          }
        };
        videoRef.current.addEventListener("canplay", handleCanPlay);
      }
    },
    [videos, isMobile, setStartTime]
  );

  const nextVideo = useCallback(() => {
    const next = (currentVideo + 1) % videos.length;
    changeVideo(next);
  }, [currentVideo, videos.length, changeVideo]);

  const prevVideo = useCallback(() => {
    const prev = (currentVideo - 1 + videos.length) % videos.length;
    changeVideo(prev);
  }, [currentVideo, videos.length, changeVideo]);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    ReactGA.event(GA4_EVENTS.VIDEO_COMPLETION, {
      video_title: videos[currentVideo].title,
      video_index: currentVideo,
      device_type: isMobile() ? "mobile" : "desktop",
      page_name: "video_player",
      duration: duration,
    });
  }, [currentVideo, videos, duration, isMobile]);

  const toggleFullscreen = useCallback(async () => {
    try {
      const video = videoRef.current;
      const player = playerRef.current;

      if (!video) return;

      const isCurrentlyFullscreen =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;

      ReactGA.event(GA4_EVENTS.FULLSCREEN_TOGGLE, {
        video_title: videos[currentVideo].title,
        video_index: currentVideo,
        device_type: isMobile() ? "mobile" : "desktop",
        page_name: "video_player",
        fullscreen_state: isCurrentlyFullscreen ? "exit" : "enter",
      });

      if (isCurrentlyFullscreen) {
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
        try {
          if (video.requestFullscreen) {
            await video.requestFullscreen();
          } else if ((video as any).webkitRequestFullscreen) {
            (video as any).webkitRequestFullscreen();
          } else if ((video as any).webkitEnterFullscreen) {
            (video as any).webkitEnterFullscreen();
          } else if ((video as any).mozRequestFullScreen) {
            (video as any).mozRequestFullScreen();
          } else if ((video as any).msRequestFullscreen) {
            (video as any).msRequestFullscreen();
          }
        } catch (videoError) {
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
      setIsFullscreen(!isFullscreen);
    }
  }, [currentVideo, videos, isMobile, isFullscreen]);

  const togglePlaylist = useCallback(() => {
    setShowPlaylist(!showPlaylist);
    ReactGA.event(GA4_EVENTS.PLAYLIST_TOGGLE, {
      video_title: videos[currentVideo].title,
      video_index: currentVideo,
      device_type: isMobile() ? "mobile" : "desktop",
      page_name: "video_player",
      playlist_state: !showPlaylist ? "open" : "close",
    });
  }, [showPlaylist, currentVideo, videos, isMobile]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedData = () => {
      if (!isInitialized && video.readyState >= 2) {
        setStartTime();
      }
    };
    const handleLoadedMetadataEvent = () => {
      if (!isInitialized) {
        setTimeout(() => {
          setStartTime();
        }, 100);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("loadedmetadata", handleLoadedMetadataEvent);
    video.addEventListener("error", handleVideoError);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("loadedmetadata", handleLoadedMetadataEvent);
      video.removeEventListener("error", handleVideoError);
    };
  }, [isInitialized, handleVideoError, setStartTime]);

  useEffect(() => {
    if (videoRef.current && !isInitialized) {
      const video = videoRef.current;
      if (video.readyState >= 2) {
        setStartTime();
      } else {
        const handleInitialLoad = () => {
          setStartTime();
          video.removeEventListener("loadeddata", handleInitialLoad);
        };
        video.addEventListener("loadeddata", handleInitialLoad);
        return () => video.removeEventListener("loadeddata", handleInitialLoad);
      }
    }
  }, [isInitialized, setStartTime]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (engagementTimerRef.current) {
        clearTimeout(engagementTimerRef.current);
      }
    };
  }, []);

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
  }, [showPlaylist]);

  return (
    <div
      ref={playerRef}
      className={`video-player ${
        isFullscreen ? "video-player--fullscreen" : ""
      }`}
      role="application"
      aria-label="Lecteur vidéo Rosi Trattoria"
    >
      <div className="video-player__content">
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
            onEnded={handleVideoEnded}
            onClick={togglePlay}
            preload="metadata"
            playsInline
            muted={isMuted}
            webkit-playsinline="true"
            x-webkit-airplay="allow"
            aria-label={`Vidéo: ${videos[currentVideo].title}`}
          >
            <source src={videos[currentVideo].url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div
            className={`video-player__controls ${
              showControls ? "video-player__controls--visible" : ""
            }`}
            role="toolbar"
            aria-label="Contrôles de lecture vidéo"
          >
            <h2 className="video-player__current-title">
              {videos[currentVideo].title}
            </h2>

            <div
              className="video-player__progress"
              onClick={handleSeek}
              role="slider"
              aria-label="Barre de progression de la vidéo"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              aria-valuetext={`${formatTime(currentTime)} sur ${formatTime(
                duration
              )}`}
              tabIndex={0}
            >
              <div
                className="video-player__progress-bar"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="video-player__progress-handle"></div>
              </div>
            </div>

            <div className="video-player__controls-row">
              <div className="video-player__controls-left">
                <button
                  onClick={prevVideo}
                  className="video-player__btn video-player__btn--icon"
                  aria-label="Vidéo précédente"
                  title="Vidéo précédente"
                >
                  <SkipBack size={24} />
                </button>

                <button
                  onClick={togglePlay}
                  className="video-player__btn video-player__btn--play"
                  aria-label={isPlaying ? "Mettre en pause" : "Lire la vidéo"}
                  title={isPlaying ? "Mettre en pause" : "Lire la vidéo"}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button
                  onClick={nextVideo}
                  className="video-player__btn video-player__btn--icon"
                  aria-label="Vidéo suivante"
                  title="Vidéo suivante"
                >
                  <SkipForward size={24} />
                </button>

                <div className="video-player__volume">
                  <button
                    onClick={toggleMute}
                    className="video-player__btn video-player__btn--small"
                    aria-label={isMuted ? "Activer le son" : "Couper le son"}
                    title={isMuted ? "Activer le son" : "Couper le son"}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <label htmlFor="volume-slider" className="sr-only">
                    Volume
                  </label>
                  <input
                    id="volume-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="video-player__volume-slider"
                    aria-label={`Volume: ${Math.round(volume * 100)}%`}
                    title={`Volume: ${Math.round(volume * 100)}%`}
                  />
                </div>

                <span className="video-player__time" aria-live="polite">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="video-player__controls-right">
                <button
                  onClick={toggleFullscreen}
                  className="video-player__btn video-player__btn--small"
                  aria-label={
                    isFullscreen ? "Quitter le plein écran" : "Plein écran"
                  }
                  title={
                    isFullscreen ? "Quitter le plein écran" : "Plein écran"
                  }
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`video-player__playlist ${
            showPlaylist ? "video-player__playlist--visible" : ""
          }`}
          role="region"
          aria-label="Liste de lecture"
        >
          <div className="video-player__playlist-header">
            <h3 className="video-player__playlist-title">
              Vidéos ({videos.length})
            </h3>
          </div>

          <div
            className="video-player__playlist-content"
            role="list"
            aria-label="Liste des vidéos disponibles"
          >
            {videos.map((video, index) => (
              <div
                key={index}
                onClick={() => changeVideo(index, true)}
                className={`video-player__playlist-item ${
                  currentVideo === index
                    ? "video-player__playlist-item--active"
                    : ""
                }`}
                role="listitem"
                tabIndex={0}
                aria-label={`${video.title} - ${
                  currentVideo === index
                    ? "En cours de lecture"
                    : "Cliquer pour lire"
                }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    changeVideo(index, true);
                  }
                }}
              >
                <div className="video-player__thumbnail">
                  <LazyLoadImage
                    src={video.thumbnail}
                    alt={`Miniature de ${video.title}`}
                    className="video-player__thumbnail-image"
                    effect="blur"
                    width="120"
                    height="68"
                    threshold={100}
                    placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='68' viewBox='0 0 120 68'%3E%3Crect width='120' height='68' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='12' fill='%23999'%3EChargement...%3C/text%3E%3C/svg%3E"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = document.createElement("div");
                      fallback.className = "video-player__thumbnail-fallback";
                      fallback.textContent = "Image non disponible";
                      target.parentNode?.appendChild(fallback);
                    }}
                  />
                  <div className="video-player__thumbnail-overlay"></div>
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

      <div className="video-player__mobile-toggle">
        <button
          onClick={togglePlaylist}
          className="video-player__btn video-player__btn--mobile"
          aria-label={
            showPlaylist
              ? "Masquer la liste de lecture"
              : "Afficher la liste de lecture"
          }
          title={
            showPlaylist
              ? "Masquer la liste de lecture"
              : "Afficher la liste de lecture"
          }
        >
          {showPlaylist ? "Masåquer" : "Voir plus"}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
