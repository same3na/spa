"use client";
import { Song } from "@/api/songs";
import { usePlayer } from "@/context/PlayerContext";
import PlayingIndicator from "./PlayingIndicatorComponent";

const Playlist = () => {
  const { song, playlist, setSong, isPlaying } = usePlayer();

  return (
    <div className="w-full">
      {song && playlist.map((item:Song) => (
        <div className="flex justify-between cursor-pointer hover:bg-gray-600 transition items-center" key={item.id} onClick={() => setSong(item)}>
          {item.title} 
          {item.id === song.id && (
            <span><PlayingIndicator isPlaying={isPlaying}/></span>
          )}
        </div>
      ))}
    </div>
  )
}

export default Playlist