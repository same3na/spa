"use client"; 
import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { usePlayer } from "@/context/PlayerContext";
import { Song } from "@/api/songs";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import Playlist from "./PlaylistComponent";

const Player = () => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);

  const { song, playlist, setSong, isPlaying, setIsPlaying } = usePlayer();
  
  const opts = {
    playerVars: {
      autoplay: 1,
    },
  };

  const extractVideoId = (song: any) => {
    if (!song) return null;
    const match = song.external_url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const findVideoIndexInPlaylist = (song: Song): { songIndex: number } | null => {
    const indexInArray = playlist.findIndex(s => s.id === song.id);
    if (indexInArray !== -1) {
      return { songIndex: indexInArray };
    }
    return null;
  };

  const onPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(updateProgress, 500); // Update every 500ms
  }

  const updateProgress = () => {
    if (!playerRef.current) return

    const currentTime = playerRef.current.getCurrentTime()

    setProgress(duration ? (currentTime / duration) * 100 : 0)
  }

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
    event.target.playVideo();
  };

  const onEnd = () => {
    if (!song) return;

    const result = findVideoIndexInPlaylist(song);
    if (result) {
      setSong(playlist[result.songIndex + 1]);
    }
  };

  const nextVideo = () => {
    if (!song) return;

    const currentSongIndex = findVideoIndexInPlaylist(song);

    if (!currentSongIndex) return;
    
    setSong(playlist[currentSongIndex.songIndex + 1])
  };

  const prevVideo = () => {
    if (!song) return;

    const currentSongIndex = findVideoIndexInPlaylist(song);

    if (!currentSongIndex) return;
    
    setSong(playlist[currentSongIndex.songIndex - 1])
  };

  const onStateChange = (event:any) => {
    if (event.data === 1) {
      setIsPlaying(true); // Video is playing
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false); // Video paused or ended
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!playerRef.current) return;

    const progressBar = e.currentTarget;
    const clickX = e.nativeEvent.offsetX; // Get X position of click
    const barWidth = progressBar.clientWidth; // Get total width of bar
    const seekTime = (clickX / barWidth) * duration; // Convert to time

    playerRef.current.seekTo(seekTime, true); // Seek in video
  };

  useEffect(() => {
    if (playerRef.current && song) {
      console.log("Playing song:", song);
    }
  }, [song]);

  // useEffect(() => {
  //   if (!playerRef.current) return
  //   if (isPlaying === false) {
  //     playerRef.current.pauseVideo();
  //   } else if (isPlaying === true) {
  //     playerRef.current.playVideo();
  //   }
  // }, [isPlaying]);

  return (
    <div className="fixed bottom-5 left-5">
      {song && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg p-4 flex items-center justify-center">
          {/* Track Info */}
          <div className="flex items-center absolute left-5">
            <div className="relative cursor-pointer">
              {/* <img
                src="https://via.placeholder.com/50" // Replace with album art
                alt="Album Art"
                className="w-12 h-12 rounded-lg"
              /> */}
              <div className="bg-gray-900 p-4 absolute max-h-60 bottom-full overflow-y-auto mb-5 w-80">
                <Playlist></Playlist>
              </div>
              <div>
                <p className="text-sm font-semibold">{song.title}</p>
                <p className="text-xs text-gray-400">{song.artist.name}</p>
              </div>
            </div>
          </div>
  
          {/* Controls */}
          <div className="">
            <div className="w-full flex items-center gap-4">
              <button onClick={prevVideo} className="px-4 py-2 bg-gray-700 text-white rounded flex items-center gap-2 hover:bg-gray-600 transition">
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlay}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <button onClick={nextVideo} className="px-4 py-2 bg-gray-700 text-white rounded flex items-center gap-2 hover:bg-gray-600 transition">
                <SkipForward className="w-5 h-5" />
              </button>

            </div>
            
            <div className="w-full h-2 bg-gray-300 rounded mt-4 relative" onClick={handleSeek}>
              <div
                className="h-2 bg-blue-600 rounded absolute left-0 top-0"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center absolute right-5">
            <Volume2 className="w-6 h-6 text-gray-400" />
          </div>

  
          {/* Audio Element */}
          <YouTube 
            className="hidden"
            videoId={extractVideoId(song)} 
            opts={opts} 
            onReady={onPlayerReady} 
            onEnd={onEnd} 
            onStateChange={onStateChange}
            onPlay={onPlay}
          />
        </div>
      )}
    </div>
  );
};

export default Player;